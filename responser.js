const getNewCards = (previousCards, newCards) => {
  const previousCardUrls = previousCards.map(card => card.cardUrl)
  return newCards.filter(card => !previousCardUrls.includes(card.cardUrl))
}

const uniq = (array) => [... new Set(array)]

const getResponse = (previousCards, newCards) => {
  const newCardList = getNewCards(previousCards, newCards)
  return {
    method: 'POST',
    uri: 'https://hooks.slack.com/services/' + process.env.SLACK_WEBHOOK_KEY,
    json: true,
    body: {
      "icon_emoji": ":mtg-black:",
      "channel": process.env.SLACK_CHANNEL,
      "username": "Scrappy",
      "text": "New spoilers for " + uniq(newCardList.map(card => card.spoilBlock)).join(' and ') + "! <http://mythicspoiler.com/newspoilers.html|Take a look!>"
    }
  };
}

module.exports = {
  getNewCards,
  getResponse
}
