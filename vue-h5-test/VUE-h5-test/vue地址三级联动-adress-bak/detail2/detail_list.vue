<template>
  <div>
    <section class="refund-box" v-if="refundFlag">
      <h2 class="title">{{textObj[refundStep-1]['ptitle']}}</h2>
      <p class="txt">{{textObj[refundStep-1]['pintro']}}</p>
      <div class="progress-box">
        <steps :active="refundStep" direction="horizontal" align-center>
          <step :title="$t('step1_text')"></step>
          <step :title="$t('step2_text')"></step>
          <step :title="$t('step3_title')"></step>
        </steps>
      </div>
      <button class="btn" @click="refundCommit">{{textObj[refundStep-1]['btnText']}}</button>
    </section>

    <div class="list" v-for="(item, index) in detailList" @click="showRefund(index)">
      <!-- 首条点击事件只作为step1状态，用户点击后查看，已经展示了refund-box后首条不需要再有点击事件 v-if="!refundFlag && typeIndex===2 && index===0" -->
      <div class="details">
        <p class="title">{{item.itemType}} · {{item.statusCode}}</p>
        <p class="time">{{item.timestamp | dateFormat}}</p>
      </div>
       <ul>
        <li :class="{red: item.status !== '0'}">{{item.status !== '0' ? '-' : '+'}}{{item.amount}}</li>
        <li class="itemSource">{{item.itemSource}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import dateFormat from 'utils/date_format'
import steps from 'components/common/steps/steps'
import step from 'components/common/steps/step'
import request from 'utils/request'

export default {
  components: {
    steps,
    step
  },
  data () {
    return {
      // isFirst: true,
      refundFlag: false,
      refundInfo: {}, // 首条信息
      userAccount: {}, // refundUserAccount 在首条信息里面
      refundStep: 1,
      typeIdx: this.$props.typeIndex,
      accesstoken: 0,
      textObj: [
        {
          ptitle: this.$t('step1_title'),
          pintro: this.$t('step1_intro'),
          btnText: this.$t('step1_btn')
        },
        {
          ptitle: this.$t('step2_title'),
          pintro: this.$t('step2_intro'),
          btnText: this.$t('step2_btn')
        },
        {
          ptitle: this.$t('step3_title'),
          pintro: this.$t('step3_intro'),
          btnText: this.$t('step3_btn')
        }
      ]
    }
  },
  props: {
    detailList: {
      type: Array,
      required: true
    },
    typeIndex: {
      type: Number, // 0,1,2
      default: 0
    }
  },
  created () {
    this.accesstoken = window.pageData && window.pageData.accesstoken
  },
  methods: {
    showRefund (idx) {
      // needFillRefundUserAccount=true 可以点击展示进行信息填写
      // refundFlag===false && typeIndex===2 && index===0
      if (idx === 0 && this.typeIdx === 2 && !this.refundFlag) {
        this.refundInfo = this.$props.detailList[0]
        this.userAccount = this.refundInfo && this.refundInfo.refundUserAccount
        this.refundFlag = this.refundInfo && this.refundInfo.needFillRefundUserAccount
      }
    },
    refundCommit () {
      let orderid = this.refundInfo && this.refundInfo.orderId
      let id = this.userAccount.id
      if (this.refundStep === 1) {
        this.$router.push({path: '/write', query: {orderid: orderid}})
      } else if (this.refundStep === 2) {
        this.$router.push({path: '/detail', query: {orderid: orderid, id: id}})
      } else if (this.refundStep === 3) {
        // this.btnText = '我知道了'
        // 直接发送请求---已经查看，返回结果，隐藏refund-box
        request({
          url: '/api/refund/refundUserAccount/markRead.json',
          method: 'post',
          headers: {
            accesstoken: this.accesstoken
          },
          data: {
            'refundUserAccountId': id
          }
        }).then((res) => {
          this.refundFlag = false
        }).catch((res) => {
          console.log(res.message)
          this.$toast(this.$t('tip_error'))
        })
      }
    },
    initRefund (curVal, oldVal) {
      // 只处理押金明细类目
      if (this.typeIdx === 2 && curVal && curVal[0]) {
        let list0 = curVal[0]
        this.refundInfo = list0
        this.userAccount = list0 && list0.refundUserAccount
        // 第二步：后端给的条件status=4 && refundUserAccount不为null
        // 第三步：status=2 && refundUserAccount不为null && refundUserAccount.alreadyRead = false
        if (list0.status === '4' && this.userAccount) {
          this.refundFlag = true
          this.refundStep = 2
        } else if (list0.status === '2' && this.userAccount && !this.userAccount.alreadyRead) {
          this.refundFlag = true
          this.refundStep = 3
        }
      } else {
        this.refundFlag = false
      }
    }
  },
  watch: {
    detailList: 'initRefund'
  },
  filters: {
    dateFormat (value) {
      if (!value) return ''
      return dateFormat(value, 'yyyy-mm-dd HH:MM')
    }
  }
}
</script>

<style lang="less">
.refund-box{
  /* 重置step样式 */
  .mbk-step-title.is-finish, .mbk-step-title, .mbk-step-title.is-process, .mbk-step-title.is-wait{
    font-size: 24px; /*px*/
    color: #999BA1;
    margin-top: 32px;
    font-weight: normal;
  }
  .mbk-step-icon > div{
    font-size: 36px; /*px*/
    line-height: 72px;
  }
  .mbk-step-head{
    width: 72px;
    height: 72px;
  }
  .mbk-step-line.is-horizontal{
    top: 35px;
    left: 90px; 
    right: 10px;
    height: 4px; /*no*/
    // border: 2px solid #E5E7E9; /*no*/
  }
  .mbk-step-line-inner{
    border-width: 2px!important; /*no*/
    border-style: solid;
  }
  .mbk-step-main{
    margin-left: -10px!important;
  }
  .mbk-step-line{
    border-width: 2px; /*no*/
  }
  .mbk-step-head.is-text{
    border-width: 4px; /*no*/
  }
  .mbk-step-head.is-text.is-wait{
    color: #343D4A;
    background-color: #fff;
    border-color: #D7D9DB;
  }
  .mbk-step-head.is-text.is-process{
    color: #343D4A; 
    background-color: #fff; 
    border-color: #D7D9DB; 
  }
}
</style>
<style scoped lang="less">
@fcolor: #585C64;

.refund-box{
  padding: 40px;
  margin: 40px;
  color: @fcolor;
  font-size: 28px; /*px*/
  box-shadow: 0 12px 36px 0 rgba(25,29,33,0.16); 
  border-radius: 12px;
  font-family: PingFangSC-Regular;
  .title{
    font-family: PingFangSC-Semibold;
    margin-bottom: 16px;
    font-size: 28px; /*px*/
  }
  .txt{
    line-height: 36px;
  }
  .btn{
    background: #343D4A;
    border-radius: 12px;
    font-size: 28px; /*px*/
    width: 100%;
    height: 80px;
    line-height: 78px;
    color: #fff;
    border: none;
  }
  .progress-box{
    margin: 60px 0 60px 76px;
  }
}
.list {
  padding: 40px 40px 40px 0; /*px*/
  margin-left: 40px;
  box-sizing: border-box;
  border-bottom: 2px solid #F4F5F7; /*no*/
  
  .details {
    width: 70%;
  }
  ul {
    margin-left: 5%;
    width: 25%;
  }

  .details, ul {
    vertical-align: top;
    display: inline-block;
    font-size: 28px; /*px*/
    color: rgb(25, 29, 33);
  }

  .time, .itemSource {
    padding-top: 7px;
    font-size: 24px; /*px*/
    color: rgb(153, 155, 161);
  }

  ul {
    text-align: right;

    .red {
      color: rgb(255, 70, 17);
    }

    .black {
      color: rgb(88, 92, 100);
    }
  }
}
</style>
