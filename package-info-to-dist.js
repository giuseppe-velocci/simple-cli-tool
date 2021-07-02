const fs = require('fs');
const packageInfo = require('./package.json');

const data = `exports.name= '${packageInfo.name}'; exports.version= '${packageInfo.version}';`;
fs.writeFileSync('./dist/package-info.js', data);