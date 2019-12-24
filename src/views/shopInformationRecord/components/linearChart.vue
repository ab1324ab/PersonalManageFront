<template>
    <div style="width:100%;height:100%;" id="linear_chart_con"></div>
</template>

<script>
    import echarts from 'echarts';

    export default {
        name: 'linearChart',
        props: {
            chart: {
                title: "",
                legendData: {
                    type: Array,
                    default: []
                },
                xAxisData: {
                    type: Array,
                    default: []
                },
                series: {
                    type: Array,
                    default: []
                }
            }
        },
        data() {
            return {
                lineChart: {},
            }
        },
        methods: {
            hideLoading() {
                this.lineChart.hideLoading();
            }
        },
        mounted() {
            this.$nextTick(() => {
                let lineChart = echarts.init(document.getElementById('linear_chart_con'));
                this.lineChart = lineChart;
                lineChart.setOption({
                    title: {
                        text: this.chart.title
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 15,
                        top: 40,
                        bottom: 20,
                        data: [
                            // '销量', '销量1'
                        ]
                    },
                    grid: {
                        left: 30,
                        bottom: 35,
                        right: 100
                    },
                    toolbox: {
                        show: true,
                        right: 30,
                        feature: {
                            // dataZoom: {
                            //     yAxisIndex: 'none'
                            // },
                            // dataView: {readOnly: false},
                            magicType: {type: ['line', 'bar']},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: 'ASIN : {a0}<br/>日期 : {b0}<br />排名 : {c0}',
                        // formatter: function (params) {
                        //     console.info(params)
                        //     var str = ""
                        //     for(var param in params){
                        //         console.info(param)
                        //         str+='ASIN : '+params[param].seriesName+'<br/>日期 : '+params[param].axisValueLabel+'<br />排名 : '+params[param].dataIndex+'<br/>'
                        //     }
                        //     return str
                        // },
                        //position: [10, 10],
                        confine: true,
                        axisPointer: {
                            type: 'cross',
                            snap: true,
                            label: {
                                show: 'cross',
                                // formatter:function (data) {
                                //     console.info(data)
                                //     //return "nihao xxxxx"
                                // }
                            },
                            crossStyle: {
                                type: 'dashed'
                            }
                        },
                        textStyle: {
                            //color:'#CCCCC'
                        }
                    },
                    xAxis: {
                        boundaryGap: false,
                        data: ['12-23', '12-24']
                    },
                    yAxis: {},
                    series: [
                        // {
                        //     name: '销量',
                        //     type: 'line',
                        //     data: [5, 20, 36, 10, 10, 20]
                        // },
                        // {
                        //     name: '销量1',
                        //     type: 'line',
                        //     data: [15, 20, 36, 10, 10, 20]
                        // }
                    ]
                })
                window.addEventListener('resize', function () {
                    lineChart.resize();
                });
            });
        },
        created() {

        },
        watch: {
            chart: {
                handler: function (val) {
                    this.lineChart.setOption({
                        title: {
                            text: this.chart.title
                        },
                        legend: {
                            data: this.chart.legendData
                        },
                        xAxis: {
                            data: this.chart.xAxisData
                        },
                        series: this.chart.series
                    });
                },
                deep: true
            }
        }
    };
</script>
