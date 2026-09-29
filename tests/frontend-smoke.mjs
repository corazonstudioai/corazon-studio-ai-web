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
assert.match(html, /\/functions\/v1\/\$\{path\}/, "Video must use Supabase Edge Functions");
assert.match(html, /edgeRequest\("video-start"/, "Video must start asynchronously");
assert.match(html, /edgeRequest\("video-status"/, "Video status must be polled");
assert.match(html, /corazon_pending_video/, "Pending video must survive a refresh");
assert.match(html, /\/auth\/v1\/otp/, "Email verification must request a one-time code");
assert.match(html, /\/auth\/v1\/verify/, "Email one-time code must be verified");
assert.doesNotMatch(html, /fal[_-]?key/i, "Provider secret names must not appear in the web app");
assert.doesNotMatch(html, /reels-voice/, "Video must no longer call the Render route");

console.log("Frontend smoke checks passed.");
