/**
 * Created by mahong on 17/6/19.
 */
import {Route} from 'react-router-dom';
import Nav from '../nav/Nav';
import Home from 'home/Home.js';
import SignIn from 'user/SignIn';
import SignUp from 'user/SignUp';
import cfg from 'config/config.json';

export default class Frame extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            myInfo: null,
            signInMsg: null
        }
        this.signInAjax = this.signInAjax.bind(this);
    }

    signInAjax(reqData){
        $.post(`${cfg.url}/login`,reqData)
        .done(res=>{
            let {code, data} = res;
            if(code==0){

            }else{
                this.setState({signInMsg:res});
            }
        })
    }

    render(){
        let {signInAjax} = this;
        let {signInMsg} = this.state;
        return (
            <div>
                <Nav/>
                <Route exact path="/" component={Home}></Route>
                <Route exact path="/sign_in" render={
                    (props)=>(
                        <SignIn {...{signInAjax, signInMsg}}>

                        </SignIn>
                    )
                }></Route>
                <Route exact path="/sign_up" component={SignUp}></Route>
            </div>
            )
    }
}