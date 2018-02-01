const fs = require('fs');
const util = require('util');
const cheerio = require('cheerio');
const readFile = util.promisify(fs.readFile);
const dates = require('./../../utils/dates.js')
const prefix = 'https://bezrealitky.cz'
const log = require.main.require('./logger.js');

let getHrefs = function(cheerioObject){
  let href = [];
  cheerioObject('.list .item .desc h3 a').each(function(i, elm) {
      href.push(prefix+cheerioObject(this).attr("href"));
  });
  return href.filter(item => !item.includes("centrum-sluzeb"));
}

let getTitle = function(cheerioObject){
  let title = []
  cheerioObject('.list .item .desc .surface').each(function(i, elm) {
      title.push(cheerioObject(this).text() );
  });
  //log.info(JSON.stringify(title))
  return title.filter(item => !item.includes("Smlouvy,"));
}

let pricePerMeter = function(price, meter){
    return price.map((n, i) => n/meter[i])
}

let getPrice = function(cheerioObject){
  let price = [];
  cheerioObject('.list .item .desc .price').each(function(i, elm) {
      price.push(cheerioObject(this).text().replace(/(Kč)|([.])|([ ])/g,'') );
  });
  return price;
}

async function getStuff(data, subset) {
  try{
      log.info('Starting parsing of the page')
      const re  = /(\d){6}|(\d){5}/g
      let $ = await cheerio.load(data, {
          normalizeWhitespace: true,
          xmlMode: true
      });
      let reMetrage = /\d*.?\d+ / 
      let reRooms = /\d+[+](kk|\d)/

      let id = await getHrefs($).map(href => `bez-${href.match(re)}` );      
      let href = await getHrefs($);
      let title = await getTitle($);
      let area = await title.map(x => x.match(reMetrage) ? x.match(reMetrage)[0].replace(/ /g, "") : null)
      let rooms = await title.map(x => x.match(reRooms) ? x.match(reRooms)[0] : null)
      let price = await getPrice($)
      let ppm = await pricePerMeter(price, area)
      let timestamp = await dates.getDate()
      log.info('Parsing done')
      
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
    log.error(err);
}
}

module.exports.getStuff = getStuff