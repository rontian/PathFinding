/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
module PF {
    export interface IAStarOptions {
        allowDiagonal?: boolean;
        dontCrossCorners?: boolean;
        /**允许对角线移动。 */
        diagonalMovement?: PF.DiagonalMovement;
        heuristic?: (dx: number, dy: number) => number;
        weight?: number;
        trackRecursion?: boolean;
        timeLimit?: number;
        trackJumpRecursion?: boolean;
    }
}