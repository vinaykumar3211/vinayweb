// detect.js
// A tiny, readable detection module for common UI/runtime signals.
// Exposes: getEnvironment(), subscribe(listener), and individual helpers.
// Keep functions small and names descriptive for clarity. [9][11]

function isTouchDevice() {
  return (('ontouchstart' in window) || navigator.maxTouchPoints > 0); // [9]
}

function isMobileViewport() {
  return window.matchMedia('(max-width: 767px)').matches; // [18]
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches; // [18]
}

function prefersDarkScheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches; // [18]
}

function isOnline() {
  return navigator.onLine; // [18]
}

// Aggregate a snapshot for easy consumption.
export function getEnvironment() {
  return {
    touch: isTouchDevice(),      // hardware/OS signal [9]
    mobile: isMobileViewport(),  // layout signal [18]
    reducedMotion: prefersReducedMotion(), // accessibility signal [18]
    dark: prefersDarkScheme(),   // theme signal [18]
    online: isOnline(),          // network signal [18]
  };
}

// Simple pub/sub so components can react to changes without tight coupling. [8]
const listeners = new Set();

function emit() {
  const env = getEnvironment();  // single computation per change [8]
  listeners.forEach((fn) => fn(env)); // notify subscribers [8]
}

export function subscribe(listener) {
  if (typeof listener !== 'function') return () => {}; // guard clause [11]
  listeners.add(listener);
  // Send initial snapshot immediately for convenience. [8]
  listener(getEnvironment());
  return () => listeners.delete(listener);
}

// Wire relevant events once; keep handlers tiny and declarative. [11]
function bindSystemListeners() {
  // Network changes
  window.addEventListener('online', emit);
  window.addEventListener('offline', emit);

  // Viewport/layout changes (mobile breakpoint)
  const bp = window.matchMedia('(max-width: 767px)');
  bp.addEventListener?.('change', emit);

  // Motion preference
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  motion.addEventListener?.('change', emit);

  // Color scheme
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  dark.addEventListener?.('change', emit);

  // Orientation or resize can also affect layout; debounce to avoid noise. [8]
  let t = 0;
  const onResize = () => {
    clearTimeout(t);
    t = setTimeout(emit, 150);
  };
  window.addEventListener('resize', onResize);
}
bindSystemListeners();
