// const dateTime = require('node-datetime');

async function getDate() {
    let  date = new Date();
    return date.toISOString(); //"2011-12-19T15:28:46.493Z"
}   

async function getPreviousDate (days = 1) {
    let  date = new Date();
    let yesterday = date.setDate(date.getDate() - days)
    return date.toISOString();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
module.exports.getDate = getDate
module.exports.sleep = sleep
module.exports.getPreviousDate = getPreviousDate