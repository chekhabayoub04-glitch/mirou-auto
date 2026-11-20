// Canvas frame-sequence player for scroll scrubbing: progressive (coarse-first) loading,
// cover-fit drawing and cross-blending between neighbouring frames for smooth motion.

/** Coarse stride first so early scrubbing already shows motion, then fill the gaps. */
function loadOrder(n: number) {
  const seen = new Set<number>();
  const order: number[] = [];
  for (let stride = 16; stride >= 1; stride /= 2) {
    for (let i = 0; i < n; i += stride) {
      if (seen.has(i)) continue;
      seen.add(i);
      order.push(i);
    }
  }
  if (!seen.has(n - 1)) order.push(n - 1);
  return order;
}

export type FramePlayer = { start: () => void; render: (position: number) => void; resize: () => void; destroy: () => void };

type Frame = ImageBitmap | HTMLImageElement;
const dims = (f: Frame) => (f instanceof HTMLImageElement ? [f.naturalWidth, f.naturalHeight] : [f.width, f.height]);

/**
 * blend: cross-fade neighbouring frames (two draws per update). Phones turn it off — one draw keeps scrubbing at 60fps.
 * Frames are kept as decoded ImageBitmaps where supported, so drawing never waits on a lazy decode.
 */
export function createFramePlayer(canvas: HTMLCanvasElement, urls: string[], { concurrency = 6, maxDpr = 1.25, blend = true } = {}): FramePlayer {
  const ctx = canvas.getContext("2d", { alpha: false })!;
  const imgs: (Frame | null)[] = new Array(urls.length).fill(null);
  let alive = true;
  let started = false;
  let last = "";
  let want = 0; // last requested position, re-rendered as frames arrive
  canvas.style.opacity = "0"; // keep the poster <img> visible until the first real frame is drawn

  const nearest = (i: number) => {
    for (let d = 0; d < urls.length; d++) {
      if (imgs[i - d]) return i - d;
      if (imgs[i + d]) return i + d;
    }
    return -1;
  };

  const cover = (img: Frame) => {
    const [iw, ih] = dims(img);
    const s = Math.max(canvas.width / iw, canvas.height / ih);
    const w = iw * s;
    const h = ih * s;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  };

  const player: FramePlayer = {
    start() {
      if (started) return;
      started = true;
      const queue = loadOrder(urls.length);
      const worker = async () => {
        while (alive && queue.length) {
          const i = queue.shift()!;
          const img = new Image();
          img.decoding = "async";
          img.src = urls[i];
          try {
            await img.decode();
            const frame: Frame = "createImageBitmap" in window ? await createImageBitmap(img).catch(() => img) : img;
            if (alive) {
              imgs[i] = frame;
              if (Math.abs(i - want) < 16) player.render(want);
            }
          } catch {
            /* missing frame: neighbours cover it */
          }
        }
      };
      for (let k = 0; k < concurrency; k++) worker();
    },
    /** position: fractional frame index (0 … count-1). */
    render(position) {
      want = position;
      const p = Math.max(0, Math.min(urls.length - 1, position));
      const i = Math.floor(p);
      const a = imgs[i] ? i : nearest(i);
      if (a < 0) return;
      const t = blend && imgs[i] && imgs[i + 1] ? p - i : 0;
      const key = `${a}:${t.toFixed(2)}:${canvas.width}`;
      if (key === last) return;
      last = key;
      ctx.globalAlpha = 1;
      cover(imgs[a]!);
      canvas.style.opacity = "1";
      if (t > 0.02) {
        ctx.globalAlpha = t;
        cover(imgs[i + 1]!);
        ctx.globalAlpha = 1;
      }
    },
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      last = "";
    },
    destroy() {
      alive = false;
      imgs.forEach((f) => f instanceof ImageBitmap && f.close());
    },
  };
  return player;
}
