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
                <div style="position: absolute;top: 2px;left: 258px;" @click="qrcodeLogin">
                    <Tooltip  :content="tooltipText" placement="right">
                        <img  height="40px" :src="tooltipImg"/>
                    </Tooltip>
                </div>
                <div v-if="isQrcodelogin" class="form-con">
                    <div style="width: 200px;height: 200px;margin: 0 auto">
                        <img v-show="isSuccess" title="点击重试" width="200px" :src="scanSuccessImg" @click="isSuccess = false"/>
                        <div v-show="!isSuccess" id="qrcode"></div>
                    </div>
                    <p style="margin-top: 10px;" class="login-tip">
                        请使用新版 <b style="color: #ff000075">支付宝APP</b> 扫码完成登录
                    </p>
                </div>
                <div v-if="!isQrcodelogin" class="form-con">
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
import QRCode from 'qrcodejs2';
import qrcodeLoginImg from '../images/qrLogin.png';
import pcLoginImg from '../images/pcLogin.png';
import scanSuccessImg from '../images/scanSuccess.png';

import $util from '@/libs/util.js';
export default {
    data () {
        const validateCheckCode = (rule, value, callback) => {
            if (this.imgCodeShow == 1 && value === '') {
                callback(new Error('验证码不能为空'));
            } else if (value.length < 4) {
                callback(new Error('验证码至少4位'));
            } else {
                callback();
            }
        };
        return {
            qrcodeLoginImg: qrcodeLoginImg,
            pcLoginImg: pcLoginImg,
            isSuccess: false,
            scanSuccessImg: scanSuccessImg,
            loginLoading: false,
            isQrcodelogin: false,
            imgCode: '',
            imgCodeShow: 0,
            form: {
                account: '',
                password: '',
                checkCode: ''
            },
            submitForm: {
                account: '',
                password: '',
                checkCode: ''
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
                ]
            }
        };
    },
    computed: {
        tooltipText () {
            if (this.isQrcodelogin) {
                return '账号密码登陆';
            } else {
                return '二维码登陆';
            }
        },
        tooltipImg () {
            if (this.isQrcodelogin) {
                return this.pcLoginImg;
            } else {
                return this.qrcodeLoginImg;
            }
        }
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
                    let url = 'login';
                    $util.post(url, this.submitForm)
                        .then(function (response) {
                            _this.loginLoading = false;
                            if (response.status == 200) {
                                if (response.data.data != null) {
                                    _this.resetPicCode();
                                    _this.imgCodeShow = parseInt(response.data.data.imgCodeShow);
                                }
                                if (response.data.statusCode == '10000') {
                                    Cookies.set('user', response.data.data.nickname);
                                    _this.$store.commit('setAvator', response.data.data.imgurl);
                                    Cookies.set('access', 0); // 权限页 0：有权 1：没权
                                    let oldLoginTime = response.data.data.oldLoginTime;
                                    localStorage.setItem('oldLoginTime', oldLoginTime);
                                    let oldIp = response.data.data.oldIp;
                                    localStorage.setItem('oldIp', oldIp);
                                    let oldIpAddress = response.data.data.oldIpAddress;
                                    localStorage.setItem('oldIpAddress', oldIpAddress);
                                    let nickname = response.data.data.nickname;
                                    localStorage.setItem('nickname', nickname);
                                    _this.$router.push({
                                        name: 'home_index'
                                    });
                                } else {
                                    $util.responseMsg(_this, response.data);
                                }
                            } else {
                                $util.httpErrorMsg(_this, response.data);
                            }
                        })
                        .catch(function (error) {
                            _this.loginLoading = false;
                            $util.httpErrorMsg(_this, error.data);
                        });
                }
            });
        },
        resetPicCode () {
            let url = 'getCodeImg';
            let _this = this;
            $util.get(url)
                .then(function (response) {
                    _this.imgCode = response.data;
                }).catch(function (error) {
                    $util.httpErrorMsg(_this, error.data);
                });
        },
        createQrcode () {
            let _this = this;
            this.isSuccess = false;
            let url = 'getAlipayLoginPath';
            $util.post(url, {})
                .then(function (response) {
                    if (response.status == 200) {
                        if (response.data.statusCode == '10000') {
                            let loginPath = response.data.data;
                            let qrcode = new QRCode('qrcode', {
                                width: 200,
                                height: 200, // 高度
                                text: loginPath // 二维码内容
                                // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                                // background: '#f0f'
                                // foreground: '#ff0'
                            });
                            var div = document.getElementById('qrcode');
                            div.title = "请使用支付宝app扫描二维码";
                            console.info(div);
                        } else {
                            $util.responseMsg(_this, response.data);
                        }
                    } else {
                        $util.httpErrorMsg(_this, response.data);
                    }
                })
                .catch(function (error) {
                    $util.httpErrorMsg(_this, error.data);
                });
        },
        initWebSocket () {
            let url = $util.getWebUrl().replace("http://","");
            const wsuri = 'ws://'+url+'/webMessage';// ws地址
            window.websock = new WebSocket(wsuri);
            websock.onopen = this.websocketonopen;
            websock.onerror = this.websocketonerror;
            websock.onmessage = this.websocketonmessage;
            websock.onclose = this.websocketclose;
        },
        websocketonopen () {
            console.log('服务器连接成功！');
            this.createQrcode();
        },
        websocketonerror (e) { // 错误
            $util.frontErrMsg(this, 2, '服务器连接异常');
        },
        websocketonmessage (e) { // 数据接收
            // 注意：长连接我们是后台直接1秒推送一条数据，
            // 但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
            // 这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
            const data = JSON.parse(e.data);
            if (data.code == '10003') {
                this.isSuccess = true;
            } else if (data.code == '40028') {
                $util.frontErrMsg(this, 2, data.msg);
            } else if (data.code == '10000') {
                Cookies.set('user', data.nickname);
                this.$store.commit('setAvator', data.imgurl);
                Cookies.set('access', 0); // 权限页 0：有权 1：没权
                let oldLoginTime = data.oldLoginTime;
                localStorage.setItem('oldLoginTime', oldLoginTime);
                let oldIp = data.oldIp;
                localStorage.setItem('oldIp', oldIp);
                let oldIpAddress = data.oldIpAddress;
                localStorage.setItem('oldIpAddress', oldIpAddress);
                let nickname = data.nickname;
                localStorage.setItem('nickname', nickname);
                this.websocketclose();
                this.$router.push({
                    name: 'home_index'
                });
            }
        },
        websocketsend (agentData) { // 数据发送
            websock.send(agentData);
        },
        websocketclose (e) { // 关闭
            websock.close();
        },
        qrcodeLogin () {
            this.isQrcodelogin = !this.isQrcodelogin;
            if (this.isQrcodelogin) {
                this.initWebSocket();
            } else {
                this.websocketclose();
            }
        }
    },
    beforeDestroy () {
        // 毁后调用
        this.websocketclose();
    },
    created () {
        this.resetPicCode();
    }
};
</script>

<style>

</style>
