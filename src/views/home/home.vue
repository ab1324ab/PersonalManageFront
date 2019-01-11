<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="8" :lg="8">
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="24" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <!--<Row>-->
                                <!--<Col :md="12" :lg="12">-->
                                    <Row type="flex" class="user-infor-img">
                                        <Col span="24">
                                            <Row class-name="made-child-con-middle" type="flex" align="middle">
                                                <img class="avator-img margin-auto" :src="avatorPath" />
                                            </Row>
                                        </Col>
                                    </Row>
                                <!--</Col>-->
                                <!--<Col :md="12" :lg="12">-->
                                    <Row type="flex" class="user-infor">
                                        <Col span="24" style="padding-left:6px;">
                                            <Row class-name="made-child-con-middle" type="flex" align="middle">
                                                <div class="margin-auto">
                                                    <b class="card-user-infor-name">Admin</b>
                                                    <p style="text-align: center;">{{loginObj.nickname}}</p>
                                                </div>
                                            </Row>
                                        </Col>
                                    </Row>
                                <!--</Col>-->
                            <!--</Row>-->
                            <div class="line-gray"></div>
                            <Row class="margin-top-9">
                                <Col span="8"><p class="notwrap">上次登录时间:</p></Col>
                                <Col span="16" class="padding-left-8">{{loginObj.oldLoginTime}}</Col>
                            </Row>
                            <Row class="margin-top-9">
                                <Col span="8"><p class="notwrap">上次登录IP:</p></Col>
                                <Col span="16" class="padding-left-8">{{loginObj.oldIp}}</Col>
                            </Row>
                            <Row class="margin-top-9">
                                <Col span="8"><p class="notwrap">上次登录地点:</p></Col>
                                <Col span="16" class="padding-left-8">{{loginObj.oldIpAddress}}</Col>
                            </Row>
                        </Card>
                    </Col>
                    <!--<Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="android-checkbox-outline"></Icon>
                                待办事项
                            </p>
                            <a type="text" slot="extra" @click.prevent="addNewToDoItem">
                                <Icon type="plus-round"></Icon>
                            </a>
                            <Modal
                                v-model="showAddNewTodo"
                                title="添加新的待办事项"
                                @on-ok="addNew"
                                @on-cancel="cancelAdd">
                                <Row type="flex" justify="center">
                                    <Input v-model="newToDoItemValue" icon="compose" placeholder="请输入..." style="width: 300px" />
                                </Row>
                                <Row slot="footer">
                                    <Button type="text" @click="cancelAdd">取消</Button>
                                    <Button type="primary" @click="addNew">确定</Button>
                                </Row>
                            </Modal>
                            <div class="to-do-list-con">
                                <div v-for="(item, index) in toDoList" :key="index" class="to-do-item">
                                    <to-do-list-item :content="item.title"></to-do-list-item>
                                </div>
                            </div>
                        </Card>
                    </Col>-->
                </Row>
            </Col>
            <Col :md="16" :lg="16">
                <Row :gutter="5">
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="excel_count"
                            :end-val="count.excelCount"
                            iconType="md-grid"
                            color="#2d8cf0"
                            intro-text="表格文档总数"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="word_count"
                            :end-val="count.wordCount"
                            iconType="ios-paper-outline"
                            color="#64d572"
                            :iconSize="50"
                            intro-text="文本文档总数"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="img_count"
                            :end-val="count.imgCount"
                            iconType="md-images"
                            color="#ffd572"
                            intro-text="图片总数"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="plan_count"
                            :end-val="count.planCount"
                            iconType="ios-barcode-outline"
                            color="#f25e43"
                            intro-text="计划总数"
                        ></infor-card>
                    </Col>
                </Row>
                <Row :gutter="10">
                    <Col :md="12" :lg="12" :style="{marginBottom: '10px'}">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="android-map"></Icon>
                                数量分类统计
                            </p>
                            <div class="data-source-row">
                                <visite-volume ref="visiteVolume" :counts="count"></visite-volume>
                            </div>
                        </Card>
                    </Col>
                    <Col :md="12" :lg="12" :style="{marginBottom: '10px'}">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="ios-pulse-strong"></Icon>
                                数据来源统计
                            </p>
                            <div class="data-source-row">
                                <data-source-pie ref="dataSourcePie" :counts="count"></data-source-pie>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
        <!--<Row :gutter="10" class="margin-top-10">-->
            <!--<Col :md="24" :lg="8" :style="{marginBottom: '10px'}">-->
                <!--<Card>-->
                    <!--<p slot="title" class="card-title">-->
                        <!--<Icon type="android-map"></Icon>-->
                        <!--上周每日来访量统计-->
                    <!--</p>-->
                    <!--<div class="data-source-row">-->
                        <!--<visite-volume></visite-volume>-->
                    <!--</div>-->
                <!--</Card>-->
            <!--</Col>-->
            <!--<Col :md="24" :lg="8" :style="{marginBottom: '10px'}">-->
                <!--<Card>-->
                    <!--<p slot="title" class="card-title">-->
                        <!--<Icon type="ios-pulse-strong"></Icon>-->
                        <!--数据来源统计-->
                    <!--</p>-->
                    <!--<div class="data-source-row">-->
                        <!--<data-source-pie></data-source-pie>-->
                    <!--</div>-->
                <!--</Card>-->
            <!--</Col>-->
            <!--<Col :md="24" :lg="8">-->
                <!--<Card>-->
                    <!--<p slot="title" class="card-title">-->
                        <!--<Icon type="android-wifi"></Icon>-->
                        <!--各类用户服务调用变化统计-->
                    <!--</p>-->
                    <!--<div class="data-source-row">-->
                        <!--<user-flow></user-flow>-->
                    <!--</div>-->
                <!--</Card>-->
            <!--</Col>-->
        <!--</Row>-->
        <Row>
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="android-checkbox-outline"></Icon>
                    待办事项
                </p>
                <a type="text" slot="extra" @click.prevent="addNewToDoItem">
                    <Icon type="md-add-circle" size="23"></Icon>
                </a>
                <Modal
                        v-model="showAddNewTodo"
                        title="添加新的待办事项"
                        @on-ok="addNew"
                        @on-cancel="cancelAdd">
                    <Row type="flex" justify="center">
                        <Input v-model="newToDoItemValue" icon="ios-create-outline" placeholder="请输入..." style="width: 300px" />
                    </Row>
                    <Row slot="footer">
                        <Button type="text" @click="cancelAdd">取消</Button>
                        <Button type="primary" @click="addNew">确定</Button>
                    </Row>
                </Modal>
                <div class="to-do-list-con" :style="{height: toDoListConH}">
                    <div v-for="(item, index) in toDoList" :key="index" class="to-do-item">
                        <to-do-list-item :contentObj="item"></to-do-list-item>
                    </div>
                </div>
            </Card>
        </Row>
    </div>
</template>

<script>
import cityData from './map-data/get-city-value.js';
import homeMap from './components/map.vue';
import dataSourcePie from './components/dataSourcePie.vue';
import visiteVolume from './components/visiteVolume.vue';
import serviceRequests from './components/serviceRequests.vue';
import userFlow from './components/userFlow.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import mapDataTable from './components/mapDataTable.vue';
import toDoListItem from './components/toDoListItem.vue';
import $util from '@/libs/util.js';
var qs = require('qs');

export default {
    name: 'home',
    components: {
        homeMap,
        dataSourcePie,
        visiteVolume,
        serviceRequests,
        userFlow,
        countUp,
        inforCard,
        mapDataTable,
        toDoListItem
    },
    data () {
        return {
            loginObj: {
                oldIp: "",
                oldIpAddress: "",
                oldLoginTime: "",
                nickname:''
            },
            toDoList: [],
            count: {
                excelCount: 0,
                wordCount: 0,
                imgCount: 0,
                planCount: 0,
            },
            cityData: cityData,
            showAddNewTodo: false,
            newToDoItemValue: '',
            toDoListConH:'0px'
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        },
    },
    methods: {
        addNewToDoItem () {
            this.showAddNewTodo = true;
        },
        addNew () {
            if (this.newToDoItemValue.length == 0) {
                this.$Message.error('请输入待办事项内容');
                return;
            }
            let url = "addTodo";
            let _this = this;
            let data = qs.stringify({
                "content":this.newToDoItemValue
            });
            $util.post(url,data)
                .then(function (response) {
                    if(response.status == 200){
                        if(response.data.statusCode == "10000"){
                            _this.toDoList.unshift({
                                content: response.data.data.content,
                                id: response.data.data.id,
                                isFinished: response.data.data.isFinished
                            });
                            setTimeout(() => {
                                _this.newToDoItemValue = '';
                            }, 200);
                            _this.showAddNewTodo = false;
                        }else {
                            $util.responseMsg(_this,response.data);
                        }
                    }else{
                        $util.httpErrorMsg(_this,response.data)
                    }
                })
                .catch(function (error) {
                    $util.httpErrorMsg(_this,error.data)
                });
        },
        cancelAdd () {
            this.showAddNewTodo = false;
            this.newToDoItemValue = '';
        },
        init(){
            let url = "initHomeInfo";
            let _this = this;
            $util.post(url,{})
                .then(function (response) {
                    if(response.status == 200){
                        if(response.data.statusCode == "10000"){
                            _this.count.excelCount = parseInt(response.data.data.excelCount);
                            _this.count.imgCount = parseInt(response.data.data.imgCount);
                            _this.count.wordCount = parseInt(response.data.data.wordCount);
                            _this.count.planCount = parseInt(response.data.data.planCount);
                            _this.toDoList = response.data.data.todoList;
                            _this.$refs.visiteVolume.hideLoading();
                            _this.$refs.dataSourcePie.hideLoading();
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
        },
        toDoListCon (){
            var docHeight = document.body.scrollHeight;
            docHeight = docHeight - 614;
             //console.info(docHeight);
            if(docHeight < 200){
                 docHeight = 200;
            }
            this.toDoListConH = docHeight +'px';
        }

    },
    mounted () {
        this.toDoListCon();
    },
    created () {
        this.loginObj.oldIp = localStorage.getItem("oldIp");
        this.loginObj.oldIpAddress = localStorage.getItem("oldIpAddress");
        this.loginObj.oldLoginTime = localStorage.getItem("oldLoginTime");
        this.loginObj.nickname = localStorage.getItem("nickname");
        this.init();
    }
};
</script>
