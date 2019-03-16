<template>
    <div style="line-height: 60px;">
        <Dropdown trigger="click" @on-click="changeMenu" >
            <a href="javascript:void(0)">
                <Icon type="logo-buffer" size="23" style="color: #657180;" />
                <Icon type="md-arrow-dropdown" :size="5" ></Icon>
            </a>
            <DropdownMenu slot="list" style="line-height: 0;">
                <template v-if="showMenu" v-for="(item, index) in menuList">
                    <DropdownItem v-if="item.children.length <= 1" :name="item.children[0].name" :key="index" >
                       <!-- <Icon :size="23" :type="item.icon"></Icon>-->
                        {{itemTitle(item)}}
                    </DropdownItem>
                    <Dropdown trigger="click" v-else placement="right-start" :key="index">
                        <DropdownItem>
                            {{itemTitle(item)}}
                            <Icon type="ios-arrow-forward"></Icon>
                        </DropdownItem>
                        <DropdownMenu slot="list">
                            <template v-for="(child, indexs) in item.children">
                                <DropdownItem :name="child.name"  :key="indexs">{{itemTitle(child)}}</DropdownItem>
                            </template>
                        </DropdownMenu>
                    </Dropdown>
                </template>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
export default {
    name: 'sidebarMenuShrinkMin',
    props: {
        menuList: {
            type: Array
        },
        iconColor: {
            type: String,
            default: 'white'
        },
        menuTheme: {
            type: String,
            default: 'darck'
        }
    },
    data (){
        return{
            showMenu : true,
        }
    },
    computed:{

    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        },
        isShowMenu(){
            this.showMenu = !this.showMenu;
        },
    },
    created(){
    }
};
</script>
