<script>
export default {
  mpType: 'app'
}
</script>
<style lang="less">
  body{
    background-color: #EDEDED;
    overflow: hidden auto;
  }
  div, span, label{
    font-family: "microsoft yahei"
  }
  span{
    font-weight: bold
  }
  uni-page, .btn-custom, .btn-pay-custom, .modal-box, .modal-pay-box, .order-content-btngroup{
    max-width: 540px;
  }
  uni-page {
    margin: 0 auto;
  }
  input{
    min-height: auto!important;
    height: 36px;
  }
  .section{
    margin: 2.5px 0;
  }
  .section-item{
    width: 100%;
    display: flex;
    align-items: stretch;
    background: #FFF;
    margin: 2px 0;
  }
  radio .uni-radio-input-checked,
  checkbox .uni-checkbox-input-checked{
    border-color: #D0021B !important;
    background: #D0021B !important;
  }
  checkbox .uni-checkbox-input,
  checkbox .uni-checkbox-input-checked{
    color: #FFF!important;
    border-radius: 50%;
  }
  switch .uni-switch-input-checked{
    border-color: #3cc51f !important;
    background: #3cc51f !important;
  }
  .arrow{
    position: relative;
    width: 14px;
    height: 14px;
  }
  .arrow:after, .arrow:before {
    border: 8px solid transparent;
    width: 0;
    height: 0;
    position: absolute;
    content: ' '
  }
  .arrow-top:after, .arrow-top:before {
    border-bottom: 8px solid #fff;
    top: -5px;
    left: 0;
  }

  .arrow-top:before {
    border-bottom-color: #858585;
    top: -7px;
  }
  .arrow-bottom:after, .arrow-bottom:before {
    border-top: 8px solid #fff;
    bottom: -5px;
    left: 0;
  }
  .arrow-bottom:before {
    border-top-color: #858585;
    bottom: -7px;
  }
  .arrow-right:after, .arrow-right:before {
    border-left: 8px solid #fff;
    top: 0;
    right: -5px;
  }
  .arrow-right:before {
    border-left-color: #858585;
    right: -7px;
  }
  .arrow-left:after, .arrow-left:before {
    border-right: 8px solid #fff;
    top: 0;
    left: -5px;
  }
  .arrow-left:before {
    border-right-color: #858585;
    left: -7px;
  }
  .btn-custom{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 72px;
    background-color: #8B572A!important;
    font-size: 20px;
  }
  .title{
    font-size: 16px;
    font-weight: bold
  }
  .price{
    font-weight: bold;
    font-size: 14px;
  }
  .price > span{
    margin-right: 8px
  }
  .price > span:nth-of-type(1){
    color: #8B572A !important;
  }
  .price > span:nth-of-type(2){
    color: #0B0B0A;
    font: lighter 14px 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }
  .price > span:nth-last-of-type(1){
    color: #0B0B0A;
  }
  .money-logo{
    color: #b1b1b1;
    margin-right: 5px;
    opacity: 0.8
  }
  .money-logo-line {
    color: #8B572A;
    font-size: 24px;
    font-weight: bold;
    font-family: "microsoft yahei";
    .money-logo-lg{
      margin-right: 6px;
      opacity: 0.5;
    }
    div {
      float:left
    }
  }
  .placeholder-text{
    opacity: 0.5;
    color: #9B9B9B;
  }
  .user-address{
    height: 90px;
    display: flex;
    flex-flow: row nowrap;
    background-color: #FFF;
    justify-content: space-around;
    align-items: center;
  }
  .icon-user-address{
    width:15px;
    height: 25px;
  }
  .user-adderss-info{
    width: 80%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }
  .user-adderss-info > div{
    font-size: 14px;
    padding: 12px 8px;
  }
  .user-adderss-info > div:nth-of-type(1){
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }
  .user-adderss-info > div:nth-of-type(2){
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .user-adderss-info-name > span{
    font-weight: normal;
    color: #D0021B;
  }
  .order-content,.order-footer,.order-price{
    display: flex;
    flex-flow: column nowrap;
    background-color: #FFF;
  }
  .order-price{
    margin: 6px 10px;
  }
  .order-price > div{
    display: flex;
    flex-flow: row nowrap;
    font-size: 14px;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
  }
  .order-price > div:last-of-type{
    justify-content: flex-end;
    font-size: 16px;
  }
  .order-content{
    padding-top: 22px;
  }
  .order-goods-list{
    background-color: #EDEDED;
  }
  .fa-icon{
    width: 18px;
    height: 18px;
  }
  .section-delete{
    margin-left: -48px;
  }
  .btn-delete{
    width: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #FFF;
    background-color: #D0021B;
    padding: 4px 10px;
    text-align:center;
    height: inherit;
    position: absolute;
    left: 100%;
  }

  /* 加载动画 */
  .wx-loading-toast{
    position: fixed;
    top: 50%;
    left: 50%;
    transform:translate(-50%,-50%);
    z-index:2000;
    width: 160px;
    height: 180px;
    background: #000;
    opacity: 0.6;
    border-radius: 10px;
    padding: 25px 0;
  }
  .wx-loading-cell{
    text-align: center;
  }
  .text-line{
    color: #bebebe;
    margin-top: 12px;
    font-size: 30px;
  }
  .circle-line{
    width: 100px;
    height: 100px;
    display: inline-block;
    position: relative;
  }
  .circle-line text{
    display: block;
    width: 50%;
    height: 7px;
    opacity: .7;
    position: absolute;
    top: calc(50% - 2.5px);
    left: 0px;
    transform-origin: center right;
    animation: circle 1.5s linear infinite;
  }
  .circle-line text::before{
    content: '';
    display: block;
    width: 21px;
    height: 7px;
    position: absolute;
    top: 0;
    right: 14px;
    background-color: #bebebe;
  }
  .circle-line text:nth-child(1){
    transform: rotate(0deg);
    animation-delay: 0.2s;
  }
  .circle-line text:nth-child(2){
    transform: rotate(45deg);
    animation-delay: 0.4s;
  }
  .circle-line text:nth-child(3){
    transform: rotate(90deg);
    animation-delay: 0.6s;
  }
  .circle-line text:nth-child(4){
    transform: rotate(135deg);
    animation-delay: 0.8s;
  }
  .circle-line text:nth-child(5){
    transform: rotate(180deg);
    animation-delay: 1s;
  }
  .circle-line text:nth-child(6){
    transform: rotate(225deg);
    animation-delay: 1.2s;
  }
  .circle-line text:nth-child(7){
    transform: rotate(270deg);
    animation-delay: 1.4s;
  }
  .circle-line text:nth-child(8){
    transform: rotate(315deg);
    animation-delay: 1.6s;
  }
  @keyframes circle {
    0%{
      opacity: 0.05;
    }
    100%{
      opacity: 0.9;
    }
  }

  .item-select{
    color: #D0021B !important;
    border: 1.5px solid #D0021B !important;
  }
  .text-select{
    color: #ff4500
  }

  .disable{
    color: #bebebe;
    opacity: 0.7;
  }
  .btn-single{
    display: flex;
    justify-content: center;
    align-items: center
  }
  .btn-single span{
    color: #FFF;
  }
  .btn-tab{
    bottom: 50px;
  }
  .pl-settings{
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    margin: 12px 5px 0 0;
  }
  .pl-settings-item{
    display: flex;
    background-color: #FFF;
    margin: 1.5px 0;
    justify-content: space-between;
    align-items: center;
    text-align: center;
  }
  .pl-settings-item > span{
    font-weight: normal;
    font-size: 14px
  }
  .settings-user-item{
    padding: 22px 12px;
  }
  .settings-system-item{
    padding: 18px 12px;
  }
  .btn-footer {
    margin-bottom: 50px!important;
  }
  .nomore {
    width: 100%;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: #989898;
    opacity: .5;
  }
</style>
