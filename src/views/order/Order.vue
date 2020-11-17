<template>
  <div class="order">
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="orderSearch">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template >
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="small"
              @click="editAddress"
              >修改地址</el-button
            >
            <el-button
              icon="el-icon-location"
              type="success"
              size="small"
              @click="showLogistics"
              >物流信息</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="editAddrDialogVisiable"
        :current-page="queryInfo.pagenum"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddrDialogVisiable"
      width="50%"
      @close="editAddrDialogClose"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{
              expandTrigger: 'hover',
              label: 'n',
              children: 's',
              value: 'n',
            }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddrDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editAddrDialogVisiable = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="logisticsDialogVisiable"
      width="50%"
    >
      <span>这是一段信息</span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "../../assets/citydata.js";

export default {
  created() {
    this.getOrderList();
  },
  data() {
    return {
      // 搜索输入框双向绑定数据
      orderSearch: "",
      // 查询对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 订单总条数
      total: 0,
      // 订单列表
      orderList: [],
      //   修改地址对话框可见性
      editAddrDialogVisiable: false,
      //   修改地址对话框表单双向绑定对象
      addressForm: {
        address1: [],
        address2: "",
      },
      //   修改地址表单验证规则对象
      addressFormRules: {
        address1: [
          { required: true, message: "请选择您所在的地区", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      //   中国城市列表对象
      cityData,
      //   物流信息对话框可见性
      logisticsDialogVisiable: false,
      // 物流信息数组
      logisticsInfo: [],
    };
  },
  methods: {
    //   获取订单列表事件
    async getOrderList() {
      let { data: res } = await this.axios.get("/orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取订单列表失败");
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    // 订单表格换页触发事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 修改地址按钮触发
    editAddress() {
      this.editAddrDialogVisiable = true;
    },
    // 选择城市的级联选择器选择项改变时触发
    handleChange() {},
    // 修改地址对话框关闭事件
    editAddrDialogClose() {
      this.addressForm.address1 = [];
      this.addressForm.address2 = "";
    },
    // 物流信息按钮触发事件
    async showLogistics() {
        // 接口不可用
        // let {data:res} =await this.axios.get('/kuaidi/804909574412544580')
        // if(res.meta.status!==200) return this.$message.error('获取物流信息失败')
        // this.logisticsInfo=res.data
        // this.logisticsDialogVisiable=true
        // console.log(this.logisticsInfo);
    },
  },
};
</script>
<style lang="less" scope>
</style>