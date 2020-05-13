const delay = () => new Promise(resolve => setTimeout(resolve, 1000))

export default {
  namespace: 'index',
  state: {
    count: 1,
  },
  effects: {
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