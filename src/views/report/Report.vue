<template>
  <div class="report">
    <el-card>
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash";

export default {
  created() {},
  // 需要在dom节点生成后初始化echarts，因此需要在mounted中初始化echarts
  async mounted() {
    let myChart = echarts.init(document.getElementById("main"));
    let { data: res } = await this.axios.get("/reports/type/1");
    if (res.meta.status !== 200) return this.$message.error("获取报表数据失败");
    console.log(res);
    let reportData = _.merge(res.data, this.options);
    myChart.setOption(reportData);
  },
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {},
};
</script>

<style lang="less" scope>
</style>