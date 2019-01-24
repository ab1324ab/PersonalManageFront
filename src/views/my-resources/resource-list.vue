<template>
    <div style="height: 600px" @keydown.enter="initResourceList">
        <Modal width="60%"
               v-model="detailedInfoModal.modalShow"
               :mask-closable="false"
               >
            <p slot="header">
                <Icon type="ios-information-circle"></Icon>
                <span>{{detailedInfoModal.modalName}}</span>
            </p>
            <div v-if="detailedInfoModal.excelShow">
                <Table height="400" :columns="detailedInfoModal.excelData.columns" :data="detailedInfoModal.excelData.data"></Table>
            </div>
            <div v-if="detailedInfoModal.wordShow">
                <div id="wordShow" style="margin: 0 auto;overflow:scroll;height:auto;min-height:100px;max-height:400px;overflow-x: hidden;overflow-y:auto" v-html="detailedInfoModal.wordData"></div>
            </div>
            <div v-if="detailedInfoModal.imgShow" style="margin: 0 auto;width: 90%">
                <img :src="detailedInfoModal.imgUrl" width="100%"/>
            </div>
            <div slot="footer">
                <Button type="text" @click="detailedInfoModal.modalShow = false">取消</Button>
                <Button type="primary" @click="detailedInfoModel(detailedInfoModal.type)">编辑</Button>
            </div>
        </Modal>
        <Card>
            <p slot="title">
                <Icon type="ios-list-box-outline"></Icon>
                文档列表
            </p>
            <Form ref="formInline" inline :label-width='60' v-model="resourceListFrom">
                <FormItem label="文档名称" prop="fileName">
                    <Input placeholder="文件名称" style="width: 200px;" v-model="resourceListFrom.name"></Input>
                </FormItem>
                <FormItem label="创建日期" prop="creationTime">
                    <DatePicker :editable="false" v-model="resourceListFrom.creationTime" type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="文档类型" prop="fileType">
                    <Select v-model="resourceListFrom.type" style="width:200px">
                        <Option v-for="item in typeList" :value="item.typeValue" :key="item.typeValue">
                            {{ item.typeName }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="initResourceList">搜索文档</Button>
                </FormItem>
            </Form>
            <div>
                <paging-components :tableData="tableData" @pagechange="pagechange" @showDisplay="showDisplay" @detailedInfo="detailedInfo"></paging-components>
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
        data() {
            return {
                detailedInfoModal: {
                    modalName: '文件详细信息',
                    fileId: '',
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
                        data: [
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
                            key: 'fileSize'
                        },
                        {
                            title: '创建时间',
                            align: 'center',
                            key: 'creationTime'
                        },
                        {
                            title: '描述',
                            align: 'center',
                            key: 'describe'
                        }
                    ],
                    data: [],
                    paging: {
                        total: 0,
                        display: 10,
                        current: 1,
                        pagegroup: 5
                    }
                },
                resourceListFrom: {
                    type: '',
                    creationTime: '',
                    name: '',
                },
                typeList: [
                    {
                        typeName: '全部类型',
                        typeValue: ''
                    },
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
            initResourceList() {
                var pageVo = JSON.stringify(this.tableData.paging);
                if(this.resourceListFrom.creationTime != ''){
                    this.resourceListFrom.creationTime = $util.addDateDay(this.resourceListFrom.creationTime)
                }
                var fileQueryFrom = JSON.stringify(this.resourceListFrom);
                var readyData = qs.stringify({
                    pageVoc: pageVo,
                    fileQueryFromc: fileQueryFrom
                });
                this.tableData.loading = true;
                let url = 'initUserResourceList';
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
            detailedInfo(currentRow, oldCurrentRow) {
                let id = currentRow.id;
                let type = currentRow.fileType;
                let _this = this;
                let url = '';
                if (type == 'img') {
                    url = 'queryImagesInfo';
                } else if (type == 'word') {
                    url = 'queryWordContent';
                } else if (type == 'excel') {
                    url = 'queryExcelContent';
                } else {
                    return;
                }
                $util.post(url, {'id': id})
                    .then(function (response) {
                        _this.detailedInfoModal.imgShow = false;
                        _this.detailedInfoModal.wordShow = false;
                        _this.detailedInfoModal.excelShow = false;
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                _this.detailedInfoModal.modalName = '文件详细信息';
                                _this.detailedInfoModal.fileId = response.data.data.id;
                                if (type == 'img') {
                                    _this.detailedInfoModal.imgShow = true;
                                    _this.detailedInfoModal.modalName = response.data.data.fileName + " -- 最近更新：" + response.data.data.updateTime;
                                    _this.detailedInfoModal.imgUrl = response.data.data.imgUrl;
                                } else if (type == 'word') {
                                    _this.detailedInfoModal.modalName = response.data.data.name + " -- 最近更新：" + response.data.data.updateTime;
                                    _this.detailedInfoModal.wordShow = true;
                                    _this.detailedInfoModal.wordData = response.data.data.content;
                                } else if (type == 'excel') {
                                    _this.detailedInfoModal.excelShow = true;
                                    var table = JSON.parse(response.data.data.content);
                                    var tableColumnsList = [];
                                    for (var i = 0; i < table[0].length; i++) {
                                        if (table[0][i] != "") {
                                            var tableColumnsObj = {};
                                            tableColumnsObj.title = table[0][i];
                                            tableColumnsObj.align = 'center';
                                            tableColumnsObj.key = "obg" + i;
                                            tableColumnsList.push(tableColumnsObj);
                                        }
                                    }
                                    _this.detailedInfoModal.excelData.columns = tableColumnsList;
                                    var tableDataList = [];
                                    for (var obi = 1; obi < table.length; obi++) {
                                        var check = false;
                                        for (var obj = 0; obj < table[obi].length; obj++) {
                                            if (table[obi][obj] != "") {
                                                check = true;
                                            }
                                        }
                                        if (check) {
                                            function TableData() {
                                            };
                                            var tableData = new TableData();
                                            for (var ix = 0; ix < tableColumnsList.length; ix++) {
                                                tableData['obg' + ix] = table[obi][ix];
                                            }
                                            tableDataList.push(tableData);
                                        }
                                    }
                                    _this.detailedInfoModal.excelData.data = tableDataList;
                                }
                                _this.detailedInfoModal.type = type;
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
                    });
            },
            pagechange(index) {
                this.tableData.paging.current = index;
                this.initResourceList();
            },
            showDisplay(number) {
                this.tableData.paging.current = 1;
                this.tableData.paging.display = number;
                this.initResourceList();
            },
            detailedInfoModel(type) {
                this.detailedInfoModal.modalShow = false;
                let fileIdc = this.detailedInfoModal.fileId;
                let params = {fileId: fileIdc};
                if (type == 'img') {
                    this.$router.push({
                        name: 'create-image',
                        params: params
                    });
                } else if (type == 'word') {
                    this.$router.push({
                        name: 'create-word',
                        params: params
                    });
                } else if (type == 'excel') {
                    this.$router.push({
                        name: 'create-excel',
                        params: params
                    });
                }
            }

        },
        created() {
            this.initResourceList();
        },

    };
</script>
