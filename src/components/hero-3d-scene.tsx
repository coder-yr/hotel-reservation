"use client";

import Spline from '@splinetool/react-spline';

export function Hero3DScene() {
    return (
        <div className="absolute inset-0 z-0 bg-[#06060c]">
            <Spline
                scene="https://prod.spline.design/vrlhGvWkkEUossoV/scene.splinecode"
                style={{ width: '100%', height: '100%' }}
            />
            {/* Gradient Removed to show full earth */}
        </div>
    );
}
