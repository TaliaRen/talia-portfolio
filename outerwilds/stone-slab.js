// Procedural 3D stone slab (Three.js). Everything — outline, thickness,
// bevel, chipped edges, stone grain and the woven carving at the top — is
// generated in code from CONFIG, so width/height/depth can change freely
// without stretching any detail (textures use a fixed texel density and
// the geometry is rebuilt, never scaled).
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

export const DEFAULT_CONFIG = {
  width: 6,
  height: 9,
  depth: 0.35,
  edgeRoughness: 0.18,
  chipSize: 0.22,
  bevelSize: 0.08,
  weaveRows: 5,
  weaveTileSize: 0.55,
  weaveDepth: 0.035,
  weaveFadeStart: 0.58,
  stoneColor: '#B98A50',
  roughness: 0.88,
  textureScale: 3.5,
  seed: 42,
};

// ── seeded noise ────────────────────────────────────────────────────────
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function makeNoise2(seed) {
  const rnd = mulberry32(seed), perm = new Uint8Array(512), p = [];
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) { const r = Math.floor(rnd() * (i + 1)); [p[i], p[r]] = [p[r], p[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
  const grad = (h, x, y) => { switch (h & 3) { case 0: return x + y; case 1: return -x + y; case 2: return x - y; default: return -x - y; } };
  const n = (x, y) => {                       // 2D Perlin, [-1, 1]
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const a = perm[X] + Y, b = perm[X + 1] + Y;
    const l = (s, e, t) => s + t * (e - s);
    return l(l(grad(perm[a], x, y), grad(perm[b], x - 1, y), u), l(grad(perm[a + 1], x, y - 1), grad(perm[b + 1], x - 1, y - 1), u), v);
  };
  const fbm = (x, y, oct = 5, lac = 2.1, gain = 0.5) => { let s = 0, a = 1, f = 1, norm = 0; for (let i = 0; i < oct; i++) { s += n(x * f, y * f) * a; norm += a; a *= gain; f *= lac; } return s / norm; };
  return { n, fbm, rnd };
}

// ── outline: rectangle → sampled edges → noise-displaced → THREE.Shape ──
function buildOutline(c, N) {
  const W = c.width, H = c.height, hw = W / 2, hh = H / 2;
  const spacing = 0.08;
  const corners = [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]];
  const pts = [];
  for (let e = 0; e < 4; e++) {
    const [x0, y0] = corners[e], [x1, y1] = corners[(e + 1) % 4];
    const len = Math.hypot(x1 - x0, y1 - y0), steps = Math.max(8, Math.round(len / spacing));
    const nx = (y1 - y0) / len, ny = -(x1 - x0) / len;          // outward normal (CCW polygon)
    for (let i = 0; i < steps; i++) {
      const t = i / steps, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
      // distance to the nearest corner: corners chip more, and asymmetrically
      const dc = Math.min(Math.hypot(x - x0, y - y0), Math.hypot(x - x1, y - y1));
      const cornerBoost = 1 + 0.9 * Math.exp(-dc * 1.6);
      const low = N.fbm(x * 0.9 + 7.3, y * 0.9 - 2.1, 3);          // big chips
      const high = N.fbm(x * 6.5 - 3.7, y * 6.5 + 5.9, 4);         // fine breakage
      let d = -Math.max(0, -low) * c.chipSize * 2.4 * cornerBoost  // chips only bite inward
              + high * c.edgeRoughness * 0.5
              + low * c.edgeRoughness * 0.35;
      pts.push([x + nx * d, y + ny * d]);
    }
  }
  const shape = new THREE.Shape();
  pts.forEach(([x, y], i) => i ? shape.lineTo(x, y) : shape.moveTo(x, y));
  shape.closePath();
  return shape;
}

// ── procedural textures at a fixed texel density ─────────────────────────
function buildTextures(c, N) {
  const PPU = 64;                                     // pixels per world unit (constant → no stretching)
  const w = Math.ceil(c.width * PPU), h = Math.ceil(c.height * PPU);
  const mk = () => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return [cv, cv.getContext('2d')]; };
  const [colorCv, cc] = mk(), [roughCv, rc] = mk(), [bumpCv, bc] = mk();
  const hex = parseInt(c.stoneColor.replace('#', ''), 16);
  const base = { r: ((hex >> 16) & 255) / 255, g: ((hex >> 8) & 255) / 255, b: (hex & 255) / 255 };   // sRGB bytes — the canvas is sRGB
  const col = cc.createImageData(w, h), rou = rc.createImageData(w, h), bmp = bc.createImageData(w, h);
  const ts = c.textureScale;
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const x = i / PPU, y = j / PPU;                 // world units (top-left origin)
      // stone grain: several fBm layers at fixed world frequencies
      const g1 = N.fbm(x * 0.35 * ts, y * 0.35 * ts, 4);          // broad mottling
      const g2 = N.fbm(x * 2.2 * ts + 11, y * 2.2 * ts + 3, 5);   // fine grain
      const g3 = N.fbm(x * 9 * ts - 4, y * 9 * ts + 8, 3);        // speckle
      const tone = 1 + g1 * 0.10 + g2 * 0.06 + g3 * 0.03;
      let r = base.r * tone, g = base.g * tone, b = base.b * tone;
      let bump = 0.5 + g2 * 0.12 + g3 * 0.06;
      let rough = c.roughness + g2 * 0.06 + g1 * 0.03;
      const k = (j * w + i) * 4;
      col.data[k] = r * 255; col.data[k + 1] = g * 255; col.data[k + 2] = b * 255; col.data[k + 3] = 255;
      rou.data[k] = rou.data[k + 1] = rou.data[k + 2] = Math.max(0, Math.min(1, rough)) * 255; rou.data[k + 3] = 255;
      bmp.data[k] = bmp.data[k + 1] = bmp.data[k + 2] = Math.max(0, Math.min(1, bump)) * 255; bmp.data[k + 3] = 255;
    }
  }
  cc.putImageData(col, 0, 0); rc.putImageData(rou, 0, 0); bc.putImageData(bmp, 0, 0);
  drawWeave(c, N, cc, bc, PPU, w, h);
  const tex = cv => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.NoColorSpace; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.anisotropy = 4; return t; };
  const map = tex(colorCv); map.colorSpace = THREE.SRGBColorSpace;
  return { map, roughnessMap: tex(roughCv), bumpMap: tex(bumpCv) };
}

// Woven carving: two families of diagonal stone strips (±45°) interleaved
// over-under in a basket weave. Each strip is a rotated rectangle 2T × T
// with a thin, deep groove around it. Carved into the bump map (grooves
// low, strip centres slightly high) and darkened in the colour map; the
// whole thing fades out toward weaveFadeStart of the slab height.
function drawWeave(c, N, cc, bc, PPU, w, h) {
  const T = c.weaveTileSize * PPU;                    // strip short side, px (fixed world size)
  const rows = c.weaveRows;
  const fadeEnd = c.weaveFadeStart * h;               // where the carving has fully faded
  const groove = Math.max(1.5, T * 0.075);
  const rot = Math.PI / 4;
  // basket weave on a 45° grid: each 2T×2T cell holds two parallel strips;
  // neighbouring cells alternate orientation, so every strip visibly passes
  // over/under the ones beside it. Drawn in a frame rotated 45° about the
  // top centre of the slab so the strips run diagonally.
  const cell = T * 2;
  const depth = c.weaveDepth / 0.035;                 // 1 at the default
  const R = Math.hypot(w, fadeEnd + cell) + cell * 2; // radius to cover the carved region
  const nCells = Math.ceil(R / cell) + 1;
  const withFrame = (ctx, fn) => { ctx.save(); ctx.translate(w / 2, 0); ctx.rotate(rot); fn(); ctx.restore(); };
  for (let gi = -nCells; gi <= nCells; gi++) {
    for (let gj = -nCells; gj <= nCells; gj++) {
      const cx0 = gi * cell, cy0 = gj * cell;                   // cell origin in the rotated frame
      // cell centre back in slab pixels (to test the fade / bounds)
      const ccx = w / 2 + (cx0 + cell / 2) * Math.cos(rot) - (cy0 + cell / 2) * Math.sin(rot);
      const ccy = (cx0 + cell / 2) * Math.sin(rot) + (cy0 + cell / 2) * Math.cos(rot);
      if (ccy < -cell || ccy > fadeEnd + cell || ccx < -cell || ccx > w + cell) continue;
      const f = Math.max(0, Math.min(1, 1 - (ccy - T) / Math.max(1, fadeEnd - T)));
      const fade = f * f * (3 - 2 * f) * (0.8 + 0.2 * N.rnd());
      if (fade < 0.03) continue;
      const horizontal = ((gi + gj) & 1) === 0;
      for (let s = 0; s < 2; s++) {                             // the two strips of this cell
        const jx = (N.rnd() - 0.5) * groove, jy = (N.rnd() - 0.5) * groove;
        const rect = horizontal
          ? [cx0 + groove / 2 + jx, cy0 + s * T + groove / 2 + jy, cell - groove, T - groove]
          : [cx0 + s * T + groove / 2 + jx, cy0 + groove / 2 + jy, T - groove, cell - groove];
        // bump: dark groove ring (carved), faintly raised face
        withFrame(bc, () => {
          bc.strokeStyle = `rgba(0,0,0,${(0.9 * fade * Math.min(1, depth)).toFixed(3)})`; bc.lineWidth = groove; bc.strokeRect(...rect);
          bc.fillStyle = `rgba(255,255,255,${(0.10 * fade * depth).toFixed(3)})`; bc.fillRect(...rect);
        });
        // colour: grooves darker, faces barely lighter (worn)
        withFrame(cc, () => {
          cc.strokeStyle = `rgba(40,25,10,${(0.55 * fade).toFixed(3)})`; cc.lineWidth = groove; cc.strokeRect(...rect);
          cc.fillStyle = `rgba(255,240,215,${(0.05 * fade).toFixed(3)})`; cc.fillRect(...rect);
        });
      }
    }
  }
}

// ── the component ────────────────────────────────────────────────────────
export function createStoneSlab(container, userConfig = {}) {
  const config = Object.assign({}, DEFAULT_CONFIG, userConfig);
  RectAreaLightUniformsLib.init();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);

  // lights: big soft key from the upper-left, weak ambient, faint fill lower-right,
  // plus a matching directional light purely for the soft shadow
  const key = new THREE.RectAreaLight(0xfff1dc, 3.2, 12, 12);
  key.position.set(-7, 9, 9); key.lookAt(0, 0, 0); scene.add(key);
  const fill = new THREE.PointLight(0xdfe8ff, 0.5, 60); fill.position.set(7, -7, 7); scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const sun = new THREE.DirectionalLight(0xffffff, 0.35);
  sun.position.set(-6, 8, 10); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 6; sun.shadow.bias = -0.0006;
  scene.add(sun);
  // shadow catcher (invisible plane behind the slab)
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.35 }));
  catcher.receiveShadow = true; scene.add(catcher);

  const group = new THREE.Group(); scene.add(group);
  group.rotation.x = -0.09;                           // slight downward tilt so the thickness reads
  let mesh = null, textures = null;

  function build() {
    const c = config;
    const N = makeNoise2(c.seed);
    if (mesh) { group.remove(mesh); mesh.geometry.dispose(); }
    if (textures) Object.values(textures).forEach(t => t.dispose());
    const shape = buildOutline(c, N);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: c.depth, steps: 1, curveSegments: 1,
      bevelEnabled: true, bevelThickness: c.bevelSize, bevelSize: c.bevelSize, bevelSegments: 3,
    });
    geo.computeVertexNormals();
    geo.center();
    catcher.position.z = -c.depth / 2 - c.bevelSize - 0.02;
    textures = buildTextures(c, N);
    // UVs from ExtrudeGeometry are the vertex x/y in world units; map the
    // texture 1:1 onto the front face (fixed texel density)
    Object.values(textures).forEach(t => { t.repeat.set(1 / c.width, 1 / c.height); t.offset.set(0.5, 0.5); t.needsUpdate = true; });
    const mat = new THREE.MeshStandardMaterial({
      map: textures.map, roughnessMap: textures.roughnessMap, bumpMap: textures.bumpMap,
      bumpScale: 0.9, roughness: 1, metalness: 0, color: 0xffffff,
    });
    // side faces: darker, from the same texture (auto UVs on the sides)
    const sideMat = new THREE.MeshStandardMaterial({ map: textures.map, roughness: 1, metalness: 0, color: 0xcfc4b4, bumpMap: textures.bumpMap, bumpScale: 0.5 });
    mesh = new THREE.Mesh(geo, [mat, sideMat]);
    mesh.castShadow = true; mesh.receiveShadow = true;
    group.add(mesh);
    fitCamera();
  }

  function fitCamera() {
    if (!mesh) return;
    const box = new THREE.Box3().setFromObject(group);
    const size = box.getSize(new THREE.Vector3());
    const cw = container.clientWidth || 1, ch = container.clientHeight || 1, aspect = cw / ch;
    const pad = 1.12;
    let hw = size.x / 2 * pad, hh = size.y / 2 * pad;
    if (hw / hh < aspect) hw = hh * aspect; else hh = hw / aspect;
    camera.left = -hw; camera.right = hw; camera.top = hh; camera.bottom = -hh;
    camera.position.set(0, 0, 30); camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    renderer.setSize(cw, ch, false);
  }

  function render() { renderer.render(scene, camera); }
  const ro = new ResizeObserver(() => { fitCamera(); render(); });
  ro.observe(container);
  build(); render();

  return {
    config,
    /** apply partial config; geometry/textures are regenerated (never scaled) */
    update(partial) { Object.assign(config, partial || {}); build(); render(); },
    render, scene, camera, renderer, group,
    dispose() { ro.disconnect(); if (mesh) mesh.geometry.dispose(); if (textures) Object.values(textures).forEach(t => t.dispose()); renderer.dispose(); renderer.domElement.remove(); },
  };
}
