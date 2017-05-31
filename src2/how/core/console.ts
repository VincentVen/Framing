/**
 * 快捷的打印消息到控制台
 * @param message {any} 要打印的数据
 */
function trace(message: any): string {
    if (!GameConfig.useConsoleLog) {
        return;
    }
    var msg: any = message;
    if (msg instanceof egret.Rectangle) {
        msg = "{ x=" + msg.x + ",y=" + msg.y + ",width=" + msg.width + ",height=" + msg.height + " }";
    }
    else if (msg instanceof egret.Point) {
        msg = "{ x=" + msg.x + ",y=" + msg.y + " }";
    }
    else if (Array.isArray(msg)) {
        console.log(msg);
    }
    else if (typeof (message) == "object") {
        try {
            console.log(JSON.stringify(msg));
        }
        catch (e) {
            console.log(msg);
        }
    }
    else {
        console.log(msg);
    }
    return msg;
}
/**
* 快捷的抛错误消息到控制台
* @param error {any} 要抛出的错误
*/
function error(error: any): string {
    if (!GameConfig.useConsoleLog) {
        return;
    }
    console.error(error);
    return error;
}
/**
 * 快捷的抛出警告消息到控制台
 */
function warn(warn: any): string {
    if (!GameConfig.useConsoleLog) {
        return;
    }
    console.warn(warn);
    return warn;
}