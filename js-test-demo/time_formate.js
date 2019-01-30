/*
 *   格式       描述
 *   --------   ---------------------------------------------------------------
 *   yy         年份后两位，如2018取后两位是18。
 *   yyyy       年份四位。
 *   m          月份，取值1 ~ 12。
 *   mm         月份，取值01 ~ 12，如果月份为个位数，前面补0。
 *   d          日期在月中的第几天，取值1~31。
 *   dd         日期在月中的第几天，取值01~31，如果天数为个位数，前面补0。
 *   H          24小时进制，取值0~23。
 *   HH         24小时进制，取值00~23，如果小时为个位数，前面补0。
 *   h          12小时进制，取值0~11。
 *   hh         12小时进制，取值00~11，如果小时为个位数，前面补0。
 *   M          分钟，取值0~59。
 *   MM         分钟，取值00~59，如果为个位数，前面补0。
 *   s          秒，取值0~59。
 *   ss         秒，取值00~59，如果为个位数，前面补0。
 *   S          毫秒，取值0~999。
 *   SS         毫秒，取值000~999，如果不足三位数，前面补0。
 *   --------   ---------------------------------------------------------------
 */

Date.prototype.Format = function (fmt) {
  // yyyy-MM-dd
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  }
  // 加括号的目的？
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))

  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))

  return fmt
}

// 调用
var time1 = new Date('2018/02/01').Format("yy-MM-dd");
var time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");

console.log(time1)
console.log(time2)


var str = "X98Y87Z65";
// 三个数字部分加了小括号，表示子表达式
var reg = /^X(\d+)Y(\d+)Z(\d+)$/;
reg.test(str); // 此处使用exec()等其他正则表达式的匹配方法也可，下同
console.log(RegExp.$1); // 98
console.log(RegExp.$2); // 87
console.log(RegExp.$3); // 65
