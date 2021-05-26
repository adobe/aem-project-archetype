require("regenerator-runtime/runtime");
const processor = require('../common/app');

async function main(args) {


    const refinedArgs = {
        data: args,
        pageRoot: args.__ow_headers['page-model-root-url'],
        pagePath: args.__ow_path,
        wcmmode: args.__ow_headers['wcm-mode']
    }

    try {
        const response = await processor.processSPA(refinedArgs);
        return {
            headers: {
                'Content-Type': 'text/html'
            },
            statusCode: 200,
            body: response
        };

    } catch (err) {
        console.error("Error!", err);
        return {
            body: { html: (err.stack) ? err + ' stack: ' + err.stack : error },
            code: 500
        }
    }


}

global.main = main;
exports.main = main;
