import Panel from 'user/Panel';
import SignInPanel from 'user/SignInPanel';
import Test from 'user/Test'
console.log("Panel");
console.log(Panel.toString());
console.log("SignInPanel");
console.log(SignInPanel.toString());
console.log("Test");
console.log(Test.toString());
export default class SignIn extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let {signInAjax, signInMsg} = this.props;
        return (
            <Panel>
                <SignInPanel {...{signInAjax, signInMsg}}></SignInPanel>
            </Panel>
        )
    }
}