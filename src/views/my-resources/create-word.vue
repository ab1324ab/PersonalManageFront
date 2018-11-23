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
                        <Form  inline :label-width='80' >
                            <Row :gutter='10' type="flex">
                                <FormItem label="文档名称" prop="name">
                                    <Input placeholder="输入文件名称" style="width: 300px"/>
                                </FormItem>
                                <Col>
                                    <Button type="primary" @click="selectShow('w')" icon="document-text">保存</Button>
                                </Col>
                                <Col>
                                    <Upload
                                            action="//jsonplaceholder.typicode.com/posts/"
                                            :show-upload-list="false">
                                        <Button type="primary" icon="ios-cloud-upload">上传</Button>
                                    </Upload>
                                </Col>
                                <Col>
                                    <Button type="primary" @click="selectShow('w')" icon="refresh">重置</Button>
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
                    <div v-for="list in historyList" :title='list.name' class="margin-top-20" style="border-bottom: #dddee1 solid 1px;text-indent: 1em;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
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
            init () {
                let editor = new Editor('#tinymceEditer');
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
                    for (var i = 0; i < arr.length; i++) {
                       var src = arr[i].match(srcReg);
                       console.info('src',src[1])
                        // fs.readFile(src[1],"utf-8",function(err,data){
                        //     if(err){
                        //         console.log("readFile file error");
                        //         return false;
                        //     }
                        //     console.log(data);
                        // });
                    }
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
            selectShow (id) {
                console.info('文件标识',id)
            }
        },
        mounted () {
            this.init();
        },
        destroyed () {
            // tinymce.get('tinymceEditer').destroy();
        }
    };
</script>
