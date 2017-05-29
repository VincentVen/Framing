module how {
	/**
	 * how组件工具类
	 * @author none
	 *
	 */
    export class ComponentUtils {

        /**
         * how组件工具类，提供批量初始化组件功能
         */
        public constructor() {
        }
        /**
         * 初始化how组件
         */
        public static init(txtFlag: boolean, alertSkin: string, dialogSkin: string, bannerSkin: string, noticeSkin: string, loaddingSkin: string,
            announcementSkin: string, settingSkin: string, callBack?: () => void, thisObject: any = null): void {
            if (!how.HowMain.themeTogether) {
                var resourceLoader: ResourceLoader = new ResourceLoader();
                resourceLoader.loadGroups([alertSkin, dialogSkin, bannerSkin, noticeSkin, loaddingSkin], () => {
                    Alert.init(alertSkin, txtFlag);
                    Dialog.init(dialogSkin, txtFlag);
                    Banner.init(bannerSkin);
                    Loadding.init(loaddingSkin);
                    SettingWindow.initSkin(settingSkin);
                    if (callBack)
                        callBack.apply(thisObject);
                }, thisObject);
            }
            else {
                Alert.init(alertSkin, txtFlag);
                Dialog.init(dialogSkin, txtFlag);
                Banner.init(bannerSkin);
                Loadding.init(loaddingSkin);
                SettingWindow.initSkin(settingSkin);
                if (callBack)
                    callBack.apply(thisObject);
            }
        }
    }
}
