// babel-node  .\dl.js --presets es2017
// https://stackoverflow.com/questions/40593875/using-filesystem-in-node-js-with-async-await

const fs = require('fs');
const util = require('util');
const cheerio = require('cheerio');
const readFile = util.promisify(fs.readFile);


const testUrl = "https://www.bezrealitky.cz/vyhledat#?order=time_order_desc&advertoffertype=nabidka-prodej&estatetype=byt&ownership=&equipped=&estatetype%5B%5D=byt&priceFrom=null&priceTo=3000000&construction=&description=&surfaceFrom=&surfaceTo=&balcony=&terrace=&map=50.0158,14.469949,50.065742,14.608394,14&disposition%5B%5D=2-kk";
const {Builder, By, Key, until} = require('selenium-webdriver');

const baseUrl = "www.bezrealitky.cz";

let getSourceFromUrl= function(url, file) {
    let driver = new Builder()
        .forBrowser('chrome')
        .build();

    driver.get(url)
        .then( function () {
            return driver.getPageSource();
        })
        .then( function (txt) {
            fs.writeFile(file, txt, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        })
}

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

async function getStuff() {
    try{
        let data = await readFile('temp.html','utf8');
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
                "surface": surface[b],
                "rooms": rooms[b]
                }})
    }
    catch(err){
      console.log(err);
  }
}

//getSourceFromUrl(testUrl,'temp.html');
getStuff().then(data => {
    console.log(data);
});