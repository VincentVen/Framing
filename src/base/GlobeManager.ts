/**存放游戏全局数据 */
class GlobeManager {
	private static _globeManager: GlobeManager = new GlobeManager();
	public static getInstant(): GlobeManager {
		return this._globeManager;
	}
	public constructor() {
	}
	/**初始化皮肤
	 * 弹出框 确认框
	 */
	public initModulesSkin(data:Object){
		for(var i in data){

		}
	}
}