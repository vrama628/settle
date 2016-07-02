'use strict';

const expect = require('chai').expect;

const Board = require('../src/game/Board');

describe('Board', function() {
  describe('constructor', function() {
    [
      [3, 'Brick'],
      [4, 'Lumber'],
      [3, 'Ore'],
      [4, 'Wheat'],
      [4, 'Wool'],
      [1, 'Desert']
    ].map(testCase => {
      let amount = testCase[0], type = testCase[1];
      it(`constructs a board with ${amount} ${type} tiles when called with no arguments.`, function() {
        let board = new Board();
        expect(board.getTiles().filter(tile => tile.type === type)).to.have.lengthOf(amount);
      });
    });

    [
      [1, 2],
      [2, 3],
      [2, 4],
      [2, 5],
      [2, 6],
      [2, 8],
      [2, 9],
      [2, 10],
      [2, 11],
      [1, 12]
    ].map(testCase => {
      let amount = testCase[0], number = testCase[1];
      it(`constructs a board with ${amount} tiles numbered ${number} when called with no arguments.`, function() {
        let board = new Board();
        expect(board.getTiles().filter(tile => tile.number === number)).to.have.lengthOf(amount);
      });
    });
  });

  describe('#getTiles()', function() {
    it("returns an array of 19 objects in no particular order, each with 'id', 'number', and 'type' keys.", () => "tested indirectly.");
  });

  describe('#getEdge(intersection1ID, intersection2ID)', function() {
    it("returns undefined if there is no road between the two intersections specified.", function() {
      let board = new Board();
      expect(board.getEdge(0, 7)).to.equal(undefined);
    });

    it("returns the playerID of the player who owns the road if there is one between the two intersections specified.", () => "tested indirectly.");
  });

  describe('#getIntersection(intersectionID)', function() {
    it("returns undefined if there is no settlement or city on the specified intersection.", function() {
      let board = new Board();
      expect(board.getIntersection(25)).to.equal(undefined);
    });

    it("returns an object with field type = 'Settlement' and field playerID = the playerID of the owner of the settlement if there is one on the specified intersection.", () => "tested indirectly.");

    it("returns an object with field type = 'City' and field playerID = the playerID of the owner of the city if there is one on the specified intersection.", () => "tested indirectly.");
  });

  describe('#placeRoad(intersection1ID, intersection2ID, playerID)', function() {
    it("places a road connecting intersection1 and intersection2, owned by player.", function() {
      let board = new Board();
      board.placeRoad(51, 57, 12345);
      expect(board.getEdge(57, 51)).to.equal(12345);
    });
  });

  describe('#placeSettlement(intersectionID, playerID)', function() {
    it("places a settlement on intersection, owned by player.", function() {
      let board = new Board();
      board.placeSettlement(50, 'some id');
      expect(board.getIntersection(50)).to.deep.equal({
        type: 'Settlement',
        playerID: 'some id'
      });
    });
  });

  describe('#placeCity(intersectionID, playerID)', function() {
    it("places a city on intersection, owned by player.", function() {
      let board = new Board();
      board.placeCity(35, 628);
      expect(board.getIntersection(35)).to.deep.equal({
        type: 'City',
        playerID: 628
      });
    });
  });

  describe('::getIntersectionIDs()', function() {
    it("returns the ID numbers of all the intersections on the board.", function() {
      expect(Board.getIntersectionIDs().sort((a, b) => a-b)).to.deep.equal(
        [0, 1, 2, 6, 7, 8, 9, 12, 13, 14, 15, 18, 19, 20, 21, 22, 24, 25, 26,
        27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46,
        47, 49, 50, 51, 52, 53, 56, 57, 58, 59, 62, 63, 64, 65, 69, 70, 71]
      );
    });
  });

  describe('::tileNeighbors(tileID)', function() {
    [
      [0, [0,6,7,12,13,19]],
      [1, [1,7,8,13,14,20]],
      [2, [2,8,9,14,15,21]],
      [12, [12,18,19,24,25,31]],
      [13, [13,19,20,25,26,32]],
      [14, [14,20,21,26,27,33]],
      [15, [15,21,22,27,28,34]],
      [24, [24,30,31,36,37,43]],
      [25, [25,31,32,37,38,44]],
      [26, [26,32,33,38,39,45]],
      [27, [27,33,34,39,40,46]],
      [28, [28,34,35,40,41,47]],
      [37, [37,43,44,49,50,56]],
      [38, [38,44,45,50,51,57]],
      [39, [39,45,46,51,52,58]],
      [40, [40,46,47,52,53,59]],
      [50, [50,56,57,62,63,69]],
      [51, [51,57,58,63,64,70]],
      [52, [52,58,59,64,65,71]]
    ].map(testCase => {
      let tileID = testCase[0], neighbors = testCase[1];
      it(`returns an array of the intersection IDs of tile ${tileID}'s neighbors when called on ${tileID}`, function() {
        expect(Board.tileNeighbors(tileID).sort((a, b) => a-b)).to.deep.equal(neighbors);
      });
    });

    it("throws an error when called with a tileID which doesn't exist.", function() {
      expect(() => Board.tileNeighbors(9)).to.throw(Error);
    });
  });

  describe("::intersectionNeighbors(intersectionID)", function() {
    [
      [0, [6,7]],
      [1, [7,8]],
      [2, [8,9]],
      [6, [0,12]],
      [7, [0,1,13]],
      [8, [1,2,14]],
      [9, [2,15]],
      [12, [6,18,19]],
      [13, [7,19,20]],
      [14, [8,20,21]],
      [15, [9,21,22]],
      [18, [12,24]],
      [19, [12,13,25]],
      [20, [13,14,26]],
      [21, [14,15,27]],
      [22, [15,28]],
      [24, [18,30,31]],
      [25, [19,31,32]],
      [26, [20,32,33]],
      [27, [21,33,34]],
      [28, [22,34,35]],
      [30, [24,36]],
      [31, [24,25,37]],
      [32, [25,26,38]],
      [33, [26,27,39]],
      [34, [27,28,40]],
      [35, [28,41]],
      [36, [30,43]],
      [37, [31,43,44]],
      [38, [32,44,45]],
      [39, [33,45,46]],
      [40, [34,46,47]],
      [41, [35,47]],
      [43, [36,37,49]],
      [44, [37,38,50]],
      [45, [38,39,51]],
      [46, [39,40,52]],
      [47, [40,41,53]],
      [49, [43,56]],
      [50, [44,56,57]],
      [51, [45,57,58]],
      [52, [46,58,59]],
      [53, [47,59]],
      [56, [49,50,62]],
      [57, [50,51,63]],
      [58, [51,52,64]],
      [59, [52,53,65]],
      [62, [56,69]],
      [63, [57,69,70]],
      [64, [58,70,71]],
      [65, [59,71]],
      [69, [62,63]],
      [70, [63,64]],
      [71, [64,65]]
    ].map(testCase => {
      let intersectionID = testCase[0], neighbors = testCase[1];
      it(`returns an array of the intersection IDs of intersection ${intersectionID}'s neighbors when called on ${intersectionID}.`, function() {
        expect(Board.intersectionNeighbors(intersectionID).sort((a, b) => a-b)).to.deep.equal(neighbors);
      });
    });
    
    it("throws an error when called with an intersectionID which doesn't exist.", function() {
      expect(() => Board.intersectionNeighbors(29)).to.throw(Error);
    });
  });
});