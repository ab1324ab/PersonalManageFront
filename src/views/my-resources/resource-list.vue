<template>
    <div style="height: 600px">
        <Modal
                v-model="detailedInfoModal.modalShow">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>文件详细信息</span>
            </p>
            <div v-if="detailedInfoModal.excelShow">
                <Table :columns="detailedInfoModal.excelData.columns" :data="detailedInfoModal.excelData.data"></Table>
            </div>
            <div v-if="detailedInfoModal.wordShow">
                {{detailedInfoModal.wordData}}
            </div>
            <div v-if="detailedInfoModal.imgShow">
                <img :src="detailedInfoModal.imgUrl"/>
            </div>
            <div slot="footer">
                <Button type="primary" @click="detailedInfoModal.modalShow = false">取消</Button>
                <Button type="primary" @click="detailedInfoModel(detailedInfoModal.type)">编辑</Button>
            </div>
        </Modal>
        <Card >
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                文档列表
            </p>
            <Form ref="formInline"  inline :label-width='60' v-model="resourceListFrom">
                <FormItem label="文档名称" prop="fileName">
                    <Input placeholder="文件名称" v-model="resourceListFrom.fileName" ></Input>
                </FormItem>
                <FormItem label="创建日期" prop="creationTime">
                    <DatePicker v-model="resourceListFrom.creationTime" type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="文档类型" prop="fileType">
                    <Select v-model="resourceListFrom.fileType" style="width:200px">
                        <Option v-for="item in typeList" :value="item.typeValue" :key="item.typeValue">{{ item.typeName }}</Option>
                    </Select>
                </FormItem>
                <Button type="primary"  @click="handleSubmit('formInline')">搜索文档</Button>
            </Form>
            <div style="height: 475px">
                <paging-components :tableData="tableData" @pagechange="pagechange" @detailedInfo="detailedInfo"></paging-components>
            </div>
        </Card>
    </div>
</template>

<script>
    import pagingComponents from '../main-components/paging-components/paging-components';
    import $util from '@/libs/util.js';
    var qs = require('qs');

    export default {
        name: 'resource-list',
        components: {
            pagingComponents
        },
        data () {
            return {
                detailedInfoModal: {
                    type: '',
                    modalShow: false,
                    imgShow: false,
                    imgUrl: '',
                    wordShow: false,
                    wordData: {},
                    excelShow: false,
                    excelData: {
                        columns: [
                            {
                                title: 'Name',
                                key: 'name'
                            },
                            {
                                title: 'Age',
                                key: 'age'
                            },
                            {
                                title: 'Address',
                                key: 'address'
                            }
                        ],
                        data:[
                            {
                                name: 'John Brown',
                                age: 18,
                                address: 'New York No. 1 Lake Park',
                                date: '2016-10-03'
                            },
                            {
                                name: 'Jim Green',
                                age: 24,
                                address: 'London No. 1 Lake Park',
                                date: '2016-10-01'
                            },
                            {
                                name: 'Joe Black',
                                age: 30,
                                address: 'Sydney No. 1 Lake Park',
                                date: '2016-10-02'
                            },
                            {
                                name: 'Jon Snow',
                                age: 26,
                                address: 'Ottawa No. 2 Lake Park',
                                date: '2016-10-04'
                            }
                        ]
                    }
                },
                tableData: {
                    loading: false,
                    columns: [
                        {
                            title: '名称',
                            align: 'center',
                            key: 'fileName'
                        },
                        {
                            title: '类型',
                            align: 'center',
                            key: 'fileType'
                        },
                        {
                            title: '大小',
                            align: 'center',
                            key: 'size'
                        },
                        {
                            title: '创建时间',
                            align: 'center',
                            key: 'createTime'
                        },
                        {
                            title: '描述',
                            align: 'center',
                            key: 'describe'
                        }
                    ],
                    data: [
                        {
                            id: 'jhjghgviklhlih',
                            name: 'John Brown',
                            type: 'excel',
                            size: 18,
                            createTime: '2016-10-03',
                            describe: 'New York No. 1 Lake Park'
                        },
                        {
                            id: 'jhjghgviklhlih',
                            name: 'John Brown',
                            type: 'word',
                            size: 18,
                            createTime: '2016-10-03',
                            describe: 'New York No. 1 Lake Park'
                        },
                        {
                            id: 'jhjghgviklhlih',
                            name: 'John Brown',
                            type: 'excel',
                            size: 18,
                            createTime: '2016-10-03',
                            describe: 'New York No. 1 Lake Park'
                        },
                        {
                            id: 'jhjghgviklhlih',
                            name: 'Jim Green',
                            type: 'img',
                            size: 24,
                            createTime: '2016-10-03',
                            describe: 'London No. 1 Lake Park'
                        },
                        {
                            id: 'jhjghgviklhlih',
                            name: 'Joe Black',
                            type: 'img',
                            size: 30,
                            createTime: '2016-10-03',
                            describe: 'Sydney No. 1 Lake Park'
                        },
                        {
                            id: 'jhjghgviklhlih',
                            name: 'Jon Snow',
                            type: 'word',
                            size: 26,
                            createTime: '2016-10-03',
                            describe: 'Ottawa No. 2 Lake Park'
                        },
                        {
                            id: 'jhjghgviklhlih',
                            name: 'Jon Snow',
                            type: 'word',
                            size: 26,
                            createTime: '2016-10-03',
                            describe: 'Ottawa No. 2 Lake Park'
                        },
                        {
                            id: 'jhjghgviklhlih',
                            name: 'Jon Snow',
                            type: 'word',
                            size: 26,
                            createTime: '2016-10-03',
                            describe: 'Ottawa No. 2 Lake Park'
                        }
                    ],
                    paging: {
                        total: 0,
                        display: 10,
                        current: 1,
                        pagegroup: 5
                    }
                },
                resourceListFrom:{
                    fileType: '',
                    creationTime:'',
                    fileName:'',
                },
                typeList: [
                    {
                        typeName: 'Excel文档',
                        typeValue: 'excel'
                    },
                    {
                        typeName: 'Word文档',
                        typeValue: 'word'
                    },
                    {
                        typeName: 'Img图片',
                        typeValue: 'img'
                    }
                ]
            };
        },
        methods: {
            initResourceList(){
                let url = 'initUserResourceList';
                let _this = this;
                var pageVo = JSON.stringify(this.tableData.paging);
                var fileQueryFrom = JSON.stringify(this.resourceListFrom);
                var params = new URLSearchParams();
                params.append('pageVo',pageVo);
                params.append('fileQueryFrom',fileQueryFrom);
                this.tableData.loading = true;
                $util.post(url,params
                    // ,{
                    //     headers: {
                    //         'Content-Type': 'application/json;charset=UTF-8'
                    //     }
                    // }
                    )
                    .then(function (response) {
                        if(response.status == 200){
                            if(response.data.statusCode == "10000"){
                                this.tableData.loading = false;
                                _this.tableData.data = response.data.data.pageVo.data;
                                _this.tableData.paging.total = response.data.data.pageVo.total;
                                _this.tableData.paging.display = response.data.data.pageVo.display;
                                _this.tableData.paging.current = response.data.data.pageVo.current;
                                _this.tableData.paging.pagegroup = response.data.data.pageVo.pagegroup;
                                //_this.historyList = response.data.data
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
            detailedInfo (currentRow, oldCurrentRow) {
                let id = currentRow.id;
                let type = currentRow.type;
                let _this = this;
                let url = 'vv';
                let data = qs.stringify({
                    "id":id,"type":type
                });
                // $util.post(url,data)
                //     .then(function (response) {
                        _this.detailedInfoModal.imgShow = false;
                        _this.detailedInfoModal.wordShow = false;
                        _this.detailedInfoModal.excelShow = false;
                //         if(response.data.data == '200'){
                            if(type == 'img'){
                                _this.detailedInfoModal.imgShow = true;
                                //_this.detailedInfoModal.imgUrl = 'cc';
                            }else if(type == 'word'){
                                _this.detailedInfoModal.wordShow = true;
                                _this.detailedInfoModal.wordData = id;
                            }else if(type == 'excel'){
                                _this.detailedInfoModal.excelShow = true;
                                //_this.detailedInfoModal.excelData.columns = ''
                                //_this.detailedInfoModal.excelData.data = ''
                            }
                            _this.detailedInfoModal.type = type;
                            _this.detailedInfoModal.modalShow = true;
                    //    }
                    // })
                    // .catch(function (error) {
                    //     $util.httpErrorMsg(_this,error.data)
                    // });
            },
            pagechange (index) {
                console.info('index', index);
            },
            detailedInfoModel (type) {
                this.detailedInfoModal.modalShow = false;
                if(type == 'img'){
                    this.$router.push({
                        name: 'create-image',
                        params: 'ccc'
                    });
                }else if(type == 'word'){
                    this.$router.push({
                        name: 'create-word',
                        params: 'ccc'
                    });
                }else if(type == 'excel'){
                    this.$router.push({
                        name: 'create-excel',
                        params: 'ccc'
                    });
                }
                console.info('type',type);
            }

        },
        created(){
            this.initResourceList();
        },

    };
</script>
