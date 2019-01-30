// 三、假如一个Promise已经完成了，再 .then() 会怎样？
console.log('start')
let p = new Promise(resolve => {
  setTimeout(() => {
    console.log('the promise fulfilled')
    resolve('hello, world!')
  }, 1000)
})

setTimeout(() => {
  p.then(value => {
    console.log(value + ' over')
  })
}, 3000)



// 在任何地方生成了一个 Promise -- 队列后，作为变量传递到其他地方，则可以在后面最加操作，遵循先进先出的原则
