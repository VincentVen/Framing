/**
 * 游戏特效区域面板，负责游戏场的所有特效
 * @author none
 */
class GameEffectPanel extends how.module.View {
    public effectCards: Array<eui.Image> = [];//最后牌型牌列表
    public showCards: any = {};//亮牌动画列表
    public gameOverEffects: any = [];//结束动画对象列表
    public effectTips: Array<eui.Image> = [];//提示框列表
    public heguanIcon: eui.Image;//荷官图标
    public paopaoList = [];
    public jitters: Array<any> = [
        { x: 1, y: 2, rotation: 0 },
        { x: 1, y: 1, rotation: 1 },
        { x: -1, y: 1, rotation: -1 },
        { x: -3, y: -2, rotation: 0 },
        { x: 2, y: 1, rotation: -1 },
        { x: -1, y: -2, rotation: 1 },
        { x: 2, y: -1, rotation: 0 },
        { x: 1, y: -2, rotation: -1 }
    ];
    public constructor() {
        super();
        this.touchEnabled = this.touchChildren = false;
    }
    //删除某个表情
    public removePaopao(paopao): void {
        var index = this.paopaoList.indexOf(paopao);
        if (index != -1) {
            this.paopaoList.splice(index, 1);
            this.removeChild(paopao);
        }
    }
    //显示互动表情
    public playMagicFaceEffect(startPlayer: NewPlayerModule, endPlayer: NewPlayerModule, index: number): void {
        var startPoint: egret.Point = startPlayer.gui["headkuang"].localToGlobal(
            startPlayer.gui["headkuang"].width / 2,
            startPlayer.gui["headkuang"].height / 2);
        startPoint = this.globalToLocal(startPoint.x, startPoint.y);
        var endPoint: egret.Point = endPlayer.gui["headkuang"].localToGlobal(
            endPlayer.gui["headkuang"].width / 2,
            endPlayer.gui["headkuang"].height / 2);
        endPoint = this.globalToLocal(endPoint.x, endPoint.y);
        var magicFaceEffect: eui.Image = new eui.Image();
        magicFaceEffect.source = DataConfig.magicFaceData[index] + "_png";
        this.addChild(magicFaceEffect);
        this.paopaoList.push(magicFaceEffect);
        magicFaceEffect.x = startPoint.x - magicFaceEffect.width / 2;
        magicFaceEffect.y = startPoint.y - magicFaceEffect.height / 2;
        egret.Tween.get(magicFaceEffect).to({ x: endPoint.x - magicFaceEffect.width / 2, y: endPoint.y - magicFaceEffect.height / 2 }, 500)
            .call((magicFaceEffect) => {
                this.removePaopao(magicFaceEffect);
                var magicFaceAnimator: how.Animator = new how.Animator();
                magicFaceAnimator.source = DataConfig.magicFaceData[index];
                magicFaceAnimator.stopAndVisible = false;
                magicFaceAnimator.autoPlay = true;
                magicFaceAnimator.sourceGroup = "dzpk_magicFaceEffect";
                magicFaceAnimator.playOnce = true;
                magicFaceAnimator.defentAnimationName = "newAnimation";
                this.addChild(magicFaceAnimator);
                this.paopaoList.push(magicFaceAnimator);
                magicFaceAnimator.x = endPoint.x - magicFaceAnimator.width / 2;
                magicFaceAnimator.y = endPoint.y - magicFaceAnimator.height / 2;
                magicFaceAnimator.addHander(this.removePaopao, this, [magicFaceAnimator]);
            }, this, [magicFaceEffect]);
    }
    //显示聊天消息
    public addChatMassage(playerModule: NewPlayerModule, message: string): void {
        var startPoint: egret.Point = playerModule.gui["headkuang"].localToGlobal(
            playerModule.gui["headkuang"].width / 2,
            playerModule.gui["headkuang"].height / 2);
        startPoint = this.globalToLocal(startPoint.x, startPoint.y);
        var paopao = null;
        if (message.indexOf("[") == -1) {//判断是否是表情
            paopao = new Paopao();
            paopao.messageLabel.text = message;
            this.addChild(paopao);
            paopao.x = startPoint.x - paopao.width / 2;
            paopao.y = startPoint.y - paopao.height / 2 - playerModule.gui["headkuang"].height * 0.6;
        } else {
            message = message.substring(message.indexOf("[") + 1, message.indexOf("]"));
            paopao = new how.Animation();
            paopao.loop = true;
            paopao.frameRate = 150;
            paopao.width = 165;
            paopao.height = 165;
            paopao.frameNum = DataConfig.charFaceframeNums[message];
            paopao.animationSource = "faceEffect" + message + "_{0}_png";
            this.addChild(paopao);
            paopao.x = startPoint.x - paopao.width / 2;
            paopao.y = startPoint.y - paopao.height / 2;
        }
        this.paopaoList.push(paopao);
        egret.Tween.get(paopao).wait(2500).call(this.removePaopao, this, [paopao]);
    }
    //荷官打赏特效
    public playHeGuanTweens(startPlayer: NewPlayerModule, socer: number, heguanAnimator: how.Animator): void {
        heguanAnimator.play("kiss", 1);

    }
    public heatBack(startui: NewPlayerView, endui: eui.Group): void {
        how.SoundManager.playEffect("heguan_mp3");
        var heat = new eui.Image("heguanHeat_png");
        heat.x = endui.x + endui.width / 2 - 44;
        heat.y = endui.y + endui.height / 2 - 44;
        this.addChild(heat);
        egret.Tween.get(heat).to({ x: startui.x + startui.width / 2 - 44, y: startui.y + startui.height / 2 - 44 }, 500)
            .call(function () {
                this.removeChild(heat);
            }, this);
    }
    //播放发公共牌特效(移动牌)
    public playPublicCardEffect(publicCardsPanel: PublicCardsPanel, delay: number, index: number, heguanIcon: eui.Image): void {
        var startPoint = heguanIcon.localToGlobal(heguanIcon.width / 2, heguanIcon.height / 2);
        startPoint = this.globalToLocal(startPoint.x, startPoint.y + heguanIcon.height * 0.3);
        var targetCard: eui.Image = publicCardsPanel["card" + index];
        var endPoint: egret.Point = targetCard.localToGlobal(targetCard.width / 2, targetCard.height / 2);
        endPoint = this.globalToLocal(endPoint.x, endPoint.y);
        var effectCard: eui.Image = new eui.Image();
        effectCard.source = "card_0_png";
        effectCard.width = 24;
        effectCard.height = 31;
        effectCard.x = startPoint.x - effectCard.width / 2;
        effectCard.y = startPoint.y - effectCard.height / 2;
        this.addChild(effectCard);
        egret.Tween.get(effectCard).wait(delay).to(
            { x: endPoint.x, y: endPoint.y, width: targetCard.width, height: targetCard.height, rotation: 0 },
            200).call(this.playFanpaiEffect, this, [publicCardsPanel, effectCard, targetCard, endPoint, index]);
        if (index < 3) {
            how.SoundManager.playEffect("effect_fanpai_mp3");
        } else if (index == 3) {
            how.SoundManager.playEffect("effect_zhuanpai_mp3");
        } else if (index == 4) {
            how.SoundManager.playEffect("effect_hepai_mp3");
        }
    }
    //播放发牌特效(翻转)
    private playFanpaiEffect(publicCardsPanel: PublicCardsPanel, effectCard: eui.Image, targetCard: eui.Image, endPoint: egret.Point, index: number): void {
        var effectCardAnimation: how.Animation = new how.Animation();
        effectCardAnimation.loop = false;
        effectCardAnimation.frameRate = 60;
        effectCardAnimation.frameNum = 6;
        effectCardAnimation.width = targetCard.width;
        effectCardAnimation.height = targetCard.height;
        effectCardAnimation.x = endPoint.x - effectCardAnimation.width / 2;
        effectCardAnimation.y = endPoint.y - effectCardAnimation.height / 2;
        effectCardAnimation.animationSource = "effect_fanpai{0}_png";
        this.addChild(effectCardAnimation);
        effectCardAnimation.once(egret.Event.ENDED, () => {
            this.removeChild(effectCardAnimation);
            publicCardsPanel.showCardDataIndex(index);
        }, this);
        this.removeChild(effectCard);
    }
    //播放发手牌特效
    public playCardEffectNew(playerModule: NewPlayerModule, heguanIcon: eui.Image, cardIndex: number, playCardIndex: number, playerCount: number): void {
        var startPoint = heguanIcon.localToGlobal(heguanIcon.width / 2, heguanIcon.height / 2);
        startPoint = this.globalToLocal(startPoint.x, startPoint.y + heguanIcon.height * 0.3);
        var endPointUI: eui.Image = playerModule.isMyself() ? playerModule.gui["cardShow" + cardIndex] : playerModule.gui["card0"];
        var endPoint: egret.Point = endPointUI.localToGlobal(endPointUI.width / 2, endPointUI.height);
        endPoint = this.globalToLocal(endPoint.x - endPointUI.width / 2, endPoint.y - endPointUI.height / 2);
        var interval: number = 200;//发牌间隔
        var time = cardIndex == 0 ? playCardIndex * interval : playerCount * interval + playCardIndex * interval;
        var effectCard: eui.Image = new eui.Image();
        effectCard.source = "card_0_png";
        effectCard.width = 24;
        effectCard.height = 31;
        effectCard.x = startPoint.x - effectCard.width / 2;
        effectCard.y = startPoint.y - effectCard.height / 2;
        this.addChild(effectCard);
        egret.Tween.get(effectCard).wait(time).to(
            { x: endPoint.x, y: endPoint.y, rotation: endPointUI.rotation },
            300).call(this.onStartCardEffectCompleteNew, this, [playerModule, effectCard, cardIndex]);
        egret.Tween.get(this).wait(time).call(() => {
            how.SoundManager.playEffect("effect_fapai_mp3");
        });
    }
    //发牌特效播放完成（如果发给自己，那么还有个后续翻牌特效）
    private onStartCardEffectCompleteNew(playerModule: NewPlayerModule, effectCard: eui.Image, index: number): void {
        this.removeChild(effectCard);
        if (!playerModule.isMyself()) {//如果不是玩家自己
            if (playerModule.data) {
                // playerModule.gui["card0"].source = "card_0_png";
                playerModule.gui["card0"].visible = true;
            }
        }
        else {//后续还有一个翻牌特效
            playerModule.gui["cardShow" + index].visible = playerModule.data.cardData[index] != 0;
            playerModule.gui["cardShow" + index].source = "card_" + playerModule.data.cardData[index] + "_png";
        }
    }
    //玩家亮牌
    public showPlayerCard(playerModule: NewPlayerModule): void {
        if (playerModule.data) {
            playerModule.gui["card0"].visible = false;
            playerModule.gui["card1"].visible = false;
            var cardData = playerModule.data.cardData;
            for (var i = 0; i < playerModule.data.cardData.length; i++) {
                egret.Tween.get(this).wait(i * 150).call(this.playPlayerFanpaiEffect, this, [playerModule, i, cardData])
            }
        }
    }
    //翻转玩家手牌动画
    private playPlayerFanpaiEffect(playerModule: NewPlayerModule, index: number, cardData: Array<number>): void {
        if (playerModule.data) {
            var targetCard: eui.Image = playerModule.gui["cardShow" + index];
            if (targetCard) {
                var endPoint: egret.Point = targetCard.localToGlobal(targetCard.width / 2, targetCard.height / 2);
                endPoint = this.globalToLocal(endPoint.x, endPoint.y);
                var effectCardAnimation: how.Animation = new how.Animation();
                effectCardAnimation.loop = false;
                effectCardAnimation.frameRate = 60;
                effectCardAnimation.frameNum = 6;
                effectCardAnimation.width = targetCard.width;
                effectCardAnimation.height = targetCard.height;
                effectCardAnimation.x = endPoint.x - effectCardAnimation.width / 2;
                effectCardAnimation.y = endPoint.y - effectCardAnimation.height / 2;
                effectCardAnimation.animationSource = "effect_fanpai{0}_png";
                this.addChild(effectCardAnimation);
                effectCardAnimation.once(egret.Event.ENDED, () => {
                    this.removeChild(effectCardAnimation);
                    if (playerModule.data) {
                        this.showCards[playerModule.data.chairID + "" + index] = null;
                        if (playerModule.data) {
                            playerModule.gui["cardShow" + index].source = "card_" + cardData[index] + "_png";
                            playerModule.gui["cardShow" + index].visible = true;
                        }
                    }
                }, this);
            }
        }
    }
    //移动筹码到某个位置
    public moveChipsTo(startPointUI: eui.Image, endPointUI: eui.Image, num: number, type: number = 6): void {
        if (!AppData.getInstance().isGameHide) {
            var endPoint: egret.Point = endPointUI.localToGlobal(endPointUI.width / 2, endPointUI.height / 2);
            endPoint = this.globalToLocal(endPoint.x, endPoint.y);
            var startPoint: egret.Point = startPointUI.localToGlobal(startPointUI.width / 2, startPointUI.height / 2);
            startPoint = this.globalToLocal(startPoint.x, startPoint.y);
            var xdiff = Math.abs(endPoint.x - startPoint.x);// 计算两个点的横坐标之差
            var ydiff = Math.abs(endPoint.y - startPoint.y);// 计算两个点的纵坐标之差
            var distance = Math.ceil(Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5)) / 2;
            var time = distance < 300 ? 300 : distance;
            for (var i = 1; i <= type; i++) {
                var effectScore: eui.Image = new eui.Image();
                effectScore.source = "score" + i + "_png";
                effectScore.width = 32;
                effectScore.height = 33;
                this.addChild(effectScore);
                effectScore.x = startPoint.x - effectScore.width / 2;
                effectScore.y = startPoint.y - effectScore.height / 2;
                egret.Tween.get(effectScore)
                    .wait((i - 1) * 115)
                    .to({ x: endPoint.x - effectScore.width / 2, y: endPoint.y - effectScore.height / 2 }, time).call((effectScore) => {
                        this.removeChild(effectScore);
                    }, this, [effectScore]);
            }
        }
    }
    //播放玩家弃牌特效
    public showGiveupEffect(playerModule: NewPlayerModule): void {
        for (var i = 0; i < 2; i++) {
            var endPoint = this.heguanIcon.localToGlobal(this.heguanIcon.width / 2, this.heguanIcon.height);
            endPoint = this.globalToLocal(endPoint.x, endPoint.y + this.heguanIcon.height / 2);
            var startPointUI: eui.Image = playerModule.isMyself() ? playerModule.gui["cardShow" + i] : playerModule.gui["card" + i];
            var startPoint: egret.Point = startPointUI.localToGlobal(startPointUI.width / 2, startPointUI.height);
            startPoint = this.globalToLocal(startPoint.x - startPointUI.width / 2, startPoint.y - startPointUI.height / 2);
            var effectCard: eui.Image = new eui.Image();
            effectCard.source = "card_0_png";
            effectCard.width = startPointUI.width;
            effectCard.height = startPointUI.height;
            effectCard.scaleX = startPointUI.scaleX;
            effectCard.scaleY = startPointUI.scaleY;
            effectCard.rotation = startPointUI.rotation;
            effectCard.x = startPoint.x;
            effectCard.y = startPoint.y;
            this.addChild(effectCard);
            this.effectCards.push(effectCard);
            egret.Tween.get(effectCard).to({ x: endPoint.x, y: endPoint.y, scaleX: 0, scaleY: 0, rotation: startPointUI.rotation, alpha: 0 }, 500).call((_ => {
                var index = this.effectCards.indexOf(effectCard);
                if (index != -1) {
                    this.effectCards.splice(index, 1);
                    this.removeChild(effectCard);
                }
            }), this);
        }
    }
    //游戏结束显示牌型
    public onGameOverCardRight(publicCardsPanel: PublicCardsPanel, cardIndex: number, cardValue: number): void {
        var cardGroup: eui.Group = publicCardsPanel["cardGroup" + cardIndex];
        var effectCard: eui.Image = new eui.Image();
        effectCard.source = "card_" + cardValue + "_png";
        effectCard.width = publicCardsPanel["card" + cardIndex].width;
        effectCard.height = publicCardsPanel["card" + cardIndex].height;
        effectCard.horizontalCenter = cardGroup.horizontalCenter;
        effectCard.verticalCenter = cardGroup.verticalCenter;
        this.addChild(effectCard);
        this.effectCards.push(effectCard);
        var effectTip: eui.Image = new eui.Image();
        effectTip.source = "cardTypeTip2_png";
        effectTip.width = effectCard.width;
        effectTip.height = effectCard.height;
        effectTip.visible = false;
        this.addChild(effectTip);
        this.effectCards.push(effectTip);
        egret.Tween.get(effectCard).to({ verticalCenter: cardGroup.verticalCenter - 10 }, 200).call((effectTip: eui.Image, effectCard: eui.Image) => {
            effectTip.horizontalCenter = effectCard.horizontalCenter;
            effectTip.verticalCenter = effectCard.verticalCenter;
            effectTip.visible = true;
        }, effectCard, [effectTip, effectCard]);
    }
    //显示玩家输赢筹码数量
    public showGameEndScoreResultEffect(playerModule: NewPlayerModule): void {
        var head: eui.Image = playerModule.gui["head"]
        //赢筹码数量Label
        var chipValueLabel: eui.BitmapLabel = new eui.BitmapLabel();
        chipValueLabel.font = playerModule.data.getScoreCount >= 0 ? "gameOverVictoryFnt_fnt" : "gameOverCutFnt_fnt";
        var chipValueLabelText = base.Utils.formatCurrency(playerModule.data.getScoreCount);
        chipValueLabel.text = playerModule.data.getScoreCount >= 0 ? "+" + chipValueLabelText : chipValueLabelText;
        chipValueLabel.horizontalCenter = playerModule.gui.horizontalCenter;
        chipValueLabel.verticalCenter = playerModule.gui.verticalCenter;
        chipValueLabel.addEventListener(eui.UIEvent.RESIZE, () => {
            chipValueLabel.anchorOffsetX = chipValueLabel.width / 2;
        }, this);
        this.addChild(chipValueLabel);
        this.gameOverEffects.push(chipValueLabel);
        egret.Tween.get(chipValueLabel).to({ verticalCenter: playerModule.gui.verticalCenter - head.height * 0.95 }, 600);
    }
    //播放自己赢牌牌型超过葫芦牌型的动画
    public playCardTypeDaYuHuLuEffect(cardType: number): void {
        egret.Tween.get(this).wait(500).call((cardType) => {
            var cardTypeAnimator: how.Animator = new how.Animator();//牌型动画
            cardTypeAnimator.source = "cardTypeAnimator" + cardType;
            cardTypeAnimator.autoPlay = true;
            cardTypeAnimator.defentAnimationName = "newAnimation";
            cardTypeAnimator.playOnce = true;
            cardTypeAnimator.sourceGroup = "dzpk_gameEffect";
            cardTypeAnimator.stopAndVisible = true;
            cardTypeAnimator.horizontalCenter = 0;
            cardTypeAnimator.verticalCenter = 0;
            this.addChild(cardTypeAnimator);
            this.gameOverEffects.push(cardTypeAnimator);
        }, this, [cardType]);
    }
    //删除所有亮牌动画
    public removeAllShowCardsEffect() {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 2; j++) {
                if (this.showCards[i + "" + j]) {
                    if (this.contains(this.showCards[i + "" + j])) {
                        this.removeChild(this.showCards[i + "" + j]);
                    }
                    this.showCards[i + "" + j] = null;
                }
            }
        }
    }
    //清理最后牌型牌列表
    public cleanEffectCards(): void {
        for (var i = 0; i < this.effectCards.length; i++) {
            egret.Tween.removeTweens(this.effectCards[i]);
            this.removeChild(this.effectCards[i]);
        }
        this.effectCards = [];
        this.removeAllShowCardsEffect();
    }
    //清空提示框
    public cleanEffectTips() {
        for (var i = 0; i < this.effectTips.length; i++) {
            this.removeChild(this.effectTips[i]);
        }
        this.effectTips = [];
    }
    //清空结算动画
    public cleanGameOverEffects() {
        for (var i = 0; i < this.gameOverEffects.length; i++) {
            this.removeChild(this.gameOverEffects[i]);
        }
        this.gameOverEffects = [];
    }
}
