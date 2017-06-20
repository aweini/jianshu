import {Link} from 'react-router-dom';
import Author from './Author';
import S from './style.scss';

export default function Recommend({authors}){
    //authors = [];
    return (
        <div className={$.recommend}>
            <div className={S.title}>
                <span>推荐作者列表</span>
            </div>
            <div className="ui item">
                {
                    authors.map((el,index)=>{
                        return(
                            <Author {...{
                                user: el
                            }}
                            key={index}
                            >
                            </Author>
                        )
                    })
                }
            </div>
        </div>
    )
}