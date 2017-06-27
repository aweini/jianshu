/**
 * Created by mahong on 17/6/19.
 */
import {Route, Redirect} from 'react-router-dom';
import Nav from '../nav/Nav';
import Home from 'home/Home.js';
import SignIn from 'user/SignIn';
import SignUp from 'user/SignUp';
import MyPage from 'user/MyPage';
import cfg from 'config/config.json';

//有route的路有页面 this.props里有history location match 等其他属性，其中history里有push函数 location等等
//location里有 hash pathname search state等信息，state里可以防止要传递的信息
//几种有history的方式
// Route component as this.props.location
// Route render as ({ location }) => ()
// Route children as ({ location }) => ()
// withRouter as this.props.location
//其他页如果有路由页面给传递过去的history就有history属性，如果没传就没有如home，传递的方法可以是单传history如nav或者{...props}如my_page
//如果实在没有又想用history 就用withRouter强制给对象加上history等属性
//用history.push给到的state每到这个页面这些数据就都存在，其他页面不存在
export default class Frame extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            myInfo: null,
            signInMsg: null,
            signUpMsg: null,
            hasLoginReq: false,
            myPagePreviews: [],
            notebooks: [],
            previewsName: '所有文章'
        }
        this.signInAjax = this.signInAjax.bind(this);
        this.signUpAjax = this.signUpAjax.bind(this);
        this.clearTipMsg = this.clearTipMsg.bind(this);
        this.initMyInfo = this.initMyInfo.bind(this);
        this.logout = this.logout.bind(this);
        this.getPreviews = this.getPreviews.bind(this);
        this.initMyPage = this.initMyPage.bind(this);
    }

    initMyInfo(myInfo){
        if(myInfo){
            myInfo.avatar = cfg.url+ myInfo.avatar;
        }
        this.setState({
            myInfo
        })
    }

    signInAjax(reqData){
        $.post(`${cfg.url}/login`,reqData)
        .done(res=>{
            let {code, data} = res;
            if(code==0){
                 this.initMyInfo(res.data);
            }else{
                this.setState({signInMsg:res});
            }
        })
    }
    signUpAjax(reqData){
        $.post(`${cfg.url}/register`,reqData)
        .done(res=>{
            let {code, data} = res;
            this.setState({
                    signUpMsg: res
                })
                //注册成功会后台默认登录，会返回和登录一样的信息，包括cookie
                //登录成功其实就是让后台查找有用户密码正确的情况下返回前端cookie，在后端创建session，以后凭前端传过来的cookie表明已经登录，然后操作
            if(code==0){
               setTimeout(()=>{
                   this.initMyInfo(res.data)
               })
            }

            
        })
    }
    logout(){
        $.post(`${cfg.url}/logout`)
        .done((res)=>{
            if(res.code==0){
               this.initMyInfo(null);
            }
        })
    }

    componentDidMount(){
        $.post(`${cfg.url}/autologin`)
        .done((res)=>{
            if(res.code==0){
                res.data.user_id = res.data.id;
                res.data.user_name = res.data.username;
            }
            this.initMyInfo(res.data);
        })
        this.setState({hasLoginReq: true});
        console.log(this.props);
        let {pathname, state} = this.props.location;
        if(state){
            let {user_id} = state.userInfo;
            if(pathname='/my_page'){
                this.initMyPage(user_id,{user_id},'所有文章');
            }
        }
        
       
    }

    clearTipMsg(){
        this.setState({
            signInMsg: null,
            signUpMsg: null
        })
    }

    getPreviews(data){
        $.post(`${cfg.url}/getPreview`, data)
        .done(({code, data})=>{
            if(code==0){
                data.map((el,index)=>{
                    el.user.avatar = cfg.url + el.user.avatar;
                })
                this.setState({
                    myPagePreviews: data
                })
            }
        })
    }

    initMyPage(user_id, previewsData, previewsName){
        console.log(["previewsData",previewsData,user_id])
        this.getPreviews(previewsData);
        $.post(`${cfg.url}/getCollection`, {
            user_id
        })
        .done(({code, data})=>{
            
            if(code==0){
                this.setState({
                    notebooks: data,
                    previewsName
                })
            }
        })
    }

    render(){
        let {signInAjax, signUpAjax, clearTipMsg,logout,initMyPage} = this;
        let {signInMsg, signUpMsg,myInfo,hasLoginReq,myPagePreviews,notebooks,previewsName} = this.state;

        if(!hasLoginReq){
            return (<div></div>);
        }
        let {history} = this.props;
        return (
            <div>
                <Nav {...{myInfo,logout,initMyPage,history}}/>
                <Route exact path="/" render={
                    (props)=>(
                        <Home {...{initMyPage}} {...props}></Home>
                    )
                    
                }></Route>
                <Route exact path="/sign_in" render={
                    (props)=>(
                        myInfo?(
                            <Redirect to="/"></Redirect>
                        ):(
                            <SignIn {...{signInAjax, signInMsg ,clearTipMsg}}>

                            </SignIn>
                        )
                        
                    )
                }></Route>
                <Route exact path="/sign_up" render={
                    (props)=>(
                        myInfo?(
                            <Redirect to="/"></Redirect>
                        ):(
                            <SignUp {...{signUpAjax, signUpMsg, clearTipMsg}}>

                            </SignUp>
                        )
                        
                    )
                }></Route>
                <Route exact path="/my_page" render={
                    (props)=>(
                        <MyPage {...{notebooks, previewsName, myPagePreviews,initMyPage}}
                        {...props}
                        >

                        </MyPage>
                    )
                }>
                </Route>
            </div>
            )
    }
}