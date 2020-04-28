<!--
 * @Description: 新城区国土空间规划资源一张图管理平台
 * @Author: your name
 * @Date: 2019-09-06 09:59:42
 -->
<template>
  <div class="login-body">
    <div class="title-div">
    </div>
    <div class="content-div">
      <div class="left-img"></div>
      <div class="login-div">
        <!-- 标题 -->
        <div class="login-title">
          <span>登录</span>
          <div class="login-title-line"></div>
        </div>
        <!-- 内容 -->
        <div class="login-content">
          <div class="L-div">
            <el-input placeholder="请输入用户名" v-model="username" @keyup.enter.native="doLogin">
              <i slot="prefix" class="icon-username"></i>
            </el-input>
          </div>
          <div class="L-div">
            <el-input placeholder="请输入密码" v-model="password" show-password @keyup.enter.native="doLogin">
              <i slot="prefix" class="icon-password"></i>
            </el-input>
          </div>
          <!-- <div class="L-div">
            <el-input placeholder="请输入验证码" v-model="CAPTCHA">
            </el-input>
            <div class="CAPTCHA-content">
              <div ref="CAPTCHA" class="CAPTCHA"></div>
            </div>
          </div> -->
          <div class="L-div">
            <el-checkbox v-model="isRemeber">记住密码</el-checkbox>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="bottom-div">
          <div class="login-button" @click.stop="doLogin">
            立即登录
          </div>
          <div class="login-loading" v-if="loading">
            <i class="el-icon-loading"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { login } from '@/api/userApi'
export default {
  name: 'Login',
  components: {},
  props: [],
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      CAPTCHA: '11', // 验证码
      isRemeber: true, // 是否记住密码
      loading: false
    }
  },
  created() { },
  mounted() { },
  methods: {
    doLogin() {
      // 判断是否有空值
      if (this.username === '' || this.password === '' || this.CAPTCHA === '') {
        this.$message({
          type: 'error',
          message: '用户名、密码都不能为空' // 验证码未使用
        })
        return 0
      } else {
        // 判断是否正确
        let params = {
          userName: this.username,
          passWord: this.password
        }
        this.loading = true
        login(params).then(res => {
          if (res.Data) {
            // console.log('登录成功', JSON.stringify(res))
            this.$store.commit('global/setUserInfo', res.Data)
            this.$router.replace('/onemapApplication')
            this.loading = false
            // 保存sesstionStorage
            window.sessionStorage.type = 'login'
          } else {
            this.$message({
              type: 'error',
              message: res.Message // 验证码未使用
            })
            this.loading = false
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '登录失败'
          })
          this.loading = false
        })
      }
    }
  },
  computed: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
.login-body {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-image: url('./images/login-bg.png');
  min-height: 859px;
  .title-div {
    width: 100%;
    height: 99px;
    background-image: url('./images/title.png');
    background-size: cover;
  }
  .content-div {
    display: flex;
    justify-content: space-between;
    padding: 50px 200px 0px 200px;
    .left-img {
      width: 678px;
      height: 707px;
      background-size: cover;
      background-image: url('./images/login-left.png');
    }
    .login-div {
      width: 336px;
      height: 430px;
      padding: 30px 50px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 8px 14px 0px rgba(42, 75, 161, 0.2);
      opacity: 0.9;
      border-radius: 6px;
      margin-top: 100px;
      // 登录标题
      .login-title {
        font-size: 30px;
        font-family: Noto Sans S Chinese;
        font-weight: 300;
        color: rgba(67, 84, 221, 1);
        text-align: center;
        .login-title-line {
          margin: auto;
          margin-top: 9px;
          width: 36px;
          height: 4px;
          background: rgba(56, 234, 255, 1);
        }
      }
      // 登录内容
      .login-content {
        // 带验证码
        // padding: 50px 0px;
        // height: 220px;
        padding: 85px 0px;
        height: 150px;
        .L-div:not(:first-child) {
          padding-top: 22px;
        }
        .L-div i {
          font-size: 20px;
          line-height: 45px;
        }
        .L-div {
          height: 45px;
          line-height: 45px;
          display: flex;
          .CAPTCHA-content {
            width: 200px;
            height: 54px;
            padding-left: 30px;
            .CAPTCHA {
              width: 100%;
              height: 100%;
              background-color: aqua;
            }
          }
        }
      }
      // 登录按钮
      .bottom-div {
        margin: auto;
        text-align: center;
        font-size: 18px;
        font-weight: 400;
        color: white;
        width: 240px;
        height: 46px;
        line-height: 46px;
        position: relative;
        background: linear-gradient(
          90deg,
          rgba(74, 172, 255, 1),
          rgba(44, 89, 255, 1)
        );
        box-shadow: 0px 20px 30px 0px rgba(37, 155, 255, 0.5);
        border-radius: 23px;
        cursor: pointer;
        .login-button:hover {
          color: #434cda;
        }
        .login-loading {
          width: 240px;
          height: 46px;
          border-radius: 23px;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 3;
        }
      }
    }
  }
}
</style>
