'use strict';

const _ = require('underscore');

const tileIDs = [50,51,52,40,28,15,2,1,0,12,24,37,38,39,27,14,13,25,26],
      tileTypes = [
        'Brick', 'Brick', 'Brick',
        'Lumber', 'Lumber', 'Lumber', 'Lumber',
        'Ore', 'Ore', 'Ore',
        'Wheat', 'Wheat', 'Wheat', 'Wheat',
        'Wool', 'Wool', 'Wool', 'Wool',
        'Desert'
      ],
      tileNumbers = [5,2,6,3,8,10,9,12,11,4,8,10,9,4,5,6,3,11, undefined],
      intersectionIDs = [0,1,2,6,7,8,9,12,13,14,15,18,19,20,21,22,24,25,26,27,
        28,30,31,32,33,34,35,36,37,38,39,40,41,43,44,45,46,47,49,50,51,52,53,
        56,57,58,59,62,63,64,65,69,70,71];


module.exports = class Board {
  constructor(options) {
    if (!_.isEqual(_.pluck(options.tiles, 'type').sort(), tileTypes.sort())) {
      throw new TypeError("Impossible tile type arrangement.");
    }
    if (!_.isEqual(_.pluck(options.tiles, 'number').sort(), tileNumbers.sort())) {
      throw new TypeError("Impossible tile number arrangement.");
    }
    if (!_.isEqual(_.pluck(options.tiles, 'id').sort(), tileIDs.sort())) {
      throw new TypeError("Impossible tile ID arrangement.");
    }
    if (options.tiles.find(tile => tile.type === 'Desert').number !== undefined) {
      throw new TypeError("Impossible desert numbering.");
    }
    const tiles = options.tiles.map(_.clone);
    this.getTiles = () => tiles.map(_.clone);

    const intersections = {};
    this.getIntersection = id => _.clone(intersections[id]);
    this.placeSettlement = (intersectionID, playerID) => {
      if (!_.contains(intersectionIDs, intersectionID))
        throw new Error('first argument must be a valid intersectionID.');
      intersections[intersectionID] = {
        type: 'Settlement',
        playerID: playerID
      }
    };
    this.placeCity = (intersectionID, playerID) => {
      if (!_.contains(intersectionIDs, intersectionID))
        throw new Error('first argument must be a valid intersectionID.');
      intersections[intersectionID] = {
        type: 'City',
        playerID: playerID
      }
    };

    const edges = _.object(intersectionIDs,
      _.times(intersectionIDs.length, () => ({})));
    this.getEdge = (id1, id2) => edges[id1][id2];
    this.placeRoad = (intersectionID1, intersectionID2, playerID) => {
      if (!_.contains(intersectionIDs, intersectionID1) ||
          !_.contains(intersectionIDs, intersectionID2))
        throw new Error('first two arguments must be valid intersectionIDs.');
      edges[intersectionID1][intersectionID2] = playerID;
      edges[intersectionID2][intersectionID1] = playerID;
    };

    let robber = options.tiles.find(tile => tile.type === 'Desert').id;
    this.getRobber = () => robber;
    this.placeRobber = id => robber = id;

    this.toPlain = () => ({
      tiles: this.getTiles(),
      intersections: _.mapObject(intersections, _.clone),
      edges: _.mapObject(edges, _.clone)
    });
  }

  static getIntersectionIDs() {
    return intersectionIDs.slice();
  }

  static tileNeighbors(tileID) {
    if (!_.contains(tileIDs, tileID))
      throw new Error('argument must be a valid tileID.');
    return [
      tileID,
      tileID+6,
      tileID+7,
      tileID+12,
      tileID+13,
      tileID+19
    ];
  }

  static intersectionNeighbors(intersectionID) {
    if(!_.contains(intersectionIDs, intersectionID))
      throw new Error('argument must be a valid intersectionID.');
    return [
      intersectionID - 6,
      intersectionID + 6,
      intersectionID + 7 - 14 * Math.floor(intersectionID % 12 / 6) // lol
    ].filter(id => _.contains(intersectionIDs, id));
  }
}