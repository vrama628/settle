'use strict';

const RuleError = require('./RuleError');

module.exports = class Player {
  constructor() {
    let cards = {
      Brick: 0,
      Lumber: 0,
      Ore: 0,
      Wheat: 0,
      Wool: 0,
      Knight: 0,
      VictoryPoint: 0,
      RoadBuilding: 0,
      Monopoly: 0,
      YearOfPlenty: 0
    };

    this.get = cardType => {
      if (cardType in cards) {
        return cards[cardType];
      } else {
        throw new Error(`${cardType} is not a valid card type.`);
      }
    };

    this.add = (cardType, number) => {
      if (cardType in cards) {
        if (number >= 0) {
          cards[cardType] = cards[cardType] + number;
        } else {
          throw new Error('The number of cards to add must be nonnegative.');
        }
      } else {
        throw new Error(`${cardType} is not a valid card type.`);
      }
    };

    this.remove = (cardType, number) => {
      if (cardType in cards) {
        if (number >= 0) {
          if (number <= cards[cardType]) {
            cards[cardType] = cards[cardType] - number;
          } else {
            throw new RuleError(`Not enough ${cardType} cards to do this.`);
          }
        } else {
          throw new Error('The number of cards to remove must be nonnegative.');
        }
      } else {
        throw new Error(`${cardType} is not a valid card type.`);
      }
    };
  }
}