'use strict';

module.exports = class Tile {
  constructor(values) {
    this.getResource = () => values.resource;
    this.getNumber = () => values.number;
  }
}