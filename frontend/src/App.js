import React from 'react';
import './App.css';
import {Route, Switch, Redirect } from "react-router-dom";
import {Homepage} from './Pages/Homepage';
import {Chatpage} from './Pages/Chatpage';
import ResetPassword from './Components/Authentication/temp';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/test">
          <div>Test Route Works!</div>
        </Route>
        <Route path="/reset-password/:token">
          <ResetPassword />
        </Route>
        <Route path="/chats">
          <Chatpage />
        </Route>
        <Route exact path="/">
          <Homepage />
        </Route>
        {/* Catch all route for undefined paths */}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </div>


  );
}

export default App;
