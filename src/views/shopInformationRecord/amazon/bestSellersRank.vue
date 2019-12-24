<template>
    <div>
        <Row :gutter="10">
            <Col :sm="24" :xs="24">
                <Card>
                    <div style="height: 300px;">
                        <linear-chart :chart="chart"></linear-chart>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import $util from '@/libs/util.js';
    var qs = require('qs');
    import linearChart from '../components/linearChart'

    export default {
        name: "bestSellersRank",
        components: {
            linearChart
        },
        data() {
            return {
                chart: {
                    title: "",
                    legendData:[],
                    xAxisData:  [],
                    series: []
                }
            }
        },
        methods: {
            initAmazonInfoRecord(){
                let _this = this;
                //this.tableData.loading = true;
                let url = "initAmazonInfoRecord";
                $util.post(url,{})
                    .then(function (response) {
                        console.info(response);
                        //_this.tableData.loading = false;
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {

                                console.info(response.data.data[0]);
                                var table = response.data.data[0];
                                _this.chart.title = table.name;
                                _this.chart.legendData = table.legendData;
                                _this.chart.xAxisData = table.xAxisData;
                                _this.chart.series = table.series
                                // _this.tableData.data = response.data.data.data;
                                // _this.tableData.paging.total = response.data.data.total;
                                // _this.tableData.paging.display = response.data.data.display;
                                // _this.tableData.paging.current = response.data.data.current;
                                // _this.tableData.paging.pagegroup = response.data.data.pagegroup;
                            }else{
                                $util.responseMsg(_this, response.data);
                            }
                        }else{
                            $util.responseMsg(_this, response.data);
                        }
                    })
                    .catch(function (error) {
                        // _this.tableData.loading = false;
                        $util.httpErrorMsg(_this, error.data)
                    })
            }
        },
        created() {
            this.initAmazonInfoRecord();
        }
    }
</script>
