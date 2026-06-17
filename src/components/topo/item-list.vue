<template>
  <div class="item-list">
    <div class="item-category">
      <div class="item-header">起始点</div>
      <div class="item-content">
        <el-popover ref="STATION" placement="right" title="站点组织" width="200" trigger="hover" content="这是起始点：站点组织"></el-popover>
        <div v-popover:STATION class="item item-input" data-type="INPUT" data-name="STATION">
          <div class="item-icon"><img :src="icon.STATION" /></div>
          <div class="item-label">站点组织</div>
          <div class="item-port item-port-output"></div>
        </div>
        <el-popover ref="DCCENTER" placement="right" title="直流电源" width="200" trigger="hover" content="这是起始点：直流局端电源"></el-popover>
        <div v-popover:DCCENTER class="item item-function" data-type="INPUT" data-name="DCCENTER">
          <div class="item-icon"><img :src="icon.DCCENTER" /></div>
          <div class="item-label">直流局端电源</div>
         <div class="item-port item-port-output"></div>
        </div>
        <el-popover ref="ACCENTER" placement="right" title="交流电源" width="200" trigger="hover" content="这是起始点：交流局端电源"></el-popover>
        <div v-popover:ACCENTER class="item item-function" data-type="INPUT" data-name="ACCENTER">
          <div class="item-icon"><img :src="icon.ACCENTER" /></div>
          <div class="item-label">交流局端电源</div>
          <div class="item-port item-port-output"></div>
        </div>
      </div>
    </div>

    <div class="item-category">
      <div class="item-header">中间点</div>
      <div class="item-content">
         <el-popover ref="STATION1" placement="right" title="站点组织" width="200" trigger="hover" content="这是中间点：站点组织"></el-popover>
        <div v-popover:STATION1 class="item item-function" data-type="FUNCTION" data-name="STATION">
          <div class="item-icon"><img :src="icon.STATION" /></div>
          <div class="item-label">站点组织</div>
          <div class="item-port item-port-input"></div>
          <div class="item-port item-port-output"></div>
        </div>
        <el-popover ref="DCCENTER1" placement="right" title="直流局端电源" width="200" trigger="hover" content="这是中间点：直流局端电源"></el-popover>
        <div v-popover:DCCENTER1 class="item item-function" data-type="FUNCTION" data-name="DCCENTER">
          <div class="item-icon"><img :src="icon.DCCENTER" /></div>
          <div class="item-label">直流局端电源</div>
          <div class="item-port item-port-input"></div>
          <div class="item-port item-port-output"></div>
        </div>
        <el-popover ref="ACCENTER1" placement="right" title="交流局端电源" width="200" trigger="hover" content="这是中间点：交流局端电源"></el-popover>
        <div v-popover:ACCENTER1 class="item item-function" data-type="FUNCTION" data-name="ACCENTER">
          <div class="item-icon"><img :src="icon.ACCENTER" /></div>
          <div class="item-label">交流局端电源</div>
          <div class="item-port item-port-input"></div>
          <div class="item-port item-port-output"></div>
        </div>
      </div>
    </div>

    <div class="item-category">
      <div class="item-header">终点</div>
      <div class="item-content">
        <el-popover ref="DCREMOTE" placement="right" title="远端直流电源" width="200" trigger="hover" content="这是终点：直流远端电源"></el-popover>
        <div v-popover:DCREMOTE class="item item-action" data-type="ACTION" data-name="DCREMOTE">
          <div class="item-icon"><img :src="icon.DCREMOTE" /></div>
          <div class="item-label">直流远端电源</div>
          <div class="item-port item-port-input"></div>
        </div>
        <el-popover ref="ACREMOTE" placement="right" title="远端交流电源" width="200" trigger="hover" content="这是终点：交流远端电源"></el-popover>
        <div v-popover:ACREMOTE class="item item-action" data-type="ACTION" data-name="ACREMOTE">
          <div class="item-icon"><img :src="icon.ACREMOTE" /></div>
          <div class="item-label">交流远端电源</div>
          <div class="item-port item-port-input"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { icon } from './enum'

export default {
  name: 'item-list',
  data () {
    return {
      icon
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .item-list {
    box-sizing: border-box;
    padding-left: 20px;
  }

  .item-category {
    padding: 10px 0;
  }

  .item-header {
    margin-bottom: 10px;
    color: #999;
    font-size: 14px;
  }

  .item {
    position: relative;
    margin-bottom: 10px;
    background: #ddd;
    border-radius: 5px;
    width: 120px;
    height: 28px;
    cursor: move;
    outline: none;

    &.item-input {
      background: rgb(22, 156, 228);
    }
    &.item-function {
      background: rgb(143, 187, 52);
    }
    &.item-action {
      background: rgb(255, 197, 57);
    }
    &:hover {
      .item-port {
        background: #eee;
      }
    }

    .item-icon {
      position: absolute;
      width: 30px;
      top: 0;
      left: 0;
      bottom: 0;
      border-right: 1px solid rgba(0,0,0,.1);
      background-color: rgba(0,0,0,.05);

      img {
        position: absolute;
        top: 3px;
        left: 4px;
      }
    }

    .item-label {
      margin-left: 28px;
      line-height: 26px;
      overflow: hidden;
      text-align: center;
      color: #fff;
      font-size: 13px;
    }

    .item-port {
      position: absolute;
      top: 9px;
      width: 10px;
      height: 10px;
      border: 1px solid #999;
      box-sizing: border-box;
      border-radius: 3px;
      background: #d9d9d9;

      &.item-port-input {
        left: -5px;
      }

      &.item-port-output {
        right: -5px;
      }
    }
  }
</style>
