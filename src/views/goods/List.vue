<template>
  <div class="list">
    <el-card>
      <el-row>
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
              <!-- 按钮被点击时，把搜索条件传入发送到后台参数的对象
              并重新从后台请求数据 -->
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :offset="1" :span="4">
          <!-- 添加商品按钮 -->
          <el-button type="primary" @click="$router.push('/goods/add')">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          width="95px"
          label="商品价格(元)"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          width="95px"
          label="商品重量"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column width="200px" label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column width="350px" label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary">编辑商品</el-button>
            <el-button icon="el-icon-delete" type="danger" @click="removeItem(scope.row)">删除商品</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodList: [],
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      let { data: res } = await this.axios.get("/goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      console.log(res.data);
      this.goodList = res.data.goods;
      this.total = res.data.total;
    },
    // 监听页码改变获取新数据
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    // 删除商品事件
    async removeItem(data){
        let confirmRes=await this.$confirm('确认删除 '+data.goods_name+'商品?','',{
            confirmButoonText:'确定',
            cancleButtonText:'取消'
        }).catch(err=>err)
         if(confirmRes ==='confirm'){
            let {data:res}= await this.axios.delete('/goods/'+data.goods_id)
            if(res.meta.status!==200) return this.$message.error('删除商品失败');
            this.$message.success('删除商品成功');
            this.getGoodsList();
         }
    }
  },
};
</script>

<style lang="less" scope>
.el-table {
  margin: 25px 0;
}
</style>