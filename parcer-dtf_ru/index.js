const puppeteer = require('puppeteer')

const url = "https://dtf.ru"

async function product(url){
    //Эмуляция браузера
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    })
    const page = await browser.newPage()
    await page.goto(url, {waitUntil: 'networkidle2'})

    //находим каждый item который имеет data-cel-widget^="search_result_"
    await page.waitFor('div[data-gtm^="Feed — Item"]')

    const result = await page.evaluate(()=>{
        let searchResult = Array.from(document.querySelectorAll('div[data-gtm^="Feed — Item"]')).length
        let productList = []
        for(let i = 1; i < searchResult - 1; i++ ){
            let product = {
                title: '',
                text: '',
            }
            
            let title = document.querySelector(`div[data-gtm="Feed — Item ${i} — Click"] .content-title.content-title--short.l-island-a`)
            product.title = title ? title.innerText : ''

            let text = document.querySelector(`div[data-gtm="Feed — Item ${i} — Click"] .l-island-a > p`)
            product.text = text ? text.innerText : ''

            productList = productList.concat(product)
           

        }
        return productList
    })
    console.log(result);

    await browser.close();
}
product(url)

