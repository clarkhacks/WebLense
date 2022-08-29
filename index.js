// Require modules
var express = require("express"); // Express web server framework
var cors = require("cors"); // Cross-Origin Resource Sharing
var app = express(); // Create an instance of the express module
const fs = require("fs"); // file system
const puppeteer = require("puppeteer"); // for scraping
const rateLimit = require("express-rate-limit"); // for rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(express.static("./images")); // Serve static files from the images directory
app.use(cors()); // Enable CORS for all requests

app.get("/alive", function (req, res) {
  res.send(200);
});

app.get("/lense/:height/:width", function (req, res) {
  var webLenseOptions = {
    height: parseInt(req.params.height),
    width: parseInt(req.params.width),
    url: req.query.url,
    latest: req.query.latest,
  };
  if (
    fs.existsSync(
      __dirname +
        "/images/" +
        webLenseOptions.url.replace(/[^A-Za-z0-9]/g, "-") +
        "-" +
        webLenseOptions.height +
        "-" +
        webLenseOptions.width +
        ".png"
    ) &&
    webLenseOptions.latest != "true"
  ) {
    res.setHeader("Content-Type", "image/png");
    res.sendFile(
      __dirname +
        "/images/" +
        webLenseOptions.url.replace(/[^A-Za-z0-9]/g, "-") +
        "-" +
        webLenseOptions.height +
        "-" +
        webLenseOptions.width +
        ".png"
    );
  } else {
    puppeteer
      .launch({
        defaultViewport: {
          width: webLenseOptions.width,
          height: webLenseOptions.height,
        },
      })
      .then(async (browser) => {
        const page = await browser.newPage();
        await page.goto(webLenseOptions.url, { waitUntil: "networkidle0" });
        await page.screenshot({
          path:
            __dirname +
            "/images/" +
            webLenseOptions.url.replace(/[^A-Za-z0-9]/g, "-") +
            "-" +
            webLenseOptions.height +
            "-" +
            webLenseOptions.width +
            ".png",
        });
        // Always close the browser after scraping
        await browser.close();
      })
      .finally(() => {
        // Send the image to the client
        res.setHeader("Content-Type", "image/png");
        res.sendFile(
          __dirname +
            "/images/" +
            webLenseOptions.url.replace(/[^A-Za-z0-9]/g, "-") +
            "-" +
            webLenseOptions.height +
            "-" +
            webLenseOptions.width +
            ".png"
        );
      })
      .catch((err) => {
        console.log(err);
        // send formatted json error to client
        res.setHeader("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(err));
      });
  }
});

app.listen(3000, function () {
  console.log("Listening on port 3000");
});
