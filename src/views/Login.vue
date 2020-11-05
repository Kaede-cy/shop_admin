<template>
  <div class="login">
    <el-row>
      <el-col :md="{span:8,offset:8}" :xs="{offset:2,span:20}">
        <!-- 登录框开始 -->
        <div class="login_box">
          <!-- 头像区域开始 -->
          <el-row>
            <el-col :span="8" :offset="8">
              <div class="avatar">
                <img src="../assets/logo.png" alt="" />
              </div>
            </el-col>
          </el-row>
          <!-- 头像区域结束 -->
          <!-- 内容表单区域开始 -->
          <div class="form">
            <el-row>
              <el-col>
                <div class="title">后 台 管 理 系 统</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <!-- 通过ref属性把表单实例对象引用到vue实例 -->
                <el-form
                  label-width="30%"
                  class="login_form"
                  :model="form"
                  :rules="rules"
                  ref="loginRef"
                >
                  <el-form-item label="账号" prop="username">
                    <el-input
                      placeholder="在此输入账号"
                      prefix-icon="el-icon-user"
                      v-model="form.username"
                      prop="username"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password">
                    <el-input
                      placeholder="在此输入密码"
                      show-password
                      prefix-icon="el-icon-lock"
                      v-model="form.password"
                      prop="password"
                    ></el-input>
                  </el-form-item>
                  <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm"
                      >重置</el-button
                    >
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
          <!-- 内容表单区域结束 -->
        </div>
        <!-- 登录框结束 -->
      </el-col>
    </el-row>
  </div>
</template>

<style lang="less" scope>
.login {
  height: 100%;
  background-color: #2b4b6b;
}
/* 登录框开始 */
.login_box {
  margin-top: 30%;
  width: 100%;

  background-color: #fff;
  border-radius: 10px;
  border: 5px solid #2b4b8b;
  box-shadow: 0 0 10px #aaa;

  .avatar {
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 5px 8px;
    transform: translate(0, -40%);
    background-color: #fff;
    box-shadow: 0px 0px 10px #eee;

    img {
      background-color: #ddd;
      width: 100%;
      border-radius: 50%;
    }
  }
  // 登录表单开始
  .form {
    transform: translate(0, -35px);

    .login_form {
      padding: 0 8%;
    }

    .title {
      text-align: center;
      font-size: 32px;
      margin-bottom: 50px;
    }
    // 登录文本框开始
    .el-form-item {
      margin-bottom: 30px;
    }

    .el-form-item__label {
      font-size: 16px;
      padding-right: 8%;
    }
    // 登录文本框结束
    .btns {
      text-align: right;
      width: 100%;
      float: right;

      .el-button + .el-button {
        margin-left: 10%;
      }
    }
  }
  // 登录表单结束
}
/* 登录框结束 */
</style>

<script>
export default {
  data() {
    return {
      // 登录表单数据对象
      form: {
        username: '',
        password: '',
      },
      // 登录表单验证规则
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '用户名长度在3~8位之间', tigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 16, message: '密码超出范围', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginRef.resetFields();
    },
    login() {
      console.log(this.$refs.login);
      this.$refs.loginRef.validate((valid) => {
        if (!valid) {
          this.$alert('请按提示输入账号密码', '', {
            confirmButtonText: '确定',
          });
        } else {
          this.axios.post('/login', this.form).then((res) => {
            if (res.data.meta.status !== 200) {
              this.$message.error('登录失败，用户名或密码有误');
              return;
            }
            this.$message.success('登录成功');
            window.sessionStorage.setItem('token',res.data.data.token);
            window.sessionStorage.setItem('username',res.data.data.username);
            this.$router.push('/home')
          });
        }
      });
    },
  },
};
</script>
