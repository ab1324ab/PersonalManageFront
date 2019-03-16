<style lang="less">
    @import "./paging-components.less";
    .pages{
        //padding: 0px 1px !important;
    }
</style>
<template>
    <div>
        <Table :loading="tableData.loading" highlight-row stripe :columns="tableData.columns" :data="tableData.data" @on-row-click="detailedInfo"></Table>
        <nav style="float: right;">
            <ul class="pagination">
                <li :class="{'disabled': tableData.paging.current == 1}"><a class="pages" href="javascript:;" @click="setCurrent(1)"> 首页 </a></li>
                <li :class="{'disabled': tableData.paging.current == 1}"><a class="pages" href="javascript:;" @click="setCurrent(tableData.paging.current - 1)"> 上一页 </a></li>
                <li v-for="p in grouplist" :class="{'active': tableData.paging.current == p.val}"><a class="pages" href="javascript:;" @click="setCurrent(p.val)"> {{ p.text }} </a></li>
                <li :class="{'disabled': tableData.paging.current == page}"><a class="pages" href="javascript:;" @click="setCurrent(tableData.paging.current + 1)"> 下一页</a></li>
                <li :class="{'disabled': tableData.paging.current == page}"><a class="pages" href="javascript:;" @click="setCurrent(page)"> 尾页 </a></li>
            </ul>
            <ul class="pagination pull-right">
                <li>
                    <span class="pages">
                        <Dropdown @on-click="setDisplay">
                            <a href="javascript:void(0)">
                                {{tableData.paging.display}}
                                <Icon type="md-arrow-dropdown" ></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="5">5</DropdownItem>
                                <DropdownItem name="10">10</DropdownItem>
                                <DropdownItem name="20">20</DropdownItem>
                                <DropdownItem name="50">50</DropdownItem>
                                <DropdownItem name="100">100</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </span>
                </li>
                <li><span class="pages">{{ tableData.paging.current }}/{{ page }}页</span></li>
                <li><span class="pages">共{{ tableData.paging.total }}条</span></li>
            </ul>
        </nav>
    </div>
</template>

<script>
    /* eslint-disable one-var,eqeqeq */

    export default {
        name: 'paging-components',
        props: {
            tableData: {
                loading: false,
                columns: [],
                data: [],
                paging: {
                    total: { // 数据总条数
                        type: Number,
                        default: 0
                    },
                    display: { // 每页显示条数
                        type: Number,
                        default: 10
                    },
                    current: { // 当前页码
                        type: Number,
                        default: 1
                    },
                    pagegroup: { // 分页条数 -- 奇数
                        type: Number,
                        default: 5,
                        coerce: function (v) {
                            v = v > 0 ? v : 5;
                            return v % 2 === 1 ? v : v + 1;
                        }
                    }
                }
            }
        },
        computed: {
            page: function () { // 总页数
                return Math.ceil(this.tableData.paging.total / this.tableData.paging.display);
            },
            grouplist: function () { // 获取分页页码
                var len = this.page;
                var temp = [];
                var list = [];
                let pagegroup = this.tableData.paging.pagegroup;
                var docWidth = document.body.scrollWidth;
                // 屏幕显示区域小于500px则属于小屏幕,显示强制设置为3个分页
                if(docWidth < 500){
                    pagegroup = 3;
                }
                var count = Math.floor( pagegroup / 2);
                var center = this.tableData.paging.current;
                if (len <= pagegroup) {
                    while (len--) {
                        temp.push({
                            text: this.page - len, val: this.page - len
                        });
                    };
                    return temp;
                }
                while (len--) {
                    temp.push(
                        this.page - len
                    );
                };
                var idx = temp.indexOf(center);
                (idx < count) && (center = center + count - idx);
                (this.tableData.paging.current > this.page - count) && (center = this.page - count);
                temp = temp.splice(center - count - 1, pagegroup);
                do {
                    var t = temp.shift();
                    list.push({
                        text: t,
                        val: t
                    });
                } while (temp.length);
                if (this.page > pagegroup) {
                    (this.tableData.paging.current > count + 1) && list.unshift({ text: '...', val: list[0].val - 1 });
                    (this.tableData.paging.current < this.page - count) && list.push({ text: '...', val: list[list.length - 1].val + 1 });
                }
                return list;
            }
        },
        methods: {
            modifyStyle (){
                // 直接写入style标签
                var docWidth = document.body.scrollWidth;
                let pages = document.getElementsByClassName("pages");
                for(let i=0 ; i<pages.length ; i++){
                    if(docWidth < 685){
                        pages[i].style.padding= "0px 1px"
                    }else{
                        pages[i].style.padding= "6px 12px"
                    }
                }
            },
            setCurrent: function (idx) {
                if (this.tableData.paging.current != idx && idx > 0 && idx < this.page + 1) {
                    this.tableData.paging.current = idx;
                    this.$emit('pagechange', this.tableData.paging.current);
                }
            },
            setDisplay (value) {
                value = parseInt(value);
                this.tableData.paging.display = value;
                this.$emit('showDisplay', this.tableData.paging.display);
            },
            detailedInfo (currentRow, oldCurrentRow) {
                this.$emit('detailedInfo', currentRow, oldCurrentRow);
            }
        },
        updated(){
            this.$nextTick(function () {
                this.modifyStyle();
            })
        },
        mounted(){
            this.modifyStyle();
            window.onresize = () => {
                return (() => {
                    this.modifyStyle();
                })()
            };
        }
    };
</script>
