/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
module PF {
    export class Node {
        public x: number;
        public y: number;
        public f: number = 0;
        public g: number = 0;
        public h: number = 0;
        public opened: boolean | number;
        public closed: boolean;
        public tested: boolean;
        public walkable: boolean;
        public parent: Node;
        public by: number;
        public retainCount: number;
        constructor(x: number, y: number, walkable: boolean = true) {
            this.x = x;
            this.y = y;
            this.walkable = walkable;
        }
    }
}