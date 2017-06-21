import Panel from 'user/Panel';
import SignUpPanel from 'user/SignUpPanel';

export default class SignUp extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <Panel>
                <SignUpPanel></SignUpPanel>
            </Panel>
        )
    }
}