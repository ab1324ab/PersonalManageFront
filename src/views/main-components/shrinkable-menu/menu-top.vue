<style lang="less">
    @import "../../main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="main-header-con-top">
            <div class="main-header">
                <shrinkable-menu-top v-if="!minNeum"
                        :shrink="shrink"
                        @on-change="handleSubmenuChange"
                        :theme="menuTheme"
                        :before-push="beforePush"
                        :open-names="openedSubmenuArr"
                        :menu-list="menuList">
                    <div slot="left" style="float: left;" class="navicon-con">
                        <img style="height: 45px"  src="../../../images/logo-min.jpg" key="min-logo" />
                    </div>
                    <div slot="right" class="header-avator-con">
                        <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                        <lock-screen></lock-screen>
                        <message-tip v-model="mesCount"></message-tip>
                        <theme-switch :theme="menuTheme"></theme-switch>
                        <window-switch :theme="menuTheme" v-on:mainWindowSwitch="mainWindowSwitch"></window-switch>
                        <user-head></user-head>
                    </div>
                </shrinkable-menu-top>
                <shrinkable-menu-min v-if="minNeum"
                         :shrink="minNeum"
                         @on-change="handleSubmenuChange"
                         :theme="menuTheme"
                         :before-push="beforePush"
                         :open-names="openedSubmenuArr"
                         :menu-list="menuList">
                    <div slot="left" style="float: left;" class="navicon-con">
                        <img style="height: 45px"  src="../../../images/logo-min.jpg" key="min-logo" />
                    </div>
                    <div slot="right" class="header-avator-con-min">
                        <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                        <lock-screen></lock-screen>
                        <message-tip v-model="mesCount"></message-tip>
                        <theme-switch :theme="menuTheme"></theme-switch>
                        <!--<window-switch :theme="menuTheme" v-on:mainWindowSwitch="mainWindowSwitch"></window-switch>-->
                        <user-head></user-head>
                    </div>
                </shrinkable-menu-min>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con-top" >
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>
<script>
    import shrinkableMenuTop from '../../main-components/shrinkable-menu/shrinkable-menu-top.vue';
    import shrinkableMenuMin from '../../main-components/shrinkable-menu/shrinkable-menu-min.vue';
    import tagsPageOpened from '../../main-components/tags-page-opened.vue';
    import breadcrumbNav from '../../main-components/breadcrumb-nav.vue';
    import fullScreen from '../../main-components/fullscreen.vue';
    import lockScreen from '../../main-components/lockscreen/lockscreen.vue';
    import messageTip from '../../main-components/message-tip.vue';
    import themeSwitch from '../../main-components/theme-switch/theme-switch.vue';
    import userHead from '../../main-components/user-head/user-head.vue';
    import windowSwitch from '../../main-components/window-switch/window-switch';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';

    export default {
        name: 'menuTop',
        components: {
            shrinkableMenuTop,
            shrinkableMenuMin,
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            lockScreen,
            messageTip,
            themeSwitch,
            userHead,
            windowSwitch
        },
        data () {
            return {
                shrink: false,
                isFullScreen: false,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
                minNeum: false,
            };
        },
        computed: {
            menuList () {
                return this.$store.state.app.menuList;
            },
            pageTagsList () {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            lang () {
                return this.$store.state.app.lang;
            },
            menuTheme () {
                return this.$store.state.app.menuTheme;
            },
            mesCount () {
                return this.$store.state.app.messageCount;
            },
        },
        methods: {
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                this.$store.commit('updateMenulist');
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
                this.$store.commit('setMessageCount', 3);
            },
            toggleClick () {
                this.shrink = !this.shrink;
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            handleSubmenuChange (val) {
                // console.log(val)
            },
            beforePush (name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
            fullscreenChange (isFullScreen) {
                // console.log(isFullScreen);
            },
            mainWindowSwitch (style) {
                this.$emit('mainWindowSwitch', style);
            },
            menuIsMin(){
                var docWidth = document.body.scrollWidth;
                if(docWidth< 500){
                    this.minNeum = true;
                }else{
                    this.minNeum = false;
                }
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                // 清理打开菜单列表
                this.$store.commit('clearOpenedSubmenu');
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            }
        },
        mounted () {
            this.init();
            this.menuIsMin();
            window.onresize = () => {
                return (() => {
                    this.menuIsMin();
                })()
            };
        },
        created () {
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');

        }
    };
</script>
