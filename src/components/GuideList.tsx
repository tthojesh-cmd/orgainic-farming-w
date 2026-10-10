"use client";
import {useEffect,useState} from "react";import {Bookmark,BookmarkCheck,Search} from "lucide-react";
import content from "@/data/content.json";import {useApp} from "./Shell";import {get,set} from "@/lib/storage";
export default function GuideList({section,all}:{section?:string;all?:boolean}){
 const {t,lang}=useApp();const [q,setQ]=useState(""),[saved,setSaved]=useState<any[]>([]),[season,setSeason]=useState("");
 useEffect(()=>setSaved(get("ofa_saved",[])),[]);
 const C:any=content;const items:any[]=(all?Object.keys(C):[section!]).flatMap(s=>C[s].map((i:any)=>({...i,sec:s})));
 const hit=items.filter(i=>(!season||i.s.includes(season)||i.s==="all")&&(i.t.en+i.t.te+i.d+i.k+i.p.join(" ")).toLowerCase().includes(q.toLowerCase()));
 const toggle=(i:any)=>{const has=saved.some(s=>s.id===i.id);const n=has?saved.filter(s=>s.id!==i.id):[...saved,{id:i.id,title:i.t[lang]||i.t.en,body:i.d}];setSaved(n);set("ofa_saved",n)};
 const view=(i:any)=>{const v=get<any[]>("ofa_viewed",[]).filter(x=>x.id!==i.id);set("ofa_viewed",[{id:i.id,title:i.t[lang]||i.t.en,sec:i.sec},...v].slice(0,6))};
 return <div>{!all&&<h1 className="mb-1 text-3xl font-bold text-forest">{t("sec_"+section)}</h1>}
 {!all&&<p className="mb-4 text-sm text-earth">{t("note")}</p>}
 <div className="mb-4 flex flex-wrap gap-2"><div className="relative min-w-[200px] flex-1"><Search className="absolute left-3 top-2.5 h-5 w-5 text-earth"/><input className="inp pl-10" aria-label="Search" placeholder={t("search")} value={q} onChange={e=>setQ(e.target.value)}/></div>
 {section==="seasonal"&&<select className="inp w-auto" aria-label="Season" value={season} onChange={e=>setSeason(e.target.value)}><option value="">All seasons</option><option value="kharif">Kharif</option><option value="rabi">Rabi</option><option value="summer">Summer</option></select>}</div>
 {section==="seasonal"&&<p className="mb-3 rounded-xl bg-white p-3 text-sm">Regional timing varies by state and climate. This is general guidance — verify with local agricultural sources.</p>}
 {hit.length===0?<p className="card">{t("none")}</p>:<div className="grid gap-4 md:grid-cols-2">{hit.map(i=><details key={i.id} className="card" onToggle={e=>(e.target as any).open&&view(i)}>
  <summary className="cursor-pointer text-lg font-semibold text-forest">{i.t[lang]||i.t.en}</summary><p className="mt-2">{i.d}</p>
  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{i.p.map((x:string)=><li key={x}>{x}</li>)}</ul>
  <p className="mt-2 text-xs text-earth">{t("note")}</p>
  <button className="btn2 mt-3" onClick={()=>toggle(i)}>{saved.some(s=>s.id===i.id)?<><BookmarkCheck className="h-4 w-4"/>{t("saved")}</>:<><Bookmark className="h-4 w-4"/>{t("save")}</>}</button></details>)}</div>}</div>}
