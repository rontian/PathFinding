/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
module PF {
    export enum DiagonalMovement {
        Always = 1,
        /**不允许 */
        Never,
        /** 只要有一个临近格子可以走就能走斜角*/
        IfAtMostOneObstacle,
        //只有在没有障碍的时候
        OnlyWhenNoObstacles
    }
}