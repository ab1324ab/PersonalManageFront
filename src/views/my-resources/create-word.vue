<style lang="less">
    @import '../../styles/common.less';
</style>
<style>
    .w-e-text-container{
        height: 460px !important;
    }
</style>
<template>
    <div id="hot-preview">
        <!--<HotTable :settings="settings"></HotTable>-->
        <Row :gutter="10">
            <Col span="20">
                <Card style="">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        新建工作文档
                    </p>
                    <div style="height: 550px">
                        <Form  inline :label-width='80' :model="wordObj">
                            <Row :gutter='10' type="flex">
                                <FormItem label="文档名称" prop="name">
                                    <Input v-model="wordObj.name" placeholder="输入文件名称" style="width: 300px"/>
                                </FormItem>
                                <Col>
                                    <Button type="primary" @click="addWordContent" icon="document-text">保存</Button>
                                </Col>
                                <Col>
                                    <Upload
                                            action="//jsonplaceholder.typicode.com/posts/"
                                            :show-upload-list="false">
                                        <Button type="primary" icon="ios-cloud-upload">上传</Button>
                                    </Upload>
                                </Col>
                                <Col>
                                    <Button type="primary" @click="newWordInit" icon="refresh">新建</Button>
                                </Col>
                            </Row>
                        </Form>
                        <div ref="tinymceEditer" id="tinymceEditer" style="height: 500px;"></div>
                        <!--<textarea id="tinymceEditer"></textarea>-->
                        <Spin fix v-if="false">
                            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                            <div>加载组件中...</div>
                        </Spin>
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
    /* eslint-disable indent,eqeqeq,no-empty,no-undef,one-var */
    import Editor from 'wangeditor';
    var qs = require('qs');
    import $util from '@/libs/util.js';
    //import tinymce from 'tinymce';
    export default {
        name: 'create-word',
        components: {
            Editor
        },
        data () {
            return {
                spinShow: true,
                historyList: [],
                editorc:{},
                wordObj:{
                    id:"",
                    describe:"",
                    name:"",
                    content:"",
                    type:"word"
                }
            };
        },
        computed:{

        },
        methods: {
            init () {
                let editor = new Editor('#tinymceEditer');
                this.editorc = editor;
                // 处理图片
                editor.customConfig.uploadImgServer = '/';
                editor.customConfig.uploadFileName = 'file';
                // 忽略粘贴内容中的图片
                editor.customConfig.pasteFilter = true;
                editor.customConfig.pasteIgnoreImg = false;
                editor.customConfig.pasteTextHandle = function (content) {
                    // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
                    let c = content.indexOf('src="');
                    var imgReg = /<img.*?(?:>|\/>)/gi;
                    var srcReg = /src=['"]?([^'"]*)['"]?/i;
                    var arr = content.match(imgReg);
                    //for (var i = 0; i < arr.length; i++) {
                       //var src = arr[i].match(srcReg);
                       //console.info('src',src[1])
                            // fs.readFile(src[1],"utf-8",function(err,data){
                            //     if(err){
                            //         console.log("readFile file error");
                            //         return false;
                            //     }
                            //     console.log(data);
                            // });
                    //}
                    //console.info('content',content);
                    return content;
                };
                editor.create();
                let sett = this;
                // $util.post('index.html')
                // .then(function (response) {
                //     console.log(response.data);
                // })
                // .catch(function (error) {
                //     console.log(error);
                // });
            },
            initHistoryWord(){
                let url = "initHistoryWord";
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
            wordTitle(name,describe){
                if(describe.length == 0){
                    return name;
                }else{
                    return describe
                }
            },
            addWordContent(){
                this.wordObj.content = this.editorc.txt.html();
                if(this.wordObj.name == "" || this.wordObj.content == ""){
                    $util.frontErrMsg(this,2,"请完善文档信息")
                    return;
                }
                let url = "";
                if(this.wordObj.id == ""){
                    url = "addWordContent";
                }else{
                    url = "updateWordContent";
                }
                let _this = this;
                $util.post(url,_this.wordObj)
                    .then(function (response) {
                        _this.loginLoading = false;
                        if(response.status == 200){
                            if(response.data.statusCode == "10000"){
                                _this.wordObj.id = response.data.data;
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
                this.wordObj.id = "";
                this.wordObj.content = "";
                this.wordObj.describe = "";
                this.wordObj.name = "";
                this.editorc.txt.clear();
            },
            selectShow (id) {
                this.newWordInit();
                this.wordObj.id = id;
                let url = "queryWordContent";
                let _this = this;
                $util.post(url,this.wordObj)
                    .then(function (response) {
                        if(response.status == 200){
                            if(response.data.statusCode == "10000"){
                                _this.wordObj.id = response.data.data.id;
                                _this.wordObj.name = response.data.data.name;
                                _this.editorc.txt.html(response.data.data.content);
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
        mounted () {
            this.init();
        },
        created(){
            this.initHistoryWord();
        }
    };
</script>
