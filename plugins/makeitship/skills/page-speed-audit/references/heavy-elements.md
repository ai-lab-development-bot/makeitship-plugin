# Heavy elements: start them only where the device can carry them

A 3D scene, a WebGL background, a Spline embed, a large canvas effect, an autoplaying video, a
long Lottie, an interactive map, a chat or video widget: each can cost seconds of main thread and
megabytes before the first screen settles. On a phone, or on a machine without a GPU, it costs
the most and looks the worst.

The fix is **progressive enhancement by capability**: the page always paints a light version (a
static image, an SVG, a poster frame) and starts the heavy one only where the device can run it
well. PageSpeed's servers and Googlebot have no GPU, so they get the light version — and so does
every real visitor whose device would have struggled. Lab scores rise because the page is
genuinely lighter where it would have been slow, not because a tool was recognised.

## The rule that keeps it honest

**Decide by what the device can do, never by who is asking.** No user-agent sniffing for
Lighthouse, PageSpeed, `HeadlessChrome` or Googlebot, no IP lists, no "if it is a test, skip".
Serving search crawlers something different from what visitors get is cloaking under Google's
spam policies, and serving measuring tools a different page makes the measurement a lie the
person will act on. If the only way to pass a tool is to recognise it, the honest answer is the
lab number plus the reason.

## The gate, for WebGL (three.js, raw WebGL, most 3D libraries)

Two checks, both needed:

1. Ask for the context with `failIfMajorPerformanceCaveat: true` — the browser refuses a context
   it would have to rasterise in software (servers without a GPU, VMs, hardware acceleration
   switched off). three.js throws when it cannot create the context; catch it.
2. Chrome still grants a context when a software backend was chosen on purpose (server-side
   Lighthouse, SwiftShader or llvmpipe on a VM), so read the real renderer name and decline on a
   software stack.

```js
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|mesa offscreen|microsoft basic render/i;

// RENDERER alone is masked ("WebKit WebGL"); the debug extension holds the real name.
function rendererName(gl) {
  const debug = gl.getExtension('WEBGL_debug_renderer_info');
  const value = debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  return typeof value === 'string' ? value : '';
}

/** True when a hardware-accelerated WebGL context is available. Probes on a throwaway canvas. */
function canRunWebGL() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true })
      || document.createElement('canvas').getContext('webgl', { failIfMajorPerformanceCaveat: true });
    if (!gl) return false;
    const ok = !SOFTWARE_RENDERER.test(rendererName(gl));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return ok;
  } catch { return false; }
}
```

**Probe first, then load.** Run the probe before the heavy library is downloaded, and import
the scene module only when it passes (`if (canRunWebGL()) import('./scene.js').then(...)`). A
gate placed inside an already-loaded scene component saves the main thread but still downloads
and parses the library; a probe in front of a dynamic import saves both.

## Small screens and the first screen

- **Narrow viewports**: when the heavy element is decorative, do not start it below a width at
  all — a media-gated mount (`matchMedia('(min-width: …)')`, or the framework's equivalent, such
  as an island hydrated on a media query) keeps the library off phones entirely. This is a
  visible decision for phone visitors: it goes to the person.
- **Below the fold**: start it when it nears the viewport (`IntersectionObserver`), not on load.
- **Data saver and reduced motion**: `navigator.connection?.saveData` and
  `prefers-reduced-motion: reduce` keep the light version.

## The light version

- Painted by the page from the first frame, at the element's final size, so there is no layout
  shift when the heavy version arrives or declines. Reserve the box either way.
- Two ways to hand over, each a visible choice:
  - **Light version only when the heavy one declines**: a normal load shows the reserved box empty
    until the scene fades in; no swap from one picture to another. Calmer, but the box is empty
    for a moment on capable devices.
  - **Light version first, cross-fade to the heavy one when ready**: never empty, but capable
    devices see the swap.
- An `<img>` or inline SVG of the same subject, not a spinner; a spinner tells the visitor
  something is wrong.
- Never the LCP element hidden behind the heavy one: if the heavy element is in the first screen,
  the light version is what LCP should measure.

## Other kinds

| Element | Light version | Start the heavy one |
|---|---|---|
| Spline / 3D embed | A rendered still of the scene | Behind the WebGL gate; on interaction or near the viewport |
| Canvas or WebGL background | A CSS gradient or a still frame | Behind the WebGL gate; never on small screens unless asked |
| Autoplay background video | `poster` image, `preload="none"` | Near the viewport, not under data saver or reduced motion; smaller rendition on phones |
| YouTube / Vimeo / Loom embed | A facade: thumbnail and a play button | On click — the player loads then |
| Lottie | The first frame as SVG or an image | Near the viewport; the player library loaded with it |
| Interactive map | A static map image | On click or near the viewport |
| Chat, booking, review widgets | A plain button that looks like the launcher | On interaction, or after the page is idle |

## Verifying a gated element

- On a normal machine: the heavy version starts, looks as before, and the light one is gone.
- Software WebGL locally: Chrome with `--use-angle=swiftshader --enable-unsafe-swiftshader`
  (confirm `rendererName` reports SwiftShader) — the light version stays, nothing throws, no
  layout shift.
- A narrow viewport, data saver and reduced motion, where they gate.
- PageSpeed on a public URL, desktop and mobile, three runs each: the heavy library is absent
  from the requests and from `bootup-time`.
