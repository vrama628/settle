'use strict';

const expect = require('chai').expect,
      sinon = require('sinon'),
      _ = require('underscore');

const Game = require('../src/Game'),
      RuleError = require('../src/Game/RuleError');

describe('Game', function() {
  describe('::diceRoll()', function() {
    // hard to really test much here.
    it("returns a number randomly determined as if by rolling two dice.", function() {
      expect(Game.diceRoll()).to.be.within(2, 12);
    });
  });

  describe('::shuffle(arr)', function() {
    it("throws a TypeError if arr is not a collection.");

    it("returns a random permutation of arr's elements.");
  });

  describe('::beginnerTiles()', function() {
    it("returns an array of tiles that would instantiate a Board with the beginner's setup.");
  });

  describe('constructor', function() {
    let players3, players4;
    beforeEach(function() {
      players4 = [0, 1, 2, 3].map(playerID => ({
        id: playerID,
        returnCards: () => new Promise(() => undefined),
        considerTrade: () => new Promise(() => undefined),
        placeFirstSettlement: () => new Promise(() => undefined),
        placeSecondSettlement: () => new Promise(() => undefined),
        placeRobber: () => new Promise(() => undefined),
        error: () => undefined
      }));
      players3 = players4.slice(0, 3);
    });

    it("throws a TypeError when called without an array as the argument.", function() {
      expect(() => new Game(123)).to.throw(TypeError);
    });

    it("throws a TypeError when not every element in the array has a defined 'id' field.", function() {
      delete players4[2].id;
      expect(() => new Game(players4)).to.throw(TypeError);
    });

    it("throws a TypeError when not every element in the array has a 'returnCards' field which is a function.", function() {
      players3[1].returnCards = 'foo';
      expect(() => new Game(players3)).to.throw(TypeError);
    });

    it("throws a TypeError when not every element in the array has a 'considerTrade' field which is a function.", function() {
      players3[0].considerTrade = null;
      expect(() => new Game(players3)).to.throw(TypeError);
    });

    it("throws a TypeError when not every element in the array has a 'placeFirstSettlement' field which is a function.", function() {
      players4[2].placeFirstSettlement = 700;
      expect(() => new Game(players4)).to.throw(TypeError);
    });

    it("throws a TypeError when not every element in the array has a 'placeSecondSettlement' field which is a function.", function() {
      players3[2].placeSecondSettlement = undefined;
      expect(() => new Game(players3)).to.throw(TypeError);
    });

    it("throws a TypeError when not every element in the array has a 'placeRobber' field which is a function.", function() {
      players4[3].placeRobber = true;
      expect(() => new Game(players4)).to.throw(TypeError);
    });

    it("throws a RuleError when the array has fewer than 3 elements.", function() {
      let players2 = players4.slice(0, 2);
      expect(() => new Game(players2)).to.throw(RuleError);
    });

    it("throws an RuleError when the array has more than 4 elements.", function() {
      let players5 = players4.slice();
      players5[4] = players5[0];
      expect(() => new Game(players5)).to.throw(RuleError);
    });

    it("returns a Game with an empty board.", function() {
      let game = new Game(players3);
      expect(game.getBoard().intersections).to.deep.equal({});
      _.map(game.getBoard().edges, adjacencies => expect(adjacencies).to.deep.equal({}));
    });

    it("returns a Game whose status is 'Setup'.", function() {
      let game = new Game(players4);
      expect(game.getStatus()).to.equal('Setup');
    });

    it("calls the first player's #placeFirstSettlement() function first.", function() {
      sinon.spy(players4[0], 'placeFirstSettlement');
      
      let game = new Game(players4);
      expect(players4[0].placeFirstSettlement.calledOnce).to.be.true;
    });

    it("calls the second player's #placeFirstSettlement() function after the first's resolves.", function() {
      let resolveFirstPlayerFirstSettlementPromise = undefined,
          firstPlayerFirstSettlementPromise = new Promise((resolve, reject) => {
            resolveFirstPlayerFirstSettlementPromise = resolve;
          });
      players3[0].placeFirstSettlement = () => firstPlayerFirstSettlementPromise;
      
      sinon.spy(players3[1], 'placeFirstSettlement');
      
      let game = new Game(players3);
      expect(players3[1].placeFirstSettlement.calledOnce).to.be.false;
      resolveFirstPlayerFirstSettlementPromise([0, 6]);
      expect(players3[1].placeFirstSettlement.calledOnce).to.be.true;
    });

    it("calls the third player's #placeFirstSettlement() function after the second's resolves.", function() {
      let resolveSecondPlayerFirstSettlementPromise = undefined,
          secondPlayerFirstSettlementPromise = new Promise((resolve, reject) => {
            resolveSecondPlayerFirstSettlementPromise = resolve;
          });
      players4[0].placeFirstSettlement = () => [0, 6];
      players4[1].placeFirstSettlement = () => secondPlayerFirstSettlementPromise;
      
      sinon.spy(players4[2], 'placeFirstSettlement');
      
      let game = new Game(players4);
      expect(players4[2].placeFirstSettlement.calledOnce).to.be.false;
      resolveSecondPlayerFirstSettlementPromise([1, 7]);
      expect(players4[2].placeFirstSettlement.calledOnce).to.be.true;
    });

    context("if there are 3 players", function() {
      it("calls the third player's #placeSecondSettlement() function after the its #placeFirstSettlement() resolves.", function() {
        let resolveThirdPlayerFirstSettlementPromise = undefined,
            thirdPlayerFirstSettlementPromise = new Promise((resolve, reject) => {
              resolveThirdPlayerFirstSettlementPromise = resolve;
            });
        players3[0].placeFirstSettlement = () => [0, 6];
        players3[1].placeFirstSettlement = () => [1, 7];
        players3[2].placeFirstSettlement = () => thirdPlayerFirstSettlementPromise;
        
        sinon.spy(players3[2], 'placeSecondSettlement');
        
        let game = new Game(players3);
        expect(players3[2].placeSecondSettlement.calledOnce).to.be.false;
        resolveThirdPlayerFirstSettlementPromise([2, 8]);
        expect(players3[2].placeSecondSettlement.calledOnce).to.be.true;
      });
    });

    context("if there are 4 players", function() {
      it("calls the fourth player's #placeFirstSettlement() function after the third's resolves.", function() {
        let resolveThirdPlayerFirstSettlementPromise = undefined,
            thirdPlayerFirstSettlementPromise = new Promise((resolve, reject) => {
              resolveThirdPlayerFirstSettlementPromise = resolve;
            });
        players4[0].placeFirstSettlement = () => [0, 6];
        players4[1].placeFirstSettlement = () => [1, 7];
        players4[2].placeFirstSettlement = () => thirdPlayerFirstSettlementPromise;
        
        sinon.spy(players4[3], 'placeFirstSettlement');
        
        let game = new Game(players4);
        expect(players4[3].placeFirstSettlement.calledOnce).to.be.false;
        resolveThirdPlayerFirstSettlementPromise([2, 8]);
        expect(players4[3].placeFirstSettlement.calledOnce).to.be.true;
      });

      it("calls the fourth player's #placeSecondSettlement() function after its #placeFirstSettlement() resolves.", function() {
        let resolveFourthPlayerFirstSettlementPromise = undefined,
            fourthPlayerFirstSettlementPromise = new Promise((resolve, reject) => {
              resolveFourthPlayerFirstSettlementPromise = resolve;
            });
        players4[0].placeFirstSettlement = () => [0, 6];
        players4[1].placeFirstSettlement = () => [1, 7];
        players4[2].placeFirstSettlement = () => [2, 8];
        players4[3].placeFirstSettlement = () => fourthPlayerFirstSettlementPromise;
        
        sinon.spy(players4[3], 'placeSecondSettlement');
        
        let game = new Game(players4);
        expect(players4[3].placeSecondSettlement.calledOnce).to.be.false;
        resolveFourthPlayerFirstSettlementPromise([12, 18]);
        expect(players4[3].placeSecondSettlement.calledOnce).to.be.true;
      });

      it("calls the third player's #placeSecondSettlement() function after the fourth's resolves.", function() {
        let resolveFourthPlayerSecondSettlementPromise = undefined,
            fourthPlayerSecondSettlementPromise = new Promise((resolve, reject) => {
              resolveFourthPlayerSecondSettlementPromise = resolve;
            });
        players4[0].placeFirstSettlement = () => [0, 6];
        players4[1].placeFirstSettlement = () => [1, 7];
        players4[2].placeFirstSettlement = () => [2, 8];
        players4[3].placeFirstSettlement = () => [12, 18];
        players4[3].placeSecondSettlement = () => fourthPlayerSecondSettlementPromise;
        
        sinon.spy(players4[3], 'placeSecondSettlement');
        
        let game = new Game(players4);
        expect(players4[3].placeSecondSettlement.calledOnce).to.be.false;
        resolveFourthPlayerSecondSettlementPromise([13, 19]);
        expect(players4[3].placeSecondSettlement.calledOnce).to.be.true;
      });
    });

    it("calls the second player's #placeSecondSettlement() function after the third's resolves.", function() {
      let resolveThirdPlayerSecondSettlementPromise = undefined,
          thirdPlayerSecondSettlementPromise = new Promise((resolve, reject) => {
            resolveThirdPlayerSecondSettlementPromise = resolve;
          });
      players3[0].placeFirstSettlement = () => [0, 6];
      players3[1].placeFirstSettlement = () => [1, 7];
      players3[2].placeFirstSettlement = () => [2, 8];
      players3[2].placeSecondSettlement = () => thirdPlayerSecondSettlementPromise;
      
      sinon.spy(players3[1], 'placeSecondSettlement');
      
      let game = new Game(players3);
      expect(players3[1].placeSecondSettlement.calledOnce).to.be.false;
      resolveThirdPlayerSecondSettlementPromise([12, 18]);
      expect(players3[1].placeSecondSettlement.calledOnce).to.be.true;
    });

    it("calls the first player's #placeSecondSettlement() function after the second's resolves.", function() {
      let resolveThirdPlayerSecondSettlementPromise = undefined,
          thirdPlayerSecondSettlementPromise = new Promise((resolve, reject) => {
            resolveThirdPlayerSecondSettlementPromise = resolve;
          });
      players3[0].placeFirstSettlement = () => [0, 6];
      players3[1].placeFirstSettlement = () => [1, 7];
      players3[2].placeFirstSettlement = () => [2, 8];
      players3[2].placeSecondSettlement = () => thirdPlayerSecondSettlementPromise;
      
      sinon.spy(players3[1], 'placeSecondSettlement');
      
      let game = new Game(players3);
      expect(players3[1].placeSecondSettlement.calledOnce).to.be.false;
      resolveThirdPlayerSecondSettlementPromise([12, 18]);
      expect(players3[1].placeSecondSettlement.calledOnce).to.be.true;
    });

    it("calls the first player's #placeSecondSettlement() function after the second's resolves.", function() {
      let resolveSecondPlayerSecondSettlementPromise = undefined,
          secondPlayerSecondSettlementPromise = new Promise((resolve, reject) => {
            resolveSecondPlayerSecondSettlementPromise = resolve;
          });
      players3[0].placeFirstSettlement = () => [0, 6];
      players3[1].placeFirstSettlement = () => [1, 7];
      players3[2].placeFirstSettlement = () => [2, 8];
      players3[2].placeSecondSettlement = () => [12, 18];
      players3[1].placeSecondSettlement = () => secondPlayerSecondSettlementPromise;
      
      sinon.spy(players3[0], 'placeSecondSettlement');
      
      let game = new Game(players3);
      expect(players3[0].placeSecondSettlement.calledOnce).to.be.false;
      resolveSecondPlayerSecondSettlementPromise([13, 19]);
      expect(players3[0].placeSecondSettlement.calledOnce).to.be.true;
    });

    it("calls the player's #error() and retries if any #placeFirstSettlement() or #placeSecondSettlement() does not resolve to an " +
        "array whose first two elements are adjacent intersection IDs.", function() {
      sinon.stub(players3[0], 'placeFirstSettlement')
        .onFirstCall().returns([0, 1])
        .onSecondCall().returns([0, 6]);
      
      sinon.spy(players3[0], 'error');
      sinon.spy(players3[0], 'placeFirstSettlement');

      let game = new Game();
      expect(players3[0].error.calledonce).to.be.true;
      expect(players3[0].placeFirstSettlement.calledTwice).to.be.true;
    });

    it("calls the player's #error() and retries if any #placeFirstSettlement() or #placeSecondSettlement() resolves to an array " +
        "whose first element is the id of an occupied intersection.", function() {
      sinon.stub(players3[0], 'placeFirstSettlement').returns([0, 6]);
      sinon.stub(players3[1], 'placeFirstSettlement')
        .onFirstCall().returns([0, 7])
        .onSecondCall().returns([1, 7]);
      
      sinon.spy(players3[1], 'error');
      sinon.spy(players3[1], 'placeFirstSettlement');

      let game = new Game();
      expect(players3[1].error.calledonce).to.be.true;
      expect(players3[1].placeFirstSettlement.calledTwice).to.be.true;
    });

    it("calls the player's #error() and retries if any #placeFirstSettlement() or #placeSecondSettlement() resolves to an array " +
        "whose first element is the id of a intersection adjacent to an occupied intersection.", function() {
      sinon.stub(players3[0], 'placeFirstSettlement').returns([0, 6]);
      sinon.stub(players3[1], 'placeFirstSettlement')
        .onFirstCall().returns([7, 1])
        .onSecondCall().returns([1, 7]);
      
      sinon.spy(players3[1], 'error');
      sinon.spy(players3[1], 'placeFirstSettlement');

      let game = new Game();
      expect(players3[1].error.calledonce).to.be.true;
      expect(players3[1].placeFirstSettlement.calledTwice).to.be.true;
    });

    it("places settlements according to the first values of each player's #placeFirstSettlement() and #placeSecondSettlement() " +
        "resolution values.", function() {
      sinon.stub(players[0], 'placeFirstSettlement').returns([0, 6]);
      let game = new Game();
      expect(game.getBoard().intersections[0]).to.deep.equal({
        type: 'Settlement',
        playerID: 0
      });
    });

    it("places roads according to the first two values of each player's #placeFirstSettlement() and #placeSecondSettlement() " +
        "resolution values.", function() {
      sinon.stub(players[0], 'placeFirstSettlement').returns([0, 6]);
      let game = new Game();
      expect(game.getBoard().intersections[0][6]).to.equal(0);
    });

    it("changes the status to an object with 'whoseTurn' property the first player's ID, and 'rolled' property false, after " +
        "the first player's #placeSecondSettlement() resolves.", function() {
      players3[0].placeFirstSettlement = () => [0, 6];
      players3[1].placeFirstSettlement = () => [1, 7];
      players3[2].placeFirstSettlement = () => [2, 8];
      players3[2].placeSecondSettlement = () => [12, 18];
      players3[1].placeSecondSettlement = () => [13, 19];
      players3[0].placeSecondSettlement = () => [14, 20];
      
      let game = new Game(players3);
      
      expect(game.getStatus()).to.deep.equal({
        whoseTurn: 0,
        rolled: false
      });
    });
  });

  describe('#getStatus()', function() {
    it("returns the status of the game.", () => "tested indirectly.");
  });

  describe('#getBoard()', function() {
    it("returns a plain-object representation of the current game board.");
  });

  describe('#roll(playerID, number)', function() {
    it("throws a RuleError if it is not this player's turn.");

    it("throws a RuleError if it is this player's turn but they have already rolled on this turn.");

    it("throws a RuleError if number is not between 2 and 12, inclusive.");

    it("distributes resources to the players according to the number rolled."); // TODO: add out of resources logic

    it("keeps the 'whoseTurn' property of the status constant.");

    it("changes the 'rolled' property of the status to true.");

    context("if number is 7", function() {
      it("calls the current player's #placeRobber() function.");

      it("throws a RuleError if the player's #placeRobber() function resolves to an invalid tile ID.");

      it("places the robber on the tile with the ID which the player's #placeRobber() function resolves to.");

      it("calls #returnCards(amount/2) on players who have some amount of cards over 7.");

      it("calls the player's #error() and retries if a player's #returnCards() doesn't resolve to a {type:amount} object with amount/2 cards.");

      it("removes cards from players according to their #returnCards() resolution values.");
    });
  });

  describe('#offerTrade(offererID, offereeID, offer)', function() {
    it("throws a RuleError if it is not the offerer's or offeree's turn.");

    it("throws a TypeError if offer is not an object with 'offer' and 'ask' fields, each of which is an object whose keys are resource types and whose values are numbers.");

    it("throws a RuleError if the offerer does not have enough cards to fulfill the offer.");

    it("returns a Promise.");

    it("calls the offeree's #considerTrade() function, passing the offer object.");

    it("resolves to false if the offeree's #considerTrade() function resolves to false.");

    it("rejects with a TypeError if the offeree's #considerTrade() function resolves to a non-boolean value.");

    it("calls the offeree's #error() and retries if their #considerTrade() resolves to true but they don't have enough cards to fulfill the trade."); // TODO: ?

    it("resolves to true if the offeree's #considerTrade() function resolves to true.");

    it("withdraws the offered cards from the offerer if the offeree's #considerTrade() function resolves to true.");

    it("deposits the offered cards to the offeree if the offeree's #considerTrade() function resolves to true.");

    it("withdraws the asked cards from the offeree if the offeree's #considerTrade() function resolves to true.");

    it("deposits the asked cards to the offerer if the offeree's #considerTrade() function resolves to true.");
  });

  describe('#maritimeTrade(playerID, giveAmount, giveType, getType)', function() {
    it("throws a RuleError if it is not this player's turn.");

    it("throws a RuleError if the player does not have this many cards of the giveType.");

    it("(currently) throws a RuleError if giveAmount is not equal to 4.");

    it("withdraws a getType card from the bank.");

    it("deposits a getType card to the player.");

    it("withdraws giveAmount giveType cards from the player.");

    it("deposits giveAmount giveType cards to the bank.");
  });

  describe('#placeSettlement(playerID, intersectionID)', function() {
    it("throws a RuleError if it is not this player's turn.");

    it("throws a RuleError if the player does not have a Brick, a Lumber, a Wool, and a Wheat.");

    it("throws a RuleError if this intersection is already occupied.");

    it("throws a RuleError if an adjacent intersection is already occupied.");

    it("throws a RuleError if this player already has 5 settlements on the board.");

    it("places a Settlement owned by this player onto this intersection.");
  });

  describe('#placeCity(playerID, intersectionID)', function() {
    it("throws a RuleError if it is not this player's turn.");

    it("throws a RuleError if the player does not have 3 Ores and 2 Wheat.");

    it("throws a RuleError if this intersection doesn't have a settlement owned by this player.");

    it("throws a RuleError if this player already has 4 cities on the board.");

    it("places a Settlement owned by this player onto this intersection.");
  });

  describe('#placeRoad(playerID, intersection1ID, intersection2ID)', function() {
    it("throws a RuleError if it is not this player's turn.");

    // AND MORE
  });

  describe('#buyDevelopmentCard(playerID)', function() {
    it("throws a RuleError if it is not this player's turn.");
  })

  describe('#endTurn(playerID)', function() {
    it("throws a RuleError if it's not this player's turn.");

    it("changes the 'whoseTurn' property of the status to the next player's ID.");

    it("changes the 'rolled' property of the status to false.");
  });

  describe("#toPlain()", function() {
    it("returns an object whose 'status' field is deeply equivalent to the result of #getStatus().");

    it("returns an object whose 'board' field is deeply equivalent to the result of #getBoard().");
  });
});