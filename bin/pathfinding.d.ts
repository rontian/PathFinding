/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    enum DiagonalMovement {
        Always = 1,
        /**不允许 */
        Never = 2,
        /** 只要有一个临近格子可以走就能走斜角*/
        IfAtMostOneObstacle = 3,
        OnlyWhenNoObstacles = 4,
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    class Grid {
        private $width;
        private $height;
        private $nodes;
        constructor(width: number, height: number, matrix?: Array<Array<(number | boolean)>>);
        constructor(matrix: Array<Array<(number | boolean)>>);
        private buildNodes(width, height, matrix?);
        getNodeAt(x: number, y: number): Node;
        isWalkableAt(x: number, y: number): boolean;
        isInside(x: number, y: number): boolean;
        setWalkableAt(x: number, y: number, walkable: boolean): void;
        getNeighbors(node: Node, diagonalMovement: DiagonalMovement): Node[];
        clone(): Grid;
        readonly values: number[][];
        readonly width: number;
        readonly height: number;
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    type TCompare<T = any> = (a: T, b: T) => number;
    /**有序数组 */
    class Heap<T> {
        private $nodes;
        private $compare;
        constructor(compareFunc?: TCompare<T>);
        push(n: T): T;
        pop(): T;
        peek(): T;
        contains(n: T): boolean;
        replace(n: T): T;
        pushpop(n: T): T;
        ify(): T[];
        updateItem(n: T): T;
        clear(): void;
        empty(): boolean;
        size(): number;
        clone(): Heap<T>;
        toArray(): T[];
        static push<T>(array: T[], item: T, cmp?: TCompare): T;
        static pop<T>(array: T[], cmp?: TCompare): T;
        static replace<T>(array: T[], item: T, cmp?: TCompare): T;
        static pushpop<T>(array: T[], item: T, cmp?: TCompare): T;
        static ify<T>(array: T[], cmp?: TCompare): T[];
        static updateItem<T>(array: T[], item: T, cmp?: TCompare): T;
        /**查找数据集中最大的n个元素。 */
        static nlargest<T>(array: T[], n: number, cmp?: TCompare): T[];
        /**查找数据集中最小的n个元素。 */
        static nsmallest<T>(array: T[], n: number, cmp?: TCompare): T[];
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    class Heuristic {
        /**
         * Manhattan distance.
         * @param {number} dx - Difference in x.
         * @param {number} dy - Difference in y.
         * @return {number} dx + dy
         */
        static manhattan(dx: number, dy: number): number;
        /**
         * Euclidean distance.
         * @param {number} dx - Difference in x.
         * @param {number} dy - Difference in y.
         * @return {number} sqrt(dx * dx + dy * dy)
         */
        static euclidean(dx: number, dy: number): number;
        /**
         * Octile distance.
         * @param {number} dx - Difference in x.
         * @param {number} dy - Difference in y.
         * @return {number} sqrt(dx * dx + dy * dy) for grids
         */
        static octile(dx: number, dy: number): number;
        /**
         * Chebyshev distance.
         * @param {number} dx - Difference in x.
         * @param {number} dy - Difference in y.
         * @return {number} max(dx, dy)
         */
        static chebyshev(dx: number, dy: number): number;
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    class Node {
        x: number;
        y: number;
        f: number;
        g: number;
        h: number;
        opened: boolean | number;
        closed: boolean;
        tested: boolean;
        walkable: boolean;
        parent: Node;
        by: number;
        retainCount: number;
        constructor(x: number, y: number, walkable?: boolean);
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    class Util {
        /**根据父记录回溯并返回路径。
        （包括起始节点和结束节点） */
        static backtrace(node: Node): Array<number[]>;
        /**
            从起始节点和结束节点回溯，并返回路径。
            （包括起始节点和结束节点） */
        static biBacktrace(nodeA: Node, nodeB: Node): Array<number[]>;
        /**
         * 计算路径的长度。
         */
        static pathLength(paths: Array<number[]>): number;
        /**给定压缩路径，返回包含所有段的新路径
            在它的插值。 */
        static expandPath(paths: Array<number[]>): Array<number[]>;
        /**给定起始坐标和结束坐标，返回所有坐标
            在这些坐标形成的直线上，基于Bresenham算法。 */
        static interpolate(x0: number, y0: number, x1: number, y1: number): Array<number[]>;
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    class AStarFinder {
        heuristic: (dx: number, dy: number) => number;
        weight: number;
        diagonalMovement: DiagonalMovement;
        allowDiagonal: boolean;
        dontCrossCorners: boolean;
        /**
         * A* path-finder. Based upon https://github.com/bgrins/javascript-astar
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
         */
        constructor(options?: IAStarOptions);
        /**
         * Find and return the the path.
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        findPath(startX: number, startY: number, endX: number, endY: number, grid: Grid): Array<number[]>;
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    class BestFirstFinder extends AStarFinder {
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
        constructor(options?: IAStarOptions);
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    class BiAStarFinder {
        heuristic: (dx: number, dy: number) => number;
        weight: number;
        diagonalMovement: DiagonalMovement;
        allowDiagonal: boolean;
        dontCrossCorners: boolean;
        /**
         * A* path-finder.
         * based upon https://github.com/bgrins/javascript-astar
         * @constructor
         * @param {Object} options
         * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
         *     Deprecated, use diagonalMovement instead.
         * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
         *     block corners. Deprecated, use diagonalMovement instead.
         * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
         * @param {function} opt.heuristic Heuristic function to estimate the distance
         *     (defaults to manhattan).
         * @param {number} opt.weight Weight to apply to the heuristic to allow for
         *     suboptimal paths, in order to speed up the search.
         */
        constructor(options?: IAStarOptions);
        /**
         * Find and return the the path.
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        findPath(startX: number, startY: number, endX: number, endY: number, grid: Grid): Array<number[]>;
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    class BiBestFirstFinder extends BiAStarFinder {
        /**
         * Bi-direcitional Best-First-Search path-finder.
         * @constructor
         * @extends BiAStarFinder
         * @param {Object} opt
         * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
         *     Deprecated, use diagonalMovement instead.
         * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
         *     block corners. Deprecated, use diagonalMovement instead.
         * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
         * @param {function} opt.heuristic Heuristic function to estimate the distance
         *     (defaults to manhattan).
         */
        constructor(options: IAStarOptions);
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    class BiBreadthFirstFinder {
        heuristic: (dx: number, dy: number) => number;
        weight: number;
        diagonalMovement: DiagonalMovement;
        allowDiagonal: boolean;
        dontCrossCorners: boolean;
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
        constructor(options?: IAStarOptions);
        /**
         * Find and return the the path.
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        findPath(startX: number, startY: number, endX: number, endY: number, grid: Grid): Array<number[]>;
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    class BiDijkstraFinder extends BiAStarFinder {
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
        constructor(options: IAStarOptions);
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    class BreadthFirstFinder {
        heuristic: (dx: number, dy: number) => number;
        weight: number;
        diagonalMovement: DiagonalMovement;
        allowDiagonal: boolean;
        dontCrossCorners: boolean;
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
        constructor(options: IAStarOptions);
        /**
         * Find and return the the path.
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        findPath(startX: number, startY: number, endX: number, endY: number, grid: Grid): Array<number[]>;
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    class DijkstraFinder extends AStarFinder {
        /**
         * Dijkstra path-finder.
         * @constructor
         * @extends AStarFinder
         * @param {Object} opt
         * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
         *     Deprecated, use diagonalMovement instead.
         * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
         *     block corners. Deprecated, use diagonalMovement instead.
         * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
         */
        constructor(options?: IAStarOptions);
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    interface IAStarOptions {
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
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
declare module PF {
    class IDAStarFinder {
        heuristic: (dx: number, dy: number) => number;
        weight: number;
        diagonalMovement: DiagonalMovement;
        allowDiagonal: boolean;
        dontCrossCorners: boolean;
        trackRecursion: boolean;
        timeLimit: number;
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
        constructor(options?: IAStarOptions);
        /**
         * Find and return the the path. When an empty array is returned, either
         * no path is possible, or the maximum execution time is reached.
         *
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        findPath(startX: number, startY: number, endX: number, endY: number, grid: Grid): Array<number[]>;
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
declare module PF {
    abstract class JumpPointFinderBase {
        heuristic: (dx: number, dy: number) => number;
        trackJumpRecursion: boolean;
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
        constructor(options?: IAStarOptions);
        /**
         * Find and return the path.
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        findPath(startX: number, startY: number, endX: number, endY: number, grid: Grid): Array<number[]>;
        /**
         * Identify successors for the given node. Runs a jump point search in the
         * direction of each available neighbor, adding any points found to the open
         * list.
         * @protected
         */
        protected _identifySuccessors(node: Node): void;
        protected abstract _findNeighbors(node: Node): Array<number[]>;
        protected abstract _jump(x: number, y: number, px: number, py: number): number[];
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
declare module PF {
    class JPFAlwaysMoveDiagonally extends JumpPointFinderBase {
        constructor(opt: IAStarOptions);
        /**
         * Search recursively in the direction (parent -> child), stopping only when a
         * jump point is found.
         * @protected
         * @return {Array<Array<number>>} The x, y coordinate of the jump point
         *     found, or null if not found
         */
        protected _jump(x: number, y: number, px: number, py: number): number[];
        /**
         * Find the neighbors for the given node. If the node has a parent,
         * prune the neighbors based on the jump point search algorithm, otherwise
         * return all available neighbors.
         * @return {Array<Array<number>>} The neighbors found.
         */
        protected _findNeighbors(node: Node): Array<number[]>;
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
declare module PF {
    class JPFMoveDiagonallyIfAtMostOneObstacle extends JumpPointFinderBase {
        /**
         * Path finder using the Jump Point Search algorithm which moves
         * diagonally only when there is at most one obstacle.
         */
        constructor(options?: IAStarOptions);
        /**
         * Search recursively in the direction (parent -> child), stopping only when a
         * jump point is found.
         * @protected
         * @return {Array<Array<number>>} The x, y coordinate of the jump point
         *     found, or null if not found
         */
        protected _jump(x: number, y: number, px: number, py: number): number[];
        /**
         * Find the neighbors for the given node. If the node has a parent,
         * prune the neighbors based on the jump point search algorithm, otherwise
         * return all available neighbors.
         * @return {Array<Array<number>>} The neighbors found.
         */
        protected _findNeighbors(node: Node): Array<number[]>;
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
declare module PF {
    class JPFMoveDiagonallyIfNoObstacles extends JumpPointFinderBase {
        /**
         * Path finder using the Jump Point Search algorithm which moves
         * diagonally only when there are no obstacles.
         */
        constructor(options?: IAStarOptions);
        /**
         * Search recursively in the direction (parent -> child), stopping only when a
         * jump point is found.
         * @protected
         * @return {Array<Array<number>>} The x, y coordinate of the jump point
         *     found, or null if not found
         */
        protected _jump(x: number, y: number, px: number, py: number): number[];
        /**
         * Find the neighbors for the given node. If the node has a parent,
         * prune the neighbors based on the jump point search algorithm, otherwise
         * return all available neighbors.
         * @return {Array<Array<number>>} The neighbors found.
         */
        protected _findNeighbors(node: Node): Array<number[]>;
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
declare module PF {
    class JPFNeverMoveDiagonally extends JumpPointFinderBase {
        /**
         * Path finder using the Jump Point Search algorithm allowing only horizontal
         * or vertical movements.
         */
        constructor(options?: IAStarOptions);
        /**
         * Search recursively in the direction (parent -> child), stopping only when a
         * jump point is found.
         * @protected
         * @return {Array<Array<number>>} The x, y coordinate of the jump point
         *     found, or null if not found
         */
        protected _jump(x: number, y: number, px: number, py: number): number[];
        /**
         * Find the neighbors for the given node. If the node has a parent,
         * prune the neighbors based on the jump point search algorithm, otherwise
         * return all available neighbors.
         * @return {Array<Array<number>>} The neighbors found.
         */
        protected _findNeighbors(node: Node): Array<number[]>;
    }
}
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
declare module PF {
    /**
     * Path finder using the Jump Point Search algorithm
     * @param {Object} options
     * @param {function} options.heuristic Heuristic function to estimate the distance
     *     (defaults to manhattan).
     * @param {DiagonalMovement} options.diagonalMovement Condition under which diagonal
     *      movement will be allowed.
     */
    function JumpPointFinder(options?: IAStarOptions): JumpPointFinderBase;
}
