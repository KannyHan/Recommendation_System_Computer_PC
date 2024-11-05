const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://notebookspec.com/pc/ranking');

  // กดปุ่ม "โหลดเพิ่มเติม" จนกว่าจะไม่มีให้กดอีก หรือข้อมูลครบ 2000 รายการ
  const hrefList = [];
  let loadMoreButton;

  do {
    loadMoreButton = await page.$('button.load-more');
    if (loadMoreButton) {
      await loadMoreButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000)); // รอให้ข้อมูลโหลด

      // ตรวจสอบจำนวนรายการที่ดึงได้
      const currentLinks = await page.evaluate(() => {
        const rows = document.querySelectorAll('.table-row');
        const links = [];
        
        rows.forEach(row => {
          const titleCol = row.querySelector('.title-col');
          if (titleCol) {
            const nameElement = titleCol.querySelector('.name a');
            if (nameElement) {
              links.push(nameElement.href);
            }
          }
        });
        return links;
      });

      // เพิ่มลิงก์ใหม่ที่ดึงได้ลงใน hrefList โดยหลีกเลี่ยงค่าที่ซ้ำกัน
      currentLinks.forEach(link => {
        if (!hrefList.includes(link)) {
          hrefList.push(link);
        }
      });
    }
  } while (loadMoreButton && hrefList.length < 500);

  // ดึงข้อมูลที่ครบตามจำนวนที่ต้องการ (หรือข้อมูลที่โหลดได้ทั้งหมด)
  console.log(hrefList.length); // แสดงผลข้อมูล 2000 รายการแรก
  await browser.close();
})();