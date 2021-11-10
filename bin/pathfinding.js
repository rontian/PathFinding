var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var DiagonalMovement;
    (function (DiagonalMovement) {
        DiagonalMovement[DiagonalMovement["Always"] = 1] = "Always";
        /**不允许 */
        DiagonalMovement[DiagonalMovement["Never"] = 2] = "Never";
        /** 只要有一个临近格子可以走就能走斜角*/
        DiagonalMovement[DiagonalMovement["IfAtMostOneObstacle"] = 3] = "IfAtMostOneObstacle";
        //只有在没有障碍的时候
        DiagonalMovement[DiagonalMovement["OnlyWhenNoObstacles"] = 4] = "OnlyWhenNoObstacles";
    })(DiagonalMovement = PF.DiagonalMovement || (PF.DiagonalMovement = {}));
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var Grid = /** @class */ (function () {
        function Grid(width_or_matrix, height, matrix) {
            var width;
            if (typeof width_or_matrix !== 'object') {
                width = width_or_matrix;
            }
            else {
                height = width_or_matrix.length;
                width = width_or_matrix[0].length;
                matrix = width_or_matrix;
            }
            /**
             * The number of columns of the grid.
             * @type number
             */
            this.$width = width;
            /**
             * The number of rows of the grid.
             * @type number
             */
            this.$height = height;
            /**
             * A 2D array of nodes.
             */
            this.$nodes = this.buildNodes(width, height, matrix);
        }
        Grid.prototype.buildNodes = function (width, height, matrix) {
            var i, j, nodes = new Array(height);
            for (i = 0; i < height; ++i) {
                nodes[i] = new Array(width);
                for (j = 0; j < width; ++j) {
                    nodes[i][j] = new PF.Node(j, i);
                }
            }
            if (matrix === undefined) {
                return nodes;
            }
            if (matrix.length !== height || matrix[0].length !== width) {
                throw new Error('Matrix size does not fit');
            }
            for (i = 0; i < height; ++i) {
                for (j = 0; j < width; ++j) {
                    if (matrix[i][j]) {
                        // 0, false, null will be walkable
                        // while others will be un-walkable
                        nodes[i][j].walkable = false;
                    }
                }
            }
            return nodes;
        };
        Grid.prototype.getNodeAt = function (x, y) {
            return this.$nodes[y][x];
        };
        Grid.prototype.isWalkableAt = function (x, y) {
            return this.isInside(x, y) && this.$nodes[y][x].walkable;
        };
        Grid.prototype.isInside = function (x, y) {
            return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
        };
        Grid.prototype.setWalkableAt = function (x, y, walkable) {
            this.isInside(x, y) && (this.$nodes[y][x].walkable = walkable);
        };
        Grid.prototype.getNeighbors = function (node, diagonalMovement) {
            var x = node.x, y = node.y, neighbors = [], s0 = false, d0 = false, s1 = false, d1 = false, s2 = false, d2 = false, s3 = false, d3 = false, nodes = this.$nodes;
            // ↑
            if (this.isWalkableAt(x, y - 1)) {
                neighbors.push(nodes[y - 1][x]);
                s0 = true;
            }
            // →
            if (this.isWalkableAt(x + 1, y)) {
                neighbors.push(nodes[y][x + 1]);
                s1 = true;
            }
            // ↓
            if (this.isWalkableAt(x, y + 1)) {
                neighbors.push(nodes[y + 1][x]);
                s2 = true;
            }
            // ←
            if (this.isWalkableAt(x - 1, y)) {
                neighbors.push(nodes[y][x - 1]);
                s3 = true;
            }
            if (diagonalMovement === PF.DiagonalMovement.Never) {
                return neighbors;
            }
            if (diagonalMovement === PF.DiagonalMovement.OnlyWhenNoObstacles) {
                d0 = s3 && s0;
                d1 = s0 && s1;
                d2 = s1 && s2;
                d3 = s2 && s3;
            }
            else if (diagonalMovement === PF.DiagonalMovement.IfAtMostOneObstacle) {
                d0 = s3 || s0;
                d1 = s0 || s1;
                d2 = s1 || s2;
                d3 = s2 || s3;
            }
            else if (diagonalMovement === PF.DiagonalMovement.Always) {
                d0 = true;
                d1 = true;
                d2 = true;
                d3 = true;
            }
            else {
                throw new Error('Incorrect value of diagonalMovement');
            }
            // ↖
            if (d0 && this.isWalkableAt(x - 1, y - 1)) {
                neighbors.push(nodes[y - 1][x - 1]);
            }
            // ↗
            if (d1 && this.isWalkableAt(x + 1, y - 1)) {
                neighbors.push(nodes[y - 1][x + 1]);
            }
            // ↘
            if (d2 && this.isWalkableAt(x + 1, y + 1)) {
                neighbors.push(nodes[y + 1][x + 1]);
            }
            // ↙
            if (d3 && this.isWalkableAt(x - 1, y + 1)) {
                neighbors.push(nodes[y + 1][x - 1]);
            }
            return neighbors;
        };
        Grid.prototype.clone = function () {
            var i, j, width = this.width, height = this.height, thisNodes = this.$nodes, newGrid = new Grid(width, height);
            for (i = 0; i < height; ++i) {
                for (j = 0; j < width; ++j) {
                    newGrid.$nodes[i][j].walkable = thisNodes[i][j].walkable;
                }
            }
            return newGrid;
        };
        Object.defineProperty(Grid.prototype, "values", {
            get: function () {
                var values = [];
                for (var y = 0; y < this.height; y++) {
                    var arr = values[y] || [];
                    for (var x = 0; x < this.width; x++) {
                        arr[x] = this.isWalkableAt(x, y) ? 0 : 1;
                    }
                    values[y] = arr;
                }
                return values;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "width", {
            get: function () { return this.$width; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "height", {
            get: function () { return this.$height; },
            enumerable: true,
            configurable: true
        });
        return Grid;
    }());
    PF.Grid = Grid;
    __reflect(Grid.prototype, "PF.Grid");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    /**有序数组 */
    var Heap = /** @class */ (function () {
        function Heap(compareFunc) {
            this.$compare = compareFunc || defaultCmp;
            this.$nodes = [];
        }
        Heap.prototype.push = function (n) {
            return Heap.push(this.$nodes, n, this.$compare);
        };
        Heap.prototype.pop = function () {
            return Heap.pop(this.$nodes, this.$compare);
        };
        Heap.prototype.peek = function () {
            return this.$nodes[0];
        };
        Heap.prototype.contains = function (n) {
            return this.$nodes.indexOf(n) !== -1;
        };
        Heap.prototype.replace = function (n) {
            return Heap.replace(this.$nodes, n, this.$compare);
        };
        Heap.prototype.pushpop = function (n) {
            return Heap.pushpop(this.$nodes, n, this.$compare);
        };
        Heap.prototype.ify = function () {
            return Heap.ify(this.$nodes, this.$compare);
        };
        Heap.prototype.updateItem = function (n) {
            return Heap.updateItem(this.$nodes, n, this.$compare);
        };
        Heap.prototype.clear = function () {
            this.$nodes.length = 0;
        };
        Heap.prototype.empty = function () {
            return this.$nodes.length === 0;
        };
        Heap.prototype.size = function () {
            return this.$nodes.length;
        };
        Heap.prototype.clone = function () {
            var heap = new Heap(this.$compare);
            heap.$nodes = this.$nodes.slice(0);
            return heap;
        };
        Heap.prototype.toArray = function () {
            return this.$nodes.slice(0);
        };
        Heap.push = function (array, item, cmp) {
            if (cmp == null) {
                cmp = defaultCmp;
            }
            array.push(item);
            return _siftdown(array, 0, array.length - 1, cmp);
        };
        Heap.pop = function (array, cmp) {
            var lastelt, returnitem;
            if (cmp == null) {
                cmp = defaultCmp;
            }
            lastelt = array.pop();
            if (array.length) {
                returnitem = array[0];
                array[0] = lastelt;
                _siftup(array, 0, cmp);
            }
            else {
                returnitem = lastelt;
            }
            return returnitem;
        };
        Heap.replace = function (array, item, cmp) {
            var returnitem;
            if (cmp == null) {
                cmp = defaultCmp;
            }
            returnitem = array[0];
            array[0] = item;
            _siftup(array, 0, cmp);
            return returnitem;
        };
        Heap.pushpop = function (array, item, cmp) {
            var _ref;
            if (cmp == null) {
                cmp = defaultCmp;
            }
            if (array.length && cmp(array[0], item) < 0) {
                _ref = [array[0], item];
                item = _ref[0];
                array[0] = _ref[1];
                _siftup(array, 0, cmp);
            }
            return item;
        };
        Heap.ify = function (array, cmp) {
            var i, _i, _j, _len, _ref, _ref1, _results, _results1;
            if (cmp == null) {
                cmp = defaultCmp;
            }
            _ref1 = (function () {
                _results1 = [];
                for (var _j_1 = 0, _ref_1 = Math.floor(array.length / 2); 0 <= _ref_1 ? _j_1 < _ref_1 : _j_1 > _ref_1; 0 <= _ref_1 ? _j_1++ : _j_1--) {
                    _results1.push(_j_1);
                }
                return _results1;
            }).apply(this).reverse();
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                i = _ref1[_i];
                _results.push(_siftup(array, i, cmp));
            }
            return _results;
        };
        Heap.updateItem = function (array, item, cmp) {
            var pos;
            if (cmp == null) {
                cmp = defaultCmp;
            }
            pos = array.indexOf(item);
            if (pos === -1) {
                return;
            }
            _siftdown(array, 0, pos, cmp);
            return _siftup(array, pos, cmp);
        };
        /**查找数据集中最大的n个元素。 */
        Heap.nlargest = function (array, n, cmp) {
            var item, results, i, len, refs;
            if (cmp == null) {
                cmp = defaultCmp;
            }
            results = array.slice(0, n);
            if (!results.length) {
                return results;
            }
            this.ify(results, cmp);
            refs = array.slice(n);
            for (i = 0, len = refs.length; i < len; i++) {
                item = refs[i];
                this.pushpop(results, item, cmp);
            }
            return results.sort(cmp).reverse();
        };
        /**查找数据集中最小的n个元素。 */
        Heap.nsmallest = function (array, n, cmp) {
            var item, los, temps, i, j, len, refs, index, results;
            if (cmp == null) {
                cmp = defaultCmp;
            }
            if (n * 10 <= array.length) {
                temps = array.slice(0, n).sort(cmp);
                if (!temps.length) {
                    return temps;
                }
                los = temps[temps.length - 1];
                refs = array.slice(n);
                for (i = 0, len = refs.length; i < len; i++) {
                    item = refs[i];
                    if (cmp(item, los) < 0) {
                        insort(temps, item, 0, null, cmp);
                        temps.pop();
                        los = temps[temps.length - 1];
                    }
                }
                return temps;
            }
            this.ify(array, cmp);
            results = [];
            for (i = j = 0, index = Math.min(n, array.length); 0 <= index ? j < index : j > index; i = 0 <= index ? ++j : --j) {
                results.push(this.pop(array, cmp));
            }
            return results;
        };
        return Heap;
    }());
    PF.Heap = Heap;
    __reflect(Heap.prototype, "PF.Heap");
    function defaultCmp(x, y) {
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    }
    function _siftdown(array, startpos, pos, cmp) {
        var newitem, parent, parentpos;
        if (cmp == null) {
            cmp = defaultCmp;
        }
        newitem = array[pos];
        while (pos > startpos) {
            parentpos = (pos - 1) >> 1;
            parent = array[parentpos];
            if (cmp(newitem, parent) < 0) {
                array[pos] = parent;
                pos = parentpos;
                continue;
            }
            break;
        }
        return array[pos] = newitem;
    }
    ;
    function _siftup(array, pos, cmp) {
        var childpos, endpos, newitem, rightpos, startpos;
        if (cmp == null) {
            cmp = defaultCmp;
        }
        endpos = array.length;
        startpos = pos;
        newitem = array[pos];
        childpos = 2 * pos + 1;
        while (childpos < endpos) {
            rightpos = childpos + 1;
            if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
                childpos = rightpos;
            }
            array[pos] = array[childpos];
            pos = childpos;
            childpos = 2 * pos + 1;
        }
        array[pos] = newitem;
        return _siftdown(array, startpos, pos, cmp);
    }
    function insort(a, x, lo, hi, cmp) {
        var mid;
        if (lo == null) {
            lo = 0;
        }
        if (cmp == null) {
            cmp = defaultCmp;
        }
        if (lo < 0) {
            throw new Error('lo must be non-negative');
        }
        if (hi == null) {
            hi = a.length;
        }
        while (lo < hi) {
            mid = Math.floor((lo + hi) / 2);
            if (cmp(x, a[mid]) < 0) {
                hi = mid;
            }
            else {
                lo = mid + 1;
            }
        }
        return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
    }
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var Heuristic = /** @class */ (function () {
        function Heuristic() {
        }
        /**
         * Manhattan distance.
         * @param {number} dx - Difference in x.
         * @param {number} dy - Difference in y.
         * @return {number} dx + dy
         */
        Heuristic.manhattan = function (dx, dy) {
            return dx + dy;
        };
        /**
         * Euclidean distance.
         * @param {number} dx - Difference in x.
         * @param {number} dy - Difference in y.
         * @return {number} sqrt(dx * dx + dy * dy)
         */
        Heuristic.euclidean = function (dx, dy) {
            return Math.sqrt(dx * dx + dy * dy);
        };
        /**
         * Octile distance.
         * @param {number} dx - Difference in x.
         * @param {number} dy - Difference in y.
         * @return {number} sqrt(dx * dx + dy * dy) for grids
         */
        Heuristic.octile = function (dx, dy) {
            var F = Math.SQRT2 - 1;
            return (dx < dy) ? F * dx + dy : F * dy + dx;
        };
        /**
         * Chebyshev distance.
         * @param {number} dx - Difference in x.
         * @param {number} dy - Difference in y.
         * @return {number} max(dx, dy)
         */
        Heuristic.chebyshev = function (dx, dy) {
            return Math.max(dx, dy);
        };
        return Heuristic;
    }());
    PF.Heuristic = Heuristic;
    __reflect(Heuristic.prototype, "PF.Heuristic");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var Node = /** @class */ (function () {
        function Node(x, y, walkable) {
            if (walkable === void 0) { walkable = true; }
            this.f = 0;
            this.g = 0;
            this.h = 0;
            this.x = x;
            this.y = y;
            this.walkable = walkable;
        }
        return Node;
    }());
    PF.Node = Node;
    __reflect(Node.prototype, "PF.Node");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var Util = /** @class */ (function () {
        function Util() {
        }
        /**根据父记录回溯并返回路径。
        （包括起始节点和结束节点） */
        Util.backtrace = function (node) {
            var paths = [[node.x, node.y]];
            while (node.parent) {
                node = node.parent;
                paths.push([node.x, node.y]);
            }
            return paths.reverse();
        };
        /**
            从起始节点和结束节点回溯，并返回路径。
            （包括起始节点和结束节点） */
        Util.biBacktrace = function (nodeA, nodeB) {
            var pathA = this.backtrace(nodeA), pathB = this.backtrace(nodeB);
            return pathA.concat(pathB.reverse());
        };
        /**
         * 计算路径的长度。
         */
        Util.pathLength = function (paths) {
            var i, sum = 0, a, b, dx, dy;
            for (i = 1; i < paths.length; ++i) {
                a = paths[i - 1];
                b = paths[i];
                dx = a[0] - b[0];
                dy = a[1] - b[1];
                sum += Math.sqrt(dx * dx + dy * dy);
            }
            return sum;
        };
        /**给定压缩路径，返回包含所有段的新路径
            在它的插值。 */
        Util.expandPath = function (paths) {
            var expanded = [], len = paths.length, coord0, coord1, interpolated, interpolatedLen, i, j;
            if (len < 2) {
                return expanded;
            }
            for (i = 0; i < len - 1; ++i) {
                coord0 = paths[i];
                coord1 = paths[i + 1];
                interpolated = this.interpolate(coord0[0], coord0[1], coord1[0], coord1[1]);
                interpolatedLen = interpolated.length;
                for (j = 0; j < interpolatedLen - 1; ++j) {
                    expanded.push(interpolated[j]);
                }
            }
            expanded.push(paths[len - 1]);
            return expanded;
        };
        /**给定起始坐标和结束坐标，返回所有坐标
            在这些坐标形成的直线上，基于Bresenham算法。 */
        Util.interpolate = function (x0, y0, x1, y1) {
            var abs = Math.abs, line = [], sx, sy, dx, dy, err, e2;
            dx = abs(x1 - x0);
            dy = abs(y1 - y0);
            sx = (x0 < x1) ? 1 : -1;
            sy = (y0 < y1) ? 1 : -1;
            err = dx - dy;
            while (true) {
                line.push([x0, y0]);
                if (x0 === x1 && y0 === y1) {
                    break;
                }
                e2 = 2 * err;
                if (e2 > -dy) {
                    err = err - dy;
                    x0 = x0 + sx;
                }
                if (e2 < dx) {
                    err = err + dx;
                    y0 = y0 + sy;
                }
            }
            return line;
        };
        return Util;
    }());
    PF.Util = Util;
    __reflect(Util.prototype, "PF.Util");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var AStarFinder = /** @class */ (function () {
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
        function AStarFinder(options) {
            options = options || {};
            this.allowDiagonal = options.allowDiagonal;
            this.dontCrossCorners = options.dontCrossCorners;
            this.heuristic = options.heuristic || PF.Heuristic.manhattan;
            this.weight = options.weight || 1;
            this.diagonalMovement = options.diagonalMovement;
            if (!this.diagonalMovement) {
                if (!this.allowDiagonal) {
                    this.diagonalMovement = PF.DiagonalMovement.Never;
                }
                else {
                    if (this.dontCrossCorners) {
                        this.diagonalMovement = PF.DiagonalMovement.OnlyWhenNoObstacles;
                    }
                    else {
                        this.diagonalMovement = PF.DiagonalMovement.IfAtMostOneObstacle;
                    }
                }
            }
            // When diagonal movement is allowed the manhattan heuristic is not
            //admissible. It should be octile instead
            if (this.diagonalMovement === PF.DiagonalMovement.Never) {
                this.heuristic = options.heuristic || PF.Heuristic.manhattan;
            }
            else {
                this.heuristic = options.heuristic || PF.Heuristic.octile;
            }
        }
        /**
         * Find and return the the path.
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        AStarFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
            var openList = new PF.Heap(function (nodeA, nodeB) {
                return nodeA.f - nodeB.f;
            }), startNode = grid.getNodeAt(startX, startY), endNode = grid.getNodeAt(endX, endY), heuristic = this.heuristic, diagonalMovement = this.diagonalMovement, weight = this.weight, abs = Math.abs, SQRT2 = Math.SQRT2, node, neighbors, neighbor, i, l, x, y, ng;
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
                // if reached the end position, construct the path and return it
                if (node === endNode) {
                    return PF.Util.backtrace(endNode);
                }
                // get neigbours of the current node
                neighbors = grid.getNeighbors(node, diagonalMovement);
                for (i = 0, l = neighbors.length; i < l; ++i) {
                    neighbor = neighbors[i];
                    if (neighbor.closed) {
                        continue;
                    }
                    x = neighbor.x;
                    y = neighbor.y;
                    // get the distance between current node and the neighbor
                    // and calculate the next g score
                    ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);
                    // check if the neighbor has not been inspected yet, or
                    // can be reached with smaller cost from the current node
                    if (!neighbor.opened || ng < neighbor.g) {
                        neighbor.g = ng;
                        neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.parent = node;
                        if (!neighbor.opened) {
                            openList.push(neighbor);
                            neighbor.opened = true;
                        }
                        else {
                            // the neighbor can be reached with smaller cost.
                            // Since its f value has been updated, we have to
                            // update its position in the open list
                            openList.updateItem(neighbor);
                        }
                    }
                } // end for each neighbor
            } // end while not open list empty
            // fail to find the path
            return [];
        };
        return AStarFinder;
    }());
    PF.AStarFinder = AStarFinder;
    __reflect(AStarFinder.prototype, "PF.AStarFinder");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var BestFirstFinder = /** @class */ (function (_super) {
        __extends(BestFirstFinder, _super);
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
        function BestFirstFinder(options) {
            var _this = _super.call(this, options) || this;
            var heuristic = _this.heuristic;
            _this.heuristic = function (dx, dy) {
                return heuristic(dx, dy) * 1000000;
            };
            return _this;
        }
        return BestFirstFinder;
    }(PF.AStarFinder));
    PF.BestFirstFinder = BestFirstFinder;
    __reflect(BestFirstFinder.prototype, "PF.BestFirstFinder");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var BiAStarFinder = /** @class */ (function () {
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
        function BiAStarFinder(options) {
            options = options || {};
            this.allowDiagonal = options.allowDiagonal;
            this.dontCrossCorners = options.dontCrossCorners;
            this.diagonalMovement = options.diagonalMovement;
            this.heuristic = options.heuristic || PF.Heuristic.manhattan;
            this.weight = options.weight || 1;
            if (!this.diagonalMovement) {
                if (!this.allowDiagonal) {
                    this.diagonalMovement = PF.DiagonalMovement.Never;
                }
                else {
                    if (this.dontCrossCorners) {
                        this.diagonalMovement = PF.DiagonalMovement.OnlyWhenNoObstacles;
                    }
                    else {
                        this.diagonalMovement = PF.DiagonalMovement.IfAtMostOneObstacle;
                    }
                }
            }
            //When diagonal movement is allowed the manhattan heuristic is not admissible
            //It should be octile instead
            if (this.diagonalMovement === PF.DiagonalMovement.Never) {
                this.heuristic = options.heuristic || PF.Heuristic.manhattan;
            }
            else {
                this.heuristic = options.heuristic || PF.Heuristic.octile;
            }
        }
        /**
         * Find and return the the path.
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        BiAStarFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
            var cmp = function (nodeA, nodeB) {
                return nodeA.f - nodeB.f;
            }, startOpenList = new PF.Heap(cmp), endOpenList = new PF.Heap(cmp), startNode = grid.getNodeAt(startX, startY), endNode = grid.getNodeAt(endX, endY), heuristic = this.heuristic, diagonalMovement = this.diagonalMovement, weight = this.weight, abs = Math.abs, SQRT2 = Math.SQRT2, node, neighbors, neighbor, i, l, x, y, ng, BY_START = 1, BY_END = 2;
            // set the `g` and `f` value of the start node to be 0
            // and push it into the start open list
            startNode.g = 0;
            startNode.f = 0;
            startOpenList.push(startNode);
            startNode.opened = BY_START;
            // set the `g` and `f` value of the end node to be 0
            // and push it into the open open list
            endNode.g = 0;
            endNode.f = 0;
            endOpenList.push(endNode);
            endNode.opened = BY_END;
            // while both the open lists are not empty
            while (!startOpenList.empty() && !endOpenList.empty()) {
                // pop the position of start node which has the minimum `f` value.
                node = startOpenList.pop();
                node.closed = true;
                // get neigbours of the current node
                neighbors = grid.getNeighbors(node, diagonalMovement);
                for (i = 0, l = neighbors.length; i < l; ++i) {
                    neighbor = neighbors[i];
                    if (neighbor.closed) {
                        continue;
                    }
                    if (neighbor.opened === BY_END) {
                        return PF.Util.biBacktrace(node, neighbor);
                    }
                    x = neighbor.x;
                    y = neighbor.y;
                    // get the distance between current node and the neighbor
                    // and calculate the next g score
                    ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);
                    // check if the neighbor has not been inspected yet, or
                    // can be reached with smaller cost from the current node
                    if (!neighbor.opened || ng < neighbor.g) {
                        neighbor.g = ng;
                        neighbor.h = neighbor.h ||
                            weight * heuristic(abs(x - endX), abs(y - endY));
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.parent = node;
                        if (!neighbor.opened) {
                            startOpenList.push(neighbor);
                            neighbor.opened = BY_START;
                        }
                        else {
                            // the neighbor can be reached with smaller cost.
                            // Since its f value has been updated, we have to
                            // update its position in the open list
                            startOpenList.updateItem(neighbor);
                        }
                    }
                } // end for each neighbor
                // pop the position of end node which has the minimum `f` value.
                node = endOpenList.pop();
                node.closed = true;
                // get neigbours of the current node
                neighbors = grid.getNeighbors(node, diagonalMovement);
                for (i = 0, l = neighbors.length; i < l; ++i) {
                    neighbor = neighbors[i];
                    if (neighbor.closed) {
                        continue;
                    }
                    if (neighbor.opened === BY_START) {
                        return PF.Util.biBacktrace(neighbor, node);
                    }
                    x = neighbor.x;
                    y = neighbor.y;
                    // get the distance between current node and the neighbor
                    // and calculate the next g score
                    ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);
                    // check if the neighbor has not been inspected yet, or
                    // can be reached with smaller cost from the current node
                    if (!neighbor.opened || ng < neighbor.g) {
                        neighbor.g = ng;
                        neighbor.h = neighbor.h ||
                            weight * heuristic(abs(x - startX), abs(y - startY));
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.parent = node;
                        if (!neighbor.opened) {
                            endOpenList.push(neighbor);
                            neighbor.opened = BY_END;
                        }
                        else {
                            // the neighbor can be reached with smaller cost.
                            // Since its f value has been updated, we have to
                            // update its position in the open list
                            endOpenList.updateItem(neighbor);
                        }
                    }
                } // end for each neighbor
            } // end while not open list empty
            // fail to find the path
            return [];
        };
        ;
        return BiAStarFinder;
    }());
    PF.BiAStarFinder = BiAStarFinder;
    __reflect(BiAStarFinder.prototype, "PF.BiAStarFinder");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var BiBestFirstFinder = /** @class */ (function (_super) {
        __extends(BiBestFirstFinder, _super);
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
        function BiBestFirstFinder(options) {
            var _this = _super.call(this, options) || this;
            var heuristic = _this.heuristic;
            _this.heuristic = function (dx, dy) {
                return heuristic(dx, dy) * 1000000;
            };
            return _this;
        }
        return BiBestFirstFinder;
    }(PF.BiAStarFinder));
    PF.BiBestFirstFinder = BiBestFirstFinder;
    __reflect(BiBestFirstFinder.prototype, "PF.BiBestFirstFinder");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var BiBreadthFirstFinder = /** @class */ (function () {
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
        function BiBreadthFirstFinder(options) {
            options = options || {};
            this.allowDiagonal = options.allowDiagonal;
            this.dontCrossCorners = options.dontCrossCorners;
            this.diagonalMovement = options.diagonalMovement;
            if (!this.diagonalMovement) {
                if (!this.allowDiagonal) {
                    this.diagonalMovement = PF.DiagonalMovement.Never;
                }
                else {
                    if (this.dontCrossCorners) {
                        this.diagonalMovement = PF.DiagonalMovement.OnlyWhenNoObstacles;
                    }
                    else {
                        this.diagonalMovement = PF.DiagonalMovement.IfAtMostOneObstacle;
                    }
                }
            }
        }
        /**
         * Find and return the the path.
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        BiBreadthFirstFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
            var startNode = grid.getNodeAt(startX, startY), endNode = grid.getNodeAt(endX, endY), startOpenList = [], endOpenList = [], neighbors, neighbor, node, diagonalMovement = this.diagonalMovement, BY_START = 0, BY_END = 1, i, l;
            // push the start and end nodes into the queues
            startOpenList.push(startNode);
            startNode.opened = true;
            startNode.by = BY_START;
            endOpenList.push(endNode);
            endNode.opened = true;
            endNode.by = BY_END;
            // while both the queues are not empty
            while (startOpenList.length && endOpenList.length) {
                // expand start open list
                node = startOpenList.shift();
                node.closed = true;
                neighbors = grid.getNeighbors(node, diagonalMovement);
                for (i = 0, l = neighbors.length; i < l; ++i) {
                    neighbor = neighbors[i];
                    if (neighbor.closed) {
                        continue;
                    }
                    if (neighbor.opened) {
                        // if this node has been inspected by the reversed search,
                        // then a path is found.
                        if (neighbor.by === BY_END) {
                            return PF.Util.biBacktrace(node, neighbor);
                        }
                        continue;
                    }
                    startOpenList.push(neighbor);
                    neighbor.parent = node;
                    neighbor.opened = true;
                    neighbor.by = BY_START;
                }
                // expand end open list
                node = endOpenList.shift();
                node.closed = true;
                neighbors = grid.getNeighbors(node, diagonalMovement);
                for (i = 0, l = neighbors.length; i < l; ++i) {
                    neighbor = neighbors[i];
                    if (neighbor.closed) {
                        continue;
                    }
                    if (neighbor.opened) {
                        if (neighbor.by === BY_START) {
                            return PF.Util.biBacktrace(neighbor, node);
                        }
                        continue;
                    }
                    endOpenList.push(neighbor);
                    neighbor.parent = node;
                    neighbor.opened = true;
                    neighbor.by = BY_END;
                }
            }
            // fail to find the path
            return [];
        };
        ;
        return BiBreadthFirstFinder;
    }());
    PF.BiBreadthFirstFinder = BiBreadthFirstFinder;
    __reflect(BiBreadthFirstFinder.prototype, "PF.BiBreadthFirstFinder");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var BiDijkstraFinder = /** @class */ (function (_super) {
        __extends(BiDijkstraFinder, _super);
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
        function BiDijkstraFinder(options) {
            var _this = _super.call(this, options) || this;
            _this.heuristic = function (dx, dy) {
                return 0;
            };
            return _this;
        }
        return BiDijkstraFinder;
    }(PF.BiAStarFinder));
    PF.BiDijkstraFinder = BiDijkstraFinder;
    __reflect(BiDijkstraFinder.prototype, "PF.BiDijkstraFinder");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var BreadthFirstFinder = /** @class */ (function () {
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
        function BreadthFirstFinder(options) {
            options = options || {};
            this.allowDiagonal = options.allowDiagonal;
            this.dontCrossCorners = options.dontCrossCorners;
            this.diagonalMovement = options.diagonalMovement;
            if (!this.diagonalMovement) {
                if (!this.allowDiagonal) {
                    this.diagonalMovement = PF.DiagonalMovement.Never;
                }
                else {
                    if (this.dontCrossCorners) {
                        this.diagonalMovement = PF.DiagonalMovement.OnlyWhenNoObstacles;
                    }
                    else {
                        this.diagonalMovement = PF.DiagonalMovement.IfAtMostOneObstacle;
                    }
                }
            }
        }
        /**
         * Find and return the the path.
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        BreadthFirstFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
            var openList = [], diagonalMovement = this.diagonalMovement, startNode = grid.getNodeAt(startX, startY), endNode = grid.getNodeAt(endX, endY), neighbors, neighbor, node, i, l;
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
                    return PF.Util.backtrace(endNode);
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
        };
        return BreadthFirstFinder;
    }());
    PF.BreadthFirstFinder = BreadthFirstFinder;
    __reflect(BreadthFirstFinder.prototype, "PF.BreadthFirstFinder");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var DijkstraFinder = /** @class */ (function (_super) {
        __extends(DijkstraFinder, _super);
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
        function DijkstraFinder(options) {
            var _this = _super.call(this, options) || this;
            _this.heuristic = function (dx, dy) {
                return 0;
            };
            return _this;
        }
        return DijkstraFinder;
    }(PF.AStarFinder));
    PF.DijkstraFinder = DijkstraFinder;
    __reflect(DijkstraFinder.prototype, "PF.DijkstraFinder");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
var PF;
(function (PF) {
    var IDAStarFinder = /** @class */ (function () {
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
        function IDAStarFinder(options) {
            options = options || {};
            this.allowDiagonal = options.allowDiagonal;
            this.dontCrossCorners = options.dontCrossCorners;
            this.diagonalMovement = options.diagonalMovement;
            this.heuristic = options.heuristic || PF.Heuristic.manhattan;
            this.weight = options.weight || 1;
            this.trackRecursion = options.trackRecursion || false;
            this.timeLimit = options.timeLimit || Infinity; // Default: no time limit.
            if (!this.diagonalMovement) {
                if (!this.allowDiagonal) {
                    this.diagonalMovement = PF.DiagonalMovement.Never;
                }
                else {
                    if (this.dontCrossCorners) {
                        this.diagonalMovement = PF.DiagonalMovement.OnlyWhenNoObstacles;
                    }
                    else {
                        this.diagonalMovement = PF.DiagonalMovement.IfAtMostOneObstacle;
                    }
                }
            }
            // When diagonal movement is allowed the manhattan heuristic is not
            // admissible, it should be octile instead
            if (this.diagonalMovement === PF.DiagonalMovement.Never) {
                this.heuristic = options.heuristic || PF.Heuristic.manhattan;
            }
            else {
                this.heuristic = options.heuristic || PF.Heuristic.octile;
            }
        }
        /**
         * Find and return the the path. When an empty array is returned, either
         * no path is possible, or the maximum execution time is reached.
         *
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        IDAStarFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
            var _this = this;
            // Used for statistics:
            var nodesVisited = 0;
            // Execution time limitation:
            var startTime = new Date().getTime();
            // Heuristic helper:
            var h = function (a, b) {
                return _this.heuristic(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
            };
            // Step cost from a to b:
            var cost = function (a, b) {
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
            var search = function (node, g, cutoff, route, depth) {
                nodesVisited++;
                // Enforce timelimit:
                if (_this.timeLimit > 0 &&
                    new Date().getTime() - startTime > _this.timeLimit * 1000) {
                    // Enforced as "path-not-found".
                    return Infinity;
                }
                var f = g + h(node, end) * _this.weight;
                // We've searched too deep for this iteration.
                if (f > cutoff) {
                    return f;
                }
                if (node == end) {
                    route[depth] = [node.x, node.y];
                    return node;
                }
                var min, t, k, neighbour;
                var neighbours = grid.getNeighbors(node, _this.diagonalMovement);
                // Sort the neighbours, gives nicer paths. But, this deviates
                // from the original algorithm - so I left it out.
                //neighbours.sort(function(a, b){
                //    return h(a, end) - h(b, end);
                //});
                /*jshint -W084 */ //Disable warning: Expected a conditional expression and instead saw an assignment
                for (k = 0, min = Infinity; neighbour = neighbours[k]; ++k) {
                    /*jshint +W084 */ //Enable warning: Expected a conditional expression and instead saw an assignment
                    if (_this.trackRecursion) {
                        // Retain a copy for visualisation. Due to recursion, this
                        // node may be part of other paths too.
                        neighbour.retainCount = neighbour.retainCount + 1 || 1;
                        if (neighbour.tested !== true) {
                            neighbour.tested = true;
                        }
                    }
                    t = search(neighbour, g + cost(node, neighbour), cutoff, route, depth + 1);
                    if (t instanceof PF.Node) {
                        route[depth] = [node.x, node.y];
                        // For a typical A* linked list, this would work:
                        // neighbour.parent = node;
                        return t;
                    }
                    // Decrement count, then determine whether it's actually closed.
                    if (_this.trackRecursion && (--neighbour.retainCount) === 0) {
                        neighbour.tested = false;
                    }
                    if (t < min) {
                        min = t;
                    }
                }
                return min;
            };
            // Node instance lookups:
            var start = grid.getNodeAt(startX, startY);
            var end = grid.getNodeAt(endX, endY);
            // Initial search depth, given the typical heuristic contraints,
            // there should be no cheaper route possible.
            var cutOff = h(start, end);
            var j, route = [], t;
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
                if (t instanceof PF.Node) {
                    return route;
                }
                // Try again, this time with a deeper cut-off. The t score
                // is the closest we got to the end node.
                cutOff = t;
            }
        };
        return IDAStarFinder;
    }());
    PF.IDAStarFinder = IDAStarFinder;
    __reflect(IDAStarFinder.prototype, "PF.IDAStarFinder");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
var PF;
(function (PF) {
    var JumpPointFinderBase = /** @class */ (function () {
        /**
         * Base class for the Jump Point Search algorithm
         * @param {object} options
         * @param {function} options.heuristic Heuristic function to estimate the distance
         *     (defaults to manhattan).
         */
        function JumpPointFinderBase(options) {
            options = options || {};
            this.heuristic = options.heuristic || PF.Heuristic.manhattan;
            this.trackJumpRecursion = options.trackJumpRecursion || false;
        }
        /**
         * Find and return the path.
         * @return {Array<Array<number>>} The path, including both start and
         *     end positions.
         */
        JumpPointFinderBase.prototype.findPath = function (startX, startY, endX, endY, grid) {
            var openList = this.openList = new PF.Heap(function (nodeA, nodeB) {
                return nodeA.f - nodeB.f;
            }), startNode = this.startNode = grid.getNodeAt(startX, startY), endNode = this.endNode = grid.getNodeAt(endX, endY), node;
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
                    return PF.Util.expandPath(PF.Util.backtrace(endNode));
                }
                this._identifySuccessors(node);
            }
            // fail to find the path
            return [];
        };
        /**
         * Identify successors for the given node. Runs a jump point search in the
         * direction of each available neighbor, adding any points found to the open
         * list.
         * @protected
         */
        JumpPointFinderBase.prototype._identifySuccessors = function (node) {
            var grid = this.grid, heuristic = this.heuristic, openList = this.openList, endX = this.endNode.x, endY = this.endNode.y, neighbors, neighbor, jumpPoint, i, l, x = node.x, y = node.y, jx, jy, dx, dy, d, ng, jumpNode, abs = Math.abs, max = Math.max;
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
                    d = PF.Heuristic.octile(abs(jx - x), abs(jy - y));
                    ng = node.g + d; // next `g` value
                    if (!jumpNode.opened || ng < jumpNode.g) {
                        jumpNode.g = ng;
                        jumpNode.h = jumpNode.h || heuristic(abs(jx - endX), abs(jy - endY));
                        jumpNode.f = jumpNode.g + jumpNode.h;
                        jumpNode.parent = node;
                        if (!jumpNode.opened) {
                            openList.push(jumpNode);
                            jumpNode.opened = true;
                        }
                        else {
                            openList.updateItem(jumpNode);
                        }
                    }
                }
            }
        };
        return JumpPointFinderBase;
    }());
    PF.JumpPointFinderBase = JumpPointFinderBase;
    __reflect(JumpPointFinderBase.prototype, "PF.JumpPointFinderBase");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
/// <reference path="./JumpPointFinderBase.ts" />
var PF;
(function (PF) {
    var JPFAlwaysMoveDiagonally = /** @class */ (function (_super) {
        __extends(JPFAlwaysMoveDiagonally, _super);
        function JPFAlwaysMoveDiagonally(opt) {
            return _super.call(this, opt) || this;
        }
        /**
         * Search recursively in the direction (parent -> child), stopping only when a
         * jump point is found.
         * @protected
         * @return {Array<Array<number>>} The x, y coordinate of the jump point
         *     found, or null if not found
         */
        JPFAlwaysMoveDiagonally.prototype._jump = function (x, y, px, py) {
            var grid = this.grid, dx = x - px, dy = y - py;
            if (!grid.isWalkableAt(x, y)) {
                return null;
            }
            if (this.trackJumpRecursion === true) {
                grid.getNodeAt(x, y).tested = true;
            }
            if (grid.getNodeAt(x, y) === this.endNode) {
                return [x, y];
            }
            // check for forced neighbors
            // along the diagonal
            if (dx !== 0 && dy !== 0) {
                if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) ||
                    (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
                    return [x, y];
                }
                // when moving diagonally, must check for vertical/horizontal jump points
                if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
                    return [x, y];
                }
            }
            else {
                if (dx !== 0) {
                    if ((grid.isWalkableAt(x + dx, y + 1) && !grid.isWalkableAt(x, y + 1)) ||
                        (grid.isWalkableAt(x + dx, y - 1) && !grid.isWalkableAt(x, y - 1))) {
                        return [x, y];
                    }
                }
                else {
                    if ((grid.isWalkableAt(x + 1, y + dy) && !grid.isWalkableAt(x + 1, y)) ||
                        (grid.isWalkableAt(x - 1, y + dy) && !grid.isWalkableAt(x - 1, y))) {
                        return [x, y];
                    }
                }
            }
            return this._jump(x + dx, y + dy, x, y);
        };
        ;
        /**
         * Find the neighbors for the given node. If the node has a parent,
         * prune the neighbors based on the jump point search algorithm, otherwise
         * return all available neighbors.
         * @return {Array<Array<number>>} The neighbors found.
         */
        JPFAlwaysMoveDiagonally.prototype._findNeighbors = function (node) {
            var parent = node.parent, x = node.x, y = node.y, grid = this.grid, px, py, nx, ny, dx, dy, neighbors = [], neighborNodes, neighborNode, i, l;
            // directed pruning: can ignore most neighbors, unless forced.
            if (parent) {
                px = parent.x;
                py = parent.y;
                // get the normalized direction of travel
                dx = (x - px) / Math.max(Math.abs(x - px), 1);
                dy = (y - py) / Math.max(Math.abs(y - py), 1);
                // search diagonally
                if (dx !== 0 && dy !== 0) {
                    if (grid.isWalkableAt(x, y + dy)) {
                        neighbors.push([x, y + dy]);
                    }
                    if (grid.isWalkableAt(x + dx, y)) {
                        neighbors.push([x + dx, y]);
                    }
                    if (grid.isWalkableAt(x + dx, y + dy)) {
                        neighbors.push([x + dx, y + dy]);
                    }
                    if (!grid.isWalkableAt(x - dx, y)) {
                        neighbors.push([x - dx, y + dy]);
                    }
                    if (!grid.isWalkableAt(x, y - dy)) {
                        neighbors.push([x + dx, y - dy]);
                    }
                }
                else {
                    if (dx === 0) {
                        if (grid.isWalkableAt(x, y + dy)) {
                            neighbors.push([x, y + dy]);
                        }
                        if (!grid.isWalkableAt(x + 1, y)) {
                            neighbors.push([x + 1, y + dy]);
                        }
                        if (!grid.isWalkableAt(x - 1, y)) {
                            neighbors.push([x - 1, y + dy]);
                        }
                    }
                    else {
                        if (grid.isWalkableAt(x + dx, y)) {
                            neighbors.push([x + dx, y]);
                        }
                        if (!grid.isWalkableAt(x, y + 1)) {
                            neighbors.push([x + dx, y + 1]);
                        }
                        if (!grid.isWalkableAt(x, y - 1)) {
                            neighbors.push([x + dx, y - 1]);
                        }
                    }
                }
            }
            else {
                neighborNodes = grid.getNeighbors(node, PF.DiagonalMovement.Always);
                for (i = 0, l = neighborNodes.length; i < l; ++i) {
                    neighborNode = neighborNodes[i];
                    neighbors.push([neighborNode.x, neighborNode.y]);
                }
            }
            return neighbors;
        };
        return JPFAlwaysMoveDiagonally;
    }(PF.JumpPointFinderBase));
    PF.JPFAlwaysMoveDiagonally = JPFAlwaysMoveDiagonally;
    __reflect(JPFAlwaysMoveDiagonally.prototype, "PF.JPFAlwaysMoveDiagonally");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
/// <reference path="./JumpPointFinderBase.ts" />
var PF;
(function (PF) {
    var JPFMoveDiagonallyIfAtMostOneObstacle = /** @class */ (function (_super) {
        __extends(JPFMoveDiagonallyIfAtMostOneObstacle, _super);
        /**
         * Path finder using the Jump Point Search algorithm which moves
         * diagonally only when there is at most one obstacle.
         */
        function JPFMoveDiagonallyIfAtMostOneObstacle(options) {
            return _super.call(this, options) || this;
        }
        /**
         * Search recursively in the direction (parent -> child), stopping only when a
         * jump point is found.
         * @protected
         * @return {Array<Array<number>>} The x, y coordinate of the jump point
         *     found, or null if not found
         */
        JPFMoveDiagonallyIfAtMostOneObstacle.prototype._jump = function (x, y, px, py) {
            var grid = this.grid, dx = x - px, dy = y - py;
            if (!grid.isWalkableAt(x, y)) {
                return null;
            }
            if (this.trackJumpRecursion === true) {
                grid.getNodeAt(x, y).tested = true;
            }
            if (grid.getNodeAt(x, y) === this.endNode) {
                return [x, y];
            }
            // check for forced neighbors
            // along the diagonal
            if (dx !== 0 && dy !== 0) {
                if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) ||
                    (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
                    return [x, y];
                }
                // when moving diagonally, must check for vertical/horizontal jump points
                if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
                    return [x, y];
                }
            }
            else {
                if (dx !== 0) {
                    if ((grid.isWalkableAt(x + dx, y + 1) && !grid.isWalkableAt(x, y + 1)) ||
                        (grid.isWalkableAt(x + dx, y - 1) && !grid.isWalkableAt(x, y - 1))) {
                        return [x, y];
                    }
                }
                else {
                    if ((grid.isWalkableAt(x + 1, y + dy) && !grid.isWalkableAt(x + 1, y)) ||
                        (grid.isWalkableAt(x - 1, y + dy) && !grid.isWalkableAt(x - 1, y))) {
                        return [x, y];
                    }
                }
            }
            // moving diagonally, must make sure one of the vertical/horizontal
            // neighbors is open to allow the path
            if (grid.isWalkableAt(x + dx, y) || grid.isWalkableAt(x, y + dy)) {
                return this._jump(x + dx, y + dy, x, y);
            }
            else {
                return null;
            }
        };
        /**
         * Find the neighbors for the given node. If the node has a parent,
         * prune the neighbors based on the jump point search algorithm, otherwise
         * return all available neighbors.
         * @return {Array<Array<number>>} The neighbors found.
         */
        JPFMoveDiagonallyIfAtMostOneObstacle.prototype._findNeighbors = function (node) {
            var parent = node.parent, x = node.x, y = node.y, grid = this.grid, px, py, nx, ny, dx, dy, neighbors = [], neighborNodes, neighborNode, i, l;
            // directed pruning: can ignore most neighbors, unless forced.
            if (parent) {
                px = parent.x;
                py = parent.y;
                // get the normalized direction of travel
                dx = (x - px) / Math.max(Math.abs(x - px), 1);
                dy = (y - py) / Math.max(Math.abs(y - py), 1);
                // search diagonally
                if (dx !== 0 && dy !== 0) {
                    if (grid.isWalkableAt(x, y + dy)) {
                        neighbors.push([x, y + dy]);
                    }
                    if (grid.isWalkableAt(x + dx, y)) {
                        neighbors.push([x + dx, y]);
                    }
                    if (grid.isWalkableAt(x, y + dy) || grid.isWalkableAt(x + dx, y)) {
                        neighbors.push([x + dx, y + dy]);
                    }
                    if (!grid.isWalkableAt(x - dx, y) && grid.isWalkableAt(x, y + dy)) {
                        neighbors.push([x - dx, y + dy]);
                    }
                    if (!grid.isWalkableAt(x, y - dy) && grid.isWalkableAt(x + dx, y)) {
                        neighbors.push([x + dx, y - dy]);
                    }
                }
                else {
                    if (dx === 0) {
                        if (grid.isWalkableAt(x, y + dy)) {
                            neighbors.push([x, y + dy]);
                            if (!grid.isWalkableAt(x + 1, y)) {
                                neighbors.push([x + 1, y + dy]);
                            }
                            if (!grid.isWalkableAt(x - 1, y)) {
                                neighbors.push([x - 1, y + dy]);
                            }
                        }
                    }
                    else {
                        if (grid.isWalkableAt(x + dx, y)) {
                            neighbors.push([x + dx, y]);
                            if (!grid.isWalkableAt(x, y + 1)) {
                                neighbors.push([x + dx, y + 1]);
                            }
                            if (!grid.isWalkableAt(x, y - 1)) {
                                neighbors.push([x + dx, y - 1]);
                            }
                        }
                    }
                }
            }
            else {
                neighborNodes = grid.getNeighbors(node, PF.DiagonalMovement.IfAtMostOneObstacle);
                for (i = 0, l = neighborNodes.length; i < l; ++i) {
                    neighborNode = neighborNodes[i];
                    neighbors.push([neighborNode.x, neighborNode.y]);
                }
            }
            return neighbors;
        };
        return JPFMoveDiagonallyIfAtMostOneObstacle;
    }(PF.JumpPointFinderBase));
    PF.JPFMoveDiagonallyIfAtMostOneObstacle = JPFMoveDiagonallyIfAtMostOneObstacle;
    __reflect(JPFMoveDiagonallyIfAtMostOneObstacle.prototype, "PF.JPFMoveDiagonallyIfAtMostOneObstacle");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
/// <reference path="./JumpPointFinderBase.ts" />
var PF;
(function (PF) {
    var JPFMoveDiagonallyIfNoObstacles = /** @class */ (function (_super) {
        __extends(JPFMoveDiagonallyIfNoObstacles, _super);
        /**
         * Path finder using the Jump Point Search algorithm which moves
         * diagonally only when there are no obstacles.
         */
        function JPFMoveDiagonallyIfNoObstacles(options) {
            return _super.call(this, options) || this;
        }
        /**
         * Search recursively in the direction (parent -> child), stopping only when a
         * jump point is found.
         * @protected
         * @return {Array<Array<number>>} The x, y coordinate of the jump point
         *     found, or null if not found
         */
        JPFMoveDiagonallyIfNoObstacles.prototype._jump = function (x, y, px, py) {
            var grid = this.grid, dx = x - px, dy = y - py;
            if (!grid.isWalkableAt(x, y)) {
                return null;
            }
            if (this.trackJumpRecursion === true) {
                grid.getNodeAt(x, y).tested = true;
            }
            if (grid.getNodeAt(x, y) === this.endNode) {
                return [x, y];
            }
            // check for forced neighbors
            // along the diagonal
            if (dx !== 0 && dy !== 0) {
                // if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) ||
                // (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
                // return [x, y];
                // }
                // when moving diagonally, must check for vertical/horizontal jump points
                if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
                    return [x, y];
                }
            }
            else {
                if (dx !== 0) {
                    if ((grid.isWalkableAt(x, y - 1) && !grid.isWalkableAt(x - dx, y - 1)) ||
                        (grid.isWalkableAt(x, y + 1) && !grid.isWalkableAt(x - dx, y + 1))) {
                        return [x, y];
                    }
                }
                else if (dy !== 0) {
                    if ((grid.isWalkableAt(x - 1, y) && !grid.isWalkableAt(x - 1, y - dy)) ||
                        (grid.isWalkableAt(x + 1, y) && !grid.isWalkableAt(x + 1, y - dy))) {
                        return [x, y];
                    }
                    // When moving vertically, must check for horizontal jump points
                    // if (this._jump(x + 1, y, x, y) || this._jump(x - 1, y, x, y)) {
                    // return [x, y];
                    // }
                }
            }
            // moving diagonally, must make sure one of the vertical/horizontal
            // neighbors is open to allow the path
            if (grid.isWalkableAt(x + dx, y) && grid.isWalkableAt(x, y + dy)) {
                return this._jump(x + dx, y + dy, x, y);
            }
            else {
                return null;
            }
        };
        /**
         * Find the neighbors for the given node. If the node has a parent,
         * prune the neighbors based on the jump point search algorithm, otherwise
         * return all available neighbors.
         * @return {Array<Array<number>>} The neighbors found.
         */
        JPFMoveDiagonallyIfNoObstacles.prototype._findNeighbors = function (node) {
            var parent = node.parent, x = node.x, y = node.y, grid = this.grid, px, py, nx, ny, dx, dy, neighbors = [], neighborNodes, neighborNode, i, l;
            // directed pruning: can ignore most neighbors, unless forced.
            if (parent) {
                px = parent.x;
                py = parent.y;
                // get the normalized direction of travel
                dx = (x - px) / Math.max(Math.abs(x - px), 1);
                dy = (y - py) / Math.max(Math.abs(y - py), 1);
                // search diagonally
                if (dx !== 0 && dy !== 0) {
                    if (grid.isWalkableAt(x, y + dy)) {
                        neighbors.push([x, y + dy]);
                    }
                    if (grid.isWalkableAt(x + dx, y)) {
                        neighbors.push([x + dx, y]);
                    }
                    if (grid.isWalkableAt(x, y + dy) && grid.isWalkableAt(x + dx, y)) {
                        neighbors.push([x + dx, y + dy]);
                    }
                }
                else {
                    var isNextWalkable;
                    if (dx !== 0) {
                        isNextWalkable = grid.isWalkableAt(x + dx, y);
                        var isTopWalkable = grid.isWalkableAt(x, y + 1);
                        var isBottomWalkable = grid.isWalkableAt(x, y - 1);
                        if (isNextWalkable) {
                            neighbors.push([x + dx, y]);
                            if (isTopWalkable) {
                                neighbors.push([x + dx, y + 1]);
                            }
                            if (isBottomWalkable) {
                                neighbors.push([x + dx, y - 1]);
                            }
                        }
                        if (isTopWalkable) {
                            neighbors.push([x, y + 1]);
                        }
                        if (isBottomWalkable) {
                            neighbors.push([x, y - 1]);
                        }
                    }
                    else if (dy !== 0) {
                        isNextWalkable = grid.isWalkableAt(x, y + dy);
                        var isRightWalkable = grid.isWalkableAt(x + 1, y);
                        var isLeftWalkable = grid.isWalkableAt(x - 1, y);
                        if (isNextWalkable) {
                            neighbors.push([x, y + dy]);
                            if (isRightWalkable) {
                                neighbors.push([x + 1, y + dy]);
                            }
                            if (isLeftWalkable) {
                                neighbors.push([x - 1, y + dy]);
                            }
                        }
                        if (isRightWalkable) {
                            neighbors.push([x + 1, y]);
                        }
                        if (isLeftWalkable) {
                            neighbors.push([x - 1, y]);
                        }
                    }
                }
            }
            else {
                neighborNodes = grid.getNeighbors(node, PF.DiagonalMovement.OnlyWhenNoObstacles);
                for (i = 0, l = neighborNodes.length; i < l; ++i) {
                    neighborNode = neighborNodes[i];
                    neighbors.push([neighborNode.x, neighborNode.y]);
                }
            }
            return neighbors;
        };
        return JPFMoveDiagonallyIfNoObstacles;
    }(PF.JumpPointFinderBase));
    PF.JPFMoveDiagonallyIfNoObstacles = JPFMoveDiagonallyIfNoObstacles;
    __reflect(JPFMoveDiagonallyIfNoObstacles.prototype, "PF.JPFMoveDiagonallyIfNoObstacles");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
/// <reference path="./JumpPointFinderBase.ts" />
var PF;
(function (PF) {
    var JPFNeverMoveDiagonally = /** @class */ (function (_super) {
        __extends(JPFNeverMoveDiagonally, _super);
        /**
         * Path finder using the Jump Point Search algorithm allowing only horizontal
         * or vertical movements.
         */
        function JPFNeverMoveDiagonally(options) {
            return _super.call(this, options) || this;
        }
        /**
         * Search recursively in the direction (parent -> child), stopping only when a
         * jump point is found.
         * @protected
         * @return {Array<Array<number>>} The x, y coordinate of the jump point
         *     found, or null if not found
         */
        JPFNeverMoveDiagonally.prototype._jump = function (x, y, px, py) {
            var grid = this.grid, dx = x - px, dy = y - py;
            if (!grid.isWalkableAt(x, y)) {
                return null;
            }
            if (this.trackJumpRecursion === true) {
                grid.getNodeAt(x, y).tested = true;
            }
            if (grid.getNodeAt(x, y) === this.endNode) {
                return [x, y];
            }
            if (dx !== 0) {
                if ((grid.isWalkableAt(x, y - 1) && !grid.isWalkableAt(x - dx, y - 1)) ||
                    (grid.isWalkableAt(x, y + 1) && !grid.isWalkableAt(x - dx, y + 1))) {
                    return [x, y];
                }
            }
            else if (dy !== 0) {
                if ((grid.isWalkableAt(x - 1, y) && !grid.isWalkableAt(x - 1, y - dy)) ||
                    (grid.isWalkableAt(x + 1, y) && !grid.isWalkableAt(x + 1, y - dy))) {
                    return [x, y];
                }
                //When moving vertically, must check for horizontal jump points
                if (this._jump(x + 1, y, x, y) || this._jump(x - 1, y, x, y)) {
                    return [x, y];
                }
            }
            else {
                throw new Error("Only horizontal and vertical movements are allowed");
            }
            return this._jump(x + dx, y + dy, x, y);
        };
        /**
         * Find the neighbors for the given node. If the node has a parent,
         * prune the neighbors based on the jump point search algorithm, otherwise
         * return all available neighbors.
         * @return {Array<Array<number>>} The neighbors found.
         */
        JPFNeverMoveDiagonally.prototype._findNeighbors = function (node) {
            var parent = node.parent, x = node.x, y = node.y, grid = this.grid, px, py, nx, ny, dx, dy, neighbors = [], neighborNodes, neighborNode, i, l;
            // directed pruning: can ignore most neighbors, unless forced.
            if (parent) {
                px = parent.x;
                py = parent.y;
                // get the normalized direction of travel
                dx = (x - px) / Math.max(Math.abs(x - px), 1);
                dy = (y - py) / Math.max(Math.abs(y - py), 1);
                if (dx !== 0) {
                    if (grid.isWalkableAt(x, y - 1)) {
                        neighbors.push([x, y - 1]);
                    }
                    if (grid.isWalkableAt(x, y + 1)) {
                        neighbors.push([x, y + 1]);
                    }
                    if (grid.isWalkableAt(x + dx, y)) {
                        neighbors.push([x + dx, y]);
                    }
                }
                else if (dy !== 0) {
                    if (grid.isWalkableAt(x - 1, y)) {
                        neighbors.push([x - 1, y]);
                    }
                    if (grid.isWalkableAt(x + 1, y)) {
                        neighbors.push([x + 1, y]);
                    }
                    if (grid.isWalkableAt(x, y + dy)) {
                        neighbors.push([x, y + dy]);
                    }
                }
            }
            else {
                neighborNodes = grid.getNeighbors(node, PF.DiagonalMovement.Never);
                for (i = 0, l = neighborNodes.length; i < l; ++i) {
                    neighborNode = neighborNodes[i];
                    neighbors.push([neighborNode.x, neighborNode.y]);
                }
            }
            return neighbors;
        };
        return JPFNeverMoveDiagonally;
    }(PF.JumpPointFinderBase));
    PF.JPFNeverMoveDiagonally = JPFNeverMoveDiagonally;
    __reflect(JPFNeverMoveDiagonally.prototype, "PF.JPFNeverMoveDiagonally");
})(PF || (PF = {}));
/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-11
*************************************************/
var PF;
(function (PF) {
    /**
     * Path finder using the Jump Point Search algorithm
     * @param {Object} options
     * @param {function} options.heuristic Heuristic function to estimate the distance
     *     (defaults to manhattan).
     * @param {DiagonalMovement} options.diagonalMovement Condition under which diagonal
     *      movement will be allowed.
     */
    function JumpPointFinder(options) {
        options = options || {};
        if (options.diagonalMovement === PF.DiagonalMovement.Never) {
            return new PF.JPFNeverMoveDiagonally(options);
        }
        else if (options.diagonalMovement === PF.DiagonalMovement.Always) {
            return new PF.JPFAlwaysMoveDiagonally(options);
        }
        else if (options.diagonalMovement === PF.DiagonalMovement.OnlyWhenNoObstacles) {
            return new PF.JPFMoveDiagonallyIfNoObstacles(options);
        }
        else {
            return new PF.JPFMoveDiagonallyIfAtMostOneObstacle(options);
        }
    }
    PF.JumpPointFinder = JumpPointFinder;
})(PF || (PF = {}));
