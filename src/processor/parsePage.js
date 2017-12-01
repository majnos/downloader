const fs = require('fs');
const util = require('util');
const cheerio = require('cheerio');
const readFile = util.promisify(fs.readFile);

let getHrefs = function(cheerioObject){
  let href = [];
  cheerioObject('.list .item .desc h3 a').each(function(i, elm) {
      // console.log(  $(this).attr("href") );
      href.push(cheerioObject(this).attr("href"));
  });
  return href.filter(item => !item.includes("centrum-sluzeb"));
}

let getSize = function(cheerioObject){
  let size = []
  cheerioObject('.list .item .desc .surface').each(function(i, elm) {
      size.push(cheerioObject(this).text() );
  });
  return size.filter(item => !item.includes("Smlouvy,"));
}

let getPrice = function(cheerioObject){
  let price = [];
  cheerioObject('.list .item .desc .price').each(function(i, elm) {
      price.push(cheerioObject(this).text() );
  });
  return price;
}

async function getStuff(data) {
  try{
      let $ = await cheerio.load(data, {
          normalizeWhitespace: true,
          xmlMode: true
      });
      let href = await getHrefs($);
      let size = await getSize($);
      let rooms = await size.map(x => x.split(',')[0].split(" ")[2]);
      let price = await getPrice($);

      return size.map(function (a,b) {
              return {
              "size": a,
              "href": href[b],
              "price": price[b],
              "rooms": rooms[b]
              }})
  }
  catch(err){
    console.log(err);
}
}

module.exports.getStuff = getStuff