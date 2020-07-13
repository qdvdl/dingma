<template>
  <div class="menu-list">
    <el-menu  :default-active="active" class="el-menu-vertical-demo" :unique-opened="uopened" :collapse-transition="false"  :collapse="collapse">
       <el-menu-item index="0" @click="link('home','0')">
         <i class="el-icon-s-home"></i>
         <span slot="title">首页</span>
       </el-menu-item>
        <el-submenu  v-for="item in menu" :key="item.id" :index="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{item.title}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item @click="link(items.name,items.id)" :key="items.id" :index="items.id" v-for="items in item.children" v-if="items.name!=authOff"><i :class="items.icon"></i>{{items.title}}</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  // 侧边栏
 export default {
   name:"SideMenu",
   data(){
     return {
        authOff:this.$authOff,
        uopened:false
     }
   }
   ,props:{
     collapse:Boolean,
     menu:Object|Array
   },
   computed:{
     active(){
       return this.$store.getters.getData.active;
     }
   },
   methods:{
     link(path,d){

       if(this.$route.name!=path){
         this.$router.replace({
           name:path
         });
         this.$emit("eventTo",{index:d,meta:this.$route.matched[0]['meta']});
       }
     }
   }
 }
</script>


<style>
.el-menu-item-group__title{
  display: none;
}
.el-menu{
  background-color:#eef1f6;
}
.el-menu .el-menu--inline{
  background-color: #e4e8f0;
}
.menu-list{
  height:90vh;
  overflow: scroll;
}
</style>
