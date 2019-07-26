import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Switch } from "react-router-dom"

function NotFound() {
    return <div>404</div>
}

const Search = React.lazy(() => import('./Search'))
const Workspace = React.lazy(() => import('./Workspace'))
const Editor = React.lazy(() => import('./Editor'))

function WaitingComponent(Component) {
    return props => (
        <Suspense fallback={<div>Loading...</div>}>
            <Component {...props} />
        </Suspense>
    );
}

class MyRouter extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/" exact component={WaitingComponent(Search)} />
                    <Route path="/editor/:id" component={WaitingComponent(Editor)} />
                    <Route path="/workspace/:id" component={WaitingComponent(Workspace)} />
                    <Route component={NotFound} />
                </Switch>
            </HashRouter>
        )
    }
}

export default MyRouter