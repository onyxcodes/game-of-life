// TODO: consider changin to class

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
    const neighbourPositions = [
      [0, +1],
      [0, -1],
      [-1, +1],
      [+1, -1],
      [-1, 0],
      [+1, 0],
      [+1, +1],
      [-1, -1]
    ];
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
}

export default gridManagement;