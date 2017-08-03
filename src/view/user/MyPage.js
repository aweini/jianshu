import {Link} from 'react-router-dom';
import AuthorInfo from "components/myPage/AuthorInfo";
import Aside from "components/myPage/Aside";
import PreviewList from 'preview/PreviewList'

let propTypes = {
    previewsName: PT.string,
    notebooks: PT.array,
    myPagePreviews: PT.array
}

export default class MyPage extends React.Component{
    constructor(props){
        super(props);
        this.notebooksClick = this.notebooksClick.bind(this);
        let {pathname} = props.location;
        this.pathname = pathname;
    }

    notebooksClick(collection_id, collection_name, userInfo){
        let {initMyPage} = this.props;
        console.log(["mypage collection_id",collection_id])
        initMyPage(userInfo.user_id, collection_id, collection_name);
    }
    
    render(){
        let {previewsName, notebooks, myPagePreviews,initMyPage,location,myInfo,upDateMyInfo} = this.props;
        let {userInfo} = location.state;
        let {notebooksClick,pathname} = this;
        let isMe = false;
        if(myInfo){
             isMe = (myInfo.user_id == userInfo.user_id)? true: false;
             if(isMe){
                userInfo = myInfo;
             }
            
        }
        return(
            <div className="ui container grid scroll_height">
                <div className="twelve wide column scroll_height">
                    <AuthorInfo {...{userInfo,initMyPage}}></AuthorInfo>
                    <div className="ui secondary pointing menu">
                        <span className="active item">
                             {previewsName}
                        </span>
                    </div>
                    <PreviewList {...{previews: myPagePreviews,initMyPage,pathname}}></PreviewList>
                </div>
                <div className="four wide column">
                    <Aside {...{notebooks,userInfo,notebooksClick,isMe,upDateMyInfo}}></Aside>
                </div>
            </div>

        )
    }
}

MyPage.propTypes = propTypes;