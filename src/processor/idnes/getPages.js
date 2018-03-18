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
			// await sleep(TIMEOUT)
			// log.info('slept for ' + TIMEOUT)			
			try{
				await sleep(10000)
				items = items + await driver.executeScript("return document.documentElement.outerHTML")	
				let elem = await driver.findElement(By.className("btn paging__next"))
				await driver.executeScript("arguments[0].scrollIntoView(); window.scrollBy(0, -window.innerHeight / 4);", elem) // diffrent 
				await elem.click()
			} catch(err) { 
				// log.info(err)
				if (err.name == 'NoSuchElementError'){
					log.info('Returning items')
					// console.log(items)
					return items
				} 
				else {
					log.info('another exception found')
					throw err
				}
			}			
		}
	} catch (error) {
		log.info('Error occured - returrning items \n ')
		return items
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
