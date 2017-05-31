
class TEBCardManager {
	public constructor() {
	}
	public getCardTypeByData(list: Array<number>): number {
		if (list.length != 2) return -1;
		var temp = list[0], temp1 = list[1];
		if ((temp == 2 && temp1 == 8) || (temp == 8 && temp1 == 2)) {
			return 20;//二八杠
		} else if (temp == temp1) {
			return 20 + temp;//对子 21-30
		} else if (temp == 10 || temp1 == 10) {
			return temp1 + temp;//点半 11-19
		} else {
			return (temp + temp1) % 10;//0-9
		}
	}
}