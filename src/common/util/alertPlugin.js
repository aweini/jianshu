class AlertPlugin extends React.Component{
    constructor(props){
        super(props);
        console.log("AlertPlugin.props")
        console.log(this.props);
        this.denyDelete = this.props.denyDelete;
        this.approveDelete = this.props.approveDelete;
    }

    componentWillReceiveProps(nextProps){
        // let {showAlert} = this.props;
        // console.log('showAlert 不变 太快 ，nextProps变');
        // console.log(showAlert);
        // console.log(nextProps);
        var that = this;
        let {showAlert} = nextProps;
        if(nextProps.showAlert){
            $('.ui.modal')
            .modal({
                closable  : false,
                onDeny    : function(){
                    that.denyDelete&&that.denyDelete()
                },
                onApprove : function() {
                    that.approveDelete&&that.approveDelete()
                }
            })
            .modal('show');
        }else{
            $('.ui.modal').modal('hide');
        }
        
    }
    
    
    render(){
        let {alertTip} = this.props;
        return (
        <div className="ui modal">
            <i className="close icon"></i>
            <div className="header">
                    提示
            </div>
            <div className="image content">
                <div className="description">
                    <p>{alertTip}</p>
                </div>
            </div>
            <div className="actions">
                <div className="ui black deny button">
                  取消
                </div>
                <div className="ui positive right button">
                    确定
                </div>
            </div>
        </div>
    )
    }
    
}

export default AlertPlugin;