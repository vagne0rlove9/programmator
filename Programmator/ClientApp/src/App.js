import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout/Layout';
import { Home } from './components/Home/Home';
import Operator from './components/Operator/Operator';
import './custom.css'
import Machine from './components/Machine/Machine';


export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/operator' component={Operator} />
                <Route path='/machine' component={Machine} />
            </Layout>
        );
    }
}
