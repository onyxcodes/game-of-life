import logger from "../logger/index.js";

class GridManagement {
    gridSize: [number, number];
    initPopulation: string | boolean[][];
    deadChar: string;
    liveChar: string;
    population: boolean[][];
    live: {
        [key: string]: boolean,
    } = {};

    constructor(
        gridSize: [number, number],
        initPopulation: string | boolean[][],
        deadChar: string = "*",
        liveChar: string = "#"
    ) {
        logger.debug({
            deadChar: deadChar,
            liveChar: liveChar,
            gridSize: gridSize,
            initPopulation: initPopulation,
        }, "constructor arguments");
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
                coordinates: coordinates,
            },
            "getNeighbourCoordinates - given cell coordinates"
        );
        var result = [];
        // grid Size should be a tuple of 2 integers values, first is height, second is width
        const yMin = 0,
            yMax = gridSize[0],
            xMin = 0,
            xMax = gridSize[1];
        logger.debug(
            "getNeighbourCoordinates - given x boundary of " +
            xMax +
            " and y boundary of " +
            yMax
        );
        var relativePositions = {
            0: [0, +1],
            1: [0, -1],
            2: [-1, +1],
            3: [+1, -1],
            4: [-1, 0],
            5: [+1, 0],
            6: [+1, +1],
            7: [-1, -1],
        };
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
                    coordinates: neighbourPosition,
                },
                "getNeighbourCoordinates - Considering neighbourPosition"
            );
            const possibleNeighbour = [
                coordinates[0] + neighbourPosition[0], // x coordinate
                coordinates[1] + neighbourPosition[1], // y coordinate
            ];
            logger.debug({
                    coordinates: possibleNeighbour,
                },
                "getNeighbourCoordinates - checking if it's a possible neighbour"
            );
            /*if (possibleNeighbour[0] >= xMin && possibleNeighbour[0] <= xMax // its x is in grid?
                      &&
                      possibleNeighbour[1] >= yMin && possibleNeighbour[1] <= yMax // its y is in grid?
                  ) result.push(possibleNeighbour)*/
            try {
                var cell = this.population[possibleNeighbour[1]][possibleNeighbour[0]];
                result.push(possibleNeighbour);
                logger.debug({
                        coordinates: possibleNeighbour,
                    },
                    "getNeighbourCoordinates - Got a valid neighbour"
                );
            } catch (e) {
                logger.debug({
                        coordinates: possibleNeighbour
                    },
                    "getNeighbourCoordinates - not a valid neighbour, out of bounds"
                );
                // pass on
            }
        }
        return result;
    }

    calcInitGeneration(): {
        population: boolean[][],
        live: {
            [key: string]: boolean,
        },
    } {
        var gridSize = this.gridSize,
            initialPopulation = this.initPopulation;
        var result: {
            population: boolean[][],
            live: {
                [key: string]: boolean,
            },
        } = {
            population: [],
            live: {},
        };
        if (typeof initialPopulation === "string") {
            // strips initalPopulation from all char except the one that indicate dead or live cells
            // if there are not enough elements throw error
            logger.info({
                    population: initialPopulation,
                },
                "calcInitGeneration - given pupulation data"
            );
            var population: boolean[][] = [];
            var live: {
                [key: string]: boolean,
            } = {};
            var DEAD_CHAR = this.deadChar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            var LIVE_CHAR = this.liveChar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            var regex = new RegExp("(" + DEAD_CHAR + "|" + LIVE_CHAR + ")", "gm");
            var found = initialPopulation.match(regex) || [];
            logger.debug("calPopulation", found);
            var gridLength = gridSize[0] * gridSize[1];

            if (gridLength !== found.length)
                throw new Error("Error while parsing initial population");
            let partialCount: number = 0;
            var partialRes: boolean[] = [];
            for (var i = 0; i < found.length; i++) {
                var el = found[i];
                if (partialCount == gridSize[1]) {
                    population.unshift(partialRes);
                    partialRes = [];
                    partialCount = 0;
                }
                if (el == this.liveChar) {
                    // offset 1 on y, since y starts with 0
                    logger.debug({
                            coordinates: [partialCount, gridSize[0] - 1 - population.length],
                        },
                        "Got a live cell"
                    );
                    live[
                        partialCount + "," + (gridSize[0] - 1 - population.length)
                    ] = true;
                    partialRes.push(true);
                } else partialRes.push(false);
                partialCount++;
            }
            population.unshift(partialRes);
            result.population = population;
            result.live = live;
        } else {
            var live: {
                [key: string]: boolean,
            } = {};
            for (var i = 0; i < initialPopulation.length; i++) {
                var row = initialPopulation[i];
                for (var k = 0; k < row.length; k++) {
                    var cell = row[k];
                    if (cell) {
                        live[k + "," + i] = cell;
                    }
                }
            }

            result.population = initialPopulation;
            result.live = live;
        }
        return result;
    }

    cellUpdate(cellCoordinates: [number, number], cellState: number): boolean {
        var population = this.population,
            gridSize = this.gridSize;
        var neighbourCellsCoords = this.getNeighbourCoordinates(cellCoordinates);
        logger.debug({
                coordinates: neighbourCellsCoords,
            },
            "Got neighbour cells:"
        );
        var liveNeighbours: number = 0;
        for (var i = 0; i < neighbourCellsCoords.length; i++) {
            var neighbourCellCoords: number[] = neighbourCellsCoords[i];
            var neighbourCellCoordsKey: string =
                neighbourCellCoords[0] + "," + neighbourCellCoords[1];
            logger.info({
                    coodinates: neighbourCellCoordsKey,
                    livePopulation: this.live,
                },
                "cellUpdate - checking if neighbour is alive"
            );
            if (this.live && this.live[neighbourCellCoordsKey]) {
                logger.debug({
                        coordinate: neighbourCellCoords,
                    },
                    "cellUpdate - is alive"
                );
                liveNeighbours++;
            }
        }
        logger.info({
                count: liveNeighbours,
                coordinates: cellCoordinates,
            },
            "cellUpdate - Got number of alive neighbours"
        );
        debugger;
        if (cellState && liveNeighbours < 2) cellState = 0;
        else if (cellState && (liveNeighbours == 2 || liveNeighbours == 3))
            cellState = 1;
        else if (cellState && liveNeighbours > 3) cellState = 0;
        else if (!cellState && liveNeighbours == 3) cellState = 1;
        else {
            cellState = 0; // should be alredy like that
        }
        return Boolean(cellState);
    }
    getNeighboursOfLiveCells(): {
        [key: string]: boolean,
    } {
        var result: {
            [key: string]: boolean,
        } = {};
        var liveCellCoordsKeys: string[] = Object.keys(this.live);
        for (var i = 0; i < liveCellCoordsKeys.length; i++) {
            var liveCellCoordsKey = liveCellCoordsKeys[i];
            var liveCellCoords: [number, number] = [
                Number(liveCellCoordsKey.split(",")[0]),
                Number(liveCellCoordsKey.split(",")[1]),
            ];
            var neighbourCellsCoords = this.getNeighbourCoordinates(liveCellCoords);
            debugger;
            for (var k = 0; k < neighbourCellsCoords.length; k++) {
                var neighbourCellCoords = neighbourCellsCoords[k];
                var neighbourCellCoordsKey =
                    neighbourCellCoords[0] + "," + neighbourCellCoords[1];
                if (this.live[neighbourCellCoordsKey]) {
                    // Neighbour cell is already tracked in live cells list, will skip checking
                } else result[neighbourCellCoordsKey] = false;
                // Attempt to add it to list of neighbours that are going to be checked
            }
        }
        logger.debug({
                coordinatesList: result
            },
            "Got list of neighoburing to live cells cells to check"
        );
        return result;
    }

    calcNextGeneration(): boolean[][] {
        logger.info({
                population: this.population,
                live: this.live,
            },
            "calcNextGeneration: given population and live cells"
        );
        var livePopulation: string[] = Object.keys(this.live);
        // var livePopulation: string[] = (Object.keys(this.live) as (keyof typeof string)[]);
        var currentLivePopulation: {
            [key: string]: boolean,
        } = Object.create(this.live);
        for (var i = 0; i < livePopulation.length; i++) {
            var liveCellCoordsKey: string = livePopulation[i];
            var liveCellCoords: [number, number] = [
                Number(liveCellCoordsKey.split(",")[0]),
                Number(liveCellCoordsKey.split(",")[1]),
            ];
            logger.info({
                    coordinates: liveCellCoords,
                },
                "calcNextGeneration - got live cell chords"
            );
            var willLive = this.cellUpdate(liveCellCoords, 1);
            logger.info({
                    coordinates: liveCellCoords,
                    population: this.population,
                    live: willLive,
                },
                "calcNextGeneration - willl it live?"
            );
            currentLivePopulation[liveCellCoordsKey] = willLive;
        }
        var neighbourCells = this.getNeighboursOfLiveCells();
        var neighbourCellsKeys = Object.keys(neighbourCells);
        for (var i = 0; i < neighbourCellsKeys.length; i++) {
            var cellCoordsKey: string = neighbourCellsKeys[i];
            var cellCoords: [number, number] = [
                Number(cellCoordsKey.split(",")[0]),
                Number(cellCoordsKey.split(",")[1]),
            ];
            logger.debug({
                    coordinates: cellCoords,
                },
                "calcNextGeneration - got live cell chords"
            );
            var willLive = this.cellUpdate(cellCoords, 0);
            logger.info({
                    coordinates: cellCoords,
                    population: this.population,
                    live: willLive,
                },
                "calcNextGeneration - willl it live?"
            );
            currentLivePopulation[cellCoordsKey] = willLive;
        }
        var currentLivePopulationKeys: string[] = Object.keys(
            currentLivePopulation
        );
        for (var i = 0; i < currentLivePopulationKeys.length; i++) {
            var liveCellCoordsKey: string = currentLivePopulationKeys[i];
            var liveCellCoords: [number, number] = [
                Number(liveCellCoordsKey.split(",")[0]),
                Number(liveCellCoordsKey.split(",")[1]),
            ];
            if (currentLivePopulation[liveCellCoordsKey]) {
                // Check if it is active, if not remove it from object that keeps trace of active cells
                this.live[liveCellCoordsKey] = currentLivePopulation[liveCellCoordsKey];
            } else if (this.live.hasOwnProperty(liveCellCoordsKey))
                delete this.live[liveCellCoordsKey];

            this.population[liveCellCoords[1]][liveCellCoords[0]] =
                currentLivePopulation[liveCellCoordsKey];
        }
        return this.population;
    }
    getSize(): [number, number] {
        return this.gridSize;
    }
    getLive(): {
        [key: string]: boolean,
    } {
        return this.live;
    }
    getPopulation(): boolean[][] {
        return this.population;
    }
}

export default GridManagement;