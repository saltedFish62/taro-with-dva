## Taro + dva

### 介绍

搭建一个 Taro 和 dva 结合的框架。

之前写微信小程序都是使用原生的来写，非常繁琐。有一次接触到了 AntD Pro，其中集成了dvajs，船新的 redux 写法让我耳目一新，所以来试试把 dva 和 Taro 结合起来。

#### dva

github地址：[dvajs/dva](https://github.com/dvajs/dva)

#### Taro

github地址：[NervJS/taro](https://github.com/NervJS/taro)

### 创建 Taro 应用

##### 安装 Taro 开发工具

```shell
$ npm install -g @tarojs/cli
$ yarn global add @tarojs/cli
```

##### 创建项目模板

```shell
$ taro init myApp
```

进入 myApp 目录，可以看到 <code>project.config.json</code>，这是与小程序有关的一些设置：

```json
{
	"miniprogramRoot": "dist/",
	"projectname": "myApp",
	"description": "",
	"appid": "touristappid",
	"setting": {
		"urlCheck": true,
		"es6": false,
		"postcss": false,
		"minified": false
	},
	"compileType": "miniprogram",
	"simulatorType": "wechat",
	"simulatorPluginLibVersion": {},
	"condition": {}
}
```

`miniprogramRoot`: 小程序编译之后的根目录，使用微信开发者工具预览时，会从该目录下读取项目。

`appid`: 在公众平台可以获取到 appId。

`setting`: 对应于开发者工具的本地设置。

执行以下指令将项目编译成微信小程序：

```shell
$ npm run dev:weapp
```

然后在微信开发者工具导入项目，目录为项目根目录。

##### 安装 dva

```shell
$ npm i --save dva-core
$ npm i --save dva-core dva-loading // 还可以加上 dva-loading 插件
```

##### 安装redux

```shell
$ npm i --save redux @tarojs/redux @tarojs/redux-h5
```

##### 引入 dva

在 `/src/utils/` 目录下创建 dva.js。不添加插件，创建一个最简单的 dva 应用。

```js
import { create } from 'dva-core'
import models from '../models'

/**
 * 创建 dva 应用
 * 
 * @param opt
 */
function createApp(opt = {}) {
  // 创建应用
  const app = create(opt)

  // 注册 model
  if (app._models.length != models.length + 1) {
    models.forEach(it => app.model(it))
  }

  // 启动应用
  app.start()

  app.use({
    onError: (err) => {
      console.error(err)
    }
  })

  // 定义返回 store 的接口
  app.getStore = () => app._store

  return app
}

export {
  createApp,
}

```

修改 `/src/app.jsx` 如下：

```js
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'  // 引入redux的Provider
import Index from './pages/index'

import './app.scss'

// 创建 dva 应用
import { createApp } from './utils/dva'
const dvaApp = createApp({})
const store = dvaApp.getStore()

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

```

创建目录 `/src/models/` ，并在该目录下创建文件 `index.js`：

```js
import index from '../index/model'

export default [
  index,
]
```

收集所有页面的 model ，组合成数组导出，方便创建 dva 应用时插入 model。接着在 `/src/pages/index/` 下创建 `model.js` ：

```js
const delay = () => new Promise(resolve => setTimeout(resolve, 1000))

export default {
  namespace: 'index',
  state: {
    count: 1,
  },
  effects: {
    // 模拟异步过程
    * asyncAdd(_, { call, put }) {
      yield call(delay)
      yield put({
        type: 'add',
        payload: {
          num: 1
        }
      })
    }
  },
  reducers: {
    add(state, { payload: { num } }) {
      return {
        state,
        count: state.count + num
      }
    }
  }
}
```

在 `/src/index/index.jsx` 中，将组件连接到redux：

```js
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import './index.scss'

@connect(
  ({ index }) => ({
    ...index
  }))
class Index extends Component {
  constructor(props) {
    super(props)
    this.add = this.add.bind(this)
  }
  
  config = {
    navigationBarTitleText: '首页'
  }

  add() {
    const { dispatch } = this.props
    dispatch({
      type: 'index/asyncAdd',
    })
  }

  render() {
    const { count } = this.props
    return (
      <View className='index' onClick={this.add}>
        <Text>{count}</Text>
      </View>
    )
  }
}
export default Index
```

在终端输入 `npm run dev:weapp` 编译并预览。至此就成功引入 dva 了。

