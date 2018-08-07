import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import oldLife from './routes/oldLife';
import newLife from './routes/newLife';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={oldLife} />
        <Route path="/new" exact component={newLife} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
