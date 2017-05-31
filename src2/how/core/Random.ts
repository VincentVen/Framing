module how {
    /**
     * 线性同余随机数生成器，因为js提供的api不支持种子，所以为了匹配Unity，另写一套
     * @author none
     */
    export class Random {
        /**
         * 创建一个随机数生成器
         */
        public constructor(seed: number) {
            this.seed = seed;
            if (!this.seed && this.seed != 0) {
                this.seed = new Date().getTime();
            }
        }
        /**
         * 设置用于随机数生成器的种子，如果不设置则实际是取当前时间毫秒数
         */
        public seed: number;
        /**
         * 返回一个随机数，在0.0～1.0之间
         */
        public get value(): number {
            return this.range(0, 1);
        }
        /**
         * 返回半径为1的圆内的一个随机点
         */
        public get insideUnitCircle(): egret.Point {
            var randomAngle: number = this.range(0, 360);
            var randomDis: number = this.range(0, 1);
            var randomX: number = randomDis * Math.cos(randomAngle * Math.PI / 180);
            var randomY: number = randomDis * Math.sin(randomAngle * Math.PI / 180);
            return new egret.Point(randomX, randomY);
        }
        /**
         * 返回半径为1的圆边的一个随机点
         */
        public get onUnitCircle(): egret.Point {
            var randomAngle: number = this.range(0, 360);
            var randomX: number = Math.cos(randomAngle * Math.PI / 180);
            var randomY: number = Math.sin(randomAngle * Math.PI / 180);
            return new egret.Point(randomX, randomY);
        }
        /**
         * 返回一个在min和max之间的随机浮点数
         */
        public range(min: number, max: number): number {
            if (!this.seed && this.seed != 0) {
                this.seed = new Date().getTime();
            }
            max = max || 1;
            min = min || 0;
            this.seed = (this.seed * 9301 + 49297) % 233280;
            var rnd = this.seed / 233280.0;
            return min + rnd * (max - min);
        }
        /**
         * 设置用于随机数生成器的种子，如果不设置则实际是取当前时间毫秒数
         */
        public static seed: number;
        /**
         * 返回一个随机数，在0.0～1.0之间
         */
        public static get value(): number {
            return this.range(0, 1);
        }
        /**
         * 返回半径为1的圆内的一个随机点
         */
        public static get insideUnitCircle(): egret.Point {
            var randomAngle: number = this.range(0, 360);
            var randomDis: number = this.range(0, 1);
            var randomX: number = randomDis * Math.cos(randomAngle * Math.PI / 180);
            var randomY: number = randomDis * Math.sin(randomAngle * Math.PI / 180);
            return new egret.Point(randomX, randomY);
        }
        /**
         * 返回半径为1的圆边的一个随机点
         */
        public static get onUnitCircle(): egret.Point {
            var randomAngle: number = this.range(0, 360);
            var randomX: number = Math.cos(randomAngle * Math.PI / 180);
            var randomY: number = Math.sin(randomAngle * Math.PI / 180);
            return new egret.Point(randomX, randomY);
        }
        /**
         * 返回一个在min和max之间的随机浮点数
         */
        public static range(min: number, max: number): number {
            if (!this.seed && this.seed != 0) {
                this.seed = new Date().getTime();
            }
            max = max || 1;
            min = min || 0;
            this.seed = (this.seed * 9301 + 49297) % 233280;
            var rnd = this.seed / 233280.0;
            return min + rnd * (max - min);
        }
    }
}