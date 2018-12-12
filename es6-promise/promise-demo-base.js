// 最简单的实例

    new Promise(
      //  执行器 executor
      (resolve, reject) => {
        //  一段耗时很长的一步操作
        console.log(111)
        // if ()
        resolve('hello')  // 数据处理完成
        reject()  // 数据处理出错
      }
    ).then((res) => {
      console.log(res)
      // 成功，下一步
    }, () => {
      // 失败
    })

    /*
    1、Promise 是一个代理对象，它和原来要进行的操作并无关系。
    2、它通过引入一个回调，避免更多的回调
    3、Promise 状态发生改变，就会触发 .then() 里面的响应函数处理后续步骤
    4、Promise 状态一经改变，不会再变

    Promise 有3个状态：
    pending  【待定】初始状态
    fulfilled 【实现】操作成功
    rejected  【被否决】操作失败
    * */
