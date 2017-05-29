/**
 * 牌型
 * @author none
 *
 */
enum LDCardType {
    /** 错误类型 **/
    ERROR,
    /** 单牌类型 **/
    SINGLE,
    /** 对子类型 **/
    DOUBLE,
    /** 连对类型 **/
    EXPDOUBLE,
    /** 三张 **/
    THREE,
    /** 三带一 **/
    AAAB,
    /** 三带二 **/
    AAABB,
    /** 四带二 **/
    AAAABC,
    /** 顺子类型 **/
    STRAIGHT,
    /** 飞机类型 **/
    PLANE,
    /** 炸弹类型 **/
    FOUR,
    /** 王炸 **/
    KING
}