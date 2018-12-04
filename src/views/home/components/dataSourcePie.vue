<template>
    <div style="width:100%;height:100%;" id="data_source_con"></div>
</template>

<script>
import echarts from 'echarts';

export default {
    name: 'dataSourcePie',
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
            //
        };
    },
    methods:{

    },
    mounted () {
        this.$nextTick(() => {
            var dataSourcePie = echarts.init(document.getElementById('data_source_con'));
            this.visiteVolume = dataSourcePie;
            this.visiteVolume.showLoading();
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    data: ['图片', '文档', '表格', '计划']
                },
                series: [
                    {
                        name: '数量占比',
                        type: 'pie',
                        radius: '66%',
                        center: ['50%', '60%'],
                        data: [
                            {value: 0, name: '图片', itemStyle: {normal: {color: '#9bd598'}}},
                            {value: 0, name: '文档', itemStyle: {normal: {color: '#ffd58f'}}},
                            {value: 0, name: '表格', itemStyle: {normal: {color: '#abd5f2'}}},
                            {value: 0, name: '计划', itemStyle: {normal: {color: '#ab8df2'}}},
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            dataSourcePie.setOption(option);
            window.addEventListener('resize', function () {
                dataSourcePie.resize();
            });
        });
    },
    created(){

    },
    watch:{
        counts:{
            handler: function (val) {
                this.visiteVolume.hideLoading();
                this.visiteVolume.setOption({
                    series: [{
                        data: [
                            {value: val.imgCount, name: '图片', itemStyle: {normal: {color: '#9bd598'}}},
                            {value: val.wordCount, name: '文档', itemStyle: {normal: {color: '#ffd58f'}}},
                            {value: val.excelCount, name: '表格', itemStyle: {normal: {color: '#abd5f2'}}},
                            {value: val.planCount, name: '计划', itemStyle: {normal: {color: '#ab8df2'}}},
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
