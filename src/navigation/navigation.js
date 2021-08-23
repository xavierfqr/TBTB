import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { Home, Profile, Feed } from '../pages';


const PrivateRoute = (props) => {
    const [user] = useAuthState(auth);

    return (
        user ? (
            <Route path={props.path} component={props.component}></Route>
        ) : <div>You must be signed in to access this page !</div>
    )
}

export const RouterConfig = () => {
    return (
        <Router>
            <Switch>
                <Route exact path={"/"} component={Home}/>
                <PrivateRoute path={"/profile"} component={Profile}/>
                <PrivateRoute path={"/feed"} component={Feed}/>
                <Route path="*" render={() => <Redirect to="/"/>}></Route>
            </Switch>
        </Router>
    )
}