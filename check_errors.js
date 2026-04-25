import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    page.on('console', msg => {
      console.log('BROWSER CONSOLE:', msg.type(), msg.text());
    });

    page.on('pageerror', error => {
      console.log('PAGE ERROR:', error.message);
    });

    await page.goto('http://localhost:5173/voting', { waitUntil: 'networkidle0', timeout: 10000 });
    
    const content = await page.content();
    console.log("HTML CONTENT:", content.substring(0, 1000)); // Print part of HTML to see what rendered
    
    await browser.close();
  } catch (err) {
    console.error("Puppeteer Error:", err);
  }
})();
