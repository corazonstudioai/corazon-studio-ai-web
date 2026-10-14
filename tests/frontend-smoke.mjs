import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);

assert.ok(scripts.length >= 2, "Expected inline application scripts");
scripts.forEach((source, index) => new vm.Script(source, { filename: `inline-${index + 1}.js` }));

assert.equal((html.match(/const \$ =/g) || []).length, 1, "Single selector helper must be declared once");
assert.equal((html.match(/const \$\$ =/g) || []).length, 1, "Multi selector helper must be declared once");
assert.match(html, /CorazonBrain\.speech\(text,voice,style\)/, "Speech must keep raw text separate from style instructions");
assert.doesNotMatch(html, /\(\$\{error\.message\}\)/, "Technical errors must not be shown to users");
assert.match(html, /\/functions\/v1\/\$\{path\}/, "All generation must use Supabase Edge Functions");
assert.doesNotMatch(html, /onrender\.com/, "The web app must not call the legacy Render backend");
assert.doesNotMatch(html, /workers\.dev|cloudflare|wrangler/i, "The web app must not depend on Cloudflare");
assert.match(html, /return edgeRequest\(path,/, "Text, image and voice must use Supabase Edge Functions");
assert.match(html, /edgeRequest\("video-start"/, "Video must start asynchronously");
assert.match(html, /\{prompt,narration:prompt,voice,duration:5/, "Video request must include narration and selected voice");
assert.match(html, /edgeRequest\("video-status"/, "Video status must be polled");
assert.match(html, /corazon_pending_video/, "Pending video must survive a refresh");
assert.match(html, /edgeRequestTimeoutMs: 120000/, "Edge calls must stop waiting after a bounded timeout");
assert.match(html, /videoMaxWaitMs: 600000/, "Video polling must allow generation plus audio while remaining bounded");
assert.match(html, /videoPaused/, "Interrupted video jobs must show recovery guidance");
assert.match(html, /\/auth\/v1\/otp/, "Email verification must request a one-time code");
assert.match(html, /\/auth\/v1\/verify/, "Email one-time code must be verified");
assert.match(html, /replace\(\/\\D\/g,""\)\.slice\(0,8\)/, "Pasted OTP codes must be normalized before verification");
assert.match(html, /pattern="\[0-9\]\{6,8\}"/, "OTP input must accept the configured 6 to 8 digit range");
assert.match(html, /id="authResend"/, "Users must be able to request a fresh OTP");
assert.match(html, /authErrorMessage/, "Authentication failures must provide actionable guidance");
assert.doesNotMatch(html, /fal[_-]?key/i, "Provider secret names must not appear in the web app");
assert.doesNotMatch(html, /reels-voice/, "Video must no longer call the Render route");

console.log("Frontend smoke checks passed.");

assert.match(html, /Agregando voz al video/, "Video progress must explain the audio stage");

assert.match(html, /VideoGenerationError/, "Permanent video failures must not be shown as connection pauses");
assert.match(html, /renderVideoFailure/, "Permanent video failures must explain the refund");


// Execute the actual Brain code, rather than mirroring routing rules in tests.
const brainScript = scripts.find(source => source.includes("window.CorazonBrain ="));
const brainContext = { window: {} };
vm.runInNewContext(brainScript, brainContext);
const brain = brainContext.window.CorazonBrain;
for (const [prompt, expected] of [
  ["Escribe un guion para un video de mi negocio", "text"],
  ["Create a script for an inspiring reel", "text"],
  ["Necesito un guion para video", "text"],
  ["Crea un video con este guion", "video"],
  ["Crea una imagen con texto para mi negocio", "image"],
  ["Quiero un afiche de mi tienda", "image"],
  ["Crea una narración sobre la esperanza", "voice"],
  ["Create a video with a warm voice", "video"],
  ["Traduce esta narración al inglés", "text"],
  ["Necesito promocionar mi negocio", "text"],
]) assert.equal(brain.route(prompt), expected, prompt);
assert.equal(brain.route("Escribe un guion", "video"), "video", "Explicit choice takes priority");
const speech = brain.speech("  Dios va adelante.  ", "male", "warm");
assert.equal(speech.text, "Dios va adelante.");
assert.equal(speech.voice, "onyx");
assert.ok(speech.instructions.includes("warmth"));
assert.equal(brain.speech("Hello", "female", "auto").voice, "nova");
assert.equal(brain.speech("Hello", "female", "auto").instructions, undefined);
assert.doesNotMatch(html, /La solicitud anterior venció y fue cerrada/, "Browser age alone cannot assert server expiry or refund");
console.log("Brain routing and speech behavior checks passed.");

// Exercise authentication cancellation against the real application functions.
const elements = new Map();
function element(selector) {
  if (!elements.has(selector)) elements.set(selector, {
    value: "", hidden: false, disabled: false, required: false, textContent: "",
    listeners: {}, classList: { toggle() {} },
    addEventListener(name, handler) { this.listeners[name] = handler; },
    setAttribute() {}, showModal() {}, close() {}, focus() {},
  });
  return elements.get(selector);
}
const storage = new Map();
const appContext = {
  window: { CorazonBrain: brain },
  localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
  document: { querySelector: element, querySelectorAll: () => [], addEventListener() {}, body: { style: {} } },
};
const appScript = scripts.find(source => source.includes("const state ="));
vm.runInNewContext(appScript.replace("translate();resumePendingVideo();", "window.__test={state,requireSession,payloadFor,readLocal};"), appContext);
const app = appContext.window.__test;
element("#voice").value = "male";
element("#style").value = "warm";
assert.equal(app.payloadFor("Dios va adelante.", "voice").payload.text, "Dios va adelante.");
assert.equal(app.payloadFor("Dios va adelante.", "voice").payload.voice, "onyx");
storage.set("corazon_projects_v2", "broken-json");
assert.equal(app.readLocal("corazon_projects_v2", "fallback"), "fallback");
for (const event of ["cancel", "close"]) {
  const authPromise = app.requireSession();
  const rejected = assert.rejects(authPromise, error => error.name === "AuthenticationCancelled");
  await Promise.resolve();
  element("#authDialog").listeners[event]();
  await rejected;
  assert.equal(app.state.authResolve, null, "Closing auth settles the pending creation");
}
console.log("Interface payload and authentication cancellation checks passed.");
