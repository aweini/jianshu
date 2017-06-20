import {Link} from 'react-router-dom'

export default function Author(props){
    let {user} = props;
    let {user_name, avatar} = user;

    return(
        <div className="item">
            <Link to="/" className="ui mini avator image">
                <img src={avatar} alt=""/>
            </Link>
            <div className="content">
                <div className="header">
                    {user_name}
                </div>

            </div>
        </div>
    )
}