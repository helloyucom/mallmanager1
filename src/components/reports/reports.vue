<template>
  <el-card class="card-box">
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>
<script>
var echarts = require("echarts");
export default {
  data() {
    return {};
  },
  mounted() {
    this.showEcharts();
  },
  methods: {
    async showEcharts() {
      // 初始化实例
      var myChart = echarts.init(document.getElementById("main"));
      // 配置项和数据
      const res = await this.$http.get(`reports/type/1`);
      const {
        data: { legend, yAxis, xAxis, series },
        meta: { msg, status }
      } = res.data;
      let option1 = res.data.data;
      var option2 = {
        title: {
          text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      };
      let option = { ...option1, ...option2 };
      
      // 使用实例
      myChart.setOption(option);
    }
  }
};
</script>
<style>
</style>