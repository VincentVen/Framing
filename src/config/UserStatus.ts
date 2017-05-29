/**
 * 用户状态枚举
 * @author none
 *
 */
enum UserStatus {
    /**
	 * 离开
	 */
	NULL = 0,
	/**
	 * 站立
	 */
	FREE = 1,
	/**
	 * 坐下
	 */
	SIT = 2,
	/**
	 * 准备
	 */
	READY = 3,
	/**
	 * 旁观
	 */
	LOOKON = 4,
	/**
	 * 游戏
	 */
	PLAY = 5,
	/**
	 * 断线
	 */
	OFFLINE = 6,
	/**
	 * 比赛
	 */
	MATCH = 7,
    /**
	 * 托管
	 */
	COLLOCTAION = 8,
	/**
	* 匹配状态
	*/
	PIPEI = 9,
	/**
	 * 等待配桌
	 */
	WAITDISTRIBUTION = 16,
	/**
	 * 弃牌
	 */
	QIPAI = 11
}
