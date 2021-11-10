/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
module PF {

    export class BestFirstFinder extends AStarFinder {
        /**
         * Best-First-Search path-finder.
         * @constructor
         * @extends AStarFinder
         * @param {Object} opt
         * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
         *     Deprecated, use diagonalMovement instead.
         * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
         *     block corners. Deprecated, use diagonalMovement instead.
         * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
         * @param {function} opt.heuristic Heuristic function to estimate the distance
         *     (defaults to manhattan).
         */
        public constructor(options?: IAStarOptions) {
            super(options);
            let heuristic = this.heuristic;
            this.heuristic = function (dx: number, dy: number) {
                return heuristic(dx, dy) * 1000000;
            };
        }
    }
}
