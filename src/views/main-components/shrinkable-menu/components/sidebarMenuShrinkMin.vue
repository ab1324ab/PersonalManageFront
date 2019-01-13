<template>
    <div ref="divmenu" style="position: relative;top: 45px;left: 50px;width: 55px;">
        <div style="text-align: center;position: relative;top: -89px;">
            <a href="javascript:void(0)" @click="isShowMenu">
                <Icon type="logo-buffer" size="23" style="color: #657180;" />
                <Icon type="md-arrow-dropdown" :size="5" ></Icon>
            </a>
        </div>
        <template v-if="showMenu" v-for="(item, index) in menuList">
            <transition name="fade" mode="out-in" >
            <div style="width: 110px;position: relative;top: -85px;text-align: center;background-color: white;border: 1px solid #f0f0f0;border-radius: 5px;" :key="index">
                <Dropdown transfer v-if="item.children.length !== 1" placement="right-start" :key="index" @on-click="changeMenu">
                    <Button style="width: 100%;" type="text">
                        <Icon :size="23" :type="item.icon"></Icon>
                        {{itemTitle(item)}}
                    </Button>
                    <DropdownMenu style="width: 130px;" slot="list">
                        <template v-for="(child, i) in item.children">
                            <DropdownItem :name="child.name" :key="i">
                            <Icon :type="child.icon"></Icon>
                            <span style="padding-left:10px;">{{ itemTitle(child) }}</span></DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer v-else placement="right-start" :key="index" @on-click="changeMenu">
                    <Button @click="changeMenu(item.children[0].name)" style="width: 100%;" type="text">
                        <Icon :size="23" :type="item.children[0].icon || item.icon"></Icon>
                        {{itemTitle(item)}}
                    </Button>
                    <DropdownMenu style="width: 130px;" slot="list">
                        <DropdownItem :name="item.children[0].name" :key="'d' + index">
                            <Icon :type="item.children[0].icon || item.icon"></Icon>
                            <span style="padding-left:10px;">{{ itemTitle(item.children[0]) }}</span></DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            </transition>
        </template>
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
            showMenu : false,
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
    }
};
</script>
