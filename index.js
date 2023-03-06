const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/screenshot', async (req, res) => {
    let url = 'https://adobe-commerce-tester.freetls.fastly.net/adobe-commerce-tester/';
    if (req.query.url) {
        url = req.query.url;
    }
    if (!url) {
        return res.status(400).send('Missing URL parameter');
    }
    let screenshot = 'Not yet';
    (async () => {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true
        });
        const page = await browser.newPage();
        await page.goto(url,  {
            waitUntil: "networkidle0"
          }).catch((err) => {
            console.log(err);
          });
          page.setViewport({width: 800, height: 400});
        screenshot = await page.screenshot({ fullPage: true });        
        await browser.close();   
        res.set('Content-Type', 'image/png');
         res.send(screenshot);   
    })();
    
});


app.get('/ping', async (req, res) => {
var obj = {};
  obj.status = "ok";
  obj.envname = process.env.ENVIRONMENT_NAME;
  obj.region = process.env.REGION_NAME;
  res.json(obj);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});