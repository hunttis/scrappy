const rp = require('request-promise'),
  cheerio = require('cheerio')

const reqOptions = {
  uri: 'http://www.mythicspoiler.com/newspoilers.html',
};

module.exports = {
  /**
   * @returns {Promise.<[{spoilBlock: "HOUR OF DEVASTATION", spoilDate: "June 21", cardUrl: "http://www.mythicspoiler.com/hou/cards/ferventpaincaster.jpg"}, ...]>}
   */
  scrape: function() {
    return rp(reqOptions).then(function(response) {
      const $ = cheerio.load(response)

      let currentTitle = {}

      const tableRows = $('body center center table tbody tr').map(function(i, el) {
        
        const isCardBlock = !!$(this).attr('align'),
          isTitleBlock = $(this).find('td center font').attr('size') === "+3"
        
        if (isTitleBlock) {
          const spoilDate = $(this).find('font[size="+3"]').text().trim(),
            spoilBlock = $(this).find('font[size="+2"]').text().trim()
          currentTitle = {spoilDate, spoilBlock}
        } else if (isCardBlock) {
          const cards = $(this).find('td').map(function(i, el) {
            return $(this).find('img').attr('src')
          }).get()

          if (cards.length !== 0) {
            return {spoilBlock: currentTitle.spoilBlock, spoilDate: currentTitle.spoilDate, cards};
          }
        }
      }).get()

      return tableRows.reduce((spoilCards, tableRow) => {
        const {spoilBlock, spoilDate} = tableRow
        tableRow.cards.forEach(cardUrl => {
          spoilCards.push({spoilBlock, spoilDate, cardUrl})
        })
        return spoilCards
      }, [])
    })
  }
}