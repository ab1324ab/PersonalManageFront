<style>
    #wordForm div{
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
        <Modal
             width="900px"
             v-model="detailedInfoModal.modalShow">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>{{detailedInfoModal.modalName}}</span>
            </p>
            <div>
                <vtable :workData="workData" :workColumns="workColumns" ></vtable>
            </div>
            <div slot="footer">
                <Button type="primary" @click="detailedInfoModal.modalShow = false">取消</Button>
                <Button type="primary" @click="updateWordPlan">保存</Button>
            </div>
        </Modal>
        <Modal
                width="900px"
                v-model="newWordModal">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>新建计划</span>
            </p>
            <div>
                <Form inline :label-width='60' v-model="newWordData" label-position="left" style="border: 1px solid #e9eaec;width: 100%" id="wordForm">
                    <FormItem id="planmc" label="计划名称" prop="name" style="width: 50%">
                        <Input v-model="newWordData.name" style="border: 1px solid #a6dbff;border-radius: 5px;" placeholder="计划名称"/>
                    </FormItem>
                    <FormItem label="开始时间" prop="startTime" style="width: 21%">
                        <DatePicker v-model="newWordData.startTime" type="date" style="border: 1px solid #a6dbff;border-radius: 5px;" placeholder="开始时间" ></DatePicker>
                    </FormItem>
                    <FormItem label="结束时间" prop="startTime" style="width: 28.2%">
                        <DatePicker v-model="newWordData.endTime" type="date" style="border: 1px solid #a6dbff;border-radius: 5px;" placeholder="结束时间" ></DatePicker>
                    </FormItem>
                </Form>
                <vtable :workData="newWordData" :workColumns="workColumns" ></vtable>
            </div>
            <div slot="footer">
                <Button type="primary" @click="newWordModal = false">取消</Button>
                <Button type="primary" @click="addWordPlan">保存</Button>
            </div>
        </Modal>
        <Card>
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                工作记录
            </p>
            <Form ref="formInline"  inline :label-width='60' >
                <FormItem label="文档名称" prop="name">
                    <Input placeholder="文件名称" ></Input>
                </FormItem>
                <FormItem label="创建日期" prop="time">
                    <DatePicker type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>
                </FormItem>
                <Button type="primary"  @click="handleSubmit">搜索计划</Button>
                <Button type="primary"  @click="newWordModal = true">创建计划</Button>
            </Form>
            <div style="height: 475px">
                <paging-components :tableData="tableData" @pagechange="pagechange" @detailedInfo="detailedInfo"></paging-components>
            </div>
        </Card>
    </div>
</template>

<script>
    import pagingComponents from '../main-components/paging-components/paging-components';
    import vtable from '../main-components/my-vtable/vtable';
    import $util from '@/libs/util.js';

    export default {
        name: "work-record",
        components:{
            pagingComponents,
            vtable
        },
        data() {
            return{
                tableData: {
                    loading: false,
                    columns: [
                        {
                            title: '工作开始日期',
                            align: 'center',
                            key: 'start_time',
                            render: (h, params) => {
                                return h('div',[
                                    h('Icon', {
                                        props: {
                                            type: 'android-time'
                                        },
                                        style:{
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
                                return h('div',[
                                    h('Icon', {
                                        props: {
                                            type: 'android-time'
                                        },
                                        style:{
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
                            render: (h,params) => {
                                return h('div',[
                                    h('Button',{
                                        props: {
                                            type: 'primary',
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.showWorkInfo(params.row);
                                            }
                                        }
                                    },'编辑'),
                                    h('Button',{
                                        props:{
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
                                    },'生成计划'),
                                    h('Button',{
                                        props:{
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
                                    },'删除')
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
                        total: 100,
                        display: 10,
                        current: 1,
                        pagegroup: 5
                    }
                },
                detailedInfoModal:{
                    modalShow:false,
                    modalName:'',
                },
                newWordModal:false,
                newWordData:{
                    name:'',
                    startTime:'',
                    endTime:'',
                    isEdit:false,
                    department:'',
                    plannerPeople:'',
                    plannedDate:'',
                    summaryPeople:'',
                    summaryDate:'',
                    content: [
                        {},
                        {}
                    ]
                },
                workData:{
                    isEdit:false,
                    department:'部门1',
                    plannerPeople:'计划人1',
                    plannedDate:'2018-12-12',
                    summaryPeople:'总结人1',
                    summaryDate:'2018-12-16',
                    content: [
                        {'a':'1','b':'2','c':'3','d':'8','e':'5','f':'4','g':'0'},
                        {'a':'4','b':'5','c':'6','d':'9','e':'7','f':'8','g':'4'},
                        {'a':'1','b':'2','c':'3','d':'8','e':'5','f':'4','g':'0'},
                        {'a':'4','b':'5','c':'6','d':'9','e':'7','f':'8','g':'4'},
                        {},
                        {}
                    ]
                },
                workColumns:[
                    [
                        // {label:'测试1',prop:'a',rowspan:'2'},
                        // {label:'测试2'},
                        // {label:'测试3',colspan:'2'}
                        {label:'任务/组别',prop:'a'},
                        {label:'任务内容',prop:'b',width:'180px'},
                        {label:'难易度',prop:'c'},
                        {label:'耗时(H)',prop:'d'},
                        {label:'完成比例',prop:'e'},
                        {label:'完成情况',prop:'f',width:'240px'},
                        {label:'难易度',prop:'g'},
                        {label:'耗时(H)',prop:'h'},
                        {label:'完成比例',prop:'i'},
                    ]
                    // ,
                    // [
                    //     {prop:'c',label:'表头2'},
                    //     {prop:'b',label:'表头3'},
                    //     {prop:'d',label:'表头4'}
                    // ]
                ],
            }
        },
        methods: {
            handleSubmit(data) {
                this.tableData.loading=true;
            },
            detailedInfo (currentRow, oldCurrentRow) {
                console.info('currentRow', currentRow);
                console.info('oldCurrentRow', oldCurrentRow);
            },
            pagechange (index) {
                console.info('index', index);
            },
            showWorkInfo(row){
                //console.info(row);
                this.detailedInfoModal.modalName = row.name;
                this.detailedInfoModal.modalShow = true;
            },
            updateWordPlan(){
                console.info(this.workData);
            },
            addWordPlan(){
                this.newWordData.content;
                let objNull = 0;
                for(var i=0;i<this.workData.content.length;i++){
                    if(Object.keys(this.workData.content[i]).length != 0){
                        objNull++;
                    }
                    if(objNull <= 0){
                        $util.frontErrMsg(this,2,'请至少输入一行');
                        return;
                    }
                }
                console.info(this.newWordData);
            }
        }
    }
</script>

