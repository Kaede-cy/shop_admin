<template>
  <div class="home">
    <el-container>
      <!-- 页头 -->
      <el-header>
          <Header></Header>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <Aside style="z-index:1000"></Aside>
        <!-- 页面主体开始 -->
        <el-main>
            <router-view></router-view>
        </el-main>
        <!-- 页面主体结束 -->
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less">
.home {
  height: 100%;
}
.home > .el-container {
  height: 100%;
}
.el-header {
  padding-left: 0 !important;
}

.el-main {
  background-color: #eaedf1;
  padding-top: 60px !important;
  padding-left: 230px !important;
}

@media screen and (max-width: 576px){
  .el-main {
    padding-left: 20px !important;
  }
}

</style>

<script>
import Header from '../components/Header.vue'
import Aside from '../components/Aside.vue'
export default {
    created(){
        
    },
    data() {
        return {
            
        };
    },
    methods: {
        
    },
    mounted() {

    },
    components:{
        Header,Aside
    }
};
</script>