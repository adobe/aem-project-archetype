const logger = require('@wdio/logger').default;
const log = logger('PixelMatchPlugin');
/**
 * Reference https://github.com/mjhea0/cypress-visual-regression/blob/e2f3ce269d7267392593db814acba070876db19f/src/plugin.js#L104
 * For how much diff we are going to consider the test passing
 */
const DEFAULT_ERROR_THRESHOLD = .10;
/**
 *
 * @param {number} mismatchedPixels No of pixel mismatched returned from pixelmatch
 * @param {number} width Width of screenshot
 * @param {number} height Height of screenshot
 * @returns If the match was successful or not
 */
function comparisonStrategy(mismatchedPixels, width, height, config = {}) {
    let { errorThreshold = DEFAULT_ERROR_THRESHOLD } = config;
    log.info(config);
    const errorPercentage = (mismatchedPixels / (width * height)) ** 0.5;
    return errorPercentage <= errorThreshold;
}
module.exports = comparisonStrategy;