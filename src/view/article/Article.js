import cfg from 'config/config.json';
import {withRouter} from 'react-router-dom';
import S from './style.scss';

class Article extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props.location);
        this.editArticle = this.editArticle.bind(this);
    }
    editArticle(ev){
        let { history } = this.props;
        let { article_id } = this.props.location.state;
        ev.preventDefault();
        ev.stopPropagation();
        history.push('/edit',{
            article_id
        })
    }
    render(){
        let {article_title, article_id, article_content, add_time,user_id,
                user_name,
                avatar,
                user_intro} = this.props.location.state;
        let {myInfo} = this.props;
        let {editArticle} = this;
        let isMe = false;
        if(myInfo){
            if(myInfo.user_id == user_id){
                isMe = true;
            }
        }
        add_time = new Date(add_time).toLocaleString();
        return (<div className={`ui container ${S.articleBox}`}>
           <h2 className="ui center aligned header">
                {article_title} 
           </h2>

           <h5 className="ui center aligned header">
                {user_name} &nbsp; {add_time}
           </h5>

           <div className="ui raised segment">
               {article_content}
           </div>

           {isMe?(<div className="ui button tiny basic floated" onClick={editArticle}>
                    <i className="icon write"></i>
                        编辑
                </div>
               ):null}
        </div>)
    }
}

export default withRouter(Article);
//export default withRouter(Preview);