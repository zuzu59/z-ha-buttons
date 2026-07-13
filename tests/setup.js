// Tests setup
// Mock ServiceWorker API for jsdom
if (typeof window !== 'undefined') {
  window.CSS = window.CSS || {}
  window.CSS.escape = window.CSS.escape || ((str) => str)
}
