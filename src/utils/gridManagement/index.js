import logger from "../logger/index.js";

  const gridManagement = {
    getNeighbourCoordinates: function(gridSize, coordinates) {
        logger.debug({"coordinates": coordinates}, "getNeighbourCoordinates - given cell coordinates",);
      var result = [];
      // grid Size should be a tuple of 2 integers values, first is height, second is width
      const yMin = 0,
        yMax = gridSize[0],
        xMin = 0,
        xMax = gridSize[1];
        logger.debug("getNeighbourCoordinates - given x boundary of "+xMax+" and y boundary of "+yMax);
      var relativePositions = {
    0: [0, +1],
    1: [0, -1],
    2: [-1, +1],
    3: [+1, -1],
    4: [-1, 0],
    5: [+1, 0],
    6: [+1, +1],
    7: [-1, -1]
  }
      // at most we got 8 cases, relative to given point:
      const neighbourPositions = Object.values(relativePositions);
      // neighbourPositions[  ]
      for ( var i = 0; i < neighbourPositions.length; i++) {
        // loop through each neighbour cases and check if it's in the grid boundaries
        // or rather check that the resulting x coordinate (a) is: xMin <= a <= xMax
        // and the resulting y coordinates (b) is: yMin <= b <= yMax
        // if so, add to result
        const neighbourPosition = neighbourPositions[i];
        logger.debug({"coordinates": neighbourPosition}, "getNeighbourCoordinates - Considering neighbourPosition");
        const possibleNeighbour = [
          coordinates[0] + neighbourPosition[0], // x coordinate
          coordinates[1] + neighbourPosition[1]  // y coordinate
        ];
        logger.debug({"coordinates": possibleNeighbour}, "getNeighbourCoordinates - checking if it's a possible neighbour")
        if ( possibleNeighbour[0] >= xMin && possibleNeighbour[0] <= xMax // its x is in grid?
         && possibleNeighbour[1] >= yMin && possibleNeighbour[1] <= yMax // its y is in grid?
        ) result.push(possibleNeighbour)
      }
      return result;
    },
    calcInitPopulation: function (CELL_DEAD_CHAR, CELL_LIVE_CHAR, gridSize, initialPopulation) {
      // strips initalPopulation from all char except the one that indicate dead or live cells
      // if there are not enough elements throw error
        logger.debug({"population": initialPopulation}, "calcInitPopulation - given pupulation data\n",);
           var result = {
        population: [],
        live: {}
      }
      var population = [];
        var live = {};
      var DEAD_CHAR = CELL_DEAD_CHAR.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var LIVE_CHAR = CELL_LIVE_CHAR.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var regex = new RegExp("("+DEAD_CHAR+"|"+LIVE_CHAR+")", 'gm');
        var found = initialPopulation.match(regex) || [];
        logger.debug("calPopulation", found);
      var gridLength = gridSize[0] * gridSize[1];
      
      if ( gridLength !== found.length ) throw new Error("Error while parsing initial population");
      let partialCount = 0;
      var partialRes = [];
      for ( var i = 0; i < found.length; i++ ) {
        var el = found[i];
        if ( partialCount == gridSize[1] ) {
          population.unshift(partialRes);
          partialRes = [];
          partialCount = 0
        }
        if ( el == CELL_LIVE_CHAR ) {
          // offset 1 on y, since y starts with 0
          logger.debug({"coordinates": [partialCount, (gridSize[0] - 1 - population.length)]}, "Got a live cell");
          live[[partialCount, (gridSize[0] - 1 - population.length)]] = true;
        }
        partialRes.push(el)
        partialCount++;
      }
      population.unshift(partialRes);
        result.population = population;
        result.live = live;
      return result;
    },
    isInCellCoordsList: function(cellCoordsList,cellCoords) {
        for ( var i = 0; i < cellCoordsList; i++ ) {
            if ( cellCoordsList[i] == cellCoords ) return true;
        }
        return false;
    },
    cellUpdate: function(population, gridSize, cellCoordinates, cellState, avoidCheckRelCoords) {
      var neighbourCellsCoords = this.getNeighbourCoordinates(gridSize, cellCoordinates);
      logger.debug({"coordinates": neighbourCellsCoords}, "Got neighbour cells:");
      var liveNeighbours = 0;
      for ( var i = 0; i < neighbourCellsCoords.length; i++ ) {
        var neighbourCellCoords = neighbourCellsCoords[i];
        neighbourCellCoords = neighbourCellCoords[0]+","+neighbourCellCoords[1];
        logger.debug({"coodinates":neighbourCellCoords, "livePopulation": population.live},"cellUpdate - checking if neighbour is alive");
        if ( population.live[neighbourCellCoords] ) {
            logger.debug({"coordinate": neighbourCellCoords}, "cellUpdate - is alive" )
            liveNeighbours++;
        }
      }
      logger.info({"count": liveNeighbours}, "cellUpdate - Got number of alive neighbours");
      if ( cellState && liveNeighbours < 2 ) cellState = 0;
      else if ( cellState && (liveNeighbours == 2 || liveNeighbours == 3) ) cellState = 1;
      else if ( cellState && liveNeighbours > 3 ) cellState = 0;
      else if ( !cellState && liveNeighbours == 3 ) cellState = 1;
      else throw new Error("Unexpected case");
      return cellState;   
    },
    calcRelativePosition: function( cell1Cords, cell2Cords ) {
      var position = [ cell1Cords[0] - cell2Cords[1], cell1Cords[1] - cell2Cords[1] ]; 
      switch ( position[0]+", "+position[1] ) {
        case "0, 1":
          return 0        
          break;
        case "0, -1":
          return 1
          break;
        case "-1, 1":
          return 2
          break;
        case "1, -1":
          return 3
          break;
        case "-1, 0":
          return 4
          break;
        case "1, 0":
          return 5
          break;
        case "1, 1":
          return 6
          break;
        case "-1, -1":
          return 7
          break;
        default:
          return false;
      }
    }, 
    calcNextGeneration: function(population, gridSize) {
        logger.info({"population": population}, "calcNextGeneration: given population");
        var livePopulation = Object.keys(population.live)
        for ( var i = 0; i < livePopulation.length; i++ ) {
            var liveCellCoords = livePopulation[i];
            liveCellCoords = [ Number(liveCellCoords.split(",")[0]) , Number(liveCellCoords.split(",")[1])]
            logger.debug({"coordinates": liveCellCoords}, "calcNextGeneration - got live cell chords" );
            var willLive = this.cellUpdate(population, gridSize, liveCellCoords, 1, null)
            logger.info({"coordinates": liveCellCoords, "live": willLive}, "calcNextGeneration - willl it live?");

        }
    }
  }
  
  export default gridManagement;