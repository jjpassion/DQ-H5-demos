console.log('start')
new Promise(resolve => {
  resolve('hello2')
  for (let i = 0; i < 10; i++) {
    console.log(i)
  }
  resolve('hello3')
  setTimeout(() => {
    console.log('setTimeout')
    resolve('hello')
  }, 2000)
})
  .then(value => {
    console.log(value)
  })
