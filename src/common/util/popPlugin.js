export default class PopPlugin {
    constructor(){
    }
    clear(){
        console.log("clear");
         let popPlugin = $(".pop_plugin");
        if(popPlugin){
            popPlugin.parent().remove();
           popPlugin.remove()
        }
    }
    alert(alertTip){
       this.clear();
        document.body.insertAdjacentHTML('beforeend', `<div class="ui modal pop_plugin">
            <i class="close icon"></i>
            <div class="header">
                    提示
            </div>
            <div class="image content">
                <div class="description">
                    <p>${alertTip}</p>
                </div>
            </div>
            <div class="actions">
                <div class="ui positive right button">
                    确定
                </div>
            </div>
        </div>`);
        $('.ui.modal')
        .modal({
            closable  : false,
            onApprove : function() {
            }
        })
        .modal('show');
    }

     confirm(alertTip, callback){
         this.clear();
        document.body.insertAdjacentHTML('beforeend', `<div class="ui modal pop_plugin">
            <i class="close icon"></i>
            <div class="header">
                    提示
            </div>
            <div class="image content">
                <div class="description">
                    <p>${alertTip}</p>
                </div>
            </div>
            <div class="actions">
                 <div class="ui black deny button">
                  取消
                </div>
                <div class="ui positive right button">
                    确定
                </div>
            </div>
        </div>`);
        $('.ui.modal')
        .modal({
            closable  : false,
            onDeny    : function(){
            },
            onApprove : function() {
                callback&&callback()
            }
        })
        .modal('show');
    }
}