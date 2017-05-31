/**
 * 牌型判断逻辑
 * @author none
 *
 */
class CardValue {
    public type: LDCardType;//牌面类型
    public value: number;//牌面的最小点数
    public number: number;//牌面的长度
    public abcd: number;//翅膀个数（1:单张 2：对子 3：三条……）
}
class DLCardLogic extends CardLogic {
    public constructor() {
        super();
    }
    /** 根据牌值排序，从大到小，大小王 2 A …… **/
    public SortByCardData(cardList: number[]): void {
        var self: DLCardLogic = this;
        cardList.sort((left, right) => {
            var leftVale = self.getExpCardValue(left);
            var rightVale = self.getExpCardValue(right);
            if (leftVale > rightVale) {
                return -1;
            }
            else if (leftVale < rightVale) {
                return 1;
            }
            else {
                if (self.getCardColor(left) > self.getCardColor(right)) {
                    return -1;
                } else {
                    return 1;
                }
            }
        });
    }
    /**A 2 大小王的处理 */
    public getExpCardValue(card: number): number {
        var color = this.getCardColor(card), value = this.getCardValue(card);
        //大小王
        if (color == 4) {
            value = 64 + value;
        } else if (value == 1 || value == 2) {
            value = 13 + value;
        }
        return value;
    }
    /**判断大小王 */
    public isKing(card: number): boolean {
        if (this.getCardColor(card) == 4) {
            return true;
        }
        return false;
    }
    /**
     * 获取牌型
     */
    public getCardInfo(cardList: number[]): CardValue {
        var cardInfo = new CardValue();
        cardInfo.type = LDCardType.ERROR;
        cardInfo.value = 0;
        cardInfo.number = 0;
        cardInfo.abcd = 0;
        //非法牌面
        if (!this.checkLegal(cardList)) {
            return cardInfo;
        }
        //判断类型
        switch (cardList.length) {
            case 1:
                this.getSingleType(cardList[0], cardInfo);
                break;
            case 2:
                this.getDoubleType(cardList, cardInfo);
                if (cardInfo.type == LDCardType.ERROR) {
                    this.getKingType(cardList, cardInfo);
                }
                break;
            case 3:
                this.getThreeType(cardList, cardInfo);
                break;
            case 4:
                this.getFourType(cardList, cardInfo);
                if (cardInfo.type == LDCardType.ERROR) {
                    this.getAAABType(cardList, cardInfo);
                }
                break;
            default://三带二 连四 四带二(对) 连对 飞机 顺子
                var types: Object = this.findSame(cardList);
                this.getAAABBType(types, cardInfo);
                if (cardInfo.type == LDCardType.ERROR) {
                    this.getAAAABCType(types, cardInfo);
                }
                if (cardInfo.type == LDCardType.ERROR) {
                    this.getAABBCCType(types, cardInfo);
                }
                if (cardInfo.type == LDCardType.ERROR) {
                    this.getPlaneType(types, cardInfo);
                }
                if (cardInfo.type == LDCardType.ERROR) {
                    this.getStraightType(types, cardInfo);
                }
                break;
        }
        return cardInfo;
    }
    /**
     * 检查牌面是否有非法数据：1、出现相同牌
     */
    private checkLegal(cardList: number[]): boolean {
        for (var i = 0, len = cardList.length; i < len; i++) {
            var card = cardList[i];
            for (var j = i + 1; j < len; j++) {
                if (card == cardList[j]) {
                    return false;
                }
            }
        }
        return true;
    }
    private getSingleType(value: number, cardValue: CardValue) {
        cardValue.type = LDCardType.SINGLE;
        cardValue.number = 1;
        cardValue.value = this.getExpCardValue(value);
        cardValue.abcd = 0;
    }
    /** 对子类型 **/
    private getDoubleType(cardList: number[], cardValue: CardValue) {
        var value = this.getExpCardValue(cardList[0]);
        if (value == this.getExpCardValue(cardList[1])) {
            cardValue.type = LDCardType.DOUBLE;
            cardValue.value = value;
            cardValue.number = 1;
            cardValue.abcd = 0;
        }
    }
    /** 王炸 **/
    private getKingType(cardList: number[], cardValue: CardValue) {
        var color1 = this.getCardColor(cardList[0]), color2 = this.getCardColor(cardList[1]);
        if (color1 == color2 && color1 == 4) {
            cardValue.type = LDCardType.KING;
            cardValue.value = this.getExpCardValue(cardList[0]);
            cardValue.number = 1;
            cardValue.abcd = 0;
        }
    }
    /** 三张 **/
    private getThreeType(cardList: number[], cardValue: CardValue) {
        var value = this.getExpCardValue(cardList[0]);
        if (value == this.getExpCardValue(cardList[1]) && value == this.getExpCardValue(cardList[2])) {
            cardValue.type = LDCardType.THREE;
            cardValue.value = value;
            cardValue.number = 1;
            cardValue.abcd = 0;
        }
    }
    /** 炸弹*/
    private getFourType(cardList: number[], cardValue: CardValue) {
        var value = this.getExpCardValue(cardList[0]);
        if (value == this.getExpCardValue(cardList[1]) && value == this.getExpCardValue(cardList[2]) && value == this.getExpCardValue(cardList[3])) {
            cardValue.type = LDCardType.FOUR;
            cardValue.value = value;
            cardValue.number = 1;
        }
    }
    /**三带一 */
    private getAAABType(cardList: number[], cardValue: CardValue) {
        var types: Object = this.findSame(cardList), keyNumber: number = 0, threeArray: Array<number> = [], aArray: Array<number> = [];
        for (var i in types) {
            if (types[i] == 3) {
                threeArray.push(parseInt(i));
            } else if (types[i] == 1) {
                aArray.push(parseInt(i));
            }
            keyNumber++;
        }
        if (keyNumber == 2 && threeArray.length == 1 && aArray.length == 1) {
            cardValue.type = LDCardType.AAAB;
            cardValue.value = threeArray[0];
            cardValue.number = 1;
            cardValue.abcd = 1;
        }
    }
    /**三带二 */
    private getAAABBType(types: Object, cardValue: CardValue) {
        var threeArray: Array<number> = [], twoArray: Array<number> = [], keyNumber: number = 0;
        for (var key in types) {
            if (types[key] == 3) {
                threeArray.push(parseInt(key));
            } else if (types[key] == 2) {
                twoArray.push(parseInt(key));
            }
            keyNumber++;
        }
        if (twoArray.length == 1 && twoArray.length == 1 && keyNumber == 2) {
            cardValue.type = LDCardType.AAABB;
            cardValue.value = threeArray[0];
            cardValue.number = 1;
            cardValue.abcd = 2;
        }
    }
    /**四带二 四连*/
    private getAAAABCType(types: Object, cardValue: CardValue) {
        var fourArray: Array<number> = [], abArray: Array<number> = [], fourNumber: number = 0, abNumber: number = 0;
        for (var key in types) {
            if (types[key] == 4) {
                fourArray.push(parseInt(key));
                fourNumber++;
            } else {
                abArray.push(types[key]);
                abNumber++;
            }
        }
        //连四带二 四连带翼
        var fourFlag = this.checkStraight(fourArray), sameFlag = this.checkSameType(abArray);
        if (abNumber == 0) {//连四没带翅膀
            if (fourNumber > 1 && fourFlag) {
                cardValue.type = LDCardType.AAAABC;
                cardValue.value = fourArray[0];
                cardValue.number = fourNumber;
                cardValue.abcd = 0;
            }
        } else {//带翅膀
            var temp: number = 0, abcd: number = 0;
            if (abNumber == fourNumber * 2) {//
                temp = abNumber;
                abcd = abArray[0];
            } else {
                for (var i = 0, len = abArray.length; i < len; i++) {
                    temp += abArray[i];
                    abcd = 1;
                }
            }
            if (temp == 2 * fourNumber && sameFlag && fourFlag) {
                cardValue.type = LDCardType.AAAABC;
                cardValue.value = fourArray[0];
                cardValue.number = fourNumber;
                cardValue.abcd = abcd;
            }
        }
    }
    /**连对 */
    private getAABBCCType(types: Object, cardValue: CardValue) {
        var pairArray: Array<number> = [], abcArray: Array<number> = [], keyNumber: number = 0;
        for (var key in types) {
            pairArray.push(parseInt(key));
            abcArray.push(types[key]);
            keyNumber++;
        }
        if (this.checkStraight(pairArray) && this.checkSameType(abcArray) && abcArray[0] == 2 && keyNumber > 2) {
            cardValue.type = LDCardType.EXPDOUBLE;
            cardValue.value = pairArray[0];
            cardValue.number = keyNumber;
            cardValue.abcd = 0;
        }
    }
    /**飞机 */
    private getPlaneType(types: Object, cardValue: CardValue) {
        var threeArray: Array<number> = [], abcArray: Array<number> = [], keyNumber: number = 0, abcNumber: number = 0;
        for (var key in types) {
            if (types[key] == 3) {
                threeArray.push(parseInt(key));
                keyNumber++;
            } else {
                abcArray.push(types[key]);
                abcNumber += types[key];
            }
        }
        if (this.checkStraight(threeArray) && this.checkSameType(abcArray) && keyNumber > 1 &&
            (keyNumber == abcArray.length || keyNumber == abcNumber || abcArray.length == 0)) {
            cardValue.type = LDCardType.PLANE;
            cardValue.value = threeArray[0];
            cardValue.number = keyNumber;
            cardValue.abcd = abcArray.length == 0 ? 0 : (abcNumber == keyNumber ? 1 : 2);
        }
    }
    /**顺子 */
    private getStraightType(types: Object, cardValue: CardValue) {
        var straightArray: Array<number> = [], keyNumber: number = 0;
        for (var key in types) {
            if (types[key] == 1) {
                straightArray.push(parseInt(key));
            } else {
                return;
            }
            keyNumber++;
        }
        if (this.checkStraight(straightArray) && keyNumber > 4) {
            cardValue.type = LDCardType.STRAIGHT;
            cardValue.value = straightArray[0];
            cardValue.number = keyNumber;
            cardValue.abcd = 0;
        }
    }
    /**检查是不是顺子 */
    public checkStraight(lines: Array<number>): boolean {
        lines.sort(function (a, b) {
            if (a > b) {
                return -1;
            } else {
                return 1;
            }
        });
        var temp = lines[0]
        if (temp >= 15) return false;
        for (var i = 1, len = lines.length; i < len; i++) {
            if (--temp != lines[i]) {
                return false;
            }
        }
        return true;
    }
    /**检查是不是同一类型 */
    private checkSameType(types: Array<number>): boolean {
        var temp = types[0];
        for (var i = 1, len = types.length; i < len; i++) {
            if (temp != types[i]) return false;
        }
        return true;
    }
    /** 查找相同牌 **/
    private findSame(cardList: number[]): Object {
        var result: Object = {};
        var cardData: number[] = this.changeTOValue(cardList);
        for (var i: number = 0, len = cardData.length; i < len; i++) {
            var card: number = cardData[i];
            if (result[card]) {
                result[card]++;
            } else {
                result[card] = 1;
            }
        }
        return result;
    }
    /**转换成数字，以及排序 */
    private changeTOValue(cardList: number[]): number[] {
        var array: number[] = [];
        for (var i = 0, len = cardList.length; i < len; i++) {
            array.push(this.getExpCardValue(cardList[i]));
        }
        array.sort((left, right) => {
            if (left > right) {
                return -1;
            } else if (left < right) {
                return 1;
            } else {
                return 0;
            }
        });
        return array;
    }
}
