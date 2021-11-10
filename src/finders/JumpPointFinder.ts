/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
module PF {
    /**
     * Path finder using the Jump Point Search algorithm
     * @param {Object} options
     * @param {function} options.heuristic Heuristic function to estimate the distance
     *     (defaults to manhattan).
     * @param {DiagonalMovement} options.diagonalMovement Condition under which diagonal
     *      movement will be allowed.
     */
    export function JumpPointFinder(options?: IAStarOptions): JumpPointFinderBase {
        options = options || {};
        if (options.diagonalMovement === DiagonalMovement.Never) {
            return new JPFNeverMoveDiagonally(options);
        } else if (options.diagonalMovement === DiagonalMovement.Always) {
            return new JPFAlwaysMoveDiagonally(options);
        } else if (options.diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
            return new JPFMoveDiagonallyIfNoObstacles(options);
        } else {
            return new JPFMoveDiagonallyIfAtMostOneObstacle(options);
        }
    }
}
