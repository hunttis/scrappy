const express = require("express");
const app = express();
const cfenv = require("cfenv");
const rp = require('request-promise');
const scraper = require('./scraper')
const responser = require('./responser')

const headOptions = {
  method: 'HEAD',
  uri: 'http://www.mythicspoiler.com/newspoilers.html',
};

app.use(function(req, res) {
  res.sendStatus(200);
});

const minutes = 5;
const interval = minutes * 60 * 1000;

var previousModified = "";

const port = process.env.PORT || 3000
app.listen(port, function() {

  rp(headOptions).then((res) => {
    console.log('Setting initial modified date')
    const lastModified = res["last-modified"];
    previousModified = lastModified;
    console.log('First value is ', lastModified);
  });

  let previousCards = []
  scraper.scrape().then(function(initialScrape) {
    previousCards = initialScrape
  });

  setInterval(function() {
    console.log('Fetching last modified!');
    getLastModifiedInfo().then((lastModified) => {
      console.log('Got', lastModified)
      if (previousModified != lastModified) {
        previousModified = lastModified;
        return lastModified;
      }
      return;
    }).then((modified) => {
      if (modified) {
        console.log('MODIFIED! Scraping!');
        return scraper.scrape();
      }
      console.log('Nothing really changed.. not scraping');
      return;
    }).then((response) => {
      if (!response || response.length === 0) {
        console.log('Empty response (or no changes)');
        return;
      }

      const newCards = responser.getNewCards(previousCards, response)
      if (newCards.length > 0) {
        rp(responser.getResponse(previousCards, response)).then((slackResponse) => {
          console.log('Posted notification to Slack!');
        })
        previousCards = response;
      }
    })
  }, interval);
})

function getLastModifiedInfo() {
  return rp(headOptions).then((res) => res["last-modified"]);
}
