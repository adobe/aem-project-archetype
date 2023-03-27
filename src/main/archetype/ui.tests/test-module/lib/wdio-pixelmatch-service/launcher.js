/* eslint-disable no-unused-vars */
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
import { PNG } from 'pngjs';

import pixelmatch from 'pixelmatch';
import logger from '@wdio/logger';
const log = logger('PixelMatchPlugin');
import { checkFileExists, makeDirectories, readPng, writePng } from './fileutils.js';
import {comparisonStrategy} from './comparisonstrategy.js';
import { PathUtils, SCREENSHOTTYPES } from './pathutils.js';
/**
 * A WDIO visual regression service based on pixelmatch plugin
 */
class PixelMatchPlugin {

    constructor(serviceOptions, capabilities, config) {
        this.options = serviceOptions;
        this.currentContext = null;
        this.config = config;
        if (this.options.pixelmatchDirectory) {
            this.pixelmatchDirectory = this.options.pixelmatchDirectory;
        }
        this.pathUtils = new PathUtils(this.pixelmatchDirectory);
    }
    /**
     * this browser object is passed in here for the first time
     */
    async before(config, capabilities, browser) {
        browser.addCommand('matchScreenshot', this.matchScreenshot.bind(this));
    }
    /**
     *
     * @param {reference} inst Instance (this) of current test
     * @param {string} screenshotName file name for the screenshot
     * @returns {boolean} Whether the match was successful or not
     * Sets the viewport size
     * Check if baseline file exists, if not it creates one and returns true
     * If it exists it takes a new screenshot and matches it with baseline
     * Write diff and new screenshot files in respective directories
     */
    async matchScreenshot(inst, screenshotName, config = {}) {
        const viewportSize = this.options.viewportSize || { width: 1024, height: 768 };
        await browser.setWindowSize(viewportSize.width, viewportSize.height);
        const { baseDir } = config;
        const screenshotDirectory = this.pathUtils.getScreenshotDirectory(this.currentContext, baseDir);
        makeDirectories([screenshotDirectory]);
        const baseScreenshotPath = this.pathUtils.getScreenshotPath(viewportSize, screenshotName, SCREENSHOTTYPES.BASE, screenshotDirectory);
        const isExists = await checkFileExists(baseScreenshotPath);
        if (!isExists) {
            await browser.saveScreenshot(baseScreenshotPath);
            log.info('New baseline screenshot added at ' + baseScreenshotPath);
            return true;
        }
        const screenshotPath = this.pathUtils.getScreenshotPath(viewportSize, screenshotName, SCREENSHOTTYPES.CURR, screenshotDirectory);
        await browser.saveScreenshot(screenshotPath);

        const baseImage = await readPng(baseScreenshotPath);
        const currentImage = await readPng(screenshotPath);
        const { width, height } = baseImage;
        //Skip test case when the baseline screenshot and current screenshot have different dimensions
        //Pixelmatch generates error in case of different image dimensions
        if (width !== currentImage.width || height !== currentImage.height) {
            log.warn('Different dimension of baseline and current screenshot skipping the test');
            inst.skip();
        }
        const diff = new PNG({ width, height });
        const mismatchedPixels = pixelmatch(baseImage.data, currentImage.data, diff.data, width, height, { threshold: 0.3, includeAA: true });
        log.debug($`Comparing screenshots ${screenshotPath} and ${baseScreenshotPath}`);
        writePng(this.pathUtils.getScreenshotPath(viewportSize, screenshotName, SCREENSHOTTYPES.DIFF, screenshotDirectory), diff);
        return comparisonStrategy(mismatchedPixels, width, height, config);
    }

    after(exitCode, config, capabilities) {
        // TODO: something after all tests are run
    }

    beforeTest(test, context) {
        this.currentContext = context;
    }

    beforeScenario(test, context) {
        // TODO: something before each Cucumber scenario run
    }
}

export  { PixelMatchPlugin };