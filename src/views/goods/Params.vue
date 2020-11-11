<template>
  <div class="params">
    <el-card>
      <!-- 头部提示区域 -->
      <el-alert
        show-icon=""
        title="注意：本页面只可修改三级分类参数"
        type="warning"
        :closable="false"
      >
      </el-alert>
      <!-- 选择分类区域 -->
      <el-row class="select_area">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择分类的级联选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
              childern: 'children',
            }"
            @change="cascaderChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 分页标签区域 -->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <!-- 动态参数区域 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            class="btn"
            @click="showAddDialog"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性区域 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="showAddDialog"
            class="btn"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="addDialogVisiable"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改按钮对话框 -->
    <el-dialog
      :title="'修改' + dialogTitle"
      :visible.sync="editDialogVisiable"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      //   级联选择框中被选中的分类数组
      selectedKeys: [],
      //   分页标签默认被激活的标签页
      activeName: "many",
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      //   添加参数对话框可见性
      addDialogVisiable: false,
      //   添加参数表单双向绑定数据
      addForm: {
        attr_name: "",
      },
      //   添加参数表单验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      //   修改对话框可见性
      editDialogVisiable: false,
      // 修改对话框表单数据
      editForm: {
        attr_name: "",
        attr_id: "",
      },
      // 修改对话框表单验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    //   获取所有商品分类列表
    this.getCateList();
  },
  methods: {
    //   获取商品分类列表方法
    async getCateList() {
      let { data: res } = await this.axios.get("/categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      this.cateList = res.data;
      console.log(this.cateList);
    },
    // 级联选择框选中项修改时触发
    cascaderChange() {
      this.getParamsData();
    },
    async getParamsData() {
      // 如果选中的不是三级分类（选中数组长度不为3），则不执行操作并清空数组
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        return;
      }
      // 选中的是三级分类时执行
      //   根据所选分类id及当前所在面板获取对应参数
      let { data: res } = await this.axios.get(
        "/categories/" + this.selectedKeys[2] + "/attributes",
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取参数列表失败");
      //   判断是在哪个标签请求数据，并把数据存储到不同的变量
      // 以便在页面中渲染出静态和动态两个表格
      console.log(res);
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 分页标签点击事件函数
    tabClick() {
      this.getParamsData();
    },
    // 添加参数按钮事件
    showAddDialog() {
      this.addDialogVisiable = true;
    },
    // 对话框关闭触发
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加参数对话框确定按钮
    addParams() {
      console.log(this.addForm);
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          this.$alert("请按要求输入参数", "", {
            confirmButtonText: "确定",
          });
        } else {
          let { data: res } = await this.axios.post(
            "/categories/" + this.selectedKeys[2] + "/attributes",
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName,
            }
          );
          console.log(res);
          if (res.meta.status !== 201)
            return this.$message.error("添加参数失败");
          this.$message.success("添加参数成功");
          this.addDialogVisiable = false;
          this.getParamsData();
        }
      });
    },
    // 参数修改按钮事件
    showEditDialog(data) {
      this.editForm.attr_name = data.attr_name;
      this.editForm.attr_id = data.attr_id;
      this.editDialogVisiable = true;
    },
    // 修改对话框关闭触发
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改对话框确定按钮事件
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          this.$alert("请按要求输入参数", "", {
            confirmButtonText: "确定",
          });
        } else {
          let {
            data: res,
          } = await this.axios.put(
            `/categories/${this.selectedKeys[2]}/attributes/${this.editForm.attr_id}`,
            { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
          );
          if (res.meta.status !== 200)
            return this.$message.error("修改属性失败");
          this.$message.success("修改属性成功");
          this.getParamsData();
          this.editDialogVisiable = false;
        }
      });
    },
    // 属性删除按钮事件
    async deleteParams(data) {
      let confirmRes = await this.$confirm(
        `是否确定删除${data.attr_name}属性?`,
        "",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      ).catch((err) => err);
      if (confirmRes === "confirm") {
        let { data: res } = await this.axios.delete(
          `/categories/${this.selectedKeys[2]}/attributes/${data.attr_id}`
        );
        if (res.meta.status !== 200) return this.$message.error("删除参数失败");
        this.$message.success("删除参数成功");
        this.editDialogVisiable = false;
        this.getParamsData();
      }
    },
  },
  computed: {
    //   控制按钮是否可用
    isBtnDisabled() {
      if (this.selectedKeys.length === 0) {
        return true;
      }
      return false;
    },
    dialogTitle() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
};
</script>

<style lang="less" scoped>
.select_area {
  margin: 25px 0;
}
.btn {
  margin-bottom: 25px;
}
</style>