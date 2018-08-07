import React, { Component, PureComponent } from 'react';
import { connect } from 'dva';
import propTypes from 'prop-types';

const debugMode = false;
const log = debugMode ? console.log.bind(this) : () => { }


class oldLifeChild extends Component {
  // 只要组件存在constructor,就必要要写super,否则this指向会错误
  constructor(props, context) {
    super(props, context);

    this.state = {
      number: 0
    }
  }

  componentWillMount() {
    log('--componentWillMount--');
  }

  componentDidMount() {
    log('--componentDidMount--');
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.number !== nextProps.number) {
    log('--componentWillReceiveProps--nextProps.number', nextProps.number)
    this.setState({
      number: nextProps.number
    }, () => {
      log('--componentWillReceiveProps--this.state.number', this.state.number);
    })
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    log('--shouldComponentUpdate--nextState.number', nextState.number);
    // log('--shouldComponentUpdate--nextProps', nextProps);
    // log('--shouldComponentUpdate--nextState', nextState);
    // return true
    return true;
  }


  componentWillUpdate(nextProps, nextState) {
    // log('--componentWillUpdate--nextProps', nextProps);
    // log('--componentWillUpdate--nextState', nextState);
    log('--componentWillUpdate--nextState.number', nextState.number);
  }

  componentDidUpdate(prevProps, prevState) {
    // log('--componentDidUpdate--prevProps', prevProps);
    // log('--componentDidUpdate--prevState', prevState);
    log('--componentDidUpdate--this.state.number', this.state.number);
  }

  componentWillUnmount() {
    log('--componentWillUnmount--');
  }

  render() {
    const { number } = this.state;
    log('--render state.number --state.number', number);
    return (
      <div className="btn">
        child:{number}
      </div>
    );
  }
}

// 初始化时，生命周期函数顺序
// 1，componentWillMount
// 2，render
// 3，componentDidMount


// props变化时
// 1，componentWillReceiveProps
// 2，shouldComponentUpdate
// 3，componentWillUpdate
// 4，render
// 5，componentDidUpdate

// 页面变化时
// 1，componentWillUnmount

oldLifeChild.propTypes = {
  number: propTypes.number,
};

export default connect()(oldLifeChild);
