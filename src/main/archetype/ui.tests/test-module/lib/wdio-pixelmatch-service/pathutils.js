const path = require('path');
const BASE_DIR = 'base',
    CURR_DIR = 'screenshot',
    DIFF_DIR = 'diff';

class PathUtils {
    constructor(pixelmatchDirectory) {
        this.pixelmatchDirectory = pixelmatchDirectory || './pixelmatch';
    }

    getScreenshotName({ viewportSize, screenshotName }) {
        return `${screenshotName} ${viewportSize.width}x${viewportSize.height}.png`;
    }
    getScreenshotDirectory(context, type) {
        return path.join(this.pixelmatchDirectory, context.test.title, browser.capabilities.platformName, browser.capabilities.browserName, type);
    }
    getBaseScreenshotPath(testProperties) {
        const { context } = testProperties;
        return path.join(this.getScreenshotDirectory(context, BASE_DIR), this.getScreenshotName(testProperties));
    }
    getCurrentScreenshotPath(testProperties) {
        const { context } = testProperties;
        return path.join(this.getScreenshotDirectory(context, CURR_DIR), this.getScreenshotName(testProperties));
    }
    getDiffScreenshotPath(testProperties) {
        const { context } = testProperties;
        return path.join(this.getScreenshotDirectory(context, DIFF_DIR), this.getScreenshotName(testProperties));
    }
    getScreenshotDirectories(context) {
        return [this.getScreenshotDirectory(context, BASE_DIR), this.getScreenshotDirectory(context, CURR_DIR), this.getScreenshotDirectory(context, DIFF_DIR)];
    }
}
module.exports = PathUtils;