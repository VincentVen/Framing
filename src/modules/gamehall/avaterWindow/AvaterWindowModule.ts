/**
 * 头像窗口模块
 * @author none
 *
 */
class AvaterWindowModule extends how.module.WindowModule {
    public static response: any = {
        onChangeUserInfoResult: CMDConfig.GET_CHANGEPERSONALDATA,//修改玩家信息,
    }
    public static request: any = {
        onSaveButton: "onSaveButton"
    }
    private wFaceID: number;
    private sex: number;
    public constructor(guiClass: any = null, dataClass: any = null) {
        super(guiClass, dataClass);
    }
    //按下保存按钮
    public onSaveButton(sex: number, wFaceID: number): void {
        this.sex = sex;
        this.wFaceID = wFaceID;
        this.hallSocket.send(CMDConfig.SEND_CHANGEPERSONALDATA, {
            faceID: wFaceID,
            sex: sex
        });//修改性别
    }
    //修改成功
    public onChangeUserInfoResult(data: any) {
        if (data.code == 0) {
            how.Banner.show(LanguageConfig.editUserInfoSucess);
            AppData.getInstance().userData.avatar = this.wFaceID;
            AppData.getInstance().userData.gender = this.sex;
            //通知大厅修改头像
            this.communicate(MainSceneModule.response.updateHeader);
        }
    }
}
