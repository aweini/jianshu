import {Link, withRouter} from 'react-router-dom';
import S from './style.scss';

class Preview extends React.Component{
    constructor(props){
        super(props);
        this.initMyPageClick = this.initMyPageClick.bind(this);
        //console.log('preview');
        //console.log(this.props);
    };
    initMyPageClick(e){
        e.preventDefault();
        e.stopPropagation();
        let {
            article_id,
            article_title,
            previewContent,
            user_id,
            user_name,
            createdAt,
            avatar,
            user_intro,
            initMyPage,
            history
        } = this.props;
        history.push('/my_page',{
            userInfo:{
                user_id,
                user_name,
                avatar,
                user_intro
            }
        });
        initMyPage(user_id,{user_id:user_id},"我的所有文章");
    }

    render(){
        let {
            article_id,
            article_title,
            previewContent,
            user_id,
            user_name,
            createdAt,
            avatar,
            user_intro,
            initMyPage,
            history,
            children
        } = this.props;

       createdAt = new Date(createdAt).toLocaleString();
        
        let {initMyPageClick} = this;
        return (
        <div className={`${S.note}`}>
            <div className="ui divider hidden"></div>
            <div className={`${S.content}`}>
                <div className={`${S.author}`}>
                    <Link to="/my_page" className="avatar">
                        <img src={avatar} alt="" className="ui avatar image"
                        onClick={initMyPageClick}
                        />
                    </Link>
                    <div className={`${S.name}`}>
                        <Link to="/">{user_name}</Link>
                        <span className="time">{createdAt}</span>
                    </div>
                </div>
                <Link to="/" className={$.title}>{article_title}</Link>
                <p className={S.abstract}>
                    {previewContent}
                </p>
                <div className={S.meta}>
                    {children}
                </div>
            </div>

        </div>
        );
    }
    
}

export default withRouter(Preview);
//export default Preview;