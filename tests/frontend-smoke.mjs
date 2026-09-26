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

console.log("Frontend smoke checks passed.");
