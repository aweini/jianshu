import popPlugin from "common/util/popPlugin"
let pop = new popPlugin();
function majax(configs,callback,error){
    $.ajax(
        {
            type: configs.type||'post',
            url: configs.url,
            data: configs.data
        }).then(function(res){
            console.log("$");
             console.log(this);//ajax的this
              console.log("$");
            if(res.code!=0){
                pop.alert(res.msg);
                return;
            }
            callback&&callback(res);
        })
}

export default majax;