import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from "./Home";
import Renderer from "./Renderer";

export default function App() {
  return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/render/:id' component={Renderer}/>
          <Route path='/' component={Home}/>
        </Switch>
      </BrowserRouter>
  );
}

