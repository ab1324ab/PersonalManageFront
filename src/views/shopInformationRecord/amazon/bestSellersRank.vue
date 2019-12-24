<template>
    <div>
        <Card>
            <Row :gutter="10">
                <Col v-for="(item, index) in chartArray" :sm="12" :xs="24">
                    <Card>
                        <div style="height: 300px;">
                            <linear-chart :ref="'linearChart'+index" :chart="item" :index="index"></linear-chart>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Card>
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
                chartArray: [
                    {
                        title: "",
                        legendData: [],
                        xAxisData: [],
                        series: []
                    }
                ],
                spinShow: true,
            }
        },
        methods: {
            initAmazonInfoRecord() {
                let _this = this;
                //this.tableData.loading = true;
                let url = "initAmazonInfoRecord";
                $util.post(url, {})
                    .then(function (response) {
                        console.info(response);
                        //_this.tableData.loading = false;
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                _this.chartArray = response.data.data;
                                _this.spinShow = false;
                            } else {
                                $util.responseMsg(_this, response.data);
                            }
                        } else {
                            $util.responseMsg(_this, response.data);
                        }
                    })
                    .catch(function (error) {
                        $util.httpErrorMsg(_this, error.data)
                    })
            }
        },
        created() {
            this.initAmazonInfoRecord();
        }
    }
</script>
