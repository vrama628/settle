'use strict';

const _ = require('underscore');

module.exports = class Player { // to do: add settlements, roads, and cities
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
          cards[cardType] = cards[cardType] - number;
        } else {
          throw new Error('The number of cards to remove must be nonnegative.');
        }
      } else {
        throw new Error(`${cardType} is not a valid card type.`);
      }
    };

    this.toPlain = () => _.clone(cards);
  }
}