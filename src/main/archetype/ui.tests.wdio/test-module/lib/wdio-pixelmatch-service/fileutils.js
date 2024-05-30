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
import fs from 'fs';

import { PNG } from 'pngjs';
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

export  {
    makeDirectories,
    checkFileExists,
    readPng,
    writePng
};