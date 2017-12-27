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

let getTitle = function(cheerioObject){
  let title = []
  cheerioObject('.list .item .desc .surface').each(function(i, elm) {
      title.push(cheerioObject(this).text() );
  });
  console.log(JSON.stringify(title))
  return title.filter(item => !item.includes("Smlouvy,"));
}

let getPrice = function(cheerioObject){
  let price = [];
  cheerioObject('.list .item .desc .price').each(function(i, elm) {
      price.push(cheerioObject(this).text() );
  });
  return price;
}

async function getStuff(data, subset) {
  try{
      const re  = /(\d){6}|(\d){5}/g
      let $ = await cheerio.load(data, {
          normalizeWhitespace: true,
          xmlMode: true
      });
      let id = await getHrefs($).map(href => href.match(re) );      
      let href = await getHrefs($);
      let title = await getTitle($);
      let size = await title.map(x => x.split(',')[1].split(" ")[1]);  //regex na x.xxx m nebo xxx m
      let rooms = await title.map(x => x.split(',')[0].split(" ")[2]); //regex na cislo+kk(nebo cislo)
      let price = await getPrice($);
      let timestamp = await dates.getDate()
      
      return title.map(function (a,b) {
              return {
              "id": id[b][0],
              "title": a,
              "href": href[b],
              "price": price[b],
              "rooms": rooms[b],
              "size": size[b],
              "timestamp": timestamp,
              "subset": subset
              }})
  }
  catch(err){
    console.log(err);
}
}

module.exports.getStuff = getStuff