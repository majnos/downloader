let fs = require('fs')
const TIMEOUT = 3000

const {Builder, By, until} = require('selenium-webdriver');
const chromeDriver = require('selenium-webdriver/chrome.js');
const options = new chromeDriver.Options();
// options.addArguments(
//     'headless',
//     'disable-gpu'
// );
const log = require.main.require('./logger.js');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function clickMore(driver){
	log.info('Clicking in the browser')
	try {
		while(true) {
			await sleep(TIMEOUT)
			let elem = await driver.findElement(By.className("btn btn-green"))
			await driver.executeScript("arguments[0].scrollIntoView()", elem)
			await elem.click()
			await sleep(TIMEOUT)
		}
	} catch (error) {
		log.info('Returning items')
	}
}

async function getSourceFromUrl(url){
	try { 
		let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
		await driver.get(url)
		await clickMore(driver)	
		let items = await driver.executeScript("return document.documentElement.outerHTML")	
		await driver.quit()	
		return items
} catch (error) {
		await driver.quit();		
	}
}

module.exports.getSourceFromUrl = getSourceFromUrl
