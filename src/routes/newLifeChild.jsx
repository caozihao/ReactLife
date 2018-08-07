import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import propTypes from 'prop-types';

const debugMode = true;
const log = debugMode ? console.log.bind(this) : () => { }

// 参考文章 https://blog.csdn.net/c_kite/article/details/80303341


class newLifeChild extends Component {
  // 只要组件存在constructor,就必要要写super,否则this指向会错误
  constructor(props, context) {
    super(props, context);
    log('--constructor--')
    this.state = {
      number: 0
    }
  }
  // 未来的v17版取消了三个生命周期：
  // componentWillMount，componentWillReceiveProps，componentWillUpdate
  // 增加了一个生命周期：
  // componentDidCatch（在构造函数、生命周期函数或渲染的时候出现错误时）
  // 1,componentWillMount和componentWillUpdate可能会调用一次，而componentDidMount和componentDidUpdate只会调用一次，用后者来代替前者
  // 2,componentWillReceiveProps 破坏数据单一性，让数据变得不可测，增加重绘次数
  // 3,在render阶段在 render 阶段读取到的 DOM 元素状态并不总是和 commit 阶段相同，这就导致在 componentDidUpdate 中使用 componentWillUpdate 中读取到的 DOM 元素状态是不安全的
  // 4,新老生命周期不能同时存在，否则会报错误

  // 为什么要改
  // 旧的生命周期十分完整，基本可以捕捉到组件更新的每一个state/props/ref，没有什从逻辑上的毛病。
  // 但是架不住官方自己搞事情，react打算在17版本推出新的Async Rendering，提出一种可被打断的生命周期，而可以被打断的阶段正是实际dom挂载之前的虚拟dom构建阶段，也就是要被去掉的三个生命周期。
  // 生命周期一旦被打断，下次恢复的时候又会再跑一次之前的生命周期，因此componentWillMount，componentWillReceiveProps， componentWillUpdate都不能保证只在挂载/拿到props/状态变化的时候刷新一次了，所以这三个方法被标记为不安全。


  // 通过框架级别的 API 来约束或者说帮助开发者写出可维护性更佳的 JavaScript 代码
  // 1，触发时间：在组件构建之后(虚拟dom之前，实际dom挂载之前) ，以及每次获取新的props之后。
  // 2，每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state.
  // 3，配合componentDidUpdate，可以覆盖componentWillReceiveProps的所有用法
  // 4，是一个static方法，意味着拿不到实例的this
  // 5，getDerivedStateFromProps更全能，无论是mounting还是updating都会被触发
  // 6，componentWillReceiveProps只会updating阶段，并且是父组件触发的render才被调用。
  // 7，被React官方归类为不常用的生命周期，能不用就尽量不用
  static getDerivedStateFromProps(nextProps, prevState) {
    log('--getDerivedStateFromProps--');

    if (nextProps.number !== prevState.number) {
      return {
        number: nextProps.number
      }
    }
    // 当需要更新状态时，返回一个obj，如果需要任何更新，就返回null
    return null;
  }


  // 取消该生命周期的原因：
  // 1，React 并不能够保证在 componentWillMount 被调用后，同一组件的 componentWillUnmount 也一定会被调用。
  // 一个当前版本的例子如服务端渲染时，componentWillUnmount 是不会在服务端被调用的，所以在 componentWillMount 中订阅事件就会直接导致服务端的内存泄漏
  // 2，在未来 React 开启异步渲染模式后，在 componentWillMount 被调用之后，组件的渲染也很有可能会被其他的事务所打断，导致 componentWillUnmount 不会被调用
  // 3，componentDidMount 就不存在这个问题，在 componentDidMount 被调用后，componentWillUnmount 一定会随后被调用到，并根据具体代码清除掉组件中存在的事件订阅。

  // componentWillMount() {
  //   log('--componentWillMount--');
  // }

  componentDidMount() {
    log('--componentDidMount--');
  }

  //  取消改生命周期的原因:
  // 1,如果组件自身的某个 state 跟其 props 密切相关的话,需要在 componentWillReceiveProps 中判断前后两个 props 是否相同
  // 如果不同再将新的 props 更新到相应的 state 上去，这样做一来会破坏 state 数据的单一数据源，导致组件状态变得不可预测
  // 2，会增加组件的重绘次数（通过条件判断应该能解决吧）
  // componentWillReceiveProps(nextProps) {

  // }

  shouldComponentUpdate(nextProps, nextState) {
    log('--shouldComponentUpdate--nextState.number', nextState.number);
    return true;
  }

  // 取消该生命周期的原因：
  // 1， 和componentWillReceiveProps类似的原因，都有可能在一次更新中被调用多次，也就是说写在这里的回调函数也有可能会被调用多次
  // 2， 与 componentDidMount 类似，componentDidUpdate 不存在这样的问题，一次更新中 componentDidUpdate 只会被调用一次，所以将原先写在 componentWillUpdate 中的回调迁移至 componentDidUpdate 就可以解决这个问题。
  // 3， 可以把getSnapshotBeforeUpdate视作componentWillUpdate的安全版，最大的不同还是触发时机，componentWillUpdate在updating阶段的render之前触发。
  // 4，作为一个不常用的生命周期，官方建议当然还是：能不用就尽量不要用。
  // componentWillUpdate(nextProps, nextState) {
  //   log('--componentWillUpdate--nextState.number', nextState.number);
  // }

  // getSnapshotBeforeUpdate 会在最终的 render 之前被调用，也就是说在 getSnapshotBeforeUpdate 中读取到的 DOM 元素状态是可以保证与 componentDidUpdate 中一致
  // 1，触发时间: update发生的时候，在render之后，在组件dom渲染之前。
  // 2，返回一个值，作为componentDidUpdate的第三个参数。
  // 3，配合componentDidUpdate, 可以覆盖componentWillUpdate的所有用法。
  getSnapshotBeforeUpdate(prevProps, prevState) {
    log('--getSnapshotBeforeUpdate--');
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    log('--componentDidUpdate--this.state.number', this.state.number);
    if (this.props.number !== prevProps.number) {
      log('do Something...');
    }
  }

  componentWillUnmount() {
    log('--componentWillUnmount--');
  }

  throwError() {
    console.log(1 / a);
  }

  forceUpdate11 = () => {
    this.forceUpdate();
  }


  render() {
    const { number } = this.state;
    log('--render state.number --state.number', number);
    return (
      <Fragment>
        <div className="btn">
          child:{number}
        </div>
        <button onClick={this.forceUpdate11}>强制刷新</button>
        <button onClick={this.throwError}>抛出异常</button>
      </Fragment>

    );
  }
}


// 初始化时，生命周期函数顺序
// 1，constructor
// 2，getDerivedStateFromProps
// 3，render
// 4，componentDidMount


// props变化时
// 1，getDerivedStateFromProps
// 2，shouldComponentUpdate
// 3，render
// 4，getSnapshotBeforeUpdate
// 5，componentDidUpdate

// 页面变化时
// 1，componentWillUnmount


newLifeChild.propTypes = {
  number: propTypes.number,
};

export default connect()(newLifeChild);
