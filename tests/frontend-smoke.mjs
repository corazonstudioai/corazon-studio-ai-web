import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);

assert.ok(scripts.length >= 2, "Expected inline application scripts");
scripts.forEach((source, index) => new vm.Script(source, { filename: `inline-${index + 1}.js` }));

assert.equal((html.match(/const \$ =/g) || []).length, 1, "Single selector helper must be declared once");
assert.equal((html.match(/const \$\$ =/g) || []).length, 1, "Multi selector helper must be declared once");
assert.match(html, /voice:voice==="male"\?"onyx":"nova"/, "Voice request must match backend schema");
assert.doesNotMatch(html, /\(\$\{error\.message\}\)/, "Technical errors must not be shown to users");
assert.match(html, /\/functions\/v1\/\$\{path\}/, "All generation must use Supabase Edge Functions");
assert.doesNotMatch(html, /onrender\.com/, "The web app must not call the legacy Render backend");
assert.doesNotMatch(html, /workers\.dev|cloudflare|wrangler/i, "The web app must not depend on Cloudflare");
assert.match(html, /return edgeRequest\(path,/, "Text, image and voice must use Supabase Edge Functions");
assert.match(html, /edgeRequest\("video-start"/, "Video must start asynchronously");
assert.match(html, /edgeRequest\("video-status"/, "Video status must be polled");
assert.match(html, /corazon_pending_video/, "Pending video must survive a refresh");
assert.match(html, /edgeRequestTimeoutMs: 120000/, "Edge calls must stop waiting after a bounded timeout");
assert.match(html, /videoMaxWaitMs: 180000/, "Video polling must not leave the UI waiting indefinitely");
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
