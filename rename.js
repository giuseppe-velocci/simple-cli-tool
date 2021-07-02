// inspired by: https://gist.github.com/hpneo/c4da1ca88e56e6164e36
const fs = require('fs');
const path = require('path');
const packageInfo = require(path.join(__dirname, 'package.json'));

const dir = './dist/bin';
const match = RegExp('index', 'g');
const replace = packageInfo.name;
const files = fs.readdirSync(dir);

files.filter(function(file) {
  return file.match(match);
}).map(file => {
    const filePath = path.join(dir, file),
    newFilePath = path.join(dir, file.replace(match, replace));

    fs.renameSync(filePath, newFilePath);
});