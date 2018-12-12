// .then() 里有 .then() 的情况
/*
1、因为 .then() 返回的还是 Promise 实例
2、会等里面的 .then() 执行完毕，再执行外面的（此时，最好将其展开，会更好读）
 */
console.log('start')
new Promise(resolve => {
  console.log('step 1')
  setTimeout(() => {
    resolve(100)
  }, 1000)
}).then((value) => {
  return new Promise(resolve => {
    console.log(value + ' step 1-1')
    setTimeout(() => {
      resolve(110)
    }, 1000)
  })
    .then(value => {
      console.log(value + ' step 1-2')
      return value
    })
    .then(value => {
      console.log(value + ' step 1-3')
      return value
    })
})
  // .then(value => {
  //   console.log(value + ' step 1-2')
  //   return value
  // })
  // .then(value => {
  //   console.log(value + ' step 1-3')
  //   return value
  // })
  .then(value => {
    console.log(value)
    console.log('step2 end!')
  })
