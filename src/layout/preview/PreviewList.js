import {Link} from 'react-router-dom';
import Preview from './Preview';
import S from "./style.scss";

export default function PreviewList(props){
    let {previews,initMyPage,collectionClick,pathname} = props;
    //previews = [];
    //id: article_id,  id取别名为article_id
    previews = previews.map((el , index)=>{
        let {
            _id: article_id, 
            article_title, add_time,
            article_content,
            user,
            the_collection
        } = el;
        
        let {avatar ,user_name, user_intro,_id: user_id} = user;
        let {collection_name, _id: collection_id} = the_collection;

        let collection = function(e){
            e.preventDefault();
            e.stopPropagation();
            collectionClick(collection_id, collection_name,user);
        }

        return(
            <Preview {...{
                article_id,
                article_title,
                user_id,
                user_name,
                add_time,
                avatar,
                user_intro,
                initMyPage,article_content
            }}
            key={index}
            >

            {
                collection_id&&pathname!='/my_page'?(
                    <Link to="" className={S.tag} onClick={collection}>
                        {collection_name}
                    </Link>
                ):null
            }
            

            </Preview>
        )

    });

    if(previews.length==0){
        previews = "暂时没有文章哦"
    }

    return (
        <div>
            {previews}
        </div>
    )
}