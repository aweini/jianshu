/**
 * Created by mahong on 17/6/20.
 */
import PreviewList from 'preview/PreviewList';
import Recommend from 'home/Recommend';
import cfg from 'config/config.json';
import S from './style.scss';
import majax from 'common/util/majax';

export default class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pageIndex: 1,
            pageNum: 10,
            previews:[],
            authors:[],
            more: true
        }
        console.log('test home props');
        console.log(this.props);
         console.log('test home props');
       this.collectionClick = this.collectionClick.bind(this);
       this.getPreviews = this.getPreviews.bind(this);
    }

    getPreviews(){
        let that = this;
        let {pageIndex, pageNum,previews} = this.state;
        majax({
            url:`${cfg.url}/api/article/getPreview`,
            data: {pageIndex,pageNum}
        },function(res){
            if(res.data.length<pageNum){
                that.setState({
                    previews: previews.concat(res.data),
                    more: false
                })
            }else{
                pageIndex++;
                that.setState({
                    previews: previews.concat(res.data),
                    pageIndex
                })
            }
                
        });
    }

    componentDidMount(){
        let that = this;
        this.getPreviews();
        majax({
            url:`${cfg.url}/api/user/getAuthor`
        },function(res){
            that.setState({
                authors: res.data
            })
        });

        let previewListWrapper = this.refs.previewListWrapper;
        $(previewListWrapper).scroll(function(e){
            if(e.currentTarget.scrollTop + e.currentTarget.offsetHeight >=e.currentTarget.scrollHeight){
                console.log('more');
                let more = that.state;
                if(more){
                    that.getPreviews();
                }
                
            }
        })


    }

    collectionClick(collection_id,collection_name, userInfo){
        let {history, initMyPage} = this.props;
        history.push('/my_page',{userInfo});
        initMyPage(userInfo.user_id, collection_id, collection_name);
    }

    render(){
        let {previews, authors} = this.state;
        let {initMyPage} = this.props;
        let {collectionClick} = this;
        
        return ( 
            <div className={`ui container grid ${S.preview_list_wrapper}`} ref="previewListWrapper">
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
