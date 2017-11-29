const {Builder, By, Key, until} = require('selenium-webdriver');

let getSourceFromUrl = function(url) {
  let driver = new Builder()
      .forBrowser('chrome')
      .build();

  driver.get(url)
      .then( () => driver.getPageSource())
      .then( txt => txt )
}

module.exports.getSourceFromUrl = getSourceFromUrl


// let getSourceFromUrl = function(url, file) {
//   let driver = new Builder()
//       .forBrowser('chrome')
//       .build();

//   driver.get(url)
//       .then( function () {
//           return driver.getPageSource();
//       })
//       .then( function (txt) {
//           fs.writeFile(file, txt, function(err) {
//               if(err) {
//                   return console.log(err);
//               }
//               console.log("The file was saved!");
//           });
//       })
// }

