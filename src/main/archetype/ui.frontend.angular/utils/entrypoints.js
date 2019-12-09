// Globs for entrypoint files (in the order they need to be required)
const jsEntrypoints = [
  "**/runtime*.js",
  "**/polyfills*.js",
  "**/styles*.js",
  "**/vendor*.js",
  "**/main*.js"
];
const cssEntrypoints = ["**/*.css"];
const entrypoints = [...jsEntrypoints, ...cssEntrypoints];

module.exports = {
  jsEntrypoints,
  cssEntrypoints,
  entrypoints
};
