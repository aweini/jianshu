import {Link, withRouter} from 'react-router-dom'

function Author(props){
    let {user, initMyPage,history} = props;
    let userInfo = user;
    userInfo.user_id = userInfo.id;
    let {user_name, avatar, id: user_id} = user;

    let authorInfoPage = function(e){
        e.preventDefault();
        e.stopPropagation();
        history.push('/my_page',{
            userInfo
        })
        initMyPage(user_id,{user_id},"所有文章");
    }

    return(
        <div className="item">
            <Link to="/" className="ui mini avator image" onClick={authorInfoPage}>
                <img src={avatar} alt=""/>
            </Link>
            <div className="content">
                <div className="header">
                    {user_name}
                </div>

            </div>
        </div>
    )
}
export default withRouter(Author);