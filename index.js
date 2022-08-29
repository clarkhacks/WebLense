// Require modules
const express = require("express"); // Express web server framework
const cors = require("cors"); // Cross-Origin Resource Sharing
const app = express(); // Create an instance of the express module
const fs = require("fs"); // file system
const puppeteer = require("puppeteer"); // for scraping
const rateLimit = require("express-rate-limit"); // for rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const PORT = 5040;

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(express.static("./images")); // Serve static files from the images directory
app.use(cors()); // Enable CORS for all requests

app.get("/", function (req, res) {
  res.send("Alive");
});

app.get("/lense/:size", function (req, res) {
  var webLenseOptions = {
    height: parseInt(req.params.size.split("x")[0]),
    width: parseInt(req.params.size.split("x")[1]),
    url: req.query.url,
    latest: req.query.latest,
    type: req.query.type ? req.query.type : "jpeg",
    fullPage: req.query.full ? req.query.full : false,
  };
  if (
    fs.existsSync(
      __dirname +
        "/images/" +
        webLenseOptions.fullPage +
        webLenseOptions.url.replace(/[^A-Za-z0-9]/g, "-") +
        "-" +
        webLenseOptions.height +
        "-" +
        webLenseOptions.width +
        "." +
        webLenseOptions.type
    ) &&
    webLenseOptions.latest != "true"
  ) {
    res.setHeader("Content-Type", "image/" + webLenseOptions.type);
    res.sendFile(
      __dirname +
        "/images/" +
        webLenseOptions.fullPage +
        webLenseOptions.url.replace(/[^A-Za-z0-9]/g, "-") +
        "-" +
        webLenseOptions.height +
        "-" +
        webLenseOptions.width +
        "." +
        webLenseOptions.type
    );
  } else {
    puppeteer
      .launch({
        headless: true,
        args: ["--no-sandbox"],
        defaultViewport: {
          width: webLenseOptions.width,
          height: webLenseOptions.height,
          deviceScaleFactor: 2,
        },
      })
      .then(async (browser) => {
        const page = await browser.newPage();
        await page.goto(webLenseOptions.url, { waitUntil: "networkidle0" });
        await page.screenshot({
          path:
            __dirname +
            "/images/" +
            webLenseOptions.fullPage +
            webLenseOptions.url.replace(/[^A-Za-z0-9]/g, "-") +
            "-" +
            webLenseOptions.height +
            "-" +
            webLenseOptions.width +
            "." +
            webLenseOptions.type,
          fullPage: webLenseOptions.fullPage,
        });
        // Always close the browser after scraping
        await browser.close();
      })
      .finally(() => {
        // Send the image to the client
        res.setHeader("Content-Type", "image/" + webLenseOptions.type);
        res.sendFile(
          __dirname +
            "/images/" +
            webLenseOptions.fullPage +
            webLenseOptions.url.replace(/[^A-Za-z0-9]/g, "-") +
            "-" +
            webLenseOptions.height +
            "-" +
            webLenseOptions.width +
            "." +
            webLenseOptions.type
        );
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
});

app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
});
