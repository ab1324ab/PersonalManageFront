<style lang="less">
    @import "./main.less";
</style>
<template>
    <menu-top v-if="winSwitch == 'top'" v-on:mainWindowSwitch="mainWindowSwitch"></menu-top>
    <menu-left v-else v-on:mainWindowSwitch="mainWindowSwitch"></menu-left>
</template>
<script>
    /* eslint-disable no-trailing-spaces,padded-blocks,no-unused-vars,no-console */

    import menuLeft from './main-components/shrinkable-menu/menu-left';
    import menuTop from './main-components/shrinkable-menu/menu-top';
    import Cookies from 'js-cookie';
    // import util from '@/libs/util.js';

    export default {
        components: {
            menuLeft,
            menuTop
        },
        data () {
            return {
                winSwitch: 'left'
            };
        },
        computed: {

        },
        methods: {
            mainWindowSwitch (style) {
                this.winSwitch = style;
                let winSwitch = style;
                this.$store.commit('changeWinTheme', style);
                let userName = Cookies.get('user');
                if (localStorage.theme) {
                    let mainTheme = this.$store.state.app.themeColor;
                    let menuTheme = this.$store.state.app.menuTheme;
                    let themeList = JSON.parse(localStorage.theme);
                    let index = 0;
                    let hasThisUser = themeList.some((item, i) => {
                        if (item.userName === userName) {
                            index = i;
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (hasThisUser) {
                        themeList[index].mainTheme = mainTheme;
                        themeList[index].menuTheme = menuTheme;
                        themeList[index].winSwitch = winSwitch;
                    } else {
                        themeList.push({
                            userName: userName,
                            mainTheme: mainTheme,
                            menuTheme: menuTheme,
                            winSwitch: winSwitch
                        });
                    }
                    localStorage.theme = JSON.stringify(themeList);
                } else {
                    localStorage.theme = JSON.stringify([{
                        userName: userName,
                        winSwitch: winSwitch
                    }]);
                }
            },
            menuFlag(){
                let theme = localStorage.theme;
                if(theme != null){
                    var docWidth = document.body.scrollWidth;
                    if(docWidth < 500){
                        this.winSwitch = 'top';
                    }else{
                        let themeList = JSON.parse(theme);
                        this.winSwitch = themeList[0].winSwitch;
                    }
                }
            },
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
        mounted(){
            this.menuFlag();
            window.onresize = () => {
                return (() => {
                    this.menuFlag();
                })()
            };
        },
        created () {

        }
    };
</script>
