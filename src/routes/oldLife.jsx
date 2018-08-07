import React, { Component, PureComponent } from 'react';
import { connect } from 'dva';
import OldLifeChild from './oldLifeChild.jsx';
// 参考文章 https://www.jianshu.com/p/c9bc994933d5

const debugMode = true;
const log = debugMode ? console.log.bind(this) : () => { }

class IndexPage extends Component {
  // 只要组件存在constructor,就必要要写super,否则this指向会错误
  constructor(props, context) {
    super(props, context);
    // log('this.props ->', this.props)
    // log('this.context ->', this.context)

    this.state = {
      number: 0
    }
  }

  //组件将要挂载
  // 1，组件刚经历constructor, 初始完数据
  // 2，组件还未进入render，组件还未渲染完成，dom还未渲染
  // 一般用的比较少，更多的是用在服务端渲染
  componentWillMount() {
    log('--componentWillMount--');
  }

  // 组件渲染完成
  // 1，组件第一次渲染完成
  // 2，dom节点已经生成
  // 3，可以在这里调用ajax请求,返回数据setState后组件会重新渲染
  componentDidMount() {
    log('--componentDidMount--');
  }

  // 接受父组件改变后的props需要重新渲染组件
  // 1，通过对比nextProps和this.props，将nextProps setState为当前组件的state，从而重新渲染组件
  componentWillReceiveProps(nextProps) {
    // 如果是刷新页面的话，那么这个就没用，因为this.props = nextProps
    if (this.props.number !== nextProps.number) {
      // 更新内容
    }
    log('--componentWillReceiveProps--nextProps', nextProps);
  }

  // 唯一用于控制组件重新渲染的生命周期
  // return false可以阻止组件的更新
  // 因为react父组件的重新渲染会导致其所有子组件的重新渲染，
  // 这个时候其实我们是不需要所有子组件都跟着重新渲染的，因此需要在子组件的该生命周期中做判断
  shouldComponentUpdate(nextProps, nextState) {
    log('--shouldComponentUpdate--nextProps', nextProps);
    log('--shouldComponentUpdate--nextState', nextState);
    return true
  }

  // shouldComponentUpdate返回true以后，组件进入重新渲染的流程，
  // 这里同样可以拿到nextProps和nextState
  componentWillUpdate(nextProps, nextState) {
    log('--componentWillUpdate--nextProps', nextProps);
    log('--componentWillUpdate--nextState', nextState);
  }

  // 组件更新完毕后，react只会在第一次初始化成功会进入componentDidmount
  // 之后每次重新渲染后都会进入这个生命周期
  // 在 componentDidMount 里面 setState 导致组件更新，组件更新后会执行 componentDidUpdate，
  // 此时你又在 componentDidUpdate 里面 setState 又会导致组件更新，造成成死循环了，如果要避免死循环，需要谨慎的在 componentDidUpdate 里面使用 setState
  componentDidUpdate(prevProps, prevState) {
    log('--componentDidUpdate--prevProps', prevProps);
    log('--componentDidUpdate--prevState', prevState);
    // 死循环
    // this.setState({
    //   number: 100
    // })

    // 谨慎使用，加上限制条件
    if (prevState.number !== 100) {
      log('prevState.number ->', prevState.number);
      log('this.state.number ->', this.state.number);
      // this.setState({
      //   number: 100
      // })
    }
  }


  componentWillUnmount() {
    log('--componentWillUnmount--');
  }


  // 用处：
  // 1.clear你在组建中所有的setTimeout,setInterval
  // 2.移除所有组建中的监听 removeEventListener
  // 3.经常遇到这个warning:
  // Can only update a mounted or mounting component. This usually means you called setState() on an
  // unmounted component. This is a no-op. Please check the code for the undefined component.

  // 是因为你在组建中的ajax请求返回中setState,而你组件销毁的时候，请求还未完成，因此会报warning

  // componentDidMount() {
  //   this.isMount === true
  //   axios.post().then((res) => {
  //    this.isMount && this.setState({   // 增加条件ismount为true时
  //     aaa:res
  //   })
  // })
  // }
  // componentWillUnmount() {
  //     this.isMount === false
  // }


  add = () => {
    // this.setState({
    //   number: this.state.number + 1
    // })

    this.setState((prevState, props) => {
      return { number: prevState.number + 1 }
    }, () => {
      log('this.state 2->', this.state.number);
    })

    // log('this.state 1->', this.state.number);
  }

  render() {
    const { number } = this.state;
    return (
      <div className="btn">
        <button onClick={this.add}>按钮1</button>
        <OldLifeChild number={number} />
        {/* <div>{number}</div> */}
      </div>
    );
  }
}

IndexPage.propTypes = {

};

export default connect()(IndexPage);
