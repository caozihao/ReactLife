import React, { Component } from 'react';
import propTypes from 'prop-types';
// import './ErrorBoundary.scss';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }
  componentDidMount() { }
  componentWillReceiveProps(nextProps) { }

  // Error Boundaries（错误边界）
  // 1,错误边界可以在捕获其 其子组件的渲染、生命周期函数以及构造函数内的错误。
  // 2,无法捕获下列错误：事件处理函数触发的错误 / 异步代码 / 服务端渲染 / 自己产生的错误
  // 3,错误边界是用来保证React可以正常渲染UI的，而不是真的用来捕获异常的

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    log('--componentWillUnmount--,error', error);
    log('--componentWillUnmount--,info', info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>Something went wrong</div>
      );
    } else {
      return this.props.children;
    }


  }
}
ErrorBoundary.propTypes = {};
ErrorBoundary.defaultProps = {};
export default ErrorBoundary;
