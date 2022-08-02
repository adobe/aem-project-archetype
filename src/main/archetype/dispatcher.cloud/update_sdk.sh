#!/bin/bash

# Copyright 2022 Adobe Systems Incorporated
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

function usage() {
  echo "Usage: ./update_sdk.sh <SDK path> [dispatcher config directory]"
  echo "Example 1: ./update_sdk.sh /opt/dispatcher-sdks/dispatcher-sdk-2.0.116"
  echo "Example 2: ./update_sdk.sh /opt/dispatcher-sdks/dispatcher-sdk-2.0.116 src"
}

if [[ -z "$1" ]]; then
    echo "You have to specify a path to an SDK as a parameter!"
    usage
    exit -1
fi

sdkPath="$1"

if [[ ! -e "${sdkPath}/bin/docker_run.sh" ]]; then
    echo "Cannot find docker_run.sh file in '${sdkPath}/bin/docker_run.sh'."
    usage
    exit -1
fi

dispatcherVersion=$(cat ${sdkPath}/bin/docker_run.sh | grep version= | cut -f2 -d '=')

if [[ -z "$sdkPath" ]]; then
    echo "Cannot evaluate SDK. Is it a valid path to a dispatcher SDK?"
    usage
    exit -1
fi

echo "Attempting to upgrade to dispatcher SDK version $dispatcherVersion..."

if [[ ! -e "${sdkPath}/bin/update_maven.sh" ]]; then
    echo "The dispatcher SDK version that you have chosen does not yet support updates."
    exit -1
fi

if [[ -z "$2" ]]; then
  scriptDir=$(dirname "$0")
  configPath=$scriptDir/src
else
  configPath="$2"
fi


$sdkPath/bin/update_maven.sh "$configPath"
