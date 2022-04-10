<!--
 * @Author: 呲牙
 * @LastEditors: 呲牙
 * @Date: 2022-03-26 22:53:49
 * @LastEditTime: 2022-04-10 14:39:30
 * @Email: str-liang@outlook.com
 * @FilePath: \vue_shop\src\components\order\Orders.vue
 * @Environment: Win 10 Python 3.8
 * @Description: 订单列表的操作
-->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 显示表单区域 -->
      <el-table border stripe :data="orderList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="90px"
        ></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="100px"
        ></el-table-column>
        <el-table-column label="下单时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showAddress"
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-location-information"
              type="success"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 省市区县对话框 -->
    <el-dialog
      title="填写地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市/区" prop="address1">
          <el-cascader
            :options="cityData"
            :props="cityProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流对话框 -->
    <el-dialog title="物流信息" :visible.sync="progressVisible" width="50%">
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(activity, index) in ProgressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
import Progress from './progress'
export default {
  name: 'Orders',
  data() {
    return {
      // 订单列表
      orderList: [],
      queryInfo: {
        // 双向绑定到input查询输入框的v-model身上
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 所有的页数
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: '',
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      cityData,
      // 级联选择器配置项
      cityProps: {
        value: 'value',
        label: 'label',
        expandTrigger: 'hover',
      },
      progressVisible: false,
      ProgressInfo: [],
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取订单列表失败')

      this.$message.success('获取订单列表成功')
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(res.data)
    },
    // 当每页显示条数发生改变时触发该函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 当页数发生改变时触发该函数
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    // 对数据进行查询
    selectedOrder() {
      this.getOrderList()
    },
    // 打开省市区县对话框
    showAddress() {
      this.addressVisible = true
    },
    handleChange() {},
    // 清空表单的操作
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    showProgressBox() {
      this.progressVisible = true
      this.ProgressInfo = Progress[0].data
    },
  },
}
</script>

<style>
</style>