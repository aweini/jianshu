/**
 * Created by mahong on 17/6/19.
 */
import {Route, Redirect} from 'react-router-dom';
import Nav from '../nav/Nav';
import Home from 'home/Home.js';
import SignIn from 'user/SignIn';
import SignUp from 'user/SignUp';
import MyPage from 'user/MyPage';
import Write from 'write/Write';
import Article from 'article/Article';
import Edit from 'edit/Edit';
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
            previewsName: '所有文章',
            collections:[]
        }
        this.signInAjax = this.signInAjax.bind(this);
        this.signUpAjax = this.signUpAjax.bind(this);
        this.clearTipMsg = this.clearTipMsg.bind(this);
        this.initMyInfo = this.initMyInfo.bind(this);
        this.logout = this.logout.bind(this);
        this.getPreviews = this.getPreviews.bind(this);
        this.initMyPage = this.initMyPage.bind(this);
        this.upDateMyInfo = this.upDateMyInfo.bind(this);
        this.getCollection = this.getCollection.bind(this);
        this.updataCollection = this.updataCollection.bind(this);
    }

    initMyInfo(myInfo){
        if(myInfo){
            myInfo.avatar = cfg.url_dest+ myInfo.avatar;
            myInfo.user_intro = myInfo.user_intro?myInfo.user_intro:'没有自我介绍';
        }
        this.setState({
            myInfo
        })
    }

    signInAjax(reqData){
        $.post(`${cfg.url}/api/login`,reqData)
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
        $.post(`${cfg.url}/api/register`,reqData)
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
    getCollection(user_id){
       
        $.post(`${cfg.url}/api/getCollection`,{user_id})
            .done((res)=>{
                console.log('getCollection collections')
                console.log(res)
                if(res.code==0){
                    this.setState({
                        collections: res.data
                    })
                }
            })
    }
    updataCollection(collections){
        this.setState({
            collections:collections
        })
    }

    logout(){
        $.post(`${cfg.url}/api/logout`)
        .done((res)=>{
            if(res.code==0){
               this.initMyInfo(null);
            }
        })
    }
//只在这个frame组件第一次挂在的时候调用，后面路由间跳转都是在frame下的路由间跳转frame不变，所以这个不会再执行，
//除非刷新页面，frame的挂载会再执行一次
    componentDidMount(){
        $.post(`${cfg.url}/api/autoLogin`,{})
        .done((res)=>{
            if(res.code==0){
                // res.data.user_id = res.data.id;
                // res.data.user_name = res.data.user_name;
            }
            this.initMyInfo(res.data);
        })
        this.setState({hasLoginReq: true});
        let {pathname, state} = this.props.location;
        //console.log('frame componentDidMount state');
        //console.log(this.props);
        if(state&&state.userInfo){
            let {user_id} = state.userInfo;
            if(pathname='/my_page'){
                this.initMyPage(user_id,"",'所有文章');
            }
            if(pathname='/write'){
                this.getCollection(user_id);
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
        $.post(`${cfg.url}/api/getPreview`, data)
        .done(({code, data})=>{
            if(code==0){
                data.map((el,index)=>{
                    el.user.avatar = cfg.url_dest + el.user.avatar;
                })
                //console.log('getPreviews');
                this.setState({
                    myPagePreviews: data
                })
            }
        })
    }
//比如从home页点击nav上的个人头像跳转到个人页面，刚跳过去的时候render()一次，
//后续getPreviews setState会render()一次
//getCollection ajax数据返回的时候 setState又会render()一次 这几次setState相差时间太长所以各自render
    initMyPage(user_id, collection_id, previewsName){
        console.log("initMyPage", user_id,collection_id)
        this.getPreviews({
            user_id,
            collection_id
        });
        $.post(`${cfg.url}/api/getCollection`, {
            user_id
        })
        .done(({code, data})=>{
            
            if(code==0){
                 //console.log('getCollection');
                this.setState({
                    notebooks: data,
                    previewsName
                })
            }
        })
    }

    upDateMyInfo(user_intro){
        let {myInfo} = this.state;
        myInfo.user_intro = user_intro;
        this.setState({
            myInfo
        })
    }

    render(){
        let {signInAjax, signUpAjax, clearTipMsg,logout,initMyPage,upDateMyInfo,getCollection,updataCollection} = this;
        let {signInMsg, signUpMsg,myInfo,hasLoginReq,myPagePreviews,notebooks,previewsName,collections} = this.state;

        if(!hasLoginReq){
            return (<div></div>);
        }
        let {history} = this.props;
        //console.log('frame render');
        //console.log('myInfo');
        //刚componentDidMount的时候 里面的ajax还没有请求成功所以没有myInfo
        //等ajax请求回来 setState会重新调用render函数，再渲染
       // console.log(myInfo);
        return (
            <div>
                <Nav {...{myInfo,logout,initMyPage,history,getCollection}}/>
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
                        <MyPage {...{notebooks, previewsName, myPagePreviews,initMyPage,myInfo,upDateMyInfo}}
                        {...props}
                        >

                        </MyPage>
                    )
                }>
                </Route>

                <Route exact path="/write" render={
                    (props)=>(
                        <Write {...{myInfo,collections,updataCollection}} {...props}></Write>
                    )
                }>
                </Route>

                <Route exact path="/article"  render={
                    (props)=>(
                        <Article {...{myInfo}} {...props}> </Article>
                    )
                }>
                </Route>

                <Route exact path="/edit"  render={
                    (props)=>(
                        <Edit {...{myInfo}} {...props}> </Edit>
                    )
                }>
                </Route>
            </div>
            )
    }
}