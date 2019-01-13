<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="md-log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="account">
                            <Input v-model="form.account" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="md-person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="16" type="md-lock"></Icon>
                                </span>
                            </Input>
                        </FormItem>

                        <FormItem prop="checkCode" v-if="imgCodeShow == 1">
                            <Row>
                                <Col :span="12">
                                    <Input v-model="form.checkCode" :maxlength="4" placeholder="请输入验证码">
                                        <span slot="prepend">
                                            <Icon :size="14" type="md-image"></Icon>
                                        </span>
                                    </Input>
                                </Col>
                                <Col :span="12" style="height: 32px">
                                    <img :src="imgCode" style="margin-left: 10px;width: 90%;height: 32px" @click="resetPicCode"/>
                                </Col>
                            </Row>
                        </FormItem>

                        <FormItem>
                            <Button @click="handleSubmit" :loading="loginLoading" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">忘记密码？这辈子都不可能</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import $util from '@/libs/util.js';
export default {
    data () {
        const validateCheckCode = (rule, value, callback) => {
            if (this.imgCodeShow == 1 && value === '') {
                callback(new Error('验证码不能为空'));
            } else if(value.length < 4){
                callback(new Error('验证码至少4位'));
            }else {
                callback();
            }
        };
        return {
            loginLoading: false,
            imgCode:"",
            imgCodeShow: 0,
            form: {
                account: '',
                password: '',
                checkCode:''
            },
            submitForm: {
                account: '',
                password: '',
                checkCode:''
            },
            rules: {
                account: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                checkCode: [
                    { validator: validateCheckCode, trigger: 'blur' }
                ],
            }
        };
    },
    methods: {
        handleSubmit () {
            let _this = this;
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    _this.submitForm.account = _this.form.account;
                    _this.submitForm.password = _this.$md5(this.form.password);
                    _this.submitForm.checkCode = _this.form.checkCode;
                    _this.loginLoading = true;
                    let url = "login";
                    $util.post(url,this.submitForm)
                        .then(function (response) {
                            _this.loginLoading = false;
                            if(response.status == 200){
                                if(response.data.data != null){
                                    _this.resetPicCode();
                                    _this.imgCodeShow = parseInt(response.data.data.imgCodeShow);
                                }
                                if(response.data.statusCode == "10000"){
                                    Cookies.set('user', response.data.data.nickname);
                                    _this.$store.commit('setAvator', response.data.data.imgurl);
                                    Cookies.set('access', 0); // 权限页 0：有权 1：没权
                                    let oldLoginTime = response.data.data.oldLoginTime;
                                    localStorage.setItem("oldLoginTime",oldLoginTime);
                                    let oldIp = response.data.data.oldIp;
                                    localStorage.setItem("oldIp",oldIp);
                                    let oldIpAddress = response.data.data.oldIpAddress;
                                    localStorage.setItem("oldIpAddress",oldIpAddress);
                                    let nickname = response.data.data.nickname;
                                    localStorage.setItem("nickname",nickname);
                                    _this.$router.push({
                                        name: 'home_index'
                                    });
                                }else {
                                    $util.responseMsg(_this,response.data);
                                }
                            }else{
                                $util.httpErrorMsg(_this,response.data)
                            }
                        })
                        .catch(function (error) {
                            _this.loginLoading = false;
                            $util.httpErrorMsg(_this,error.data)
                        })
                }
            });
        },
        resetPicCode(){
            let url = "getCodeImg";
            let _this = this;
            $util.get(url)
                .then(function (response) {
                    _this.imgCode = response.data;
                }).catch(function (error) {
                    $util.httpErrorMsg(_this,error.data)
                })
        }
    },
    created (){
        this.resetPicCode();
    }
};
</script>

<style>

</style>
