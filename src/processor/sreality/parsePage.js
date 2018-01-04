const fs = require('fs');
const util = require('util');
const cheerio = require('cheerio');
const dates = require('./../../utils/dates.js')
const prefix = 'https://sreality.cz'

let getHrefs = function(cheerioObject){
  let href = [];
  cheerioObject('.text-wrap .basic h2 a').each(function(i, elm) {
      href.push(prefix+cheerioObject(this).attr("href"));
  });
  console.log(JSON.stringify(href))
  return href.filter(item => !item.includes("centrum-sluzeb"));
}

let getTitle = function(cheerioObject){
  let title = []
  cheerioObject('.text-wrap .basic h2 a span').each(function(i, elm) {
      title.push(cheerioObject(this).text().replace(/&nbsp;/g,' ') );
  });
  console.log(JSON.stringify(title))
  return title.filter(item => !item.includes("Smlouvy,"));
}

let pricePerMeter = function(price, meter){
    return price.map((n, i) => n/meter[i])
}

let getPrice = function(cheerioObject){
  let price = [];
  cheerioObject('.text-wrap .basic .norm-price').each(function(i, elm) {
    price.push(cheerioObject(this).text().replace(/&nbsp;/g,'').replace(/(Kč)/g,'') );
  });
  return price;
}

async function getStuff(data, subset) {
  try{
      const re  = /(\d){10}|(\d){9}|(\d){8}/g
      let reMetrage = /\d{3}|\d{2}/
      let reRooms = /\d+[+](kk|\d)/
      let $ = await cheerio.load(data, {
          normalizeWhitespace: true,
          xmlMode: true
      });

      let id = await getHrefs($).map(href => href.match(re) );      
      let href = await getHrefs($);
      let title = await getTitle($);
      let area = await title.map(x => x.match(reMetrage) ? x.match(reMetrage)[0].replace(/ /g, "") : null)
      let rooms = await title.map(x => x.match(reRooms) ? x.match(reRooms)[0] : null)
      let price = await getPrice($)
      let ppm = await pricePerMeter(price, area)
      let timestamp = await dates.getDate()
      
      return title.map(function (a,b) {
              return {
              "id": id[b][0],
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

// async function readFile (path) {
//     return new Promise((resolve,reject) => {
//         fs.readFile(path, 'utf-8', function (err, content) {
//             if (err) {
//                 return reject(err)
//             }
//             resolve(content)
//         }
//     )})
// }

// (async () => {
//     console.log('start vole')
// 	// let data = await getPages.getSourceFromUrl(url)
//     // console.log(data)
//     data = await readFile('sreality.html')
//     let details = await getStuff(data, {provider: 'sreality', region: 'itemname'})
// 	// await persistance.addMissing(details)
// })()

module.exports.getStuff = getStuff