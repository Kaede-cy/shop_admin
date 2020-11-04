<template>
  <div class="home">
    <el-container>
      <!-- 页头 -->
      <el-header>
          <Header></Header>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <Aside></Aside>
        <!-- 页面主体开始 -->
        <el-main>
            <div>
            </div> 
        </el-main>
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
  padding-left: 0;
}

.el-main {
  background-color: #eaedf1;
  margin-top: 40px;
  div {
      height: 2000px;
      width: 200px;
      background-color: pink;
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