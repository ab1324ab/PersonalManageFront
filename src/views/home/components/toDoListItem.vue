<style lang="less">
    @import './styles/to-do-list-item.less';
</style>

<template>
    <Row class="to-do-list-item">
        <Col span="2" class="height-100">
            <Row type="flex" justify="center" align="middle" class="height-100">
                <Checkbox :id="contentObj.id+'checkbox'" v-model="todoitem"></Checkbox>
            </Row>
        </Col>
        <Col span="22" class="height-100">
            <Row type="flex" justify="start" align="middle" class="height-100">
                <p class="to-do-list-item-text" :id="contentObj.id+'p'" @click="handleHasDid(contentObj.id)" :class="{hasDid: todoitem}">{{ contentObj.content }}</p>
            </Row>
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
                            let checkbox = document.getElementById(id+"checkbox");
                            let p = document.getElementById(id+"p");
                            let checkboxInput = checkbox.children[0].children[1];
                            if(checkboxInput.checked == 'checked'){
                                checkboxInput.checked = '';
                            }else{
                                checkboxInput.checked = 'checked';
                            }
                            if(p.className.indexOf("hasDid") != -1){
                                p.className = p.className.replace("hasDid","");
                            }else{
                                p.className = p.className+" hasDid";
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