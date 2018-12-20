<style>
    @import './vtable.css';
</style>

<template id="vtable">
    <table class="vtable">
        <thead>
            <tr ref="vtr" v-for="(i,index) in rownum">
                <th v-for="label in thlabel[index]">{{label.label}}</th>
            </tr>
        </thead>
        <tbody>
        <tr v-for="(data,i) in datat" :id="'vtr'+i" @mouseover="trHoverFocus('vtr'+i)">
            <td ref="vtd" v-for="key in labelprop" @click="tdEdit($event)" >
                <input type="text" style="border: 1px solid #a6dbff;border-radius: 5px;" :disabled="isEdit" v-model="data[key]" @blur="tdEditBlur($event)"/>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        name: "vtable",
        props:{
            datat:{
                type:Array,
                required:true
            },
            thlabel:{//表头数组
                type:Array,
                required:true
            },
            isEdit:{
                type:Boolean,
                required:true
            }
        },
        data(){
            return{
                datata:''
            }
        },
        computed:{
            rownum:function(){//表头行数
                return this.thlabel.length;
            },
            labelprop:function(){//取出表头数据依次对应的字段key
                let thlab = this.thlabel;
                var ar = [];
                for(let i=0;i<thlab.length;i++)
                    for(let j=0;j<thlab[i].length;j++){
                        for(var key in thlab[i][j]){
                            if(key == 'prop'){
                                ar.push(thlab[i][j][key])
                            }
                        }
                    }
                return ar;
            },
        },
        mounted:function(){
            this.$nextTick(function(){
                    // let vtd = this.$refs.vtd;
                    // for(var it=0;it<vtd.length;it++){
                    //     vtd[it].children[0].disabled = this.isEdit;
                    //     //vtd[it].children[0].readOnly = this.isEdit;
                    // }
                    var a = this.thlabel;
                    for(let i=0;i<a.length;i++){
                        for(let j=0;j<a[i].length;j++){
                            for(var key in a[i][j]){
                                if(key == 'rowspan'){
                                    this.$refs.vtr[i].children[j].rowSpan = parseInt(a[i][j][key]);
                                }else if(key == 'colspan'){
                                    this.$refs.vtr[i].children[j].colSpan = parseInt(a[i][j][key]);
                                }
                            }
                        }
                    }
                }
            )
        },
        methods:{
            trHoverFocus(exent){
                var vtr = document.getElementById(exent)
                console.info(vtr)
                vtr.classList.add("ivu-table-row-hover");
            },
            tdEdit:function(event){
                var vth = event.currentTarget.children[0];
                //debugger;
                if(this.isEdit){
                    vth.__vue__.$refs.input.disabled = false;
                    this.$delete(vth,'disabled',false);
                    vth.disabled = false;
                    //$(h).find('input').attr("readOnly",false);
                    //$(h).addClass('tdclick').siblings().removeClass('tdclick');
                    //$(h).addClass('tdclick').parent('tr').siblings().find('td').removeClass('tdclick');
                }else{
                    //vth.readOnly = false;
                    // $(h).find('input').attr("readOnly",true);
                }
            },
            tdEditBlur(event){
                var vthInput = event.currentTarget;
                //debugger;
                //vthInput.disabled = true;
                //vthInput.readOnly = true;
            }
        }

    }
</script>

<style scoped>

</style>