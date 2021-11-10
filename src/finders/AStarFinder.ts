/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
module PF {
    
    export class AStarFinder {
        public heuristic: (dx: number, dy: number) => number;
        public weight: number;
        public diagonalMovement: DiagonalMovement;
        public allowDiagonal: boolean;
        public dontCrossCorners: boolean;
        /**
         * A* path-finder. Based upon https://github.com/bgrins/javascript-astar
         * @constructor
         * @param {Object} options
         * @param {boolean} options.allowDiagonal Whether diagonal movement is allowed.
         *     Deprecated, use diagonalMovement instead.
         * @param {boolean} options.dontCrossCorners Disallow diagonal movement touching 
         *     block corners. Deprecated, use diagonalMovement instead.
         * @param {DiagonalMovement} options.diagonalMovement Allowed diagonal movement.
         * @param {function} options.heuristic Heuristic function to estimate the distance
         *     (defaults to manhattan).
         * @param {number} options.weight Weight to apply to the heuristic to allow for
         *     suboptimal paths, in order to speed up the search.
         */
        public constructor(options?: IAStarOptions) {
            options = options || <IAStarOptions>{};
            this.allowDiagonal = options.allowDiagonal;
            this.dontCrossCorners = options.dontCrossCorners;
            this.heuristic = options.heuristic || Heuristic.manhattan;
            this.weight = options.weight || 1;
            this.diagonalMovement = options.diagonalMovement;

            if (!this.diagonalMovement) {
                if (!this.allowDiagonal) {
                    this.diagonalMovement = DiagonalMovement.Never;
                } else {
                    if (this.dontCrossCorners) {
                        this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
                    } else {
                        this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
                    }
                }
            }

            // When diagonal movement is allowed the manhattan heuristic is not
            //admissible. It should be octile instead
            if (this.diagonalMovement === DiagonalMovement.Never) {
                this.heuristic = options.heuristic || Heuristic.manhattan;
            } else {
                this.heuristic = options.heuristic || Heuristic.octile;
            }
        }
        /**
         * Find and return the the path.
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        public findPath(startX: number, startY: number, endX: number, endY: number, grid: Grid): Array<number[]> {
            let openList = new Heap<Node>(function (nodeA, nodeB) {
                return nodeA.f - nodeB.f;
            }),
                startNode = grid.getNodeAt(startX, startY),
                endNode = grid.getNodeAt(endX, endY),
                heuristic = this.heuristic,
                diagonalMovement = this.diagonalMovement,
                weight = this.weight,
                abs = Math.abs, SQRT2 = Math.SQRT2,
                node: Node, neighbors: Node[], neighbor: Node, i: number, l: number, x: number, y: number, ng: number;

            // set the `g` and `f` value of the start node to be 0
            startNode.g = 0;
            startNode.f = 0;

            // push the start node into the open list
            openList.push(startNode);
            startNode.opened = true;

            // while the open list is not empty
            while (!openList.empty()) {
                // pop the position of node which has the minimum `f` value.
                node = openList.pop();
                node.closed = true;

                // if reached the end position, construct the path and return it
                if (node === endNode) {
                    return Util.backtrace(endNode);
                }

                // get neigbours of the current node
                neighbors = grid.getNeighbors(node, diagonalMovement);
                for (i = 0, l = neighbors.length; i < l; ++i) {
                    neighbor = neighbors[i];

                    if (neighbor.closed) {
                        continue;
                    }

                    x = neighbor.x;
                    y = neighbor.y;

                    // get the distance between current node and the neighbor
                    // and calculate the next g score
                    ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

                    // check if the neighbor has not been inspected yet, or
                    // can be reached with smaller cost from the current node
                    if (!neighbor.opened || ng < neighbor.g) {
                        neighbor.g = ng;
                        neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.parent = node;

                        if (!neighbor.opened) {
                            openList.push(neighbor);
                            neighbor.opened = true;
                        } else {
                            // the neighbor can be reached with smaller cost.
                            // Since its f value has been updated, we have to
                            // update its position in the open list
                            openList.updateItem(neighbor);
                        }
                    }
                } // end for each neighbor
            } // end while not open list empty

            // fail to find the path
            return [];
        }
    }
}
