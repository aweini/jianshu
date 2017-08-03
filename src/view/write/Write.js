import cfg from 'config/config.json';
import S from './style.scss';
import {withRouter} from 'react-router-dom'
import majax from 'common/util/majax';
class Write extends React.Component{
    constructor(props){
        super(props)
        //let {myInfo} = this.props;//刷新就没了
        //let {state} = this.props.location;
        console.log('write constructor');
        console.log(this.props);
        this.state = {
            titleVal:'',
            cltVal: '',
            contentVal: '',
            collections: []
        }
        this.collectionName = {};
        this.changeTitle = this.changeTitle.bind(this);
        this.changeClt = this.changeClt.bind(this);
        this.changeContent = this.changeContent.bind(this);
        this.addCollection = this.addCollection.bind(this);
        this.onsubmit = this.onsubmit.bind(this);
    }

    changeTitle(ev){
        this.setState({
            titleVal: ev.target.value
        })
    }
    changeClt(ev){
        this.setState({
            cltVal: ev.target.value
        })
    }
    changeContent(ev){
        this.setState({
            contentVal: ev.target.value
        })
    }
    addCollection(ev){
        console.log('addCollection');
        let {user_id} = this.props.myInfo;
        console.log(this.props)
        let that = this;
        if(ev.keyCode==13){
            majax({
                url:`${cfg.url}/api/addCollection`,
                data: { name: this.state.cltVal, user_id}
            },function(res){
                console.log("edit addCollection");
                console.log(this);//在majax 执行callback就是执行该函数，此时this为空
                //如果想使用本上下文的this用that代替
                //如果想使用majax的this 在majax中call majax的this callback&&callback.call(this,res)
                console.log("edit addCollection");
                that.setState({
                        cltVal: ''
                    })
                that.props.updataCollection(res.data)
            });


        }
       
    }
    componentDidMount(){
        let that = this;
        let {user_id} = this.props.location.state.userInfo; 
        if(user_id){
            majax({
                url: `${cfg.url}/api/getCollection`,
                data: {user_id}
            },function(res){
                that.props.updataCollection(res.data);
                that.setState({
                    collections: res.data
                })
            })
        }
        $(this.refs.dropdown).dropdown();
        
    }
    componentWillUnmout(){
         $(this.refs.dropdown).off();
    }

    onsubmit(e){
        e.preventDefault();
        e.stopPropagation();
        let that = this;
        let {value: cltId} = this.refs.cltIdInput;
        let {titleVal, contentVal} = this.state;
        let {history,myInfo} = this.props;
        console.log('history');
        console.log(history);
        let {user_id} = this.props.myInfo;
        let {collectionName} = this;
        majax({
            url:`${cfg.url}/api/addArticle`,
            data: { 
                article_title: titleVal,
                article_content: contentVal,
                user_id,
                collection_id: cltId,
                collection_name: collectionName[cltId]
            }
        },function(res){
                that.setState({
                    titleVal:'',
                    contentVal: ''
                });
                history.push('/article', {
                    article_id: res.data.article_id,
                    article_title: res.data.article_title,
                    article_content:  res.data.article_content,
                    add_time : res.data.add_time,
                    user_id: myInfo.user_id,
                    user_name: myInfo.user_name,
                    avatar: myInfo.avatar,
                    user_intro: myInfo.user_intro
                });
        });


    }

    render(){

        let {changeTitle, changeClt, changeContent,addCollection,collectionName,onsubmit} = this;
        let {titleVal,cltVal,contentVal} = this.state;
        let {collections}  = this.props;
       if(!collections){
           collections = this.state.collections;
       }
        collections = collections.map((el,index)=>{
            collectionName[el.collection_id] = el.collection_name;
            return(
                <div className="item" key={index} data-value={el.collection_id}>
                    {el.collection_name}
                </div>
            )
        })
        return(
            <div className="ui container">
                <header className="ui header dividing">
                    <h1>写文章</h1>
                </header>
                <div
                    className="ui form"
                >
                    <div className="field">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="标题"
                            value = {titleVal}
                            onChange = {changeTitle}
                        />
                    </div>
                    <div className="fields">
                        <div className="field five wide column required">
                            <div className="ui selection dropdown" id="writeArtical"
                            ref="dropdown"
                            >
                                <input
                                    type="hidden"
                                    name="album"
                                    ref="cltIdInput"
                                />
                                <div className="default text">选择一个文集</div>
                                <i className="dropdown icon"></i>
                                <div className="menu">
                                    {collections}
                                </div>
                            </div>
                        </div>
                        <div className="field eleven wide column">
                            <input
                                type="text"
                                className=""
                                placeholder="回车, 添加文集"
                                value={cltVal}
                                onChange={changeClt}
                                onKeyDown={addCollection}
                            />
                
                        </div>
                    </div>
                    <div className="field">
                        <textarea
                            rows="16"
                            className=""
                            placeholder="随便写点文字. . ."
                            onChange = {changeContent}
                            value={contentVal}
                        >
                        </textarea>
                    </div>
                    <div className="field">
                        <button 
                            className="ui button primary"
                            onClick={onsubmit}
                        >保存</button>
                    </div>

                </div>
            </div>
        )
    }
}
export default Write;