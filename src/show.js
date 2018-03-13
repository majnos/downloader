const db = require('./db/baseControl.js');
const utils = require('./utils/dates.js');
const regions = require('./metadata/regions');



(async () => {
  let newest = await db.findAll('default', {
    timestamp: {
      $gte: await utils.getPreviousDate(days = 4)
  }})
  newest.forEach(item => console.log(item))
  }
)()


// (async () => {
//   let newest = await db.findAll('default', {
//     timestamp: {
//       $gte: await utils.getPreviousDate(days = 3)
//   }})
//   newest.forEach(item => console.log(item))
//   }
// )()

//  subset: { provider: /'Praha-Vychod-domy'/ },
//     region: /(domy)|(byt)/,
