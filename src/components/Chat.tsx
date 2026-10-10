"use client";
import {useEffect,useRef,useState} from "react";import {Copy,Bookmark,Trash2,Plus,Send} from "lucide-react";
import {useApp} from "./Shell";import {get,set,uid} from "@/lib/storage";
export default function Chat(){
 const {t,lang,setLang}=useApp();const [chats,setChats]=useState<any[]>([]),[cur,setCur]=useState<string>(""),[txt,setTxt]=useState(""),[busy,setBusy]=useState(false),[err,setErr]=useState(""),end=useRef<HTMLDivElement>(null);
 useEffect(()=>{let c=get<any[]>("ofa_chats",[]);if(!Array.isArray(c))c=[];c=c.filter((x:any)=>x&&x.id&&Array.isArray(x.msgs));setChats(c);const id=new URLSearchParams(location.search).get("c");setCur(id&&c.some(x=>x.id===id)?id:"")},[]);
 useEffect(()=>{try{end.current?.scrollIntoView({behavior:"smooth"})}catch{}},[chats,busy]);
 const chat=chats.find(c=>c.id===cur);const save=(c:any[])=>{setChats(c);set("ofa_chats",c)};
 async function send(){const m=txt.trim();if(!m||busy)return;setErr("");setTxt("");let id=cur,list=[...chats];
  if(!chat){id=uid();setCur(id);list=[{id,title:m.slice(0,40),date:new Date().toISOString(),msgs:[]},...list]}
  list=list.map(c=>c.id===id?{...c,msgs:[...c.msgs,{role:"user",content:m}]}:c);save(list);setBusy(true);
  try{const msgs=list.find(c=>c.id===id).msgs.map((x:any)=>({role:x.role,content:x.content}));
   const r=await fetch("/api/chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:msgs,lang})});const d=await r.json();
   if(!r.ok)throw new Error(d.error||"Request failed");
   save(list.map(c=>c.id===id?{...c,msgs:[...c.msgs,{role:"assistant",content:d.reply,mode:d.mode}]}:c));
  }catch(e:any){setErr(e.message||"Something went wrong. Please try again.")}setBusy(false)}
 const saveResp=(c:string)=>{const s=get<any[]>("ofa_saved",[]);set("ofa_saved",[...s,{id:uid(),title:"AI answer: "+c.replace(/[^\w\s]/g,"").slice(0,40),body:c}])};
 return <div className="grid gap-4 md:grid-cols-[240px_1fr]">
 <aside className="card h-fit"><button className="btn mb-3 w-full" onClick={()=>setCur("")}><Plus className="h-4 w-4"/>{t("newchat")}</button>
  <p className="mb-1 text-sm font-semibold">{t("history")}</p><ul className="max-h-60 space-y-1 overflow-auto text-sm">{chats.length===0&&<li className="text-earth">No chats yet.</li>}
  {chats.map(c=><li key={c.id} className="flex items-center justify-between gap-1"><button className={`truncate text-left ${c.id===cur?"font-bold text-forest":""}`} onClick={()=>setCur(c.id)}>{c.title}</button>
   <button aria-label="Delete chat" onClick={()=>{save(chats.filter(x=>x.id!==c.id));if(cur===c.id)setCur("")}}><Trash2 className="h-4 w-4 text-earth"/></button></li>)}</ul>
  {chats.length>0&&<button className="mt-3 text-sm text-red-700 underline" onClick={()=>{if(confirm("Clear all chat history?")){save([]);setCur("")}}}>Clear history</button>}
  <select aria-label="Language" className="inp mt-3" value={lang} onChange={e=>setLang(e.target.value)}><option value="en">English</option><option value="te">తెలుగు</option></select></aside>
 <section className="card flex h-[75vh] flex-col"><div className="flex-1 space-y-3 overflow-auto" aria-live="polite">
  {!chat&&<div className="text-earth"><p className="font-semibold text-forest">{t("ai")}</p><p>Ask about organic crops, soil, compost, pests, diseases or irrigation. English, తెలుగు and Romanized Telugu (e.g. “vari panta lo purugu ela aapali?”) are supported.</p><p className="mt-2 text-sm">Organic crop farming topics only.</p></div>}
  {chat?.msgs?.map((m:any,i:number)=><div key={i} className={`max-w-[90%] whitespace-pre-wrap rounded-2xl p-3 ${m.role==="user"?"ml-auto bg-forest text-white":"bg-cream"}`}>{String(m.content??"")}
   {m.role==="assistant"&&<div className="mt-2 flex gap-3 text-xs text-earth"><button className="flex items-center gap-1" onClick={()=>{try{navigator.clipboard.writeText(String(m.content))}catch{}}}><Copy className="h-3 w-3"/>Copy</button><button className="flex items-center gap-1" onClick={()=>saveResp(m.content)}><Bookmark className="h-3 w-3"/>{t("save")}</button></div>}</div>)}
  {busy&&<p className="text-earth">Thinking…</p>}{err&&<p role="alert" className="rounded-xl bg-red-50 p-2 text-red-700">{err}</p>}<div ref={end}/></div>
  <div className="mt-3 flex gap-2"><textarea className="inp" rows={2} aria-label="Message" placeholder={t("placeholder")} value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}}/><button className="btn" onClick={send} disabled={busy}><Send className="h-4 w-4"/>{t("send")}</button></div></section></div>}
