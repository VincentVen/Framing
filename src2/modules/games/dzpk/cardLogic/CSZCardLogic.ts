/**
 * 牌型判断逻辑
 * @author none
 *
 */
class CSZCardLogic extends CardLogic {
    public constructor() {
        super();
    }
    public getCardType(cards: number[]): number[] {
        var cardTypes: number[] = [];
        //大于21
        if ((this.getCardValue(cards[0]) + this.getCardValue(cards[1]) + this.getCardValue(cards[2])) > 21) {
            cardTypes.push(0);
        }
        //小于21
        if ((this.getCardValue(cards[0]) + this.getCardValue(cards[1]) + this.getCardValue(cards[2])) < 21) {
            cardTypes.push(1);
        }
        //等于21
        if ((this.getCardValue(cards[0]) + this.getCardValue(cards[1]) + this.getCardValue(cards[2])) == 21) {
            cardTypes.push(2);
        }
        //纯黑
        if ((this.getCardColor(cards[0]) == 1 || this.getCardColor(cards[0]) == 3)
            && (this.getCardColor(cards[1]) == 1 || this.getCardColor(cards[1]) == 3)
            && (this.getCardColor(cards[2]) == 1 || this.getCardColor(cards[2]) == 3)) {
            cardTypes.push(3);
        }
        //纯红
        if ((this.getCardColor(cards[0]) == 0 || this.getCardColor(cards[0]) == 2)
            && (this.getCardColor(cards[1]) == 0 || this.getCardColor(cards[1]) == 2)
            && (this.getCardColor(cards[2]) == 0 || this.getCardColor(cards[2]) == 2)) {
            cardTypes.push(4);
        }
        //豹子
        if (this.getCardValue(cards[0]) == this.getCardValue(cards[1]) && this.getCardValue(cards[0]) == this.getCardValue(cards[2])) {
            cardTypes.push(6);
        }
        //同花
        if (this.getCardColor(cards[0]) == this.getCardColor(cards[1]) && this.getCardColor(cards[0]) == this.getCardColor(cards[2])) {
            cardTypes.push(5);
            this.SortByValue(cards);
            //同花顺
            if (cards[0] - 1 == cards[1] && cards[1] - 1 == cards[2]) {
                cardTypes.push(7);
            }
        }
        return cardTypes;
    }
}
