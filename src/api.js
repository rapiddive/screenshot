const express = require("express");
const serverless = require("serverless-http");

// Create an instance of the Express app
const app = express();

// Create a router to handle routes
const router = express.Router();

// Define a route that responds with a JSON object when a GET request is made to the root path
router.get('/', async (req, res) => {
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



// Use the router to handle requests to the `/.netlify/functions/api` path
app.use(`/.netlify/functions/api`, router);

// Export the app and the serverless function
module.exports = app;
module.exports.handler = serverless(app);