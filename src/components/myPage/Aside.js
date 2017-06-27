import S from './style.scss';
export default class Aside extends React.Component{
    constructor(props){
        super(props);
        this.notebooksClick = this.notebooksClick.bind(this);
    }

    notebooksClick(collection_id, collection_name, userInfo){
        let {notebooksClick} = this.props;
        notebooksClick(collection_id, collection_name, userInfo);
        console.log(collection_id);
    }
   
    render(){
        let {userInfo, notebooks} = this.props;
        let {user_intro} = userInfo;
        let {notebooksClick} = this;
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
                        <div className="ui divider hidden"></div>
                        <p>{user_intro}</p>
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