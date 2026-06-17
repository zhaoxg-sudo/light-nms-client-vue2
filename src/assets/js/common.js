import Vue from 'vue'
import axios from 'axios'
let api = 'http://power.ieyeplus.com:7001/'
axios.defaults.baseURL = api

Vue.Api = api
Vue.prototype.$ajax = axios

// let $this;
// Vue.prototype.setThis = function (val) {
//     $this = val
// }

Vue.prototype.Api = Vue.Api

Vue.parseObj = function (obj) {
  if (obj === undefined || obj === null) {
    return ''
  }
  if (typeof obj === 'string') {
    return encodeURIComponent(obj)
  }
  if (typeof obj === 'object') {
    var paramStr = '?'
    for (var key in obj) {
      if (obj[key] == null) {
        continue
      }
      if (typeof obj[key] === 'string' && obj[key].length === 0) {
        continue
      }
      if (paramStr.length > 1) {
        paramStr += '&'
      }
      paramStr += key + '=' + encodeURIComponent(obj[key])
    }
    if (paramStr === '?') {
      return ''
    }
    return paramStr
  }
  return ''
}
Vue.sendRequest = function (route, typeName, action, parameter, callback, speedCallback = null, json = false) {
  var xhr = new XMLHttpRequest()
  if (speedCallback) {
    xhr.upload.onprogress = function (evt) {
      if (evt.lengthComputable) {
        var percentComplete = Math.round(evt.loaded * 100 / evt.total)
        speedCallback(percentComplete)
      } else {
        speedCallback(0)
      }
    }
  }
  xhr.onload = function () {
    let ret = JSON.parse(xhr.responseText)
    if (ret.code === '-1') {
      route.router.go({ path: '/login' })
    } else {
      if (ret.tocket && ret.tocket.length > 0) {
        window.localStorage.setItem('BASIC', ret.tocket)
      }
      callback(ret)
    }
  }
  xhr.onerror = function () {
    window.alert('调用失败')
  }
  xhr.open(typeName, Vue.Api + action, true)
  var basic = window.localStorage.getItem('BASIC')
  if (basic && basic.length > 0) {
    xhr.setRequestHeader('Authorization', basic)
  }
  if (json) {
    xhr.setRequestHeader('Content-type', 'application/json')
  }
  if (parameter) {
    xhr.send(parameter)
  } else {
    xhr.send()
  }
}
Vue.prototype.$AjaxPost = function (action, parameter, callback) {
  Vue.sendRequest(this.$route, 'POST', action, JSON.stringify(parameter), callback, null, true)
}
Vue.prototype.$AjaxGet = function (action, parameter, callback) {
  Vue.sendRequest(this.$route, 'GET', action + Vue.parseObj(parameter), null, callback)
}
Vue.prototype.$AjaxPut = function (action, parameter, callback) {
  Vue.sendRequest(this.$route, 'PUT', action, JSON.stringify(parameter), callback, null, true)
}
Vue.prototype.$AjaxDelete = function (action, parameter, callback) {
  Vue.sendRequest(this.$route, 'DELETE', action + Vue.parseObj(parameter), null, callback)
}
Vue.prototype.$AjaxAdd = function (action, parameter, fileList, callback, speedCallback = null) {
  var fd = new FormData()
  fd.append('record', JSON.stringify(parameter))
  if (fileList && fileList.length > 0) {
    for (let i in fileList) {
      fd.append('files', fileList[i])
    }
  }
  Vue.sendRequest(this.$route, 'POST', action, fd, callback, speedCallback)
}
Vue.prototype.$UpFile = function (action, file, callback, speedCallback = null) {
  var fd = new FormData()
  fd.append('file', file)
  Vue.sendRequest(this.$route, 'POST', action, fd, callback, speedCallback)
}
Vue.prototype.$UpFileList = function (action, fileList, callback, speedCallback = null) {
  var fd = new FormData()
  for (var i = 0, len = fileList.length; i < len; i++) {
    fd.append('file', fileList[i])
  }
  Vue.sendRequest(this.$route, 'POST', action, fd, callback, speedCallback)
}
Vue.prototype.$RemoveFile = function (parameter, callback) {
  var fd = new FormData()
  fd.append('file', parameter)
  Vue.sendRequest(this.$route, 'POST', 'File/Remove', fd, callback)
}

Vue.prototype.$Del = function (attr, val) {
  var Index = this.$Find(attr, val)
  if (Index !== -1) {
    attr.splice(Index, 1)
  }
}
Vue.prototype.$Find = function (attr, val) {
  let num = -1
  attr.forEach(function (value, index, array) {
    if (value === val) {
      num = index
      return num
    }
  })
  return num
}
Vue.prototype.$FindByValue = function (attr, val, attributeName) {
  let arrayFilter = attr.filter(function (item) {
    return item[attributeName] === val
  })
  return arrayFilter[0]
}

// 单个删除
/* 接收一个api 和 id 回调为true时刷新，反之不操作 */
Vue.prototype.deleteItems = (self, api, formData, updateState) => {
  self.$confirm('此操作将删除所选数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      self.$AjaxDelete(api + '/', formData.OrganizationID, function (data) {
        if (data.code !== 0) {
          self.$message.success('删除成功')
          if (!updateState) {
            self.$store.dispatch('update', 2)
          } else {
            self.$store.dispatch('update', updateState)
          }
        } else {
          self.$message.success('删除失败')
        }
      })
    })
}

// 批量删除
/* 接收一个api 和 所选 数据 的集合,以及所需循环id的名称 idName, 回调为true时刷新，反之不操作 */
Vue.prototype.batchDeletes = (self, api, idName, batchSelectArr, updateState) => {
  for (let i = 0, len = batchSelectArr.length; i < len; i++) {
    batchSelectArr[i] = batchSelectArr[i][idName]
  }
  self.$confirm('此操作将批量删除选择数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      self.$AjaxPost(api, { Ids: batchSelectArr, LoginId: self.$store.getters.LoginId }, function (data) {
        if (data.code !== 0) {
          self.$message.success('删除成功')
          if (!updateState) {
            self.$store.dispatch('update', 2)
          } else {
            self.$store.dispatch('update', updateState)
          }
        } else {
          self.$message.success('删除失败')
        }
      })
    })
}

// 编辑和新增
/* 接收一个self ,区分编辑还是新增的pid,两个不同的api，以及需要提交的数据formData */
Vue.prototype.submitForm = (self, pid, CreatedApi, EditApi, formData, updateState) => {
  formData.LoginId = self.$store.getters.LoginId
  console.log('formData=', formData)
  self.$refs.formData.validate((valid) => {
    if (valid) {
      if (pid === 0) {
        formData.userId = self.$makeId()
        self.$AjaxPost(CreatedApi, formData, function (data) {
          if (data.code !== 0) {
            self.$message.success('新增成功')
            if (!updateState) {
              self.$store.dispatch('update', 2)
            } else {
              self.$store.dispatch('update', updateState)
            }
          } else {
            self.$message.success('新增失败，用户名可能已存在')
          }
        })
      } else {
        self.$AjaxPut(EditApi, formData, function (data) {
          if (data.code !== 0) {
            self.$message.success('修改成功')
            if (!updateState) {
              self.$store.dispatch('update', 2)
            } else {
              self.$store.dispatch('update', updateState)
            }
          } else {
            self.$message.success('修改失败')
          }
        })
      }
    }
  })
}
Vue.prototype.$getBloodType = function () {
  return 'BloodType'
}
/**
 * 生成随机ID
 */
Vue.prototype.$makeId = function () {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
Vue.prototype.defenseSQL = function (name, val, callback) {
  let containSpecial = /select|update|delete|exec|count|'|"|=|;|>|<|%/i
  if (containSpecial.test(val)) {
    callback(new Error('输入的值不能含有特殊字符'))
  } else {
    callback()
  }
}
