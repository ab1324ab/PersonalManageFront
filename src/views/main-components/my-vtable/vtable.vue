<style>
    @import './vtable.css';
</style>

<template id="vtable">
    <div>
        <slot name="top"></slot>
        <table class="vtable vtableTop">
            <tr>
                <th colspan="6">本周计划</th>
                <th colspan="6">本周总结</th>
            </tr>
            <tr>
                <td>部门</td>
                <td><input v-model="workData.department" type="text" style="border: 1px solid #a6dbff;border-radius: 5px;" /></td>
                <td>计划人</td>
                <td><input v-model="workData.plannerPeople" type="text" style="border: 1px solid #a6dbff;border-radius: 5px;" /></td>
                <td>计划日期</td>
                <td style="width: 120px">
                    <DatePicker :editable="false" v-model="workData.plannedDate" type="date" placeholder="选择日期" style="border: 1px solid #a6dbff;border-radius: 5px;"></DatePicker>
                </td>
                <td>部门</td>
                <td><input v-model="workData.department" type="text" style="border: 1px solid #a6dbff;border-radius: 5px;" /></td>
                <td>总结人</td>
                <td><input v-model="workData.summaryPeople" type="text" style="border: 1px solid #a6dbff;border-radius: 5px;" /></td>
                <td>总结日期</td>
                <td style="width: 120px">
                    <DatePicker :editable="false" v-model="workData.summaryDate" type="date" placeholder="选择日期" style="border: 1px solid #a6dbff;border-radius: 5px;"></DatePicker>
                </td>
            </tr>
        </table>
        <table class="vtable">
            <thead>
            <tr ref="vtr" v-for="(i,index) in rownum">
                <th style="width: 60px" v-for="label in workColumns[index]"><span>{{label.label}}</span></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(data,i) in workData.content" :id="'vtr'+i" @mouseover="trHoverFocus('vtr'+i)">
                <td ref="vtd" v-for="key in labelprop" @click="tdEdit($event)">
                    <input type="text" style="border: 1px solid #a6dbff;border-radius: 5px;" :disabled="isEditc" v-model="data[key]" @blur="tdEditBlur($event)" />
                </td>
            </tr>
            </tbody>
        </table>
        <Button type="primary" size="small" icon="ios-add-circle-outline" @click="addTrFocus" style="margin-top: 5px;width: 100px;">增加</Button>
    </div>
</template>

<script>
    import $util from '@/libs/util.js';

    export default {
        name: "vtable",
        props: {
            workData: {},
            workColumns: {//表头数组
                type: Array,
                required: true
            },
        },
        data() {
            return {
                //datata:''
            }
        },
        computed: {
            rownum: function () {//表头行数
                return this.workColumns.length;
            },
            labelprop: function () {//取出表头数据依次对应的字段key
                let thlab = this.workColumns;
                var ar = [];
                for (let i = 0; i < thlab.length; i++)
                    for (let j = 0; j < thlab[i].length; j++) {
                        for (var key in thlab[i][j]) {
                            if (key == 'prop') {
                                ar.push(thlab[i][j][key])
                            }
                        }
                    }
                return ar;
            },
            isEditc(){
                if(this.workData.isEdit == 'false'){
                    return false;
                }else{
                    return true;
                }
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                    var a = this.workColumns;
                    for (let i = 0; i < a.length; i++) {
                        for (let j = 0; j < a[i].length; j++) {
                            for (var key in a[i][j]) {
                                if (key == 'rowspan') {
                                    this.$refs.vtr[i].children[j].rowSpan = parseInt(a[i][j][key]);
                                } else if (key == 'colspan') {
                                    this.$refs.vtr[i].children[j].colSpan = parseInt(a[i][j][key]);
                                } else if (key == 'width') {
                                    this.$refs.vtr[i].children[j].style.width = a[i][j][key];
                                }
                            }
                        }
                    }
                }
            )
        },
        methods: {
            addTrFocus() {
                let objNull = 0;
                for (var i = 0; i < this.workData.content.length; i++) {
                    if (Object.keys(this.workData.content[i]).length == 0) {
                        objNull++;
                    }
                    if (objNull >= 6) {
                        $util.frontErrMsg(this, 2, '空行太多!');
                        return;
                    }
                }
                var a = {};
                this.workData.content.push(a);
            },
            trHoverFocus(id) {

            },
            tdEdit: function (event) {
                // var vth = event.currentTarget.children[0];
                // if(this.isEdit){
                //     vth.__vue__.$refs.input.disabled = false;
                //     this.$delete(vth,'disabled',false);
                //     vth.disabled = false;
                // }else{
                //
                // }
            },
            tdEditBlur(event) {
                // var vthInput = event.currentTarget;
                // vthInput.disabled = true;
                // vthInput.readOnly = true;
            }
        }

    }
</script>
