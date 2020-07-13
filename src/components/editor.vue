<template>
  <div>
    <div ref="editor"></div>
  </div>
</template>

<script>
  import E from 'wangeditor';
  export default {
    name:'editor',
    data(){
     return{
        editorObj:null
     }
    },
    props:{
      name:String
    },
    methods:{
      getContent(html){
        let data={
          name:this.name,
          content:html, //返回内容
        }
        this.$emit('getContent',data)
      },
      getEditor(e){
        this.editorObj=e;
        let data={
          name:this.name,
          e:e
        };
        this.$emit('getEditors',data);
      },
      editor(){
        return {
          name:this.name,
          editor:this.editorObj
        };
      }
    },
    mounted(){
      let e= new E(this.$refs.editor);


      //  e.txt.html(content);设置默认内容
      // e.txt.clear();//清空编辑器
      //配置功能
      e.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        // 'quote',  // 引用
        //'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        //'video',  // 插入视频
        //'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ]
      //配置字体
      e.customConfig.colors =[
        "#000000","#ffffff","#c0c0c0","#808080","#ffcc00","#00ff00","#808000","#008000","#008080","#00ffff","#0000ff"
        ,"#000080","#ff00ff","#ff0000","#800080","#880000"
      ];

      e.customConfig.pasteFilterStyle = false; //是否取消粘贴来自网页的样式，不取消
      e.customConfig.pasteIgnoreImg = false;   //是否取消粘贴来自网页链接图片，不取消

      e.customConfig.showLinkImg = true;// 开启上传网络图片
      e.customConfig.uploadImgShowBase64 = true  //使用 base64 保存图片

      e.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;//限制上传图片大小不能超过5m；
      e.customConfig.uploadImgMaxLength = 5;//最多选择5张图片

      e.customConfig.customAlert = (info)=>{ //自第一返回信息
          // info 是需要提示的内容
          this.$message.error(info);
      }
      e.customConfig.onchange = (html) => {
        // this.content = html
        this.getContent(html);
      }

      e.customConfig.uploadImgMaxLength = 1;
      e.customConfig.uploadImgServer =this.$http+this.$api.upload;
      e.customConfig.uploadImgParams = {
          path: 'contentimg',
          iseditimg:'text'
      }
      let base_url=this.$http;
      e.customConfig.uploadImgHooks = {
          customInsert: function (insertImg, result, editor) {
            if(result.code===200){
               insertImg(base_url+result.data.path);
            }
          }

      }


      e.create()
      this.getEditor(e);
    }
  }
</script>





<style>




</style>
