<template>
    <div style="display:inline-block;padding:0 6px;">
        <Dropdown trigger="click" @on-click="windowSwitch">
            <a href="javascript:void(0)">
                <Icon :style="{marginTop: '-2px', verticalAlign: 'middle'}" type="social-windows" :size="18" color="#657180"></Icon>
                <Icon type="arrow-down-b"></Icon>
            </a>
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
