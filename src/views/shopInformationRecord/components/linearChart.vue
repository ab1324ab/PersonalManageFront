<template>
    <div style="width:100%;height:100%;" :id="'linear_chart_con'+this.index"></div>
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
            },
            index: "",
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
                let lineChart = echarts.init(document.getElementById('linear_chart_con'+this.index));
                this.lineChart = lineChart;
                //this.lineChart.showLoading();
                lineChart.setOption({
                    title: {
                        text: this.chart.name
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 0,
                        top: 40,
                        bottom: 20,
                        data: this.chart.legendData
                    },
                    grid: {
                        left: 50,
                        bottom: 35,
                        right: 130
                    },
                    toolbox: {
                        show: true,
                        right: 30,
                        feature: {
                            magicType: {type: ['line', 'bar']},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: 'ASIN : {a0}<br/>日期 : {b0}<br />排名 : {c0}',
                        confine: true,
                        axisPointer: {
                            type: 'cross',
                            snap: true,
                            label: {
                                show: 'cross',
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
                        data: this.chart.xAxisData
                    },
                    yAxis: {},
                    series: this.chart.series
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
                            text: this.chart.name
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
