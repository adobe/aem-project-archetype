// Globs for entrypoint files (in the order they need to be required)
const target = 'es5';
const jsEntrypoints = [
  `**/runtime-${target}*.js`,
  `**/polyfills-${target}*.js`,
  `**/styles-${target}*.js`,
  `**/vendor-${target}*.js`,
  `**/main-${target}*.js`
];
const cssEntrypoints = ['**/*.css'];
const entrypoints = [...jsEntrypoints, ...cssEntrypoints];

module.exports = {
  jsEntrypoints,
  cssEntrypoints,
  entrypoints
};
