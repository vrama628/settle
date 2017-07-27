'use strict';

const expect = require('chai').expect,
      sinon = require('sinon'),
      _ = require('underscore');

const Game = require('../src/Game'),
      RuleError = require('../src/Game/RuleError');

describe('Game', function() {
  let tiles, players;
  beforeEach(function() {
    tiles = [
      {id:50, type:'Brick', number:5},
      {id:51, type:'Brick', number:2},
      {id:52, type:'Brick', number:6},
      {id:40, type:'Lumber', number:3},
      {id:28, type:'Lumber', number:8},
      {id:15, type:'Lumber', number:10},
      {id:2, type:'Lumber', number:9},
      {id:1, type:'Ore', number:12},
      {id:0, type:'Ore', number:11},
      {id:12, type:'Ore', number:4},
      {id:24, type:'Wheat', number:8},
      {id:37, type:'Wheat', number:10},
      {id:38, type:'Wheat', number:9},
      {id:39, type:'Wheat', number:4},
      {id:27, type:'Wool', number:5},
      {id:14, type:'Wool', number:6},
      {id:13, type:'Wool', number:3},
      {id:25, type:'Wool', number:11},
      {id:26, type:'Desert'},
    ];

    players = [0, 1, 2, 3].map(playerID => ({
      id: playerID,
      returnCards: sinon.stub().returns(new Promise(() => undefined)),
      considerTrade: sinon.stub().returns(new Promise(() => undefined)),
      placeFirstSettlement: sinon.stub().returns(new Promise(() => undefined)),
      placeSecondSettlement: sinon.stub().returns(new Promise(() => undefined)),
      placeRobber: sinon.stub().returns(new Promise(() => undefined)),
      message: sinon.stub().returns(undefined),
      error: sinon.stub().returns(undefined)
    }));
  });

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
      players4 = players;
      players3 = players4.slice(0, 3);
    });

    it("throws a TypeError when called without an array as the 'players' field of the argument.", function() {
      expect(() => new Game({tiles: tiles, players: 123})).to.throw(TypeError);
    });

    it("throws a TypeError when called with a 'tiles' field which can't be used to instantiate a Board.", function() {
      expect(() => new Game({tiles: [], players: players4})).to.throw(TypeError);
    })

    it("throws a TypeError when not every element in the 'players' array has a defined 'id' field.", function() {
      delete players4[2].id;
      expect(() => new Game({tiles: [], players: players4})).to.throw(TypeError); // TODO
    });

    it("throws a TypeError when not every element in the 'players' array has a 'returnCards' field which is a function.", function() {
      players3[1].returnCards = 'foo';
      expect(() => new Game({tiles: tiles, players: players3})).to.throw(TypeError);
    });

    it("throws a TypeError when not every element in the 'players' array has a 'considerTrade' field which is a function.", function() {
      players3[0].considerTrade = null;
      expect(() => new Game({tiles: tiles, players: players3})).to.throw(TypeError);
    });

    it("throws a TypeError when not every element in the 'players' array has a 'placeFirstSettlement' field which is a function.", function() {
      players4[2].placeFirstSettlement = 700;
      expect(() => new Game({tiles: tiles, players: players4})).to.throw(TypeError);
    });

    it("throws a TypeError when not every element in the 'players' array has a 'placeSecondSettlement' field which is a function.", function() {
      players3[2].placeSecondSettlement = undefined;
      expect(() => new Game({tiles: tiles, players: players3})).to.throw(TypeError);
    });

    it("throws a TypeError when not every element in the 'players' array has a 'placeRobber' field which is a function.", function() {
      players4[3].placeRobber = true;
      expect(() => new Game({tiles: tiles, players: players4})).to.throw(TypeError);
    });

    it("throws a TypeError when not every element in the 'players' array has an 'message' field which is a function.", function() {
      players4[3].message = 123;
      expect(() => new Game({tiles: tiles, players: players4})).to.throw(TypeError);
    });

    it("throws a TypeError when not every element in the 'players' array has an 'error' field which is a function.", function() {
      players4[3].error = 456;
      expect(() => new Game({tiles: tiles, players: players4})).to.throw(TypeError);
    });

    it("throws a RuleError when the 'players' array has fewer than 3 elements.", function() {
      let players2 = players4.slice(0, 2);
      expect(() => new Game({tiles: tiles, players: players2})).to.throw(RuleError);
    });

    it("throws an RuleError when the 'players' array has more than 4 elements.", function() {
      let players5 = players4.slice();
      players5[4] = players5[0];
      expect(() => new Game({tiles: tiles, players: players5})).to.throw(RuleError);
    });

    it("returns a Game with an empty board.", function() {
      let game = new Game({tiles: tiles, players: players3});
      expect(game.getBoard().intersections).to.deep.equal({});
      _.map(game.getBoard().edges, adjacencies => expect(adjacencies).to.deep.equal({}));
    });

    it("returns a Game whose status is 'pre-setup'.", function() {
      let game = new Game({tiles: tiles, players: players4});
      expect(game.getStatus()).to.equal('pre-setup');
    });

    it("initializes the bank to have 19 of each type of resource card.", function() {
      let game = new Game({tiles: tiles, players: players4}),
          bank = game.getBank();
      [
        'Brick',
        'Lumber',
        'Ore',
        'Wheat',
        'Wool'
      ].forEach(card => {
        expect(bank[card]).to.equal(19);
      });
    });

    it("initializes the bank to have 14 knight cards.", function() {
      let game = new Game({tiles: tiles, players: players4}),
          bank = game.getBank();
      expect(bank['Knight']).to.equal(14);
    });

    it("initializes the bank to have 2 of each type of progress card.", function() {
      let game = new Game({tiles: tiles, players: players4}),
          bank = game.getBank();
      [
        'RoadBuilding',
        'Monopoly',
        'YearOfPlenty'
      ].forEach(card => {
        expect(bank[card]).to.equal(2);
      });
    });

    it("initializes the bank to have 5 victory point cards.", function() {
      let game = new Game({tiles: tiles, players: players4}),
          bank = game.getBank();
      expect(bank['VictoryPoint']).to.equal(5);
    });

    it("initializes each player to have no resource or development cards.", function() {
      let game = new Game({tiles: tiles, players: players4}),
          playerCards = game.getPlayers();
      players.forEach(({id}) => {
        [
          'Brick',
          'Lumber',
          'Ore',
          'Wheat',
          'Wool',
          'RoadBuilding',
          'Monopoly',
          'YearOfPlenty'
        ].forEach(card => {
          expect(playerCards[id][card]).to.equal(0);
        });
      });
    });

    it("initializes each player to have 15 roads.", function() {
      let game = new Game({tiles: tiles, players: players4}),
          playerCards = game.getPlayers();
      players.forEach(({id}) => {
        expect(playerCards[id]['Road']).to.equal(15);
      });
    });

    it("initializes each player to have 5 settlements.", function() {
      let game = new Game({tiles: tiles, players: players4}),
          playerCards = game.getPlayers();
      players.forEach(({id}) => {
        expect(playerCards[id]['Settlement']).to.equal(5);
      });
    });

    it("initializes each player to have 4 cities.", function() {
      let game = new Game({tiles: tiles, players: players4}),
          playerCards = game.getPlayers();
      players.forEach(({id}) => {
        expect(playerCards[id]['City']).to.equal(4);
      });
    });
  });

  describe('#start()', function() {
    let players3, players4;
    beforeEach(function() {
      players4 = players;
      players3 = players4.slice(0, 3);
    });

    it("throws a RuleError if called on a game whose status isn't 'pre-setup'", function(done) {
      players3[0].placeFirstSettlement.returns([0, 6]);
      players3[1].placeFirstSettlement.returns([1, 7]);
      players3[2].placeFirstSettlement.returns([2, 8]);
      players3[2].placeSecondSettlement.returns([12, 18]);
      players3[1].placeSecondSettlement.returns([13, 19]);
      players3[0].placeSecondSettlement.returns([14, 20]);
      let game = new game({tiles: tiles, players: players3});
      game.start().then(() => {
        expect(() => game.start()).to.throw(RuleError);
        done();
      });
    });

    it("synchronously sets the game's status to 'setup'", function() {
      players3[0].placeFirstSettlement.returns([0, 6]);
      players3[1].placeFirstSettlement.returns([1, 7]);
      players3[2].placeFirstSettlement.returns([2, 8]);
      players3[2].placeSecondSettlement.returns([12, 18]);
      players3[1].placeSecondSettlement.returns([13, 19]);
      players3[0].placeSecondSettlement.returns([14, 20]);
      let game = new game({tiles: tiles, players: players3});
      game.start();
      expect(game.getStatus()).to.equal("setup");
    });

    it("calls the first player's #placeFirstSettlement() function first.", function(done) {
      players4[0].placeFirstSettlement = done;
      
      let game = new Game({tiles: tiles, players: players4});
      game.start();
    });

    it("calls the second player's #placeFirstSettlement() function after the first's resolves.", function(done) {
      players3[0].placeFirstSettlement.returns([0, 6]);
      players3[1].placeFirstSettlement = () => {
        expect(players3[0].placeFirstSettlement.calledOnce).to.be.true;
        done();
      }
      
      let game = new Game({tiles: tiles, players: players3});
      game.start();
    });

    it("calls the third player's #placeFirstSettlement() function after the second's resolves.", function(done) {
      players4[0].placeFirstSettlement.returns([0, 6]);
      players4[1].placeFirstSettlement.returns([1, 7]);
      players4[2].placeFirstSettlement = () => {
        expect(players4[1].placeFirstSettlement.calledOnce).to.be.true;
        done();
      };
      
      let game = new Game({tiles: tiles, players: players4});
      game.start();
    });

    context("if there are 3 players", function() {
      it("calls the third player's #placeSecondSettlement() function after the its #placeFirstSettlement() resolves.", function(done) {
        players3[0].placeFirstSettlement.returns([0, 6]);
        players3[1].placeFirstSettlement.returns([1, 7]);
        players3[2].placeFirstSettlement.returns([2, 8]);
        players3[2].placeSecondSettlement = () => {
          expect(players3[2].placeFirstSettlement.calledOnce).to.be.true;
          done();
        };
        
        let game = new Game({tiles: tiles, players: players3});
        game.start();
      });
    });

    context("if there are 4 players", function() {
      it("calls the fourth player's #placeFirstSettlement() function after the third's resolves.", function(done) {
        players4[0].placeFirstSettlement.returns([0, 6]);
        players4[1].placeFirstSettlement.returns([1, 7]);
        players4[2].placeFirstSettlement.returns([2, 8]);
        players4[3].placeFirstSettlement = () => {
          expect(players4[2].placeFirstSettlement.calledOnce).to.be.true;
          done();
        };

        let game = new Game({tiles: tiles, players: players4});
        game.start();
      });

      it("calls the fourth player's #placeSecondSettlement() function after its #placeFirstSettlement() resolves.", function(done) {
        players4[0].placeFirstSettlement.returns([0, 6]);
        players4[1].placeFirstSettlement.returns([1, 7]);
        players4[2].placeFirstSettlement.returns([2, 8]);
        players4[3].placeFirstSettlement.returns([12, 18]);
        players4[3].placeSecondSettlement = () => {
          expect(players4[3].placeFirstSettlement.calledOnce).to.be.true;
          done();
        };
        
        let game = new Game({tiles: tiles, players: players4});
        game.start();
      });

      it("calls the third player's #placeSecondSettlement() function after the fourth's resolves.", function(done) {
        players4[0].placeFirstSettlement.returns([0, 6]);
        players4[1].placeFirstSettlement.returns([1, 7]);
        players4[2].placeFirstSettlement.returns([2, 8]);
        players4[3].placeFirstSettlement.returns([12, 18]);
        players4[3].placeSecondSettlement.returns([13, 19]);
        players4[2].placeSecondSettlement = () => {
          expect(players4[3].placeSecondSettlement.calledOnce).to.be.true;
          done();
        };
        
        let game = new Game({tiles: tiles, players: players4});
        game.start();
      });
    });

    it("calls the second player's #placeSecondSettlement() function after the third's resolves.", function(done) {
      players3[0].placeFirstSettlement.returns([0, 6]);
      players3[1].placeFirstSettlement.returns([1, 7]);
      players3[2].placeFirstSettlement.returns([2, 8]);
      players3[2].placeSecondSettlement.returns([12, 18]);
      players3[1].placeSecondSettlement = () => {
        expect(players3[2].placeSecondSettlement.calledOnce).to.be.true;
        done();
      };

      let game = new Game({tiles: tiles, players: players3});
      game.start();
    });

    it("calls the first player's #placeSecondSettlement() function after the second's resolves.", function(done) {
      players3[0].placeFirstSettlement.returns([0, 6]);
      players3[1].placeFirstSettlement.returns([1, 7]);
      players3[2].placeFirstSettlement.returns([2, 8]);
      players3[2].placeSecondSettlement.returns([12, 18]);
      players3[1].placeSecondSettlement.returns([13, 19]);
      players3[0].placeSecondSettlement = () => {
        expect(players3[1].placeSecondSettlement.calledOnce).to.be.true;
        done();
      };

      let game = new Game({tiles: tiles, players: players3});
      game.start();
    });

    it("calls the player's #error() and retries if any #placeFirstSettlement() or #placeSecondSettlement() does not resolve to an " +
        "array whose first two elements are adjacent intersection IDs.", function(done) {
      sinon.stub(players3[0], 'placeFirstSettlement')
        .onFirstCall().returns([0, 1])
        .onSecondCall().returns([0, 6]);
      players3[1].placeFirstSettlement = () => {
        expect(players3[0].error.calledOnce).to.be.true;
        expect(players3[0].placeFirstSettlement.calledTwice).to.be.true;
        done();
      };

      let game = new Game({tiles: tiles, players: players3});
      game.start();
    });

    it("calls the player's #error() and retries if any #placeFirstSettlement() or #placeSecondSettlement() resolves to an array " +
        "whose first element is the id of an occupied intersection.", function(done) {
      sinon.stub(players3[0], 'placeFirstSettlement').returns([0, 6]);
      sinon.stub(players3[1], 'placeFirstSettlement')
        .onFirstCall().returns([0, 7])
        .onSecondCall().returns([1, 7]);
      players3[2].placeFirstSettlement = () => {
        expect(players3[1].error.calledOnce).to.be.true;
        expect(players3[1].placeFirstSettlement.calledTwice).to.be.true;
        done();
      };

      let game = new Game({tiles: tiles, players: players3});
      game.start();
    });

    it("calls the player's #error() and retries if any #placeFirstSettlement() or #placeSecondSettlement() resolves to an array " +
        "whose first element is the id of a intersection adjacent to an occupied intersection.", function(done) {
      sinon.stub(players3[0], 'placeFirstSettlement').returns([0, 6]);
      sinon.stub(players3[1], 'placeFirstSettlement')
        .onFirstCall().returns([7, 1])
        .onSecondCall().returns([1, 7]);
      players3[0].placeFirstSettlement = () => {
        expect(players3[1].error.calledOnce).to.be.true;
        expect(players3[1].placeFirstSettlement.calledTwice).to.be.true;
        done();
      };

      let game = new Game({tiles: tiles, players: players3});
      game.start();
    });

    it("places settlements according to the first values of each player's #placeFirstSettlement() and #placeSecondSettlement() " +
        "resolution values.", function(done) {
      sinon.stub(players3[0], 'placeFirstSettlement').returns([0, 6]);
      players3[1].placeFirstSettlement = () => {
        expect(game.getBoard().intersections[0]).to.deep.equal({
          type: 'Settlement',
          playerID: 0
        });
        expect(game.getPlayers()[0]['Settlement']).to.equal(4);
        done();
      };

      let game = new Game({tiles: tiles, players: players3});
      game.start();
    });

    it("places roads according to the first two values of each player's #placeFirstSettlement() and #placeSecondSettlement() " +
        "resolution values.", function(done) {
      sinon.stub(players3[0], 'placeFirstSettlement').returns([0, 6]);
      players3[1].placeFirstSettlement = () => {
        expect(game.getBoard().edges[0][6]).to.equal(0);
        expect(game.getPlayers()[0]['Road']).to.equal(14);
        done();
      }

      let game = new Game({tiles: tiles, players: players3});
      game.start();
    });

    it("distributes resources according to the tiles surrounding the players' first settlement.", function(done) {
      sinon.stub(players3[0], 'placeFirstSettlement').returns([0, 6]);
      players3[1].placeFirstSettlement = () => {
        expect(game.getBank()['Ore']).to.equal(18);
        expect(game.getPlayers()[0]['Ore']).to.equal(1);
        done();
      }

      let game = new Game({tiles: tiles, players: players3});
      game.start();
    });

    it("returns a promise which resolves after the first player's #placeSecondSettlement() resolves.", function(done) {
      players3[0].placeFirstSettlement.returns([0, 6]);
      players3[1].placeFirstSettlement.returns([1, 7]);
      players3[2].placeFirstSettlement.returns([2, 8]);
      players3[2].placeSecondSettlement.returns([12, 18]);
      players3[1].placeSecondSettlement.returns([13, 19]);
      players3[0].placeSecondSettlement.returns([14, 20]);
      
      let game = new Game({tiles: tiles, players: players3});
      game.start().then(() => {
        expect(players3[0].placeSecondSettlement.calledOnce).to.be.true;
        done();
      });
    });

    it("changes the status to an object with 'whoseTurn' property the first player's ID, and 'rolled' property false, after " +
        "the first player's #placeSecondSettlement() resolves.", function(done) {
      players3[0].placeFirstSettlement.returns([0, 6]);
      players3[1].placeFirstSettlement.returns([1, 7]);
      players3[2].placeFirstSettlement.returns([2, 8]);
      players3[2].placeSecondSettlement.returns([12, 18]);
      players3[1].placeSecondSettlement.returns([13, 19]);
      players3[0].placeSecondSettlement.returns([14, 20]);
      
      let game = new Game({tiles: tiles, players: players3});
      game.start().then(() => {
        expect(game.getStatus()).to.deep.equal({
          whoseTurn: 0,
          rolled: false
        });
        done();
      });
    });
  });

  describe('#roll(playerID, number)', function() {
    let game, gameStart;
    beforeEach(function() {
      players[0].placeFirstSettlement.returns([0, 6]);
      players[1].placeFirstSettlement.returns([1, 7]);
      players[2].placeFirstSettlement.returns([2, 8]);
      players[3].placeFirstSettlement.returns([15, 21]);
      players[3].placeSecondSettlement.returns([24, 30]);
      players[2].placeSecondSettlement.returns([12, 18]);
      players[1].placeSecondSettlement.returns([13, 19]);
      players[0].placeSecondSettlement.returns([14, 20]);

      game = new Game({tiles: tiles, players: players});
      gameStart = game.start();
    });

    it("throws a RuleError if it is not this player's turn.", function() { // consider changing throws to Promise rejects
      expect(() => game.roll(1, 6)).to.throw(RuleError);
    });

    it("throws a RuleError if it is this player's turn but they have already rolled on this turn.", function() {
      game.roll(0, 6);
      expect(() => game.roll(0, 6)).to.throw(RuleError);
    });

    it("throws a RuleError if number is not between 2 and 12, inclusive.", function() {
      expect(() => game.roll(0, 1)).to.throw(RuleError);
      expect(() => game.roll(0, 13)).to.throw(RuleError);
    });

    it("returns a Promise which resolves after the roll finishes."); // continue here

    it("distributes resources to the players according to the number rolled.", function() {
      let initialOreBank = game.getBank().Ore,
          initialOrePlayers = _.pluck(game.getPlayers(), 'Ore');
      
      game.roll(0, 11);
      
      let finalOreBank = game.getBank().Ore,
          initialOrePlayers = _.pluck(game.getPlayers(), 'Ore');

      expect(finalOreBank - initialOreBank).to.equal(-3);
      expect(finalOrePlayers[0] - initialOrePlayers[0]).to.equal(1);
      expect(finalOrePlayers[1] - initialOrePlayers[1]).to.equal(1);
      expect(finalOrePlayers[2] - initialOrePlayers[2]).to.equal(1);
      expect(finalOrePlayers[3] - initialOrePlayers[3]).to.equal(0);
    });

    it("keeps the 'whoseTurn' property of the status constant.", function() {
      let initialWhoseTurn = game.getStatus().whoseTurn;
      game.roll(0, 8);
      let finalWhoseTurn = game.getStatus().whoseTurn;
      expect(initialWhoseTurn).to.equal(finalWhoseTurn);
    });

    it("changes the 'rolled' property of the status to true.", function() {
      game.roll(0, 8);
      expect(game.getStatus().whoseTurn).to.be.true;
    });

    context("if there are not enough of the specified resource to distribute", function() {
      it("calls all players' message function and does not distribute resources.", function() {
        for (let i = 0; game.getBank().Ore >= 3; i++) {
          game.roll(i % players.length, 11);
          game.endTurn(i % players.length);
        }

        players.forEach({message} => expect(message.called).to.be.false); // not really part of the test, just a precondition

        let initialOreBank = game.getBank().Ore,
          initialOrePlayers = _.pluck(game.getPlayers(), 'Ore');
      
        game.roll(game.getStatus().whoseTurn, 11);
      
        let finalOreBank = game.getBank().Ore,
            initialOrePlayers = _.pluck(game.getPlayers(), 'Ore');

        expect(finalOreBank - initialOreBank).to.equal(0);
        expect(finalOrePlayers[0] - initialOrePlayers[0]).to.equal(0);
        expect(finalOrePlayers[1] - initialOrePlayers[1]).to.equal(0);
        expect(finalOrePlayers[2] - initialOrePlayers[2]).to.equal(0);
        expect(finalOrePlayers[3] - initialOrePlayers[3]).to.equal(0);
      });
    });

    context("if number is 7", function() {
      it("calls the current player's #placeRobber() function.", function() {
        game.roll(0, 7);
        expect(players[0].placeRobber.calledOnce).to.be.true;
      });

      it("calls the player's #error() and retries if the player's #placeRobber() function resolves to an invalid tile ID.");

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

  describe('#getStatus()', function() {
    it("returns the status of the game.", () => "tested indirectly.");
  });

  describe('#getBoard()', function() {
    it("returns a plain-object representation of the current game board.", function() {
      players[0].placeFirstSettlement = () => [0, 6];

      let game = new Game({tiles: tiles, players: players}),
          board = game.getBoard();
      expect(board.tiles).to.deep.equal(tiles);
      expect(board.intersections[0]).to.deep.equal({
        type: 'Settlement',
        playerID: 0
      });
      expect(board.edges[0][6]).to.equal(0);
    });
  });

  describe('#getBank()', function() {
    it("returns an object whose ith field is the number of i cards left in the bank.", () => "tested indirectly.");
  });

  describe('#getPlayers()', function() {
    it("returns an object whose ith field is an object whose jth field is the number of j which player i has.");
  });

  describe("#toPlain()", function() {
    it("returns an object whose 'status' field is deeply equivalent to the result of #getStatus().");

    it("returns an object whose 'board' field is deeply equivalent to the result of #getBoard().");

    it("returns an object whose 'bank' field is deeply equivalent to the result of #getBank().");

    it("returns an object whose 'players' field is deeply equivalent to the result of #getPlayers().");
  });
});