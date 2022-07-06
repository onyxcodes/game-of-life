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
    let result = [];
    // grid Size should be a tuple of 2 integers values, first is height, second is width
    const yMin = 0,
      yMax = gridSize[0],
      xMin = 0,
      xMax = gridSize[1];
  	console.log("getNeighbourCoordinates - given x boundary of "+xMax+" and y boundary of "+yMax);
    // at most we got 8 cases, relative to given point:
    const neighbourPositions = Object.keys(relativePositions);
    // neighbourPositions[  ]
    for ( let i = 0; i < neighbourPositions.length; i++) {
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
      live: []
    }
    var population = [];
  	var live = [];
    var DEAD_CHAR = CELL_DEAD_CHAR.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var LIVE_CHAR = CELL_LIVE_CHAR.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp("("+DEAD_CHAR+"|"+LIVE_CHAR+")", 'gm');
  	var found = pop.match(regex) || [];
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
      if ( el == CELL_LIVE_CHAR ) {
        // offset 1 on y, since y starts with 0
        console.log("Got a live cell at", [partialCount, (gridSize[0] - 1 - population.length)]);
        live.push([partialCount, (gridSize[0] - 1 - population.length)]);
      }
      partialRes.push(el)
      partialCount++;
    }
    population.unshift(partialRes);
  	result.population = population;
  	result.live = live;
    return result;
  },
  cellUpdate: function(population, gridSize, cellCoordinates, cellState, avoidCheckRelCoords) {
    var neighbourCellsCoords = this.getNeighbourCoordinates(gridSize, cellCoordinates, avoidCheckRelCoords);
    console.log("Got neighbour cells:", neighbourCellsCoords);
    var liveNeighbours = 0;
    var neighbourCellStatesNum = neighbourCellsCoords.reduce(
      (previousValue, currentValue) => {
        console.log("cellUpdate -  got neigh")
        previousValue + currentValue
      },
      initialValue
    );
    for ( var k = 0; k < neighbourCellsCoords.length; k++ ) {
      var neighbourCellCords = neighbourCellsCoords[k];
      console.log("cellUpdate - Got neighbour cell coords", neighbourCellCords);
      array1.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        initialValue
      );
      var neighbourCellState = population[neighbourCellCords[1]][neighbourCellCords[0]];
      console.log("cellUpdate - Got neighbour cell state", neighbourCellState);
      liveNeighbours += neighbourCellState;
    }
    console.log("cellUpdate - Got alive neighbours", liveNeighbours);
    if ( cellState && liveNeighbours < 2 ) cellState = 0;
    else if ( cellState && (liveNeighbours == 2 || liveNeighbours == 3) ) cellState = 1;
    else if ( cellState && liveNeighbours > 3 ) cellState = 0;
    else if ( !cellState && liveNeighbours == 3 ) cellState = 1;
    else throw new Error("Unexpected case");
    return cellState;
  },
  calcRelativePosition = function( cell1Cords, cell2Cords ) {
    var position = [ cell1Cords[0] - cell2Cords[1], cell1Cords[1] - cell2Cords[1] ]; 
    switch ( position[0]+" | "+position[1] ) {
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
  } 
}

export default gridManagement;