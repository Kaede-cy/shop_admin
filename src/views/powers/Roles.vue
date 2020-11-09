<template>
  <div class="roles">
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe="">
        <!-- 扩展列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['border_bottom', i1 == 0 ? 'border_top' : '', 'vcenter']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="i2"
                  :class="[i2 == 0 ? '' : 'border_top', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="i3"
                      type="warning"
                      closable
                      @close="
                        removeRightById(scope.row, item3.id, item3.authName)
                      "
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete">删除</el-button>
              <el-button
                type="success"
                icon="el-icon-setting"
                @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="defKeys = []"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList();
  },
  data() {
    return {
      // 角色列表
      roleList: [],
      // 控制分配权限对话框的显示隐藏
      setRightDialogVisible: false,
      // 权限列表
      rightsList: [],
      // 树型控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 树型控件默认选中的节点id
      defKeys: [],
    //保存分配权限窗口被打开的角色id
      roleId:''
    };
  },
  methods: {
    async getRoleList() {
      let { data: res } = await this.axios.get("/roles");
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
    },
    // 根据id删除角色权限
    async removeRightById(role, rightId, item3) {
      let res = await this.$confirm(
        "确定删除" + role.authName + "的" + item3 + "权限吗？",
        "",
        {
          confirmButttonText: "确定",
          cancelButtontext: "取消",
        }
      ).catch((err) => err);
      if (res == "confirm") {
        let { data: res } = await this.axios.delete(
          `/roles/${role.id}/rights/${rightId}`
        );
        if (res.meta.status != 200) return this.$message.error("删除权限失败");
        this.$message.success("删除权限成功");
        role.children = res.data;
      }
    },
    // 展示分配权限对话框
    async showSetRightDialog(scope) {
        // 把角色id保存到data，提供给修改接口调用
        this.roleId=scope.id
      // 获取所有权限数据
      let { data: res } = await this.axios.get("/rights/tree");
      if (res.meta.status != 200)
        return this.$message.error("获取权限列表失败");
      this.rightsList = res.data;
      console.log(this.rightsList);
      this.getDefaultLeaf(scope, this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 读取当前角色权限函数
    getDefaultLeaf(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((elem) => {
        this.getDefaultLeaf(elem, arr);
      });
    },
    // 修改角色权限函数
    async allotRights() {
        let keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
        let keyStr=keys.join(',')
        let {data:res} = await this.axios.post('/roles/'+this.roleId+'/rights',{rids:keyStr})
        if(res.meta.status!==200) return this.$message.error('分配权限失败');
        this.$message.success('分配权限成功');
        this.getRoleList();
        this.setRightDialogVisible=false
    },
  },
};
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 30px;
}
.border_top {
  border-top: 1px solid #eee;
}
.border_bottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 10px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>