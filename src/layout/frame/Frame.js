/**
 * Created by mahong on 17/6/19.
 */
import React from 'react';
import Nav from '../nav/Nav';
import cfg from '../../common/config/config.json';

export default class Frame extends React.Component{
    componentDidMount(){
        //$.post(`${cfg.url}/getPreview`)
        //.done(res=>{
        //
        //})
        $.ajax({
            url:`${cfg.url}/getPreview`,
            type: 'post',
            dataType:"json"
        })
        .done(res=>{

        })
    }
    render(){
        return (
            <div>
                <Nav/>
            </div>
            )
    }
}