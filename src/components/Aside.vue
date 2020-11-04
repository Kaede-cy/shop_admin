<template>
    <div class="aside" >
        <div class="aside_toggle" @click="asideToggle()">
              <div class="line"></div>
              <i :class="{'el-icon-caret-right':isHiding,'el-icon-caret-left':!isHiding,'toggle_hide':isHiding,'toggle_show':!isHiding}"></i>
          </div>
          <!-- 侧边栏菜单 -->  
        <el-menu
            default-active="1"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            :class="{aside_content_hide:isHiding,aside_content_show:!isHiding}"
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
    </div>
</template>
<script>
export default {
    name:'Aside',
    created(){
        this.getMenuList();
    },
    data(){
        return {
            menuList:[],
            iconObj:{
                '用户管理':'el-icon-s-custom',
                '权限管理':'el-icon-s-check',
                '商品管理':'el-icon-s-goods',
                '订单管理':'el-icon-s-order',
                '数据统计':'el-icon-s-data'
            },
            isHiding : false
        }
    },
    methods: {
        async getMenuList(){
            let {data:res}=await this.axios.get('/menus');
            console.log(res);
            if(res.meta.status !==200) return this.$message.error(res.meta.msg)
            this.menuList=res.data
        },
        asideToggle(){
            this.isHiding=!this.isHiding
        }
    },
}
</script>
<style lang="less" scoped>
.aside {
  height: 100%;
  width: 200px;
  position: fixed;

    .aside_toggle {
        background-color: #4a5064;
        padding: 0 10px;
        position: relative;
        line-height: 40px;
        height: 40px;
        overflow: hidden;
        cursor: pointer;

        .line {
            width: 150px;
            height: 2px;
            background-color: #ccc;
            margin: 19px auto;
        }

        i {
            font-size: 30px;
            color: #ccc;
            position: absolute;
            top: 5px;
        }

        .toggle_hide {
            transition: all 1s;
            left: 10px;
        }
        .toggle_show {
            transition: all 1s;
            left: 155px;
        }
    }

    .aside_content_hide {
        transition: all 1s;
        transform: translate(-150px);
        opacity: 0;
    }
    .aside_content_show {
        transition: all 1s;
        transform: translate(0px);
        opacity: 1;
    }
    .el-menu {
        border: none;
        height: 100%;
    }
}
@media screen and (max-width: 576px){
    .aside {

        .aside_toggle {
            width: 100px;

            .line {
                width: 75px;
            }

            .toggle_show {
                transition: all 1s;
                left: 80px;
            }
        }
    }
}
</style>