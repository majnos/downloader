const {Builder, By, until} = require('selenium-webdriver');
let fs = require('fs')
const TIMEOUT = 3000

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const url = "https://reality.idnes.cz/s/?st=2&f_typ_nabidky%5B%5D=1&isa%5B%5D=1&f_s_vlastnictvi%5B%5D=1&f_s_vlastnictvi%5B%5D=2&f_s_vlastnictvi%5B%5D=3&lf%5B%5D=1&f_kraj%5B%5D=1&f_okres1%5B%5D=84&cena_do=6500000&plocha_od=75&f_s_aktualni=1"



async function clickAndRead(driver){
	let items = ''
	try {
		while(true) {
			// await sleep(TIMEOUT)
			// console.log('slept for ' + TIMEOUT)			
			try{
				await sleep(10000)
				console.log('adding items')
				items = items + await driver.executeScript("return document.documentElement.outerHTML")	
				console.log('looking for last element')
				let elem = await driver.findElement(By.className("next"))
				console.log('found')
				await driver.executeScript("arguments[0].scrollIntoView()", elem)
				console.log('get dom')
				await elem.click()
				console.log('elem clicked')	
			} catch(err) { paginatorpaginatorGrouppaginatorGroupGroup
				// console.log(err)
				if (err.name == 'NoSuchElementError'){
					console.log('Returning items')
					return items
				} 
				else {
					console.log('another exception found')
					throw err
				}
			}			
		}
		// await clickMore(driver)
	} catch (error) {
		console.log('no more buttons - FIX THIS ????  \n ')
		return items
	}
}

async function getSourceFromUrl(url){
	try { 
		let driver = await new Builder().forBrowser('chrome').build();
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
