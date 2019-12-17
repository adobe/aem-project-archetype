/**
 * Extract an id from the cqModel field of given properties
 *
 * @param path - Path to be converted into an id
 * @returns {string|undefined}
 */
export default function extractModelId(path) {
  return path && path.replace(/\/|:/g, '_');
}
