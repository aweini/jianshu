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
        console.log("my page");
     console.log(props.initMyPage);
    }
    
    render(){
        let {previewsName, notebooks, myPagePreviews,initMyPage} = this.props;
        return(
            <div className="ui container grid">
                <div className="twelve wide column">
                    <AuthorInfo></AuthorInfo>
                    <div className="ui secondary pointing menu">
                        <span className="active item">
                             {previewsName}
                        </span>
                    </div>
                    <PreviewList {...{previews: myPagePreviews,initMyPage}}></PreviewList>
                </div>
                <div className="four wide column">
                    <Aside {...{notebooks}}></Aside>
                </div>
            </div>

        )
    }
}

MyPage.propTypes = propTypes;