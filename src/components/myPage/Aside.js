import S from './style.scss';
import cfg from 'config/config.json';
export default class Aside extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            inEdit: false,
            editVal: ''
        }
        this.notebooksClick = this.notebooksClick.bind(this);
        this.editMe = this.editMe.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.editDone = this.editDone.bind(this);
        this.editContent = this.editContent.bind(this);
    }

    notebooksClick(collection_id, collection_name, userInfo){
        let {notebooksClick} = this.props;
        notebooksClick(collection_id, collection_name, userInfo);
        console.log(collection_id);
    }
    editMe(e){
       // e.preventDefault();
       // e.stopPropagation();
       let {userInfo} = this.props;
       let {user_intro} = userInfo.user_intro;
        this.setState({
            inEdit: true,
            editVal: user_intro
        })
    }
    cancelEdit(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            inEdit: false
        })
    }
    editDone(e){
        e.preventDefault();
        e.stopPropagation();
        let {editVal} = this.state;
        let { userInfo:{user_id}, upDateMyInfo} = this.props;
        $.post(`${cfg.url}/editIntro`,{user_intro: editVal, user_id})
        .done((res)=>{
            if(res.code==0){
                console.log('editVal');
                console.log(editVal);
                upDateMyInfo(editVal);
                this.setState({
                    inEdit: false
                })
            }
        })

        
    }
    editContent(ev){
        this.setState({
            editVal: ev.target.value
        })
    }
    render(){
        let {userInfo, notebooks,isMe} = this.props;
        let {user_intro} = userInfo;
        let {notebooksClick, editMe, cancelEdit, editDone, editContent} = this;
        let {inEdit, editVal} = this.state;
        user_intro = user_intro?user_intro:"用户暂时没写自我介绍哦";
        notebooks = notebooks.map((el, index)=>{
            let {collection_name,id} = el;
            return (
                 <div
                    className="item"
                    key={index}
                    onClick={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        notebooksClick(id, collection_name, userInfo)
                    }}
                >
                    <i className="book icon"></i>
                    <div className="content">
                        {collection_name}
                    </div>

                </div>
            )
        })
        if(notebooks.length==0){
            notebooks = "暂时没有文集哦"
        }
        return(
            <div className={S.aside}>
                <div className="introduce">
                    <div className="title">
                        个人介绍
                        {isMe?(
                            <div className="ui button tiny basic floated" onClick={editMe}>
                                <i className="icon write"></i>
                                    编辑
                            </div>
                        ):null}
                        <div className="ui divider hidden"></div>
                       
                       
                        {inEdit?(
                             <form
                                    action=""
                                    className="ui form"
                                    onSubmit={editDone}
                                >
                                    <div className="field">
                                        <textarea
                                            value={editVal}
                                            onChange={editContent}
                                        ></textarea>
                                    </div>
                                    <button className="ui positive button" type="submit">
                                        提交
                                    </button>
                                    <button
                                        className="ui negative button"
                                        type="submit"
                                        onClick={cancelEdit}
                                    >
                                        取消
                                    </button>
                                </form>
                        ):(<p>{user_intro}</p>)}
                        
                    </div>
                </div>
                <div className="ui divider hidden"></div>
                <div className={S.volume}>
                    <div className={S.title}>我的文集</div>
                </div>
                <div className="ui list">
                {notebooks}
                </div>
            </div>
        )
    }
}