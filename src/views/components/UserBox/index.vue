<template>
  <span class="user">
    <i class="el-icon-user user-avatar" />
    <el-dropdown class="user-drop" trigger="click" @command="onUserCommand">
      <span class="el-dropdown-link">
        {{userinfo.userName}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu class="user-drop-menu" slot="dropdown">
        <el-dropdown-item command="userinfo" class="drop-item">个人资料</el-dropdown-item>
        <el-dropdown-item command="logout" class="drop-item">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>
<script>
import { logout } from '@/api/userApi'
export default {
  name: 'UserBox',
  components: {},
  props: [],
  data() {
    return {
    }
  },
  created() { },
  mounted() { },
  methods: {
    onUserCommand(command) {
      if (command === 'logout') {
        this.$store.commit('global/setUserInfo', {})
        logout().then(r => {
          this.$router.replace('/login')
          // 清空sesstionStorage
          window.sessionStorage.type = ''
        })
      }
    }
  },
  computed: {
    userinfo() {
      return this.$store.state.global.userinfo
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
.user {
  user-select: none;
  color: $second-level-color;
  .user-avatar {
    font-size: 18px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: $second-level-color;
  }
  .el-icon-arrow-down {
    font-size: 14px;
  }
  .user-drop {
    margin-left: 16px;
  }
}
.user-drop-menu {
  background-color: rgba(79,110,255,.85);
  border-color: rgba(79,110,255,.85);
  box-shadow: 4px 4px 6px rgba(0,0,0,.2);
  .drop-item {
    color: #33fdff;
    &:hover {
      background-color: #435de5;
    }
  }
}
</style>
