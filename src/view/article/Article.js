import cfg from 'config/config.json';
import {withRouter} from 'react-router-dom';
import S from './style.scss';
import AlertPlugin from 'common/util/alertPlugin';
import majax from 'common/util/majax';
import popPlugin from "common/util/popPlugin"
let pop = new popPlugin();
class Article extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props.location);
        this.editArticle = this.editArticle.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
        this.approveDelete = this.approveDelete.bind(this);
        this.state = {
            showAlert: false
        }
    }
    editArticle(ev){
        let { history } = this.props;
        let { article_id ,user_id} = this.props.location.state;
        ev.preventDefault();
        ev.stopPropagation();
        history.push('/edit',{
            article_id,
            user_id
        })
    }
    deleteArticle(){
        let alertTip = "确定删除?"
        // this.setState({
        //     showAlert:true
        // }) 
        pop.confirm(alertTip, this.approveDelete)
    }
    approveDelete(){
        let { article_id } = this.props.location.state;
        let {history} = this.props;
        majax({
            url:`${cfg.url}/api/delArticle`,
            data: {article_id}
        },function(res){
            history.goBack();
        });
    }
    render(){
        let {article_title, article_id, article_content, add_time,user_id,
                user_name,
                avatar,
                user_intro} = this.props.location.state;
        let {myInfo} = this.props;
        let {editArticle,deleteArticle,denyDelete,approveDelete,alertTip} = this;
        let {showAlert} = this.state;
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

           {isMe?(<div>
               <div className="ui button tiny basic floated" onClick={editArticle}>
                    <i className="icon write"></i>
                        编辑
                </div>
                <div className="ui button tiny basic floated" onClick={deleteArticle}>
                    <i className="icon write"></i>
                        删除
                </div>
                </div>
               ):null}
              {/* <AlertPlugin {...{showAlert, approveDelete,alertTip}}></AlertPlugin> */}
        </div>)
    }
}

export default withRouter(Article);
//export default withRouter(Preview);