import cfg from 'config/config.json';
import S from './style.scss';
import {withRouter} from 'react-router-dom'
import majax from 'common/util/majax';
class Edit extends React.Component{
    constructor(props){
        super(props)
        //let {myInfo} = this.props;//刷新就没了
        //let {state} = this.props.location;
        console.log('edit constructor');
        console.log(this.props);
        this.state = {
            titleVal:'',
            cltVal: '',
            contentVal: '',
            defaultCollection:'',
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
        let that = this;
        let {user_id} = this.props.myInfo;
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
        console.log("componentDidMount");
        console.log(this.props.myInfo);
        let that = this;
        let {user_id} = this.props.location.state;
         //刷新后props传过来的属性就没了方法还在，但state里的东西一直存在
        if(user_id){
            majax({
                url: `${cfg.url}/api/getCollection`,
                data: {user_id}
            },function(res){
                this.props.updataCollection(res.data);
                this.setState({
                    collections: res.data
                })
            })
        }
        let {article_id} = this.props.location.state;
        if(article_id){
            majax({
                url: `${cfg.url}/api/getArticle`,
                data: {article_id}
            },function(res){
                that.setState({
                    titleVal: res.data.article_title,
                    contentVal: res.data.article_content,
                    defaultCollection: res.data.the_collection.collection_name
                })
                that.refs.cltIdInput.value = res.data.the_collection.collection_id;
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
        let {user_id} = this.props.myInfo;
        let {collectionName} = this;
        let {article_id} = this.props.location.state;

        majax({
                url:`${cfg.url}/api/editArticle`,
                data: { 
                    article_id,
                    article_title: titleVal,
                    article_content: contentVal,
                    collection_id: cltId,
                    user_id: user_id
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
        let {titleVal,cltVal,contentVal,defaultCollection} = this.state;
        let {collections } = this.props;
        if(!collections){
           collections = this.state.collections;
        }
       console.log('render');
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
                    <h1>编辑文章</h1>
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
                                <div className={`${defaultCollection?'':'default'}text`}>{defaultCollection?defaultCollection:'选择一个文集'}</div>
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
export default Edit;