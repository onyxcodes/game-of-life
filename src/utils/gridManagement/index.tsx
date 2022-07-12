import logger from "../logger/index.js";

class GridManagement {
    gridSize: [number, number];
    initPopulation: string;
    deadChar: string;
    liveChar: string;
    population ? : number[][];
    live: {
        [key: string]: boolean
    } = {};
  
    constructor(gridSize: [number, number], initPopulation: string, deadChar: string = "*", liveChar: string = "#") {
        console.log("Got args", {
            deadChar: deadChar,
            liveChar: liveChar,
            gridSize: gridSize,
            initPopulation: initPopulation
        })
        this.gridSize = gridSize;
        this.initPopulation = initPopulation;
        this.deadChar = deadChar;
        this.liveChar = liveChar;
        var initGeneration = this.calcInitGeneration();
        this.population = initGeneration.population;
        this.live = initGeneration.live;
    }

    getNeighbourCoordinates(coordinates: [number, number]): number[][] {
        var gridSize = this.gridSize;
        logger.debug({
            "coordinates": coordinates
        }, "getNeighbourCoordinates - given cell coordinates", );
        var result = [];
        // grid Size should be a tuple of 2 integers values, first is height, second is width
        const yMin = 0,
            yMax = gridSize[0],
            xMin = 0,
            xMax = gridSize[1];
        logger.debug("getNeighbourCoordinates - given x boundary of " + xMax + " and y boundary of " + yMax);
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
        for (var i = 0; i < neighbourPositions.length; i++) {
            // loop through each neighbour cases and check if it's in the grid boundaries
            // or rather check that the resulting x coordinate (a) is: xMin <= a <= xMax
            // and the resulting y coordinates (b) is: yMin <= b <= yMax
            // if so, add to result
            const neighbourPosition = neighbourPositions[i];
            logger.debug({
                "coordinates": neighbourPosition
            }, "getNeighbourCoordinates - Considering neighbourPosition");
            const possibleNeighbour = [
                coordinates[0] + neighbourPosition[0], // x coordinate
                coordinates[1] + neighbourPosition[1] // y coordinate
            ];
            logger.debug({
                "coordinates": possibleNeighbour
            }, "getNeighbourCoordinates - checking if it's a possible neighbour")
            if (possibleNeighbour[0] >= xMin && possibleNeighbour[0] <= xMax // its x is in grid?
                &&
                possibleNeighbour[1] >= yMin && possibleNeighbour[1] <= yMax // its y is in grid?
            ) result.push(possibleNeighbour)
        }
        return result;
    }

    calcInitGeneration(): {
        population: number[][],
        live: {
            [key: string]: boolean
        }
    } {
        var gridSize = this.gridSize,
            initialPopulation = this.initPopulation;
        // strips initalPopulation from all char except the one that indicate dead or live cells
        // if there are not enough elements throw error
        logger.info({
            "population": initialPopulation
        }, "calcInitGeneration - given pupulation data\n", );
        var result: {
            population: number[][],
            live: {
                [key: string]: boolean
            }
        } = {
            population: [],
            live: {}
        }
        var population: number[][] = [];
        var live: {
            [key: string]: boolean
        } = {};
        var DEAD_CHAR = this.deadChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var LIVE_CHAR = this.liveChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var regex = new RegExp("(" + DEAD_CHAR + "|" + LIVE_CHAR + ")", 'gm');
        var found = initialPopulation.match(regex) || [];
        logger.debug("calPopulation", found);
        var gridLength = gridSize[0] * gridSize[1];

        if (gridLength !== found.length) throw new Error("Error while parsing initial population");
        let partialCount: number = 0;
        var partialRes: number[] = [];
        for (var i = 0; i < found.length; i++) {
            var el = found[i];
            if (partialCount == gridSize[1]) {
                population.unshift(partialRes);
                partialRes = [];
                partialCount = 0
            }
            if (el == this.liveChar) {
                // offset 1 on y, since y starts with 0
                logger.debug({
                    "coordinates": [partialCount, (gridSize[0] - 1 - population.length)]
                }, "Got a live cell");
                live[partialCount + "," + (gridSize[0] - 1 - population.length)] = true;
                partialRes.push(1)
            } else partialRes.push(0)
            partialCount++;
        }
        population.unshift(partialRes);
        result.population = population;
        result.live = live;
        return result;
    }

    cellUpdate(cellCoordinates: [number, number], cellState: number): boolean {
        var population = this.population,
            gridSize = this.gridSize;
        var neighbourCellsCoords = this.getNeighbourCoordinates(cellCoordinates);
        logger.debug({
            "coordinates": neighbourCellsCoords
        }, "Got neighbour cells:");
        var liveNeighbours: number = 0;
        for (var i = 0; i < neighbourCellsCoords.length; i++) {
            var neighbourCellCoords: number[] = neighbourCellsCoords[i];
            var neighbourCellCoordsKey: string = neighbourCellCoords[0] + "," + neighbourCellCoords[1];
            logger.debug({
                "coodinates": neighbourCellCoordsKey,
                "livePopulation": this.live
            }, "cellUpdate - checking if neighbour is alive");
            if (this.live && this.live[neighbourCellCoordsKey]) {
                logger.debug({
                    "coordinate": neighbourCellCoords
                }, "cellUpdate - is alive")
                liveNeighbours++;
            }
        }
        logger.info({
            "count": liveNeighbours
        }, "cellUpdate - Got number of alive neighbours");
        if (cellState && liveNeighbours < 2) cellState = 0;
        else if (cellState && (liveNeighbours == 2 || liveNeighbours == 3)) cellState = 1;
        else if (cellState && liveNeighbours > 3) cellState = 0;
        else if (!cellState && liveNeighbours == 3) cellState = 1;
        else throw new Error("Unexpected case");
        return Boolean(cellState);
    }

    calcNextGeneration(): void {
        logger.info({
            "population": this.population
        }, "calcNextGeneration: given population");
        var livePopulation: string[] = Object.keys(this.live)
        // var livePopulation: string[] = (Object.keys(this.live) as (keyof typeof string)[]);
        for (var i = 0; i < livePopulation.length; i++) {
            var liveCellCoordsKey: string = livePopulation[i];
            var liveCellCoords: [number, number] = [Number(liveCellCoordsKey.split(",")[0]), Number(liveCellCoordsKey.split(",")[1])]
            logger.debug({
                "coordinates": liveCellCoords
            }, "calcNextGeneration - got live cell chords");
            var willLive = this.cellUpdate(liveCellCoords, 1)
            logger.info({
                "coordinates": liveCellCoords,
                "live": willLive
            }, "calcNextGeneration - willl it live?");

        }
    }
}

export default GridManagement;