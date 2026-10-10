export const get=<T,>(k:string,d:T):T=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}};
export const set=(k:string,v:any)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
export const clearAll=()=>Object.keys(localStorage).filter(k=>k.startsWith("ofa_")).forEach(k=>localStorage.removeItem(k));
export const uid=()=>Math.random().toString(36).slice(2,10);
