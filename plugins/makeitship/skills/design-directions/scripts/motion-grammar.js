/* Reads how a live page moves, from its stylesheets and running animations; changes nothing on the page.
 * Run: pw eval "$(cat scripts/motion-grammar.js)" — one function expression, no exports.
 * Returns { libs, transitions, eases, keyframes, motionVars, triggers, dataAttrs, gsap?, scrollTriggers?, runningAnimations, canvases }. */
async () => {
  const out = { libs: { gsap: window.gsap?.version || false, ScrollTrigger: !!window.ScrollTrigger, lenis: !!(window.lenis||window.Lenis||document.documentElement.classList.contains('lenis')), locomotive: !!document.querySelector('[data-scroll-container],[data-scroll]'), three: !!window.THREE || !!document.querySelector('canvas'), framer: !!document.querySelector('[data-framer-name],[data-framer-component-type]'), webflowIx: !!window.Webflow }, transitions: {}, eases: {}, keyframes: [], motionVars: {}, triggers: [] };
  for (const sh of document.styleSheets) { let rules; try { rules = sh.cssRules } catch { continue }
    const walk = rs => { for (const r of rs) { if (r.cssRules && !r.style) walk(r.cssRules);
      if (r.type === 7 && out.keyframes.length < 15) out.keyframes.push(r.name + ': ' + [...r.cssRules].map(k => k.keyText + '{' + k.style.cssText.slice(0, 70) + '}').join(' ').slice(0, 220));
      if (r.style) { const t = r.style.transition; if (t) out.transitions[t.slice(0, 110)] = (out.transitions[t.slice(0, 110)] || 0) + 1;
        const e = r.style.transitionTimingFunction || r.style.animationTimingFunction; if (e) out.eases[e] = (out.eases[e] || 0) + 1;
        for (const p of r.style) if (/^--.*(ease|duration|delay|stagger|speed)/i.test(p)) out.motionVars[p] = r.style.getPropertyValue(p).trim().slice(0, 60);
        if (r.selectorText && /is-inview|is-visible|in-view|revealed|aos-animate|data-anim|data-reveal|split/.test(r.selectorText) && out.triggers.length < 15) out.triggers.push(r.selectorText.slice(0, 100) + ' { ' + r.style.cssText.slice(0, 160) + ' }'); } } };
    walk(rules); }
  out.transitions = Object.entries(out.transitions).sort((a, b) => b[1] - a[1]).slice(0, 12);
  out.eases = Object.entries(out.eases).sort((a, b) => b[1] - a[1]).slice(0, 10);
  out.motionVars = Object.fromEntries(Object.entries(out.motionVars).slice(0, 25));
  out.dataAttrs = [...new Set([...document.querySelectorAll('*')].flatMap(e => [...e.attributes].map(a => a.name)).filter(n => /^data-(scroll|anim|reveal|split|motion|parallax|aos|sal|w-id)/.test(n)))].slice(0, 25);
  if (window.gsap) { const tw = window.gsap.globalTimeline.getChildren(true, true, false); out.gsap = { tweens: tw.length, sample: tw.slice(0, 20).map(t => ({ dur: t.duration(), ease: String(t.vars?.ease || ''), props: Object.keys(t.vars || {}).filter(k => !/^(ease|duration|delay|on[A-Z]|scrollTrigger|stagger|overwrite|immediateRender|paused|id|data|callbackScope)/.test(k)).slice(0, 6), stagger: t.vars?.stagger ?? null })) }; }
  if (window.ScrollTrigger) out.scrollTriggers = window.ScrollTrigger.getAll().length;
  out.runningAnimations = document.getAnimations().slice(0, 15).map(a => ({ type: a.constructor.name, name: a.animationName || a.transitionProperty, dur: a.effect?.getTiming().duration, easing: a.effect?.getTiming().easing, iter: a.effect?.getTiming().iterations }));
  out.canvases = [...document.querySelectorAll('canvas')].map(c => c.width + 'x' + c.height).slice(0, 5);
  return out;
}
