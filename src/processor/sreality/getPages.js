let fs = require('fs')
const TIMEOUT = 3000

const {Builder, By, until} = require('selenium-webdriver');
const chromeDriver = require('selenium-webdriver/chrome.js');
const options = new chromeDriver.Options();
options.addArguments(
    'headless',
    'disable-gpu'
);
const log = require.main.require('./logger.js');



function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
  
async function clickAndRead(driver){
	log.info('Clicking in the browser')	
	let items = ''
	try {
		while(true) {
			await sleep(TIMEOUT)
			try{
				let ending = await driver.findElement(By.className("btn-paging-pn icof icon-arr-right paging-next disabled"))
				items = items + await driver.executeScript("return document.documentElement.outerHTML")	
				log.info('Returning items')
				return items
			} catch(err) {
				if (err.name == 'NoSuchElementError'){
					items = items + await driver.executeScript("return document.documentElement.outerHTML")	
					let elem = await driver.findElement(By.className("btn-paging-pn icof icon-arr-right paging-next"))
					await driver.executeScript("arguments[0].scrollIntoView()", elem)
					await elem.click()
				} 
				else {
					throw err
				}
			}
			await sleep(TIMEOUT)
		}
	} catch (error) {
		log.info('Not expected ')
	}
}

async function getSourceFromUrl(url){
	try { 
		let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
		await driver.get(url)
		let data = await clickAndRead(driver)
		await driver.quit()	
		return data
} catch (error) {
		console.error(error);
		await driver.quit();		
	}
}


module.exports.getSourceFromUrl = getSourceFromUrl
