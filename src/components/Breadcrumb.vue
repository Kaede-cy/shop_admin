<template>
    <div class="bread">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{item}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{subItem}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
</template>

<style lang="less" scoped>
    .bread {
        padding: 15px 0;
        margin-bottom: 30px;
    }
</style>

<script>
export default {
    name:'Breadcrumb',
    created(){
        this.item=window.sessionStorage.getItem('item')
        this.subItem=window.sessionStorage.getItem('subItem')
    },
    data() {
        return {
            item:'',
            subItem:''
        }
    },
}
</script>