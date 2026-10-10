import {inScope,REFUSAL,SYSTEM,demo} from "@/lib/scope";
export async function POST(req:Request){
 const {messages=[]}=await req.json();const last=String(messages.at(-1)?.content||"").slice(0,2000);
 if(!last.trim())return Response.json({error:"Empty message"},{status:400});
 if(!inScope(last))return Response.json({reply:REFUSAL,mode:"scope"});
 const key=process.env.ANTHROPIC_API_KEY;
 if(!key)return Response.json({reply:demo(last),mode:"demo"});
 try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},
  body:JSON.stringify({model:process.env.AI_MODEL||"claude-sonnet-5-5",max_tokens:1000,system:SYSTEM,messages:messages.slice(-10).map((m:any)=>({role:m.role,content:String(m.content).slice(0,2000)}))})});
  if(!r.ok)return Response.json({error:"AI provider error ("+r.status+")"},{status:502});
  const d=await r.json();return Response.json({reply:d.content?.map((c:any)=>c.text||"").join("")||REFUSAL,mode:"live"});
 }catch{return Response.json({error:"Could not reach AI provider"},{status:502})}}
