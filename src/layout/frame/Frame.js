/**
 * Created by mahong on 17/6/19.
 */
import {Route} from 'react-router-dom';
import Nav from '../nav/Nav';
import Home from 'home/Home.js';



export default class Frame extends React.Component{

    render(){
        return (
            <div>
                <Nav/>
                <Route exact path="/" component={Home}></Route>
            </div>
            )
    }
}