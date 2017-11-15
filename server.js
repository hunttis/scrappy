const express = require("express");
const app = express();
const cfenv = require("cfenv");
const rp = require('request-promise');
const scraper = require('./scraper')

const headOptions = {
  method: 'HEAD', 
  uri: 'http://www.mythicspoiler.com/newspoilers.html', 
};

const newSpoilersOptions = {
  method: 'POST',
  uri: 'https://hooks.slack.com/services/' + process.env.SLACK_WEBHOOK_KEY,
  json: true,
  body: {
    "icon_emoji": ":mtg-black:",
    "channel": process.env.SLACK_CHANNEL,
    "username": "Scrappy",
    "text": "New spoilers! <http://mythicspoiler.com/newspoilers.html|Take a look!>"
  }
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

  let previousCard = null
  scraper.scrape().then(function(initialScrape) {
    previousCard = initialScrape[0].cardUrl
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
      if (response[0].cardUrl !== previousCard) {
        previousCard = response[0].cardUrl;
        rp(newSpoilersOptions).then((slackResponse) => {
          console.log('Posted notification to Slack!');
        })
      }
    })
  }, interval);
})

function getLastModifiedInfo() {
  return rp(headOptions).then((res) => res["last-modified"]);
}
