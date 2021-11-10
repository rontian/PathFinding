/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
module PF {
    export class IDAStarFinder {
        public heuristic: (dx: number, dy: number) => number;
        public weight: number;
        public diagonalMovement: DiagonalMovement;
        public allowDiagonal: boolean;
        public dontCrossCorners: boolean;
        public trackRecursion: boolean;
        public timeLimit: number;
        /**
         * Iterative Deeping A Star (IDA*) path-finder.
         *
         * Recursion based on:
         *   http://www.apl.jhu.edu/~hall/AI-Programming/IDA-Star.html
         *
         * Path retracing based on:
         *  V. Nageshwara Rao, Vipin Kumar and K. Ramesh
         *  "A Parallel Implementation of Iterative-Deeping-A*", January 1987.
         *  ftp://ftp.cs.utexas.edu/.snapshot/hourly.1/pub/AI-Lab/tech-reports/UT-AI-TR-87-46.pdf
         *
         * @author Gerard Meier (www.gerardmeier.com)
         *
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
         * @param {boolean} options.trackRecursion Whether to track recursion for
         *     statistical purposes.
         * @param {number} options.timeLimit Maximum execution time. Use <= 0 for infinite.
         */
        public constructor(options?: IAStarOptions) {
            options = options || {};
            this.allowDiagonal = options.allowDiagonal;
            this.dontCrossCorners = options.dontCrossCorners;
            this.diagonalMovement = options.diagonalMovement;
            this.heuristic = options.heuristic || Heuristic.manhattan;
            this.weight = options.weight || 1;
            this.trackRecursion = options.trackRecursion || false;
            this.timeLimit = options.timeLimit || Infinity; // Default: no time limit.

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
            // admissible, it should be octile instead
            if (this.diagonalMovement === DiagonalMovement.Never) {
                this.heuristic = options.heuristic || Heuristic.manhattan;
            } else {
                this.heuristic = options.heuristic || Heuristic.octile;
            }
        }
        /**
         * Find and return the the path. When an empty array is returned, either
         * no path is possible, or the maximum execution time is reached.
         *
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        public findPath(startX: number, startY: number, endX: number, endY: number, grid: Grid): Array<number[]> {
            // Used for statistics:
            let nodesVisited = 0;

            // Execution time limitation:
            let startTime = new Date().getTime();

            // Heuristic helper:
            const h = (a: Node, b: Node): number => {
                return this.heuristic(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
            };

            // Step cost from a to b:
            const cost = (a: Node, b: Node): number => {
                return (a.x === b.x || a.y === b.y) ? 1 : Math.SQRT2;
            };

            /**
             * IDA* search implementation.
             *
             * @param {Node} The node currently expanding from.
             * @param {number} Cost to reach the given node.
             * @param {number} Maximum search depth (cut-off value).
             * @param {Array<Array<number>>} The found route.
             * @param {number} Recursion depth.
             *
             * @return {Object} either a number with the new optimal cut-off depth,
             * or a valid node instance, in which case a path was found.
             */
            const search = (node: Node, g: number, cutoff: number, route: Array<number[]>, depth: number): Node | number => {
                nodesVisited++;

                // Enforce timelimit:
                if (this.timeLimit > 0 &&
                    new Date().getTime() - startTime > this.timeLimit * 1000) {
                    // Enforced as "path-not-found".
                    return Infinity;
                }

                let f = g + h(node, end) * this.weight;

                // We've searched too deep for this iteration.
                if (f > cutoff) {
                    return f;
                }

                if (node == end) {
                    route[depth] = [node.x, node.y];
                    return node;
                }

                let min: number, t: Node | number, k: number, neighbour: Node;

                let neighbours = grid.getNeighbors(node, this.diagonalMovement);

                // Sort the neighbours, gives nicer paths. But, this deviates
                // from the original algorithm - so I left it out.
                //neighbours.sort(function(a, b){
                //    return h(a, end) - h(b, end);
                //});


                /*jshint -W084 *///Disable warning: Expected a conditional expression and instead saw an assignment
                for (k = 0, min = Infinity; neighbour = neighbours[k]; ++k) {
                    /*jshint +W084 *///Enable warning: Expected a conditional expression and instead saw an assignment
                    if (this.trackRecursion) {
                        // Retain a copy for visualisation. Due to recursion, this
                        // node may be part of other paths too.
                        neighbour.retainCount = neighbour.retainCount + 1 || 1;

                        if (neighbour.tested !== true) {
                            neighbour.tested = true;
                        }
                    }

                    t = search(neighbour, g + cost(node, neighbour), cutoff, route, depth + 1);

                    if (t instanceof Node) {
                        route[depth] = [node.x, node.y];

                        // For a typical A* linked list, this would work:
                        // neighbour.parent = node;
                        return t;
                    }

                    // Decrement count, then determine whether it's actually closed.
                    if (this.trackRecursion && (--neighbour.retainCount) === 0) {
                        neighbour.tested = false;
                    }

                    if (t < min) {
                        min = t;
                    }
                }

                return min;

            };

            // Node instance lookups:
            let start = grid.getNodeAt(startX, startY);
            let end = grid.getNodeAt(endX, endY);

            // Initial search depth, given the typical heuristic contraints,
            // there should be no cheaper route possible.
            let cutOff = h(start, end);

            let j: number, route: Array<number[]> = [], t: Node | number;

            // With an overflow protection.
            for (j = 0; true; ++j) {

                route = [];

                // Search till cut-off depth:
                t = search(start, 0, cutOff, route, 0);

                // Route not possible, or not found in time limit.
                if (t === Infinity) {
                    return [];
                }

                // If t is a node, it's also the end node. Route is now
                // populated with a valid path to the end node.
                if (t instanceof Node) {
                    return route;
                }

                // Try again, this time with a deeper cut-off. The t score
                // is the closest we got to the end node.
                cutOff = t;
            }
        }
    }
}