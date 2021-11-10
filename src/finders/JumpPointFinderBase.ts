/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
module PF {
    export abstract class JumpPointFinderBase {
        public heuristic: (dx: number, dy: number) => number;
        public trackJumpRecursion: boolean;
        protected openList: Heap<Node>;
        protected startNode: Node;
        protected endNode: Node;
        protected grid: Grid;
        /**
         * Base class for the Jump Point Search algorithm
         * @param {object} options
         * @param {function} options.heuristic Heuristic function to estimate the distance
         *     (defaults to manhattan).
         */
        public constructor(options?: IAStarOptions) {
            options = options || {};
            this.heuristic = options.heuristic || Heuristic.manhattan;
            this.trackJumpRecursion = options.trackJumpRecursion || false;
        }
        /**
         * Find and return the path.
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        public findPath(startX: number, startY: number, endX: number, endY: number, grid: Grid): Array<number[]> {
            let openList = this.openList = new Heap(function (nodeA: Node, nodeB: Node) {
                return nodeA.f - nodeB.f;
            }),
                startNode = this.startNode = grid.getNodeAt(startX, startY),
                endNode = this.endNode = grid.getNodeAt(endX, endY), node;

            this.grid = grid;


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

                if (node === endNode) {
                    return Util.expandPath(Util.backtrace(endNode));
                }

                this._identifySuccessors(node);
            }

            // fail to find the path
            return [];
        }

        /**
         * Identify successors for the given node. Runs a jump point search in the
         * direction of each available neighbor, adding any points found to the open
         * list.
         * @protected
         */
        protected _identifySuccessors(node: Node): void {
            let grid = this.grid,
                heuristic = this.heuristic,
                openList = this.openList,
                endX = this.endNode.x,
                endY = this.endNode.y,
                neighbors, neighbor,
                jumpPoint: number[], i: number, l: number,
                x = node.x, y = node.y,
                jx: number, jy: number, dx: number, dy: number, d: number, ng: number, jumpNode: Node,
                abs = Math.abs, max = Math.max;

            neighbors = this._findNeighbors(node);
            for (i = 0, l = neighbors.length; i < l; ++i) {
                neighbor = neighbors[i];
                jumpPoint = this._jump(neighbor[0], neighbor[1], x, y);
                if (jumpPoint) {

                    jx = jumpPoint[0];
                    jy = jumpPoint[1];
                    jumpNode = grid.getNodeAt(jx, jy);

                    if (jumpNode.closed) {
                        continue;
                    }

                    // include distance, as parent may not be immediately adjacent:
                    d = Heuristic.octile(abs(jx - x), abs(jy - y));
                    ng = node.g + d; // next `g` value

                    if (!jumpNode.opened || ng < jumpNode.g) {
                        jumpNode.g = ng;
                        jumpNode.h = jumpNode.h || heuristic(abs(jx - endX), abs(jy - endY));
                        jumpNode.f = jumpNode.g + jumpNode.h;
                        jumpNode.parent = node;

                        if (!jumpNode.opened) {
                            openList.push(jumpNode);
                            jumpNode.opened = true;
                        } else {
                            openList.updateItem(jumpNode);
                        }
                    }
                }
            }
        }
        protected abstract _findNeighbors(node: Node): Array<number[]>;
        protected abstract _jump(x: number, y: number, px: number, py: number): number[];
    }
}
