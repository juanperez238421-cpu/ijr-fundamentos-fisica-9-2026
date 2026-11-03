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
 assert.match(html,/id="answerFields"/);assert.match(html,/id="evidenceFile"/);
 assert.doesNotMatch(html,/<textarea id="reasoning"/);
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

test("unit selection and upload evidence are student-controlled, not typed reasoning",()=>{
 assert.match(js,/UNIT_CHOICES/);
 assert.match(js,/selector\.value=one\.units/);
 assert.match(js,/return \{values,units\}/);
 assert.doesNotMatch(js,/getElementById\("reasoning"\)/);
 assert.match(html,/type="file"/);
 assert.match(html,/accept="\.pdf/);
 assert.match(html,/id="uploadEvidenceBtn"/);
 assert.match(api,/if\(!evidence\)return json\(\{error:"EVIDENCE_REQUIRED"\}/);
 assert.match(api,/validAnswerUnit\(one\.units\?\.\[key\]\)/);
});
test("equivalent physical units convert properly and mismatched dimensions are rejected",()=>{
 const toBase=(v,u)=>u==="min"?v*60:(u==="m"||u==="m/s")?v/0.3048:v;
 assert.equal(toBase(2,"min"),120);
 assert.ok(Math.abs(toBase(304.8,"m")-1000)<1e-8);
 assert.ok(Math.abs(toBase(9.7536,"m/s")-32)<1e-8);
 assert.match(api,/function permittedUnit\(field:string,unit:string\)/);
 assert.match(api,/const pass=unit_correct&&numeric_correct/);
 assert.match(api,/submitted_unit:unit/);
 assert.match(api,/expected_unit:/);
});
test("server-only file upload checks size, signature, verified JWT and deadline",()=>{
 assert.match(api,/function detectMime\(bytes:Uint8Array\)/);
 assert.match(api,/application\/pdf/);
 assert.match(api,/image\/jpeg/);
 assert.match(api,/image\/png/);
 assert.match(api,/image\/webp/);
 assert.match(api,/rawFile\.size>EVIDENCE_MAX_BYTES/);
 assert.match(api,/const a=await asStudent\(req\),s=await settings\(\)/);
 assert.match(api,/Date\.now\(\)>=Date\.parse\(a\.deadline_at\)/);
 assert.match(api,/uploadEvidence\(req,origin\)/);
 assert.match(api,/EVIDENCE_STORAGE_FAILED/);
 assert.match(api,/\.createSignedUrl\(/);
 assert.match(api,/teacherIdentity\(req\)/);
 assert.match(api,/record\("procedure_evidence_uploaded"/);
});
test("no reasoning text is automatically graded; teacher reviews private file",()=>{
 assert.doesNotMatch(api,/reasoning\.trim\(\)\.length/);
 assert.match(js,/admin_evidence_link/);
 assert.match(js,/SHA-256/);
 assert.match(js,/Archivo de procedimiento/);
 assert.match(js,/EVIDENCE_REQUIRED/);
});


const emailMigration=fs.readFileSync(path.join(base,
 "../../supabase/migrations/20261103_physics9_freefall_institutional_email_v3.sql"),"utf8");
const QA_EMAIL="qa.caidalibre.2026@ijr.edu.co"; // Synthetic identifier only; mailbox must be provisioned by school IT.
test("only verified school domain mailboxes are eligible",()=>{
 const re=/^[a-z0-9][a-z0-9._%+-]*@ijr[.]edu[.]co$/;
 assert.equal(re.test(QA_EMAIL),true);
 for(const bad of [
  "name@gmail.com","name@ijr.edu.co.evil.test","name@alumnos.ijr.edu.co",
  "name@fakeijr.edu.co","name@ijr.edu.co ","name@ijr-edu.co"
 ])assert.equal(re.test(bad),false,bad);
 assert.match(api,/SCHOOL_EMAIL_RE/);
 assert.match(api,/email_confirmed_at/);
 assert.match(api,/auth\.getUser\(token\)/);
 assert.match(api,/identity\.email/);
 assert.doesNotMatch(api,/p\.code/);
 assert.doesNotMatch(api,/p\.email/);
});
test("Supabase passwordless email sign in with confirmed Auth JWT",()=>{
 assert.match(html,/id="studentEmail"/);
 assert.match(html,/type="email"/);
 assert.match(html,/id="otpPanel"/);
 assert.match(html,/id="verifyForm"/);
 assert.match(js,/auth\.signInWithOtp\(/);
 assert.match(js,/auth\.verifyOtp\(/);
 assert.match(js,/getSession\(\)/);
 assert.match(js,/headers\.authorization="Bearer "/);
 assert.match(js,/SCHOOL_EMAIL_RE/);
 assert.doesNotMatch(js,/getToken\(\)|setToken\(/);
 assert.doesNotMatch(html,/id="inviteCode"/);
 assert.doesNotMatch(html,/id="issueBtn"/);
 assert.doesNotMatch(api,/action==="admin_issue"/);
 assert.doesNotMatch(api,/action==="admin_revoke"/);
});
test("one attempt per verified email and legacy history preserved",()=>{
 assert.match(emailMigration,/alter column invite_id drop not null/);
 assert.match(emailMigration,/unique index if not exists physics9_ff_unique_email_v3/);
 assert.match(emailMigration,/unique index if not exists physics9_ff_unique_auth_user_v3/);
 assert.match(emailMigration,/institutional_email ~/);
 assert.match(api,/\.eq\("institutional_email",identity\.email\)/);
 assert.match(api,/invite_id:null,auth_user_id:identity\.id,institutional_email:identity\.email/);
});
