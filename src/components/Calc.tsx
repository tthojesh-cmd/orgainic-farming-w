"use client";
import {useState} from "react";
const N=(v:string)=>parseFloat(v)||0;
function F({l,v,s}:{l:string;v:string;s:(x:string)=>void}){return <label className="block text-sm">{l}<input className="inp" type="number" min="0" value={v} onChange={e=>s(e.target.value)}/></label>}
const SQM:any={sqm:1,ha:10000,acre:4046.8564224,sqft:0.09290304};
export default function Calc(){
 const [a,setA]=useState("1"),[au,setAu]=useState("acre"),[sr,setSr]=useState("25"),[sa,setSa]=useState("1"),[sau,setSau]=useState("ha"),[am,setAm]=useState("1"),[ar,setAr]=useState("0"),[arU,setArU]=useState("ha"),
 [c,setC]=useState(["0","0","0","0","0"]),[h,setH]=useState("0"),[p,setP]=useState("0"),[ex,setEx]=useState("0");
 const sqm=N(a)*SQM[au];const U=({v,s}:any)=><select className="inp" value={v} onChange={e=>s(e.target.value)}><option value="sqm">m²</option><option value="ha">hectare</option><option value="acre">acre</option><option value="sqft">ft²</option></select>;
 const cost=c.reduce((x,y)=>x+N(y),0),rev=N(h)*N(p);
 return <div className="grid gap-4 md:grid-cols-2">
 <section className="card space-y-2"><h2 className="font-bold text-forest">Land Area Converter</h2><F l="Area" v={a} s={setA}/><U v={au} s={setAu}/>
  <p>{(sqm).toLocaleString(undefined,{maximumFractionDigits:2})} m² · {(sqm/10000).toFixed(4)} ha · {(sqm/SQM.acre).toFixed(4)} acre · {(sqm/SQM.sqft).toFixed(1)} ft²</p></section>
 <section className="card space-y-2"><h2 className="font-bold text-forest">Seed Quantity Estimator</h2><F l="Area" v={sa} s={setSa}/><U v={sau} s={setSau}/><F l="Seed rate (kg per hectare — from your crop guide/local recommendation)" v={sr} s={setSr}/>
  <p>Estimated seed: <b>{(N(sa)*SQM[sau]/10000*N(sr)).toFixed(2)} kg</b></p></section>
 <section className="card space-y-2"><h2 className="font-bold text-forest">Organic Amendment Quantity</h2><F l="Area" v={am} s={setAm}/><U v={arU==="x"?"ha":arU} s={setArU}/><F l="Your recommended rate (kg per hectare)" v={ar} s={setAr}/>
  <p>Estimated total: <b>{(N(am)*SQM[arU]/10000*N(ar)).toFixed(2)} kg</b></p><p className="text-xs text-earth">This calculator does not decide the correct rate. Use a soil test and local guidance.</p></section>
 <section className="card space-y-2"><h2 className="font-bold text-forest">Basic Farm Cost (₹)</h2>{["Seed","Compost & amendments","Labour","Irrigation","Other"].map((l,i)=><F key={l} l={l} v={c[i]} s={x=>setC(c.map((y,j)=>j===i?x:y))}/>)}<p>Total: <b>₹{cost.toLocaleString()}</b></p></section>
 <section className="card space-y-2 md:col-span-2"><h2 className="font-bold text-forest">Revenue & Profit Estimator</h2><div className="grid gap-2 sm:grid-cols-3"><F l="Expected harvest (kg)" v={h} s={setH}/><F l="Expected price (₹ per kg)" v={p} s={setP}/><F l="Total expenses (₹)" v={ex} s={setEx}/></div>
  <p>Revenue: <b>₹{rev.toLocaleString()}</b> · {rev-N(ex)>=0?"Profit":"Loss"}: <b>₹{Math.abs(rev-N(ex)).toLocaleString()}</b></p><p className="text-xs text-earth">Estimates from your own assumptions only. Actual yield, revenue and profit are not guaranteed.</p></section></div>}
