# Webflow IX2: let the render loop sleep at rest

Webflow Interactions 2.0 (IX2) runs one `requestAnimationFrame` loop per page for as long as the
IX2 session is active. On a page with any continuous interaction (scroll- or mouse-linked) it
dispatches a frame action on every display refresh even when nothing moves — typically
60–170 rAF calls a second and 10–35% of an idle main thread on a long page. This patch makes the
loop sleep when a frame changed nothing and wake on the next IX2 action.

The expected effect: IX2's frames at rest drop to zero and the idle main thread to a few percent,
with every IX2-written style identical with and without the patch.

## Find the loop in your runtime

The runtime is `webflow.js` / `webflow.<hash>.js` (Webflow-hosted or exported), or a copy the
project keeps. It is minified, so names differ per build. Search for `animationFrameChanged` next
to `requestAnimationFrame`; the original looks like this (here named `tl`; the action-creator
module `d` and the helper `tt` have other names in your build):

```js
function tl(t,e){let i=n=>{let{ixSession:r,ixParameters:a}=t.getState();r.active&&(t.dispatch((0,d.animationFrameChanged)(n,a)),e?tt(t,i):requestAnimationFrame(i))};i(window.performance.now())}
```

`t` is the IX2 Redux store; `e` is set only in Webflow's designer preview (it then drives frames
through `tt`), and the patch leaves that path alone.

## The patched loop

Replace the whole function, keeping your build's names for `tl`, `d` and `tt`. Readable form:

```js
function tl(t, e) {
  // Opt-in per page: only pages whose <html> carries data-ix2-idle-sleep sleep.
  let sleepy = !e && document.documentElement.hasAttribute('data-ix2-idle-sleep');
  let asleep = false;
  // Webflow restarts the IX2 session at every breakpoint change and leaves the old loop
  // running; a generation number lets only the newest loop continue.
  let gen = t.__ix2Gen = (t.__ix2Gen || 0) + 1;
  let frame = (now) => {
    let { ixSession: session, ixParameters: params, ixInstances: before } = t.getState();
    if (!session.active || (sleepy && gen !== t.__ix2Gen)) return;
    t.dispatch((0, d.animationFrameChanged)(now, params));
    t.__ix2Stale = false;
    if (e) return void tt(t, frame);
    if (sleepy) {
      let after = t.getState();
      // Sleep when this frame moved nothing (a settled continuous instance returns the same
      // object) and no non-continuous instance is playing or waiting for its delay.
      if (after.ixInstances === before && after.ixParameters === params &&
          !Object.keys(before).some((k) => before[k].active && !before[k].continuous)) {
        asleep = true; t.__ix2Stale = true; return;
      }
    }
    requestAnimationFrame(frame);
  };
  if (sleepy) {
    t.__ix2Wake = () => { if (asleep) { asleep = false; requestAnimationFrame(frame); } };
    if (!t.__ix2Wrapped) {
      t.__ix2Wrapped = true;
      let dispatch = t.dispatch;
      t.dispatch = (action) => {
        // While asleep the session tick is stale and IX2 dates new instances to it, so the
        // animation would jump to its end. Re-time such a start to now (one dated 0 is an
        // immediate start and stays as it is).
        if (t.__ix2Stale && action && action.type === 'IX2_INSTANCE_STARTED' &&
            action.payload.time && action.payload.time === t.getState().ixSession.tick) {
          action = { ...action, payload: { ...action.payload, time: window.performance.now() } };
        }
        let result = dispatch(action);
        // Any IX2 action other than a frame wakes the loop.
        if (action && action.type !== 'IX2_ANIMATION_FRAME_CHANGED') t.__ix2Wake();
        return result;
      };
    }
  }
  frame(window.performance.now());
}
```

Minify it back into the runtime in the same one-line style if the file is minified, and leave a
short comment at the start of the function saying what it does and where the decision is recorded.

## Things that keep the loop awake anyway

- An IX2 event with `loop: true` (a looping Lottie, a pulse): its instance never ends. Set
  `loop: false` on that event in the runtime's interaction data and replay it where the design
  needs it (on hover, from a small script).
- A Lottie that IX2 scrubs continuously by scroll: that is scroll-driven and sleeps at rest.

## Roll out and verify

Switch it on one page type (template) at a time by adding `data-ix2-idle-sleep` to that
template's `<html>`, verify, release, then the next. For each type:

1. **Style diff.** The same scenario three times — twice without the attribute, once with it —
   capturing every inline style after each step: scroll in steps of ~0.6 viewport through the
   page, move the mouse along a fixed path at each step, open and close dropdowns. Styles that
   differ between the two unpatched runs are noise; any other difference is a bug.
2. **Timing.** Rest 4 s, then fire each trigger (dropdown, hover, scroll-into-view target) and
   count style writes on the animated elements for ~1.2 s, with and without the patch. A played
   animation writes many intermediate values; a jump writes one or two.
3. **Breakpoints.** Resize across every Webflow breakpoint (991, 767, 478 px) and back; after each,
   IX2 rAF at rest must return to 0 and no errors appear.
4. **Idle.** `scripts/idle-cpu.cjs` with and without the attribute: IX2's runtime must vanish
   from the rAF sources at rest.
