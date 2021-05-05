const appModule = require('../webapp/server/main');

const app = appModule.default();

const forward = require('expressjs-openwhisk')(app);

function main (args){

    const refinedArgs = {
        '__ow_path': args['__ow_path'],
        '__ow_headers': args['__ow_headers'],
        '__ow_method': args['__ow_method'],
        '__ow_body': args
    };

    return forward(refinedArgs);

}

exports.main = main;
