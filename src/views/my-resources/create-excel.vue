<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col :sm="20" :xs="24">
                <Card style="">
                    <p slot="title">
                        <Icon type="md-grid"></Icon>
                        新建表格文档
                    </p>
                    <div>
                        <Form inline v-model="excelObj">
                            <FormItem :label-width='60' label="文件名称" prop="name">
                                <Input style="width: 200px;" placeholder="输入文件名称" v-model="excelObj.name" />
                            </FormItem>
                            <FormItem >
                                <Button type="primary" @click="addExcelContent" icon="md-document">保存</Button>
                                <Button type="primary" @click="newWordInit" icon="md-refresh">新建</Button>
                                <Upload style="float: right;margin-left: 5px;" action="//jsonplaceholder.typicode.com/posts/" :show-upload-list="false">
                                    <Button type="primary" icon="ios-cloud-upload">上传</Button>
                                </Upload>
                            </FormItem>
                            <FormItem>

                            </FormItem>
                        </Form>
                        <HotTable ref="thisTable" :root="root" :settings="settings"></HotTable>
                    </div>
                </Card>
            </Col>
            <Col :sm="4" :xs="0">
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
                hotTableData:[],
                root: 'test-hot',
                settings:{
                    data: [
                        ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
                        ['2', '1', '3', '5', '6'],
                    ],
                    contextMenu: true,
                    rowHeaders: [1,2,3,4,5,6,7,8], //行表头
                    colHeaders: ['A', 'B', 'C', 'D', 'E','F'], //列表头
                    minSpareCols: 50,      //列留白
                    minSpareRows: 50,      //行留白
                    columnSorting: true,   //排序
                    language: 'zh-CN',     //选择中文语言包
                    manualColumnFreeze: true, //手动固定列
                    manualColumnMove: true,   //手动移动列
                    manualRowMove: true,       //手动移动行
                    fillHandle: false,         //允许拖动单元格右下角
                    manualColumnResize: true, //手工更改列距
                    manualRowResize: true,     //手动更改行距
                    //comments: true, //添加注释
                    // mergeCells: [   //合并
                    //     {row: 1, col: 1, rowspan: 3, colspan: 3},  //指定合并，从（1,1）开始行3列3合并成一格
                    //     {row: 3, col: 4, rowspan: 2, colspan: 2}
                    // ],

                },
                excelObj:{
                    id:"",
                    describe:"",
                    name:"",
                    content:"",
                    type:"excel"
                },
                historyList: []
            };
        },
        methods: {
            initHotTableHeight(){
                var docHeight = document.body.scrollHeight;
                var wordTH = docHeight - 210;
                if(wordTH < 398){
                    wordTH = 398;
                }
                var wtHolderCssH = wordTH - 90;
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
            removeNotList(data){
                let temp = new Array();
                for(var i = 0 ; i < data.length ; i++){
                    var flag = false;
                    for(var j = 0 ;j <data[i].length ; j++){
                        if(data[i][j] != null && data[i][j] != ""){
                            flag = true;
                            break;
                        }
                    }
                    if(flag){
                        temp.push(data[i]);
                    }
                }
                return temp;
            },
            addExcelContent(){
                var contentArray = this.removeNotList(this.$refs.thisTable.$data.hotInstance.getData());
                this.excelObj.content = JSON.stringify(contentArray);
                if(this.excelObj.name == "" || contentArray.length == 0){
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
                this.$refs.thisTable.$data.hotInstance.clear();
                this.$refs.thisTable.$data.hotInstance.deselectCell();
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
                                _this.excelObj.id = response.data.data.id;
                                _this.excelObj.name = response.data.data.name;
                                var data = JSON.parse(response.data.data.content);
                                _this.$refs.thisTable.$data.hotInstance.loadData(data);
                            }else {
                                $util.responseMsg(_this,response.data);
                            }
                        }else{
                            $util.httpErrorMsg(_this,response.data)
                        }
                    })
                    .catch(function (error) {
                        console.info(error);
                        $util.httpErrorMsg(_this,error.data)
                    })
            }
        },
        activated(){
            console.info("activated() => start");
            let fileId = this.$route.params.fileId;
            if(fileId != null && fileId !=""){
                this.selectShow(fileId);
            }
        },
        mounted (){
            this.removeInfo();
            this.initHotTableHeight();
            this.newWordInit();
            window.onresize = () => {
                return (() => {
                    this.initHotTableHeight();
                })()
            };
        },
        created(){
            this.initHistoryExcel()
        }
    };
</script>

<style src="../../../node_modules/handsontable-pro/dist/handsontable.full.css"></style>