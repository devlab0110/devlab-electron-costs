const path = require('path');
const fs = require('fs');
const moment = require('moment');

class Logger {

  static async error(dir, error){

    console.log('ERROR: -----------------------------');
    console.log(error);
    console.log('ERROR: -----------------------------');

    const file = path.join(dir, moment().format('YYYY-MM-DD HH mm ss x')+'.log');
    try {
      fs.writeFileSync(file, error.stack);
    } catch (err) {}

  }
  
}

module.exports = Logger;