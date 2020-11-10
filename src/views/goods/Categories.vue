<template>
  <div class="category">
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <!-- 使用tree-table插件 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        index-text="#"
      >
        <!-- 使用模板为“是否有效”列数据渲染样式,slot属性指定模板的归属 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_delete"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 使用模板为“排序”列数据渲染样式 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 使用模板为“操作”列数据渲染样式 -->
        <template slot="option">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        layout="total, prev, pager, next, jumper"
        :page-size="5"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisiable"
      width="30%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
            <!-- 级联选择菜单
            expandTrigger指定触发下一级菜单的方式 
            option指定数据源
            v-model双向绑定级联选单选项的值，保存到一个数组中
            clearable指可清空选单
            -->
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="{ 
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children',
                checkStrictly:true
            }"
            clearable
            @change="cascaChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addCate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取分类列表时的查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类列表
      cateList: [],
      total: 0,
      // 给tree-table插件指定列定义
      //prop为当前列的数据
      // 如果当前列的样式不是单纯的文本数据，可以使用type:"template"
      // 给当前列指定样式模板，使用template：‘模板名’给模板命名
      columns: [
        { label: "分类名称", prop: "cat_name" },
        { label: "是否有效", type: "template", template: "isok" },
        { label: "排序", type: "template", template: "order" },
        { label: "操作", type: "template", template: "option" },
      ],
      addCateDialogVisiable: false,
      //   添加分类表单数据对象
      addCateForm: {
        //   添加分类名称
        cat_name: "",
        //   父级分类id
        cat_pid: 0,
        //   添加分类的等级
        cat_level: 0,
      },
      //   他i俺家分类表单校验规则对象
      addFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //   父级分类列表
      parentCateList: [],
        // 级联选单选中的父级分类id
        selectKeys:[]
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      let { data: res } = await this.axios.get("/categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      this.cateList = res.data.result;
      this.total = res.data.total;
      console.log(res.data);
    },
    // 监听页码改变
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page;
      this.getCateList();
    },
    // 点击展示添加分类对话框
    showAddCateDialog() {
        console.log(this.$refs);
      this.getParentCateList();
      this.addCateDialogVisiable = true;
    },
    // 获取父级分类数据表
    async getParentCateList() {
      let { data: res } = await this.axios.get("/categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类列表失败");
      console.log(res.data);
      this.parentCateList = res.data;
    },
    // 级联选单选择发生变化
    // 级联选单可为空，即添加一级分类
    // 当selectedKeys数组长度为空时，级联选单没有选择任何项
    cascaChange(){
        // 当添加的分类不是一级分类时执行
        if(this.selectKeys.length>0){
            // 需要添加的分类的父级分类id
            this.addCateForm.cat_pid=this.selectKeys[this.selectKeys.length-1]
            // 添加的分类的等级
            this.addCateForm.cat_level=this.selectKeys.length
            console.log(this.addCateForm);
            return
        }else {
            this.addCateForm.cat_id=0
            this.addCateForm.cat_level=0
        }
    },
    // 添加分类按钮
    addCate(){
        this.$refs.addCateFormRef.validate(async valid=>{
            if(!valid) return
            let {data:res}=await this.axios.post('/categories',this.addCateForm)
            if(res.meta.status!==201) return this.$message.error('添加分类失败');
            this.$message.success('添加分类成功');
            this.getCateList()
            this.addCateDialogVisiable = false;
        })
    },
    // 添加分类对话框关闭事件
    addCateDialogClose(){
      this.$refs.addCateFormRef.resetFields()
        this.selectKeys=[];
        this.addCateForm.cat_level=0
        this.addCateForm.cat_pid=0
    }
  },
};
</script>

<style lang="less" scoped>
.zk-table {
  margin: 25px 0;
  font-size: 1rem;
}
.el-cascader {
    width: 100%;
}
</style>