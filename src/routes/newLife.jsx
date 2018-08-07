import React, { Component, PureComponent } from 'react';
import { connect } from 'dva';
import NewLifeChild from './newLifeChild.jsx';
import ErrorBoundary from './ErrorBoundary.jsx'
// 参考文章 https://www.jianshu.com/p/c9bc994933d5
// 参考文章 https://blog.csdn.net/Napoleonxxx/article/details/81120854
class IndexPage extends Component {
  // 只要组件存在constructor,就必要要写super,否则this指向会错误
  constructor(props, context) {
    super(props, context);

    this.state = {
      number: 0
    }
  }

  add = () => {
    this.setState((prevState, props) => {
      return { number: prevState.number + 1 }
    }, () => {
      // console.log('this.state.number->', this.state.number);
    })
  }


  render() {
    const { number } = this.state;
    return (
      <div className="btn">
        <button onClick={this.add}>按钮1</button>
        <ErrorBoundary>
          <NewLifeChild number={number} />
        </ErrorBoundary>
      </div>
    );
  }
}

IndexPage.propTypes = {

};

export default connect()(IndexPage);
