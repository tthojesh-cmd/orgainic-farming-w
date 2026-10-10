'use client';
import dynamic from 'next/dynamic';
const Chat=dynamic(()=>import('@/components/Chat'),{ssr:false,loading:()=><p>Loading assistant…</p>});
export default function P(){return <Chat/>}
