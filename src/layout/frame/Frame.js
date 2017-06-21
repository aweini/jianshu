/**
 * Created by mahong on 17/6/19.
 */
import {Route} from 'react-router-dom';
import Nav from '../nav/Nav';
import Home from 'home/Home.js';
import SignIn from 'user/SignIn';
import SignUp from 'user/SignUp'



export default class Frame extends React.Component{

    render(){
        return (
            <div>
                <Nav/>
                <Route exact path="/" component={Home}></Route>
                <Route exact path="/sign_in" component={SignIn}></Route>
                <Route exact path="/sign_up" component={SignUp}></Route>
            </div>
            )
    }
}