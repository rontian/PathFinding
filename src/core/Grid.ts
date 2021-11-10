/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
module PF {
    export class Grid {
        private $width: number;
        private $height: number;
        private $nodes: Array<Node[]>;
        constructor(width: number, height: number, matrix?: Array<Array<(number | boolean)>>)
        constructor(matrix: Array<Array<(number | boolean)>>)
        constructor(width_or_matrix: number | Array<Array<(number | boolean)>>, height?: number, matrix?: Array<Array<(number | boolean)>>) {
            let width: number;
            if (typeof width_or_matrix !== 'object') {
                width = width_or_matrix;
            } else {
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

        private buildNodes(width: number, height: number, matrix?: Array<Array<(number | boolean)>>): Array<Node[]> {
            let i: number, j: number,
                nodes = new Array<Node[]>(height);

            for (i = 0; i < height; ++i) {
                nodes[i] = new Array<Node>(width);
                for (j = 0; j < width; ++j) {
                    nodes[i][j] = new Node(j, i);
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
        }

        public getNodeAt(x: number, y: number): Node {
            return this.$nodes[y][x];
        }

        public isWalkableAt(x: number, y: number): boolean {
            return this.isInside(x, y) && this.$nodes[y][x].walkable;
        }

        public isInside(x: number, y: number): boolean {
            return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
        }

        public setWalkableAt(x: number, y: number, walkable: boolean): void {
            this.isInside(x, y) && (this.$nodes[y][x].walkable = walkable);
        }

        public getNeighbors(node: Node, diagonalMovement: DiagonalMovement): Node[] {
            let x = node.x,
                y = node.y,
                neighbors: Node[] = [],
                s0 = false, d0 = false,
                s1 = false, d1 = false,
                s2 = false, d2 = false,
                s3 = false, d3 = false,
                nodes = this.$nodes;

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

            if (diagonalMovement === DiagonalMovement.Never) {
                return neighbors;
            }

            if (diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
                d0 = s3 && s0;
                d1 = s0 && s1;
                d2 = s1 && s2;
                d3 = s2 && s3;
            } else if (diagonalMovement === DiagonalMovement.IfAtMostOneObstacle) {
                d0 = s3 || s0;
                d1 = s0 || s1;
                d2 = s1 || s2;
                d3 = s2 || s3;
            } else if (diagonalMovement === DiagonalMovement.Always) {
                d0 = true;
                d1 = true;
                d2 = true;
                d3 = true;
            } else {
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
        }

        public clone(): Grid {
            let i: number, j: number,
                width = this.width,
                height = this.height,
                thisNodes = this.$nodes,
                newGrid = new Grid(width, height);

            for (i = 0; i < height; ++i) {
                for (j = 0; j < width; ++j) {
                    newGrid.$nodes[i][j].walkable = thisNodes[i][j].walkable;
                }
            }

            return newGrid;
        }

        public get values() {
            let values: Array<number[]> = [];
            for (let y = 0; y < this.height; y++) {
                let arr = values[y] || []
                for (let x = 0; x < this.width; x++) {
                    arr[x] = this.isWalkableAt(x, y) ? 0 : 1;
                }
                values[y] = arr;
            }
            return values;
        }

        public get width() { return this.$width; }
        public get height() { return this.$height; }
    }
}