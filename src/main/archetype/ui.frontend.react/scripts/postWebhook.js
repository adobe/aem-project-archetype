var fs = require('fs');
var path = require('path');

var appJsDistPath = path.join(__dirname, '..', 'dist','app.js');
var appJsDestPath = path.join(__dirname, '..', 'actions', 'common', 'app.js');

// destination.txt will be created or overwritten by default.
fs.copyFile(appJsDistPath, appJsDestPath, (err) => {
    if (err) throw err;

    var appJsMapDistPath = path.join(__dirname, '..', 'dist','app.js.map');
    var appJsMapDestPath = path.join(__dirname, '..', 'actions', 'common', 'app.js.map');

    if(fs.existsSync(appJsMapDistPath)){
        fs.copyFile(appJsMapDistPath, appJsMapDestPath, (err) => {

            if (err) throw err;

            console.log('Server Distribution was prepped for Runtime action');
        });
    }else{
        console.log('Server Distribution was prepped for Runtime action - no map found');
    }


});
