<template>
  <el-container class="home_container">
    <el-header>
      <img src="../assets/images/logo.png" alt="" width="60">
      <span>电商后台管理系统</span>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'60px':'200px'">
        <div class="collapse_btn" @click="toggleCollapse">|||</div>
        <el-menu
          router
          unique-opened
          background-color="#373D41"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activeIndex">
          <el-submenu :index="item.id+''" v-for="item in menuData" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span class="ml">{{ item.authName }}</span>
            </template>
            <el-menu-item :index="'/'+value.path" v-for="value in item.children"
                          :key="value.id" class="bgc" @click="getActiveIndex('/'+value.path)">
              <i class="el-icon-menu"></i>
              <span>{{ value.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        menuData: [],
        iconsObj: {
          125: 'iconfont icon-user',
          103: 'iconfont icon-tijikongjian',
          101: 'iconfont icon-shangpin',
          102: 'iconfont icon-danju',
          145: 'iconfont icon-baobiao'
        },
        isCollapse: false,
        activeIndex: ''
      }
    },
    methods: {
      async getMenuData() {
        const { data: res } = await this.$http.get('menus')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menuData = res.data
      },
      // 控制折叠侧边导航栏
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      //  控制当前的二级菜单高亮显示
      getActiveIndex(i) {
        this.activeIndex = i
        window.sessionStorage.setItem('activeIndex', i)
      }
    },
    created() {
      this.getMenuData()
      this.activeIndex = window.sessionStorage.getItem('activeIndex')
    }
  }
</script>

<style scoped lang="less">
  .el-header {
    background-color: #333744;
    padding: 0;
    line-height: 60px;

    img {
      vertical-align: middle;
    }

    span {
      color: #fff;
      font-size: 20px;
      margin-left: 20px;
    }
  }

  .home_container {
    height: 100%;

    .el-aside {
      .collapse_btn {
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: .2em;
        cursor: pointer;
      }

      .el-menu {
        background-color: #333744 !important;
        overflow: hidden !important;

        .ml {
          margin-left: 15px;
        }

      }
    }

  }
</style>
