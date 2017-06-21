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
        let passwordErr = this.validator.valiOneByValue('password',target.value)
        this.setState({
            password: target.value,
            passwordErr
        });
    }

    cfPasswordChange(ev){
        let {target} = ev;
        let {password} = this.state;
        let cfPasswordErr = "";
        if(password != target.value){
            cfPasswordErr= '两次输入密码不一致';
        }
        this.setState({
            cfPassword: target.value,
            cfPasswordErr
        })
    }

    render(){
        let {nameChange, passwordChange, cfPasswordChange} = this;
        let {username, nameErr, password, passwordErr, cfPassword, cfPasswordErr} = this.state;

        let nameErrMsg = nameErr? <p className={S.err}>{nameErr}</p>:"";
        let passwordErrMsg = passwordErr? <p className={S.err}>{passwordErr}</p>:"";
        let cfPasswordErrMsg = cfPasswordErr? <p className={S.err}>{cfPasswordErr}</p>:"";


        return(
            <div className={S.sign_panel}>
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
                        <input type="text" placeholder="确认密码" ref="cfpasswordDom" 
                        value={cfPassword}
                        onChange = {cfPasswordChange}
                        />
                        {cfPasswordErrMsg}
                    </div>
                    <div className="field">
                        <button type="submit" className="ui button fluid primary">
                            注册
                        </button>
                    </div>
                </form>

            </div>
        );
    }
}