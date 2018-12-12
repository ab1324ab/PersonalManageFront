<style lang="less">
    @import '../../styles/common';
    @import './style/image-editor';
</style>
<style>
    .ivu-card-body{
        height: 100% !important;
    }
</style>
<template>
    <div class="image-editor">
        <Modal
            v-model="option.showCropedImage"
            title="预览裁剪之后的图片">
            <img :src="option.cropedImg" alt=""  style="width: 100%;">
            <div slot="footer">
                <Button type="primary" @click="option.showCropedImage = false">取消</Button>
                <Button type="primary" @click="uploadImg('trim')">保存上传</Button>
            </div>
        </Modal>
        <Row :gutter="10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="qr-scanner"></Icon>
                        图片编辑
                    </p>
                    <Form :label-width='80' inline style="margin-bottom: -25px" v-model="imgObj">
                        <Row :gutter="10" type="flex">
                            <FormItem label="文件名称" prop="name">
                                <Input placeholder="输入文件名称" v-model="imgObj.name" style="width: 300px"/>
                            </FormItem>
                            <Col>
                                <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange" id="fileinput" class="fileinput"/>
                                <label class="filelabel" for="fileinput">
                                    <Icon type="image"></Icon>&nbsp;选择图片</label>
                            </Col>
                            <Col>
                                <Button type="primary" @click="uploadImg('direct')" icon="upload">直接上传</Button>
                            </Col>
                            <Col>
                                <Button @click="handlecrop" type="primary" icon="crop">裁剪上传</Button>
                                <!--<Button type="primary" @click="selectShow('w')" icon="refresh">重置</Button>-->
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Row :gutter="10" class="margin-top-10">
                    <Col span="17" class="image-editor-con1">
                        <Card style="height: 100%">
                            <div class="cropper">
                                <img id="cropimg" height="505" src="../../images/cropper-test.png" alt="">
                            </div>
                        </Card>
                    </Col>
                    <Col span="7" class="image-editor-con1">
                        <Card>
                            <p slot="title">
                                <Icon type="qr-scanner"></Icon>
                                裁剪预览
                            </p>
                            <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
                                <div id="preview"></div>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
    import Cropper from 'cropperjs';
    import './style/cropper.min.css';
    import $util from '@/libs/util.js';
    var qs = require('qs');

    export default {
        name: "create-image",
        data() {
            return {
                cropper: {},
                uploadFile:{},
                option: {
                    showCropedImage: false,
                    cropedImg: ''
                },
                imgObj:{
                    id:"",
                    name:"",
                    imgPath:"",
                    type:"img"
                }
            };
        },
        methods: {
            init() {
                let img = document.getElementById('cropimg');
                this.cropper = new Cropper(img, {
                    dragMode: 'move',
                    preview: '#preview',
                    restore: false,
                    center: false,
                    highlight: false,
                    cropBoxMovable: true,
                    toggleDragModeOnDblclick: false
                });
            },
            handleChange(e) {
                let file = e.target.files[0];
                this.uploadFile = file;
                let reader = new FileReader();
                reader.onload = () => {
                    this.cropper.replace(reader.result);
                    reader.onload = null;
                };
                reader.readAsDataURL(file);
            },
            uploadImg(data){
                let upFile = {};
                if(data ==  'direct'){
                    upFile = this.uploadFile;
                }else{
                    upFile = this.option.cropedImg;
                }
                if(upFile == null){
                    $util.frontErrMsg(this,2,"请上传图片");
                    return;
                }else if(this.imgObj.name == ""){
                    $util.frontErrMsg(this,2,"请输入名称");
                    return;
                }
                let url = "upload"
                let _this = this;
                let param = new window.FormData();
                param.append('file', upFile);
                $util.post(url,param,{
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(function (response) {
                        _this.loginLoading = false;
                        if(response.status == 200){
                            if(response.data.statusCode == "10000"){
                                _this.imgObj.imgPath = response.data.data;
                                let url = "";
                                if(_this.imgObj.id == ""){
                                    url = "addImagesInfo";
                                }else {
                                    url = "updateImagesInfo";
                                }
                                $util.post(url,_this.imgObj)
                                .then(function (response) {
                                    if(response.status == 200 ){
                                        if( response.data.statusCode == "10000"){
                                            _this.imgObj.id = response.data.data;
                                            $util.frontSuccMsg(_this,2,response.data.msg);
                                        }else{
                                            $util.responseMsg(_this,response.data);
                                        }
                                    }else{
                                        $util.httpErrorMsg(_this,response.data)
                                    }
                                })
                                .catch(function (error) {
                                    $util.httpErrorMsg(_this,error.data)
                                })
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
            handlecrop() {
                let file = this.cropper.getCroppedCanvas().toDataURL();
                this.option.cropedImg = file;
                this.option.showCropedImage = true;
            },
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>

</style>