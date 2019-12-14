<style>
    #wordForm div {
        margin-right: 0px !important;
        margin-bottom: 0px;
    }

    #wordForm label {
        padding-right: 0px !important;
        text-align: center;
    }
</style>

<template>
    <div @keydown.enter="initWordPlan">
        <Row :gutter="10">
            <Col :sm="20" :xs="24">
                <Modal
                        width="900px"
                        v-model="detailedInfoModal.modalShow"
                        :mask-closable="false">
                    <p slot="header">
                        <Icon type="md-information-circle"></Icon>
                        <span>{{detailedInfoModal.modalName}}</span>
                    </p>
                    <div>
                        <vtable :workData="workData" :workColumns="workColumns"></vtable>
                    </div>
                    <div slot="footer">
                        <Button type="text" @click="detailedInfoModal.modalShow = false">取消</Button>
                        <Button type="primary" @click="updateWordPlan">保存</Button>
                    </div>
                </Modal>
                <Modal
                        width="900px"
                        v-model="detailedInfoModal.newWordModal"
                        :mask-closable="false">
                    <p slot="header">
                        <Icon type="md-information-circle"></Icon>
                        <span>新建计划</span>
                    </p>
                    <div>
                        <table class="vtable">
                            <tr>
                                <td>计划名称</td>
                                <td ><Input v-model="workData.name" style="border: 1px solid #a6dbff;border-radius: 5px;width: 100%"  placeholder="计划名称" /></td>
                                <td>开始时间</td>
                                <td ><DatePicker :editable="false" v-model="workData.startTime" type="date" style="border: 1px solid #a6dbff;border-radius: 5px;" placeholder="选择日期"></DatePicker></td>
                                <td>结束时间</td>
                                <td ><DatePicker :editable="false" v-model="workData.endTime" type="date" style="border: 1px solid #a6dbff;border-radius: 5px;" placeholder="选择日期"></DatePicker></td>
                            </tr>
                        </table>
                        <vtable :workData="workData" :workColumns="workColumns"></vtable>
                    </div>
                    <div slot="footer">
                        <Button type="text" @click="detailedInfoModal.newWordModal = false">取消</Button>
                        <Button type="primary" @click="addWorkPlan">保存</Button>
                    </div>
                </Modal>
                <Card>
                    <Form ref="formInline" v-model="wordListFrom" inline :label-width='60'>
                        <FormItem label="文档名称" prop="name">
                            <Input style="width: 200px" v-model="wordListFrom.name" placeholder="文件名称"></Input>
                        </FormItem>
                        <FormItem label="创建日期" prop="time">
                            <DatePicker :editable="false" v-model="wordListFrom.creationTime" type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="initWordPlan">搜索计划</Button>
                            <Button type="primary" @click="modelShowNewData">创建计划</Button>
                        </FormItem>
                    </Form>
                    <div>
                        <paging-components :tableData="tableData" @pagechange="pagechange" @showDisplay="showDisplay"></paging-components>
                    </div>
                </Card>
            </Col>
            <Col :sm="4" :xs="24">
                <Card style="">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        创建设置
                    </p>
                    <div>
                        <Form v-model="createWordSetting">
                            <FormItem label="名称" prop="wordName">
                                <Tooltip style="white-space: normal;" placement="bottom-end" content="字母代表可变值示例：%t周计划（%d - %n）">
                                    <Input v-model="createWordSetting.wordName" icon="md-help-circle" placeholder="计划名称"></Input>
                                </Tooltip>
                            </FormItem>
                            <FormItem label="%d" :label-width='20' prop="setTime">
                                <Input v-model="createWordSetting.setDept" placeholder="部门"></Input>
                            </FormItem>
                            <FormItem label="%n" :label-width='20' prop="setName">
                                <Input v-model="createWordSetting.setName" placeholder="姓名"></Input>
                            </FormItem>
                            <FormItem label="%t" :label-width='20' prop="setTime">
                                <Input v-model="createWordSetting.setTime" placeholder="日期格式"></Input>
                            </FormItem>
                            <FormItem :label-width='40'>
                                <Button type="primary" @click="saveWordSetting">保存</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import pagingComponents from '../main-components/paging-components/paging-components';
    import vtable from './singlesheet/vtable';
    import $util from '@/libs/util.js';
    var qs = require('qs');

    export default {
        name: "work-record",
        components: {
            pagingComponents,
            vtable
        },
        data() {
            return {
                wordListFrom: {
                    name: '',
                    creationTime: ''
                },
                tableData: {
                    loading: false,
                    columns: [
                        {
                            title: '工作开始日期',
                            align: 'center',
                            key: 'start_time',
                            render: (h, params) => {
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'md-time'
                                        },
                                        style: {
                                            marginRight: '5px',
                                        }
                                    }),
                                    h('span', params.row.start_time)
                                ]);
                            }
                        },
                        {
                            title: '工作结束日期',
                            align: 'center',
                            key: 'end_time',
                            render: (h, params) => {
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'md-time'
                                        },
                                        style: {
                                            marginRight: '5px',
                                        }
                                    }),
                                    h('span', params.row.end_time)
                                ]);
                            }
                        },
                        {
                            title: '计划名称',
                            align: 'center',
                            key: 'name',
                        },
                        {
                            title: '操作',
                            align: 'center',
                            key: 'operation',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.showUpdateWorkInfo(params.row.id);
                                            }
                                        }
                                    }, '编辑'),
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                $util.frontErrMsg(this, 2, '生成文档功能未开启');
                                                // this.$Modal.info({
                                                //     title: 'User Info',
                                                //     content: params.row.id
                                                // })
                                            }
                                        }
                                    }, '生成'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.$Modal.confirm({
                                                    title: '消息',
                                                    content: '<p>是否删除？'+params.row.name+'</p>',
                                                    onOk: () => {
                                                        this.delWorkPlan(params.row.id);
                                                    },
                                                    onCancel: () => {
                                                        //this.$Message.info('Clicked cancel');
                                                    }
                                                });
                                            }
                                        }
                                    }, '删除')
                                ]);
                            }
                        },
                    ],
                    data: [],
                    paging: {
                        total: 0,
                        display: 10,
                        current: 1,
                        pagegroup: 5
                    }
                },
                detailedInfoModal: {
                    modalShow: false,
                    modalName: '',
                    newWordModal: false,
                },
                workData: {},
                workColumns: [
                    [
                        // {label:'测试1',prop:'a',rowspan:'2'},
                        // {label:'测试2'},
                        // {label:'测试3',colspan:'2'}
                        {label: '任务/组别', prop: 'taskName'},
                        {label: '任务内容', prop: 'taskContent', width: '180px'},
                        {label: '难易度', prop: 'planFacilityValue'},
                        {label: '耗时(H)', prop: 'planTimeConsuming'},
                        {label: '完成比例', prop: 'planCompletionRatio'},
                        {label: '完成情况', prop: 'completionStatus', width: '240px'},
                        {label: '难易度', prop: 'summaryFacilityValue'},
                        {label: '耗时(H)', prop: 'summaryTimeConsuming'},
                        {label: '完成比例', prop: 'summaryCompletionRatio'},
                    ]
                    // ,
                    // [
                    //     {prop:'c',label:'表头2'},
                    //     {prop:'b',label:'表头3'},
                    //     {prop:'d',label:'表头4'}
                    // ]
                ],
                createWordSetting:{
                    id:'',
                    wordName:'',
                    setName:'',
                    setTime:'',
                    setDept:''
                }
            }
        },
        methods: {
            initWordPlan() {
                var pageVo = JSON.stringify(this.tableData.paging);
                if(this.wordListFrom.creationTime != ''){
                    this.wordListFrom.creationTime = $util.formatDateToString(this.wordListFrom.creationTime)
                }
                var fileQueryFrom = JSON.stringify(this.wordListFrom);
                var readyData = qs.stringify({
                    pageVoc: pageVo,
                    fileQueryFromc: fileQueryFrom
                });
                this.tableData.loading = true;
                let url = 'initUserWorkResourceList';
                let _this = this;
                $util.post(url, readyData)
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                _this.tableData.loading = false;
                                _this.tableData.data = response.data.data.data;
                                _this.tableData.paging.total = response.data.data.total;
                                _this.tableData.paging.display = response.data.data.display;
                                _this.tableData.paging.current = response.data.data.current;
                                _this.tableData.paging.pagegroup = response.data.data.pagegroup;
                            } else {
                                $util.responseMsg(_this, response.data);
                            }
                        } else {
                            $util.httpErrorMsg(_this, response.data)
                        }
                    })
                    .catch(function (error) {
                        $util.httpErrorMsg(_this, error.data)
                    })
            },
            initWordPlanSetting(){
                let _this = this;
                let url = 'queryWorkSetting';
                $util.post(url, {})
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                _this.createWordSetting = response.data.data;
                            } else {
                                $util.responseMsg(_this, response.data);
                            }
                        } else {
                            $util.httpErrorMsg(_this, response.data)
                        }
                    })
                    .catch(function (error) {
                        $util.httpErrorMsg(_this, error.data)
                    })
            },
            pagechange(index) {
                this.tableData.paging.current = index;
                this.initWordPlan();
            },
            showDisplay(number) {
                this.tableData.paging.current = 1;
                this.tableData.paging.display = number;
                this.initWordPlan();
            },
            saveWordSetting(){
                console.info(this.createWordSetting);
                if(this.createWordSetting.wordName == ""){
                    $util.frontErrMsg(this, 2, '计划名称为空');
                    return;
                }else if(this.createWordSetting.setDept == ""){
                    $util.frontErrMsg(this, 2, '部门为空');
                    return;
                }else if(this.createWordSetting.setName == ""){
                    $util.frontErrMsg(this, 2, '姓名为空');
                    return;
                }else if(this.createWordSetting.setTime == ""){
                    $util.frontErrMsg(this, 2, '时间格式为空');
                    return;
                }
                let time = this.createWordSetting.setTime;
                var pattern = /(^y{1,4}[\-|\/|\.]M{1,2}[\-|\/|\.]d{1,2}$)|(^y{4}年M{1,2}月d{1,2}日$)/;
                if(!pattern.test(time)){
                    $util.frontErrMsg(this, 2, '时间格式错误列如：yyyy-MM-dd或yyyy/MM/dd或yyyy|MM|dd或yyyy.MM.dd或yyyy年MM月dd日');
                    return;
                }
                let _this = this;
                let url = 'updateWorkSetting';
                $util.post(url, this.createWordSetting)
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                $util.frontSuccMsg(_this, 2, response.data.msg);
                            } else {
                                $util.responseMsg(_this, response.data);
                            }
                        } else {
                            $util.httpErrorMsg(_this, response.data)
                        }
                    })
                    .catch(function (error) {
                        $util.httpErrorMsg(_this, error.data)
                    })
            },
            showUpdateWorkInfo(id) {
                let _this = this;
                let url = 'queryWorkPlanContent';
                let queryData = qs.stringify({
                    'id' : id,
                });
                $util.post(url, queryData)
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                _this.detailedInfoModal.modalName = response.data.data.name;
                                _this.workData = response.data.data;
                                _this.detailedInfoModal.modalShow = true;
                            } else {
                                $util.responseMsg(_this, response.data);
                            }
                        } else {
                            $util.httpErrorMsg(_this, response.data)
                        }
                    })
                    .catch(function (error) {
                        $util.httpErrorMsg(_this, error.data)
                    })
            },
            updateWordPlan() {
                if (this.checkWordParam(this.workData)) {
                    return;
                }
                this.workData.startTime = $util.formatDateToString(this.workData.startTime);
                this.workData.endTime = $util.formatDateToString(this.workData.endTime);
                this.workData.plannedDate = $util.formatDateToString(this.workData.plannedDate);
                this.workData.summaryDate = $util.formatDateToString(this.workData.summaryDate);
                let _this = this;
                let url = 'updateWorkPlanContent';
                $util.post(url, this.workData)
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                _this.detailedInfoModal.modalShow = false;
                                $util.frontSuccMsg(_this, 2, response.data.msg);
                                _this.initWordPlan();
                            } else {
                                $util.responseMsg(_this, response.data);
                            }
                        } else {
                            $util.httpErrorMsg(_this, response.data)
                        }
                    })
                    .catch(function (error) {
                        $util.httpErrorMsg(_this, error.data)
                    })

            },
            addWorkPlan() {
                if (this.checkWordParam(this.workData)) {
                    return;
                }
                this.workData.startTime = $util.formatDateToString(this.workData.startTime);
                this.workData.endTime = $util.formatDateToString(this.workData.endTime);
                this.workData.plannedDate = $util.formatDateToString(this.workData.plannedDate);
                this.workData.summaryDate = $util.formatDateToString(this.workData.summaryDate);
                let _this = this;
                let url = 'addWorkPlan';
                $util.post(url, this.workData)
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                _this.detailedInfoModal.newWordModal = false;
                                $util.frontSuccMsg(_this, 2, response.data.msg);
                                _this.initWordPlan();
                            } else {
                                $util.responseMsg(_this, response.data);
                            }
                        } else {
                            $util.httpErrorMsg(_this, response.data)
                        }
                    })
                    .catch(function (error) {
                        $util.httpErrorMsg(_this, error.data)
                    })
            },
            delWorkPlan(id){
                let _this = this;
                let url = 'delWorkPlan';
                let queryData = qs.stringify({
                    'id' : id,
                });
                $util.post(url, queryData)
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                $util.frontSuccMsg(_this, 2, response.data.msg);
                                _this.initWordPlan();
                            } else {
                                $util.responseMsg(_this, response.data);
                            }
                        } else {
                            $util.httpErrorMsg(_this, response.data)
                        }
                    })
                    .catch(function (error) {
                        $util.httpErrorMsg(_this, error.data)
                    })
            },
            modelShowNewData() {
                var newWordData = {
                    name: '',
                    startTime: '',
                    endTime: '',
                    isEdit: 'false',
                    department: '',
                    plannerPeople: '',
                    plannedDate: '',
                    summaryPeople: '',
                    summaryDate: '',
                    content: [{}]
                };
                this.workData = newWordData;
                let _this = this;
                let url = 'createWorkConfig';
                $util.post(url, {})
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                _this.detailedInfoModal.newWordModal = true;
                                _this.workData.name = response.data.data.name;
                                _this.workData.startTime = response.data.data.startTime;
                                _this.workData.endTime = response.data.data.endTime;
                                _this.workData.plannerPeople = response.data.data.people;
                                _this.workData.summaryPeople = response.data.data.people;
                                _this.workData.plannedDate = response.data.data.endTime;
                                _this.workData.summaryDate = response.data.data.endTime;
                                _this.workData.department = response.data.data.department;
                            } else {
                                $util.responseMsg(_this, response.data);
                            }
                        } else {
                            $util.httpErrorMsg(_this, response.data)
                        }
                    })
                    .catch(function (error) {
                        $util.httpErrorMsg(_this, error.data)
                    })
            },
            checkWordParam(data) {
                if (data.name == '') {
                    $util.frontErrMsg(this, 2, '计划名称为空！');
                    return true;
                } else if (data.startTime == '') {
                    $util.frontErrMsg(this, 2, '计划开始时间为空！');
                    return true;
                } else if (data.endTime == '') {
                    $util.frontErrMsg(this, 2, '计划结束时间为空！');
                    return true;
                } else if (data.department == '') {
                    $util.frontErrMsg(this, 2, '部门为空！');
                    return true;
                } else if (data.plannerPeople == '') {
                    $util.frontErrMsg(this, 2, '计划人为空！');
                    return true;
                } else if (data.plannedDate == '') {
                    $util.frontErrMsg(this, 2, '计划日期为空！');
                    return true;
                } else if (data.summaryPeople == '') {
                    $util.frontErrMsg(this, 2, '总结人为空！');
                    return true;
                } else if (data.summaryDate == '') {
                    $util.frontErrMsg(this, 2, '总结日期为空！');
                    return true;
                } else {
                    let objNull = 0;
                    for (var i = 0; i < data.content.length; i++) {
                        if (Object.keys(data.content[i]).length != 0) {
                            objNull++;
                        }
                        if (objNull <= 0) {
                            $util.frontErrMsg(this, 2, '请至少输入一行');
                            return true;
                        }
                    }
                    return false;
                }
            },
        },
        created() {
            this.initWordPlan();
            this.initWordPlanSetting();
        }
    }
</script>

