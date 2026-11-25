// Live hero: a matte clay molar that turns slowly and leans towards the cursor.
import * as THREE from "three";
import { makeMolar, stage } from "./models.js";

export function mount(frame) {
  const canvasHost = document.createElement("div");
  canvasHost.style.cssText = "position:absolute;inset:0";
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  } catch { return; } // no WebGL: keep the static image
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  canvasHost.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  cam.position.set(0, 1.0, 13.5);
  cam.lookAt(0, -0.2, 0);

  const tooth = makeMolar();
  const pivot = new THREE.Group();
  pivot.add(tooth);
  tooth.position.y = 0.35;
  pivot.rotation.set(0.22, 0.6, -0.1);
  scene.add(pivot);
  stage(scene, { floorY: -2.75, shadow: 0.13 });

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let tx = 0, ty = 0, mx = 0, my = 0, visible = true, t0 = performance.now();

  function size() {
    const w = frame.clientWidth, h = frame.clientHeight;
    renderer.setSize(w, h, false);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
    cam.aspect = w / h;
    cam.fov = w / h < 0.85 ? 30 : 26;
    cam.updateProjectionMatrix();
  }
  addEventListener("resize", size);
  addEventListener("pointermove", e => { tx = (e.clientX / innerWidth - 0.5) * 2; ty = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(frame);

  function tick(now) {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = (now - t0) / 1000;
    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    pivot.rotation.y = 0.6 + (reduce ? 0 : t * 0.18) + mx * 0.35;
    pivot.rotation.x = 0.22 + my * 0.12;
    tooth.position.y = 0.35 + (reduce ? 0 : Math.sin(t * 0.9) * 0.08);
    renderer.render(scene, cam);
  }
  size();
  frame.appendChild(canvasHost);
  requestAnimationFrame(tick);
  const fb = frame.querySelector(".fallback");
  if (fb) { fb.style.transition = "opacity .6s"; requestAnimationFrame(() => requestAnimationFrame(() => { fb.style.opacity = 0; })); }
}
