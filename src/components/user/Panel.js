import { NavLink } from 'react-router-dom';
import S from './style.scss';
//React 的 JSX 使用大、小写的约定来区分本地组件的类和 HTML 标签。
//若果遇到 jsx写的<div></div>  react jsx babel会解释为react.createElement....
//要渲染 HTML 标签，只需在 JSX 里使用小写字母开头的标签名。
//var myDivElement = <div className="foo" />;
//React.render(myDivElement, document.getElementById('example'));
//要渲染 React 组件，只需创建一个大写字母开头的本地变量。
//var MyComponent = React.createClass({/*...*/});
//var myElement = <MyComponent  />;
//React.render(myElement, document.getElementById('example'));

export default function Panel({children}){
    return(
        <div className="ui stackable grid container center aligned">
            <div className={`six wide column ${S.main}`}>
                <h4 className={S.title}>
                    <div className={S['normal-title']}>
                        <NavLink to="/sign_in" activeClassName={S.active}>
                            登录
                        </NavLink>
                        <b>.</b>
                        <NavLink to="/sign_up" activeClassName={S.active}>
                            注册
                        </NavLink>
                    </div>
                </h4>
                {children}
            </div>
        </div>
    )
}