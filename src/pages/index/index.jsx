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

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

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