"use client";
import {createContext,useContext,useEffect,useState} from "react";
import Link from "next/link";import {Menu,X,Sprout} from "lucide-react";
import {D} from "@/lib/i18n";import {get,set} from "@/lib/storage";
const Ctx=createContext<any>({lang:"en",setLang:(_:string)=>{},t:(k:string)=>k,user:null,setUser:(_:any)=>{}});
export const useApp=()=>useContext(Ctx);
export default function Shell({children}:{children:React.ReactNode}){
 const [lang,setL]=useState("en"),[user,setU]=useState<any>(null),[open,setOpen]=useState(false);
 useEffect(()=>{setL(get("ofa_lang","en"));setU(get("ofa_session",null))},[]);
 const setLang=(l:string)=>{setL(l);set("ofa_lang",l)};const setUser=(u:any)=>{setU(u);set("ofa_session",u)};
 const t=(k:string)=>D[lang][k]||D.en[k]||k;
 const nav:[string,string][]=[["/","home"],["/crop-farming","crops"],["/organic-fertilizers","fert"],["/pest-management","pest"],["/seasonal-guide","season"],["/ai-assistant","ai"]];
 return <Ctx.Provider value={{lang,setLang,t,user,setUser}}>
 <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
  <Link href="/" className="flex items-center gap-2 font-bold text-forest"><img src="/logo.svg" alt="" className="h-8 w-8"/>Organic Farming AI</Link>
  <button className="lg:hidden" aria-label="Menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
  <nav className={`${open?"flex":"hidden"} absolute left-0 top-full w-full flex-col gap-3 border-b bg-white p-4 lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:border-0 lg:p-0`} onClick={()=>setOpen(false)}>
   {nav.map(([h,k])=><Link key={h} href={h} className="hover:text-leaf">{t(k)}</Link>)}
   <select aria-label="Language" className="rounded-lg border px-2 py-1" value={lang} onChange={e=>setLang(e.target.value)}><option value="en">English</option><option value="te">తెలుగు</option></select>
   {user?<><Link href="/dashboard" className="btn2">{t("dash")}</Link><Link href="/profile" className="hover:text-leaf">{t("profile")}</Link></>:<><Link href="/login" className="btn2">{t("login")}</Link><Link href="/signup" className="btn">{t("signup")}</Link></>}
  </nav></div></header>
 <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8">{children}</main>
 <footer className="border-t bg-forest text-white"><div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-3">
  <div><p className="flex items-center gap-2 font-bold"><Sprout/>Organic Farming AI</p><p className="mt-2 text-sm opacity-80">{t("note")}</p></div>
  <div className="flex flex-col gap-1 text-sm">{[["about","About"],["contact","Contact"],["privacy","Privacy Policy"],["terms","Terms and Conditions"]].map(([h,l])=><Link key={h} href={"/"+h}>{l}</Link>)}</div>
  <div className="flex flex-col gap-1 text-sm">{[["crop-farming","sec_crops"],["organic-fertilizers","sec_fertilizers"],["soil-management","sec_soil"],["irrigation","sec_irrigation"]].map(([h,k])=><Link key={h} href={"/"+h}>{t(k)}</Link>)}</div></div></footer>
 </Ctx.Provider>}
