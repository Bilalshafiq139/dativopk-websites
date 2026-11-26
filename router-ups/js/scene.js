// Home page 3D story: a desk with a wall socket and a WiFi router. Scrolling plays a load-shedding evening:
// the light goes and the WiFi dies, Jugnu is plugged in, the light goes again and the WiFi stays on.
import { THREE, buildUPS, buildRouter, buildSwitchboard, buildFlowCable, buildWifi, makeRenderer, studioEnv, C } from "./model.js";

const lerp = (a, b, k) => a + (b - a) * k;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (t) => 1 - Math.pow(1 - clamp(t), 3);
const range = (p, a, b) => clamp((p - a) / (b - a));

export function startStory({ canvas, section, onBeat, onHud }) {
  let renderer;
  try { renderer = makeRenderer(canvas); } catch { return false; }
  const small = innerWidth < 760;
  renderer.setPixelRatio(Math.min(small ? 1.5 : 2, devicePixelRatio || 1));
  const scene = new THREE.Scene();
  studioEnv(renderer, scene);
  scene.fog = new THREE.Fog(0x07090c, 14, 32);

  /* ---------- room ---------- */
  const deskTex = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 512; const g = c.getContext("2d");
    g.fillStyle = "#1a1d22"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 140; i++) { g.strokeStyle = `rgba(${i % 2 ? 255 : 0},${i % 2 ? 240 : 0},${i % 2 ? 220 : 0},${0.012 + Math.random() * 0.02})`; g.lineWidth = 1 + Math.random() * 3; g.beginPath(); const y = Math.random() * 512; g.moveTo(0, y); g.bezierCurveTo(170, y + Math.random() * 14 - 7, 340, y + Math.random() * 14 - 7, 512, y + Math.random() * 10 - 5); g.stroke(); }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 5); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  })();
  const desk = new THREE.Mesh(new THREE.BoxGeometry(30, 0.16, 14), new THREE.MeshStandardMaterial({ map: deskTex, color: 0x6a5a4a, roughness: 0.55, metalness: 0 }));
  desk.position.set(0, -0.08, 5.2); desk.receiveShadow = true; scene.add(desk);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), new THREE.MeshStandardMaterial({ color: 0x2a2f36, roughness: 0.95 }));
  wall.position.set(0, 3.6, -1.75); wall.receiveShadow = true; scene.add(wall);
  const board = buildSwitchboard(); board.position.set(-0.55, 1.2, -1.71); scene.add(board);

  /* ---------- devices ---------- */
  const router = buildRouter(); router.position.set(1.05, 0.17, -0.45); router.rotation.y = -0.42; scene.add(router);
  const wifi = buildWifi(); wifi.position.set(1.05, 1.55, -0.45); scene.add(wifi);
  const ups = buildUPS({ w: 1.7, h: 0.42, d: 1.12, color: 0x1b1e23, ports: ["12V", "9V", "USB"], sub: "MINI · 10400mAh" });
  const UPS_HOME = new THREE.Vector3(-0.75, 0.24, 0.55);
  ups.position.copy(UPS_HOME); ups.rotation.y = 0.32; scene.add(ups);
  scene.updateMatrixWorld(true);

  /* ---------- cables ---------- */
  const plug = board.localToWorld(board.userData.plugPos.clone());
  const rIn = router.localToWorld(new THREE.Vector3(-0.72, -0.03, -0.62));
  const wallDrop = (to, viaZ) => [plug, new THREE.Vector3(plug.x, plug.y - 0.4, plug.z + 0.06), new THREE.Vector3(plug.x + 0.05, 0.03, -1.55), new THREE.Vector3(lerp(plug.x, to.x, 0.5), 0.03, viaZ), ...to.extra, to];
  const direct = (() => { const t = rIn.clone(); t.extra = [new THREE.Vector3(rIn.x - 0.5, 0.03, rIn.z - 0.35)]; return buildFlowCable(wallDrop(t, -1.3)); })();
  scene.add(direct);
  const upsBack = ups.localToWorld(new THREE.Vector3(0.3, -0.02, -0.56));
  const toUps = (() => { const t = upsBack.clone(); t.extra = [new THREE.Vector3(upsBack.x - 0.1, 0.03, upsBack.z - 0.45)]; return buildFlowCable(wallDrop(t, -1.0)); })();
  const p12 = ups.localToWorld(ups.userData.ports["12V"].clone());
  const upsOut = buildFlowCable([p12, p12.clone().add(new THREE.Vector3(0.05, -0.03, 0.22)), new THREE.Vector3(p12.x + 0.35, 0.03, p12.z + 0.42),
    new THREE.Vector3(0.6, 0.03, 0.55), new THREE.Vector3(rIn.x - 0.25, 0.03, rIn.z + 0.05), new THREE.Vector3(rIn.x - 0.1, 0.03, rIn.z - 0.1), rIn]);
  const upsCables = new THREE.Group(); upsCables.add(toUps, upsOut); scene.add(upsCables);

  /* ---------- fireflies ---------- */
  const N = small ? 40 : 80, pos = new Float32Array(N * 3), seeds = [];
  for (let i = 0; i < N; i++) { seeds.push([Math.random() * 6 - 3, Math.random() * 2.6 + 0.3, Math.random() * 3 - 1.4, Math.random() * 10]); }
  const fGeo = new THREE.BufferGeometry(); fGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dot = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.25, "rgba(220,255,120,.6)"); r.addColorStop(1, "rgba(200,255,61,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  const fMat = new THREE.PointsMaterial({ size: 0.09, map: dot, color: C.lime, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  scene.add(new THREE.Points(fGeo, fMat));

  /* ---------- lights ---------- */
  const hemi = new THREE.HemisphereLight(0xfff1dc, 0x1a1410, 0.5); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffe6c4, 2.2); key.position.set(-2.5, 6, 3.5); key.castShadow = true;
  key.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048); key.shadow.radius = 5; key.shadow.bias = -0.0004;
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -3, near: 1, far: 15 }); scene.add(key);
  const moon = new THREE.DirectionalLight(0x6f8fff, 0.35); moon.position.set(5, 3, 2); scene.add(moon);
  const upsGlow = new THREE.PointLight(C.amber, 0, 2.6, 1.6); upsGlow.position.set(-0.6, 0.45, 1.25); scene.add(upsGlow);
  const wifiGlow = new THREE.PointLight(C.cyan, 0, 3, 1.5); wifiGlow.position.set(1.05, 1.0, -0.1); scene.add(wifiGlow);

  /* ---------- camera ---------- */
  const cam = new THREE.PerspectiveCamera(small ? 42 : 30, 1, 0.1, 50);
  const target = new THREE.Vector3(0.15, 0.55, -0.2);
  let W = 1, H = 1;
  function resize() {
    const r = canvas.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false); cam.aspect = W / H;
    // desktop: push the scene to the right of the copy; phone: push it up above the copy
    if (W > 860) cam.setViewOffset(W, H, -W * 0.2, 0, W, H); else cam.setViewOffset(W, H, 0, H * 0.17, W, H);
    cam.updateProjectionMatrix();
  }
  resize(); addEventListener("resize", resize);

  /* ---------- state ---------- */
  const st = { room: 1, env: 0.6, flash: 0 };
  let mx = 0, my = 0;
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });

  const progress = () => { const r = section.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };
  let visible = true, last = -1, lastPower = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(section);
  const clock = new THREE.Clock();
  const intro = performance.now();

  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime(), p = progress();

    // story timeline
    const beat = p < 0.15 ? 0 : p < 0.36 ? 1 : p < 0.56 ? 2 : p < 0.8 ? 3 : 4;
    if (beat !== last) { last = beat; onBeat(beat); }
    const power = !(p > 0.19 && p < 0.42) && !(p > 0.6 && p < 0.8);
    const upsIn = ease(range(p, 0.38, 0.47));
    const hasUps = upsIn > 0.98;
    if (power !== lastPower) { st.flash = 1; lastPower = power; }

    // jugnu drops in
    ups.visible = upsIn > 0.001;
    ups.position.set(UPS_HOME.x, UPS_HOME.y + (1 - upsIn) * 2.2, UPS_HOME.z);
    ups.rotation.set((1 - upsIn) * -0.5, 0.32 + (1 - upsIn) * 1.4, (1 - upsIn) * 0.3);
    ups.scale.setScalar(0.6 + 0.4 * upsIn);
    direct.visible = !hasUps; upsCables.visible = hasUps;

    // power + devices
    const routerOn = power || hasUps;
    router.userData.setOnline(routerOn);
    wifi.userData.setStrength(routerOn ? 1 : lerp(0.0, 0.5, Math.max(0, 1 - range(p, 0.2, 0.26))));
    wifi.visible = routerOn || p < 0.3;
    board.userData.setPower(power);
    const battery = hasUps && !power;
    const drain = range(p, 0.6, 0.8);
    ups.userData.setMode(!hasUps ? "mains" : battery ? "battery" : "charging");
    ups.userData.setLevel(battery ? 1 - drain * 0.42 : p > 0.8 ? 0.6 + range(p, 0.8, 1) * 0.4 : 0.75 + 0.25 * range(p, 0.45, 0.56));
    direct.userData.setFlow(power ? 0.9 : 0, C.lime);
    toUps.userData.setFlow(power ? 0.9 : 0, C.lime);
    upsOut.userData.setFlow(hasUps ? 0.95 : 0, battery ? C.amber : C.lime);
    [direct, toUps, upsOut].forEach((c) => c.userData.update(t, battery && c === upsOut ? 1.5 : 0.9));
    ups.userData.update(t); router.userData.update(t); wifi.userData.update(t);

    // light levels follow the mains
    st.room = lerp(st.room, power ? 1 : 0, 0.09);
    st.flash *= 0.86;
    const r = st.room;
    hemi.intensity = 0.04 + 0.5 * r; key.intensity = 2.3 * r + st.flash * 2; moon.intensity = 0.35 - 0.15 * r;
    scene.environmentIntensity = 0.06 + 0.55 * r;
    upsGlow.intensity = battery ? 1.6 * (1 - r * 0.8) : 0;
    wifiGlow.intensity = routerOn ? 1.2 * (1 - r) : 0;
    fMat.opacity = (1 - r) * 0.9;
    for (let i = 0; i < N; i++) { const [x, y, z, s] = seeds[i]; pos[i * 3] = x + Math.sin(t * 0.35 + s) * 0.4; pos[i * 3 + 1] = y + Math.sin(t * 0.5 + s * 2) * 0.25; pos[i * 3 + 2] = z + Math.cos(t * 0.3 + s) * 0.3; }
    fGeo.attributes.position.needsUpdate = true;

    // wifi arcs face the camera
    wifi.lookAt(cam.position.x, wifi.position.y, cam.position.z);

    // camera path
    const k = ease((performance.now() - intro) / 2200);
    const ang = lerp(-0.42, 0.38, p) + mx * 0.08 + Math.sin(t * 0.15) * 0.03;
    const rad = lerp(small ? 17 : 12, small ? 13.8 : 8.2, k) - (beat === 3 ? 0.5 * range(p, 0.56, 0.66) : 0) + (beat === 4 ? 0.6 * range(p, 0.8, 1) : 0);
    const hgt = lerp(2.9, 2.2, p) - my * 0.25;
    cam.position.set(target.x + Math.sin(ang) * rad, hgt, target.z + Math.cos(ang) * rad);
    const focus = target.clone(); if (beat >= 2 && beat <= 3) focus.lerp(new THREE.Vector3(-0.1, 0.35, 0.15), 0.35);
    cam.lookAt(focus);

    onHud({ p, power, routerOn, hasUps, battery, room: r, flash: st.flash, drain, beat });
    renderer.render(scene, cam);
  }
  frame();
  return true;
}
