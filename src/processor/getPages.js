const {Builder, By, until} = require('selenium-webdriver');

// promise.USE_PROMISE_MANAGER = false;
async function getSourceFromUrl(url){
	let driver = await new Builder().forBrowser('chrome').build();
	await driver.get(url);
	// await driver.findElement(By.name('více inzerátů')).click();
	// await driver.findElement(By.css("div:contains('více inzerátů)")).click();
	// let element =  await driver.findElement(By.css("#container-center > section > div.result-container > div.panel-container > div.list > div:nth-child(16) > div > button"))
// 	driver.findElements(By.className("item")).then(function(elements){
//     elements.forEach(function (element) {
//         element.getText().then(function(text){
//             console.log(text);
//         });
//     });
// });
	
	let elements = await driver.findElements(By.className("item"))
	for (element in elements) {
		if (element.getText() === 'VÍCE INZERÁTŮ')
		let rightOne = await elements[16]
		let processed = await rightOne.getText() === 'VÍCE INZERÁTŮ'
	}
	console.log(processed)
	
	// let source = await driver.getPageSource();
	await driver.quit();
	return 0
}

module.exports.getSourceFromUrl = getSourceFromUrl;
