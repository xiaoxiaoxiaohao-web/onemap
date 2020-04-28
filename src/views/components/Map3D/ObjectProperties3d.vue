<template>
  <div
    cid="ObjectProperties3d"
    class="info-label-box"
    :style="{'bottom':(bottom+40)+'px','right':(right-122)+'px'}"
  >
    <div class="info-label-div">
      <div class="info-label-header">
        {{obj.name}}
        <span class="abs-tb" @click="closeBox()">X</span>
      </div>
      <div class="info-label-content">
        <div class="info-table">
          <!-- <table>
            <tr v-for="(val,i) in obj.list" :key="i">
              <td class="info-label-tname">{{val.name}}</td>
              <td class="info-label-tlabel">{{val.value}}</td>
            </tr>
          </table>-->
          <div
            style="display: flex; text-align: left; padding: 5px"
            v-for="(val,i) in obj.list"
            :key="i"
          >
            <div style="flex: 0 0 100px;" class="info-label-tname">{{val.name}}</div>
            <div class="info-label-tlabel" style="flex: 1 1 auto">{{val.value}}</div>
          </div>
        </div>
        <div class="info-label-button" v-if="hasBtn">
          <button @click="toSchemeList">方案详情</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ObjectProperties3d',
  props: {
    bottom: {
      type: Number,
      default: 300
    },
    right: {
      type: Number,
      default: 100
    },
    obj: {
      type: Object,
      required: true
    },
    hasBtn: {
      type: Boolean,
      required: false
    },
    projectID: {
      type: String,
      default: '-1'
    }
  },
  data() {
    return {
      //projectID:'-1'
    }
  },
  watch: {
    getShowHow(newv, oldv) {
      console.log(newv + ' -> ' + oldv)
    }
  },
  created() {
    // this.$bus.on('showHow', v => {
    //   console.log("数据面板",v);
    // });
  },
  mounted() {},
  methods: {
    closeBox() {
      this.$emit('showHow', false)
    },
    toSchemeList() {
      // console.log("跳转到方案列表，ID为："+this.projectID)
      // this.$bus.emit('showSchemeForm',this.projectID)
      //this.closeBox();
    }
  }
}
</script>
<style scoped>
.info-label-box {
  position: absolute;
  z-index: 2;
  /* overflow: hidden; */
  color: #fff;
}
.info-label-box:after {
  content: '';
  position: absolute;
  /*bottom: -50px; no*/
  bottom: -40px;
  /* left: 50px; */
  /*right: 172px; no*/
  right: 100px;
  /*border-width: 0 20px 50px 0px; no*/
  border-width: 20px;
  border-style: solid;
  /* border-color: transparent #fff; */
  border-color: rgba(11, 43, 85, 0.8) transparent transparent;
  display: block;
  width: 0;
}
.info-label-div {
  max-width: 242px; /*no*/
  /*height: 226px; no*/
  min-height: 255px;
  background-color: rgba(11, 43, 85, 0.8);
}
.info-label-header {
  /* width:1135px; */
  height: 30px; /*no*/
  font-size: 16px; /*no*/
  position: relative;
  /*background-color: #0991bd;*/
  line-height: 30px; /*no*/
  padding-left: 30px; /*no*/
  text-align: left;
  border-bottom: 1px dashed #fff;
}
.info-label-header span {
  position: absolute;
  width: 30px; /*no*/
  height: 30px; /*no*/
  right: 0px;
  cursor: pointer;
  text-align: center;
}

.info-label-content {
  /*background-color: #fff;*/
  padding: 4px; /*no*/
  /* width: 100%; */
  height: calc(100% - 30px); /*no*/
  overflow-y: auto;
}
.info-label-content > div {
  width: 100%;
  /* height: 50%; */
  /* height: 100%; */
  height: 85%;
  /* width: 756px;
    height: 301px; */
}
.info-label-content table {
  table-layout: fixed;
  border-collapse: collapse;
  width: 100%;
  /* white-space: nowrap; */
  text-align: left;
}
.info-label-content table td {
  /* border-top: 2px solid #d8d8d8;
  border-left: 2px solid #d8d8d8; */
  font-size: 12px; /*no*/
  line-height: 14px; /*no*/
  padding: 5px 14px; /*no*/
}
/* .info-label-content table tr:last-child > td {
  border-bottom: 2px solid #d8d8d8;
} */
.info-label-tname {
  width: 50%;
  /*color: #666666;*/
  /* background-color: #f2f2f2; */
  color: #fff;
}
.info-label-tlabel {
  /*color: #000;*/
  /* border-right: 2px solid #d8d8d8; */
  /* background-color: #fff; */
  color: #fff;
}
/* .info-label-content table tr:nth-child(odd) {
  background-color: #dee9ec;
} */

.info-label-content .info-label-button {
  width: auto;
  height: auto;
}
.info-label-button button {
  border: 0;
  background-color: rgba(51, 102, 255, 1);
  color: #fff;
}
</style>
