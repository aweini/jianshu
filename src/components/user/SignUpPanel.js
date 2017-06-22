import S from './style.scss';
import Validation from 'util/validation'

export default class SignUpPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username:'',
            nameErr:'',
            password: '',
            passwordErr: '',
            cfPassword:'',
            cfPasswordErr:''
        }

        this.validator = new Validation();
        this.validator.addByValue('username',[
            {strategy: 'isEmpty',errorMsg: '用户名不能为空' },
            {strategy: 'hasSpace', errorMsg: '用户名不能有空格'},
            {strategy: 'maxLength:6', errorMsg: '最长为6'}
        ]);
        this.validator.addByValue('password',[
            {strategy: 'isEmpty',errorMsg: '密码不能为空' },
            {strategy: 'hasSpace', errorMsg: '密码不能有空格'},
            {strategy: 'maxLength:6', errorMsg: '最长为6'}
        ])


        this.nameChange = this.nameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.cfPasswordChange = this.cfPasswordChange.bind(this);
        this.submitRegister = this.submitRegister.bind(this);
        
       
    }

    nameChange(ev){
        let {target} = ev;
        let nameErr = this.validator.valiOneByValue('username',target.value)
        this.setState({
            username: target.value,
            nameErr
        });
        
    }
    passwordChange(ev){
        let {target} = ev;
        let passwordErr = this.validator.valiOneByValue('password',target.value);
        let {cfPasswordErr} = this.state;
        if(cfPasswordErr){
            this.cfPasswordChange();
        }
        this.setState({
            password: target.value,
            passwordErr
        });
    }

    cfPasswordChange(){
        let {passwordDom, cfPasswordDom} = this.refs;
        let cfPasswordErr = "";
        if(passwordDom.value != cfPasswordDom.value){
            cfPasswordErr= '两次输入密码不一致';
        }
        this.setState({
            cfPassword: cfPasswordDom.value,
            cfPasswordErr
        })
    }
    submitRegister(ev){
        ev.preventDefault();
        ev.stopPropagation();
        let {nameDom, passwordDom, cfpasswordDom} = this.refs;
        let {username, password, cfPassword} = this.state;
        let nameErr = this.validator.valiOneByValue("username",username);
        let passwordErr = this.validator.valiOneByValue("password",password);
        let cfPasswordErr = password== cfPassword?"":"两次输入密码不一致";
        this.setState({
            nameErr,
            passwordErr,
            cfPasswordErr
        });
        //console.log(!nameErr&&!passwordErr&&!cfPasswordErr);
        if(!nameErr&&!passwordErr&&!cfPasswordErr){
            this.props.signUpAjax({
                username, password, cfPassword
            })
        }
    }

    render(){
        let {nameChange, passwordChange, cfPasswordChange,submitRegister} = this;
        let {username, nameErr, password, passwordErr, cfPassword, cfPasswordErr} = this.state;
        let {signUpMsg} = this.props;

        let nameErrMsg = nameErr? <p className={S.err}>{nameErr}</p>:"";
        let passwordErrMsg = passwordErr? <p className={S.err}>{passwordErr}</p>:"";
        let cfPasswordErrMsg = cfPasswordErr? <p className={S.err}>{cfPasswordErr}</p>:"";

        let resInfo = null;
        if(signUpMsg){
            if(signUpMsg.code==0){
                resInfo = (
                    <div className="ui message positive">
                        <p>{signUpMsg.msg}</p>
                        <p>马上帮您登录</p>
                    </div>
                )
            }else{
                resInfo = (
                    <div className="ui message error">
                        <p>{signUpMsg.msg}</p>
                    </div>
                )
            }
        }
       

        return(
            <div className={S.sign_panel}>
                {resInfo}
                <form className="ui form">
                    <div className="field">
                        <input type="text" placeholder="用户名" ref="nameDom"
                        value={username}
                        onChange={nameChange}
                        />
                        {nameErrMsg}
                    </div>
                    <div className="field">
                        <input type="text" placeholder="密码" ref="passwordDom" 
                        value={password}
                        onChange={passwordChange}
                        />
                        {passwordErrMsg}
                    </div>
                    <div className="field">
                        <input type="text" placeholder="确认密码" ref="cfPasswordDom" 
                        value={cfPassword}
                        onChange = {cfPasswordChange}
                        />
                        {cfPasswordErrMsg}
                    </div>
                    <div className="field">
                        <button type="submit" className="ui button fluid primary" onClick={submitRegister}>
                            注册
                        </button>
                    </div>
                </form>

            </div>
        );
    }
}