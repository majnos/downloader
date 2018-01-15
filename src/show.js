const db = require('./db/baseControl.js');
const utils = require('./utils/dates.js');
const regions = require('./metadata/regions');
//     { "name": "Praha-Projekty", "url": "https://reality.idnes.cz/developerske-projekty/?isa%5B%5D=1&isa%5B%5D=2&isa%5B%5D=4&cena_do=6500000&plocha_od=75&f_kraj%5B%5D=1&f_kraj%5B%5D=12&f_okres1%5B%5D=80&f_okres1%5B%5D=82&f_okres1%5B%5D=84&f_okres12%5B%5D=10&f_okres12%5B%5D=11"},

(async () => {
  console.log(`start vole`)
  let subset = 'bezrealitky'
    let newest = await db.findAll('default', { 
      timestamp: {
        $gte: await utils.getPreviousDate(days = 2)
    }})
    console.log(newest)
    // console.log('start vole')
    // let subset = 'bezrealitky'
    // let newest = await db.findAll('default', {})
    // console.log(newest)  
  }
)()