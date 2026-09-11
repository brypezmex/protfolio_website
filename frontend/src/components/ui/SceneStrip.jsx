import { useEffect, useRef } from 'react';
import { useInView } from '../../hooks/useInView.js';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery.js';
import './SceneStrip.css';

/**
 * A small hand-rasterized WebGL scene, tilting toward the pointer on hover.
 *
 * The geometry is this site owner's own CSC 461 (Computer Graphics) rasterizer
 * assignment: a photo of a Final Fantasy VII background was decomposed into
 * ~200 flat, per-vertex-colored triangles (via the "primitive" image-
 * approximation technique) and converted into the assignment's triangle-mesh
 * scene format. `/scene/ff7-scene.bin` is that mesh, flattened once at build
 * time into a compact interleaved buffer - see the conversion notes below -
 * so the browser never re-parses JSON or rebuilds per-triangle transforms the
 * way the original class assignment did.
 *
 * Binary layout: Float32, 9 values per vertex with no header -
 * `[x, y, z, nx, ny, nz, r, g, b]` repeated `byteLength / 36` times. Positions
 * are pre-centered on X/Y and scaled so the scene's longer axis spans about
 * 2 units; there is no per-object transform left to apply, so the vertex
 * shader only ever multiplies by one shared view-projection matrix.
 *
 * Conversion (run once, not part of the build): a small Node script read the
 * assignment's `converted_scene.json`, flattened every triangle set's
 * vertices/normals/material.diffuse into one array (the same flattening
 * `loadTriangles` did in the original `rasterize.js`, minus the per-object
 * model matrices this static scene does not need), centered and scaled the
 * result, and wrote it out as raw bytes.
 *
 * Performance is the whole point of rebuilding this rather than reusing the
 * assignment's renderer as-is:
 *   - One draw call for the entire scene (642 vertices), not one per shape.
 *   - No per-frame work at all when the pointer is elsewhere - see `tick`.
 *   - The animation loop runs only while the pointer is over the canvas or
 *     still easing back to centre after it leaves; there is no idle loop, no
 *     `requestAnimationFrame` running in a background tab, and nothing to
 *     suspend on scroll because there is nothing running to suspend.
 *   - Canvas resolution is capped well below native retina density (see
 *     `resize`), and geometry loading itself is deferred until the strip is
 *     close to the viewport.
 *   - `prefers-reduced-motion` skips the pointer listeners and the loop
 *     entirely; the scene still renders, just as one static frame.
 */

const SCENE_URL = '/scene/ff7-scene.bin';
const FLOATS_PER_VERTEX = 9;
const STRIDE = FLOATS_PER_VERTEX * 4; // bytes

const MAX_YAW = 0.46; // radians, ~26 degrees
const MAX_PITCH = 0.26; // radians, ~15 degrees
const EASE = 0.09;
const SETTLE_EPSILON = 0.0006;
const MAX_DPR = 1.5;

// Distance from the origin the camera orbits at. Pulled back further than the
// scene's own bounding box strictly requires so the full mesh stays inside
// the frustum - at every yaw/pitch the hover range reaches, not only at
// dead-centre - instead of cropping at the canvas edges.
const CAMERA_DISTANCE = 3.6;

const VERTEX_SRC = `
  attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec3 aColor;

  uniform mat4 uMVP;

  varying vec3 vNormal;
  varying vec3 vColor;

  void main() {
    gl_Position = uMVP * vec4(aPosition, 1.0);
    vNormal = aNormal;
    vColor = aColor;
  }
`;

const FRAGMENT_SRC = `
  precision mediump float;

  varying vec3 vNormal;
  varying vec3 vColor;

  uniform vec3 uLightDir;

  void main() {
    float lambert = max(dot(normalize(vNormal), uLightDir), 0.0);
    vec3 lit = vColor * (0.75 + 0.55 * lambert);

    // Push the lit colour away from its own luma to lift saturation - the
    // source material colours read a little washed out at this brightness
    // otherwise.
    float luma = dot(lit, vec3(0.299, 0.587, 0.114));
    vec3 saturated = mix(vec3(luma), lit, 1.35);

    gl_FragColor = vec4(saturated, 1.0);
  }
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (import.meta.env.DEV) console.warn(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

/*
 * Minimal column-major 4x4 matrix helpers, matching WebGL's memory layout.
 * Written out by hand rather than pulled in from a library - three values
 * (projection, view, and their product) are all this component ever needs.
 */

function perspective(fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  // prettier-ignore
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function lookAt(eye, center, up) {
  const [ex, ey, ez] = eye;
  const [cx, cy, cz] = center;

  let zx = ex - cx;
  let zy = ey - cy;
  let zz = ez - cz;
  let len = Math.hypot(zx, zy, zz) || 1;
  zx /= len;
  zy /= len;
  zz /= len;

  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  len = Math.hypot(xx, xy, xz) || 1;
  xx /= len;
  xy /= len;
  xz /= len;

  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  // prettier-ignore
  return new Float32Array([
    xx, yx, zx, 0,
    xy, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx * ex + xy * ey + xz * ez),
    -(yx * ex + yy * ey + yz * ez),
    -(zx * ex + zy * ey + zz * ez),
    1,
  ]);
}

function multiply(a, b) {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[k * 4 + row] * b[col * 4 + k];
      out[col * 4 + row] = sum;
    }
  }
  return out;
}

/** Camera orbits a fixed distance around the origin; yaw/pitch come from the pointer. */
function orbitEye(distance, yaw, pitch) {
  const cp = Math.cos(pitch);
  return [distance * Math.sin(yaw) * cp, distance * Math.sin(pitch), -distance * Math.cos(yaw) * cp];
}

export function SceneStrip() {
  const [containerRef, inView] = useInView({ threshold: 0, rootMargin: '400px 0px' });
  const canvasRef = useRef(null);
  const glStateRef = useRef(null); // { gl, uMVP, vertexCount } once initialized
  const orbitRef = useRef({ curYaw: 0, curPitch: 0, targetYaw: 0, targetPitch: 0 });
  const pointerInsideRef = useRef(false);
  const rafRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  // Load the geometry and set up WebGL once the strip is close to the
  // viewport. Skipped entirely if WebGL is unavailable.
  useEffect(() => {
    if (!inView) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    });
    if (!gl) return undefined;

    const controller = new AbortController();

    fetch(SCENE_URL, { signal: controller.signal })
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const program = createProgram(gl);
        if (!program) return;

        const data = new Float32Array(buffer);
        const vertexCount = data.length / FLOATS_PER_VERTEX;

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(program, 'aPosition');
        const aNormal = gl.getAttribLocation(program, 'aNormal');
        const aColor = gl.getAttribLocation(program, 'aColor');

        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, STRIDE, 0);
        gl.enableVertexAttribArray(aNormal);
        gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, STRIDE, 12);
        gl.enableVertexAttribArray(aColor);
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, STRIDE, 24);

        gl.useProgram(program);
        gl.uniform3fv(gl.getUniformLocation(program, 'uLightDir'), normalize3([0.3, 0.45, -1]));
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.059, 0.059, 0.059, 1); // matches --bg (#0f0f0f)

        glStateRef.current = {
          gl,
          uMVP: gl.getUniformLocation(program, 'uMVP'),
          vertexCount,
        };

        resize();
        draw(0, 0);
      })
      .catch(() => {
        // A missing or failed asset just leaves the strip visually empty -
        // it is decorative, not worth an error state.
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resize/draw are stable module-scope-like helpers defined below
  }, [inView]);

  // Keeps the canvas's backing resolution matched to its CSS size, capped
  // well under native retina density - the scene is flat-shaded geometry,
  // not fine detail, so there is nothing to gain from a sharper buffer.
  function resize() {
    const state = glStateRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!state || !canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const rect = container.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      state.gl.viewport(0, 0, width, height);
    }
  }

  function draw(yaw, pitch) {
    const state = glStateRef.current;
    if (!state) return;
    const { gl, uMVP, vertexCount } = state;

    const aspect = gl.canvas.width / gl.canvas.height || 1;
    const projection = perspective((32 * Math.PI) / 180, aspect, 0.5, 10);
    const view = lookAt(orbitEye(CAMERA_DISTANCE, yaw, pitch), [0, 0, 0], [0, 1, 0]);

    gl.uniformMatrix4fv(uMVP, false, multiply(projection, view));
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  }

  // The animation loop. It only runs while the pointer is over the canvas or
  // still easing back toward centre after leaving - see the pointer handlers
  // below - so there is zero per-frame cost the rest of the time.
  function tick() {
    const o = orbitRef.current;
    o.curYaw += (o.targetYaw - o.curYaw) * EASE;
    o.curPitch += (o.targetPitch - o.curPitch) * EASE;
    draw(o.curYaw, o.curPitch);

    const settled =
      Math.abs(o.targetYaw - o.curYaw) < SETTLE_EPSILON &&
      Math.abs(o.targetPitch - o.curPitch) < SETTLE_EPSILON;

    rafRef.current = !settled || pointerInsideRef.current ? requestAnimationFrame(tick) : 0;
  }

  function startLoop() {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  }

  // Resize the canvas on layout changes even while idle, so a window resize
  // with the pointer elsewhere does not leave a stretched frame on screen.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(() => {
      resize();
      if (!rafRef.current) draw(orbitRef.current.curYaw, orbitRef.current.curPitch);
    });
    observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Pointer-driven orbit. Not attached at all under reduced motion, so there
  // is nothing for that preference to override - the strip simply never
  // animates.
  useEffect(() => {
    if (reducedMotion) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      orbitRef.current.targetYaw = nx * MAX_YAW;
      orbitRef.current.targetPitch = -ny * MAX_PITCH;
      startLoop();
    };

    const onPointerEnter = () => {
      pointerInsideRef.current = true;
      startLoop();
    };

    const onPointerLeave = () => {
      pointerInsideRef.current = false;
      orbitRef.current.targetYaw = 0;
      orbitRef.current.targetPitch = 0;
      startLoop();
    };

    container.addEventListener('pointerenter', onPointerEnter);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    return () => {
      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
    };
    // containerRef and startLoop are stable across renders in every way that
    // matters here: containerRef is a ref, and startLoop only ever reads
    // through refs (glStateRef, orbitRef), so a "stale" closure from an
    // earlier render still operates on current values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // A backgrounded tab has no business spinning the loop even during the
  // brief settle-back window.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (!document.hidden || !rafRef.current) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return (
    <div className="scene-strip" ref={containerRef} aria-hidden="true">
      <canvas ref={canvasRef} />
      <p className="scene-strip__caption">// hand-rasterized in WebGL, hover to look around</p>
    </div>
  );
}

function normalize3([x, y, z]) {
  const len = Math.hypot(x, y, z) || 1;
  return [x / len, y / len, z / len];
}

export default SceneStrip;
