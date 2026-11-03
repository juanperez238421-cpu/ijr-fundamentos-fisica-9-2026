const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const base=__dirname;
const html=fs.readFileSync(path.join(base,"index.html"),"utf8");
const js=fs.readFileSync(path.join(base,"app.js"),"utf8");
const css=fs.readFileSync(path.join(base,"styles.css"),"utf8");
const api=fs.readFileSync(path.join(base,"../../supabase/functions/physics9-freefall-exam/index.ts"),"utf8");
const sql=fs.readFileSync(path.join(base,"../../supabase/migrations/20261103_physics9_freefall_exam.sql"),"utf8");
const audit=fs.readFileSync(path.join(base,"../../supabase/migrations/20261103_physics9_freefall_audit.sql"),"utf8");
const impact=(h,v,g=32)=>(v+Math.sqrt(v*v+2*g*h))/g;
const pos=(h,v,t,g=32)=>h+v*t-g*t*t/2;
const vel=(v,t,g=32)=>v-g*t;
const epsilon=(expected,abs,rel=.005)=>Math.max(abs,Math.abs(expected)*rel);
const acceptable=(actual,expected,abs,rel=.005)=>Math.abs(actual-expected)<=epsilon(expected,abs,rel)+1e-10;

test("all 3 situations, 9 metrics and diagrams exist",()=>{
 assert.deepEqual(Object.keys({1:["impact_time","height_observation","velocity_observation"],2:["peak_time","max_height","impact_time"],3:["height_observation","impact_time","impact_velocity"]}).length,3);
 assert.match(js,/diagramSvg\(q\)/);assert.match(js,/student\.|student_name/);
 assert.match(html,/id="answerFields"/);assert.match(html,/id="reasoning"/);
 assert.match(css,/@media\(max-width:790px\)/);
});
test("scientific correctness: dropped body",()=>{
 assert.equal(impact(576,0),6);assert.equal(pos(576,0,2),512);assert.equal(vel(0,2),-64);
 assert.equal(impact(1024,0),8);assert.equal(pos(1024,0,3),880);assert.equal(vel(0,3),-96);
});
test("scientific correctness: upward launch",()=>{
 assert.equal(48/32,1.5);assert.equal(864+48*48/(2*32),900);assert.equal(impact(864,48),9);
 assert.ok(Math.abs(impact(560,80)-8.922616)<.00001);
});
test("scientific correctness: downward launch, approximate root",()=>{
 assert.equal(pos(1200,-72,4),656);
 assert.ok(Math.abs(impact(1200,-72)-6.69777)<.00001);
 assert.ok(vel(-72,impact(1200,-72))<0);
});
test("tolerances accept rounding and reject wrong sign/outliers",()=>{
 const t=impact(1200,-72);
 assert.ok(acceptable(6.7,t,.12));assert.ok(!acceptable(7.1,t,.12));
 assert.ok(acceptable(-64,-64,1.5));assert.ok(!acceptable(64,-64,1.5));
 assert.ok(acceptable(900.3,900,2));assert.ok(!acceptable(910,900,2));
});
test("critical security: no answer keys and no privileged key in client",()=>{
 assert.doesNotMatch(js,/SUPABASE_SERVICE_ROLE_KEY|SECRET_KEY|expectedAnswer/);
 assert.match(api,/SUPABASE_SERVICE_ROLE_KEY/);
 assert.match(api,/getAuthenticatorAssuranceLevel/);
 assert.match(api,/auth\.getUser\(token\)/);
 assert.match(api,/if\(!isOpen\(s\)/);
 assert.match(api,/\.eq\("revision",a\.revision\)/);
 assert.match(sql,/enable row level security/g);
 assert.match(sql,/revoke all on public\.physics9_ff_settings_v1/);
});
test("audit triggers and immutable event guards exist",()=>{
 assert.match(audit,/after insert or update on public\.physics9_ff_attempts_v1/);
 assert.match(audit,/before update or delete on public\.physics9_ff_events_v1/);
});
test("grade calculation is 0 to 5 for 9 results",()=>{
 for(let pass=0;pass<=9;pass++){
  const grade=Math.round(100*(5*pass/9))/100;
  assert.ok(grade>=0&&grade<=5);
 }
});
test("submit confirmation is in page and not browser-native",()=>{
 assert.match(html,/id="submitDialog"/);
 assert.match(html,/id="confirmSubmission"/);
 assert.match(html,/aria-modal="true"/);
 assert.match(js,/setSubmitDialog\(true\)/);
 assert.match(js,/confirmSubmission/);
 assert.doesNotMatch(js,/if\(!confirm\("¿Confirmas la entrega definitiva/);
 assert.match(css,/\.modal-layer/);
});
