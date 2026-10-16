import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
const URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const db = createClient(URL,SERVICE,{auth:{persistSession:false}});
const ORIGIN = "https://juanperez238421-cpu.github.io";
const KEY = "physics9-position-velocity-2026";
const SETTINGS = "physics9_motion_single_access_v1";
const TABLE = "physics9_motion_single_attempts_v1";
const ALLOWED = new Set(["P01","P02","P03","P04"]);
const CLOSES_AT="2026-10-16T17:00:00.000Z";
const respondHeaders = (origin:string|null) => ({
 "Access-Control-Allow-Origin": origin===ORIGIN||origin==="http://localhost:8000"||origin==="http://127.0.0.1:8000" ? origin : ORIGIN,
 "Access-Control-Allow-Methods":"POST, OPTIONS",
 "Access-Control-Allow-Headers":"content-type,apikey,authorization,x-client-info",
 "Content-Type":"application/json; charset=utf-8",
 "Cache-Control":"no-store",
 "Vary":"Origin"
});
const response=(data:unknown,status=200,origin:string|null=null) => new Response(JSON.stringify(data),{status,headers:respondHeaders(origin)});
const uuid=(v:unknown) => typeof v==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
const email=(v:unknown) => typeof v==="string"&&v.trim().length<=160&&/^[a-z0-9][a-z0-9._+-]*@ijr\.edu\.co$/.test(v.trim().toLowerCase())?v.trim().toLowerCase():null;
const name=(v:unknown) => typeof v==="string"&&v.trim().length>=3&&v.trim().length<=120&&/^[\p{L}\p{M} .'-]+$/u.test(v.trim())?v.trim().replace(/\s+/g," "):null;
const tokenValid=(v:unknown) => typeof v==="string"&&/^[a-f0-9]{64}$/.test(v);
const hash=async(v:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v))),x=>x.toString(16).padStart(2,"0")).join("");
const newToken=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,"0")).join("");
const view=(r:Record<string,unknown>)=>({attempt_id:r.id,student_name:r.student_name,student_email:r.student_email,student_group:r.student_group,state:r.state,strikes:r.strikes,started_at:r.started_at,submitted_at:r.submitted_at,answers:r.answers??{}});
const complete=(a:any)=>a&&typeof a.value==="string"&&/^-?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(a.value)&&typeof a.reasoning==="string"&&a.reasoning.trim().length>=15;
const statusCode=(state:string)=>state==="blocked"?"SESSION_BLOCKED":"ALREADY_SUBMITTED";
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get("origin");
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:respondHeaders(origin)});
 if(req.method!=="POST")return response({error:"METHOD_NOT_ALLOWED"},405,origin);
 if(origin&&origin!==ORIGIN&&origin!=="http://localhost:8000"&&origin!=="http://127.0.0.1:8000")return response({error:"ORIGIN_NOT_ALLOWED"},403,origin);
 if(!URL||!SERVICE)return response({error:"SERVER_NOT_READY"},503,origin);
 let p:Record<string,any>;
 try{
  if(Number(req.headers.get("content-length")||0)>18000)return response({error:"PAYLOAD_TOO_LARGE"},413,origin);
  p=await req.json();
  if(!p||typeof p!=="object"||Array.isArray(p))throw Error("Invalid payload");
 }catch{return response({error:"INVALID_JSON"},400,origin)}
 try{
  if(p.action==="config"){
   const {data,error}=await db.from(SETTINGS).select("enabled").eq("exam_key",KEY).single();
   if(error)return response({error:"CONFIG_NOT_AVAILABLE"},503,origin);
   return response({enabled:data.enabled===true,individual:true,question_count:4},200,origin);
  }
  if(p.action==="start"){
   const student_name=name(p.student_name),student_email=email(p.student_email),student_group=p.student_group;
   if(!student_name||!student_email||!["9A","9B","9C","OTRO"].includes(String(student_group))||p.agreed!==true)return response({error:"REGISTRATION_INCOMPLETE"},400,origin);
   const {data:config,error:configError}=await db.from(SETTINGS).select("enabled,allowed_email,additional_allowed_email").eq("exam_key",KEY).single();
   if(configError||!config||!config.enabled)return response({error:"EXAM_NOT_ENABLED"},403,origin);
   if(config.allowed_email!==student_email&&config.additional_allowed_email!==student_email)return response({error:"ACCESS_DENIED"},403,origin);
   const issued=newToken(),token_hash=await hash(issued);
   const {data:existing,error:existingError}=await db.from(TABLE).select("id,student_name,student_email,student_group,answers,strikes,state,started_at,submitted_at")
     .eq("exam_key",KEY).eq("student_email",student_email).maybeSingle();
   if(existingError)return response({error:"LOOKUP_UNAVAILABLE"},503,origin);
   if(existing){
    if(existing.student_name.toLowerCase()!==student_name.toLowerCase()||existing.student_group!==student_group)return response({error:"STUDENT_DETAILS_MISMATCH"},403,origin);
    const {data:rotated,error:rotateError}=await db.from(TABLE).update({token_hash,updated_at:new Date().toISOString()}).eq("id",existing.id).select("id,student_name,student_email,student_group,answers,strikes,state,started_at,submitted_at").single();
    if(rotateError)return response({error:"RECOVERY_UNAVAILABLE"},503,origin);
    return response({...view(rotated),token:issued,recovered:true},200,origin);
   }
   const {data:newRow,error:insertError}=await db.from(TABLE).insert({exam_key:KEY,student_name,student_email,student_group,token_hash})
     .select("id,student_name,student_email,student_group,answers,strikes,state,started_at,submitted_at").single();
   if(insertError||!newRow)return response({error:"START_UNAVAILABLE"},503,origin);
   return response({...view(newRow),token:issued,recovered:false},200,origin);
  }
  if(!uuid(p.attempt_id)||!tokenValid(p.token))return response({error:"SESSION_REQUIRED"},401,origin);
  const t_hash=await hash(p.token);
  const {data:row,error:loadError}=await db.from(TABLE).select("id,exam_key,student_name,student_email,student_group,token_hash,answers,strikes,events,state,started_at,submitted_at")
    .eq("id",p.attempt_id).eq("exam_key",KEY).eq("token_hash",t_hash).maybeSingle();
  if(loadError)return response({error:"SESSION_LOOKUP_UNAVAILABLE"},503,origin);
  if(!row)return response({error:"INVALID_SESSION"},401,origin);
  // Keep existing student tokens valid when a separate QA address is added; revoke only if neither allowlist entry matches.
  const {data:currentAccess,error:accessError}=await db.from(SETTINGS).select("enabled,allowed_email,additional_allowed_email").eq("exam_key",KEY).single();
  if(accessError)return response({error:"CONFIG_NOT_AVAILABLE"},503,origin);
  if(!currentAccess?.enabled||(currentAccess.allowed_email!==row.student_email&&currentAccess.additional_allowed_email!==row.student_email))return response({error:"ACCESS_REVOKED"},403,origin);
  if(p.action==="status")return response(view(row),200,origin);
  if(row.state!=="active")return response({error:statusCode(row.state),...view(row)},409,origin);
  if(p.action==="answer"){
   if(!ALLOWED.has(p.problem_id))return response({error:"INVALID_PROBLEM"},400,origin);
   const value=typeof p.value==="string"?p.value.trim():"";
   const reasoning=typeof p.reasoning==="string"?p.reasoning.trim():"";
   if(value.length>32||(value!==""&&!/^-?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(value))||reasoning.length>8000)return response({error:"INVALID_RESPONSE"},400,origin);
   const answers={...(row.answers??{}),[p.problem_id]:{value,reasoning}};
   const {data,error}=await db.from(TABLE).update({answers,updated_at:new Date().toISOString()}).eq("id",row.id).eq("state","active").select("id").maybeSingle();
   if(error||!data)return response({error:"SAVE_UNAVAILABLE"},409,origin);
   return response({saved:true,problem_id:p.problem_id},200,origin);
  }
  if(p.action==="incident"){
   if(!uuid(p.event_id))return response({error:"INVALID_EVENT_ID"},400,origin);
   const old=Array.isArray(row.events)?row.events:[];
   if(old.some((e:any)=>e&&e.event_id===p.event_id))return response({strikes:row.strikes,state:row.state,duplicate:true},200,origin);
   const strikes=Math.min(3,Number(row.strikes)+1),state=strikes>=3?"blocked":"active";
   const reason=String(p.reason??"salida").replace(/[^a-zA-Z0-9 áéíóúñ_-]/gi,"").slice(0,90);
   const events=[...old.slice(-49),{event_id:p.event_id,reason,strike:strikes,occurred_at:new Date().toISOString()}];
   const {data,error}=await db.from(TABLE).update({events,strikes,state,updated_at:new Date().toISOString()}).eq("id",row.id).eq("state","active").select("id").maybeSingle();
   if(error||!data)return response({error:"INCIDENT_UNAVAILABLE"},409,origin);
   return response({strikes,state},200,origin);
  }
  if(p.action==="submit"){
   const answers=row.answers??{};
   const incomplete=Array.from(ALLOWED).filter(k=>!complete(answers[k]));
   if(incomplete.length)return response({error:"INCOMPLETE_ANSWERS",missing:incomplete},422,origin);
   const now=new Date().toISOString();
   const {data,error}=await db.from(TABLE).update({state:"submitted",submitted_at:now,updated_at:now}).eq("id",row.id).eq("state","active").select("id").maybeSingle();
   if(error||!data)return response({error:"SUBMISSION_UNAVAILABLE"},409,origin);
   return response({receipt:row.id,submitted_at:now,state:"submitted",strikes:row.strikes},200,origin);
  }
  return response({error:"UNKNOWN_ACTION"},400,origin);
 }catch(e){console.error("Physics individual exam request",String(e));return response({error:"INTERNAL_ERROR"},500,origin)}
});