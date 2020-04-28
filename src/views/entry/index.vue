<template>
  <div class="bg">
    <div name="head" class="head">
      <div class="head-right">
        <p>{{date}}</p>
        <UserBox></UserBox>
      </div>
    </div>
    <div name="content" class="content">
      <div class="content_top" v-for="(contents,index) in content_top " :key="index" @click="onSystemClick(contents)">
        <div class="content_title">
          <img :src="contents.src" />
          <p v-html="contents.title"></p>
        </div>
        <img src="./images/hover.png" class="icon" />
      </div>
    </div>
    <div name="content" class="content">
      <div class="content_top" v-for="(contents,index) in content_bottom " :key="index">
        <div class="content_title">
          <img :src="contents.src" />
          <p v-html="contents.title"></p>
        </div>
        <img src="./images/hover.png" class="icon" />
      </div>
    </div>
  </div>
</template>
<script>
import { format } from './../../utils/timeUtil'
import UserBox from '../components/UserBox'
export default {
  name: 'Entry',
  components: { UserBox },
  data() {
    this.timer = null
    return {
      content_top: [
        { title: '一张图应用 ', src: require('./images/map.png'), key: '0', router: '/onemapApplication' },
        { title: '国土空间规划分析<br>评价 ', src: require('./images/analyze.png'), key: '1' },
        { title: '国土空间规划成果<br>审查与管理', src: require('./images/investigate.png'), key: '2' }

      ],
      content_bottom: [
        { title: '国土空间规划监测 <br>评估预警', src: require('./images/warning.png'), key: '0' },
        { title: '资源环境承载能力<br> 监测预警', src: require('./images/detection.png'), key: '1' },
        { title: '国土空间规划指标<br> 管理', src: require('./images/management.png'), key: '2' }

      ],
      date: format(new Date(), 'yyyy-MM-dd hh:mm ') //时间的显示
    }
  },
  // 时间的实时更新
  mounted() {
    this.timer = setInterval(() => {
      this.date = format(new Date(), 'yyyy-MM-dd  hh:mm ')//修改数据date
    }, 1000)
  },
  methods: {
    onSystemClick(system) {
      system.router && this.$router.replace(system.router)
    }
  },

  beforeDestroy() {
    if (this.timer) {
      window.clearInterval(this.timer)
    }
  }
}
</script>
<style lang="scss" scoped>
.bg {
  width: 100%;
  height: 100%;
  min-height: 768px;
  background-size: cover;
  background-image: url('./images/bg.png');
  .head {
    width: 100%;
    height: 99px;
    background-image: url('./images/title.png');
    background-size: cover;
  }
}
.head-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: rgba(55, 154, 255, 1);
  justify-content: flex-end;
  line-height: 50px;
  padding-right: 50px;
}
.head-right p {
  font-size: 18px;
  font-family: Regular;
  padding-right: 36px;
}
.content {
  display: flex;
  flex-direction: row;
  margin-top: 100px;
  margin-left: 427px;
}
.content_top {
  width: 380px;
  text-align: center;
  height: 200px;
}
.content_title {
  color: white;
  background: linear-gradient(0deg, rgba(80, 117, 255, 1), rgba(102, 210, 255, 1));
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  padding-top: 40px;
  font-size: 18px;
  height: 170px;
  width: 294px;
}
.content_title:hover {
  background: linear-gradient(0deg, rgba(26, 205, 93, 1), rgba(144, 255, 110, 1));
  cursor: pointer;
}
.icon {
  display: none;
}
.content_top:hover .icon {
  display: inline;
  margin-left: -86px;
}
</style>
