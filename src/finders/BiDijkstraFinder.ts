/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
module PF {
    export class BiDijkstraFinder extends BiAStarFinder {
        /**
         * Bi-directional Dijkstra path-finder.
         * @constructor
         * @extends BiAStarFinder
         * @param {Object} opt
         * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
         *     Deprecated, use diagonalMovement instead.
         * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
         *     block corners. Deprecated, use diagonalMovement instead.
         * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
         */
        public constructor(options: IAStarOptions) {
            super(options);
            this.heuristic = function (dx, dy) {
                return 0;
            };
        }
    }
}