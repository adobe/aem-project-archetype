/*
 *  Copyright 2021 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import logger from '@wdio/logger';

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
export {comparisonStrategy};