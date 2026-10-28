import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { themes } from '../lib/data';
import { scrollVelocity } from '../lib/scroll';

/*
 * Procedural 3D space behind everything:
 *  - a domain-warped nebula with a Milky-Way band and dust lanes, rendered at half resolution;
 *  - a volume of stars the camera travels through as you scroll (parallax + warp on fast scroll);
 *  - a far star shell for density.
 * Colours come from the active theme and blend smoothly when it changes.
 */

const NEBULA_FRAG = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uOff;
uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3;
uniform float uDensity;

float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a * noise(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s; }

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.01;

  // far layer, slow parallax
  vec2 p1 = uv * 1.5 + uOff * 0.22;
  vec3 q = vec3(p1, t);
  float w1 = fbm(q + vec3(0.0, 0.0, t));
  float w2 = fbm(q + vec3(5.2, 1.3, -t));
  float n = fbm(vec3(p1 + 1.7 * vec2(w1, w2), t * 1.4) * 1.25);

  // diagonal galactic band that wobbles with the warp field
  float bandD = (uv.y * 0.95 + uv.x * 0.5 + uOff.y * 0.12 - 0.05 + (w1 - 0.5) * 0.55) / 0.45;
  float band = exp(-bandD * bandD);
  float dens = smoothstep(0.32, 0.95, n) * mix(0.28, 1.0, band);
  float dust = smoothstep(0.48, 0.78, fbm(vec3(p1 * 3.2 + 4.0, t * 2.0)));

  vec3 col = uC0 * 0.75;
  col = mix(col, uC1, smoothstep(0.12, 0.62, dens) * 0.9);
  col = mix(col, uC2, smoothstep(0.5, 0.95, dens) * 0.75);
  col += uC3 * pow(smoothstep(0.55, 1.0, n * band + w2 * 0.25), 3.0) * 0.55;
  col += uC2 * band * 0.07;
  col *= mix(1.0, 0.4, dust * band);

  // near wisps, stronger parallax: gives the depth between layers
  vec2 p2 = uv * 2.7 + uOff * 0.62 + 10.0;
  float n2 = fbm(vec3(p2 + (w1 - 0.5), t * 2.2));
  col += mix(uC3, uC2, 0.4) * smoothstep(0.6, 0.92, n2) * 0.16;

  float v = smoothstep(1.35, 0.15, length(uv * vec2(0.85, 1.0)));
  col *= mix(0.5, 1.0, v);
  col = mix(uC0 * 0.4, col, uDensity) * 0.85;
  gl_FragColor = vec4(col, 1.0);
}
`;

const QUAD_VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
const BLIT_FRAG = 'uniform sampler2D tMap; varying vec2 vUv; void main(){ gl_FragColor = vec4(texture2D(tMap, vUv).rgb, 1.0); }';

const STAR_VERT = /* glsl */ `
attribute float aSize; attribute float aPhase; attribute vec3 aColor;
uniform float uTime; uniform float uTravel; uniform float uDepth; uniform float uPR; uniform float uWarp; uniform float uTravels;
varying vec3 vColor; varying float vAlpha; varying float vBig;
void main(){
  vec3 p = position;
  if (uTravels > 0.5) p.z = mod(p.z + uTravel, uDepth) - uDepth;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float depthFade = uTravels > 0.5 ? smoothstep(-uDepth, -uDepth * 0.75, p.z) * smoothstep(-0.6, -5.0, p.z) : 1.0;
  float tw = 0.7 + 0.3 * sin(uTime * (0.6 + fract(aPhase * 7.3) * 2.2) + aPhase * 6.2831);
  vAlpha = depthFade * tw;
  vColor = aColor;
  vBig = smoothstep(2.6, 4.0, aSize);
  float size = aSize * uPR * (uTravels > 0.5 ? 26.0 / -mv.z : 1.0) * (1.0 + uWarp * 0.5);
  gl_PointSize = clamp(size, 0.0, 48.0 * uPR);
  gl_Position = projectionMatrix * mv;
}
`;

const STAR_FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha; varying float vBig;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float core = exp(-d * d * 60.0);
  float halo = exp(-d * 9.0) * 0.22;
  float spikes = (max(0.0, 1.0 - abs(c.x) * 24.0) * max(0.0, 1.0 - abs(c.y) * 2.1)
                + max(0.0, 1.0 - abs(c.y) * 24.0) * max(0.0, 1.0 - abs(c.x) * 2.1)) * vBig * 0.55;
  float a = (core + halo + spikes) * vAlpha * smoothstep(0.5, 0.42, d);
  gl_FragColor = vec4(vColor * a, 1.0);
}
`;

// Hex values are used as display values as-is (the shaders skip colour management).
const hex = (h: string) => new THREE.Color().setStyle(h, THREE.LinearSRGBColorSpace);

function themeColors(id: string) {
  const t = themes.find((x) => x.id === id) ?? themes[0];
  return { neb: t.neb.map(hex), tint: hex(t.a), density: t.density };
}

export default function Space() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
    } catch {
      canvas.style.display = 'none';
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = () => window.innerWidth < 820;
    const pr = () => Math.min(window.devicePixelRatio, small() ? 1.5 : 1.75);
    renderer.setPixelRatio(pr());
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // shaders write display values directly

    /* --- nebula pass (half resolution) --- */
    const rtScale = small() ? 0.4 : 0.5;
    const rt = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false });
    const nebScene = new THREE.Scene();
    const nebCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const start = themeColors(document.documentElement.dataset.theme || 'nebula');
    const nebU = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uOff: { value: new THREE.Vector2() },
      uC0: { value: start.neb[0].clone() },
      uC1: { value: start.neb[1].clone() },
      uC2: { value: start.neb[2].clone() },
      uC3: { value: start.neb[3].clone() },
      uDensity: { value: start.density },
    };
    const quad = new THREE.PlaneGeometry(2, 2);
    nebScene.add(new THREE.Mesh(quad, new THREE.ShaderMaterial({ uniforms: nebU, vertexShader: QUAD_VERT, fragmentShader: NEBULA_FRAG, depthTest: false, depthWrite: false })));

    /* --- main scene: nebula blit + stars --- */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 400);
    const blit = new THREE.Mesh(
      quad,
      new THREE.ShaderMaterial({ uniforms: { tMap: { value: rt.texture } }, vertexShader: QUAD_VERT, fragmentShader: BLIT_FRAG, depthTest: false, depthWrite: false }),
    );
    blit.frustumCulled = false;
    blit.renderOrder = -10;
    scene.add(blit);

    const DEPTH = 130;
    const starU = {
      uTime: { value: 0 },
      uTravel: { value: 0 },
      uDepth: { value: DEPTH },
      uPR: { value: renderer.getPixelRatio() },
      uWarp: { value: 0 },
      uTravels: { value: 1 },
    };
    const palette = ['#ffffff', '#cfe0ff', '#a9c4ff', '#ffe2c4', '#ffd0a0'].map(hex);
    const tintAttrs: { attr: THREE.BufferAttribute; idx: number[] }[] = [];

    const makeStars = (count: number, travel: boolean) => {
      const pos = new Float32Array(count * 3);
      const size = new Float32Array(count);
      const phase = new Float32Array(count);
      const col = new Float32Array(count * 3);
      const tinted: number[] = [];
      for (let i = 0; i < count; i++) {
        if (travel) {
          pos[i * 3] = (Math.random() * 2 - 1) * 150;
          pos[i * 3 + 1] = (Math.random() * 2 - 1) * 90;
          pos[i * 3 + 2] = -Math.random() * DEPTH;
        } else {
          const th = Math.random() * Math.PI * 2;
          const ph = Math.acos(2 * Math.random() - 1);
          const r = 300;
          pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
          pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
          pos[i * 3 + 2] = r * Math.cos(ph);
        }
        const big = Math.random();
        size[i] = travel ? (big > 0.985 ? 3 + Math.random() * 1.6 : 0.9 + Math.pow(Math.random(), 2.5) * 2.2) : 1 + Math.random() * 1.6;
        phase[i] = Math.random();
        const c = Math.random() < 0.12 ? (tinted.push(i), start.tint) : palette[(Math.random() * palette.length) | 0];
        const bright = travel ? 1 : 0.55 + Math.random() * 0.4;
        col[i * 3] = c.r * bright;
        col[i * 3 + 1] = c.g * bright;
        col[i * 3 + 2] = c.b * bright;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
      g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
      const colAttr = new THREE.BufferAttribute(col, 3);
      g.setAttribute('aColor', colAttr);
      tintAttrs.push({ attr: colAttr, idx: tinted });
      const m = new THREE.ShaderMaterial({
        uniforms: travel ? starU : { ...starU, uTravels: { value: 0 } },
        vertexShader: STAR_VERT,
        fragmentShader: STAR_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const pts = new THREE.Points(g, m);
      pts.frustumCulled = false;
      return pts;
    };
    const near = makeStars(small() ? 3500 : 8000, true);
    const far = makeStars(small() ? 1800 : 3500, false);
    scene.add(far, near);

    /* --- theme --- */
    let target = start;
    const applyTheme = () => {
      target = themeColors(document.documentElement.dataset.theme || 'nebula');
      tintAttrs.forEach(({ attr, idx }) => {
        idx.forEach((i) => attr.setXYZ(i, target.tint.r, target.tint.g, target.tint.b));
        attr.needsUpdate = true;
      });
    };
    window.addEventListener('themechange', applyTheme);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setPixelRatio(pr());
      renderer.setSize(w, h);
      starU.uPR.value = renderer.getPixelRatio();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const rw = Math.max(2, Math.round(w * rtScale));
      const rh = Math.max(2, Math.round(h * rtScale));
      rt.setSize(rw, rh);
      nebU.uRes.value.set(rw, rh);
    };
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let last = performance.now();
    let time = 0;
    let warp = 0;
    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = 1 - Math.pow(0.002, dt);
      if (!reduced) time += dt;

      const v = reduced ? 0 : scrollVelocity();
      warp += (Math.min(1, Math.abs(v) / 45) - warp) * k;
      starU.uTime.value = time;
      starU.uWarp.value = warp;
      if (!reduced) starU.uTravel.value += dt * 1.1 + v * 0.05;

      mouse.x += (mouse.tx - mouse.x) * k * 0.6;
      mouse.y += (mouse.ty - mouse.y) * k * 0.6;
      camera.rotation.y = -mouse.x * 0.035;
      camera.rotation.x = -mouse.y * 0.025;
      far.rotation.y = time * 0.004 + window.scrollY * 0.00004;

      // smooth theme blend
      const cs = [nebU.uC0, nebU.uC1, nebU.uC2, nebU.uC3];
      cs.forEach((u, i) => u.value.lerp(target.neb[i], k * 0.5));
      nebU.uDensity.value += (target.density - nebU.uDensity.value) * k * 0.5;
      nebU.uTime.value = time;
      nebU.uOff.value.set(mouse.x * 0.08, -window.scrollY / window.innerHeight * 0.14 - mouse.y * 0.05);

      renderer.setRenderTarget(rt);
      renderer.render(nebScene, nebCam);
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('themechange', applyTheme);
      [scene, nebScene].forEach((s) =>
        s.traverse((o) => {
          const m = o as THREE.Mesh;
          m.geometry?.dispose?.();
          const mat = m.material as THREE.Material | undefined;
          mat?.dispose?.();
        }),
      );
      rt.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="space" aria-hidden />;
}
