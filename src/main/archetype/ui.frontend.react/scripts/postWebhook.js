const fs = require('fs');

// destination.txt will be created or overwritten by default.
fs.copyFile(__dirname + '/../dist/app.js', __dirname + '/../../ui.frontend.ssr.ioruntime/actions/common/app.js', (err) => {
    if (err) throw err;

    if(fs.existsSync(__dirname + '/../dist/app.js.map')){
        fs.copyFile(__dirname + '/../dist/app.js.map', __dirname + '/../../ui.frontend.ssr.ioruntime/actions/common/app.js.map', (err) => {

            if (err) throw err;

            console.log('Server Distribution was prepped for Runtime action');
        });
    }else{
        console.log('Server Distribution was prepped for Runtime action - no map found');
    }


});
