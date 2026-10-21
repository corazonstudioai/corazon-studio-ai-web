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
let mode="text",failMedia=false,silentPolls=0,missingCreation=false;
const completed=new Map();
const userId="11111111-1111-4111-8111-111111111111";
const videoId="22222222-2222-4222-8222-222222222222",silentId="33333333-3333-4333-8333-333333333333";
const silentVideo=Buffer.from(fs.readFileSync(new URL("fixtures/video-silent-vertical.mp4.b64",import.meta.url),"utf8"),"base64");
assert.equal(silentVideo.includes(Buffer.from("soun")),false);
const plans={
  text:{action:"text",message:"Dios va adelante.",prompt:"",narration:"",required_features:["text"]},
  voice:{action:"voice",message:"Una voz cálida",prompt:"",narration:"Dios va adelante.",required_features:["voice"]},
  image:{action:"image",message:"Un amanecer",prompt:"Un amanecer tranquilo",narration:"",required_features:["image"]},
  video:{action:"video",message:"Un video",prompt:"Un amanecer tranquilo",narration:"Dios va adelante.",required_features:["video","voice"]},
};
plans.silent={...plans.video,narration:"",required_features:["video"],audio_mode:"silent",aspect_ratio:"9:16"};
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
    return route.fulfill({json:{access_token:"fixture-token",refresh_token:"fixture-refresh",expires_in:3600,user:{id:userId}}});
  }
  if(url.pathname.endsWith("/creation")){
    const saved=completed.get(body.id);
    return route.fulfill({status:missingCreation||!saved?404:200,json:missingCreation||!saved?{code:"creation_not_found"}:saved});
  }
  if(url.pathname.endsWith("/chat")){
    completed.set(body.idempotency_key,{mode:"text",data:{reply:plans[mode].message}});
    return route.fulfill({json:{reply:plans[mode].message,plan:plans[mode],credits_remaining:4}});
  }
  if(url.pathname.endsWith("/tts")){
    if(failMedia)return route.abort("failed");
    assert.equal(body.text,"Dios va adelante.");
    completed.set(body.idempotency_key,{mode:"voice",data:{audio_url:"https://fixture.supabase.co/media/audio.wav"}});
    return route.fulfill({json:{audio_url:"https://fixture.supabase.co/media/audio.wav",credits_remaining:3}});
  }
  if(url.pathname==="/media/audio.wav")return route.fulfill({body:wav,contentType:"audio/wav"});
  if(url.pathname.endsWith("/image")){
    completed.set(body.idempotency_key,{mode:"image",data:{image_url:"https://fixture.supabase.co/media/image.png"}});
    return route.fulfill({json:{image_url:"https://fixture.supabase.co/media/image.png",credits_remaining:3}});
  }
  if(url.pathname.endsWith("/video-start")){
    if(mode==="silent"){assert.equal(body.audio_mode,"silent");assert.equal(body.narration,"");assert.equal(body.aspect_ratio,"9:16");assert.equal(body.prompt,"Un amanecer tranquilo");}
    const jobId=mode==="silent"?silentId:videoId;
    completed.set(jobId,{mode:"video",data:{video_url:mode==="silent"?"https://fixture.supabase.co/media/silent.mp4":"https://fixture.supabase.co/media/video.mp4"}});
    return route.fulfill({json:{job_id:jobId,status:"queued",credits_remaining:3}});
  }
  if(url.pathname.endsWith("/video-status")){
    if(mode==="silent"&&silentPolls++===0)return route.fulfill({json:{status:"in_progress",stage:"composing_video"}});
    return route.fulfill({json:{status:"completed",video_url:mode==="silent"?"https://fixture.supabase.co/media/silent.mp4":"https://fixture.supabase.co/media/video.mp4",has_audio:mode!=="silent"}});
  }
  if(url.pathname==="/media/silent.mp4")return route.fulfill({body:silentVideo,contentType:"video/mp4"});
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

  mode="silent";
  const speechBefore=requests.filter(r=>r.path.endsWith("/tts")).length;
  const plansBefore=requests.filter(r=>r.path.endsWith("/chat")).length;
  await page.locator('[data-mode="video"]').click();
  await page.locator("#ideaInput").fill("Crea un video sin texto ni narración");await page.locator("#createButton").click();
  await page.getByText("Preparando el video…",{exact:true}).waitFor();
  await page.locator("video").waitFor();await page.waitForFunction(()=>document.querySelector("video")?.readyState>=1);
  assert.equal(requests.filter(r=>r.path.endsWith("/chat")).length,plansBefore+1,"Selected Video must prepare content instead of speaking the command");
  assert.equal(requests.filter(r=>r.path.endsWith("/chat")).at(-1).body.preferences.mode,"video");
  assert.equal(requests.filter(r=>r.path.endsWith("/tts")).length,speechBefore);
  assert.equal(await page.locator("video").evaluate(el=>el.videoWidth/el.videoHeight),9/16);
  const silentDownload=page.waitForEvent("download");await page.getByRole("button",{name:"Descargar",exact:true}).click();
  const savedSilent=path.join(fixtureDirectory,"silent.mp4");await (await silentDownload).saveAs(savedSilent);
  assert.deepEqual(fs.readFileSync(savedSilent),silentVideo);
  await page.waitForFunction(()=>!localStorage.getItem("corazon_pending_brain"));
  await page.locator('[data-mode="auto"]').click();

  // A completed creation survives refresh and can be opened without hitting any
  // planning, generation, or video-status endpoint again.
  const generatedBefore=requests.filter(r=>/\/(chat|tts|image|video-start|video-status)$/.test(r.path)).length;
  await page.reload();await page.locator("#projectsButton").click();
  assert.equal(await page.locator(".project-item").count(),5);
  const savedProjects=await page.evaluate(()=>JSON.parse(localStorage.getItem("corazon_projects_v2")));
  assert.equal(savedProjects.every(item=>item.ownerId===userId&&item.reference.id),true);
  assert.equal(JSON.stringify(savedProjects).includes("https://"),false,"Persist references rather than expiring signed media links");
  await page.keyboard.press("Escape");
  for(const [prompt,selector] of [["Escribe un mensaje inspirador",".result-copy"],["Crea una voz inspiradora","audio"],["Crea una imagen inspiradora","img"],["Crea un video inspirador","video"],["Crea un video sin texto ni narración","video"]]){
    await page.locator("#projectsButton").click();
    await page.locator(".project-item").filter({has:page.getByText(prompt,{exact:true})}).getByRole("button").click();
    await page.locator("#resultContent "+selector).waitFor();
    await page.getByText("Creación guardada · Sin créditos adicionales",{exact:true}).waitFor();
  }
  assert.equal(requests.filter(r=>/\/(chat|tts|image|video-start|video-status)$/.test(r.path)).length,generatedBefore);
  await page.waitForFunction(()=>document.querySelector("video")?.readyState>=1);
  assert.equal(await page.locator("video").evaluate(el=>el.videoWidth/el.videoHeight),9/16);
  const reopenedDownload=page.waitForEvent("download");await page.getByRole("button",{name:"Descargar",exact:true}).click();
  const reopenedPath=path.join(fixtureDirectory,"reopened.mp4");await(await reopenedDownload).saveAs(reopenedPath);assert.deepEqual(fs.readFileSync(reopenedPath),silentVideo);

  missingCreation=true;await page.locator("#projectsButton").click();
  await page.locator(".project-item").first().getByRole("button").click();
  await page.getByText("Esta creación ya no está disponible. No se generó ni cobró otra.",{exact:true}).waitFor();
  assert.equal(await page.locator(".project-item").count(),5,"A failed opening must not erase the saved reference");
  missingCreation=false;
  await page.locator(".project-item").first().getByRole("button").click();await page.getByText("Creación guardada · Sin créditos adicionales",{exact:true}).waitFor();
  assert.equal(requests.filter(r=>/\/(chat|tts|image|video-start|video-status)$/.test(r.path)).length,generatedBefore);
  await page.evaluate(()=>{const key="corazon_supabase_session",session=JSON.parse(localStorage.getItem(key));session.user.id="44444444-4444-4444-8444-444444444444";localStorage.setItem(key,JSON.stringify(session))});
  await page.locator("#projectsButton").click();assert.equal(await page.locator(".project-item").count(),0,"A second account cannot see the first account's history");
  await page.keyboard.press("Escape");
  await page.evaluate(id=>{const key="corazon_supabase_session",session=JSON.parse(localStorage.getItem(key));session.user.id=id;localStorage.setItem(key,JSON.stringify(session))},userId);
  await page.locator("#languageButton").click();await page.locator("#projectsButton").click();
  await page.locator(".project-item").first().getByRole("button",{name:"Watch video again",exact:true}).click();
  await page.getByText("Saved creation · No additional credits",{exact:true}).waitFor();
  await page.locator("#languageButton").click();

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
  console.log("Mobile browser acceptance passed: cancellation, spaced eight-digit fixture code, text, audio, image, video, exact-byte download recovery, account-owned history after reload, reopening all media, expired-reference handling, and no-charge exact-byte re-download. Every request intercepted; no real account or provider used.");
}finally{await browser.close();fs.rmSync(fixtureDirectory,{recursive:true,force:true})}
