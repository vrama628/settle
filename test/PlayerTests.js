'use strict';

const expect = require('chai').expect;

const Player = require('../src/game/Player'),
      RuleError = require('../src/game/RuleError');

describe('Player', function() {
  describe('constructor', function() {
    [
      ['Brick', 0],
      ['Lumber', 0],
      ['Ore', 0],
      ['Wheat', 0],
      ['Wool', 0],
      ['Knight', 0],
      ['VictoryPoint', 0],
      ['RoadBuilding', 0],
      ['Monopoly', 0],
      ['YearOfPlenty', 0]
    ].map(testCase => {
      let cardType = testCase[0], initialValue = testCase[1];
      it(`initializes '${cardType}' to ${initialValue} when called with no arguments.`, function() {
        let player = new Player();
        expect(player.get(cardType)).to.equal(initialValue);
      });
    });
  });

  describe('#get(cardType)', function() {
    it("returns the number of cards of type cardType if that type exists.", function() {
      let player = new Player();
      player.add('Wheat', 2);
      expect(player.get('Wheat')).to.equal(2);
    });

    it("throws an Error if the type cardType doesn't exist.", function() {
      let player = new Player();
      expect(() => player.get('Wheatley')).to.throw(Error);
    });
  });

  describe('#add(cardType, number)', function() {
    it("adds number cards of type cardType if type cardType exists and number is nonnegative.", function() {
      let player = new Player(),
          initial = player.get('Ore');
      player.add('Ore', 4);
      let amountAdded = player.get('Ore') - initial;
      expect(amountAdded).to.equal(4);
    });

    it("throws an Error if type cardType doesn't exist.", function() {
      let player = new Player();
      expect(() => player.add('Or not', 4)).to.throw(Error);
    });

    it("throws an Error if type cardType exists but number is negative.", function() {
      let player = new Player();
      expect(() => player.add('Ore', -4)).to.throw(Error);
    });
  });

  describe('#remove(cardType, number)', function() {
    it("removes number cards of type cardType if type cardType exists, number is nonnegative, and doing so will result in a nonnegative number of remaining cards.", function() {
      let player = new Player();
      player.add('Brick', 3);
      let initial = player.get('Brick');
      player.remove('Brick', 3);
      let amountRemoved = initial - player.get('Brick');
      expect(amountRemoved).to.equal(3);
    });

    it("throws an Error if type cardType doesn't exist.", function() {
      let player = new Player();
      player.add('Brick', 3);
      expect(() => player.remove('Or not', 3)).to.throw(Error);
    });

    it("throws an Error if type cardType exists but number is negative.", function() {
      let player = new Player();
      player.add('Brick', 3);
      expect(() => player.remove('Brick', -3)).to.throw(Error);
    });

    it("throws a RuleError if type cardType exists and number is nonnegative but removing this many cards would result in a negative number of remaining cards.", function() {
      let player = new Player();
      expect(() => player.remove('Brick', 3)).to.throw(RuleError);
    });
  });
});