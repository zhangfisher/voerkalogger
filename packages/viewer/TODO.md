# future

- bug react-ui 不省略 antd 也能暗黑模式切换

# 任务

- 屏幕是竖屏特别窄的时候侧边栏变成一个按钮可打开抽屉与关闭而不是一直停留在页面上
- api mock 操作
- log to indexDB
- log debug or not
- 实现拼音搜索 根据 GB2312 汉字区位码获取汉字拼音的工具类
- 地图的设备不能标记在非地图之外
- 地图亮灯淡入淡出动画

# done

## 20241105 星期二
- 屏幕很小的时候显示侧边栏打开而不是三栏布局

## 20240926 星期四

- NodeMapShow 的时候,使用侧边 Sider 或弹窗用来切换节点地图
- 显示信标设备的接入数量 targets

## 20240920 星期五

- 暗黑模式下 message 等无法主题化
- 暗黑模式与主题切换

## 20240913 星期五

- config onchange to change mqtt
- lock
- lock 不直接设置密码
- lock 可不 disabled
- 配置不带有 vite.voerka 字样

## 20240912 星期四

- 实时事件的分页表格

## 20240906 星期五

- 树卡顿
- baseURL 为 / 的解决

## 20240903

- 地图图片分辨率和宽高正确(目前好像太大了) 看能不能缩小一点
- 1.不要登录页面
- setting token 校验
- mqtt 自动重试逻辑(好像本身就有)
- 左右分栏的抽象.可以移动分栏的宽度 sash !!!
- 6:table 高度显示不正常
- 5:layout 缩起来有个 0
- 2.设置之后提交自动回首页

## 20240831

-
- 4:layout 无法正确监听到 width 变更(shift 的时候)
- 7 title 与 icon 的切换
- 3.控制台显示版本
- 每日详情 breakpoint
- 字符 truncate
- 气泡框
- without token redirect
- sash
- 全屏 float

## 20240830

- 树节点可移动(仅尝试)
- 设置需要登录才能进入
- 数字变换加点动画
- 独立部分抽象组件

## 20240829

- Suspense lazy 批量使用
- Suspense lazy
- 实时告警数据的获取与渲染
- network 断开提醒(目前这个就是调用 api 其实拔网线不会检查出来)
- mqtt 错误链接才 notification.

## 20240828

- 配置页存储 设置
- table 占据剩余百分百的空间,
- 搜索时 tree 的 key 应该正常展开 实际上就是处理 expandedkeys
- 让这个 tree 超过屏幕可以滚动,滚动正常

## 20240827

- 删除地图需要更新树(force) 并让 selectedNode 重新被选择,从而导致 map 渲染关闭
- 上传地图需要更新树(force) 并让 selectedNode 重新被选择(),从而导致 map 渲染 目前是直接删除 selected
- 树的 icon 正确显示 使用 VoerkaIcon
- 上传不保存历史图片 fileLIst 等于空即可

## done

- 设备亮灯需要过滤 id
- 右键菜单在 feature 上是删除
- 数据改变对接修改 icon
- 添加设备并正确显示
