const puppeteer = require('puppeteer');

async function scrapeProductLinks(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // ดึงข้อมูลลิงก์จากหน้า
    const productLinks = await page.evaluate(() => {
        const products = [];
        document.querySelectorAll('div.my-list-wrapper ul.my-list-item li.spec-item').forEach(item => {
            const product = {
                type: item.querySelector('.type').textContent.trim(),
                name: item.querySelector('.name a').textContent.trim(),
                link: item.querySelector('.name a').href,
                price: item.querySelector('.price').textContent.trim(),
            };
            products.push(product);
        });
        return products;
    });

    await browser.close();
    return productLinks;
}

async function main() {
    const url = 'https://notebookspec.com/pc/9675980';
    const products = await scrapeProductLinks(url);
    console.log(products);
}

main();
