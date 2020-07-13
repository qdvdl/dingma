<template>
  <div class="form-box" v-bind:class="{formBoxInline:inline}">
    <el-form :inline="inline" :rules="rules" :ref="refNanme" :model="formData" :label-width="labelWidth">
      <el-form-item :label="fr.label" v-for="fr in formListItem" :key="fr.prop"  :prop="fr.prop">
        <!-- 输入框 -->
          <div class="text" v-if="fr.type==='text'">
            <el-input :maxlength="fr.maxlength" v-model="formData[fr.prop]" :placeholder="fr.placeholder"></el-input>
          </div>
          <div class="textarea" v-else-if="fr.type==='textarea'">
            <el-input :style="{height:fr.height}" type="textarea" show-word-limit :maxlength="fr.maxlength" :placeholder="fr.placeholder" v-model="formData[fr.prop]"></el-input>
            <!-- <div class="number"><span v-bind:class="{active:formData[fr.prop].length===fr.maxlength}">{{formData[fr.prop].length}}</span>/{{fr.maxlength}}</div> -->
          </div>
        <!-- 下拉选择 -->
          <div class="select" v-else-if="fr.type==='select'">
            <el-select v-model="formData[fr.prop]" :placeholder="fr.placeholder">
              <el-option :label="option.text" :value="option.value" v-for="option in fr.select" :key="option.value"></el-option>
            </el-select>
            <slot name="selectinfo" v-if="fr.isSlot&&fr.state===formData[fr.prop]"></slot>
          </div>
        <!-- 复选框  -->
          <div class="checkbox" v-else-if="fr.type==='checkbox'">
              <el-checkbox-group v-model="formData[fr.prop]" :min="fr.minlength" :max="fr.maxlength">
                <el-checkbox :label="checkbox.value" :name="fr.prop" v-for="checkbox in fr.checkbox" :key="checkbox.value">{{checkbox.text}}</el-checkbox>
              </el-checkbox-group>
          </div>
        <!-- 单选框 -->
          <div class="radio" v-else-if="fr.type==='radio'">
            <el-radio-group v-model="formData[fr.prop]">
                <el-radio :label="radio.value" v-for="radio in fr.radio" :key="radio.value">{{radio.text}}</el-radio>
            </el-radio-group>
          </div>
        <!-- 开关开按钮 -->
          <div class="switch" v-else-if="fr.type==='switch'">
            <el-switch v-model="formData[fr.prop]"></el-switch>
          </div>
        <!-- 日期时间  -->
          <div class="datetime" v-else-if="fr.type==='datetime'">
            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formData[fr.prop]" :editable="false" :type="fr.type" :placeholder="fr.placeholder"></el-date-picker>
          </div>
          <div class="datetime" v-else-if="fr.type==='date'">
            <el-date-picker value-format="yyyy-MM-dd" v-model="formData[fr.prop]" :editable="false" :type="fr.type" :placeholder="fr.placeholder"></el-date-picker>
          </div>
        <!-- 时间范围选择器  -->
          <div class="datetimerange" v-else-if="fr.type==='datetimerange'">
            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formData[fr.prop]" :editable="false" :type="fr.type" :range-separator="fr.range" :start-placeholder="fr.startPlaceholder" :end-placeholder="fr.endPlaceholder"></el-date-picker>
          </div>
          <div class="datetimerange" v-else-if="fr.type==='daterange'">
            <el-date-picker value-format="yyyy-MM-dd" v-model="formData[fr.prop]" :editable="false" :type="fr.type" :range-separator="fr.range" :start-placeholder="fr.startPlaceholder" :end-placeholder="fr.endPlaceholder"></el-date-picker>
          </div>
        <!-- 联动 -->
          <div class="cascader" v-else-if="fr.type==='cascader'">
            <el-cascader v-model="formData[fr.prop]" :placeholder="fr.placeholder" :options="fr.options" @change="handleChange"></el-cascader>
          </div>
        <!-- 图片上传 -->
        <div class="imgUpload"  v-else-if="fr.type==='imgUpload'">
          <Upload :croppParame="fr.croppParamePoster" :isCrop="fr.isCrop" :item="fr.prop" :name="fr.name" :imgList="formData[fr.name]" :parame="fr.uploadParame" @onSuccess="getImage"></Upload>
          <p class="imgMsg"><i class="el-icon-warning-outline"></i>{{fr.placeholder}}</p>
        </div>
        <!-- 内容管理 -->
        <div class="editConten" v-else-if="fr.type==='editConten'">
          <Editor ref="editObj" :name="fr.prop" @getContent="getContent"></Editor>
        </div>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="onSubmit(refNanme)">{{bntText}}</el-button>
        <!-- <el-button>取消</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/upload';
  import Editor from '@/components/editor';
  //console.log(Editor)
  export default {
    name:"createForm",
    components:{
      Upload,Editor
    },
    data(){
      return{
        editorObj:null
      }
    },
    beforeUpdate(){
      //更新内容
      // let name=this.$refs.editObj[0].getEditorName();
      //this.editorObj.txt.html(this.formData[name]);
    },
    props:{
      labelWidth:String, //文字宽度
      rules:Array|Object,//验证对象
      bntText:String,   //提交按钮文字
      refNanme:String,  //form表单ref名称
      inline:Boolean,   //显示方式
      formData:Object,  //提交表单数据formData
      formListItem:Array|Object//配置参数
    },
    methods:{
      onSubmit(formName){
        //验证
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data=this.formData;
            this.$emit('eventSubmit',{
              data:data
            });
          } else {
            return false;
          }
        });
       // console.log(formName)
      },
      //触发联动后
      handleChange(value){
        //console.log(value);
      },
      //获取文章内容编辑时获取
      getContent({name,content}){
         this.formData[name]=content;//赋予编辑器内容
      },
      setEditors({e,name}){
        // console.log(this.formData[name]);
        // this.editorObj=e;
        // e.txt.html(this.formData[name]);
      },
      //编辑器内容
      getEditor(content,index){
       let {name,editor}=this.$refs.editObj[index].editor();
       editor.txt.html(content);
      },
      clearEditor(index){
        let {name,editor}=this.$refs.editObj[index].editor();
        editor.txt.clear();
      },
      //图片上传触发
      getImage({set,imgUrl,index,name}){

        //获取图片上传资源地址
        if(set.type==="add"){
          this.formData[name].push(imgUrl);
        }else if(set.type==="edit"){
          this.$set(this.formData[name],set.index,imgUrl);
        }else if(set.type==="del"){
          //删除
          this.formData[name]=this.formData[name].filter((item,i)=>{
            if(set.index!=i){
              return item;
            }
          });
        }
        if(this.formData[name].length){
          this.formData[index]=this.formData[name].join(',');
        }else{
          this.formData[index]="";
        }
      }
    }
  }
</script>

<style scoped>
  .el-select{
    width: 100%;
  }
  .textarea{
    position: relative;
  }
  .textarea >>>textarea{
    resize:none;
    height: 100%;
  }
  .textarea .number{
    position: absolute;
    right: 10px;
    bottom: 0px;
    color: #AAAAAA;
  }
  .textarea .number span.active{
    color: red;
  }
  .cascader,.datetime,.datetimerange{
    position: relative;
    z-index: 2;
  }
  .editConten{
    position: relative;
    z-index: 1;
  }
  .cascader .el-cascader{
    min-width: 350px;
  }
  .imgMsg{
    color: #ff3c00;
    font-size: 14px;
    font-weight: 400;
  }
  .imgMsg .el-icon-warning-outline{
    margin-right: 10px;
    font-size: 15px;
    font-weight: 400;
  }

  .formBoxInline{
    display: inline-block;
  }
  .formBoxInline >>> .el-form-item{
    margin-bottom: 12px;
  }
</style>
