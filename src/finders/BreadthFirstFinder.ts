/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
module PF {
    export class BreadthFirstFinder {
        public heuristic: (dx: number, dy: number) => number;
        public weight: number;
        public diagonalMovement: DiagonalMovement;
        public allowDiagonal: boolean;
        public dontCrossCorners: boolean;
        /**
         * Breadth-First-Search path finder.
         * @constructor
         * @param {Object} options
         * @param {boolean} options.allowDiagonal Whether diagonal movement is allowed.
         *     Deprecated, use diagonalMovement instead.
         * @param {boolean} options.dontCrossCorners Disallow diagonal movement touching
         *     block corners. Deprecated, use diagonalMovement instead.
         * @param {DiagonalMovement} options.diagonalMovement Allowed diagonal movement.
         */
        public constructor(options: IAStarOptions) {
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
            let openList: Node[] = [],
                diagonalMovement = this.diagonalMovement,
                startNode = grid.getNodeAt(startX, startY),
                endNode = grid.getNodeAt(endX, endY),
                neighbors: Node[], neighbor: Node, node: Node, i: number, l: number;

            // push the start pos into the queue
            openList.push(startNode);
            startNode.opened = true;

            // while the queue is not empty
            while (openList.length) {
                // take the front node from the queue
                node = openList.shift();
                node.closed = true;

                // reached the end position
                if (node === endNode) {
                    return Util.backtrace(endNode);
                }

                neighbors = grid.getNeighbors(node, diagonalMovement);
                for (i = 0, l = neighbors.length; i < l; ++i) {
                    neighbor = neighbors[i];

                    // skip this neighbor if it has been inspected before
                    if (neighbor.closed || neighbor.opened) {
                        continue;
                    }

                    openList.push(neighbor);
                    neighbor.opened = true;
                    neighbor.parent = node;
                }
            }

            // fail to find the path
            return [];
        }
    }
}