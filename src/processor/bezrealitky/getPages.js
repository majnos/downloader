const {Builder, By, until} = require('selenium-webdriver');
let fs = require('fs')
const TIMEOUT = 3000

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
  

async function clickMore(driver){
	try {
		while(true) {
			await sleep(TIMEOUT)
			console.log('slept for ' + TIMEOUT)			
			let elem = await driver.findElement(By.className("btn btn-green"))
			await driver.executeScript("arguments[0].scrollIntoView()", elem)
			await elem.click()
			console.log('elem clicked')
			await sleep(TIMEOUT)
		}
		// await clickMore(driver)
	} catch (error) {
		console.log('no more buttons - FIX THIS????? \n ')
	}
}

async function getSourceFromUrl(url){
	try { 
		let driver = await new Builder().forBrowser('chrome').build();
		await driver.get(url)
		await clickMore(driver)	
		let items = await driver.executeScript("return document.documentElement.outerHTML")	
		await driver.quit()	
		return items
} catch (error) {
		// console.error(error);
		await driver.quit();		
	}
}

module.exports.getSourceFromUrl = getSourceFromUrl
