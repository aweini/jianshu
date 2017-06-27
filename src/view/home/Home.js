/**
 * Created by mahong on 17/6/20.
 */
import PreviewList from 'preview/PreviewList';
import Recommend from 'home/Recommend';
import cfg from 'config/config.json';

export default class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            previews:[],
            authors:[]
        }
       this.collectionClick = this.collectionClick.bind(this);
    }

    componentDidMount(){
        $.post(`${cfg.url}/getPreview`)
        .done(res=>{
            if(res.code==0){
                res.data.map((el,index)=>{
                    el.user.avatar = cfg.url + el.user.avatar;
                   // el.user.avatar = `http://api.noods.me${el.user.avatar}`
                })
                this.setState({
                    previews: res.data
                })
            }
        });
        $.post(`${cfg.url}/getAuthor`)
        .done(res=>{
            if(res.code==0){
                res.data.map((el,index)=>{
                    el.avatar = cfg.url + el.avatar;
                    //el.avatar = `http://api.noods.me${el.avatar}`
                })
                this.setState({
                    authors: res.data
                })
            }
        });
    }

    collectionClick(collection_id,collection_name, userInfo){
        let {history, initMyPage} = this.props;
        history.push('/my_page',{userInfo});
        initMyPage(userInfo.user_id, {collection_id}, collection_name);
    }

    render(){
        let {previews, authors} = this.state;
        let {initMyPage} = this.props;
        let {collectionClick} = this;
        
        return ( 
            <div className="ui container grid">
                <div className="column twelve wide">
                    <PreviewList {...{previews,initMyPage,collectionClick}}></PreviewList>
                </div>
                 <div className="column four wide">
                    <Recommend {...{authors,initMyPage}}></Recommend>
                </div>
            </div>
        );
    }

}
