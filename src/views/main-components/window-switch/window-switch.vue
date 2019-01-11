<template>
    <div style="display:inline-block;padding:0 6px;">
        <Dropdown trigger="click" @on-click="windowSwitch">
            <Tooltip content="窗口" placement="bottom">
                <a href="javascript:void(0)">
                    <Icon :style="{ verticalAlign: 'middle'}" type="logo-windows" :size="23" color="#657180"></Icon>
                    <Icon type="md-arrow-dropdown"></Icon>
                </a>
            </Tooltip>
            <DropdownMenu slot="list">
                <DropdownItem name="top">
                    <Row type="flex" justify="center" align="middle">
                        <img src="../../../images/topMenu.png"></img>
                    </Row>
                </DropdownItem>
                <DropdownItem name="left">
                    <Row type="flex" justify="center" align="middle">
                        <img src="../../../images/leftMenu.png"></img>
                    </Row>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
    /* eslint-disable no-empty,quotes,eqeqeq */
    import Cookies from 'js-cookie';
    export default {
        name: 'windowSwitch',
        props: {

        },
        data () {
            return {

            };
        },
        methods: {
            windowSwitch (name) {
                if (name == "top") {
                    this.$emit('mainWindowSwitch', "top");
                } else {
                    this.$emit('mainWindowSwitch', "left");
                }
            },
        },
        created () {

        }
    };
</script>
