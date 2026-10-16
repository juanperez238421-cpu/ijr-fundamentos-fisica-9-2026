"use strict";
const { test }=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const read=f=>fs.readFileSync(path.join(__dirname,f),"utf8");
const html=read("index.html"),js=read("app.js"),css=read("physics.css"),calc=read("calculator.js"),api=fs.readFileSync(path.join(__dirname,"../../supabase/functions/physics9-position-individual/index.ts"),"utf8");
const m=JSON.parse(read("manifest.json"));
test("four progressively structured physics questions",()=>{
 assert.equal(m.course,"Fundamentos de Física 9°");
 assert.equal(m.restricted_to_one_student,true);
 assert.equal(m.public_exam_enabled,false);
 assert.equal(m.problems.length,4);
 assert.deepEqual(m.problems.map(x=>x.id),["P01","P02","P03","P04"]);
 for(const q of m.problems){
  assert(q.statement.length>100&&q.hint.length>20&&q.prompt.includes("Velocidad media"));
  assert(/^assets\/p0[1-4]-.+\.svg$/.test(q.diagram));
  const svg=read(q.diagram);
  assert(svg.includes('viewBox="160 55 800 555"'));
  assert(svg.includes('polyline points='));
  assert(svg.includes('Posición, x (m)'));
  assert(svg.includes('Tiempo, t (s)'));
  assert(!/correct_answer|secret|answer_key|password/i.test(JSON.stringify(q)));
 }
});
test("visual style adapted from Canada and original institute logo",()=>{
 assert(html.includes('id="welcomeView"')&&html.includes('id="examView"'));
 assert(html.includes('id="calculatorPanel"')&&html.includes('id="incidentModal"'));
 assert(html.includes('id="problemNavigation"'));
 assert(html.includes('class="exam-layout"'));
 assert(html.includes('assets/escudo-institucional-original.svg'));
 assert(read("assets/escudo-institucional-original.svg").includes("data:image/webp;base64,"));
 assert(css.includes("grid-template-areas")&&css.includes("@media(max-width:580px)"));
 assert.equal((html.match(/data-problem="[0-3]"/g)||[]).length,4);
});
test("DOM IDs and script syntax",()=>{
 new Function(js);
 new Function(calc);
 const refs=[...js.matchAll(/\$\("([A-Za-z0-9]+)"\)/g)].map(r=>r[1]);
 const missing=refs.filter(id=>id!=="runtimeNotice"&&!html.includes('id="'+id+'"'));
 assert.deepEqual(missing,[]);
});
test("individual protected registration and persistence",()=>{
 for(const id of ["studentName","studentEmail","studentGroup","studentAgree","previewStart","areaValue","reasoning","finishButton","receipt"])assert(html.includes('id="'+id+'"'));
 assert(!html.includes('id="studentPin"'));
 assert(!html.includes("Código individual de acceso"));
 assert(js.includes('if(!authorized)'));
 assert(js.includes("student_name,student_email,student_group,agreed:true"));
 assert(!js.includes("access_code"));
 assert(!api.includes("p.access_code"));
 assert(js.includes('sessionStorage'));
 assert(js.includes('"start"')&&js.includes('"answer"')&&js.includes('"submit"'));
 assert(api.includes('const SETTINGS = "physics9_motion_single_access_v1"'));
 assert(api.includes('config.allowed_email!==student_email'));
 assert(!api.includes('access_code_sha256'));
 assert(api.includes('currentAccess.allowed_email!==row.student_email'));
 assert(api.includes('ACCESS_REVOKED'));
 assert(api.includes('config.enabled'));
 assert(api.includes('"SESSION_REQUIRED"'));
 assert(api.includes('ALREADY_SUBMITTED'));
 assert(api.includes('INCOMPLETE_ANSWERS'));
 assert(!api.includes('const serviceRoleKey = "eyJ'));
});
test("negative velocity supported by browser, server and calculator",()=>{
 assert(js.includes('positiveOrNegativeNumber'));
 assert(api.includes('const complete='));
 assert(!calc.includes("result < 0"));
 assert(calc.includes('transferEl.disabled = false'));
 const core=require("./calculator-core.js");
 assert.equal(core.evaluate("(3-9)/(6-3)"),-2);
 assert.equal(core.evaluate("(-4-8)/(9-5)"),-3);
 assert.equal(core.evaluate("(-6-(-4))/10"),-0.2);
});
test("no tab or fullscreen penalties; cutoff is server enforced",()=>{
 assert(!js.includes('document.addEventListener("visibilitychange"'));
 assert(!js.includes('document.addEventListener("fullscreenchange"'));
 assert(!js.includes('window.addEventListener("blur"'));
 assert(!js.includes('await incident("recarga'));
 assert(!js.includes('const isFullscreen=await fullscreen()'));
 assert(!js.includes('id="strikeDots"'));
 assert(!html.includes('id="strikeDots"'));
 assert(api.includes('if(p.action==="incident")return response({strikes:row.strikes,state:row.state,ignored:true}'));
 assert(!api.includes('Math.min(3'));
 assert(api.includes('2026-10-16T17:00:00.000Z'));
 assert(api.includes('timezone:\'America/Bogota\''));
 assert(api.includes('if(p.action==="submit"){'));
 assert(api.includes('if(!openUntilNoon())return response({error:"ASSESSMENT_CLOSED"},403,origin)'));
 assert(api.includes('if(p.action==="answer"){'));
 assert(html.includes('12:00 del mediodía'));
 assert(js.includes('authorized=cfg.enabled===true&&cfg.open!==false'));
});

test("primary student access survives enabling a distinct QA email",()=>{
 assert(api.includes('config.allowed_email!==student_email&&config.additional_allowed_email!==student_email'));
 assert(api.includes('(currentAccess.allowed_email!==row.student_email&&currentAccess.additional_allowed_email!==row.student_email)'));
 assert.equal((api.split('select("enabled,allowed_email,additional_allowed_email")').length-1),2);
 assert((api.match(/additional_allowed_email/g)||[]).length>=4);
 assert(!api.includes("qa.fisica9.2026@ijr.edu.co"));
 assert(!api.includes("tomas.hernandez@ijr.edu.co"));
});

test("QA short name can reuse the existing independent QA attempt",()=>{
 assert(js.includes('student_name==="QA"'));
 assert(api.includes('v.trim().length>=2'));
 assert(api.includes('student_email!==config.additional_allowed_email'));
 assert(api.includes('existing.student_group!==student_group'));
});
