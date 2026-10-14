import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright-core";

const html=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8")
  .replace("__SUPABASE_URL__","https://fixture.supabase.co")
  .replace("__SUPABASE_PUBLISHABLE_KEY__","fixture-public-key");
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",args:["--disable-background-networking"]});
const context=await browser.newContext({viewport:{width:412,height:915}});
const page=await context.newPage();
const errors=[],requests=[];
const fixtureDirectory=fs.mkdtempSync(path.join(os.tmpdir(),"corazon-browser-"));
const video=Buffer.from(fs.readFileSync(new URL("fixtures/video-with-audio.mp4.b64",import.meta.url),"utf8"),"base64");
page.on("pageerror",error=>errors.push(error.message));
let mode="text",failMedia=false;
const plans={
  text:{action:"text",message:"Dios va adelante.",prompt:"",narration:"",required_features:["text"]},
  voice:{action:"voice",message:"Una voz cálida",prompt:"",narration:"Dios va adelante.",required_features:["voice"]},
  image:{action:"image",message:"Un amanecer",prompt:"Un amanecer tranquilo",narration:"",required_features:["image"]},
  video:{action:"video",message:"Un video",prompt:"Un amanecer tranquilo",narration:"Dios va adelante.",required_features:["video","voice"]},
};
const wav=Buffer.alloc(44+8000);
wav.write("RIFF");wav.writeUInt32LE(wav.length-8,4);wav.write("WAVEfmt ",8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(8000,28);wav.writeUInt16LE(1,32);wav.writeUInt16LE(8,34);wav.write("data",36);wav.writeUInt32LE(8000,40);wav.fill(128,44);
await page.route("**/*",async route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.hostname!=="fixture.supabase.co")return route.abort();
  if(url.pathname==="/studio")return route.fulfill({body:html,contentType:"text/html"});
  const body=req.postDataJSON();requests.push({path:url.pathname,body});
  if(url.pathname==="/auth/v1/otp")return route.fulfill({json:{}});
  if(url.pathname==="/auth/v1/verify"){
    assert.equal(body.email,"fixture@example.invalid");assert.equal(body.token,"12345678");
    return route.fulfill({json:{access_token:"fixture-token",refresh_token:"fixture-refresh",expires_in:3600}});
  }
  if(url.pathname.endsWith("/chat"))return route.fulfill({json:{reply:plans[mode].message,plan:plans[mode],credits_remaining:4}});
  if(url.pathname.endsWith("/tts")){
    if(failMedia)return route.abort("failed");
    assert.equal(body.text,"Dios va adelante.");
    return route.fulfill({json:{audio_url:"https://fixture.supabase.co/media/audio.wav",credits_remaining:3}});
  }
  if(url.pathname==="/media/audio.wav")return route.fulfill({body:wav,contentType:"audio/wav"});
  if(url.pathname.endsWith("/image"))return route.fulfill({json:{image_url:"https://fixture.supabase.co/media/image.png",credits_remaining:3}});
  if(url.pathname.endsWith("/video-start"))return route.fulfill({json:{job_id:"fixture-video",status:"queued",credits_remaining:3}});
  if(url.pathname.endsWith("/video-status"))return route.fulfill({json:{status:"completed",video_url:"https://fixture.supabase.co/media/video.mp4",has_audio:true}});
  if(url.pathname==="/media/video.mp4")return route.fulfill({body:video,contentType:"video/mp4"});
  if(url.pathname==="/media/image.png")return route.fulfill({body:Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jf/QAAAAASUVORK5CYII=","base64"),contentType:"image/png"});
  throw new Error("Unexpected fixture request: "+url.pathname);
});
try{
  await page.goto("https://fixture.supabase.co/studio");
  await page.locator("#ideaInput").fill("Escribe un mensaje inspirador");
  await page.locator("#createButton").click();
  await page.locator("#authDialog").waitFor({state:"visible"});
  await page.keyboard.press("Escape");
  await page.waitForFunction(()=>!document.querySelector("#createButton").disabled);
  assert.equal(requests.filter(r=>r.path.includes("/auth/")).length,0,"Cancellation must not send a verification request");

  await page.locator("#createButton").click();
  await page.locator("#authEmail").fill("fixture@example.invalid");
  await page.locator("#authSubmit").click();
  await page.locator("#authCode").waitFor({state:"visible"});
  await page.locator("#authCode").fill("1234 5678");
  assert.equal(await page.locator("#authCode").inputValue(),"12345678");
  await page.locator("#authSubmit").click();
  await page.waitForFunction(()=>document.querySelector("#resultContent").textContent.includes("Dios va adelante."));
  assert.equal(requests.filter(r=>r.path.endsWith("/chat")).length,1);

  mode="voice";
  await page.locator("#ideaInput").fill("Crea una voz inspiradora");await page.locator("#createButton").click();
  await page.locator("audio").waitFor();
  await page.waitForFunction(()=>document.querySelector("audio")?.readyState>=1);
  assert.equal(await page.locator("audio").evaluate(el=>el.controls),true);

  mode="image";
  await page.locator("#ideaInput").fill("Crea una imagen inspiradora");await page.locator("#createButton").click();
  await page.locator("#resultContent img").waitFor();
  await page.waitForFunction(()=>document.querySelector("#resultContent img")?.naturalWidth>0);

  mode="video";
  await page.locator("#ideaInput").fill("Crea un video inspirador");await page.locator("#createButton").click();
  await page.locator("video").waitFor();
  await page.waitForFunction(()=>document.querySelector("video")?.readyState>=1);
  const downloadEvent=page.waitForEvent("download");
  await page.getByRole("button",{name:"Descargar",exact:true}).click();
  const download=await downloadEvent;
  assert.equal(download.suggestedFilename(),"Corazon_Studio_video.mp4");
  const savedPath=path.join(fixtureDirectory,"downloaded.mp4");await download.saveAs(savedPath);
  assert.deepEqual(fs.readFileSync(savedPath),video,"Downloaded bytes must match the generated fixture");
  assert.equal(await page.evaluate(()=>localStorage.getItem("corazon_pending_video")),null);

  mode="voice";failMedia=true;
  await page.locator("#ideaInput").fill("Crea una voz cálida");await page.locator("#createButton").click();
  await page.waitForFunction(()=>!document.querySelector("#createButton").disabled);
  const before=requests.filter(r=>r.path.endsWith("/chat")).length;
  const previous=await page.evaluate(()=>JSON.parse(localStorage.getItem("corazon_pending_brain")));
  assert.ok(previous.plan,"The successful plan survives an interrupted media call");
  failMedia=false;
  await page.getByRole("button",{name:"Recuperar solicitud",exact:true}).click();
  await page.locator("audio").waitFor();
  await page.waitForFunction(()=>!localStorage.getItem("corazon_pending_brain"));
  assert.equal(requests.filter(r=>r.path.endsWith("/chat")).length,before,"Recovery must not charge planning again");
  assert.equal(requests.filter(r=>r.path.endsWith("/tts")).at(-1).body.idempotency_key,previous.createId);
  assert.deepEqual(errors,[]);
  console.log("Mobile browser acceptance passed: cancellation, spaced eight-digit fixture code, text, audio, image, video, exact-byte download and recovery. Every request intercepted; no real account or provider used.");
}finally{await browser.close();fs.rmSync(fixtureDirectory,{recursive:true,force:true})}
