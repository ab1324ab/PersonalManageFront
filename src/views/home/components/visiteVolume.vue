<template>
    <div style="width:100%;height:100%;" id="visite_volume_con"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'visiteVolume',
    props:{
        counts:{
            excelCount: {
                type: Number,
                default: 0
            },
            wordCount: {
                type: Number,
                default: 0
            },
            imgCount: {
                type: Number,
                default: 0
            },
            planCount: {
                type: Number,
                default: 0
            }
        }
    },
    data () {
        return {
            visiteVolume :{},
        };
    },
    methods:{
        hideLoading(){
            this.visiteVolume.hideLoading();
        }
    },
    mounted () {
        this.$nextTick(() => {
            let visiteVolume = echarts.init(document.getElementById('visite_volume_con'));
            this.visiteVolume = visiteVolume;
            this.visiteVolume.showLoading();
            let xAxisData = [];
            let data1 = [];
            let data2 = [];
            for (let i = 0; i < 20; i++) {
                xAxisData.push('类目' + i);
                data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
                data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
            }
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: 0,
                    left: '2%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['图片', '文档', '表格', '计划'],
                    nameTextStyle: {
                        color: '#c3c3c3'
                    }
                },
                series: [
                    {
                        name: '总数量',
                        type: 'bar',
                        data: [
                            {value: 0, name: '图片', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 0, name: '文档', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 0, name: '表格', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 0, name: '计划', itemStyle: {normal: {color: '#2d8cf0'}}},
                        ]
                    }
                ]
            };
            this.visiteVolume.setOption(option);
            window.addEventListener('resize', function () {
                visiteVolume.resize();
            });
        });
    },
    created(){

    },
    watch:{
        counts:{
            handler: function (val) {
                this.visiteVolume.setOption({
                    series: [{
                            data: [
                                {value: val.imgCount, name: '图片', itemStyle: {normal: {color: '#2d8cf0'}}},
                                {value: val.wordCount, name: '文档', itemStyle: {normal: {color: '#2d8cf0'}}},
                                {value: val.excelCount, name: '表格', itemStyle: {normal: {color: '#2d8cf0'}}},
                                {value: val.planCount, name: '计划', itemStyle: {normal: {color: '#2d8cf0'}}},
                            ]
                        }
                    ]
                });
            },
            deep: true
        }
    }
};
</script>
