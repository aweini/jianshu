import {Link} from 'react-router-dom';
import Preview from './Preview';
import S from "./style.scss";

export default function PreviewList(props){
    let {previews} = props;
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

        return(
            <Preview {...{
                article_id,
                article_title,
                previewContent,
                user_id,
                user_name,
                createdAt,
                avatar,
                user_intro
            }}
            key={index}
            >

            
            <Link to="" className={S.tag}>
                {collection_name}
            </Link>

            </Preview>
        )

    });

    return (
        <div>
            {previews}
        </div>
    )
}