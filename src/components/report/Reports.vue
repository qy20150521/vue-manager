<template>
  <div>
    <el-card>
      <div id="main" style="width:750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  //  引入插件
  import echarts from 'echarts'
  import _ from 'lodash'

  export default {
    name: 'Reports',
    data() {
      return {
        // 需要跟请求的折线图数据合并的options
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    async mounted() {
      const myChart = echarts.init(document.getElementById('main'))
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) return this.$message.error('获取报表失败')
      //  合并对象
      const reportsData = _.merge(res.data, this.options)
      //  把图表的配置项展示成数据
      myChart.setOption(reportsData)
    }
  }
</script>

<style scoped lang="less">
  .el-card {
    margin-top: 20px;
  }
</style>
