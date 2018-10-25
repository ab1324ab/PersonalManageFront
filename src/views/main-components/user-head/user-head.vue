<template>
    <div class="user-dropdown-menu-con">
        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
            <Dropdown transfer trigger="hover" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                    <Avatar :src="avatorPath" size="large" ></Avatar>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </Row>
    </div>
</template>
<script>
    import util from '@/libs/util.js';
    export default {
        name: 'userHead',
        data () {
            return {

            };
        },
        computed: {
            avatorPath () {
                return localStorage.avatorImgPath;
            }
        },
        methods: {
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    // 退出登录
                    this.$store.commit('logout', this);
                    this.$store.commit('clearOpenedSubmenu');
                    this.$router.push({
                        name: 'login'
                    });
                }
            }
        },
        created () {

        }

    };
</script>
