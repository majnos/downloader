const {Builder, By, until} = require('selenium-webdriver');

async function clickMore(driver){
	let elem = await driver.findElement(By.className("btn btn-green"))
	await driver.executeScript("arguments[0].scrollIntoView()", elem)
	await elem.click()
}

async function getSourceFromUrl(url){
	try { 
		let driver = await new Builder().forBrowser('chrome').build();
		await driver.get(url)
		await clickMore(driver)	
		let source = await driver.getPageSource()
		// await driver.quit()
		return source
} catch (error) {
		console.error(error);
		await driver.quit();		
	}
}

module.exports.getSourceFromUrl = getSourceFromUrl;
