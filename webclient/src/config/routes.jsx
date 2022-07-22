import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

import App from '../app';
import Home from  '../components/pages/home';
import Registration from "../components/pages/registration";
 

// import 'styles/index.scss'; /* commented index.scss -GM */
const Routes = () => (
  <Router onUpdate={() => window.scrollTo(0, 0)}>
    <div>
      <Route exact path = "/*" component={App}/>
      <Route exact path = "/home" component={Home}/>
      <Route exact path="/register" component={Registration}/>
       
    </div>
  </Router>
);

export default Routes;
