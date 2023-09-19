#!/usr/bin/env bash

# start a single X11 server and pass the server's address to each Cypress instance using DISPLAY variable
pkill Xvfb
echo 'start xvfb'
Xvfb :99 -screen 0 1280x1024x24 -ac -nolisten tcp -nolisten unix &
export DISPLAY=:99
echo 'checking Xvfb'
ps aux | grep Xvfb
# execute tests
npm test