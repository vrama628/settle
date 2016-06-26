'use strict';

const expect = require('chai').expect;

const Tile = require('../src/game/Tile');

describe('Tile', function() {
  describe('constructor', function() {
    it("sets 'resource' to the value in the 'resource' field of the object passed into the constructor.", function() {
      let tile = new Tile({resource: 'Wool', number: 4});
      expect(tile.getResource()).to.equal('Wool');
    });

    it("sets 'number' to the value in the 'number' field of the object passed into the constructor.", function() {
      let tile = new Tile({resource: 'Wool', number: 4});
      expect(tile.getNumber()).to.equal(4);
    });
  });

  describe('#getResource()', function() {
    it("returns the value of the tile's 'resource' field.", function() {
      let tile = new Tile({resource: 'Wool', number: 4});
      expect(tile.getResource()).to.equal('Wool');
    });
  });

  describe('#getNumber()', function() {
    it("returns the value of the tile's 'number' field.", function() {
      let tile = new Tile({resource: 'Wool', number: 4});
      expect(tile.getNumber()).to.equal(4);
    });
  });
});