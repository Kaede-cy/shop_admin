<template>
    <div class="header">
        <span class="brand">
            <img src="../assets/images/logo.png" alt="" />
            <span>后 台 管 理 系 统</span>
          </span>
          <span class="user">
            <!-- <img src="../assets/images/Avatar.png" alt="" /> -->
             <el-dropdown trigger="click" @command="manage">
              <span class="el-dropdown-link">
                <img src="../assets/images/Avatar.png" alt="" />
                <span>欢迎,{{username}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-setting" command="e">个人设置</el-dropdown-item>
                <el-dropdown-item icon="el-icon-edit" command="e">修改密码</el-dropdown-item>
                <el-dropdown-item icon="el-icon-switch-button" command="logout">注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <span>欢迎你，{{ username }}</span>
            <i class="el-icon-caret-bottom"></i> -->
            <!-- <div class="admin">
              <ul>
                <li></li>
              </ul>
            </div> -->
          </span>
    </div>
</template>

<script>
export default {
    name:'Header',
    methods:{
        manage(command) {
        if(command=='logout'){
          window.sessionStorage.clear();
          this.$router.push('/');
          this.$message('注销成功，欢迎再次使用本系统')
        }
      }
    },
    mounted(){
        this.username = window.sessionStorage.getItem("username");
    },
    data(){
        return {
            username:''
        }
    }
}
</script>

<style lang="less" scoped>
ul {
  list-style: none;
}
.header{
    position: fixed;
    background-color: #3c3c3c;
    width: 100%;
    color: white;
    display: flex;
    justify-content: space-between;

    .brand {
    display: flex;
    align-items: center;
    img {
      height: 60px;
    }
    span {
      font-size: 20px;
      margin-left: 20px;
    }
  }
  .user {
    cursor: pointer;
    padding-right: 25px;
    position: relative;
    display: flex;
    align-items: center;

    img {
      background-color: #fff;
      border-radius: 50%;
      border: 2px solid #ffa;
    }

    span {
      margin-left: 8px;
    }
    .el-dropdown {
      height: 100%;
    }
    .el-dropdown-link {
      display: flex;
      align-items: center;
      height: 100%;
      color: #fff;
    }


    @media screen and (max-width: 576px) {
      span {
        display: none;
      }
    }
  }
}

</style>