<template>
    <div class="bread">   
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">
                {{item}}
                </el-breadcrumb-item>
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
    data() {
        return {
            item:'',
            subItem:''
        }
    },
}
</script>