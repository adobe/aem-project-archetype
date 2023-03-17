/*
 *  Copyright 2023 Adobe Systems Incorporated
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
import copyup from 'copyfiles';
// move reports to the reports path if set,currently the wdio-nice-html reporter does not work with
// absolute paths outside the project
if ('REPORTS_PATH' in process.env){
    const config = {};
    config.up = 1;
    copyup(['./reports/**/*', process.env.REPORTS_PATH], config,  function (err) { console.log(err); });
}