import Panel from 'user/Panel';
import SignUpPanel from 'user/SignUpPanel';

export default class SignUp extends React.Component{
    constructor(props){
        super(props);
    }
    componentWillUnmount(){
        this.props.clearTipMsg();
    }
    render(){
        let {signUpAjax, signUpMsg} = this.props;
        return (
            <Panel>
                <SignUpPanel {...{signUpAjax, signUpMsg}}></SignUpPanel>
            </Panel>
        )
    }
}