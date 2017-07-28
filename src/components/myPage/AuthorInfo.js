import {Link} from 'react-router-dom';
import S from './style.scss';

export default function AuthorInfo(props){
    let {userInfo,initMyPage} = props;
    let {user_name, avatar, user_id} = userInfo;
    function authorInfoPage(e){
        e.preventDefault();
        e.stopPropagation();
        initMyPage(user_id,"","所有文章")
    }

    return (
        <div className={S.author_info}>
            <Link to="/" className={S.avatar} onClick={authorInfoPage}>
                <img src={avatar} alt=""/>
            </Link>
            <div className={S.title}>
                <Link to="/" className={S.name}>
                {user_name}
                </Link>
            </div>
        </div>
    )
}