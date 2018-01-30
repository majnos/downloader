const fs = require('fs');
const util = require('util');
const cheerio = require('cheerio');
const dates = require('./../../utils/dates.js')
const prefix = "www.realitymix.cz/"

let getHrefs = function(cheerioObject){
  let href = [];
  cheerioObject('.list-title a').each(function(i, elm) {
      href.push(elm.attribs.href);
  });
  console.log(JSON.stringify(href))
  return href;
}

let getTitle = function(cheerioObject){
  let title = []
  cheerioObject('.list-title a').each(function(i, elm) {
        title.push(elm.attribs.title);
  });
  console.log(JSON.stringify(title))
  return title.filter(item => !item.includes("Smlouvy,"));
}

let pricePerMeter = function(price, meter){
    return price.map((n, i) => n/meter[i])
}

let getPrice = function(cheerioObject){
  let price = [];
  cheerioObject('.price').each(function(i, elm) {
    price.push(cheerioObject(this).text().replace(/&nbsp;/g,'').replace(/(Kč)/g,'').match(/\d{7}/g));
  });
  return price;
}

async function getStuff(data, subset) {
  try{
      const re  = /(\d){11}|(\d){10}|(\d){9}|(\d){8}|(\d){7}|(\d){6}/g
      let reMetrage = /\d{3}|\d{2}/
      let reRooms = /\d+[+](kk|\d)/
      let $ = await cheerio.load(data, {
          normalizeWhitespace: true,
          xmlMode: true
      });

      let id = await getHrefs($).map( href => `realitymix-${href.match(re)[0]}` );      
      let href = await getHrefs($);
      let title = await getTitle($);
      let area = await title.map(x => x.match(reMetrage) ? x.match(reMetrage)[0].replace(/ /g, "") : null)
      let rooms = await title.map(x => x.match(reRooms) ? x.match(reRooms)[0] : null)
      let price = await getPrice($).map( x => x !== null ? x[0] : null)
      let ppm = await pricePerMeter(price, area)
      let timestamp = await dates.getDate()
      console.log('parsing done')
      
      return title.map(function (a,b) {
              return {
              "id": id[b],
              "title": a,
              "href": href[b],
              "price": price[b],
              "rooms": rooms[b],
              "area": area[b],
              "ppm": ppm[b],
              "timestamp": timestamp,
              "subset": subset
              }})
  }
  catch(err){
    console.log(err);
}
}


// async function readConfigFile () {
//   return new Promise((resolve,reject) => {
//       fs.readFile('./src/processor/realitymix/realitymix.html','utf-8', function (err, content) {
//           if (err) {
//               return reject(err)
//           }
//           resolve(content)
//       }
//   )})
// }


// (async () => {
// 	// console.log('start vole')
// 	// let data = await getSourceFromUrl(url)
// 	// console.log(data)
// 	//   if (data === undefined) {
// 	// 	  console.log('No data found')
// 	// 	  continuegetPages
// 	//   }
// 	  // console.log(data)
// 	let data = await readConfigFile()
// 	let details = await getStuff(data, {provider: "realitymix", region: "test"})
// 	// await persistance.addMissing(details)  
// 	console.log('sleeping for 10s')
// 	/// await utils.sleep(10000)
// 	}
//   )()

module.exports.getStuff = getStuff