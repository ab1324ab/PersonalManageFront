<template>
    <div>
        <Modal
             v-model="detailedInfoModal.modalShow">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>{{detailedInfoModal.modalName}}</span>
            </p>
            <div>
                <vtable :datat = "workData" :thlabel="thlabel" :isEdit="isEdit"></vtable>
            </div>
            <div slot="footer">
                <Button type="primary" @click="detailedInfoModal.modalShow = false">取消</Button>
                <Button type="primary" @click="isEdit = false">编辑</Button>
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
                                            //size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.showWorkInfo(params.row);
                                                // this.$Modal.info({
                                                //     title: 'User Info',
                                                //     content: params.row.id
                                                // })
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
                isEdit:true,
                detailedInfoModal:{
                    modalShow:false,
                    modalName:'',
                },
                workData:[
                        {'a':'1','b':'2','c':'3','d':'8'},
                        {'a':'4','b':'5','c':'6','d':'9'}
                    ],
                thlabel:[
                    [
                        {label:'测试1',prop:'a',rowspan:'2'},
                        {label:'测试2'},
                        {label:'测试3',colspan:'2'}
                    ],
                    [
                        {prop:'c',label:'表头2'},
                        {prop:'b',label:'表头3'},
                        {prop:'d',label:'表头4'}
                    ]
                ]

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
                console.info(row);
                this.detailedInfoModal.modalName = row.name;
                this.detailedInfoModal.modalShow = true;
            }
        }
    }
</script>

