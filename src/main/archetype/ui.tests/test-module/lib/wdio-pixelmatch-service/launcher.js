/* eslint-disable no-unused-vars */
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const logger = require('@wdio/logger').default;
const log = logger('PixelMatchPlugin');
const { checkFileExists, makeDirectories, readPng, writePng } = require('./fileutils');
const comparisonStrategy = require('./comparisonstrategy');
const PathUtils = require('./pathutils');
class PixelMatchPlugin {
    /**
     * `serviceOptions` contains all options specific to the service
     * e.g. if defined as follows:
     *
     * ```
     * services: [['custom', { foo: 'bar' }]]
     * ```
     *
     * the `serviceOptions` parameter will be: `{ foo: 'bar' }`
     */

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
     * @param {string} screenshotName file name for the screenshot
     * @returns {boolean} Whether the match was successful or not
     * Sets the viewport size
     * Check if baseline file exists, if not it creates one and returns true
     * If it exists it takes a new screenshot and matches it with baseline
     * Write diff and new screenshot files in respective directories
     */
    async matchScreenshot(screenshotName, config) {
        const viewportSize = this.options.viewportSize || { width: 1024, height: 768 };
        await browser.setWindowSize(viewportSize.width, viewportSize.height);
        const testProperties = { viewportSize, screenshotName };
        testProperties.context = this.currentContext;
        makeDirectories(this.pathUtils.getScreenshotDirectories(testProperties.context));
        const baseScreenshotPath = this.pathUtils.getBaseScreenshotPath(testProperties);
        const isExists = await checkFileExists(baseScreenshotPath);
        if (!isExists) {
            await browser.saveScreenshot(baseScreenshotPath);
            log.info('New baseline screenshot added at ' + baseScreenshotPath);
            return true;
        }
        const screenshotPath = this.pathUtils.getCurrentScreenshotPath(testProperties);
        await browser.saveScreenshot(screenshotPath);

        const baseImage = await readPng(baseScreenshotPath);
        const currentImage = await readPng(screenshotPath);
        const { width, height } = baseImage;
        const diff = new PNG({ width, height });
        const mismatchedPixels = pixelmatch(baseImage.data, currentImage.data, diff.data, width, height, { threshold: 0.1, includeAA: true });
        log.debug($`Comparing screenshots ${screenshotPath} and ${baseScreenshotPath}`);
        writePng(this.pathUtils.getDiffScreenshotPath(testProperties), diff);
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
module.exports = {
    PixelMatchPlugin
};