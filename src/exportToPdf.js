#!/usr/bin/env node

// https://stackoverflow.com/questions/58134793/error-while-loading-shared-libraries-libnss3-so-while-running-gtlab-ci-job-to

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const pdf = require('html-pdf');
const puppeteer = require('puppeteer')

// Setup configurations
const SERVER_CONFIG = {
  hostname: 'localhost',
  port: 55664,
}
const PDF_CONFIG = {
  format: 'A4',
  margin: { top: 0, },
  landscape: true,
  printBackground: true,
};

const BASE_PATH = './';

// Build the web server
const app = next({
  dev: false,
  hostname: SERVER_CONFIG.hostname,
  port: SERVER_CONFIG.port,
  dir: path.resolve(BASE_PATH, './')
});
const handle = app.getRequestHandler();

// Prepare and start the web server
app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(SERVER_CONFIG.port, async (err) => {
    if (err) throw err;
    console.log(`> Server started on on http://${SERVER_CONFIG.hostname}:${SERVER_CONFIG.port}`)

    const getDirectories = (basepath) => {
      const data = glob.sync(basepath + '/**/*.mdx');
      return data.filter(f => !f.includes('/_') && !f.includes('/index.js'));
    };

    const printPDF = async (url) => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url, {waitUntil: 'networkidle0'});
      const pdf = await page.pdf(PDF_CONFIG);
      await browser.close();
      return pdf;
    };

    const pagesPath = path.resolve(BASE_PATH, 'pages');
    const filePaths = getDirectories(pagesPath);
    for (const file of filePaths) {
      let shortenedUrl = file;
      [pagesPath, '.mdx'].forEach(match => {
        shortenedUrl = shortenedUrl.replace(match, '');
      });

      const url = `http://${SERVER_CONFIG.hostname}:${SERVER_CONFIG.port}${shortenedUrl}?print-pdf`;
      const output = path.resolve(BASE_PATH, 'out') + shortenedUrl + '.pdf';

      const pdfData = await printPDF(url);
      fs.writeFileSync(output, pdfData, 'binary');
    }
    process.exit(0)
  })
});
