/**
 * 我方牌控制
 */
class LDCardManager extends DLCardLogic {
    public constructor() {
        super();
    }
    /**检查两列牌的大小
     * 如果list1>list1, 返回cardInfo1;否则,返回cardInfo1.type = LDCardType.ERROR
     */
    public checkBigger(list1: Array<number>, list2: Array<number>): CardValue {
        var cardInfo1: CardValue = this.getCardInfo(list1), cardInfo2: CardValue = this.getCardInfo(list2);
        var value: boolean = false;
        //同类型
        if (cardInfo1.type == cardInfo1.type && cardInfo1.number == cardInfo2.number
            && cardInfo1.value > cardInfo2.value && cardInfo1.abcd == cardInfo2.abcd) {
        } else if (cardInfo2.type == LDCardType.KING) {
            cardInfo1.type = LDCardType.ERROR;
        } else if (cardInfo1.type == LDCardType.KING) {
        } else if (cardInfo1.type == LDCardType.FOUR) {
        } else {
            cardInfo1.type = LDCardType.ERROR;
        }
        return cardInfo1;
    }
    /***************************************提示**********************************************/
    public getTipCards(cardsList: Array<number>, pList: Array<number>): Array<Array<number>> {
        var list = this.setGroupInfo(cardsList), list1: CardValue = this.getCardInfo(pList);
        var tipList: Array<Array<number>> = [];
        if (list1.type == LDCardType.KING) {//王炸
            return [];
        } else if (pList.length == 0) {
            return this.objChangeArray(list);
        } else {
            switch (list1.type) {
                case LDCardType.SINGLE:
                    tipList = this.getSingleList(list, list1);
                    break;
                case LDCardType.DOUBLE:
                    tipList = this.getDoubleList(list, list1);
                    break;
                case LDCardType.THREE:
                    if (cardsList.length > 3) {
                        tipList = this.getThreeList(list, list1);
                    }
                    break;
                case LDCardType.AAAB:
                    if (cardsList.length > 4)
                        tipList = this.getAAABList(list, list1);
                    break;
                case LDCardType.AAABB:
                    if (cardsList.length > 5)
                        tipList = this.getAAABBList(list, list1);
                    break;
                case LDCardType.FOUR:
                    if (cardsList.length > 4)
                        tipList = this.getFourList(list, list1);
                    break;
                case LDCardType.AAAABC:
                    if (cardsList.length > 4)
                        tipList = this.getAAAABCList(list, list1);
                    break;
                case LDCardType.EXPDOUBLE:
                    if (cardsList.length > 6)
                        tipList = this.getExpDoubleList(list, list1);
                    break;
                case LDCardType.STRAIGHT:
                    if (cardsList.length > 5)
                        tipList = this.getStraightList(list, list1);
                    break;
                case LDCardType.PLANE:
                    if (cardsList.length > 6)
                        tipList = this.getPlaneList(list, list1);
                    break;
            }
            if (list["-1"]) {
                tipList.push(list["-1"]);
            }
            return tipList;
        }
    }
    private getSingleList(list: Object, info: CardValue): Array<Array<number>> {
        var temp: Array<Array<number>> = [], temp1: Array<Array<number>> = [], temp2: Array<Array<number>> = [];
        var value = info.value;
        for (var key in list) {
            if (parseInt(key) > value) {
                var array: Array<number> = list[key], len = array.length;
                if (len == 1) {
                    temp.push(array);
                } else if (len == 4) {
                    temp1.push([array[0]]);
                    temp2.push(array);
                } else {
                    temp1.push([array[0]]);
                }
            }
            else if (list[key].length == 4) {
                temp2.push(list[key]);
            }
        }
        Array.prototype.push.apply(temp, temp1);
        Array.prototype.push.apply(temp, temp2);
        return temp;
    }
    private getDoubleList(list: Object, info: CardValue): Array<Array<number>> {
        var temp: Array<Array<number>> = [], temp1: Array<Array<number>> = [], temp2: Array<Array<number>> = [];
        var value = info.value;
        for (var key in list) {
            if (parseInt(key) > value) {
                var array: Array<number> = list[key], len = array.length;
                if (len == 2) {
                    temp.push(array);
                } else if (len == 4) {
                    temp1.push([array[0], array[1]]);
                    temp2.push(array);
                } else if (len > 2) {
                    temp1.push([array[0], array[1]]);
                }
            }
            else if (list[key].length == 4) {
                temp2.push(list[key]);
            }
        }
        Array.prototype.push.apply(temp, temp1);
        Array.prototype.push.apply(temp, temp2);
        return temp;
    }
    private getThreeList(list: Object, info: CardValue): Array<Array<number>> {
        var temp: Array<Array<number>> = [], temp1: Array<Array<number>> = [], temp2: Array<Array<number>> = [];
        var value = info.value;
        for (var key in list) {
            if (parseInt(key) > value) {
                var array: Array<number> = list[key], len = array.length;
                if (len == 3) {
                    temp.push(array);
                } else if (len == 4) {
                    temp1.push([array[0], array[1], array[2]]);
                    temp2.push(array);
                }
            }
            else if (list[key].length == 4) {
                temp2.push(list[key]);
            }
        }
        Array.prototype.push.apply(temp, temp1);
        Array.prototype.push.apply(temp, temp2);
        return temp;
    }
    private getAAABList(list: Object, info: CardValue): Array<Array<number>> {
        var temp: Array<Array<number>> = [], temp1: Array<Array<number>> = [], temp2: Array<Array<number>> = [];
        var value = info.value;
        var single: Array<number> = [], double: Array<number> = [];
        for (var key in list) {
            var array: Array<number> = list[key], len = array.length;
            if (parseInt(key) > value) {
                if (len == 3) {
                    temp.push(array);
                } else if (len == 4) {
                    temp1.push([array[0], array[1], array[2]]);
                    temp2.push(array);
                }
            } else if (list[key].length == 4) {
                temp2.push(list[key]);
            }
            if (len == 1) {
                single.push(array[0]);
            } else {
                double.push(array[0]);
            }
        }
        Array.prototype.push.apply(temp, temp1);
        if (temp.length > 0) {
            if (single.length > 0) {
                for (var i = 0, len = temp.length; i < len; i++) {
                    temp[i].push(single[0]);
                }
            } else if (double.length > 0) {
                for (var i = 0, len = temp.length; i < len; i++) {
                    var flag = true;
                    for (var n = 0, len1 = double.length; n < len1; n++) {
                        if (this.getExpCardValue(double[n]) != this.getExpCardValue(temp[i][0])) {
                            flag = false;
                            temp[i].push(double[n]);
                            break;
                        }
                    }
                    if (flag) {
                        temp.splice(i, 1);
                        i--;
                        len--;
                    }
                }
            } else {
                temp = [];
            }
        }
        Array.prototype.push.apply(temp, temp2);
        return temp;
    }
    private getAAABBList(list: Object, info: CardValue): Array<Array<number>> {
        var temp: Array<Array<number>> = [], temp1: Array<Array<number>> = [], temp2: Array<Array<number>> = [];
        var value = info.value;
        var double: Array<Array<number>> = [], three: Array<Array<number>> = [];
        for (var key in list) {
            var array: Array<number> = list[key], len = array.length;
            if (parseInt(key) > value) {
                if (len == 3) {
                    temp.push(array);
                } else if (len == 4) {
                    temp1.push([array[0], array[1], array[2]]);
                    temp2.push(array);
                }
            } else if (list[key].length == 4) {
                temp2.push(list[key]);
            }
            if (len == 2) {
                double.push(array);
            } else if (len > 2) {
                three.push([array[0], array[1]]);
            }
        }
        Array.prototype.push.apply(temp, temp1);
        if (temp.length > 0) {
            if (double.length > 0) {
                for (var i = 0, len = temp.length; i < len; i++) {
                    Array.prototype.push.apply(temp[i], double[0]);
                }
            } else if (three.length > 0) {
                for (var i = 0, len1 = temp.length; i < len1; i++) {
                    var flag = true;
                    for (var n = 0, len2 = three.length; n < len2; n++) {
                        if (this.getExpCardValue(three[n][0]) != this.getExpCardValue(temp[i][0])) {
                            flag = false;
                            Array.prototype.push.apply(temp[i], three[n]);
                            break;
                        }
                    }
                    if (flag) {
                        temp.splice(i, 1);
                        i--;
                        len--;
                    }
                }
            } else {
                temp = [];
            }
        }
        Array.prototype.push.apply(temp, temp2);
        return temp;
    }
    private getFourList(list: Object, info: CardValue): Array<Array<number>> {
        var temp: Array<Array<number>> = [], temp1: Array<Array<number>> = [], temp2: Array<Array<number>> = [];
        for (var key in list) {
            if (parseInt(key) > info.value) {
                var array: Array<number> = list[key];
                if (array.length == 4) {
                    temp.push(array);
                }
            }
        }
        return temp;
    }
    private getStraightList(list: Object, info: CardValue): Array<Array<number>> {
        var temp: Array<Array<number>> = [], temp1: Array<number> = [], keyList: Array<number> = [], temp2: Array<Array<number>> = [];
        var value = info.value - info.number + 1;
        for (var key in list) {
            if (parseInt(key) > value) {
                keyList.push(parseInt(key));
                temp1.push(list[key][0]);
            }
            if (list[key].length == 4) {
                temp2.push(list[key]);
            }
        }
        var num = info.number, tempArray = this.checkStraightList(keyList, num);
        if (tempArray.length > 0) {
            for (var i = 0, len = tempArray.length; i < len; i++) {
                temp.push(temp1.slice(tempArray[i], tempArray[i] + num));
            }
        }
        Array.prototype.push.apply(temp, temp2);
        return temp;
    }
    private getExpDoubleList(list: Object, info: CardValue): Array<Array<number>> {
        var temp: Array<Array<number>> = [], temp1: Array<Array<number>> = [], temp2: Array<Array<number>> = [], straightList: Array<number> = [];
        var value = info.value - info.number + 1;
        for (var key in list) {
            if (parseInt(key) > value) {
                var array: Array<number> = list[key];
                if (array.length >= 2) {
                    temp2.push([array[0], array[1]]);
                    straightList.push(parseInt(key));
                }
            }
            if (list[key].length == 4) {
                temp1.push(list[key]);
            }
        }
        var num = info.number, tempArray = this.checkStraightList(straightList, num);
        if (tempArray.length > 0) {
            for (var i = 0, len = tempArray.length; i < len; i++) {
                var expArray: Array<number> = [];
                for (var ni = 0; ni < num; ni++) {
                    Array.prototype.push.apply(expArray, temp2[tempArray[i] + ni]);
                }
                temp.push(expArray);
            }
        }
        Array.prototype.push.apply(temp, temp1);
        return temp;
    }
    private getPlaneList(list: Object, info: CardValue): Array<Array<number>> {
        var temp: Array<Array<number>> = [], keyList: Array<number> = [],
            temp1: Array<Array<number>> = [], temp2: Array<Array<number>> = [];
        var value = info.value - info.number + 1, single: Array<number> = [],
            double: Array<Array<number>> = [], three: Array<Array<number>> = [];
        var planeList: Array<Array<number>> = [];
        for (var key in list) {//数据分类
            var array: Array<number> = list[key], len = array.length;
            if (parseInt(key) > value) {
                if (len == 3) {
                    temp.push(array);
                    keyList.push(parseInt(key));
                } else if (len == 4) {
                    temp1.push([array[0], array[1], array[2]]);
                    keyList.push(parseInt(key));
                }
            }
            if (list[key].length == 4) {
                temp2.push(list[key]);
            }
            if (len == 1) {
                single.push(list[key]);
            } else if (len == 2) {
                double.push(list[key]);
            } else {
                three.push(list[key]);
            }
        }
        Array.prototype.push.apply(temp, temp1);
        var abc = info.abcd, infoNumber = info.number, abcList: Array<number> = [];
        var valueList: Array<number> = this.checkStraightList(keyList, infoNumber);
        if (valueList.length > 0) {
            if (abc == 1) {
                //合并元素  
                for (var sdi = 0, sdlen = double.length; sdi < sdlen; sdi++) {
                    Array.prototype.push.apply(single, double[sdi]);
                }
                for (var thi = 0, thlen = three.length; thi < thlen; thi++) {
                    Array.prototype.push.apply(single, three[sdi]);
                }
                //查找翅膀
                for (var flyi = 0, flyLen = valueList.length; flyi < flyLen; flyi++) {
                    var flyList: Array<number> = this.getSingleFlyList(keyList.slice(flyi, flyi + infoNumber), single, 1);
                    if (flyList.length > 0) {
                        var plane: Array<number> = [];
                        for (var pi = 0; pi < infoNumber; pi++) {
                            Array.prototype.push.apply(plane, temp[flyi + pi]);
                        }
                        Array.prototype.push.apply(plane, flyList);
                        planeList.push(plane);
                    }
                }
            } else if (abc == 2) {
                //合并元素  
                for (var thi = 0, thlen = three.length; thi < thlen; thi++) {
                    double.push([three[thi][0], three[thi][1]]);
                }
                //查找翅膀
                for (var flyi = 0, flyLen = valueList.length; flyi < flyLen; flyi++) {
                    var flyList: Array<number> = this.getDoubleFlyList(keyList.slice(flyi, flyi + infoNumber), double, 1);
                    if (flyList.length > 0) {
                        var plane: Array<number> = [];
                        for (var pi = 0; pi < infoNumber; pi++) {
                            Array.prototype.push.apply(plane, temp[flyi + pi]);
                        }
                        Array.prototype.push.apply(plane, flyList);
                        planeList.push(plane);
                    }
                }
            }
        }
        //合并炸弹
        Array.prototype.push.apply(planeList, temp2);
        return planeList;
    }
    private getAAAABCList(list: Object, info: CardValue): Array<Array<number>> {
        var temp: Array<Array<number>> = [], temp1: Array<Array<number>> = [], value = info.value;
        var single: Array<number> = [], double: Array<Array<number>> = [], three: Array<Array<number>> = [];
        var fourKey: Array<number> = [], aaaaList: Array<Array<number>> = [];
        for (var key in list) {
            var array: Array<number> = list[key], len = array.length;
            if (parseInt(key) > value) {
                if (len == 4) {
                    temp.push(array);
                    temp1.push(array);
                    fourKey.push(parseInt(key));
                }
            }
            if (len == 1) {
                single.push(array[0]);
            } else if (len == 2) {
                double.push(array);
            } else {
                three.push(array);
            }
        }
        var abc = info.abcd, infoNumber = info.number, abcList: Array<number> = [];
        var valueList: Array<number> = this.checkStraightList(fourKey, infoNumber);
        if (valueList.length > 0) {
            if (abc == 1) {
                //合并元素  
                for (var sdi = 0, sdlen = double.length; sdi < sdlen; sdi++) {
                    Array.prototype.push.apply(single, double[sdi]);
                }
                for (var thi = 0, thlen = three.length; thi < thlen; thi++) {
                    Array.prototype.push.apply(single, three[sdi]);
                }
                //查找翅膀
                for (var flyi = 0, flyLen = valueList.length; flyi < flyLen; flyi++) {
                    var flyList: Array<number> = this.getSingleFlyList(fourKey.slice(flyi, flyi + infoNumber), single, 2);
                    if (flyList.length > 0) {
                        var aaaa: Array<number> = [];
                        for (var pi = 0; pi < infoNumber; pi++) {
                            Array.prototype.push.apply(aaaa, temp1[pi + flyi]);
                        }
                        Array.prototype.push.apply(aaaa, flyList);
                        aaaaList.push(aaaa);
                    }
                }
            } else if (abc == 2) {
                //合并元素  
                for (var thi = 0, thlen = three.length; thi < thlen; thi++) {
                    double.push([three[thi][0], three[thi][1]]);
                }
                //查找翅膀
                for (var flyi = 0, flyLen = valueList.length; flyi < flyLen; flyi++) {
                    var flyList: Array<number> = this.getDoubleFlyList(fourKey.slice(flyi, flyi + infoNumber), double, 2);
                    if (flyList.length > 0) {
                        var plane: Array<number> = [];
                        for (var pi = 0; pi < infoNumber; pi++) {
                            Array.prototype.push.apply(plane, temp1[pi + flyi]);
                        }
                        Array.prototype.push.apply(plane, flyList);
                        aaaaList.push(plane);
                    }
                }
            } else if (abc == 3) {
                //查找翅膀
                for (var flyi = 0, flyLen = valueList.length; flyi < flyLen; flyi++) {
                    var flyList: Array<number> = this.getDoubleFlyList(fourKey.slice(flyi, flyi + infoNumber), three, 2);
                    if (flyList.length > 0) {
                        var plane: Array<number> = [];
                        for (var pi = 0; pi < infoNumber; pi++) {
                            Array.prototype.push.apply(plane, temp1[pi + flyi]);
                        }
                        Array.prototype.push.apply(plane, flyList);
                        aaaaList.push(plane);
                    }
                }
            }
        }
        Array.prototype.push.apply(aaaaList, temp);
        return aaaaList;
    }
    /*查找牌里连续len张数的牌 */
    private checkStraightList(list: Array<number>, len: number): Array<number> {
        var array: Array<number> = [];
        for (var i = 0, lLen = list.length - len; i <= lLen; i++) {
            if (this.checkStraight(list.slice(i, i + len))) {
                array.push(i);
            }
        }
        return array;
    }
    /**查找翅膀 
     * time:每个翅膀有多少个
    */
    private getSingleFlyList(valueList: Array<number>, list: Array<number>, time: number): Array<number> {
        var len = valueList.length * time, temp: Array<number> = [];
        for (var i = 0; temp.length < len; i++) {
            if (list.length <= i) {
                return [];
            }
            if (valueList.indexOf(this.getExpCardValue(list[i])) < 0) {
                temp.push(list[i]);
            }
        }
        return temp;
    }
    private getDoubleFlyList(valueList: Array<number>, list: Array<Array<number>>, time: number): Array<number> {
        var len = valueList.length * time, temp: Array<number> = [];
        for (var i = 0, tt = 0; tt < len; i++) {
            if (list.length <= i) {
                return [];
            }
            if (valueList.indexOf(this.getExpCardValue(list[i][0])) < 0) {
                Array.prototype.push.apply(temp, list[i]);
                tt++;
            }
        }
        return temp;
    }
    /****************************************托管**********************************************/
    public getAutoCards(cardsList: Array<number>, pList: Array<number>) {
        this.SortByCardData(cardsList);//从大到小排列
        if (pList.length == 0) {
            return this.getMinCards(cardsList);
        } else {
            return this.getMinPCard(cardsList, pList);
        }
    }
    /**
     * 自由出牌，获取最小牌 
     * 结果只会出现：单张 对子 三张 炸弹 王对
    */
    public getMinCards(list: Array<number>): Array<number> {
        var len = list.length, cardList: Array<number> = [list[len - 1]],
            value = this.getExpCardValue(list[len - 1]), flag = this.isKing(list[len - 1]);
        for (var i = len - 2; i < len; i++) {
            if (this.getExpCardValue(list[i]) == value) {
                cardList.push(list[i]);
            } else if (flag && this.isKing(list[i])) {
                cardList.push(list[i]);
            } else {
                break;
            }
        }
        return cardList;
    }
    public getMinPCard(cardsList: Array<number>, pList: Array<number>): Array<number> {
        var cardList: Array<Array<number>> = this.getTipCards(cardsList, pList);;
        return cardList.length == 0 ? [] : cardList[0];
    }
    /***********************************分组****************************************/
    private setGroupInfo(cardsList: Array<number>): Object {
        var result: Object = {}, kingFlag: number = 0;;
        for (var i: number = 0, len = cardsList.length; i < len; i++) {
            var card: number = this.getExpCardValue(cardsList[i]);
            if (result[card]) {
                result[card].push(cardsList[i]);
            } else {
                result[card] = [cardsList[i]];
            }
            if (card > 64) {
                kingFlag++;
            }
        }
        if (kingFlag == 2) {
            result["-1"] = [0x4E, 0x4F];
        }
        return result;
    }
    private objChangeArray(obj: Object): Array<any> {
        var array: Array<any> = [];
        for (var key in obj) {
            array.push(obj[key]);
        }
        return array;
    }
}