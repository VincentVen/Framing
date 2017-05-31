# HowEngineForEgret `基于egret引擎`

使用之前请[点击这里](http://192.168.18.202:3000/How/HowEngineForEgret/wiki/%E5%BA%93%E9%85%8D%E7%BD%AE%E8%AF%B4%E6%98%8E)阅读配置说明

配合我们公司`杭州米趣`开发的Wing插件可以加快开发效率[下载地址](http://192.168.18.202:3000/download/HowPlugin_1.0.4.zip)

## 概述

#### API帮助文档

[点击这里](http://192.168.18.202:3000/doc/how/)

#### How插件使用帮助

Ctrl+Shift+P命令面板输入help查看用法...

How插件快捷键：

* Alt+C：复制Exml文件中的组件ID到粘贴板（来源官方）
* Alt+G：创建get/set
* Alt+F：创建方法
* Alt+M：创建模块
* Alt+.：静态属性代码提示
* Alt+E：上移选中代码
* Alt+D：下移选中代码
* Ctrl+Shift+C：单星号注释
* Ctrl+L：转至指定行
* Alt+J：检查当前文档Json格式
* Ctrl+J：格式化选中的Json文本
* Alt+B：集成化研发平台的BugList转git的说明文档
* Alt+T：翻译选中项
* Alt+P：发布项目
* Ctrl+回车：编辑当前Json和导入Excel到Json

其他功能：

* 自动检查保存的Json格式

`注：发布项目必须使用此插件，因为会自动把readme.md的版本记录打包成html给测试同事观看，而且还支持多渠道、图片压缩功能`

#### 为什么开发这个模块系统

游戏的开发模式是基于MVC设计模式的模块化开发。modules模块也是基于MVC设计模式而开发的。使用MVC设计模式有松耦合，易于维护，功能模块划分十分清晰。每个模块都有独立的视图层、模型层及控制层，这也带来了技术成本增加和开发效率降低。

#### 模块系统介绍

Data和View是相互独立的没有互相引用，只有Module有Data和View的引用。所以Module用来“指挥”Data和View来“干活”。Module里面封装了callData和callUI来通知数据和界面更新其内容，也可以通过this.data和this.gui直接引用来执行更高级的功能。Module还负责和服务端的交互，View想推送数据是禁止直接调用网络层单例来发送数据的，也禁止存在网络层回调监听。Data也是类似。所以加入了“报告”功能，View可以通过this.report方法通知Module来做事情，但是Module默认情况是拒绝View“报告”的，如果要响应此“报告”，必须在Module里面加上名为request的静态属性的any类型对象作为报告配置。例：{onSendLogin:”sendLogin”}。其中onSendLogin是Module中的方法，sendLogin是通知的类型，view只需要 this.report(“sendLogin”) 即可。同时，为了方便的响应全局事件，加入了和报告类似的response，配置对象的属性值代表事件类型。
#### 全局模块

游戏中用到的全局监听和一些其他的对应功能的全局方法都可以写到全局模块，全局模块需要在Main.ts里面初始化。

#### 通用组件

框架中封装了Alert、Diaglog、Banner、Notice这4个弹窗。有如下功能

* Alert：只带一个确定按钮的弹窗
* Dialog：带确定和取消按钮的弹窗
* Banner：一定时间后自动消失的弹窗
* Notice：公告弹窗，内部文字会滚动

#### 关键字解释

* Data：数据模型层，负责数据解析、数据获取等。类似于项目组中的程序员。
* View：界面视图层，负责游戏的界面逻辑。类似于项目组中的设计师。
* Module：模块控制层，负责数据分发和通知界面数据更新，统筹数据和界面，并和服务器（类似合作方）沟通。类似项目组中的项目经理。

#### 类库说明

* Application：应用类，提供初始化应用、切换场景、打开窗口、关闭应用等和应用本身相关的功能。是一个工具类。

* console：控制台，封装了trace和error这2个全局方法。因为打印日志是使用非常频繁的需求，所以为了更快速的使用，封装出了这2个方法。

* DisplayUtils：显示对象工具类，提供了创建扇形等一些和显示对象相关的功能。

* HowMain：游戏入口的基类，封装了游戏启动时的载入进度等所有游戏都用得到的功能。游戏主类现在十分精简。

* md5：md5加密类。

* SoundUtils：声音工具类。提供背景音乐的控制、特效音乐的控制等功能。

* StringUtils：字符串工具类。提供去空格等实用的和字符串相关的功能。

* component：自定义控件。这个文件夹里面有丰富的自定义控件。比如按下就能自动缩放的按钮、带图标的选项卡。（注：布局的时候，全部使用这里面的控件。）

* net：网络。包括http请求和websocket请求的封装。2者都是单例，使用十分方便。

* event：事件。封装了一个全局的事件管理器。使用十分广泛，比如多个模块之间的通讯、消息获取等。

* module.core：模块控制层。封装了所有的控制层相关的类，其中SceneModule、WindowModule继承自Module，具有相应的特殊行为。

* module.core.IBehaviour：行为接口。类似unity脚本，实现此接口的都具有start、update、onDestroy等行为，可以方便的进行开发，比如省去界面类里面获取创建完成、移除舞台、帧刷新等事件监听。

* module.view：模块视图层。封装了常用的场景、窗口、面板这3个界面，这3个界面都具有IBehaviour行为。

* module.Data：模块模型层。封装了一个数据类，用来处理数据。

* behaviour：行为树系统。默认提供了很多行为动作。每个行为动作都有详细的注释。

## 版本历史

#### 1.0.0.1版本

* 新增强类型的3个模块类，TModule、TSceneModule、TWindowModule，原先的三个模块类~~Module~~、~~SceneModule~~、~~WindowModule~~不推荐使用
* 完成首个成熟版