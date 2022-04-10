<!--
 * @Author: 呲牙
 * @LastEditors: 呲牙
 * @Date: 2022-03-26 22:53:49
 * @LastEditTime: 2022-04-10 15:11:56
 * @Email: 1340482172@qq.com
 * @FilePath: \vue_shop\src\components\report\Reports.vue
 * @Environment: Win 10 Python 3.8
 * @Description: 报表
-->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <div id="main"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name: 'Reports',
  data() {
    return {
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  created() {},
  // 当页面的所有元素都渲染完毕后初始化echarts图标
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    // const result = Object.assign(this.options, res.data)
    const result = _.merge(this.options, res.data)
    myChart.setOption(result)
  },
  methods: {},
}
</script>

<style>
#main {
  width: 700px;
  height: 400px;
}
</style>