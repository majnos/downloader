const fs = require('fs');
const cheerio = require('cheerio');
const parseString = require('xml2js').parseString;

const testUrl = "https://www.bezrealitky.cz/vyhledat#?order=time_order_desc&advertoffertype=nabidka-prodej&estatetype=byt&ownership=&equipped=&estatetype%5B%5D=byt&priceFrom=null&priceTo=3000000&construction=&description=&surfaceFrom=&surfaceTo=&balcony=&terrace=&map=50.0158,14.469949,50.065742,14.608394,14&disposition%5B%5D=2-kk";
const {Builder, By, Key, until} = require('selenium-webdriver');

const baseUrl = "www.bezrealitky.cz";


/*
let defaultXmlParser = function(line) {
    return parseString(line, function (err, result) {
            result
        });
};
*/


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

let myParser = function(data) {
    console.log( data );
    let $ = cheerio.load(data, {
        normalizeWhitespace: true,
        xmlMode: true
    });
    return $('.desc').html();
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
        $('.list .item .desc').each(function(i, elm) {  
            console.log( $(this).html() );
        });

        let names = $('.list .item .desc h3 a').each(function(i, elm) {  
            console.log(  $(this).filter("Nové centrum*").html() );
        });
                
        let items = $('.list .item .desc .surface').each(function(i, elm) {  
            console.log(  $(this).filter("Smlouvy*").html() );
        });

        let prices = $('.list .item .desc .price').each(function(i, elm) {  
            console.log( $(this).html() );
        });
    });
}

// getSourceFromUrl(testUrl, 'temp.html');
getItemsFromRawData('temp.html');
//const line = `<div class="wrapper"> <div class="image"> <a href="/nemovitosti-byty-domy/495202-nabidka-prodej-bytu-na-sadce-praha" data-ng-href="/nemovitosti-byty-domy/495202-nabidka-prodej-bytu-na-sadce-praha" target="_blank"> <!-- ngIf: result.reserved --> <img data-ng-src="https://www.bezrealitky.cz/media/cache/record_thumb/data/record/images/495k/495202/1508762704-bgvwp-img00000004bpct-lb.jpg" alt="Prodej bytu 2+kk, 42 m&#xB2; bez realitky, Na S&#xE1;dce, Praha - Chodov, hlavn&#xED; foto" src="https://www.bezrealitky.cz/media/cache/record_thumb/data/record/images/495k/495202/1508762704-bgvwp-img00000004bpct-lb.jpg"/> </a> <!-- ngIf: result.favorite --> </div> <div class="text"> <div class="desc"> <h3> <a href="/nemovitosti-byty-domy/495202-nabidka-prodej-bytu-na-sadce-praha" data-ng-href="/nemovitosti-byty-domy/495202-nabidka-prodej-bytu-na-sadce-praha" target="_blank" class="ng-binding">Na S&#xE1;dce, Praha - Chodov</a> </h3> <div class="surface ng-binding">Prodej bytu 2+kk, 42 m&#xB2;</div> <div class="price ng-binding">2.800.000 K&#x10D;</div> </div> <div class="links"> <div> <span class="label verified ng-hide" data-ng-show="result.userVerified">ov&#x11B;&#x159;en&#xFD; u&#x17E;ivatel</span> <span class="label developer ng-hide" data-ng-show="result.ideveloper">developer</span> </div> <!-- ngIf: !result.favorite --><a href="" class="favorite ng-scope" data-ng-if="!result.favorite" data-ng-click="addToFavorite(result)" title="Ulo&#x17E;&#xED; v&#xE1;&#x161; inzer&#xE1;t mezi obl&#xED;ben&#xE9;, tak&#x17E;e se k n&#x11B;mu budete moci vracet.">Do obl&#xED;ben&#xFD;ch</a><!-- end ngIf: !result.favorite --> <!-- ngIf: result.favorite --> <!-- ngIf: !result.ideveloper && result.userWebId == 0 --> </div> <a class="btn-detail" href="/nemovitosti-byty-domy/495202-nabidka-prodej-bytu-na-sadce-praha" title="Klikn&#x11B;te pro bli&#x17E;&#x161;&#xED; informace k inzer&#xE1;tu." target="_blank">Detail</a> </div> <div class="clr"/> </div>`;

//const neco = myParser(line);
//console.log('done');