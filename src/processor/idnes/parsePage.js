const fs = require('fs');
const util = require('util');
const cheerio = require('cheerio');
const dates = require('./../../utils/dates.js')
const prefix = 'https://reality.idnes.cz'
const log = require.main.require('./logger.js');

// $(".c-list-products__title").toArray().map(item => item.innerText)
// $(".c-list-products__info")
// $(".c-list-products__content")
// $(".c-list-products__link")[0].href
// $(".c-list-products__price")[0]
// $(".c-list-products__title").text()


let getHrefs = function(cheerioObject){
  let href = [];
  cheerioObject('.c-list-products__link').each(function(i, elm) {
      href.push(prefix+cheerioObject(this).attr("href"));
  });
  return href
}

let getTitle = function(cheerioObject){
  let title = []
  let lastItem = {
    class: 'item lastItem'
  }
  cheerioObject('.c-list-products__title').each(function(i, elm) {
        title.push(cheerioObject(this).text());
  });
  //log.info(JSON.stringify(title))
  return title;
}

let pricePerMeter = function(price, meter){
    return price.map((n, i) => n/meter[i])
}

let getPrice = function(cheerioObject){
  let price = [];
  cheerioObject('.c-list-products__price').each(function(i, elm) {
    price.push(cheerioObject(this).text().replace(/(Kč)|([.])|([ ])/g,''));
  });
  return price;
}

async function getStuff(data, subset) {
  try{
      log.info('Starting parsing of the page')
      const re  = /[0-9a-f]{24}/g
      let reMetrage = /\d{3}|\d{2}/
      let reRooms = /\d+[+](kk|\d)/
      let $ = await cheerio.load(data, {
          normalizeWhitespace: true,
          xmlMode: true
      });
      let id = await getHrefs($).map(href => `idnes-${href.match(re)}` );      
      let href = await getHrefs($);
      let title = await getTitle($);
      let area = await title.map(x => x.match(reMetrage) ? x.match(reMetrage)[0].replace(/ /g, "") : null)
      let rooms = await title.map(x => x.match(reRooms) ? x.match(reRooms)[0] : null)
      let price = await getPrice($).map( x => x !== null ? x : null)
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