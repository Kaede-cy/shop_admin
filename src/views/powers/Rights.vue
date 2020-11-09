<template>
    <div class="rights">
        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope"> 
                        <el-tag v-if="scope.row.level==0">一级权限</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level==1">二级权限</el-tag>
                        <el-tag type="danger" v-else>三级权限</el-tag>  
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    created(){
        this.getRightsList()
    },
    data() {
        return {
            // 权限列表
            rightsList:[]
        }
    },
    methods:{
        async getRightsList(){
            let {data:res}=await this.axios.get('/rights/list')
            if(res.meta.status!==200) return this.$message.error('获取权限列表失败');
            this.rightsList=res.data
            console.log(res.data);
        }
    }
}
</script>
 
 <style lang="less" scoped>
 
 </style>