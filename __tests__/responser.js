const responser = require('../responser')

const previousCards = [
  {
    spoilBlock: 'UNSTABLE',
    spoilDate: 'November 16',
    cardUrl: 'ust/cards/druidofthesacredbeaker.jpg'
  },
  {
    spoilBlock: 'UNSTABLE',
    spoilDate: 'November 16',
    cardUrl: 'ust/cards/betterthanone.jpg'
  },
  {
    spoilBlock: 'UNSTABLE',
    spoilDate: 'November 16',
    cardUrl: 'ust/cards/hydradoodle.jpg'
  }
]

const newCards = [
  {
    spoilBlock: 'UNSTABLE',
    spoilDate: 'November 21',
    cardUrl: 'ust/cards/urzaacademyheadmaster.jpg'
  },
  {
    spoilBlock: 'UNSTABLE',
    spoilDate: 'November 16',
    cardUrl: 'ust/cards/drjuliusjumblemorph.jpg'
  },
  {
    spoilBlock: 'UNSTABLE',
    spoilDate: 'November 16',
    cardUrl: 'ust/cards/druidofthesacredbeaker.jpg'
  },
  {
    spoilBlock: 'UNSTABLE',
    spoilDate: 'November 16',
    cardUrl: 'ust/cards/betterthanone.jpg'
  },
  {
    spoilBlock: 'UNSTABLE',
    spoilDate: 'November 16',
    cardUrl: 'ust/cards/hydradoodle.jpg'
  },
  {
    spoilBlock: 'RIVALS OF IXALAN',
    spoilDate: 'November 16',
    cardUrl: 'ust/cards/superduperdeathray.jpg'
  }]

describe('responser', () => {
  describe('getNewCards()', () => {
    it('should return difference of two card lists', () => {
      const newCardList = responser.getNewCards(previousCards, newCards)
      expect(newCardList).toMatchSnapshot()
    })
  })
  describe('getResponse()', () => {
    it('should return slack formatted response', () => {
      const response = responser.getResponse(previousCards, newCards)
      expect(response).toMatchSnapshot()
    })
  })
})
