import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View, Text } from '@tarojs/components';
import { connect } from "@tarojs/redux-h5";
import './index.scss';

@connect(({ index }) => ({
  ...index
}))
class Index extends Taro.Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: '首页'
  };

  add() {
    const { dispatch } = this.props;
    dispatch({
      type: 'index/asyncAdd'
    });
  }

  render() {
    const { count } = this.props;
    return <View className="index" onClick={this.add}>
        <Text>{count}</Text>
      </View>;
  }
}
export default Index;