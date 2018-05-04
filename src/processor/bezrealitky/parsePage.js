const fs = require('fs');
const util = require('util');
const cheerio = require('cheerio');
const readFile = util.promisify(fs.readFile);
const dates = require('./../../utils/dates.js')
const log = require.main.require('./logger.js');

let getHrefs = function(cheerioObject){
  let href = [];
  cheerioObject('.product__title a').each(function(i, elm) {
      href.push(cheerioObject(this).attr("href"));
  });
  return href.filter(item => !item.includes("centrum-sluzeb"));
}

let getTitle = function(cheerioObject){
  let title = []
  cheerioObject('.product__link strong').each(function(i, elm) {
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
  cheerioObject('.product__value').each(function(i, elm) {
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
      let reMetrage = /(\d){4} |(\d){3} |(\d){2} /
      let reRooms = /\d+[+](kk|\d)/

      let id = await getHrefs($).map(href => `bez-${href.match(re)}` );
      let href = await getHrefs($);2
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
              "provider": subset['provider'],
              "region": subset['region']
              }})
  }
  catch(err){
    log.error(err);
}
}

module.exports.getStuff = getStuff
