import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { sectionAnchors, sectionProgress } from '../lib/scroll';

type Pose = { x: number; y: number; s: number; o: number; sx: number; sy: number; so: number };

/*
 * One pose per section (SECTIONS order). x/y are fractions of the half-viewport; positive x is the side
 * opposite the text (flipped for RTL), s is scale, o is canvas opacity. sx/sy/so place the sun the same way
 * (far behind the planet) with its brightness. The sun is the light source, so as it travels across the sky
 * the day/night line sweeps over the Earth. Each pose holds while its section is read and blends into the next.
 */
const DESKTOP: Pose[] = [
  { x: 0.52, y: 0, s: 0.86, o: 1, sx: 0.86, sy: 0.64, so: 1 }, // hero — sun in the upper outer corner
  { x: 0.56, y: 0.02, s: 0.72, o: 0.9, sx: 0.2, sy: 0.88, so: 0.85 }, // about — sun crosses the top
  { x: 0, y: -1.78, s: 2.35, o: 0.7, sx: 0.9, sy: -0.42, so: 1 }, // work — sunrise at the edge of the planet horizon
  { x: 0.64, y: 0, s: 0.62, o: 0.45, sx: 0.98, sy: -0.15, so: 0.7 }, // journey
  { x: 0, y: 0.08, s: 0.85, o: 0.4, sx: -0.9, sy: 0.8, so: 0.8 }, // skills
  { x: 0.52, y: 0, s: 0.95, o: 0.95, sx: 0.96, sy: -0.75, so: 1 }, // contact — sunset low on the outer side
];
const MOBILE: Pose[] = [
  { x: 0, y: 0.56, s: 0.5, o: 0.95, sx: 0.85, sy: 0.92, so: 0.9 },
  { x: 0, y: -0.6, s: 0.55, o: 0.3, sx: -0.8, sy: 0.3, so: 0.7 },
  { x: 0, y: -1.55, s: 1.6, o: 0.5, sx: 0.1, sy: -0.45, so: 1 },
  { x: 0, y: 0, s: 0.5, o: 0.16, sx: 0.8, sy: 0.5, so: 0.6 },
  { x: 0, y: 0, s: 0.5, o: 0.2, sx: -0.8, sy: 0.6, so: 0.6 },
  { x: 0, y: -0.55, s: 0.62, o: 0.45, sx: 0.8, sy: -0.95, so: 0.9 },
];
const POSE_KEYS = ['x', 'y', 's', 'o', 'sx', 'sy', 'so'] as const;
const SUN_Z = -8; // the sun sits behind the planet, so the Earth can pass in front of it

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const EARTH_VERT = /* glsl */ `
varying vec2 vUv; varying vec3 vN; varying vec3 vP;
void main(){
  vUv = uv;
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vP = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const EARTH_FRAG = /* glsl */ `
uniform sampler2D uDay; uniform sampler2D uNight; uniform sampler2D uBrc;
uniform vec3 uSun; uniform float uCloud; uniform vec3 uAtmoDay; uniform vec3 uAtmoTwi;
varying vec2 vUv; varying vec3 vN; varying vec3 vP;

void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vP);
  vec3 L = normalize(uSun);
  vec4 brc = texture2D(uBrc, vUv);

  float ndl = dot(N, L);
  float dayMix = smoothstep(-0.22, 0.42, ndl);

  vec2 cuv = vUv + vec2(uCloud, 0.0);
  float cl = smoothstep(0.18, 0.95, texture2D(uBrc, cuv).b);
  float shadow = smoothstep(0.18, 0.95, texture2D(uBrc, cuv + vec2(0.0022, -0.0012)).b);

  vec3 day = texture2D(uDay, vUv).rgb;
  float lambert = max(ndl, 0.0);
  vec3 col = day * (lambert * 1.25) * (1.0 - shadow * 0.5);

  // sun glint on the oceans (low roughness in the green channel)
  float ocean = 1.0 - smoothstep(0.08, 0.45, brc.g);
  vec3 H = normalize(L + V);
  float nh = max(dot(N, H), 0.0);
  col += vec3(1.0, 0.92, 0.78) * (pow(nh, 120.0) * 0.7 + pow(nh, 18.0) * 0.06) * ocean * (1.0 - cl) * dayMix;

  // clouds, lit by the sun
  vec3 cloudCol = vec3(1.0) * (max(ndl, 0.0) * 1.05 + 0.015);
  col = mix(col, cloudCol, cl * 0.95);

  // city lights on the night side
  vec3 night = texture2D(uNight, vUv).rgb;
  col += night * vec3(1.0, 0.82, 0.55) * 2.2 * (1.0 - dayMix) * (1.0 - cl * 0.9);

  // atmosphere scattering at the limb, warm at the terminator
  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.4);
  vec3 atmo = mix(uAtmoTwi, uAtmoDay, smoothstep(-0.05, 0.45, ndl));
  float amt = fres * smoothstep(-0.3, 0.55, ndl);
  col = mix(col, atmo, amt * 0.75) + atmo * amt * 0.2;

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

const ATMO_VERT = /* glsl */ `
varying vec3 vN; varying vec3 vP;
void main(){
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vP = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

// Rendered on the back faces of a slightly larger sphere: bright at the limb, fading outwards, sun side only.
const ATMO_FRAG = /* glsl */ `
uniform vec3 uSun; uniform vec3 uAtmoDay; uniform vec3 uAtmoTwi; uniform float uEdge; uniform float uPow; uniform float uGain;
varying vec3 vN; varying vec3 vP;
void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vP);
  float d = clamp(-dot(N, V) / uEdge, 0.0, 1.0);
  float i = pow(d, uPow);
  float sl = dot(N, normalize(uSun));
  float lit = smoothstep(-0.45, 0.55, sl);
  vec3 c = mix(uAtmoTwi, uAtmoDay, smoothstep(-0.15, 0.45, sl));
  vec3 o = c * i * lit * uGain;
  gl_FragColor = vec4(o, max(o.r, max(o.g, o.b)));
  #include <colorspace_fragment>
}
`;

// Camera-facing quad centred on uCenter (the camera never rotates, so view space is enough)
const SPRITE_VERT = /* glsl */ `
uniform vec3 uCenter; uniform float uSize;
varying vec2 vUv;
void main(){
  vUv = uv * 2.0 - 1.0;
  vec4 mv = viewMatrix * vec4(uCenter, 1.0);
  mv.xy += position.xy * uSize;
  gl_Position = projectionMatrix * mv;
}
`;

// Sun: hot core, warm corona, slowly turning rays and an anamorphic streak
const SUN_FRAG = /* glsl */ `
uniform float uTime; uniform float uAlpha;
varying vec2 vUv;
void main(){
  float r = length(vUv);
  float a = atan(vUv.y, vUv.x);
  float core = smoothstep(0.075, 0.052, r);
  float glow = exp(-r * 9.0) * 1.9 + exp(-r * 3.0) * 0.5;
  float rays = (0.5 + 0.5 * sin(a * 14.0 + uTime * 0.35)) * (0.5 + 0.5 * sin(a * 23.0 - uTime * 0.25));
  rays = pow(rays, 3.0) * exp(-r * 3.8) * 0.75;
  float streak = exp(-abs(vUv.y) * 110.0) * exp(-abs(vUv.x) * 2.4) * 0.7;
  vec3 col = vec3(1.0, 0.98, 0.92) * core * 3.2 + vec3(1.0, 0.8, 0.5) * glow + vec3(1.0, 0.72, 0.42) * rays + vec3(0.75, 0.85, 1.0) * streak;
  col *= uAlpha * smoothstep(1.0, 0.75, r);
  gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0));
}
`;

// Lens-flare ghost: a faint tinted disc with a brighter rim
const GHOST_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uAlpha;
varying vec2 vUv;
void main(){
  float r = length(vUv);
  float d = smoothstep(1.0, 0.86, r) * (0.3 + 0.7 * smoothstep(0.35, 0.98, r));
  vec3 col = uColor * d * uAlpha;
  gl_FragColor = vec4(col, max(col.r, max(col.g, col.b)));
}
`;

export default function Earth() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      canvas.style.display = 'none';
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = () => window.innerWidth < 820;
    const dprCap = () => (small() ? 1.75 : 2);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap()));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 6;

    const sunDir = new THREE.Vector3(-1, 0.32, 0.62).normalize(); // follows the drawn sun every frame
    const sun = new THREE.DirectionalLight(0xffffff, 3.2);
    sun.position.copy(sunDir).multiplyScalar(10);
    scene.add(sun, new THREE.AmbientLight(0xffffff, 0.04));

    const group = new THREE.Group();
    const tilt = new THREE.Group();
    tilt.rotation.z = THREE.MathUtils.degToRad(23.4);
    group.add(tilt);
    scene.add(group);

    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const big = !small() && renderer.capabilities.maxTextureSize >= 4096;
    const res = big ? 4096 : 2048;
    let pending = 3;
    let loaded = 0;
    const done = () => {
      pending -= 1;
      if (pending <= 0) loaded = 1;
    };
    const tex = (url: string, srgb: boolean, track = true) => {
      const t = loader.load(url, track ? done : undefined, undefined, track ? done : undefined);
      t.anisotropy = Math.min(8, maxAniso);
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };

    const R = 1.3;
    const atmoDay = new THREE.Color(0.32, 0.62, 1.0);
    const atmoTwi = new THREE.Color(1.0, 0.45, 0.22);
    const shared = { uSun: { value: sunDir }, uAtmoDay: { value: atmoDay }, uAtmoTwi: { value: atmoTwi } };

    const seg = small() ? 72 : 128;
    const earthU = {
      ...shared,
      uDay: { value: tex(`/textures/earth_day_${res}.jpg`, true) },
      uNight: { value: tex(`/textures/earth_night_${res}.jpg`, true) },
      uBrc: { value: tex(`/textures/earth_bump_roughness_clouds_${res}.jpg`, false) },
      uCloud: { value: 0 },
    };
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(R, seg, seg),
      new THREE.ShaderMaterial({ uniforms: earthU, vertexShader: EARTH_VERT, fragmentShader: EARTH_FRAG }),
    );
    tilt.add(earth);

    const shell = (scale: number, edge: number, pow: number, gain: number) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(R * scale, 96, 96),
        new THREE.ShaderMaterial({
          uniforms: { ...shared, uEdge: { value: edge }, uPow: { value: pow }, uGain: { value: gain } },
          vertexShader: ATMO_VERT,
          fragmentShader: ATMO_FRAG,
          side: THREE.BackSide,
          transparent: true,
          depthWrite: false,
          blending: THREE.CustomBlending,
          blendSrc: THREE.OneFactor,
          blendDst: THREE.OneFactor,
          blendSrcAlpha: THREE.OneFactor,
          blendDstAlpha: THREE.OneFactor,
        }),
      );
      group.add(m);
      return m;
    };
    // edge = cos of the angle where the shell meets the planet's silhouette
    const cosEdge = (k: number) => Math.sqrt(1 - 1 / (k * k));
    shell(1.035, cosEdge(1.035), 2.2, 1.35); // thin bright limb
    shell(1.22, cosEdge(1.22), 2.6, 0.38); // soft halo

    // Moon on an inclined orbit, lit by the same sun
    const orbit = new THREE.Group();
    orbit.rotation.set(0.32, 0, 1.05);
    group.add(orbit);
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.27, 64, 64),
      new THREE.MeshStandardMaterial({ map: tex('/textures/moon_1024.jpg', true, false), roughness: 1, metalness: 0 }),
    );
    orbit.add(moon);
    const ORBIT_R = 2.6;

    const additive = {
      transparent: true,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneFactor,
    } as const;
    const quad = new THREE.PlaneGeometry(1, 1);
    const sunU = { uCenter: { value: new THREE.Vector3(0, 0, SUN_Z) }, uSize: { value: 4 }, uTime: { value: 0 }, uAlpha: { value: 0 } };
    const sunMesh = new THREE.Mesh(quad, new THREE.ShaderMaterial({ uniforms: sunU, vertexShader: SPRITE_VERT, fragmentShader: SUN_FRAG, ...additive }));
    sunMesh.frustumCulled = false;
    scene.add(sunMesh);

    // flare ghosts sit on the line from the sun through the screen centre
    const ghosts = [
      { t: 1.35, size: 0.34, color: '#7fb4ff', a: 0.09 },
      { t: 1.75, size: 0.16, color: '#c79bff', a: 0.13 },
      { t: 2.3, size: 0.6, color: '#ffb27a', a: 0.05 },
    ].map((g) => {
      const u = { uCenter: { value: new THREE.Vector3() }, uSize: { value: g.size }, uColor: { value: new THREE.Color(g.color) }, uAlpha: { value: 0 } };
      const m = new THREE.Mesh(quad, new THREE.ShaderMaterial({ uniforms: u, vertexShader: SPRITE_VERT, fragmentShader: GHOST_FRAG, ...additive, depthTest: false }));
      m.frustumCulled = false;
      scene.add(m);
      return { ...g, u };
    });
    const ndc = new THREE.Vector3();
    const earthNdc = new THREE.Vector3();

    // Section anchors drive the scroll choreography
    let anchors: number[] = [];
    const measure = () => {
      anchors = sectionAnchors();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const onResize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap()));
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      measure();
    };
    window.addEventListener('resize', onResize);

    const cur: Pose = { ...(small() ? MOBILE[0] : DESKTOP[0]) };
    let fade = 0;
    let last = performance.now();
    let spin = 0;
    let moonA = 5.4;
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const { i, f } = sectionProgress(anchors);
      const poses = small() ? MOBILE : DESKTOP;
      const a = poses[Math.min(i, poses.length - 1)];
      const b = poses[Math.min(i + 1, poses.length - 1)];
      const e = ease(f);
      const k = 1 - Math.pow(0.0025, dt); // frame-rate independent smoothing
      POSE_KEYS.forEach((key) => {
        cur[key] = lerp(cur[key], lerp(a[key], b[key], e), k);
      });

      fade = lerp(fade, loaded, Math.min(1, dt * 1.6));
      const intro = ease(Math.min(1, fade));

      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const halfW = halfH * camera.aspect;
      const side = document.documentElement.dir === 'rtl' ? -1 : 1; // keep the planet opposite the text
      group.position.set(cur.x * side * halfW, cur.y * halfH - (1 - intro) * 0.4, 0);
      group.scale.setScalar(cur.s * (0.82 + 0.18 * intro));

      // Sun: placed in the far plane, and the light comes from where it is drawn
      const farH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (camera.position.z - SUN_Z);
      const sunPos = sunU.uCenter.value.set(cur.sx * side * farH * camera.aspect, cur.sy * farH, SUN_Z);
      sunDir.set(sunPos.x - group.position.x, sunPos.y - group.position.y, 4.5).normalize();
      sun.position.copy(sunDir).multiplyScalar(10);
      sunU.uTime.value = now / 1000;
      sunU.uSize.value = small() ? 4.8 : 6.6;

      // the flare fades while the planet covers the sun
      ndc.copy(sunPos).project(camera);
      earthNdc.copy(group.position).project(camera);
      const rEarth = (R * group.scale.x) / halfH; // planet radius in NDC-y units
      const dist = Math.hypot((ndc.x - earthNdc.x) * camera.aspect, ndc.y - earthNdc.y);
      const clear = THREE.MathUtils.smoothstep(dist, rEarth * 0.9, rEarth * 1.25);
      const onScreen = 1 - THREE.MathUtils.smoothstep(Math.max(Math.abs(ndc.x), Math.abs(ndc.y)), 1.05, 1.4);
      sunU.uAlpha.value = cur.so * intro * (0.35 + 0.65 * clear);
      ghosts.forEach((g) => {
        g.u.uCenter.value.set(-ndc.x * (g.t - 1) * halfW, -ndc.y * (g.t - 1) * halfH, 0);
        g.u.uAlpha.value = g.a * cur.so * clear * onScreen * intro;
      });

      mouse.x = lerp(mouse.x, mouse.tx, k * 0.5);
      mouse.y = lerp(mouse.y, mouse.ty, k * 0.5);
      if (!reduced) {
        spin += dt * 0.045;
        moonA += dt * 0.12;
      }
      const scrollSpin = window.scrollY * 0.0011;
      earth.rotation.y = spin + scrollSpin + mouse.x * 0.3 - (1 - intro) * 1.2;
      earthU.uCloud.value = (spin * 0.12 + scrollSpin * 0.05) % 1;
      tilt.rotation.x = 0.16 + mouse.y * 0.14;
      // the moon travels a good part of its orbit while scrolling, passing in front of and behind the planet
      const moonAngle = moonA + window.scrollY * 0.0024;
      moon.position.set(Math.cos(moonAngle) * ORBIT_R, 0, Math.sin(moonAngle) * ORBIT_R);
      moon.rotation.y = -moonA;

      canvas.style.opacity = String(cur.o * fade);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
      });
      [earthU.uDay.value, earthU.uNight.value, earthU.uBrc.value].forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="earth" aria-hidden />;
}
