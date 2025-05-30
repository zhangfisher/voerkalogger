# 通话

采用 react + typescript + peerjs + vite 进行通话配置的开发

代码架构大概包括
- CallingManager 类
  - 通话状态管理 
  - 通话配置管理
    - peer实例的配置
    - 通话配置
      - 通话
      - 通话
    
  - 负责整体的通话管理
    - 即 peerjs 的创建 更新与销毁
    - calling 实例(即每一通通话)的创建与更新与销毁, 
    - 当路由发生变化时,自动判断是否需要销毁当前通话,
    - 当通话销毁,自动退出通话页回到首页
- Calling 类 负责具体每一通通话的管理,
- UI相关
  - 呼入通知 CallInView
  - 呼出界面 CallOutView
  - 呼叫中界面 CallingView
  - 配置页 CallingManager 

我已经写了一些代码了,请你更新并完善他
请给我完整的代码
主要帮我
