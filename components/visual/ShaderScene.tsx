"use client";

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export function ShaderScene() {
  return (
    <ShaderGradientCanvas style={{ width: "100%", height: "100%" }} pointerEvents="none">
      <ShaderGradient
        animate="on"
        type="plane"
        uSpeed={0.25}
        uStrength={1.4}
        uDensity={1.1}
        uFrequency={5.5}
        uAmplitude={0}
        positionX={-0.5}
        positionY={0.1}
        positionZ={0}
        rotationX={0}
        rotationY={0}
        rotationZ={0}
        color1="#E9FF6B"
        color2="#1A5CFF"
        color3="#FF2FB8"
      />
    </ShaderGradientCanvas>
  );
}
