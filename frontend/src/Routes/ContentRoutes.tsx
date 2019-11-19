import React from "react";
import {Switch, Route} from 'react-router'
import PageDashBoard from '../Containers/DashBoard';
import NotFound from '../Containers/NotFound';
import PageRepository from "../Containers/Repository";
import PageOrder from "../Containers/Order";
import PageHelp from "../Containers/Help";
import PageRepositoryDashboard from "../Containers/Repository/Dashboard";
import PageClient from "../Containers/Client";
import PageAccount from "../Containers/Account";

const ContentRoutes = () => <Switch>
    <Route exact path="/" render={() => <PageRepositoryDashboard/>}/>
    <Route path="/index" render={() => <PageRepositoryDashboard/>}/>
    <Route path="/repository/" render={PageRepository}/>
    <Route path="/order" render={() => <PageOrder/>}/>
    <Route path="/client" render={() => <PageClient/>}/>
    <Route path="/account" render={() => <PageAccount/>}/>
    <Route path="/help" render={() => <PageHelp/>}/>
    <Route component={NotFound}/>
</Switch>;

export default ContentRoutes;


