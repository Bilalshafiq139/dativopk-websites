// Product page 3D viewer: drag to rotate, scroll/pinch to zoom, and a "load-shedding" switch that
// dims the light so you can see the battery LEDs take over.
import { THREE, buildProduct, makeRenderer, studioEnv, C } from "./model.js";
import { OrbitControls } from "./vendor/addons/OrbitControls.js";

export function startViewer(canvas, model) {
  let renderer;
  try { renderer = makeRenderer(canvas); } catch { return null; }
  const scene = new THREE.Scene(); studioEnv(renderer, scene);
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 4); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 6;
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 }); scene.add(key);
  const rim = new THREE.DirectionalLight(C.lime, 0.7); rim.position.set(-4, 2, -3); scene.add(rim);
  const glow = new THREE.PointLight(C.amber, 0, 3, 1.5); scene.add(glow);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.35 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  const obj = buildProduct(model);
  const s = obj.userData.size;
  if (model.kind === "ups") obj.position.y = s.h / 2 + 0.03;
  scene.add(obj);
  glow.position.set(0, s.h * 0.6, s.d / 2 + 0.5);

  const big = Math.max(s.w, s.h * 1.4, s.d);
  const cam = new THREE.PerspectiveCamera(30, 1, 0.05, 60);
  const ty = model.kind === "station" ? s.h * 0.55 : model.kind === "cable" ? 0.15 : s.h * 0.4;
  cam.position.set(big * 1.45, big * 0.95 + ty, big * 2.2);
  const ctl = new OrbitControls(cam, canvas);
  ctl.target.set(0, ty, 0); ctl.enableDamping = true; ctl.dampingFactor = 0.08; ctl.enablePan = false;
  ctl.minDistance = big * 1.4; ctl.maxDistance = big * 4.5; ctl.maxPolarAngle = Math.PI * 0.49;
  ctl.autoRotate = true; ctl.autoRotateSpeed = 1.1;
  ctl.addEventListener("start", () => { ctl.autoRotate = false; });
  ctl.update();

  const resize = () => { const r = canvas.parentElement.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); cam.aspect = r.width / r.height; cam.updateProjectionMatrix(); };
  resize(); addEventListener("resize", resize);

  let dark = false, room = 1, visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  const clock = new THREE.Clock();
  (function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime();
    room += ((dark ? 0 : 1) - room) * 0.08;
    key.intensity = 0.15 + 2.1 * room; rim.intensity = 0.2 + 0.5 * room; scene.environmentIntensity = 0.08 + 0.85 * room;
    glow.intensity = dark && model.kind !== "cable" ? 1.4 : 0;
    obj.userData.setMode?.(dark ? "battery" : "charging");
    obj.userData.update(t);
    ctl.update(); renderer.render(scene, cam);
  })();
  obj.userData.setLevel?.(0.8);
  return { setDark(v) { dark = v; obj.userData.setLevel?.(v ? 0.75 : 0.8); } };
}
