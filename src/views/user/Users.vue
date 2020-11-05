<template>
  <div class="users">
    <el-card>
      <!-- 用户功能区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="输入搜索内容" v-model="queryInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button type="warning" @click="resetSearch()">重置搜索</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <!-- 修改按钮 -->
            <el-tooltip
              effect="dark"
              content="修改用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClose()"
    >
      <el-form
        label-width="100px"
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}

.el-pagination {
  margin-top: 20px;
}
</style>

<script>
export default {
  created() {
    this.getUserList();
  },
  data() {
    let checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (reg.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };

    let checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("电话不能为空"));
      }
      let reg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (reg.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法电话号"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "用户名需在3-8位之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "密码需在3-20位之间", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, tigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async getUserList() {
      let { data: res } = await this.axios.get("/users", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    async userStateChange(userinfo) {
      console.log(userinfo);
      let { data: res } = await this.axios.put(
        `/users/${userinfo.id}/state/${userinfo.me_state}`
      );

      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("修改用户状态失败");
      }
      this.$message.success("修改用户状态成功");
    },
    //监听页码改变
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    resetSearch() {
      this.queryInfo.query = "";
      this.getUserList();
    },
    // 监听增加用户对话框关闭
    dialogClose(){
        this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser(){
        this.$refs.addFormRef.validate(async valid=>{
            if(!valid) {
                this.$alert('请按提示输入注册信息', '', {
                    confirmButtonText: '确定',
                });
            }
            let {data:res}=await this.axios.post('/users',this.addForm)
            if(res.meta.status !==201){
                return this.$message.error('添加用户失败');
            }
            this.$message.success('添加用户成功');
            this.dialogVisible=false;
            this.getUserList()
        })
    }
  },
};
</script>