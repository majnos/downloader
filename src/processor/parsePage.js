const fs = require('fs');
const util = require('util');
const cheerio = require('cheerio');
const readFile = util.promisify(fs.readFile);
const dates = require('./../utils/dates.js')

let getHrefs = function(cheerioObject){
  let href = [];
  cheerioObject('.list .item .desc h3 a').each(function(i, elm) {
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
      const re  = /(\d){6}|(\d){5}/g
      let $ = await cheerio.load(data, {
          normalizeWhitespace: true,
          xmlMode: true
      });
      let id = await getHrefs($).map(href => href.match(re) );      
      let href = await getHrefs($);
      let size = await getSize($);
      let rooms = await size.map(x => x.split(',')[0].split(" ")[2]);
      let price = await getPrice($);
      let timestamp = await dates.getDate()

    //   let regexp = new RegExp('\d\d\d\d\d\d', 'g');
      
      return size.map(function (a,b) {
              return {
              "id": id[b][0],
              "size": a,
              "href": href[b],
              "price": price[b],
              "rooms": rooms[b],
              "timestamp": timestamp
              }})
  }
  catch(err){
    console.log(err);
}
}

module.exports.getStuff = getStuff