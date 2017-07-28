import {Link, withRouter} from 'react-router-dom';
import S from './style.scss';

class Preview extends React.Component{
    constructor(props){
        super(props);
        this.initMyPageClick = this.initMyPageClick.bind(this);
        //console.log('preview');
        //console.log(this.props);
        this.showArticle = this.showArticle.bind(this);
    };
    initMyPageClick(e){
        e.preventDefault();
        e.stopPropagation();
        let {
            article_id,
            article_title,
            article_content,
            user_id,
            user_name,
            add_time,
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

    showArticle(e){
        e.preventDefault();
        e.stopPropagation();
        console.log("showArticle");
        let {article_id,article_content,article_title,add_time,history,user_id,
                user_name,
                avatar,
                user_intro} = this.props;
        history.push('/article',
            {article_id,
            article_title,
            article_content,
            add_time,
            user_id,
            user_name,
            avatar,
            user_intro
            }
        )
    }


    render(){
        let {
            article_id,
            article_title,
            article_content,
            user_id,
            user_name,
            add_time,
            avatar,
            user_intro,
            initMyPage,
            history,
            children
        } = this.props;

       add_time = new Date(add_time).toLocaleString();
        
        let {initMyPageClick, showArticle} = this;
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
                        <span className="time">{add_time}</span>
                    </div>
                </div>
                <Link to="/article" className={$.title} onClick={showArticle}>{article_title}</Link>
                <p className={`${S.abstract} ${S.ellipsis}`} onClick={showArticle}>
                    {article_content}
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