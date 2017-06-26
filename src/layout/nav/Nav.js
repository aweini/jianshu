/**
 * Created by mahong on 17/6/19.
 */
import { NavLink, Link } from 'react-router-dom';
import S from './style.scss';

export default class Nav extends React.Component{
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this);
      
    }
    logout(e){
        console.log('注销');
        e.preventDefault();
        e.stopPropagation();
        this.props.logout();
    }
    
    render(){
        let {myInfo} = this.props;
        let {logout} = this;
        let userLink = null;
        if(myInfo){
            userLink=(
                <NavLink to="/my_page" className={`${S.avatar} item`} activeClassName="active">
                    <img src={myInfo.avatar} className="ui image avatar" alt=""/>
                    <span>{myInfo.username}</span>
                    <div className={S.dropDown}>
                        <p onClick={logout}>注销</p>
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
                        <Link  to="/" className="item">Noods</Link>
                        <NavLink exact  to="/" className="item" activeClassName="active">首页 </NavLink>
                        <div className="menu right">
                            {userLink}
                            <NavLink to="/write" className="item" activeClassName="active">写文章</NavLink>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
    

}