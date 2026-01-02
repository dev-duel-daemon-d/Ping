import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

export const Globe = ({ className }) => {
    const canvasRef = useRef();

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 2.5,
            mapSamples: 16000,
            mapBrightness: 12,
            baseColor: [0.8, 0.6, 0.1],
            markerColor: [1, 0.9, 0.2],
            glowColor: [1, 0.9, 0.3],
            opacity: 1,
            markers: [
                // longitude latitude
                { location: [37.7595, -122.4367], size: 0.03 },
                { location: [40.7128, -74.006], size: 0.1 },
            ],
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.01;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <div
            className={cn(
                "absolute left-1/2 -translate-x-1/2 aspect-square w-full max-w-[600px]",
                className,
            )}
        >
            <canvas
                ref={(el) => {
                    canvasRef.current = el;
                    if (el) el.style.opacity = 1;
                }}
                style={{
                    width: "100%",
                    height: "100%",
                    transition: "opacity 1s ease",
                }}
                onContextMenu={(e) => e.preventDefault()}
            />
        </div>
    );
};
