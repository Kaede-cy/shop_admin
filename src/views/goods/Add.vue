<template>
  <div class="addGoods">
    <el-card>
      <!-- 返回商品列表按钮 -->
      <el-link icon="el-icon-back" @click="$router.push('/goods')"
        >返回列表</el-link
      >
      <!-- 添加商品信息区域 -->
      <el-alert
        title="请在此输入商品信息"
        type="info"
        show-icon
        :closable="false"
        center
      >
      </el-alert>
      步骤条区域
      <el-steps
        :active="activeIndex * 1"
        finish-status="success"
        align-center=""
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                prop="goods_cat"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children',
                }"
                @change="cascaderChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.arrt_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action：图片要上传的api接口,需要准确地址，如果只有简写，则会上传至客户端 -->
            <!-- upload组件封装了自己的网络请求，没有用到axios，所以无法使用在main.js中定义的Authorization，需要另外设置请求头传递token参数 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button type="primary" class="add_btn" @click="addGood"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisiable" width="30%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 导入lodash插件
import _ from "lodash";

export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
      activeIndex: "0",
      //   商品分类列表数据
      cateList: [],
      //   添加商品表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 级联选择器中选中的分类id数组
        goods_cat: [],
        // 上传商品的图片临时地址
        pics: [],
        // 商品详情描述
        goods_introduce: "",
      },
      // 添加商品表单数据验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      //   动态参数列表数组
      manyTableData: [],
      //   静态属性列表数组
      onlyTableData: [],
      //   图片上传的请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //   图片预览的图片路径
      previewPath: "",
      //   图片预览框可见性
      previewVisiable: false,
    };
  },
  methods: {
    //   获取商品分类数据
    async getCateList() {
      let { data: res } = await this.axios.get("/categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      this.cateList = res.data;
    },
    // 级联选择器选择项改变时触发
    cascaderChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        this.$message.error("请选择三级商品分类");
      }
    },
    // 在tab标签栏发生切换前触发
    beforeTabLeave(activeName, oldName) {
      console.log(activeName, oldName);
      if (oldName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    // tab标签栏切换成功时触发
    async tabClick() {
      if (this.activeIndex == 1) {
        let { data: res } = await this.axios.get(
          "/categories/" + this.addForm.goods_cat[2] + "/attributes",
          { params: { sel: "many" } }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取动态参数列表失败");
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex == 2) {
        let { data: res } = await this.axios.get(
          "/categories/" + this.addForm.goods_cat[2] + "/attributes",
          { params: { sel: "only" } }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取静态属性失败");
        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },
    // 处理上传的商品图预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisiable = true;
    },
    // 处理上传的商品图删除事件
    handleRemove(file) {
      let filePath = file.response.data.tmp_path;
      // findIndex方法：数组接收一个回调函数，回调函数形参为数组中每个元素的索引值，当按回调函数中的条件找到元素后，返回该索引
      let index = this.addForm.pics.findIndex((i) => {
        i.pic === filePath;
      });
      this.addForm.pics.splice(index, 1);
    },
    // 商品图片上传成功时触发
    handleSuccess(response) {
      let obj = { pic: response.data.tmp_path };
      this.addForm.pics.push(obj);
    },
    // 添加商品按钮触发
    addGood() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请按要求填写商品信息");
        }
        // 使用lodash插件对addForm进行深拷贝
        // 因为在级联选择器中，要求双向绑定数据为数组，在发送数据请求时，需要把一个字符串数据
        // formObj为将会提交到后台服务器的数据对象，需要添加新属性arrts[]接收静态及动态属性对象数组
        let formObj = _.cloneDeep(this.addForm);
        formObj.arrts = [];
        formObj.goods_cat = formObj.goods_cat.join(",");
        // 动态参数及静态属性处理：
        // 服务器接口要求一个对象数组，对象中包含属性的id及vals值
        // 需要循环两种类型的属性数组，取出其中的id及vals值传入接口要求的arrts数组中进行数据传输
        this.manyTableData.forEach((item) => {
          let tempObj = {
            attr_id: item.attr_id,
            arrt_value: item.attr_vals.join(" "),
          };
          formObj.arrts.push(tempObj);
        });
        this.onlyTableData.forEach((item) => {
          let tempObj = { arrt_id: item.arrt_id, arrt_value: item.arrt_vals };
          formObj.arrts.push(tempObj);
        });
        console.log(formObj);
        // 发起添加商品请求
        let {data:res} = await this.axios.post('/goods',formObj)
        if(res.meta.status!==201) return this.$message.error('添加商品失败');
        this.$message.success('添加商品成功');
        this.$router.push('/goods')
      });
    },
  },
};
</script>

<style lang="less" scope>
.el-alert {
  margin: 20px 0 !important;
}
.el-steps {
  margin-bottom: 20px;
}
.el-step__title {
  font-size: 14px;
}
.el-checkbox {
  margin: 0 10px !important;
}
.previewImg {
  width: 100%;
}
.ql-editor {
  min-height: 300px;
}
.add_btn {
  margin-top: 20px !important;
}
</style>