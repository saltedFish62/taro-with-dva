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
