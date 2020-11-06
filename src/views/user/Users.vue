<template>
  <div class="users">
    <el-card>
      <!-- 用户功能区域 -->
      <el-row>
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input placeholder="输入搜索内容" v-model="queryInfo.query">
            <!-- 搜索按钮 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2" :offset="1">
          <!-- 重置搜索内容 -->
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
          <template slot-scope="scope">
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
                @click="showEditDialog(scope.row.id)"
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
                @click="deleteUser(scope.row.id,scope.row.username)"
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
    <!-- 添加用户对话框 -->
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

    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed()"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo()"
          >确 定</el-button
        >
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
    // 添加用户邮箱验证规则
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
    // 添加用户手机验证规则
    let checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("电话不能为空"));
      }
      let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (reg.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法电话号"));
    };
    return {
      // 用户列表返回值接收
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      // 添加用户表单双向绑定内容
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户表单验证规则
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
      // 修改用户框
      editDialogVisible:false,
      // 修改用户表单
      editForm:{
        username:'',
        email:'',
        mobile:''
      },
      editFormRules:{
        email:[
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, tigger: "blur" }
        ],
        mobile:[
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
    };
  },
  methods: {
    // 获取用户列表
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
    // 修改用户状态
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
    // 充值搜索框
    resetSearch() {
      this.queryInfo.query = "";
      this.getUserList();
    },
    // 监听增加用户对话框关闭
    dialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          this.$alert("请按提示输入注册信息", "", {
            confirmButtonText: "确定",
          });
        }
        let { data: res } = await this.axios.post("/users", this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.dialogVisible = false;
        this.getUserList();
      });
    },
    // 修改用户按钮
    async showEditDialog(id) {
      this.editDialogVisible=true
      let {data:res}=await this.axios.get('/users/'+id,);
      if(res.meta.status!==200) {
        this.$message.error('读取用户信息失败')
        this.editDialogVisible=false
      } 
      this.editForm=res.data
    },
    // 监听修改对话框的关闭
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo(){
     this.$refs.editFormRef.validate(async valid=>{
       if(!valid) {
         this.$alert("请按提示输入用户信息", "", {
            confirmButtonText: "确定",
          });
       }
       let {data:res}=await this.axios.put('/users/'+this.editForm.id,{
         email:this.editForm.email,
         mobile:this.editForm.mobile
       })
       console.log(res);
       if(res.meta.status!==200) return this.$message.error('更新用户信息失败');
       this.$message.success('更新用户信息成功');
       this.editDialogVisible=false
       this.getUserList();
     })
    },
    // 删除用户
    deleteUser(id,username){
      this.$confirm('是否删除用户'+username+"?","",{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(res=>{
        if(res==='confirm'){
          this.axios.delete('/users/'+id).then(result=>{
            console.log(result);
            if(result.status!==200) return this.$message.error('删除用户失败');
            this.$message.success('删除用户成功');
            this.getUserList()
          })
        }
      }).catch(err=>{
        return err
      })
    }
  },
};
</script>