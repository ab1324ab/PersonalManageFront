<style lang="less">
    @import '../../styles/common.less';
    .wtHolder{
        width: 100% !important;
        height: 460px !important;
    }
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col span="20">
                <Card style="">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        新建表格文档
                    </p>
                    <div style="height: 550px">
                        <Form :label-width='80' inline>
                            <Row :gutter="10" type="flex" >
                                <FormItem label="文件名称" prop="name">
                                    <Input placeholder="输入文件名称" style="width: 300px"/>
                                </FormItem>
                                <Col>
                                    <Button type="primary" @click="selectShow('w')" icon="document-text">保存</Button>
                                </Col>
                                <Col >
                                    <Upload
                                            action="//jsonplaceholder.typicode.com/posts/"
                                            :show-upload-list="false">
                                        <Button type="primary" icon="ios-cloud-upload">上传</Button>
                                    </Upload>
                                </Col>
                                <Col >
                                    <Button type="primary" @click="selectShow('w')" icon="refresh">重置</Button>
                                </Col>
                            </Row>
                        </Form>
                        <HotTable :root="root" :settings="settings"></HotTable>
                    </div>
                </Card>
            </Col>
            <Col span="4">
                <Card style="">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        最近编辑
                    </p>
                    <div v-for="list in historyList" :title='list.name' class="margin-top-20" style="border-bottom: #dddee1 solid 1px;text-indent: 1em;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                        <a href="javascript:void(0)" type="text" @click="selectShow(list.id)">{{list.name}}</a>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import { HotTable } from '@handsontable-pro/vue';
    import 'handsontable-pro/languages/zh-CN';
    export default {
        name: 'create-excel',
        components: {
            HotTable
        },
        data () {
            return {
                root: 'test-hot',
                settings: {
                    data: [
                        ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
                        ['2', '1', '3', '5', '6'],
                    ],
                    // columnSorting: true, // 排序
                    contextMenu: true,
                    rowHeaders: [1,2,3,4,5,6,7,8],//行表头
                    colHeaders:   ['A', 'B', 'C', 'D', 'E','F'],//列表头
                    minSpareCols: 15, //列留白
                    minSpareRows: 17,//行留白
                    columnSorting: true,//排序
                    // mergeCells: [   //合并
                    //     {row: 1, col: 1, rowspan: 3, colspan: 3},  //指定合并，从（1,1）开始行3列3合并成一格
                    //     {row: 3, col: 4, rowspan: 2, colspan: 2}
                    // ],
                    language: 'zh-CN',
                    manualColumnFreeze: true, //手动固定列
                    manualColumnMove: true, //手动移动列
                    manualRowMove: true,   //手动移动行
                    manualColumnResize: true,//手工更改列距
                    manualRowResize: true,//手动更改行距
                    comments: true, //添加注释

                },
                historyList: [
                    {
                        id:'1',
                        name: '刚刚在hssssssssssssssssssssssssssssssssssssgdf.png',
                        describe: ''
                    },
                    {
                        id:'2',
                        name: '方法是sggg.xls',
                        describe: ''
                    },
                    {
                        id:'3',
                        name: '方法撒大ff.wed',
                        describe: ''
                    },
                    {
                        id:'4',
                        name: '方法撒大3.fhf',
                        describe: ''
                    },
                    {
                        id:'5',
                        name: '方法撒43大.jhh',
                        describe: ''
                    }
                ]
            };
        },
        methods: {
            removeInfo(){
                let licenseInfo = document.getElementById('hot-display-license-info');
                console.info(licenseInfo)
                licenseInfo.innerHTML = "前端界最接近excel的插件，可以执行编辑，复制粘贴，插入删除行列，排序等复杂操作<br/>关你屁事！"
            },
        },
        mounted (){
            this.removeInfo();
        }
    };
</script>

<style src="../../../node_modules/handsontable-pro/dist/handsontable.full.css"></style>