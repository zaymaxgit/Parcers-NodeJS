const puppeteer = require('puppeteer')

const url = "https://www.amazon.in/s?k=Shirts&ref=nb_sb_noss_2"

async function product(url){
    //Эмуляция браузера
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    })
    const page = await browser.newPage()
    await page.goto(url, {waitUntil: 'networkidle2'})

    //находим каждый item который имеет data-cel-widget^="search_result_"
    await page.waitFor('div[data-cel-widget^="search_result_"]')

    const result = await page.evaluate(()=>{
        let searchResult = Array.from(document.querySelectorAll('div[data-cel-widget^="search_result_"]')).length
        let productList = []
        for(let i = 1; i < searchResult - 1; i++ ){
            let product = {
                brand: '',
                product: '',
                image: '',
                url: '',
                price: ''
            }
            
            let brand = document.querySelector(`div[data-cel-widget="search_result_${i}"] .a-size-base-plus.a-color-base`)
            product.brand = brand ? brand.innerHTML : ''

            let prod = document.querySelector(`div[data-cel-widget="search_result_${i}"] .a-size-base-plus.a-color-base.a-text-normal`)
            product.product = prod ? prod.innerHTML : ''

            let image = document.querySelector(`div[data-cel-widget="search_result_${i}"] .s-image`)
            product.image = image ? image.src : ''

            let url = document.querySelector(`div[data-cel-widget="search_result_${i}"] a[target="_blank"].a-link-normal`)
            product.url = url ? url.href : ''

            let price = document.querySelector(`div[data-cel-widget="search_result_${i}"] span.a-offscreen`)
            product.price = price ? price.innerHTML : ''
            
           
            productList = productList.concat(product)
           

        }
        return productList
    })
    console.log(result);

    await browser.close();
}
product(url)

