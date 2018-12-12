// 分两步、顺序依次执行范例
console.log('start')
new Promise(resolve => {
  setTimeout(() => {
    resolve('hello')
  }, 2000)
})
  .then(value => {
    console.log(value)
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('world')
      }, 2000)
    })
  })
  .then(value => {
    console.log(value + ' over')
  })

