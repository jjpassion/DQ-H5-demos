// 假如一个Promise .then() 的函数里面不返回新的 Promise，会怎样？
console.log('start')
let p = new Promise(resolve => {
  setTimeout(() => {
    resolve('hello')
  }, 2000)
}).then((res) => {
    console.log(res)
    console.log('world');

    (function () {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Mr.AAAA')
          resolve('Miss.BBBB')
        }, 2000)
      })
    }())

    return false
  })
  .then(value => {
    console.log( value + ' over')
  })


// 在任何地方生成了一个 Promise -- 队列后，作为变量传递到其他地方，则可以在后面最加操作，遵循先进先出的原则
