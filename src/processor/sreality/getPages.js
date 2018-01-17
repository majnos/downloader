let fs = require('fs')
const TIMEOUT = 3000

const {Builder, By, until} = require('selenium-webdriver');
const chromeDriver = require('selenium-webdriver/chrome.js');
const options = new chromeDriver.Options();
options.addArguments(
    'headless',
    'disable-gpu'
);


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
  
async function clickAndRead(driver){
	let items = ''
	try {
		while(true) {
			await sleep(TIMEOUT)
			console.log('slept for ' + TIMEOUT)			
			try{
				console.log('looking for last element')
				let ending = await driver.findElement(By.className("btn-paging-pn icof icon-arr-right paging-next disabled"))
				console.log('found last page - adding last page')
				items = items + await driver.executeScript("return document.documentElement.outerHTML")	
				return items
			} catch(err) {
				// console.log(err)
				if (err.name == 'NoSuchElementError'){
					console.log('adding items')
					items = items + await driver.executeScript("return document.documentElement.outerHTML")	
					console.log('looking for next button')
					let elem = await driver.findElement(By.className("btn-paging-pn icof icon-arr-right paging-next"))
					console.log('found')
					await driver.executeScript("arguments[0].scrollIntoView()", elem)
					console.log('get dom')
					await elem.click()
					console.log('elem clicked')					
				} 
				else {
					console.log('another exception found')
					throw err
				}
			}
			await sleep(TIMEOUT)
			console.log('slept for'+TIMEOUT)			
		}
		// await clickMore(driver)
	} catch (error) {
		console.log('no more buttons - FIX THIS ????  \n ')
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
