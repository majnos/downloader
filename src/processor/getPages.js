const {Builder, By, until} = require('selenium-webdriver');

async function getMoreButtonElements(elements){
	for (let element of elements){
		let text = await element.getText()
		if (text === 'VÍCE INZERÁTŮ') {
			console.log(element.html())
			return element
		}
	}		
}

async function getSourceFromUrl(url){
	try { 
		let driver = await new Builder().forBrowser('chrome').build();
		await driver.get(url)
		//let elements = await driver.findElements(By.className("item"))
		// let newElement = await getMoreButtonElements(elements)
		// newElement.click()
	  // await driver.findElement(By.css(("button[onclick^=addToSelected]"))).click()
		// let element = await driver.findElement(By.xpath("//button[contains(text(),'inzer')]"))
		// let element = await driver.findElement(By.css("button[class='ladda-button']"))
		// let element = await driver.findElement(By.xpath("//span[text()='více inzerátů']"))
		let element = await driver.findElement(By.className("btn btn-green"))
		element.click().perform()
		await driver.quit()
		return await driver.getPageSource();
} catch (error) {
		console.error(error);
		await driver.quit();		
	}
}

module.exports.getSourceFromUrl = getSourceFromUrl;
