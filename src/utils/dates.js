// const dateTime = require('node-datetime');

async function getDate() {
    let  date = new Date();
    return date.toISOString(); //"2011-12-19T15:28:46.493Z"
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
module.exports.getDate = getDate
module.exports.sleep = sleep