<template>
    <div>
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
    export default {
        name: "work-record",
        components:{
            pagingComponents
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
                            title: '简述',
                            align: 'center',
                            key: 'describe',
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
                                                this.$Modal.info({
                                                    title: 'User Info',
                                                    content: params.row.id
                                                })
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
                            describe: 'John Brown',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            describe: 'John Brown',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            describe: 'John Brown',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            describe: 'Jim Green',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            describe: 'Joe Black',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            describe: 'Jon Snow',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            describe: 'Jon Snow',
                        },
                        {
                            id: 'sdgsdhjkljsdkgj',
                            start_time: '2016-10-03',
                            end_time: '2016-10-05',
                            describe: 'Jon Snow',
                        }
                    ],
                    paging: {
                        total: 100,
                        display: 10,
                        current: 1,
                        pagegroup: 5
                    }
                },
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
            }
        }
    }
</script>

