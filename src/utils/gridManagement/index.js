// TODO: consider changin to class
const relativePositions = {
    0: [0, +1],
    1: [0, -1],
    2: [-1, +1],
    3: [+1, -1],
    4: [-1, 0],
    5: [+1, 0],
    6: [+1, +1],
    7: [-1, -1]
  }
  
  const gridManagement = {
    getNeighbourCoordinates: function(gridSize, coordinates) {
        console.log("getNeighbourCoordinates - given cell coordinates", coordinates);
      var result = [];
      // grid Size should be a tuple of 2 integers values, first is height, second is width
      const yMin = 0,
        yMax = gridSize[0],
        xMin = 0,
        xMax = gridSize[1];
        console.log("getNeighbourCoordinates - given x boundary of "+xMax+" and y boundary of "+yMax);
      // at most we got 8 cases, relative to given point:
      const neighbourPositions = Object.values(relativePositions);
      console.log("Got neighbour relative position", neighbourPositions);
      // neighbourPositions[  ]
      for ( var i = 0; i < neighbourPositions.length; i++) {
        // loop through each neighbour cases and check if it's in the grid boundaries
        // or rather check that the resulting x coordinate (a) is: xMin <= a <= xMax
        // and the resulting y coordinates (b) is: yMin <= b <= yMax
        // if so, add to result
        const neighbourPosition = neighbourPositions[i];
        console.log("getNeighbourCoordinates - Considering neighbourPosition", neighbourPosition);
        const possibleNeighbour = [
          coordinates[0] + neighbourPosition[0], // x coordinate
          coordinates[1] + neighbourPosition[1]  // y coordinate
        ];
        console.log("getNeighbourCoordinates - checking if it's a possible neighbour", possibleNeighbour)
        if ( possibleNeighbour[0] >= xMin && possibleNeighbour[0] <= xMax // its x is in grid?
         && possibleNeighbour[1] >= yMin && possibleNeighbour[1] <= yMax // its y is in grid?
        ) result.push(possibleNeighbour)
      }
      return result;
    },
    calcInitPopulation: function (CELL_DEAD_CHAR, CELL_LIVE_CHAR, gridSize, initialPopulation) {
      // strips initalPopulation from all char except the one that indicate dead or live cells
      // if there are not enough elements throw error
      console.log("calcInitPopulation - given pupulation data\n",initialPopulation);
      var result = {
        population: [],
        live: {}
      }
      var population = [];
        var livePopulation = {};
      var DEAD_CHAR = CELL_DEAD_CHAR.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var LIVE_CHAR = CELL_LIVE_CHAR.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var regex = new RegExp("("+DEAD_CHAR+"|"+LIVE_CHAR+")", 'gm');
        var found = initialPopulation.match(regex) || [];
        console.log("calPopulation", found);
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
        var x = partialCount;
        var y = (gridSize[0] - 1 - population.length);
        console.log("Got x", x);
        console.log("Got y", y);
        console.log("Preparing to add cell at",[x+","+y])
        if ( el == CELL_LIVE_CHAR ) {
          // offset 1 on y, since y starts with 0
          console.log("Got a live cell at", [partialCount, (gridSize[0] - 1 - population.length)]);
          livePopulation[x+","+y] = true;
        } // else  livePopulation[x+","+y] = false;
        partialRes.push(el)
        partialCount++;
      }
      console.log("initalGridCalc - got controlled poplation", livePopulation);
      population.unshift(partialRes);
        result.population = population;
        result.live = livePopulation;
      return result;
    },
    isInCellCoordsList: function(cellCoordsList,cellCoords) {
        for ( var i = 0; i < cellCoordsList; i++ ) {
            if ( cellCoordsList[i] == cellCoords ) return true;
        }
        return false;
    },
    cellUpdate: function(population, gridSize, cellCoordinates, cellState) {
      console.log("cellUpdate - parsed cell coords", cellCoordinates);
      var neighbourCellsCoords = this.getNeighbourCoordinates(gridSize, cellCoordinates);
      console.log("Got neighbour cells:", neighbourCellsCoords);
      var liveNeighbours = 0;
      for ( var i = 0; i < neighbourCellsCoords.length; i++ ) {
        if ( population.live[neighbourCellsCoords[i]] ) {
            liveNeighbours++;
        }
      }
      console.log("cellUpdate - Got alive neighbours", liveNeighbours);
      if ( cellState && liveNeighbours < 2 ) cellState = false;
      else if ( cellState && (liveNeighbours == 2 || liveNeighbours == 3) ) cellState = true;
      else if ( cellState && liveNeighbours > 3 ) cellState = true;
      else if ( !cellState && liveNeighbours == 3 ) cellState = true;
      else throw new Error("Unexpected case");
      return cellState;   
    },
    calcRelativePosition: function( cell1Cords, cell2Cords ) {
      console.log("calcRelativePosition - calculation position between", [ cell1Cords, cell2Cords] );
      var position = [ cell1Cords[0] - cell2Cords[0], cell1Cords[1] - cell2Cords[1] ]; 
      console.log("calcRelativePosition - position", position);
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
        console.log("calcNextGeneration: given population", population);
        var livePopulationCoords = Object.keys(population.live);
        var k = 0;
        var isRelative = false;
        var liveNeighbours = 0;
        for ( var i = 0; i < livePopulationCoords.length; i++ ) {
            var liveCellCoords = livePopulationCoords[i];
            liveCellCoords = [Number(liveCellCoords.split(",")[0]),Number(liveCellCoords.split(",")[1])];
            console.log("calcNextGeneration - got live cell chords", liveCellCoords);
            var willLive = this.cellUpdate(population, gridSize, liveCellCoords, 1)
            console.log("calcNextGeneration - willl it live?", willLive);
            if ( isRelative && willLive ) liveNeighbours++;
            console.log("calcNextGeneration - got live neighbours", liveNeighbours);
            k = i+1;
            var nextLiveCellCoords = livePopulationCoords[k];
            if (nextLiveCellCoords) {
              nextLiveCellCoords = [Number(nextLiveCellCoords.split(",")[0]),Number(nextLiveCellCoords.split(",")[1])];
              isRelative = this.calcRelativePosition(liveCellCoords, nextLiveCellCoords );
              console.log("calcNextGeneration - this two live cells are neighbours?", isRelative);
            }
        }
    }
  }
  
  export default gridManagement;
