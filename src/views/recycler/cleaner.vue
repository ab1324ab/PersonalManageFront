<template>
    <div>
        <Row :gutter="15">
            <Col :sm="24" :xs="24">
                <Card>
                    <div>
                        <span style="position: absolute;line-height: 32px">
                            <Tooltip placement="right-start" content="显示方式" theme="light" :delay="1000">
                                <icon size="20" type="ios-apps"></icon>
                            </Tooltip>
                            <Tooltip placement="right-start" content="排序" theme="light" :delay="1000">
                                <icon size="20" type="md-download"></icon>
                            </Tooltip>
                        </span>
                        <Form ref="formInline" inline :label-width='60'>
                            <FormItem label="">
                                <Button type="primary" @click="allCleaner">清空</Button>
                                <span style="font-size: 10px;margin-left: 10px">提示：回收站不占用网盘空间，文件保存5天后将被自动清除。 开通会员延长至15天。 </span>
                            </FormItem>
                        </Form>
                    </div>
                    <div>
                        <paging-components :tableData="tableData" @pagechange="pagechange" @showDisplay="showDisplay" @detailedInfo="detailedInfo"></paging-components>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import pagingComponents from '../main-components/paging-components/paging-components';
    import $util from '@/libs/util.js';

    export default {
        name: "cleaner",
        components: {
            pagingComponents
        },
        data() {
            return {
                tableData: {
                    loading: false,
                    columns: [
                        {title: '名称', align: 'center', key: 'name'},
                        {title: '类型', align: 'center', key: 'type'},
                        {title: '大小', align: 'center', key: 'size'},
                        {title: '删除时间', align: 'center', key: 'deleteDate'},
                        {title: '有效时间', align: 'center', key: 'expiringDate'}
                    ],
                    data: [],
                    paging: {total: 0, display: 10, current: 1, pagegroup: 5}
                },
            }
        },
        methods: {
            initCleaner() {
                let _this = this;
                this.tableData.loading = true;
                let url = "initRecycledRecord";
                $util.post(url,this.tableData.paging)
                    .then(function (response) {
                        console.info(response);
                        _this.tableData.loading = false;
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                _this.tableData.data = response.data.data.data;
                                _this.tableData.paging.total = response.data.data.total;
                                _this.tableData.paging.display = response.data.data.display;
                                _this.tableData.paging.current = response.data.data.current;
                                _this.tableData.paging.pagegroup = response.data.data.pagegroup;
                            }else{
                                $util.responseMsg(_this, response.data);
                            }
                        }else{
                            $util.responseMsg(_this, response.data);
                        }
                    })
                    .catch(function (error) {
                        _this.tableData.loading = false;
                        $util.httpErrorMsg(_this, error.data)
                    })
            },
            pagechange(index) {
                this.tableData.paging.current = index;
                this.initCleaner();
            },
            showDisplay(number) {
                this.tableData.paging.current = 1;
                this.tableData.paging.display = number;
                this.initCleaner();
            },
            detailedInfo(currentRow, oldCurrentRow) {
                console.info(currentRow);
            },
            allCleaner(){
                let url = "allCleanerFile";
                let _this = this;
                $util.post(url,{})
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.statusCode == "10000") {
                                $util.frontSuccMsg(_this, 2, response.data.msg);
                            }else{
                                $util.responseMsg(_this, response.data);
                            }
                        }else{
                            $util.responseMsg(_this, response.data);
                        }
                    })
                    .catch(function (error) {
                        $util.httpErrorMsg(_this, error.data)
                    })
            }
        },
        created() {
            this.initCleaner();
        }
    }
</script>

