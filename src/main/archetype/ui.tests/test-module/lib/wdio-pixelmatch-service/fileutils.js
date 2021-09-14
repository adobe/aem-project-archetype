/* eslint-disable no-unused-vars */
const fs = require('fs');
const PNG = require('pngjs').PNG;
/**
 *
 * @param {Array<string>} directories
 * Creates directories specified in the input if they do not exist.
 */
function makeDirectories(directories) {
    directories.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

async function checkFileExists(filePath) {
    return await new Promise((resolve, reject) =>
        fs.access(filePath, fs.constants.F_OK, err => resolve(!err))
    );
}
async function readPng(filePath) {
    return await new Promise((resolve, reject) => fs.createReadStream(filePath)
        .pipe(new PNG())
        .on('parsed', function () {
            resolve(this);
        }));
}
/**
 *
 * @param {string} path Path including image name where the image should be stored
 * @param {string} png Data of the image
 */
function writePng(path, png) {
    fs.writeFileSync(path, PNG.sync.write(png));
}
module.exports = {
    makeDirectories,
    checkFileExists,
    readPng,
    writePng
};