// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom')

// Polyfill for setImmediate (required for Prisma in Jest)
if (typeof globalThis.setImmediate === 'undefined') {
  globalThis.setImmediate = (callback, ...args) => setTimeout(callback, 0, ...args)
}

if (typeof globalThis.clearImmediate === 'undefined') {
  globalThis.clearImmediate = (id) => clearTimeout(id)
}
