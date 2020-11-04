<template>
  <div class="home">
    <el-container>
      <!-- 页头开始 -->
      <el-header>
        <span class="brand">
          <img src="../assets/images/logo.png" alt="" />
          <span>后 台 管 理 系 统</span>
        </span>
        <span class="user">
          <img src="../assets/images/Avatar.png" alt="" />
          <span>欢迎你，{{ username }}</span>
          <i class="el-icon-caret-bottom"></i>
        </span>
      </el-header>
      <!-- 页头结束 -->
      <el-container>
        <!-- 侧边栏开始 -->
        <el-aside width="200px">
          <!-- 侧边栏菜单 -->
          <el-menu
            default-active="1"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
          >
            <el-menu-item index="1">
              <!-- 一级菜单 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-s-home"></i>
                <!-- 文本 -->
                <span>首页</span>
              </template>
            </el-menu-item>
            <el-submenu v-for="item in menuList" :key="item.id" :index="item.id+''">
              <!-- 一级菜单 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconObj[item.authName]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.id+''">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 侧边栏结束 -->
        <!-- 页面主体开始 -->
        <el-main>Main</el-main>
        <!-- 页面主体结束 -->
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.home {
  height: 100%;
}
.home > .el-container {
  height: 100%;
}
.el-header {
  background-color: #3c3c3c;
  color: white;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  padding-right: 30px;

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
    display: flex;
    cursor: pointer;
    align-items: center;

    img {
      background-color: #fff;
      border-radius: 50%;
      border: 2px solid #ffa;
    }

    span {
      margin-left: 8px;
    }
    @media screen and (max-width: 576px) {
      span {
        display: none;
      }
    }
  }
}
.el-aside {
  background-color: #333744;

  .el-menu {
      border: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>

<script>
export default {
    created(){
        this.getMenuList();
    },
    data() {
        return {
            username: "",
            menuList:[],
            iconObj:{
                '用户管理':'el-icon-s-custom',
                '权限管理':'el-icon-s-check',
                '商品管理':'el-icon-s-goods',
                '订单管理':'el-icon-s-order',
                '数据统计':'el-icon-s-data'
            }
        };
    },
    methods: {
        async getMenuList(){
            let {data:res}=await this.axios.get('/menus');
            console.log(res);
            if(res.meta.status !==200) return this.$message.error(res.meta.msg)
            this.menuList=res.data
        }
    },
    mounted() {
        this.username = window.sessionStorage.getItem("username");
    },
};
</script>