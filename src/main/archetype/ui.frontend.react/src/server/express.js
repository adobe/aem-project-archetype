/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2021 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// Expose XMLHttpRequest globally so ModelManager can use it
import express from "express";
import bodyParser from "body-parser";
import processSPA from "./aem-processor.functions";

var exapp = express();
//Here we are configuring express to use body-parser as middle-ware.
exapp.use(bodyParser.urlencoded({ extended: false }));
exapp.use(bodyParser.json());
exapp.use(express.static("dist"));

exapp.post('/api/v1/web/guest/${appId}-0.1.0/ssr/*', (req, res, next) => {

    const args = {
        pagePath: req.path.replace('.html', ''),
        pageRoot: req.header('root-page-path'),
        wcmmode: req.header('wcm-mode'),
        data: req.body,
        method: 'POST'
    };

    return processSPA(args).then((response) => {
        res.send(response);
    }).catch((error) => {
        next(error);
    });
});

exapp.listen(3233, () => console.log('Express SSR handler running on 3233!'));
