import S from './style.scss';
import cfg from 'config/config.json';
//import userImage from 'common/images/user.png'
import 'common/util/resize.min.js';
import majax from 'common/util/majax';
export default class Aside extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            inEdit: false,
            editVal: '',
            userImage: ''
        }
        this.notebooksClick = this.notebooksClick.bind(this);
        this.editMe = this.editMe.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.editDone = this.editDone.bind(this);
        this.editContent = this.editContent.bind(this);
        this.uploadImg = this.uploadImg.bind(this);
    }

    notebooksClick(collection_id, collection_name, userInfo){
        let {notebooksClick} = this.props;
        notebooksClick(collection_id, collection_name, userInfo);
        console.log("notebooksClick");
        console.log(collection_id,collection_name,userInfo);
    }
    editMe(e){
       // e.preventDefault();
       // e.stopPropagation();
       let {userInfo} = this.props;
       let {user_intro, avatar} = userInfo;
        this.setState({
            inEdit: true,
            editVal: user_intro,
            userImage : avatar
        })
    }
    cancelEdit(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            inEdit: false
        })
    }
    editDone(e){
        let that = this;
        e.preventDefault();
        e.stopPropagation();
        let {editVal} = this.state;
        let { userInfo:{user_id}, upDateMyInfo} = this.props;
        let avatar = this.refs.userImg.src;
        //let avatar = $(that.refs.imageUpload)[0].files[0]; //这样jquery传不过去，原生的ajax也不能传啊，因为它的值不是字符串
        let formData = new FormData();
        formData.append('avatar', $(that.refs.imageUpload)[0].files[0]);
        formData.append('user_intro', editVal);
        formData.append('user_id',user_id);
        // majax({
        //     url:`${cfg.url}/api/editUserInfo`,
        //     data: {avatar, user_intro: editVal}
        // },function(res){
        //         upDateMyInfo(editVal, avatar);
        //         that.setState({
        //             inEdit: false
        //         })
        // });
        $.ajax({
            url: `${cfg.url}/api/editUserInfo`,
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false
        }).done(function(res) {
             upDateMyInfo(editVal, avatar);
                that.setState({
                    inEdit: false
                })
        }).fail(function(res) {});



        
    }
    editContent(ev){
        this.setState({
            editVal: ev.target.value
        })
    }

   uploadImg(e){
     var that = this;
     console.log(e.target.files);
    //  if(e.target.files&&e.target.files[0]){
    //      var destFile = e.target.files[0];
    //      if(destFile.type.indexOf("image")<0){
    //          alert("请上传图片");
    //      }
    //      var reader = new FileReader();
         
    //      reader.readAsDataURL(destFile);
    //      reader.onload = function(e){
    //          console.log('e.target.result.length');
    //          console.log(e.target.result.length);
    //          that.refs.userImg.src =  e.target.result;
    //      }
    //  }
    
    
    if(e.target.files&&e.target.files[0]){
         canvasResize(e.target.files[0], {
            crop: false,
            quality: 0.9,
            rotate: 0,
            callback(baseStr) {
             // console.log(baseStr)
              console.log(baseStr.length)
              that.refs.userImg.src =  baseStr;
            }
          })
    }
       

   }

    render(){
        let {userInfo, notebooks,isMe} = this.props;
        let {user_intro} = userInfo;
        let {notebooksClick, editMe, cancelEdit, editDone, editContent, uploadImg} = this;
        let {inEdit, editVal, userImage} = this.state;
        user_intro = user_intro?user_intro:"用户暂时没写自我介绍哦";
        notebooks = notebooks.map((el, index)=>{
            let {collection_name,collection_id } = el;
            return (
                 <div
                    className="item"
                    key={index}
                    onClick={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        notebooksClick(collection_id, collection_name, userInfo)
                    }}
                >
                    <i className="book icon"></i>
                    <div className="content">
                        {collection_name}
                    </div>

                </div>
            )
        })
        if(notebooks.length==0){
            notebooks = "暂时没有文集哦"
        }
        return(
            <div className={S.aside}>
                <div className="introduce">
                    <div className="title">
                        个人介绍

                        {inEdit?(
                             <form
                                    action=""
                                    className="ui form"
                                    onSubmit={editDone}
                                >
                                    <div className={S.img_label}>
                                        <img className={`ui medium circular image ${S.user_img}`} ref="userImg" src={userImage} />
                                        <input ref="imageUpload" type="file" className={S.img_input} onChange={(e)=>{
                                            uploadImg(e)
                                        }}/>
                                        <div className={S.img_tip}>上传头像</div>
                                    </div>
                                    
                                    <div className="field">
                                        <textarea
                                            value={editVal}
                                            onChange={editContent}
                                        ></textarea>
                                    </div>
                                    <button className="ui positive button" type="submit">
                                        提交
                                    </button>
                                    <button
                                        className="ui negative button"
                                        type="submit"
                                        onClick={cancelEdit}
                                    >
                                        取消
                                    </button>
                                </form>
                        ):(<p>{user_intro}</p>)}


                        {isMe&&!inEdit?(
                            <div className="ui button tiny basic floated" onClick={editMe}>
                                <i className="icon write"></i>
                                    编辑
                            </div>
                        ):null}
                        
                    </div>
                </div>
                <div className="ui divider hidden"></div>
                <div className={S.volume}>
                    <div className={S.title}>我的文集</div>
                </div>
                <div className="ui list">
                {notebooks}
                </div>
            </div>
        )
    }
}