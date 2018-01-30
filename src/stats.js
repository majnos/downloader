const db = require('./db/baseControl.js');
const utils = require('./utils/dates.js');
const regions = require('./metadata/regions.json');
console.log('tmp');


(async () => {
  console.log(`start vole`)
    let newest = await db.findAll('default', { 
        timestamp: {
        $gte: await utils.getPreviousDate(days = 3)
    }})
    newest.forEach(
        item => console.log(item)
    )
    // console.log('start vole')
    // let subset = 'bezrealitky'
    // let newest = await db.findAll('default', {})
    // console.log(newest)  
  }
)()