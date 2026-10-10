'use client';
export default function E({error,reset}:{error:Error;reset:()=>void}){return <div className="card mx-auto max-w-lg"><h1 className="text-xl font-bold text-forest">Something went wrong</h1><p className="mt-2 text-sm">{error?.message}</p><button className="btn mt-3" onClick={reset}>Try again</button></div>}
