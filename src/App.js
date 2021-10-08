import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from "./Home";
import Renderer from "./Renderer";
import EditArrangement from "./EditArrangement";
import Login from "./Login";

export default function App() {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        try {
            const data = JSON.parse(localStorage.getItem('auth') ?? {});
            if (data.timeStamp > Date.now() - 60 * 60 * 1000 && data.loggedIn) setAuth(true);
        } catch (e) {
            console.log('login', e)
        }
    }, []);

    let content = (
        <Switch>
            <Route exact path='/render/:id' component={Renderer}/>
            <Route exact path='/edit/:id' component={EditArrangement}/>
            <Route path='/' component={Home}/>
        </Switch>
    );
    if (!auth) content = (
        <Switch>
            <Route path='/' render={() => <Login setAuth={setAuth}/>}/>
        </Switch>
    );

    return (
        <BrowserRouter>
            {content}
        </BrowserRouter>
    );
}

