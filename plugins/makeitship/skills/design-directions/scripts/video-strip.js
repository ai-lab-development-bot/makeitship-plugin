/* Turns the video on the current page into one strip of six evenly spaced frames, without ffmpeg.
 * Open the video file's URL directly, then: pw eval "$(cat scripts/video-strip.js)", pw resize 1440 200, pw screenshot.
 * Replaces the page body with the strip. Returns { duration, w, h, frames: 6 }, or { error: "no video" }. */
async () => {
  const v = document.querySelector('video');
  if (!v) return { error: 'no video' };
  v.pause();
  if (v.readyState < 1) await new Promise(r => v.addEventListener('loadedmetadata', r, { once: true }));
  const d = v.duration, W = 240, H = Math.round(W * v.videoHeight / v.videoWidth), n = 6;
  const c = document.createElement('canvas');
  c.width = W * n; c.height = H;
  const g = c.getContext('2d');
  for (let i = 0; i < n; i++) {
    v.currentTime = d * (i + 0.5) / n;
    await new Promise(r => v.addEventListener('seeked', r, { once: true }));
    g.drawImage(v, i * W, 0, W, H);
  }
  document.body.innerHTML = '';
  document.body.style.margin = '0';
  document.body.appendChild(c);
  return { duration: d, w: v.videoWidth, h: v.videoHeight, frames: n };
}
