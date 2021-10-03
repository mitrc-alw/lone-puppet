import React, {useEffect, useState} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
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
        <>
            <Route exact path='/render/:id' component={Renderer}/>
            <Route exact path='/edit/:id' component={EditArrangement}/>
            <Route path='/' component={Home}/>
        </>
    );
    if (!auth) content = (
        <>
            <Route exact path='/' render={() => <Login setAuth={setAuth}/>}/>
            <Redirect to='/' />
        </>
    );

    return (
        <BrowserRouter>
            <Switch>
                {content}
            </Switch>
        </BrowserRouter>
    );
}

