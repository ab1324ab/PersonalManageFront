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
                let themeList = JSON.parse(localStorage.theme);
                localStorage.theme = JSON.stringify([{
                    userName: themeList[0].userName,
                    mainTheme: themeList[0].mainTheme,
                    menuTheme: themeList[0].menuTheme,
                    winSwitch: style
                }]);
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
        created () {
            let theme = localStorage.theme;
            console.info("localStorage.theme=","["+localStorage.theme+"]")
            if(theme != null){
                let themeList = JSON.parse(theme);
                console.info("winSwitch",themeList[0].winSwitch);
                this.winSwitch = themeList[0].winSwitch;
            }
        }
    };
</script>
