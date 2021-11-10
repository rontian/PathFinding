/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
module PF {
    export class Heuristic {
        /**
         * Manhattan distance.
         * @param {number} dx - Difference in x.
         * @param {number} dy - Difference in y.
         * @return {number} dx + dy
         */
        public static manhattan(dx: number, dy: number): number {
            return dx + dy;
        }

        /**
         * Euclidean distance.
         * @param {number} dx - Difference in x.
         * @param {number} dy - Difference in y.
         * @return {number} sqrt(dx * dx + dy * dy)
         */
        public static euclidean(dx: number, dy: number): number {
            return Math.sqrt(dx * dx + dy * dy);
        }

        /**
         * Octile distance.
         * @param {number} dx - Difference in x.
         * @param {number} dy - Difference in y.
         * @return {number} sqrt(dx * dx + dy * dy) for grids
         */
        public static octile(dx: number, dy: number): number {
            var F = Math.SQRT2 - 1;
            return (dx < dy) ? F * dx + dy : F * dy + dx;
        }

        /**
         * Chebyshev distance.
         * @param {number} dx - Difference in x.
         * @param {number} dy - Difference in y.
         * @return {number} max(dx, dy)
         */
        public static chebyshev(dx: number, dy: number): number {
            return Math.max(dx, dy);
        }
    }
}