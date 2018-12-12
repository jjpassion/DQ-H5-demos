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
        console.log(22222)
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

// 如果在then 里面不直接返回一个 Promise 实例，则会默认执行下一个环节，即使在里面返回了false，也不影响下一步
// 一个小问题：大家可以猜一下，如果不返回，false，会发生什么？
// 因为默认返回的 undefined， 不影响 Promise 的继续执行
/* 所以：
.then
1、状态相应函数可以返回新的 Promise， 或其他值
2、如果返回新的 Promise，那么下一级 .then() 会在新的 Promise 状态改变之后执行
3、如果返回其他任何值，则会立刻执行下一级 .then
 */
