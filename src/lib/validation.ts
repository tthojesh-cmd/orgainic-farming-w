export const validEmail=(e:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
export async function hash(pw:string,salt:string){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(salt+pw));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,"0")).join("")}
