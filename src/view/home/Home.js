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
    }

    componentDidMount(){
        $.post(`${cfg.url}/getPreview`)
        .done(res=>{
            if(res.code==0){
                res.data.map((el,index)=>{
                    el.user.avatar = `http://api.noods.me${el.user.avatar}`
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
                    el.avatar = `http://api.noods.me${el.avatar}`
                })
                this.setState({
                    authors: res.data
                })
            }
        });
    }

    render(){
        let {previews, authors} = this.state;
        return ( 
            <div className="ui container grid">
                <div className="column twelve wide">
                    <PreviewList previews={previews}></PreviewList>
                </div>
                 <div className="column four wide">
                    <Recommend authors={authors}></Recommend>
                </div>
            </div>
        );
    }

}
