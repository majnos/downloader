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

const url = "http://realitymix.centrum.cz/vypis-nabidek/?form%5Binzerat_typ%5D=1&form%5Badresa_kraj_id%5D%5B%5D=19&form%5Badresa_region_id%5D%5B19%5D%5B%5D=60&form%5Bsearch_in_city%5D=&form%5Bcena_normalizovana__from%5D=&form%5Bcena_normalizovana__to%5D=6500000&form%5Bplocha__from%5D=75&form%5Bplocha__to%5D=&form%5Bvlastnictvi%5D%5B%5D=1&form%5Bvlastnictvi%5D%5B%5D=3&form%5Bsearch_in_text%5D=&form%5Bnemovitost_typ%5D%5B%5D=4&form%5Bcena_mena%5D=1&form%5Bpodlazi_cislo__from%5D=&form%5Bpodlazi_cislo__to%5D="

async function clickMore(driver){
	log.info('Clicking in the browser')
	try {
		while(true) {
			await sleep(TIMEOUT)
			let elem = await driver.findElement(By.className("btn btn-primary btn-arr btn-arr-down"))
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
		// console.error(error);
		await driver.quit();		
	}
}

// (async () => {
// 	let data = await getSourceFromUrl(url)
// 	log.info(data)
// })()

module.exports.getSourceFromUrl = getSourceFromUrl
