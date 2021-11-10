/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
module PF {

    export class BiBreadthFirstFinder {
        public heuristic: (dx: number, dy: number) => number;
        public weight: number;
        public diagonalMovement: DiagonalMovement;
        public allowDiagonal: boolean;
        public dontCrossCorners: boolean;
        /**
         * Bi-directional Breadth-First-Search path finder.
         * @constructor
         * @param {object} options
         * @param {boolean} options.allowDiagonal Whether diagonal movement is allowed.
         *     Deprecated, use diagonalMovement instead.
         * @param {boolean} options.dontCrossCorners Disallow diagonal movement touching
         *     block corners. Deprecated, use diagonalMovement instead.
         * @param {DiagonalMovement} options.diagonalMovement Allowed diagonal movement.
         */
        public constructor(options?: IAStarOptions) {
            options = options || {};
            this.allowDiagonal = options.allowDiagonal;
            this.dontCrossCorners = options.dontCrossCorners;
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
        }
        /**
         * Find and return the the path.
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        public findPath(startX: number, startY: number, endX: number, endY: number, grid: Grid): Array<number[]> {
            let startNode = grid.getNodeAt(startX, startY),
                endNode = grid.getNodeAt(endX, endY),
                startOpenList = [], endOpenList = [],
                neighbors: Node[], neighbor: Node, node: Node,
                diagonalMovement = this.diagonalMovement,
                BY_START = 0, BY_END = 1,
                i: number, l: number;

            // push the start and end nodes into the queues
            startOpenList.push(startNode);
            startNode.opened = true;
            startNode.by = BY_START;

            endOpenList.push(endNode);
            endNode.opened = true;
            endNode.by = BY_END;

            // while both the queues are not empty
            while (startOpenList.length && endOpenList.length) {

                // expand start open list

                node = startOpenList.shift();
                node.closed = true;

                neighbors = grid.getNeighbors(node, diagonalMovement);
                for (i = 0, l = neighbors.length; i < l; ++i) {
                    neighbor = neighbors[i];

                    if (neighbor.closed) {
                        continue;
                    }
                    if (neighbor.opened) {
                        // if this node has been inspected by the reversed search,
                        // then a path is found.
                        if (neighbor.by === BY_END) {
                            return Util.biBacktrace(node, neighbor);
                        }
                        continue;
                    }
                    startOpenList.push(neighbor);
                    neighbor.parent = node;
                    neighbor.opened = true;
                    neighbor.by = BY_START;
                }

                // expand end open list

                node = endOpenList.shift();
                node.closed = true;

                neighbors = grid.getNeighbors(node, diagonalMovement);
                for (i = 0, l = neighbors.length; i < l; ++i) {
                    neighbor = neighbors[i];

                    if (neighbor.closed) {
                        continue;
                    }
                    if (neighbor.opened) {
                        if (neighbor.by === BY_START) {
                            return Util.biBacktrace(neighbor, node);
                        }
                        continue;
                    }
                    endOpenList.push(neighbor);
                    neighbor.parent = node;
                    neighbor.opened = true;
                    neighbor.by = BY_END;
                }
            }

            // fail to find the path
            return [];
        };
    }
}