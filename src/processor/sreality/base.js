let getPages = require('./getPages.js')
let parsePage = require('./parsePage.js')

// let url = 'https://www.sreality.cz/hledani/prodej/byty/praha-6?plocha-od=75&plocha-do=10000000000&cena-od=0&cena-do=6500000';

// (async () => {
//     console.log('start vole')
// 	let data = await getPages.getSourceFromUrl(url)
//     console.log(data)
//     // let details = await parsePage.getStuff(data, {provider: 'sreality', region: 'itemname'})

// 	//info clear ng-scope
// 	// await persistance.addMissing(details)
// })()

module.exports.getPages = getPages
module.exports.parsePage = parsePage
