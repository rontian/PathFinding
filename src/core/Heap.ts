/*************************************************
/* @author : rontian
/* @email  : i@ronpad.com
/* @date   : 2021-11-10
*************************************************/
module PF {
    export type TCompare<T = any> = (a: T, b: T) => number;
    /**有序数组 */
    export class Heap<T> {
        private $nodes: T[];
        private $compare: TCompare<T>;
        constructor(compareFunc?: TCompare<T>) {
            this.$compare = compareFunc || <any>defaultCmp;
            this.$nodes = [];
        }

        public push(n: T): T {
            return Heap.push(this.$nodes, n, this.$compare);
        }

        public pop(): T {
            return Heap.pop(this.$nodes, this.$compare);
        }

        public peek(): T {
            return this.$nodes[0];
        }

        public contains(n: T): boolean {
            return this.$nodes.indexOf(n) !== -1;
        }

        public replace(n: T): T {
            return Heap.replace(this.$nodes, n, this.$compare);
        }

        public pushpop(n: T): T {
            return Heap.pushpop(this.$nodes, n, this.$compare);
        }

        public ify(): T[] {
            return Heap.ify(this.$nodes, this.$compare);
        }

        public updateItem(n: T): T {
            return Heap.updateItem(this.$nodes, n, this.$compare);
        }

        public clear(): void {
            this.$nodes.length = 0;
        }

        public empty(): boolean {
            return this.$nodes.length === 0;
        }

        public size(): number {
            return this.$nodes.length;
        }

        public clone(): Heap<T> {
            let heap = new Heap<T>(this.$compare);
            heap.$nodes = this.$nodes.slice(0);
            return heap;
        }

        public toArray(): T[] {
            return this.$nodes.slice(0);
        }

        public static push<T>(array: T[], item: T, cmp?: TCompare): T {
            if (cmp == null) {
                cmp = defaultCmp;
            }
            array.push(item);
            return _siftdown(array, 0, array.length - 1, cmp);
        }

        public static pop<T>(array: T[], cmp?: TCompare): T {
            let lastelt: T, returnitem: T;
            if (cmp == null) {
                cmp = defaultCmp;
            }
            lastelt = array.pop();
            if (array.length) {
                returnitem = array[0];
                array[0] = lastelt;
                _siftup(array, 0, cmp);
            } else {
                returnitem = lastelt;
            }
            return returnitem;
        }

        public static replace<T>(array: T[], item: T, cmp?: TCompare): T {
            let returnitem: T;
            if (cmp == null) {
                cmp = defaultCmp;
            }
            returnitem = array[0];
            array[0] = item;
            _siftup(array, 0, cmp);
            return returnitem;
        }

        public static pushpop<T>(array: T[], item: T, cmp?: TCompare): T {
            let _ref: T[];
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
        }

        public static ify<T>(array: T[], cmp?: TCompare): T[] {
            let i: number, _i: number, _j: number, _len: number, _ref: number, _ref1: number[], _results: T[], _results1: number[];
            if (cmp == null) {
                cmp = defaultCmp;
            }
            _ref1 = (function () {
                _results1 = [];
                for (let _j = 0, _ref = Math.floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--) { _results1.push(_j); }
                return _results1;
            }).apply(this).reverse();
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                i = _ref1[_i];
                _results.push(_siftup(array, i, cmp));
            }
            return _results;
        }

        public static updateItem<T>(array: T[], item: T, cmp?: TCompare): T {
            let pos: number;
            if (cmp == null) {
                cmp = defaultCmp;
            }
            pos = array.indexOf(item);
            if (pos === -1) {
                return;
            }
            _siftdown(array, 0, pos, cmp);
            return _siftup(array, pos, cmp);
        }

        /**查找数据集中最大的n个元素。 */
        public static nlargest<T>(array: T[], n: number, cmp?: TCompare): T[] {
            let item: T, results: T[], i: number, len: number, refs: T[];
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
        }

        /**查找数据集中最小的n个元素。 */
        public static nsmallest<T>(array: T[], n: number, cmp?: TCompare): T[] {
            let item: T, los: T, temps: T[], i: number, j: number, len: number, refs: T[], index: number, results: T[];
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
        }
    }

    function defaultCmp(x: number, y: number): number {
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    }

    function _siftdown<T>(array: T[], startpos: number, pos: number, cmp?: TCompare): T {
        var newitem: T, parent: T, parentpos: number;
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
    };

    function _siftup<T>(array: T[], pos: number, cmp?: TCompare): T {
        let childpos: number, endpos: number, newitem: T, rightpos: number, startpos: number;
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

    function insort<T>(a: T[], x: any, lo?: number, hi?: number, cmp?: TCompare): T {
        let mid: number;
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
            } else {
                lo = mid + 1;
            }
        }
        return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
    }
}