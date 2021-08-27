import { Switch, Route, Redirect} from "react-router-dom";
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
        <Switch>
            <Route exact path={"/"} component={Home}/>
            <PrivateRoute path={"/feed"} component={Feed}/>
            <PrivateRoute path={"/profile/:id"} component={Profile}/>
            <Route path="*" render={() => <Redirect to="/"/>}></Route>
        </Switch>
    )
}