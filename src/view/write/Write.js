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
            collections: [],
            titleVal:'',
            cltVal: '',
            contentVal: ''
        }

        this.changeTitle = this.changeTitle.bind(this);
        this.changeClt = this.changeClt.bind(this);
        this.changeContent = this.changeContent.bind(this);
        this.addCollection = this.addCollection.bind(this);
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
            changeContent: ev.target.value
        })
    }
    addCollection(ev){
        console.log('addCollection');
        let {user_id} = this.props.myInfo;
        if(ev.keyCode==13){
             console.log('回车');
            $.post(`${cfg.url}/api/addCollection`, {
                name: this.state.cltVal,
                user_id
            })
            .done(({code, data})=>{
                if(code==0){
                    this.setState({
                        collections: data,
                        cltVal: ''
                    })
                }
                
            })
        }
       
    }
    componentDidMount(){
        
        if(this.props.myInfo){
            let {user_id} = this.props.myInfo;
            $.post(`${cfg.url}/api/getCollection`,{user_id})
            .done((res)=>{
                if(res.code==0){
                     console.log("collections res.data");
                     console.log(res.data);
                    this.setState({
                        collections: res.data
                    })
                }
            })
        }
        
    }

    render(){
        let {changeTitle, changeClt, changeContent,addCollection} = this;
        let {collections,titleVal,cltVal,contentVal} = this.state;
        let {} = this.props;
        collections = collections.map((el,index)=>{
            return(
                <div className="item" key={index} data-value={el._id}>
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
                            <div className="ui selection dropdown" id="writeArtical">
                                <input
                                    type="hidden"
                                    name="album"
                                    ref="cltInput"
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
                        >{contentVal}
                        </textarea>
                    </div>
                    <div className="field">
                        <button type="submit"
                            className="ui button primary"
                        >保存</button>
                    </div>

                </div>
            </div>
        )
    }
}