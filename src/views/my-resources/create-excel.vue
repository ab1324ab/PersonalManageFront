<style lang="less">
    @import '../../styles/common.less';
    /*.wtHolder{*/
        /*width: 100% !important;*/
        /*height: 460px !important;*/
    /*}*/
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
                    <div :style="{height: hotTableH}">
                        <Form :label-width='80' inline>
                            <Row :gutter="10" type="flex" >
                                <FormItem label="文件名称" prop="name">
                                    <Input placeholder="输入文件名称" style="width: 300px"/>
                                </FormItem>
                                <Col>
                                    <Button type="primary" @click="addExcelContent" icon="document-text">保存</Button>
                                </Col>
                                <Col >
                                    <Upload
                                            action="//jsonplaceholder.typicode.com/posts/"
                                            :show-upload-list="false">
                                        <Button type="primary" icon="ios-cloud-upload">上传</Button>
                                    </Upload>
                                </Col>
                                <Col >
                                    <Button type="primary" @click="newWordInit" icon="refresh">新建</Button>
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
                    <div v-for="list in historyList" :title='wordTitle(list.name,list.describe)' class="margin-top-20" style="border-bottom: #dddee1 solid 1px;text-indent: 1em;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
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
    import $util from '@/libs/util.js';

    export default {
        name: 'create-excel',
        components: {
            HotTable
        },
        data () {
            return {
                hotTableH:'0px',
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
                    minSpareCols: 100, //列留白
                    minSpareRows: 100,//行留白
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
                excelObj:{
                    id:"",
                    describe:"",
                    name:"",
                    content:"",
                    type:"word"
                },
                historyList: []
            };
        },
        methods: {
            initHotTableHeight(){
                var docHeight = document.body.scrollHeight;
                var wordTH = docHeight - 210;
                this.hotTableH = wordTH + 'px';
                var wtHolderCssH = wordTH - 90;
                console.info(wtHolderCssH);
                // 直接写入style标签
                var nod = document.createElement("style"),
                str = ".wtHolder{ width: 100% !important; height: "+wtHolderCssH+"px !important;} #hot-display-license-info{ padding: 10px 0 3px 0 !important;}";
                nod.type="text/css";
                if(nod.styleSheet){         //ie下
                    nod.styleSheet.cssText = str;
                } else {
                    nod.innerHTML = str;
                }
                document.getElementsByTagName("head")[0].appendChild(nod);
            },
            removeInfo(){
                let licenseInfo = document.getElementById('hot-display-license-info');
                //licenseInfo.style.
                console.info(licenseInfo)
                licenseInfo.innerHTML = "前端界最接近excel的插件，可以执行编辑，复制粘贴，插入删除行列，排序等复杂操作<br/>关你屁事！"
            },
            wordTitle(name,describe){
                if(describe.length == 0){
                    return name;
                }else{
                    return describe
                }
            },
            initHistoryExcel(){
                let url = "initHistoryExcel";
                let _this = this;
                $util.post(url,{})
                    .then(function (response) {
                        _this.loginLoading = false;
                        if(response.status == 200){
                            if(response.data.statusCode == "10000"){
                                _this.historyList = response.data.data
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
            addExcelContent(){
                this.excelObj.content = "";
                if(this.excelObj.name == "" || this.excelObj.content == ""){
                    $util.frontErrMsg(this,2,"请完善文档信息")
                    return;
                }
                let url = "";
                if(this.excelObj.id == ""){
                    url = "addExcelContent";
                }else{
                    url = "updateExcelContent";
                }
                let _this = this;
                $util.post(url,_this.excelObj)
                    .then(function (response) {
                        _this.loginLoading = false;
                        if(response.status == 200){
                            if(response.data.statusCode == "10000"){
                                _this.excelObj.id = response.data.data;
                                $util.frontSuccMsg(_this,2,response.data.msg);
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
            newWordInit(){
                this.excelObj.id = "";
                this.excelObj.content = "";
                this.excelObj.describe = "";
                this.excelObj.name = "";
                this.editorc.txt.clear();
            },
            selectShow (id) {
                this.newWordInit();
                this.excelObj.id = id;
                let url = "queryExcelContent";
                let _this = this;
                $util.post(url,this.excelObj)
                    .then(function (response) {
                        if(response.status == 200){
                            if(response.data.statusCode == "10000"){
                                console.info(response)
                                // _this.excelObj.id = response.data.data.id;
                                // _this.excelObj.name = response.data.data.name;
                                // _this.editorc.txt.html(response.data.data.content);
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
        },
        mounted (){
            this.removeInfo();
            this.initHotTableHeight();
        },
        created(){
            this.initHistoryExcel()
        }
    };
</script>

<style src="../../../node_modules/handsontable-pro/dist/handsontable.full.css"></style>