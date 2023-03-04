// common ...................
const path = require('path');
const fs = require('fs');

const escape = [
    'index.js'
];
const list = {};
fs.readdirSync(__dirname + '/').forEach(file => {
    let name = path.parse(file).name;
    if(escape.includes(file)){
        return null;
    }
    list[name] = require('./'+file);
});

module.exports = list;