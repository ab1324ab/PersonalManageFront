<style lang="less">
    @import './styles/to-do-list-item.less';
</style>

<template>
    <Row class="to-do-list-item">
        <Col span="2" class="height-100">
            <Row type="flex" justify="center" align="middle" class="height-100">
                <Icon type="ios-checkmark" size="20" :color="iconColor" :id="contentObj.id+'Icon'"/>
            </Row>
        </Col>
        <Col span="20" class="height-100">
            <Row type="flex" justify="start" align="middle" class="height-100">
                <p class="to-do-list-item-text" :id="contentObj.id+'p'" @click="handleHasDid(contentObj.id)" :class="{hasDid: todoitem}">{{ contentObj.content }}</p>
            </Row>
        </Col>
        <Col span="2">
            <p class="to-do-list-item-text" :id="contentObj.id+'pText'" @click="handleHasDid(contentObj.id)">{{todoText}}</p>
        </Col>
        <!-- <Col span="4" class="height-100">
            <Row type="flex" justify="center" align="middle" class="infor-icon-row height-100">
                <Icon @click.native="showItemInfor" type="information-circled" size="20"></Icon>
            </Row>
        </Col> -->
    </Row>
</template>

<script>
    import $util from '@/libs/util.js';
    var qs = require('qs');

export default {
    name: 'toDoListItem',
    data () {
        return {

        };
    },
    props: {
        contentObj: {}
    },
    computed:{
        todoitem(){
            if(this.contentObj.isFinished == '1'){
                return true;
            }else{
                return false;
            }
        },
        iconColor(){
            if(this.contentObj.isFinished == '1'){
                return "green";
            }else{
                return "red";
            }
        },
        todoText(){
            if(this.contentObj.isFinished == '1'){
                return "已完成";
            }else{
                return "未完成";
            }
        }
    },
    methods: {
        handleHasDid (id) {
            let url = "updateTodo";
            let _this = this;
            let data = qs.stringify({
                "id":id,
            });
            $util.post(url,data)
                .then(function (response) {
                    if(response.status == 200){
                        if(response.data.statusCode == "10000"){
                            let p = document.getElementById(id+"p");
                            let icon = document.getElementById(id+"Icon");
                            let pText = document.getElementById(id+"pText");
                            if(p.className.indexOf("hasDid") != -1){
                                p.className = p.className.replace("hasDid","");
                            }else{
                                p.className = p.className+" hasDid";
                            }
                            if(icon.style.color == "red"){
                                icon.style.color = "green"
                            }else{
                                icon.style.color = "red"
                            }
                            if(pText.innerText == "已完成"){
                                pText.innerText = "未完成";
                            }else{
                                pText.innerText = "已完成";
                            }
                        }else {
                            $util.responseMsg(_this,response.data);
                        }
                    }else{
                        $util.httpErrorMsg(_this,response.data)
                    }
                })
                .catch(function (error) {
                    $util.httpErrorMsg(_this,error.data)
                })
        }
    }
};
</script>