const fs = require('fs');
const path = require('path');
const packageInfo = require(path.join(__dirname, '../', 'package.json'));

const data = `exports.name= '${packageInfo.name}'; exports.version= '${packageInfo.version}';`;
fs.writeFileSync(path.join(__dirname, '../', 'dist/package-info.js'), data);