import S from './style.scss';

import Validation from 'util/validation';

export default class SignInPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            nameErr: false,
            passwordErr: false
        }
        this.validator = new Validation();
        this.validator.addByValue('username',[
            {strategy: 'isEmpty', errorMsg: '用户名不能为空'},
            {strategy: 'hasSpace', errorMsg: '用户名不能有空格'},
            {strategy: 'maxLength:6', errorMsg: '最长为6'}
        ]);

        this.validator.addByValue('password',[
            {strategy: 'isEmpty', errorMsg: '密码不能为空'},
            {strategy: 'hasSpace', errorMsg: '密码不能有空格'},
            {strategy: 'maxLength:6', errorMsg: '最长为6'}
        ]);

        this.nameChange = this.nameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    nameChange(ev){
        let {target} = ev;
        let msg = this.validator.valiOneByValue('username', target.value);
        this.setState({
            username: target.value,
            nameErr: msg
        })
    }
    passwordChange(ev){
        let {target} = ev;
        let msg = this.validator.valiOneByValue('password', target.value);
        this.setState({
            password: target.value,
            passwordErr: msg
        })
    }

    submitLogin(ev){
        ev.preventDefault();
        ev.stopPropagation();
        let {nameDom, passwordDom} = this.refs;
        let {signInAjax} = this.props;
        //没有填写过用户名密码，所以要验证
        let nameErr = this.validator.valiOneByValue('username', nameDom.value);
        let passwordErr = this.validator.valiOneByValue('password', passwordDom.value);
         this.setState({
                nameErr,
                passwordErr
            })
        if(nameErr!==''&&passwordErr!==''){
            //用state里的username 会更快
            signInAjax({
                username:nameDom.value,
                password:passwordDom.value
            })
        }
        

    }

    render(){

        let {nameChange, passwordChange, submitLogin} = this;
        let {username, password, nameErr, passwordErr} = this.state;
        let nameErrMsg = nameErr?(
            <p className={S.err}>{nameErr}</p>
        ) : null;

        let passwordErrMsg = passwordErr?(
            <p className={S.err}>{passwordErr}</p>
        ):null;

        let {signInMsg} = this.props;
        let resInfo = null;
        if(signInMsg&&signInMsg.code!=0){
            resInfo = (
                <div className="ui message error"> 
                    <p>{signInMsg.msg}</p>
                </div>
            )
        }

        return(
            <div className={S.sign_panel}>
                {resInfo}
                <form className="ui form">
                    <div className={`field ${nameErr?'error':''}`}>
                        <input 
                            type="text" 
                            placeholder="用户名" 
                            ref="nameDom"
                            value = {username}
                            onChange = {nameChange}
                        />
                        {nameErrMsg}
                    </div>
                    <div className={`field ${passwordErr?'error':''}`}>
                        <input 
                            type="text" 
                            placeholder="密码" 
                            ref="passwordDom" 
                            value={password}
                            onChange = {passwordChange}
                        />
                        {passwordErrMsg}
                    </div>
                    <div className="field">
                        <button type="submit" className="ui button fluid primary" onClick={submitLogin}>
                            登录
                        </button>
                    </div>
                </form>

            </div>
        );
    }
}