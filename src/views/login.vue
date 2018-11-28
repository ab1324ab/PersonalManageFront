<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="account">
                            <Input v-model="form.account" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>

                        <FormItem prop="checkCode" v-if="imgCodeShow == 1">
                            <Row>
                                <Col :span="12">
                                    <Input type="password" v-model="form.checkCode" placeholder="请输入验证码">
                                        <span slot="prepend">
                                            <Icon :size="14" type="image"></Icon>
                                        </span>
                                    </Input>
                                </Col>
                                <Col :span="12" style="height: 32px">
                                    <img src="../images/default.jpg" style="margin-left: 10px;width: 90%;height: 32px" @click="resetPicCode"/>
                                </Col>
                            </Row>
                        </FormItem>

                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
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
            } else {
                callback();
            }
        };
        return {
            imgCodeShow: 0,
            form: {
                account: 'iview_admin',
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
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    let url = "login";
                    let _this = this;
                    $util.post(url,this.form)
                        .then(function (response) {
                            if(response.status == 200){
                                if(response.data.data != null){
                                    _this.imgCodeShow = parseInt(response.data.data.imgCodeShow);
                                }
                                if(response.data.statusCode == "10000"){
                                    Cookies.set('user', response.data.data.account);
                                    _this.$store.commit('setAvator', '../images/default.jpg');
                                    //_this.$store.commit('setAvator', response.data.data.imgurl);
                                    Cookies.set('access', 0); // 权限页 0：有权 1：没权
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
                            $util.httpErrorMsg(_this,error.data)
                        })
                }
            });
        },
        resetPicCode(){
            this.$Message.error({
                duration: 2,
                content: "ccccccccccccccccc"
            })
        }
    }
};
</script>

<style>

</style>
