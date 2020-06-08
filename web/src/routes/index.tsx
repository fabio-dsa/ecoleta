import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from '../views/Home';
import CreatePoint from '../views/CreatePoint'

const Routes = () => {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Home} />
            <Route path="/create-point" exact component={CreatePoint} />
        </BrowserRouter>
    );
}

export default Routes;