"use client";

import React, { useRef } from "react";
import { AnimatedBeam } from "./magicui/AnimatedBeam";
import { cn } from "../lib/utils";
import { Gamepad2, User } from "lucide-react";

const Circle = React.forwardRef(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        "border-lime-500/30 bg-black shadow-lime-500/10 shadow-lg", // Dark theme adjustments
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function ConnectNetworkBeam({ className }) {
  const containerRef = useRef(null);
  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);
  const div4Ref = useRef(null);
  const div5Ref = useRef(null);
  const div6Ref = useRef(null);
  const div7Ref = useRef(null);

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden p-10",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-row items-stretch justify-between gap-12 max-w-2xl">
        <div className="flex flex-col justify-center gap-4">
          <Circle ref={div1Ref}>
            <img
                src="https://avatar.vercel.sh/jack"
                alt="User"
                className="h-full w-full rounded-full object-cover"
            />
          </Circle>
          <Circle ref={div2Ref}>
            <img
                src="https://avatar.vercel.sh/jill"
                alt="User"
                className="h-full w-full rounded-full object-cover"
            />
          </Circle>
          <Circle ref={div3Ref}>
            <img
                src="https://avatar.vercel.sh/john"
                alt="User"
                className="h-full w-full rounded-full object-cover"
            />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div4Ref} className="h-24 w-24 border-lime-400 bg-lime-500 shadow-lime-500/50 shadow-2xl">
            <Gamepad2 className="h-12 w-12 text-black" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-4">
          <Circle ref={div5Ref}>
             <img
                src="https://avatar.vercel.sh/jane"
                alt="User"
                className="h-full w-full rounded-full object-cover"
            />
          </Circle>
          <Circle ref={div6Ref}>
             <img
                src="https://avatar.vercel.sh/doe"
                alt="User"
                className="h-full w-full rounded-full object-cover"
            />
          </Circle>
           <Circle ref={div7Ref}>
             <img
                src="https://avatar.vercel.sh/smith"
                alt="User"
                className="h-full w-full rounded-full object-cover"
            />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        pathWidth={3}
        pathColor="#ffffff"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        pathWidth={3}
        pathColor="#ffffff"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        pathWidth={3}
        pathColor="#ffffff"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div5Ref}
        pathWidth={3}
        pathColor="#ffffff"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
        pathWidth={3}
        pathColor="#ffffff"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div7Ref}
        pathWidth={3}
        pathColor="#ffffff"
      />
    </div>
  );
}
