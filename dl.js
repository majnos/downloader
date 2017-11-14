const fs = require('fs');
const cheerio = require('cheerio');
const parseString = require('xml2js').parseString;

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
        size.push(cheerioObject(this).html() );
    });
    return size.filter(item => !item.includes("Smlouvy,"));
}

let getPrice = function(cheerioObject){
    let price = [];
    cheerioObject('.list .item .desc .price').each(function(i, elm) {  
        price.push(cheerioObject(this).html() );
    });    
    return price;
}

let getItemsFromRawData = function(file) {
    const data = fs.readFile(file, 'utf8', function read(err, data) {
        if (err) {
            throw err;
        }

        let $ = cheerio.load(data, {
            normalizeWhitespace: true,
            xmlMode: true
        });
        
        let href = getHrefs($);
        let size = getSize($); 
        let surface = size.forEach(x => x.split(/,(.+)/)[1]);
        let rooms = size.forEach(x => x.split(/,(.+)/)[1]);
        let price = getPrice($);        

        let output = size.map( function(a,b){
            return {"size": a, 
                    "href": href[b], 
                    "price": price[b],
                    "surface": surface[b],
                    "rooms": rooms[b]
                }});

        console.log(output);
    })
}

// getSourceFromUrl(testUrl, 'temp.html');
let abc = getItemsFromRawData('temp.html');