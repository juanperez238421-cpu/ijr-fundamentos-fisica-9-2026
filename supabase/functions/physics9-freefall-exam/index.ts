import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const ANON = Deno.env.get("SUPABASE_ANON_KEY") || "";
const ORIGIN = "https://juanperez238421-cpu.github.io";
const TEST_ORIGINS = new Set([ORIGIN, "http://localhost:8000", "http://127.0.0.1:8000"]);
const EXAM = "freefall-9-2026";
const EVIDENCE_BUCKET = "physics9-freefall-procedures";
const EVIDENCE_MAX_BYTES = 5242880;
const db = createClient(URL, SERVICE, {auth:{persistSession:false,autoRefreshToken:false}});
const enc = new TextEncoder();
const json = (data:unknown,status=200,origin:string|null=null) => new Response(JSON.stringify(data),{status,headers:{
 "Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","Vary":"Origin",
 "Access-Control-Allow-Origin":origin && TEST_ORIGINS.has(origin) ? origin : "null",
 "Access-Control-Allow-Headers":"content-type,authorization,apikey,x-client-info",
 "Access-Control-Allow-Methods":"POST, OPTIONS"
}});
const sha = async (s:string) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",enc.encode(s))),b=>b.toString(16).padStart(2,"0")).join("");
const randHex = (bytes=32) => Array.from(crypto.getRandomValues(new Uint8Array(bytes)),b=>b.toString(16).padStart(2,"0")).join("");
const SCHOOL_EMAIL_RE=/^[a-z0-9][a-z0-9._%+-]*@ijr[.]edu[.]co$/;
type StudentIdentity={id:string;email:string};
async function studentIdentity(req:Request):Promise<StudentIdentity|null> {
 const authorization=req.headers.get("authorization")||"";
 if(!/^Bearer\s+[a-zA-Z0-9._-]+$/.test(authorization))return null;
 const token=authorization.replace(/^Bearer\s+/,"");
 const userClient=createClient(URL,ANON,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await userClient.auth.getUser(token);
 const user=data?.user,email=String(user?.email||"").trim().toLowerCase();
 if(error||!user?.id||!SCHOOL_EMAIL_RE.test(email))return null;
 if!user.email_confirmed_atreturn null;
 return{id:user.id,email};
}
const validUuid=(x:unknown)=>typeof x==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x);
const nstr=(x:unknown)=>typeof x==="string"&&x.length<=40&&/^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(x.trim())&&Number.isFinite(Number(x.replace(",",".")))?Number(x.replace(",",".")):null;
const numeric=(x:unknown)=>typeof x==="number"&&Number.isFinite(x)?x:null;
const round2=(x:number)=>Math.round((x+Number.EPSILON)*100)/100;
const TYPE_BY_FIELD:Record<string,string>={impact_time:"time",peak_time:"time",height_observation:"height",max_height:"height",velocity_observation:"velocity",impact_velocity:"velocity"};
const FIELDS:Record<number,string[]>={1:["impact_time","height_observation","velocity_observation"],2:["peak_time","max_height","impact_time"],3:["height_observation","impact_time","impact_velocity"]};
type Row=Record<string,any>;
const UNIT_KIND:Record<string,string>={"s":"time","min":"time","ft":"height","m":"height","ft/s":"velocity","m/s":"velocity"};
const ALL_UNITS=new Set(Object.keys(UNIT_KIND));
function toBaseUnits(value:number,unit:string):number{
 switch(unit){case "min":return value*60;case "m":case "m/s":return value/0.3048;default:return value;}
}
function validAnswerUnit(value:unknown):value is string {return typeof value==="string"&&ALL_UNITS.has(value);}
function permittedUnit(field:string,unit:string):boolean{return UNIT_KIND[unit]===TYPE_BY_FIELD[field];}
const evidencePublic=(e:Row|null)=>e?{name:e.original_name,size:Number(e.size_bytes),mime_type:e.mime_type,uploaded_at:e.uploaded_at,sha256:e.sha256_hex}:null;

function exactAnswer(q:Row,field:string):number {
 const h=Number(q.height_ft),v=Number(q.velocity_fts),g=Number(q.gravity_fts2),t=Number(q.observation_s);
 const impact=(v+Math.sqrt(v*v+2*g*h))/g;
 switch(field){
 case "impact_time":return impact;
 case "peak_time":return v/g;
 case "height_observation":return h+v*t-0.5*g*t*t;
 case "max_height":return h+v*v/(2*g);
 case "velocity_observation":return v-g*t;
 case "impact_velocity":return v-g*impact;
 default:throw Error("Invalid metric");
 }
}
function tolerance(expected:number,field:string,s:Row):number {
 const kind=TYPE_BY_FIELD[field];
 const absolute=Number(s[kind==="time"?"absolute_time":kind==="height"?"absolute_height":"absolute_velocity"]);
 return Math.max(absolute,Math.abs(expected)*Number(s.relative_tolerance));
}
function publicQuestion(q:Row):Row {
 const num=Number(q.question_number),h=Number(q.height_ft),v=Number(q.velocity_fts),g=Number(q.gravity_fts2),t=Number(q.observation_s);
 const intro=num===1?
  "A ball is released from rest at the top of "+q.title.toLowerCase()+", "+h+" ft above the ground.":
  num===2?"A small ball is launched vertically UPWARD at "+Math.abs(v)+" ft/s from "+h+" ft above the ground ("+q.title.toLowerCase()+").":
  "A small device is launched vertically DOWNWARD at "+Math.abs(v)+" ft/s from a balloon "+h+" ft above a flat landing field ("+q.title.toLowerCase()+").";
 const labels:Record<string,string>={
  impact_time:"Time until ground impact",
  peak_time:"Time to reach the highest point",
  max_height:"Maximum height above the ground",
  height_observation:"Height after "+t+" seconds",
  velocity_observation:"Vertical velocity after "+t+" seconds (signed)",
  impact_velocity:"Vertical velocity at ground impact (signed)"
 };
 return {id:q.id,number:num,title:q.title,scenario:q.situation,statement:intro+" Neglect air resistance and use g = "+g+" ft/s².",initial_height:h,initial_velocity:v,g,observation_time:t,
  fields:FIELDS[num].map(id=>({id,label:labels[id],unit:TYPE_BY_FIELD[id]==="time"?"s":TYPE_BY_FIELD[id]==="height"?"ft":"ft/s"}))};
}
async function settings():Promise<Row> {
 const {data,error}=await db.from("physics9_ff_settings_v1").select("*").eq("id",EXAM).single();
 if(error||!data)throw Error("SETTINGS_UNAVAILABLE");
 return data;
}
function isOpen(s:Row):boolean {
 const now=Date.now();
 return s.enabled===true && (!s.opens_at||now>=Date.parse(s.opens_at)) && (!s.closes_at||now<Date.parse(s.closes_at));
}
async function questions(ids:string[]):Promise<Row[]>{
 const {data,error}=await db.from("physics9_ff_variants_v1").select("*").in("id",ids).eq("enabled",true);
 if(error||!data||data.length!==3)throw Error("QUESTIONS_UNAVAILABLE");
 return ids.map(id=>{const q=data.find(x=>x.id===id);if(!q)throw Error("VARIANT_MISSING");return q;});
}
async function asStudent(req:Request):Promise<Row|null>{
 const identity=await studentIdentity(req);
 if(!identity)return null;
 const {data,error}=await db.from("physics9_ff_attempts_v1").select("*")
  .eq("auth_user_id",identity.id).eq("institutional_email",identity.email).maybeSingle();
 if(error)throw Error("ATTEMPT_LOOKUP_FAILED");
 if(!data)return null;
 return {...data,student_name:identity.email,group_code:"Institucional"};
}
async function studentView(a:Row,s:Row,session:string|null=null){
 const qs=await questions(a.variant_ids);
 const {data:evidence,error:evidenceErr}=await db.from("physics9_ff_evidence_v1")
  .select("original_name,size_bytes,mime_type,uploaded_at,sha256_hex")
  .eq("attempt_id",a.id).maybeSingle();
 if(evidenceErr)throw Error("EVIDENCE_LOOKUP_FAILED");
 const out:Row={attempt_id:a.id,student_name:a.student_name,group:a.group_code,state:a.state,answers:a.answers,revision:a.revision,started_at:a.started_at,deadline_at:a.deadline_at,
  closed:Date.now()>=Date.parse(a.deadline_at)||!isOpen(s),evidence:evidencePublic(evidence),questions:qs.map(publicQuestion),
  submitted_at:a.submitted_at,receipt:a.state==="submitted"?a.id:null};
 if(s.show_final_score&&a.final_score!==null)out.final_score=Number(a.final_score);
 if(session)out.session_token=session;
 return out;
}
async function teacherIdentity(req:Request):Promise<string|null>{
 const header=req.headers.get("authorization")||"";
 if(!/^Bearer [A-Za-z0-9._-]+$/.test(header))return null;
 const token=header.slice(7);
 const auth=createClient(URL,ANON,{auth:{persistSession:false,autoRefreshToken:false},global:{headers:{Authorization:header}}});
 const {data:user,error:e}=await auth.auth.getUser(token);
 if(e||!user?.user?.id)return null;
 const {data:aal,error:ae}=await auth.auth.mfa.getAuthenticatorAssuranceLevel(token);
 if(ae||aal?.currentLevel!=="aal2")return null;
 const {data:profile,error:pe}=await db.from("profiles").select("role,active").eq("auth_user_id",user.user.id).eq("active",true).in("role",["teacher","admin"]).maybeSingle();
 return pe||!profile?null:user.user.id;
}
async function record(type:string,actor:string,attemptId:string|null,detail:Row={}){
 const {error}=await db.from("physics9_ff_events_v1").insert({attempt_id:attemptId,actor,event_type:type,details:detail});
 if(error)throw Error("AUDIT_WRITE_FAILED");
}
async function handleStudent(p:Row,req:Request,origin:string|null){
 const action=p.action,s=await settings();
 if(action==="config")return json({enabled:s.enabled,open:isOpen(s),opens_at:s.opens_at,closes_at:s.closes_at,duration_minutes:s.duration_minutes,question_count:3,auth_mode:"institutional_email"},200,origin);
 if(action==="start"){
  const identity=await studentIdentity(req);
  if(!identity)return json({error:"INSTITUTIONAL_EMAIL_REQUIRED"},401,origin);
  const {data:old,error:readError}=await db.from("physics9_ff_attempts_v1")
   .select("*").eq("institutional_email",identity.email).maybeSingle();
  if(readError)throw Error("ATTEMPT_LOOKUP_FAILED");
  if(old){
   if(old.auth_user_id!==identity.id)
    return json({error:"IDENTITY_CONFLICT_CONTACT_TEACHER"},403,origin);
   return json(await studentView({...old,student_name:identity.email,group_code:"Institucional"},s),200,origin);
  }
  if(!isOpen(s))return json({error:"EXAM_NOT_OPEN"},403,origin);
  const variant_ids=[1,2,3].map(n=>"P"+n+"V"+(crypto.getRandomValues(new Uint8Array(1))[0]%3+1));
  const now=Date.now(),limit=now+Number(s.duration_minutes)*60000,close=s.closes_at?Date.parse(s.closes_at):Infinity;
  const {data,error}=await db.from("physics9_ff_attempts_v1").insert({
   invite_id:null,auth_user_id:identity.id,institutional_email:identity.email,
   variant_ids,session_hash:await sha(crypto.randomUUID()),
   deadline_at:new Date(Math.min(limit,close)).toISOString()
  }).select("*").maybeSingle();
  if(error||!data)return json({error:"START_CONFLICT_RETRY"},409,origin);
  await record("session_started","student",data.id,{auth_user_id:identity.id,identity_provider:"verified_school_email"});
  return json(await studentView({...data,student_name:identity.email,group_code:"Institucional"},s),200,origin);
 }
 const a=await asStudent(req);
 if(!a)return json({error:"INSTITUTIONAL_EMAIL_REQUIRED"},401,origin);
 if(action==="status")return json(await studentView(a,s),200,origin);
 if(a.state!=="active")return json({error:"ALREADY_SUBMITTED"},409,origin);
 if(!isOpen(s)||Date.now()>=Date.parse(a.deadline_at))return json({error:"DEADLINE_REACHED"},403,origin);
 if(action==="save"){
  const qn=Number(p.question_number);
  if(![1,2,3].includes(qn)||!Number.isInteger(p.revision)||p.revision!==a.revision)return json({error:"REVISION_CONFLICT",revision:a.revision},409,origin);
  if(!p.values||typeof p.values!=="object"||Array.isArray(p.values)||Object.keys(p.values).sort().join("|")!==FIELDS[qn].slice().sort().join("|"))return json({error:"INVALID_FIELDS"},400,origin);
  if(FIELDS[qn].some(key=>typeof p.values[key]!=="string"||p.values[key].length>40||(p.values[key].trim()!==""&&nstr(p.values[key])===null)))return json({error:"INVALID_NUMBER"},400,origin);
  // Answers are exclusively numeric values + explicit student-selected units.
  if(!p.units||typeof p.units!=="object"||Array.isArray(p.units)||
     Object.keys(p.units).sort().join("|")!==FIELDS[qn].slice().sort().join("|"))
     return json({error:"INVALID_UNITS"},400,origin);
  if(FIELDS[qn].some(key=>!["",...ALL_UNITS].includes(p.units[key])))
     return json({error:"INVALID_UNITS"},400,origin);
  const updated={...a.answers,[String(qn)]:{values:p.values,units:p.units}};
  const {data,error}=await db.from("physics9_ff_attempts_v1").update({answers:updated,revision:a.revision+1,updated_at:new Date().toISOString()}).eq("id",a.id).eq("state","active").eq("revision",a.revision).select("revision").maybeSingle();
  if(error||!data)return json({error:"REVISION_CONFLICT"},409,origin);
  return json({saved:true,revision:data.revision},200,origin);
 }
 if(action==="submit"){
  if(!Number.isInteger(p.revision)||p.revision!==a.revision)return json({error:"REVISION_CONFLICT",revision:a.revision},409,origin);
  for(const n of [1,2,3]){
   const one=a.answers?.[String(n)];
   if(!one||FIELDS[n].some(key=>nstr(one.values?.[key])===null||!validAnswerUnit(one.units?.[key])))
    return json({error:"INCOMPLETE_ANSWERS",question:n},422,origin);
  }
  const {data:evidence,error:evidenceError}=await db.from("physics9_ff_evidence_v1").select("attempt_id,sha256_hex").eq("attempt_id",a.id).maybeSingle();
  if(evidenceError)throw Error("EVIDENCE_LOOKUP_FAILED");
  if(!evidence)return json({error:"EVIDENCE_REQUIRED"},422,origin);
  const qs=await questions(a.variant_ids);
  const details:Row[]=[];
  let correct=0;
  for(let i=0;i<3;i++){
   const q=qs[i],one=a.answers[String(i+1)];
   for(const field of FIELDS[i+1]){
    const expected=exactAnswer(q,field),actual=nstr(one.values[field])!;
    const unit=one.units[field] as string,unit_correct=permittedUnit(field,unit);
    const normalized=unit_correct?toBaseUnits(actual,unit):null;
    const epsilon=tolerance(expected,field,s);
    const numeric_correct=normalized!==null&&Math.abs(normalized-expected)<=epsilon+1e-10;
    const pass=unit_correct&&numeric_correct;
    if(pass)correct++;
    details.push({question:i+1,field,submitted:actual,submitted_unit:unit,normalized_base:normalized,
      expected,expected_unit:TYPE_BY_FIELD[field]==="time"?"s":TYPE_BY_FIELD[field]==="height"?"ft":"ft/s",
      epsilon,unit_correct,numeric_correct,correct:pass});
   }
  }
  const numeric_score=round2(5*correct/9),now=new Date().toISOString();
  const {data,error}=await db.from("physics9_ff_attempts_v1").update({state:"submitted",submitted_at:now,numeric_score,breakdown:details,revision:a.revision+1,updated_at:now}).eq("id",a.id).eq("state","active").eq("revision",a.revision).select("id,submitted_at").maybeSingle();
  if(error||!data)return json({error:"SUBMIT_CONFLICT"},409,origin);
  return json({receipt:data.id,submitted_at:now,submitted:true,message:"Numeric answers, selected units and private procedure evidence recorded. Teacher review pending."},200,origin);
 }
 return json({error:"UNKNOWN_ACTION"},400,origin);
}
// The upload token is never stored as plain text; students cannot read the storage bucket.
// Multipart request avoids base64 expansion and limits the payload to one PDF/photo, <= 5 MiB.
function detectMime(bytes:Uint8Array):{mime:string;ext:string}|null{
 const prefix=(a:number[])=>a.every((v,i)=>bytes[i]===v);
 if(prefix([0x25,0x50,0x44,0x46,0x2d]))return{mime:"application/pdf",ext:"pdf"};
 if(prefix([0xff,0xd8,0xff]))return{mime:"image/jpeg",ext:"jpg"};
 if(prefix([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))return{mime:"image/png",ext:"png"};
 if(bytes.length>=12&&prefix([0x52,0x49,0x46,0x46])&&[0x57,0x45,0x42,0x50].every((v,i)=>bytes[i+8]===v))return{mime:"image/webp",ext:"webp"};
 return null;
}
async function uploadEvidence(req:Request,origin:string|null):Promise<Response>{
 const size=Number(req.headers.get("content-length")||0);
 if(size>5700000)return json({error:"FILE_TOO_LARGE"},413,origin);
 let form:FormData;try{form=await req.formData()}catch{return json({error:"INVALID_UPLOAD"},400,origin)}
 if(form.get("action")!=="upload")return json({error:"INVALID_UPLOAD"},400,origin);
 const rawFile=form.get("file");
 if(!(rawFile instanceof File))return json({error:"FILE_REQUIRED"},400,origin);
 if(rawFile.size<64||rawFile.size>EVIDENCE_MAX_BYTES)return json({error:"FILE_TOO_LARGE"},413,origin);
 if(rawFile.name.length<1||rawFile.name.length>160)return json({error:"FILE_NAME_INVALID"},400,origin);
 const a=await asStudent(req),s=await settings();
 if(!a)return json({error:"INVALID_SESSION"},401,origin);
 if(a.state!=="active"||!isOpen(s)||Date.now()>=Date.parse(a.deadline_at))return json({error:"DEADLINE_REACHED"},403,origin);
 const bytes=new Uint8Array(await rawFile.arrayBuffer());
 const detected=detectMime(bytes);
 if(!detected||rawFile.type!==detected.mime)return json({error:"UNSUPPORTED_FILE_TYPE"},415,origin);
 const checksum=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",bytes)),n=>n.toString(16).padStart(2,"0")).join("");
 const object_path=a.id+"/"+crypto.randomUUID()+"."+detected.ext;
 const fileName=rawFile.name.normalize("NFC").replace(/[\\/\x00-\x1f\x7f]/g,"_").slice(0,160);
 const {error:storeError}=await db.storage.from(EVIDENCE_BUCKET).upload(object_path,bytes,{
   contentType:detected.mime,cacheControl:"0",upsert:false
 });
 if(storeError)throw Error("EVIDENCE_STORAGE_FAILED");
 const {data:row,error:metadataError}=await db.from("physics9_ff_evidence_v1").upsert({
   attempt_id:a.id,object_path,original_name:fileName,mime_type:detected.mime,
   size_bytes:bytes.byteLength,sha256_hex:checksum,uploaded_at:new Date().toISOString()
 },{onConflict:"attempt_id"}).select("original_name,size_bytes,mime_type,uploaded_at,sha256_hex").single();
 if(metadataError||!row){
   await db.storage.from(EVIDENCE_BUCKET).remove([object_path]);
   return json({error:"EVIDENCE_SAVE_FAILED"},409,origin);
 }
 await record("procedure_evidence_uploaded","student",a.id,{
  sha256:checksum,size:bytes.byteLength,mime:detected.mime,version:"new_or_replaced"
 });
 return json({uploaded:true,evidence:evidencePublic(row)},200,origin);
}

async function handleTeacher(p:Row,req:Request,origin:string|null){
 const userId=await teacherIdentity(req);
 if(!userId)return json({error:"TEACHER_MFA_REQUIRED"},403,origin);
 const action=p.action,s=await settings();
 if(action==="admin_info"){
  const {data:attempts,error}=await db.from("physics9_ff_attempts_v1")
   .select("id,institutional_email,auth_user_id,state,started_at,submitted_at,numeric_score,final_score,reviewed_at")
   .not("institutional_email","is",null).order("started_at",{ascending:false}).limit(300);
  if(error)throw Error("STUDENT_LIST_FAILED");
  return json({settings:s,students:(attempts||[]).map(a=>({
   id:a.id,student_name:a.institutional_email,group_code:"Institucional",active:true,
   attempt:{id:a.id,state:a.state,started_at:a.started_at,submitted_at:a.submitted_at,
    numeric_score:a.numeric_score,final_score:a.final_score,reviewed_at:a.reviewed_at}
  }))},200,origin);
 }
 if(action==="admin_configure"){
  const c=p.settings||{};
  if(typeof c.enabled!=="boolean"||typeof c.show_final_score!=="boolean"||!Number.isInteger(c.duration_minutes)||c.duration_minutes<10||c.duration_minutes>180)return json({error:"CONFIG_INVALID"},400,origin);
  const specs=[["relative_tolerance",0,.1],["absolute_time",0,3],["absolute_height",0,50],["absolute_velocity",0,20]] as const;
  if(specs.some(([key,lo,hi])=>numeric(c[key])===null||c[key]<lo||c[key]>hi))return json({error:"TOLERANCE_INVALID"},400,origin);
  const iso=(v:unknown)=>v===null||v===""?null:typeof v==="string"&&!Number.isNaN(Date.parse(v))?new Date(v).toISOString():false;
  const opens=iso(c.opens_at),closes=iso(c.closes_at);
  if(opens===false||closes===false||(opens&&closes&&Date.parse(opens)>=Date.parse(closes)))return json({error:"DATE_INVALID"},400,origin);
  const v={enabled:c.enabled,show_final_score:c.show_final_score,duration_minutes:c.duration_minutes,relative_tolerance:c.relative_tolerance,absolute_time:c.absolute_time,absolute_height:c.absolute_height,absolute_velocity:c.absolute_velocity,opens_at:opens,closes_at:closes,updated_at:new Date().toISOString()};
  const {data,error}=await db.from("physics9_ff_settings_v1").update(v).eq("id",EXAM).select("*").single();
  if(error)throw Error("CONFIG_SAVE_FAILED");
  await record("settings_changed","teacher",null,{teacher_id:userId,old:{enabled:s.enabled,relative_tolerance:s.relative_tolerance},next:v});
  return json({settings:data},200,origin);
 }
 if(action==="admin_results"){
  const {data:rows,error}=await db.from("physics9_ff_attempts_v1").select("*").not("institutional_email","is",null).order("started_at",{ascending:false}).limit(300);
  if(error)throw Error("RESULT_LOOKUP_FAILED");
  const {data:invite}=await db.from("physics9_ff_invites_v1").select("id,student_name,group_code");
  const {data:evidence}=await db.from("physics9_ff_evidence_v1")
   .select("attempt_id,original_name,mime_type,size_bytes,sha256_hex,uploaded_at").limit(300);
  const byEvidence=new Map((evidence||[]).map(x=>[x.attempt_id,evidencePublic(x)]));
  const byId=new Map((invite||[]).map(x=>[x.id,x]));
  return json({results:(rows||[]).map((a:Row)=>({
   id:a.id,student:a.institutional_email?{student_name:a.institutional_email,group_code:"Institucional",email:a.institutional_email}:byId.get(a.invite_id)||{student_name:"(Unknown)",group_code:"?"},state:a.state,started_at:a.started_at,submitted_at:a.submitted_at,
   answers:a.answers,breakdown:a.breakdown,numeric_score:a.numeric_score,final_score:a.final_score,teacher_feedback:a.teacher_feedback,reviewed_at:a.reviewed_at,
   variant_ids:a.variant_ids,evidence:byEvidence.get(a.id)||null
  }))},200,origin);
 }
 if(action==="admin_evidence_link"){
  if(!validUuid(p.attempt_id))return json({error:"INVALID_ATTEMPT"},400,origin);
  const {data:submitted}=await db.from("physics9_ff_attempts_v1")
   .select("id,state").eq("id",p.attempt_id).maybeSingle();
  if(!submitted||submitted.state!=="submitted")return json({error:"SUBMISSION_REQUIRED"},403,origin);
  const {data:proof,error}=await db.from("physics9_ff_evidence_v1")
   .select("object_path,original_name").eq("attempt_id",p.attempt_id).maybeSingle();
  if(error||!proof)return json({error:"EVIDENCE_NOT_FOUND"},404,origin);
  const {data:link,error:signError}=await db.storage.from(EVIDENCE_BUCKET).createSignedUrl(
   proof.object_path,90,{download:proof.original_name}
  );
  if(signError||!link?.signedUrl)throw Error("SIGNING_FAILED");
  await record("procedure_evidence_accessed","teacher",p.attempt_id,{teacher_id:userId});
  return json({url:link.signedUrl,expires_in_seconds:90,filename:proof.original_name},200,origin);
 }
 if(action==="admin_review"){
  if(!validUuid(p.attempt_id)||numeric(p.final_score)===null||p.final_score<0||p.final_score>5||typeof p.comment!=="string"||p.comment.trim().length<10||p.comment.length>2000)return json({error:"REVIEW_INVALID"},400,origin);
  const {data:a}=await db.from("physics9_ff_attempts_v1").select("id,revision,state,final_score").eq("id",p.attempt_id).maybeSingle();
  if(!a||a.state!=="submitted")return json({error:"SUBMISSION_REQUIRED"},409,origin);
  const {data:reviewEvidence}=await db.from("physics9_ff_evidence_v1").select("attempt_id").eq("attempt_id",a.id).maybeSingle();
  if(!reviewEvidence)return json({error:"EVIDENCE_REQUIRED"},422,origin);
  const now=new Date().toISOString();
  const {data,error}=await db.from("physics9_ff_attempts_v1").update({final_score:round2(p.final_score),teacher_feedback:p.comment.trim(),reviewed_at:now,revision:a.revision+1,updated_at:now}).eq("id",a.id).eq("revision",a.revision).eq("state","submitted").select("id").maybeSingle();
  if(error||!data)return json({error:"REVIEW_CONFLICT"},409,origin);
  await record("grade_reviewed","teacher",a.id,{teacher_id:userId,previous_final:a.final_score,new_final:round2(p.final_score),comment:p.comment.trim()});
  return json({reviewed:true},200,origin);
 }
 if(action==="admin_events"){
  const query=db.from("physics9_ff_events_v1").select("id,attempt_id,actor,event_type,details,occurred_at").order("id",{ascending:false}).limit(300);
  const {data,error}=await query;
  if(error)throw Error("AUDIT_LOOKUP_FAILED");
  return json({events:data||[]},200,origin);
 }
 return json({error:"UNKNOWN_ADMIN_ACTION"},400,origin);
}
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get("origin");
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:{
  "Access-Control-Allow-Origin":origin&&TEST_ORIGINS.has(origin)?origin:"null",
  "Access-Control-Allow-Headers":"content-type,authorization,apikey,x-client-info",
  "Access-Control-Allow-Methods":"POST, OPTIONS","Vary":"Origin"}});
 if(req.method!=="POST")return json({error:"METHOD_NOT_ALLOWED"},405,origin);
 if(origin&&!TEST_ORIGINS.has(origin))return json({error:"ORIGIN_DENIED"},403,origin);
 if(!SERVICE||!ANON||!URL)return json({error:"SERVER_CONFIG_MISSING"},503,origin);
 try{
  if((req.headers.get("content-type")||"").startsWith("multipart/form-data"))
   return await uploadEvidence(req,origin);
  if(Number(req.headers.get("content-length")||0)>25000)return json({error:"PAYLOAD_TOO_LARGE"},413,origin);
  if(!(req.headers.get("content-type")||"").includes("application/json"))return json({error:"CONTENT_TYPE_REQUIRED"},415,origin);
  const raw=await req.text();
  if(raw.length>25000)return json({error:"PAYLOAD_TOO_LARGE"},413,origin);
  const p=JSON.parse(raw);
  if(!p||typeof p!=="object"||Array.isArray(p)||typeof p.action!=="string")return json({error:"INVALID_PAYLOAD"},400,origin);
  if(p.action.startsWith("admin_"))return await handleTeacher(p,req,origin);
  return await handleStudent(p,req,origin);
 }catch(error){
  console.error("physics9-freefall",error instanceof Error?error.message:"unexpected");
  return json({error:"SERVER_ERROR"},500,origin);
 }
});
