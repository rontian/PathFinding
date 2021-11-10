/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
module PF {
    export class Util {
        /**根据父记录回溯并返回路径。
        （包括起始节点和结束节点） */
        public static backtrace(node: Node): Array<number[]> {
            let paths = [[node.x, node.y]];
            while (node.parent) {
                node = node.parent;
                paths.push([node.x, node.y]);
            }
            return paths.reverse();
        }

        /**
            从起始节点和结束节点回溯，并返回路径。
            （包括起始节点和结束节点） */
        public static biBacktrace(nodeA: Node, nodeB: Node): Array<number[]> {
            let pathA = this.backtrace(nodeA),
                pathB = this.backtrace(nodeB);
            return pathA.concat(pathB.reverse());
        }

        /**
         * 计算路径的长度。
         */
        public static pathLength(paths: Array<number[]>): number {
            let i: number, sum: number = 0, a: number[], b: number[], dx: number, dy: number;
            for (i = 1; i < paths.length; ++i) {
                a = paths[i - 1];
                b = paths[i];
                dx = a[0] - b[0];
                dy = a[1] - b[1];
                sum += Math.sqrt(dx * dx + dy * dy);
            }
            return sum;
        }

        /**给定压缩路径，返回包含所有段的新路径
            在它的插值。 */
        public static expandPath(paths: Array<number[]>): Array<number[]> {
            let expanded: Array<number[]> = [],
                len = paths.length,
                coord0: number[], coord1: number[],
                interpolated: Array<number[]>,
                interpolatedLen: number,
                i: number, j: number;

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
        }

        /**给定起始坐标和结束坐标，返回所有坐标
            在这些坐标形成的直线上，基于Bresenham算法。 */
        public static interpolate(x0: number, y0: number, x1: number, y1: number): Array<number[]> {
            let abs = Math.abs,
                line: Array<number[]> = [],
                sx: number, sy: number, dx: number, dy: number, err: number, e2: number;

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
        }
    }
}