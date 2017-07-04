import {Link} from 'react-router-dom';
import Preview from './Preview';
import S from "./style.scss";

export default function PreviewList(props){
    let {previews,initMyPage,collectionClick,pathname} = props;
    //previews = [];
    //id: article_id,  id取别名为article_id
    previews = previews.map((el , index)=>{
        let {
            id: article_id, 
            article_title, createdAt,
            preview: previewContent,
            collection_name,
            user_id,
            collection_id,
            user
        } = el;
        
        let {avatar ,user_name, user_intro} = user;

        let collection = function(e){
            e.preventDefault();
            e.stopPropagation();
            collectionClick(collection_id, collection_name,user);
        }

        return(
            <Preview {...{
                article_id,
                article_title,
                previewContent,
                user_id,
                user_name,
                createdAt,
                avatar,
                user_intro,
                initMyPage
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