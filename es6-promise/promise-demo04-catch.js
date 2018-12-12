// .catch() 捕获错误

console.log('start')
new Promise(resolve => {
  setTimeout(() => {
    resolve()
  }, 1000)
})
  .then(() => {
    console.log('then 1111')
    throw new Error('test error')
  })
  .catch( err => {
    console.log('I catch: ' + err)
    // throw new Error('another error')
  })
  .then(() => {
    console.log('then 2222')
    // throw new Error('another error')
  })
  .then(() => {
    console.log('then 3333')
  })
  .catch( err => {
    console.log('End, I catch: ' + err)
  })

// 说明 catch 返回的也是 Promise 的实例，并且其中没有再抛出错错的话，那么此时 catch 返回的 Promise 实例也是 fullfilled 的状态，所以接下来的 then 会被继续执行
