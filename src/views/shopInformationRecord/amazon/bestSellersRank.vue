<template>
    <div>
        <Row :gutter="10">
            <Col :sm="24" :xs="24">
                <Card>
                    <div id="myChart" style="width: 400px;height: 300px;"></div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    // import echarts from 'echarts'
    vue文件中引入echarts工具
    let echarts = require('echarts/lib/echarts')
    require('echarts/lib/chart/line')
    // 以下的组件按需引入
    require('echarts/lib/component/tooltip')   // tooltip组件
    require('echarts/lib/component/title')   //  title组件
    require('echarts/lib/component/legend')  // legend组件

    export default {
        name: "bestSellersRank",
        components:{
            echarts
        },
        data() {
            return{
                option: {
                    legend: {
                        data: ['招商银行', '浦发银行', '广发银行', '上海银行']
                    },
                    xAxis: {
                        type: 'category',   // 还有其他的type，可以去官网喵两眼哦
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],   // x轴数据
                        name: '日期',   // x轴名称
                        // x轴名称样式
                        nameTextStyle: {
                            fontWeight: 600,
                            fontSize: 18
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '纵轴名称',   // y轴名称
                        // y轴名称样式
                        nameTextStyle: {
                            fontWeight: 600,
                            fontSize: 18
                        }
                    },
                    label: {},
                    tooltip: {
                        trigger: 'axis'   // axis   item   none三个值
                    },
                    series: [
                        {
                            name: '招商银行',
                            data: [820, 932, 901, 934, 1290, 1330, 1320],
                            type: 'line'
                        },
                        {
                            name: '浦发银行',
                            data: [620, 711, 823, 934, 1445, 1456, 1178],
                            type: 'line'
                        },
                        {
                            name: '广发银行',
                            data: [612, 920, 1140, 1160, 1190, 1234, 1321],
                            type: 'line'
                        },
                        {
                            name: '上海银行',
                            data: [234, 320, 453, 567, 789, 999, 1200],
                            type: 'line'
                        }
                    ]
                }
            }
        },
        methods: {

        },
        created() {
            let myChart = echarts.init(document.getElementById('myChart'))
            myChart.setOption(this.option)
        }
    }
</script>
