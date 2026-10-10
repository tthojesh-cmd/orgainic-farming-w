"use client";
import {useState} from "react";import Link from "next/link";import {useRouter} from "next/navigation";
import {useApp} from "./Shell";import {get,set,uid} from "@/lib/storage";import {validEmail,hash} from "@/lib/validation";
export default function Auth({mode}:{mode:"login"|"signup"}){
 const {t,setUser}=useApp();const r=useRouter();const [f,setF]=useState<any>({name:"",email:"",pw:"",pw2:"",terms:false,rem:true}),[show,setShow]=useState(false),[err,setErr]=useState(""),[ok,setOk]=useState("");
 const up=(k:string,v:any)=>setF({...f,[k]:v});
 async function go(e:React.FormEvent){e.preventDefault();setErr("");const email=f.email.trim().toLowerCase();const users=get<any[]>("ofa_users",[]);
  if(!validEmail(email))return setErr("Enter a valid email address.");
  if(mode==="signup"){if(f.name.trim().length<2)return setErr("Enter your full name.");if(f.pw.length<8)return setErr("Password must be at least 8 characters.");if(f.pw!==f.pw2)return setErr("Passwords do not match.");if(!f.terms)return setErr("Please accept the Terms and Conditions.");
   if(users.some(u=>u.email===email))return setErr("An account with this email already exists in this browser.");
   const salt=uid()+uid();const u={email,name:f.name.trim(),salt,h:await hash(f.pw,salt)};set("ofa_users",[...users,u]);setUser({email,name:u.name});setOk("Account created.");setTimeout(()=>r.push("/dashboard"),600)}
  else{const u=users.find(x=>x.email===email);if(!u||u.h!==await hash(f.pw,u.salt))return setErr("Incorrect email or password.");setUser({email,name:u.name});setOk("Logged in.");setTimeout(()=>r.push("/dashboard"),400)}}
 return <form onSubmit={go} className="card mx-auto max-w-md space-y-3" noValidate><h1 className="text-2xl font-bold text-forest">{t(mode)}</h1>
  <p className="rounded-xl bg-amber-50 p-2 text-xs">Demo account: stored only in this browser (password is hashed, not plaintext). It is <b>not</b> secure production authentication and is not shared across devices. Real accounts need a server-side auth service and persistent storage.</p>
  {mode==="signup"&&<label className="block">Full name<input className="inp" value={f.name} onChange={e=>up("name",e.target.value)}/></label>}
  <label className="block">Email<input className="inp" type="email" value={f.email} onChange={e=>up("email",e.target.value)}/></label>
  <label className="block">Password<input className="inp" type={show?"text":"password"} value={f.pw} onChange={e=>up("pw",e.target.value)}/></label>
  {mode==="signup"&&<label className="block">Confirm password<input className="inp" type={show?"text":"password"} value={f.pw2} onChange={e=>up("pw2",e.target.value)}/></label>}
  <label className="flex gap-2"><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/>Show password</label>
  {mode==="signup"?<label className="flex gap-2"><input type="checkbox" checked={f.terms} onChange={e=>up("terms",e.target.checked)}/>I accept the <Link className="underline" href="/terms">Terms</Link></label>:<label className="flex gap-2"><input type="checkbox" checked={f.rem} onChange={e=>up("rem",e.target.checked)}/>Remember me</label>}
  {err&&<p role="alert" className="text-red-700">{err}</p>}{ok&&<p className="text-leaf">{ok}</p>}
  <button className="btn w-full justify-center">{mode==="signup"?"Create Account":t("login")}</button>
  <p className="text-sm">{mode==="signup"?<>Have an account? <Link className="underline" href="/login">{t("login")}</Link></>:<>New here? <Link className="underline" href="/signup">{t("signup")}</Link></>}</p></form>}
