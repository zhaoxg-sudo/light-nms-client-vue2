<style scoped>
/* 🔥 核心：全屏覆盖整个浏览器，覆盖后台菜单 */
.screen-page {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  background: #0b1229;
  color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 顶部：标题真正居中 */
.top-bar {
  width: 100%;
  height: 60px;
  background: linear-gradient(to right, #031c3e, #062a5c);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-bottom: 1px solid #00ffff;
  position: relative;
  flex-shrink: 0;
}
/* 左边固定定位，不挤标题 */
.top-left {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
}
/* 右边固定定位，不挤标题 */
.top-right {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
}
.select {
  background: #0b2a5a;
  color: #fff;
  border: 1px solid #00ffff;
  padding: 4px 8px;
}
.btn {
  background: #00ffff;
  color: #000;
  border: none;
  padding: 4px 10px;
  cursor: pointer;
}
.top-title {
  font-size: 26px;
  color: #00ffff;
  font-weight: bold;
  z-index: 10;
}
.time {
  color: #00ffff;
  margin-left: 10px;
  font-size: 14px;
}

/* 内容区域：自动占满剩余高度，全屏无滚动 */
.content {
  flex: 1;
  display: flex;
  padding: 15px 20px;
  gap: 15px;
  box-sizing: border-box;
  overflow: hidden;
}
.left-box {
  width: 24%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.center-box {
  flex: 1;
}
.right-box {
  width: 22%;
}

/* 面板 */
.panel {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
}
.m-top {
  margin-top: 0;
}
.panel-title {
  text-align: center;
  color: #00ffff;
  font-size: 16px;
  margin-bottom: 15px;
}

/* 统计项 */
.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed rgba(0,255,255,0.3);
}
.stat-item:last-child {
  border-bottom: none;
}
.stat-item .label {
  color: #fff;
  font-size: 14px;
}
.stat-item .num {
  font-size: 22px;
  color: #00ffff;
  font-weight: bold;
}
.stat-item .unit {
  color: #00ffff;
  font-size: 13px;
}

/* 日期 */
.date-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.input-month {
  background: #0b2a5a;
  color: #fff;
  border: 1px solid #00ffff;
  padding: 3px 6px;
}
.chart-title {
  color: #ff9500;
  font-size: 14px;
  margin-bottom: 8px;
}

/* 地图 */
.map-panel {
  height: 100%;
}
.map-box {
  width: 100%;
  height: calc(100% - 40px);
  background: #000;
}

/* 设备列表 */
.search-input {
  width: 100%;
  background: #0b2a5a;
  color: #fff;
  border: 1px solid #00ffff;
  padding: 6px;
  margin-bottom: 12px;
  box-sizing: border-box;
}
.device-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.device-table th,
.device-table td {
  border: 1px solid #00ffff;
  padding: 8px;
  text-align: center;
}
.device-table th {
  background: #023a70;
  color: #00ffff;
}
.offline {
  color: #ff2a2a;
  font-weight: bold;
}
</style>