import cfg from 'config/config.json';
import S from './style.scss';

export default class Write extends React.Component{
    constructor(props){
        super(props)
        //let {myInfo} = this.props;//刷新就没了
        //let {state} = this.props.location;
        console.log('write constructor');
        console.log(this.props);
        this.state = {
            titleVal:'',
            cltVal: '',
            contentVal: ''
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
        if(ev.keyCode==13){
             console.log('回车');
            $.post(`${cfg.url}/addCollection`, {
                name: this.state.cltVal,
                user_id
            })
            .done(({code, data})=>{
                if(code==0){
                    this.setState({
                        cltVal: ''
                    })
                    this.props.updataCollection(data)
                }
                
            })
        }
       
    }
    componentDidMount(){
        $(this.refs.dropdown).dropdown();
        
    }
    componentWillUnmout(){
         $(this.refs.dropdown).off();
    }

    onsubmit(e){
        e.preventDefault();
        e.stopPropagation();
        let {value: cltId} = this.refs.cltIdInput;
        console.log(cltId);
        let {titleVal, contentVal} = this.state;
        let {user_id} = this.props.myInfo;
        let {collectionName} = this;
        $.post(`${cfg.url}/addArticle`,{
            article_title: titleVal,
            article_content: contentVal,
            user_id,
            collection_id: cltId,
            collection_name: collectionName[cltId]
        }).done((res)=>{
            if(res.code==0){
                this.setState({
                    titleVal:'',
                    contentVal: ''
                });
            }
        })
    }

    render(){
        let {changeTitle, changeClt, changeContent,addCollection,onsubmit,collectionName} = this;
        let {titleVal,cltVal,contentVal} = this.state;
        let {collections} = this.props;
        console.log('write render collections');
        console.log(this.props)

        collections = collections.map((el,index)=>{
            collectionName[el.id] = el.collection_name;
            return(
                <div className="item" key={index} data-value={el.id}>
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
                        <button type="submit"
                            className="ui button primary"
                            onClick={onsubmit}
                        >保存</button>
                    </div>

                </div>
            </div>
        )
    }
}