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
app.use(express.static("./assets")); // Serve static files from the public directory
app.use(cors()); // Enable CORS for all requests
// landing page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
// api endpoint
app.get("/lense/:size", function (req, res) {
  if (!req.query.url) {
    //send json
    // get ip address
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    res.header("Content-Type", "application/json");
    res.json({
      error: "url is required",
      fix: "add url to query string = ?url=www.google.com",
      request_from: ip,
    });
  }

  var webLenseOptions = {
    height: parseInt(req.params.size.split("x")[0]),
    width: parseInt(req.params.size.split("x")[1]),
    url: encodeURI(req.query.url),
    latest: req.query.latest,
    type: req.query.type ? req.query.type : "jpeg",
    fullPage: req.query.full ? req.query.full : false,
  };
  // check if the image already exists
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
    webLenseOptions.latest != "true" &&
    req.query.url.length > 0
  ) {
    // if the image already exists, send it
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
    // if the image doesn't exist, create it
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
        await page.goto(decodeURI(webLenseOptions.url), { waitUntil: "networkidle0" });
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
        var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        res.header("Content-Type", "application/json");
        res.json({
          error: err,
          fix: "StackOverflow",
          request_from: ip,
        });
      });
  }
});

app.get("/s", function (req, res) {
  if (!req.query.url) {
    //send json
    // get ip address
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    res.header("Content-Type", "application/json");
    res.json({
      error: "url is required",
      fix: "add url to query string = ?url=www.google.com",
      request_from: ip,
    });
  }

  var webLenseOptions = {
    height: 600,
    width: 800,
    url: encodeURI(req.query.url),
    latest: req.query.latest,
    type: req.query.type ? req.query.type : "jpeg",
    fullPage: req.query.full ? req.query.full : false,
  };
  // check if the image already exists
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
    webLenseOptions.latest != "true" &&
    req.query.url.length > 0
  ) {
    // if the image already exists, send it
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
    // if the image doesn't exist, create it
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
        await page.goto(decodeURI(webLenseOptions.url), { waitUntil: "networkidle0" });
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
        var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        res.header("Content-Type", "application/json");
        res.json({
          error: err,
          fix: "StackOverflow",
          request_from: ip,
        });
      });
  }
});
// 404 handler
app.get("*", function (req, res) {
  res.redirect("/");
});

app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
});