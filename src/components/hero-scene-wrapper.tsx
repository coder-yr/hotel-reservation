"use client";

import dynamic from 'next/dynamic';

const Hero3DScene = dynamic(() => import('./hero-3d-scene').then(mod => mod.Hero3DScene), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-slate-900" /> // Prevents flash of white
});

export function HeroSceneWrapper() {
    return <Hero3DScene />;
}
