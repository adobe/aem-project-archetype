const fs = require('fs');
const path = require('path');

const srcFolder = path.resolve(__dirname, 'lib');

const targetFolder1 = path.resolve(__dirname, '../node_modules/formidable/lib')
const targetFolder2 = path.resolve(__dirname, '../node_modules/expressjs-openwhisk/node_modules/formidable/lib')

const targetFolder = fs.existsSync(targetFolder1) ? targetFolder1 : targetFolder2;



fs.readdirSync(srcFolder).forEach(file => {

    const data = fs.readFileSync(srcFolder + '/' + file, 'utf8')
    fs.writeFileSync(targetFolder + '/' + file,data,{encoding:'utf8',flag:'w'})
});

console.log("fixed formidable");
