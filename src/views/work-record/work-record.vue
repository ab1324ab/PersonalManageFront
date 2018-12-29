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
    <div>
        <Row :gutter="10">
            <Col span="20">
                <Modal
                        width="900px"
                        v-model="detailedInfoModal.modalShow">
                    <p slot="header">
                        <Icon type="information-circled"></Icon>
                        <span>{{detailedInfoModal.modalName}}</span>
                    </p>
                    <div>
                        <vtable :workData="workData" :workColumns="workColumns"></vtable>
                    </div>
                    <div slot="footer">
                        <Button type="primary" @click="detailedInfoModal.modalShow = false">取消</Button>
                        <Button type="primary" @click="updateWordPlan">保存</Button>
                    </div>
                </Modal>
                <Modal
                        width="900px"
                        v-model="detailedInfoModal.newWordModal">
                    <p slot="header">
                        <Icon type="information-circled"></Icon>
                        <span>新建计划</span>
                    </p>
                    <div>
                        <Form inline :label-width='60' v-model="workData" label-position="left" style="border: 1px solid #e9eaec;width: 100%" id="wordForm">
                            <FormItem id="planmc" label="计划名称" prop="name" style="width: 50%">
                                <Input v-model="workData.name" style="border: 1px solid #a6dbff;border-radius: 5px;" placeholder="计划名称" />
                            </FormItem>
                            <FormItem label="开始时间" prop="startTime" style="width: 21%">
                                <DatePicker v-model="workData.startTime" type="date" style="border: 1px solid #a6dbff;border-radius: 5px;" placeholder="开始时间"></DatePicker>
                            </FormItem>
                            <FormItem label="结束时间" prop="startTime" style="width: 28.2%">
                                <DatePicker v-model="workData.endTime" type="date" style="border: 1px solid #a6dbff;border-radius: 5px;" placeholder="结束时间"></DatePicker>
                            </FormItem>
                        </Form>
                        <vtable :workData="workData" :workColumns="workColumns"></vtable>
                    </div>
                    <div slot="footer">
                        <Button type="primary" @click="detailedInfoModal.newWordModal = false">取消</Button>
                        <Button type="primary" @click="addWordPlan">保存</Button>
                    </div>
                </Modal>
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        工作记录
                    </p>
                    <Form ref="formInline" v-model="wordListFrom" inline :label-width='60'>
                        <FormItem label="文档名称" prop="name">
                            <Input v-model="wordListFrom.name" placeholder="文件名称"></Input>
                        </FormItem>
                        <FormItem label="创建日期" prop="time">
                            <DatePicker v-model="wordListFrom.creationTime" type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>
                        </FormItem>
                        <Button type="primary" @click="initWordPlan">搜索计划</Button>
                        <Button type="primary" @click="modelShowNewData">创建计划</Button>
                    </Form>
                    <div>
                        <paging-components :tableData="tableData" @pagechange="pagechange" @showDisplay="showDisplay"></paging-components>
                    </div>
                </Card>
            </Col>
            <Col span="4">
                <Card style="">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        创建设置
                    </p>
                    <!--<div v-for="list in historyList" :title='wordTitle(list.name,list.describe)' class="margin-top-20" style="border-bottom: #dddee1 solid 1px;text-indent: 1em;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">-->
                        <!--<a href="javascript:void(0)" type="text" @click="selectShow(list.id)">{{list.name}}</a>-->
                    <!--</div>-->
                    <div>
                        <Form v-model="createWordSetting">
                            <FormItem label="名称" :label-width='40' prop="wordName">
                                <Input v-model="createWordSetting.wordName" placeholder="计划名称"></Input>
                            </FormItem>
                            <Row>
                                <Col span="12">
                                    <FormItem label="%n" :label-width='20' prop="setName">
                                        <Input v-model="createWordSetting.setName" placeholder="姓名"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="%t" :label-width='20' prop="setTime">
                                        <Input v-model="createWordSetting.setTime" placeholder="日期格式"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Button type="primary" @click="saveWordSetting">保存</Button>
                        </Form>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import pagingComponents from '../main-components/paging-components/paging-components';
    import vtable from '../main-components/my-vtable/vtable';
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
                                            type: 'android-time'
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
                                            type: 'android-time'
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
                                                this.$Modal.info({
                                                    title: 'User Info',
                                                    content: params.row.id
                                                })
                                            }
                                        }
                                    }, '生成计划'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.$Modal.info({
                                                    title: 'User Info',
                                                    content: params.row.id
                                                })
                                            }
                                        }
                                    }, '删除')
                                ]);
                            }
                        },
                    ],
                    data: [
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            name: 'John Brown',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            name: 'John Brown',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            name: 'John Brown',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            name: 'Jim Green',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            name: 'Joe Black',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            name: 'Jon Snow',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            name: 'Jon Snow',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            name: 'Jon Snow',
                        }
                    ],
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
                workData: {
                    id:'',
                    name: '',
                    startTime: '',
                    endTime: '',
                    isEdit: false,
                    department: '部门1',
                    plannerPeople: '计划人1',
                    plannedDate: '2018-12-12',
                    summaryPeople: '总结人1',
                    summaryDate: '2018-12-16',
                    content: [
                        {'taskName': '1', 'taskContent': '2', 'planFacilityValue': '3', 'planTimeConsuming': '8', 'planCompletionRatio': '5', 'completionStatus': '4', 'summaryTimeConsuming': '0'},
                        {},
                        {}
                    ]
                },
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
                    setTime:''
                }
            }
        },
        methods: {
            initWordPlan() {
                var pageVo = JSON.stringify(this.tableData.paging);
                if(this.wordListFrom.creationTime != ''){
                    this.wordListFrom.creationTime = $util.addDateDay(this.wordListFrom.creationTime)
                }
                var fileQueryFrom = JSON.stringify(this.wordListFrom);
                var readyData = qs.stringify({
                    pageVoc: pageVo,
                    fileQueryFromc: fileQueryFrom
                });
                this.tableData.loading = true;
                let url = 'initUserWordResourceList';
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
                let url = 'queryWordSetting';
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
                let url = 'updateWordSetting';
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
                let url = 'queryWordPlanContent';
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
                this.workData.startTime = $util.addDateDay(this.workData.startTime);
                this.workData.endTime = $util.addDateDay(this.workData.endTime);
                this.workData.plannedDate = $util.addDateDay(this.workData.plannedDate);
                this.workData.summaryDate = $util.addDateDay(this.workData.summaryDate);
                let _this = this;
                let url = 'updateWordPlanContent';
                $util.post(url, this.workData)
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                _this.detailedInfoModal.modalShow = false;
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
            addWordPlan() {
                if (this.checkWordParam(this.workData)) {
                    return;
                }
                this.workData.startTime = $util.addDateDay(this.workData.startTime);
                this.workData.endTime = $util.addDateDay(this.workData.endTime);
                this.workData.plannedDate = $util.addDateDay(this.workData.plannedDate);
                this.workData.summaryDate = $util.addDateDay(this.workData.summaryDate);
                let _this = this;
                let url = 'addWordPlan';
                $util.post(url, this.workData)
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                _this.detailedInfoModal.newWordModal = false;
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
                    content: [{}, {}]
                };
                this.workData = newWordData;
                let _this = this;
                let url = 'createWordConfig';
                $util.post(url, {})
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                _this.detailedInfoModal.newWordModal = true;
                                _this.workData.name = response.data.data.name;
                                _this.workData.startTime = response.data.data.startTime;
                                _this.workData.endTime = response.data.data.endTime;
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

