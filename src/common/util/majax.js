import popPlugin from "common/util/popPlugin"
let pop = new popPlugin();
function majax(configs,callback,error){
    $.ajax(
        {
            type: configs.type||'post',
            url: configs.url,
            data: configs.data
        }).then(function(res){
            if(res.code!=0){
                pop.alert(res.msg);
            }
            callback&&callback(res)
        })
}

export default majax;