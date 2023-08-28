#!/usr/bin/env bash

# Copyright 2023 Adobe Systems Incorporated
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# start a single X11 server and pass the server's address to each Cypress instance using DISPLAY variable
pkill Xvfb
echo 'start xvfb'
Xvfb :99 -screen 0 1280x1024x24 -ac -nolisten tcp -nolisten unix &
export DISPLAY=:99
echo 'checking Xvfb'
ps aux | grep Xvfb
# disable color output when running Cypress
export NO_COLOR=1
# execute tests
npm test
