"use client";
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type CSSProperties,
} from "react";
type RaysOrigin =
  | "top-center"
  | "top-left"
  | "top-right"
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "left"
  | "right";
interface PremiumBackgroundProps {
  raysOrigin?: RaysOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
  opacity?: number;
}
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  return [r, g, b];
}
function getRayOriginAndDir(
  origin: RaysOrigin,
  width: number,
  height: number
): { pos: [number, number]; dir: [number, number] } {
  switch (origin) {
    case "top-left":     return { pos: [0, -height * 0.2],          dir: [0.3, 1]  };
    case "top-right":    return { pos: [width, -height * 0.2],      dir: [-0.3, 1] };
    case "top-center":   return { pos: [width / 2, -height * 0.2],  dir: [0, 1]    };
    case "bottom-left":  return { pos: [0, height * 1.2],           dir: [0.3, -1] };
    case "bottom-right": return { pos: [width, height * 1.2],       dir: [-0.3,-1] };
    case "bottom-center":return { pos: [width / 2, height * 1.2],   dir: [0, -1]   };
    case "left":         return { pos: [-width * 0.2, height / 2],  dir: [1, 0]    };
    case "right":        return { pos: [width * 1.2, height / 2],   dir: [-1, 0]   };
    default:             return { pos: [width / 2, -height * 0.2],  dir: [0, 1]    };
  }
}
const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
const FRAG = `
precision highp float;
uniform float iTime;
uniform vec2  iResolution;
uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;
varying vec2 vUv;
float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2  sourceToCoord  = coord - raySource;
  vec2  dirNorm        = normalize(sourceToCoord);
  float cosAngle       = dot(dirNorm, rayRefDirection);
  float distortedAngle = cosAngle
      + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
  float dist          = length(sourceToCoord);
  float maxDist       = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDist - dist) / maxDist, 0.0, 1.0);
  float fadeFalloff   = clamp(
    (iResolution.x * fadeDistance - dist) / (iResolution.x * fadeDistance * 0.5),
    0.0, 1.0
  );
  float noiseVal = noiseAmount > 0.0
    ? noise(coord * 0.002 + iTime * 0.05) * noiseAmount : 0.0;
  float pulse = pulsating > 0.5 ? 0.8 + 0.2 * sin(iTime * 2.0) : 1.0;
  float baseStrength = clamp(
    (0.3 + 0.2 * cos(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)) +
    noiseVal,
    0.0, 1.0
  );
  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 mouseOffset = vec2(
    (mousePos.x - 0.5) * iResolution.x * mouseInfluence,
    (mousePos.y - 0.5) * iResolution.y * mouseInfluence
  );
  vec2 finalRayPos = rayPos + mouseOffset;
  vec2 finalRayDir = normalize(rayDir + vec2((mousePos.x - 0.5) * mouseInfluence * 0.5, 0.0));
  float r1 = rayStrength(finalRayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
  float r2 = rayStrength(finalRayPos, finalRayDir, coord, 22.9921, 45.3948,  1.0 * raysSpeed);
  float r3 = rayStrength(finalRayPos, finalRayDir, coord, 14.0071, 18.0234,  1.1 * raysSpeed);
  float totalRay  = clamp(r1 * 0.6 + r2 * 0.3 + r3 * 0.15, 0.0, 1.0);
  float brightness = totalRay;
  vec3 col = mix(vec3(brightness), raysColor * brightness, saturation);
  col += raysColor * pow(totalRay, 3.0) * 0.4;
  vec3 finalColor = mix(col, raysColor * (0.5 + brightness * 0.5), 0.6);
  float alpha = clamp(totalRay * 1.2, 0.0, 1.0);
  fragColor = vec4(finalColor * alpha, alpha);
}
void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;
export default function PremiumBackground({
  raysOrigin    = "top-center",
  raysColor     = "#60a5fa",
  raysSpeed     = 1.2,
  lightSpread   = 0.8,
  rayLength     = 1.8,
  pulsating     = false,
  fadeDistance  = 0.9,
  saturation    = 0.85,
  followMouse   = true,
  mouseInfluence = 0.08,
  noiseAmount   = 0.05,
  distortion    = 0.03,
  className     = "",
  opacity       = 35,
}: PremiumBackgroundProps) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const glRef           = useRef<WebGLRenderingContext | null>(null);
  const programRef      = useRef<WebGLProgram | null>(null);
  const rafRef          = useRef<number | null>(null);
  const startTimeRef    = useRef<number>(performance.now());
  const mouseRef        = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef  = useRef({ x: 0.5, y: 0.5 });
  const uniformsRef     = useRef<Record<string, WebGLUniformLocation | null>>({});
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!followMouse) return;
    const handler = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [followMouse]);
  const initGL = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const canvas = document.createElement("canvas");
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      canvas.width  = container.clientWidth  * dpr;
      canvas.height = container.clientHeight * dpr;
      canvas.style.width  = "100%";
      canvas.style.height = "100%";
      if (glRef.current) {
        glRef.current.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    resize();
    container.appendChild(canvas);
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    }) as WebGLRenderingContext | null;
    if (!gl) return;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    glRef.current = gl;
    const compile = (src: string, type: number) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(VERT, gl.VERTEX_SHADER));
    gl.attachShader(program, compile(FRAG, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    const uNames = [
      "iTime","iResolution","rayPos","rayDir","raysColor",
      "raysSpeed","lightSpread","rayLength","pulsating",
      "fadeDistance","saturation","mousePos","mouseInfluence",
      "noiseAmount","distortion",
    ];
    const locs: Record<string, WebGLUniformLocation | null> = {};
    uNames.forEach((n) => { locs[n] = gl.getUniformLocation(program, n); });
    uniformsRef.current = locs;
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    const draw = () => {
      const u = uniformsRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const t = (performance.now() - startTimeRef.current) / 1000;
      smoothMouseRef.current.x = smoothMouseRef.current.x * 0.92 + mouseRef.current.x * 0.08;
      smoothMouseRef.current.y = smoothMouseRef.current.y * 0.92 + mouseRef.current.y * 0.08;
      const { pos, dir } = getRayOriginAndDir(raysOrigin, w, h);
      const [cr, cg, cb] = hexToRgb(raysColor);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u.iTime,          t);
      gl.uniform2f(u.iResolution,    w, h);
      gl.uniform2f(u.rayPos,         pos[0], pos[1]);
      gl.uniform2f(u.rayDir,         dir[0], dir[1]);
      gl.uniform3f(u.raysColor,      cr, cg, cb);
      gl.uniform1f(u.raysSpeed,      raysSpeed);
      gl.uniform1f(u.lightSpread,    lightSpread);
      gl.uniform1f(u.rayLength,      rayLength);
      gl.uniform1f(u.pulsating,      pulsating ? 1 : 0);
      gl.uniform1f(u.fadeDistance,   fadeDistance);
      gl.uniform1f(u.saturation,     saturation);
      gl.uniform2f(u.mousePos,       smoothMouseRef.current.x, smoothMouseRef.current.y);
      gl.uniform1f(u.mouseInfluence, followMouse ? mouseInfluence : 0);
      gl.uniform1f(u.noiseAmount,    noiseAmount);
      gl.uniform1f(u.distortion,     distortion);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      glRef.current = null;
    };
  }, [
    raysOrigin, raysColor, raysSpeed, lightSpread, rayLength,
    pulsating, fadeDistance, saturation, followMouse,
    mouseInfluence, noiseAmount, distortion,
  ]);
  useEffect(() => {
    if (!visible) return;
    const cleanup = initGL();
    return cleanup;
  }, [visible, initGL]);
  const wrapperStyle: CSSProperties = { opacity: opacity / 100 };
  return (
    <div
      ref={containerRef}
      className={`w-full h-full pointer-events-none overflow-hidden ${className}`}
      style={wrapperStyle}
    />
  );
}
