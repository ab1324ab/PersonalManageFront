<style lang="less">
    @import '../styles/unlock.less';
</style>

<template>
    <transition name="show-unlock">
        <div class="unlock-body-con" v-if="showUnlock" @keydown.enter="handleUnlock">
            <div @click="handleClickAvator" class="unlock-avator-con" :style="{marginLeft: avatorLeft}">
                <img class="unlock-avator-img" :src="avatorPath">
                <div  class="unlock-avator-cover">
                    <span><Icon type="md-unlock" :size="30"></Icon></span>
                    <p>解锁</p>
                </div>
            </div>
            <div class="unlock-avator-under-back" :style="{marginLeft: avatorLeft}"></div>
            <div class="unlock-input-con">
                <div class="unlock-input-overflow-con">
                    <div class="unlock-overflow-body" :style="{right: inputLeft}">
                        <input ref="inputEle" v-model="password" class="unlock-input" type="password" placeholder="密码同登录密码" />
                        <button ref="unlockBtn" @mousedown="unlockMousedown" @mouseup="unlockMouseup" @click="handleUnlock" class="unlock-btn"><Icon color="white" type="ios-key"></Icon></button>
                    </div>
                </div>
            </div>
            <div class="unlock-locking-tip-con">已锁定</div>
        </div>
    </transition>
</template>

<script>
import Cookies from 'js-cookie';
import $util from '@/libs/util.js';
var qs = require('qs');

export default {
    name: 'Unlock',
    data () {
        return {
            avatorLeft: '0px',
            inputLeft: '400px',
            password: '',
            check: null
        };
    },
    props: {
        showUnlock: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
        handleClickAvator () {
            this.avatorLeft = '-150px';
            this.inputLeft = '0px';
            this.$refs.inputEle.focus();
        },
        handleUnlock () {
            if(this.password == ''){
                $util.frontErrMsg(this, 2, '请输入密码');
                return;
            }
            let url = 'unlocking';
            let _this = this;
            let formData = qs.stringify({
                "password":this.$md5(this.password)
            });
            $util.post(url, formData)
                .then(function (response) {
                    if (response.status == 200) {
                        if (response.data.statusCode == "10000") {
                            _this.avatorLeft = '0px';
                            _this.inputLeft = '400px';
                            _this.password = '';
                            Cookies.set('locking', '0');
                            _this.$emit('on-unlock');
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
        unlockMousedown () {
            this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn';
        },
        unlockMouseup () {
            this.$refs.unlockBtn.className = 'unlock-btn';
        }
    }
};
</script>
