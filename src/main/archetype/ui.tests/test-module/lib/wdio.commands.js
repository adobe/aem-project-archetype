/*
 *  Copyright 2020 Adobe Systems Incorporated
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

import path from 'path';
import url from 'url';
import { aem, upload_url, shared_folder } from './config.js';
import commons from './commons.js';
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import FormData  from 'form-data';
const AEM_SITES_PATH = '/sites.html';




async function AEMLogin(username,password){
    // Check presence of local sign-in Accordion
    if (await $('[class*="Accordion"] form').isExisting({timeout: 5000})) {
        try {
            await $('#username').setValue(username);
        }
        // Form field not interactive, not visible
        // Need to open the Accordion
        catch (e) {
            await $('[class*="Accordion"] button').click();
            // eslint-disable-next-line wdio/no-pause
            await browser.pause(500);
        }
    }

    await  $('#username').setValue(username);
    await $('#password').setValue(password);

    await $('form [type="submit"]').click();
    await $('coral-shell-content').waitForExist({timeout: 5000});
}

async function AEMForceLogout(){
    await browser.url('/');

    if (await browser.getTitle() != 'AEM Sign In') {
        await browser.url('/system/sling/logout.html');
    }

    await $('form[name="login"]').waitForExist({timeout: 3000});
}

// Returns file handle to use for file upload component,
// depending on test context (local, Docker or Cloud)
function getFileHandleForUpload (filePath) {
    return browser.call(() => {
        return fileHandle(filePath);
    });
}


async function  AEMPathExists(baseUrl, path) {
    let jar = await commons.getAuthenticatedRequestOptions(browser);


    const client = wrapper(axios.create({ jar }));


    return client.get(url.resolve(baseUrl, path))
        .then(function() {
            return true;
        })
        .catch(function(error) {
            if (error.response && error.response.status !== 404) {
                return false;
            }
        });
}

async function AEMDeleteAsset(assetPath) {
    let jar = await commons.getAuthenticatedRequestOptions(browser);

    const client = wrapper(axios.create({ jar }));
    const form = new FormData();
    form.append('cmd', 'deletePage');
    form.append('path', assetPath);
    form.append('force','true'),
    form.append('_charset_','utf-8');

    client.post(url.resolve(aem.author.base_url, '/bin/wcmcommand'), form);

}

async function AEMSitesSetView(type) {
    if (!Object.values(commons.AEMSitesViewTypes).includes(type)) {
        throw new Error(`View type ${type} is not supported`);
    }

    await browser.url(AEM_SITES_PATH);

    await browser.setCookies({
        name: 'cq-sites-pages-pages',
        value: type
    });

    await browser.refresh();
}
//
async function AEMSitesSetPageTitle(parentPath, name, title) {
    let originalTitle = '';

    // Navigate to page parent path
    await browser.url(path.posix.join(AEM_SITES_PATH, parentPath));
#if ( $aemVersion != "cloud" )
    const checkboxSelector = `[data-foundation-collection-item-id="${path.posix.join(parentPath, name)}"] td:first-child img`;
#else
    const checkboxSelector = `[data-foundation-collection-item-id="${path.posix.join(parentPath, name)}"] [type="checkbox"]`;
#end	
    // Select sample page in the list
    await $(checkboxSelector).waitForClickable({ timeout: 3000 });



    // eslint-disable-next-line wdio/no-pause
    await browser.pause(1000); // Avoid action bar not appearing after clicking checkbox
    await $(checkboxSelector).click();
    // Access page properties form
    await $('[data-foundation-collection-action*="properties"]').click();
    // Store original title
    originalTitle = await $('[name="./jcr:title"]').getValue();
    // Modify title
    await $('[name="./jcr:title"]').setValue(title);
    // Submit
    await $('[type="submit"]').click();
    // Wait until we get redirected to the Sites console
    await $(checkboxSelector).waitForExist();

    return originalTitle;
}

async function fileHandle(filePath) {
    if (upload_url) {
        return fileHandleByUploadUrl(upload_url, filePath);
    }
    if (shared_folder) {
        return fileHandleBySharedFolder(shared_folder, filePath);
    }
    return filePath;
}

function fileHandleBySharedFolder(sharedFolderPath, filePath) {
    const sharedFilePath = path.join(sharedFolderPath, path.basename(filePath));
    fs.copyFileSync(filePath, sharedFilePath);
    return sharedFilePath;
}

function fileHandleByUploadUrl(uploadUrl, filePath) {
    const formData = new FormData();
    formData.append(path.basename(filePath), fs.createReadStream(filePath));
    return axios.post(uploadUrl, formData, {
        headers: formData.getHeaders()
    }).then( response =>  response.data);
}

export const commands = {
    'AEMLogin': AEMLogin,
    'AEMForceLogout': AEMForceLogout,
    'AEMSitesSetView': AEMSitesSetView,
    'AEMSitesSetPageTitle': AEMSitesSetPageTitle,
    'getFileHandleForUpload': getFileHandleForUpload,
    'AEMPathExists': AEMPathExists,
    'AEMDeleteAsset': AEMDeleteAsset
};
