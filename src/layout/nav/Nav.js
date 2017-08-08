/**
 * Created by mahong on 17/6/19.
 */
import { NavLink, Link } from 'react-router-dom';
import S from './style.scss';

export default class Nav extends React.Component{
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this);
        this.initMyPageClick = this.initMyPageClick.bind(this);
        this.toWrite = this.toWrite.bind(this);
       // console.log('nav');
        //console.log(this.props);
      
    }
    logout(e){
        e.preventDefault();
        e.stopPropagation();
        let {history, logout} = this.props;
        logout();
        history.push('/',{});
        
    }
    toWrite(e){
        e.preventDefault();
        e.stopPropagation();
        let {myInfo,history} = this.props;
        if(myInfo){
            history.push('/write',{
                userInfo:myInfo
            });
            this.props.getCollection(myInfo.user_id);
        }else{
            history.push('/sign_in',{});
        }
    }
    initMyPageClick(e){
        e.preventDefault();
        e.stopPropagation();
        let {initMyPage, history, myInfo} = this.props;
        let {user_id, user_name:user_name, avatar, user_intro} = myInfo;
        console.log('initMyPageClick');
        console.log(myInfo);
        history.push('/my_page',{
            userInfo:{
                user_id,
                user_name,
                avatar,
                user_intro
            } 
        });
        initMyPage(user_id,"",'我的所有文章');
    }
    render(){
        let {myInfo} = this.props;
        // console.log('nav render');
        //console.log('myInfo');
       // console.log(myInfo);
        let {logout,initMyPageClick,toWrite} = this;
        let userLink = null;
        if(myInfo){
            userLink=(
                <NavLink to="/my_page" className={`${S.avatar} item`} activeClassName="active" onClick={initMyPageClick}>
                    <img src={myInfo.avatar} className="ui image avatar" alt=""/>
                    <span>{myInfo.user_name}</span>
                    <div className={S.dropDown}>
                        <p onClick={logout}>退出登录</p>
                    </div>
                </NavLink>
            )
        }else{
            userLink=[
                (<NavLink to="/sign_in" className="item" activeClassName="active" key={1}>登录</NavLink>),
                (<NavLink to="/sign_up" className="item" activeClassName="active" key={2}>注册</NavLink>)
            ]
        }

        return(
            <div className="ui inverted segment">
                <div className={`ui fixed secondary pointing menu ${S.nav}`}>
                    <div className="ui container">
                        <Link  to="/" className="item"></Link>
                        <NavLink exact  to="/" className="item" activeClassName="active">首页 </NavLink>
                        <div className="menu right">
                            {userLink}
                            <NavLink to="/write" className="item" activeClassName="active" onClick={toWrite}>写文章</NavLink>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
    

}