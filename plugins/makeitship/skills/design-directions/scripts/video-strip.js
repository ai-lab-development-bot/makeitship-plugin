/* Turns the video on the current page into one strip of six evenly spaced frames, without ffmpeg.
 * Open the video file's URL directly, then: pw eval "$(cat scripts/video-strip.js)",
 * pw resize 1440 <stripHeight>, pw screenshot.
 * Replaces the page body with the strip. Returns { duration, w, h, frames: 6, stripHeight },
 * or { error } when there is no video or it cannot be loaded or seeked within 15 s. */
async () => {
  const v = document.querySelector('video');
  if (!v) return { error: 'no video' };
  const waitFor = (event) => new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(event + ' timed out')), 15000);
    v.addEventListener(event, () => { clearTimeout(t); resolve(); }, { once: true });
    v.addEventListener('error', () => { clearTimeout(t); reject(new Error('the video cannot be played')); }, { once: true });
  });
  try {
    v.pause();
    if (v.error) throw new Error('the video cannot be played');
    if (v.readyState < 1) await waitFor('loadedmetadata');
    const d = v.duration, W = 240, H = Math.round(W * v.videoHeight / v.videoWidth), n = 6;
    const c = document.createElement('canvas');
    c.width = W * n; c.height = H;
    const g = c.getContext('2d');
    for (let i = 0; i < n; i++) {
      v.currentTime = d * (i + 0.5) / n;
      await waitFor('seeked');
      g.drawImage(v, i * W, 0, W, H);
    }
    document.body.innerHTML = '';
    document.body.style.margin = '0';
    document.body.appendChild(c);
    return { duration: d, w: v.videoWidth, h: v.videoHeight, frames: n, stripHeight: H };
  } catch (e) {
    return { error: String(e.message || e) };
  }
}
