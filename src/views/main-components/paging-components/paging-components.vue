<style lang="less">
    @import "./paging-components.less";
</style>
<template>
    <div>
        <Table :loading="tableData.loading" highlight-row stripe :columns="tableData.columns" :data="tableData.data" @on-row-click="detailedInfo"></Table>
        <nav style="float: right;">
            <ul class="pagination">
                <li :class="{'disabled': tableData.paging.current == 1}"><a href="javascript:;" @click="setCurrent(1)"> 首页 </a></li>
                <li :class="{'disabled': tableData.paging.current == 1}"><a href="javascript:;" @click="setCurrent(tableData.paging.current - 1)"> 上一页 </a></li>
                <li v-for="p in grouplist" :class="{'active': tableData.paging.current == p.val}"><a href="javascript:;" @click="setCurrent(p.val)"> {{ p.text }} </a></li>
                <li :class="{'disabled': tableData.paging.current == page}"><a href="javascript:;" @click="setCurrent(tableData.paging.current + 1)"> 下一页</a></li>
                <li :class="{'disabled': tableData.paging.current == page}"><a href="javascript:;" @click="setCurrent(page)"> 尾页 </a></li>
            </ul>
            <ul class="pagination pull-right">
                <li>
                    <span>
                        <Dropdown @on-click="setDisplay">
                            <a href="javascript:void(0)" style="color: #337ab7">
                                {{tableData.paging.display}}
                                <Icon type="arrow-down-b"></Icon>
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
                <li><span> {{ tableData.paging.current }} / {{ page }} 页 </span></li>
                <li><span> 共 {{ tableData.paging.total }}  条 </span></li>
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
                var count = Math.floor(this.tableData.paging.pagegroup / 2);
                var center = this.tableData.paging.current;
                if (len <= this.tableData.paging.pagegroup) {
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
                temp = temp.splice(center - count - 1, this.tableData.paging.pagegroup);
                do {
                    var t = temp.shift();
                    list.push({
                        text: t,
                        val: t
                    });
                } while (temp.length);
                if (this.page > this.tableData.paging.pagegroup) {
                    (this.tableData.paging.current > count + 1) && list.unshift({ text: '...', val: list[0].val - 1 });
                    (this.tableData.paging.current < this.page - count) && list.push({ text: '...', val: list[list.length - 1].val + 1 });
                }
                return list;
            }
        },
        methods: {
            setCurrent: function (idx) {
                if (this.tableData.paging.current != idx && idx > 0 && idx < this.page + 1) {
                    this.tableData.paging.current = idx;
                    this.$emit('pagechange', this.tableData.paging.current);
                }
            },
            setDisplay (value) {
                value = parseInt(value);
                this.tableData.paging.display = value;
            },
            detailedInfo (currentRow, oldCurrentRow) {
                this.$emit('detailedInfo', currentRow, oldCurrentRow);
            }
        }
    };
</script>

<style scoped>

</style>