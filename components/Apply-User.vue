<template>
  <!--景品の応募画面（ユーザ）-->
  <body class="mx-1">
    <b-container fluid>
      <b-row>
        <b-col class="d-flex align-items-center mb-1">
          <p style="font-size: 14px">
            現在の所持ポイントは、
          </p>
          <p class="mx-1" style="font-weight: bold">
            {{ stampsCount }}
          </p>
          <p style="font-size: 14px">
            ptです。
          </p>
        </b-col>
      </b-row>
      <p v-if="available === 'more'" style="font-size: 14px">
        ※同一景品に複数回応募が可能です。ただし、必要ptを所持している必要があります。
      </p>
      <p v-else style="font-size: 14px">
        ※どれかひとつの景品に1回応募可能です。
      </p>
      <b-row>
        <b-col>
          <h3 class="mb-3" v-if="loaded && Object.entries(tickets).length">
            電子チケットに交換する
          </h3>
        </b-col>
      </b-row>
      <b-row v-if="loaded && !Object.entries(prizes).length" class="d-flex mx-0">
        <b-col class="d-flex justify-content-center my-4">
          <h5>本イベントに景品はありません</h5>
        </b-col>
      </b-row>
      <b-row v-else-if="loaded && Object.entries(tickets).length" class="d-flex mx-0">
        <b-col v-for="prize in tickets" :key="prize.id" class="col-12 px-2">
          <div class="card my-2">
            <div class="p-3">
              <div class="d-flex">
                <h5 class="title">
                  {{ prize.name }}
                </h5>
              </div>
              <div>
                <p v-if="prize.type==='ticket'" style="font-size: 14px; color: dimgrey">
                  その場で引き換えて使用できる電子チケットです
                </p>
                <p v-else-if="prize.type==='form'" style="font-size: 14px; color: dimgrey">
                  応募すると抽選で景品が当たります
                </p>
              </div>
              <div class="d-flex align-items-center" style="font-size: 14px; color: dimgrey">
                <p>必要なポイント</p>
                <p class="mx-1" style="font-size: 16px">
                  {{ prize.required }}
                </p>
                <p>pt</p>
                <div class="d-flex ml-auto">
                  <b-button v-if="applyLoading" variant="primary" size="sm" class="px-3" style="border-radius: 6px">
                    <b-spinner class="text-center" style="width: 14px; height: 14px" />
                  </b-button>
                  <b-button
                    v-else-if="checkRequire(prize.required)"
                    variant="primary"
                    size="sm"
                    class="px-3"
                    style="border-radius: 6px"
                    block
                    @click="showTicketorForm(prize.id, prize.type)"
                  >
                    表示
                  </b-button>
                  <b-button v-else disabled size="sm" style="border-radius: 6px" block>
                    表示
                  </b-button>
                  <b-button variant="outline-primary" size="sm" class="mx-2" style="border-radius: 6px; white-space: nowrap" @click="showDetail(prize.id)">詳細</b-button>
                </div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <hr v-if="loaded && Object.entries(forms).length">
      <b-row>
        <b-col>
          <h3 v-if="loaded && Object.entries(forms).length" class="mb-3">
            景品に応募する
          </h3>
        </b-col>
      </b-row>
      <b-row v-if="loaded && Object.entries(forms).length" class="d-flex mx-0">
        <b-col v-for="prize in forms" :key="prize.id" class="col-12 px-2">
          <div class="card my-2">
            <div class="p-3">
              <div class="d-flex">
                <h5 class="title">
                  {{ prize.name }}
                </h5>
              </div>
              <div>
                <p v-if="prize.type==='ticket'" style="font-size: 14px; color: dimgrey">
                  その場で引き換えて使用できる電子チケットです
                </p>
                <p v-else-if="prize.type==='form'" style="font-size: 14px; color: dimgrey">
                  応募すると抽選で景品が当たります
                </p>
              </div>
              <div class="d-flex align-items-center" style="font-size: 14px; color: dimgrey">
                <p>必要なポイント</p>
                <p class="mx-1" style="font-size: 16px">
                  {{ prize.required }}
                </p>
                <p>pt</p>
                <div class="d-flex ml-auto">
                  <b-button v-if="applyLoading" variant="primary" size="sm" class="px-3" style="border-radius: 6px">
                    <b-spinner class="text-center" style="width: 14px; height: 14px" />
                  </b-button>
                  <b-button
                    v-else-if="checkRequire(prize.required)"
                    variant="primary"
                    size="sm"
                    class="px-3"
                    style="border-radius: 6px"
                    block
                    @click="showTicketorForm(prize.id, prize.type)"
                  >
                    表示
                  </b-button>
                  <b-button v-else disabled size="sm" style="border-radius: 6px" block>
                    表示
                  </b-button>
                  <b-button variant="outline-primary" size="sm" class="mx-2" style="border-radius: 6px; white-space: nowrap" @click="showDetail(prize.id)">詳細</b-button>
                </div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <!--景品の詳細のポップアップ-->
    <b-modal id="detail" size="sm" centered hide-footer hide-header>
      <div class="p-2" style="color: #333333">
        <h5 class="my-2" style="font-weight: bold">
          {{ detail.name }}
        </h5>
        <div v-for="(img, index) in detail.image" :key="index">
          <b-img-lazy v-if="index===page" :src="img" style="width: 100%" />
        </div>
        <div v-if="imgLength !== 0" class="d-flex align-items-center justify-content-center" style="margin: 20px">
          <div class="mr-auto ml-3">
            <fa v-if="page !== 0" :icon="faArrowLeft" @click="page--">←</fa>
          </div>
          <div style="position: absolute">画像{{ page + 1 }} / {{ imgLength }}</div>
          <div class="ml-auto mr-3">
            <fa v-if="page + 1 !== imgLength" :icon="faArrowRight" @click="page++">→</fa>
          </div>
        </div>
        <p v-for="text in detail.text" :key="text.index" class="my-1">
          {{ text }}
        </p>
        <div class="mt-3 d-flex justify-content-center">
          <b-button variant="outline-primary" size="sm" @click="$bvModal.hide('detail')">
            閉じる
          </b-button>
        </div>
      </div>
    </b-modal>
    <!--応募確認のポップアップ-->
    <b-modal id="applyConfirm" centered hide-header hide-footer>
      <div class="py-2" style="font-family: 'Noto Sans JP', sans-serif !important; color: #333333">
        <div class="text-center my-1">
          <div v-if="targetType==='form'">
            <h5>
              この内容で応募しますか？
            </h5>
            <div class="mx-2 my-3 text-left" style="font-size: 12px;">
              <div class="d-flex">
                <p>氏名：</p>
                <p>{{ apply.userName }}</p>
              </div>
              <div class="d-flex">
                <p class="d-flex align-items-start">住所：</p>
                <div>
                  <p>{{ apply.address[0] + apply.address[1] }}</p>
                  <p>{{ apply.zip[0] + apply.zip[1] }}</p>
                </div>
              </div>
              <div class="d-flex">
                <p>電話番号：</p>
                <p>{{ apply.phone[0] + apply.phone[1] + apply.phone[2] }}</p>
              </div>
              <div class="d-flex">
                <p>メールアドレス：</p>
                <p>{{ apply.mail }}</p>
              </div>
              <div class="d-flex">
                <p>応募景品：</p>
                <p>{{ prizes[targetId].name }}</p>
              </div>
            </div>
          </div>
          <h5 v-else-if="targetType==='ticket'">
            使用済みにしますか？
          </h5>
          <p v-if="targetType === 'form' && checkEmpty()" class="my-1" style="font-size: 14px; color: #e14e53">
            未入力の部分があります
          </p>
          <p v-else class="my-1" style="font-size: 14px; color: #e14e53">
            この操作は取り消せません
          </p>
        </div>
        <div v-if="targetType === 'form' && checkEmpty()" class="mt-3 d-flex justify-content-center">
          <b-button variant="primary" class="mx-2" @click="closeModal">
            戻る
          </b-button>
        </div>
        <div v-else class="mt-3 d-flex justify-content-center">
          <b-button variant="primary" class="mx-2" @click="doApply(targetId)">
            はい
          </b-button>
          <b-button variant="outline-primary" class="mx-2" @click="closeModal">
            いいえ
          </b-button>
        </div>
      </div>
    </b-modal>
    <!--電子チケット使用画面のポップアップ-->
    <b-modal
      v-if="available === 'more'"
      id="useTicket"
      size="sm"
      centered
      hide-footer
      hide-header
      no-close-on-backdrop
      no-close-on-esc
    >
      <div>
        <b-button
          class="closebtn mt-1 mr-2"
          @click="closeApply()"
        >
          <fa :icon="faTimes" />
        </b-button>
      </div>
      <div class="py-1" style="font-family: 'Noto Sans JP', sans-serif !important; color: #333333">
        <div class="text-center my-2">
          <h4>{{ ticket.name }}</h4>
        </div>
        <div class="mx-2 my-1 d-flex justify-content-center">
          <b-img-lazy v-if="ticket.image && ticket.image.length" :src="ticket.image[0]" style="width: 100%; border-radius: 5px;" />
        </div>
        <div class="my-1 mx-2">
          <p style="font-size: 16px">この画面を店員またはスタッフに提示して下さい。</p>
        </div>
        <div class="d-flex justify-content-center my-1">
          <h2 style="text-align: justify; font-weight: bold">{{ clock.hour }} : {{ clock.min }} : {{ clock.sec }}</h2>
        </div>
        <div class="mt-3 mx-2 d-flex justify-content-center">
          <!--<b-button size="lg" variant="primary" block @click="$bvModal.show('applyConfirm')">使用する</b-button>-->
          <b-button v-if="checkRequiredStamp()" disabled size="lg" block>必須のスタンプを取得していません</b-button>
          <b-button v-else size="lg" variant="primary" block @click="$bvModal.show('applyConfirm')">使用する</b-button>
        </div>
      </div>
    </b-modal>
    <b-modal
      v-else
      id="useTicket"
      size="sm"
      centered
      hide-footer
      hide-header
      no-close-on-backdrop
      no-close-on-esc
    >
      <div>
        <b-button
          class="closebtn mt-1 mr-2"
          @click="closeApply()"
        >
          <fa :icon="faTimes" />
        </b-button>
      </div>
      <div class="py-1" style="font-family: 'Noto Sans JP', sans-serif !important; color: #333333">
        <div class="text-center my-2">
          <h4>{{ ticket.name }}</h4>
        </div>
        <div class="mx-2 my-1 d-flex justify-content-center">
          <b-img-lazy v-if="ticket.image && ticket.image.length" :src="ticket.image[0]" style="width: 100%; border-radius: 5px;" />
        </div>
        <div class="my-1 mx-2">
          <p style="font-size: 16px">この画面を店員またはスタッフに提示して下さい。</p>
        </div>
        <div class="d-flex justify-content-center my-1">
          <h2 style="text-align: justify; font-weight: bold">{{ clock.hour }} : {{ clock.min }} : {{ clock.sec }}</h2>
        </div>
        <div class="mt-3 mx-2 d-flex justify-content-center">
          <b-button v-if="checkApplied(targetId)" disabled size="lg" block>使用済み</b-button>
          <b-button v-else size="lg" variant="primary" block @click="$bvModal.show('applyConfirm')">使用する</b-button>
        </div>
      </div>
    </b-modal>
    <!--応募のいろいろ入力画面のポップアップ-->
    <b-modal
      v-if="available === 'more'"
      id="applyForm"
      size="sm"
      centered
      hide-footer
      hide-header
      no-close-on-backdrop
    >
      <div>
        <b-button
          class="closebtn mt-1 mr-2"
          @click="closeApply()"
        >
          <fa :icon="faTimes" />
        </b-button>
      </div>
      <div class="py-1" style="font-family: 'Noto Sans JP', sans-serif !important; color: #333333">
        <div class="text-center my-2">
          <h4>景品に応募</h4>
        </div>
        <div class="px-1" style="height: 420px; overflow-y: scroll; overflow-x: hidden">
          <b-row>
            <b-col class="d-flex mt-3">
              <p style="color: red">*</p><p>は必須項目です</p>
            </b-col>
          </b-row>
          <b-row class="align-items-center mt-3">
            <b-col class="col-12">
              <div class="d-flex">
                <h6>氏名</h6>
                <p style="color: red">&nbsp;*</p>
              </div>
              <b-form-input v-model="apply.userName" class="col-8" style="font-size: 14px" placeholder="例）山田 太郎" />
            </b-col>
          </b-row>
          <b-row class="align-items-center mt-4">
            <b-col class="col-12">
              <div class="d-flex">
                <h6>住所</h6>
                <p style="color: red">&nbsp;*</p>
              </div>
              <div>
                <h6 style="font-size: 14px">
                  （半角）
                </h6>
              </div>
              <div class="d-flex align-items-center">
                <p class="m-2" style="font-size: 14px">
                  〒
                </p>
                <b-form-input v-model="apply.zip[0]" style="font-size: 14px" class="col-2" />
                <p class="m-1" style="font-size: 14px">
                  －
                </p>
                <b-form-input v-model="apply.zip[1]" style="font-size: 14px" class="col-3" />
              </div>
              <b-form-input v-model="apply.address[0]" style="font-size: 14px" class="my-2 col-12" placeholder="例）佐賀県佐賀市○○" />
              <b-form-input v-model="apply.address[1]" style="font-size: 14px" class="my-2 col-12" placeholder="例）○○マンション〇号室" />
            </b-col>
          </b-row>
          <b-row class="align-items-center mt-4">
            <b-col class="col-12">
              <div class="d-flex">
                <h6>電話番号</h6>
                <p style="color: red">&nbsp;*</p>
              </div>
              <div>
                <h6 style="font-size: 14px">
                  （半角）
                </h6>
              </div>
              <div class="d-flex align-items-center">
                <b-form-input v-model="apply.phone[0]" style="font-size: 14px" class="col-3" />
                <p class="m-1" style="font-size: 14px">
                  －
                </p>
                <b-form-input v-model="apply.phone[1]" style="font-size: 14px" class="col-3" />
                <p class="m-1" style="font-size: 14px">
                  －
                </p>
                <b-form-input v-model="apply.phone[2]" style="font-size: 14px" class="col-3" />
              </div>
            </b-col>
          </b-row>
          <b-row class="align-items-center mt-4">
            <b-col class="col-12">
              <h6>メールアドレス</h6>
              <b-form-input v-model="apply.mail" class="my-2 col-12" style="font-size: 14px" />
            </b-col>
          </b-row>
        </div>
        <div class="mt-3 mx-2 d-flex justify-content-center">
          <b-button v-if="checkRequiredStamp()" disabled size="lg" block>必須のスタンプを取得していません</b-button>
          <b-button v-else size="lg" variant="primary" block @click="$bvModal.show('applyConfirm')">応募する</b-button>
        </div>
      </div>
    </b-modal>
    <b-modal
      v-else
      id="applyForm"
      size="sm"
      centered
      hide-footer
      hide-header
      no-close-on-backdrop
    >
      <div>
        <b-button
          class="closebtn mt-1 mr-2"
          @click="closeApply()"
        >
          <fa :icon="faTimes" />
        </b-button>
      </div>
      <div class="py-1" style="font-family: 'Noto Sans JP', sans-serif !important; color: #333333">
        <div class="text-center my-2">
          <h4>景品に応募</h4>
        </div>
        <div class="px-1" style="height: 420px; overflow-y: scroll; overflow-x: hidden">
          <b-row>
            <b-col class="d-flex mt-3">
              <p style="color: red">*</p><p>は必須項目です</p>
            </b-col>
          </b-row>
          <b-row class="align-items-center mt-3">
            <b-col class="col-12">
              <div class="d-flex">
                <h6>氏名</h6>
                <p style="color: red">&nbsp;*</p>
              </div>
              <b-form-input v-model="apply.userName" class="col-8" style="font-size: 14px" placeholder="例）山田 太郎" />
            </b-col>
          </b-row>
          <b-row class="align-items-center mt-4">
            <b-col class="col-12">
              <div class="d-flex">
                <h6>住所</h6>
                <p style="color: red">&nbsp;*</p>
              </div>
              <div>
                <h6 style="font-size: 14px">
                  （半角）
                </h6>
              </div>
              <div class="d-flex align-items-center">
                <p class="m-2" style="font-size: 14px">
                  〒
                </p>
                <b-form-input v-model="apply.zip[0]" style="font-size: 14px" class="col-2" />
                <p class="m-1" style="font-size: 14px">
                  －
                </p>
                <b-form-input v-model="apply.zip[1]" style="font-size: 14px" class="col-3" />
              </div>
              <b-form-input v-model="apply.address[0]" style="font-size: 14px" class="my-2 col-12" placeholder="例）佐賀県佐賀市○○" />
              <b-form-input v-model="apply.address[1]" style="font-size: 14px" class="my-2 col-12" placeholder="例）○○マンション〇号室" />
            </b-col>
          </b-row>
          <b-row class="align-items-center mt-4">
            <b-col class="col-12">
              <div class="d-flex">
                <h6>電話番号</h6>
                <p style="color: red">&nbsp;*</p>
              </div>
              <div>
                <h6 style="font-size: 14px">
                  （半角）
                </h6>
              </div>
              <div class="d-flex align-items-center">
                <b-form-input v-model="apply.phone[0]" style="font-size: 14px" class="col-3" />
                <p class="m-1" style="font-size: 14px">
                  －
                </p>
                <b-form-input v-model="apply.phone[1]" style="font-size: 14px" class="col-3" />
                <p class="m-1" style="font-size: 14px">
                  －
                </p>
                <b-form-input v-model="apply.phone[2]" style="font-size: 14px" class="col-3" />
              </div>
            </b-col>
          </b-row>
          <b-row class="align-items-center mt-4">
            <b-col class="col-12">
              <h6>メールアドレス</h6>
              <b-form-input v-model="apply.mail" class="my-2 col-12" style="font-size: 14px" />
            </b-col>
          </b-row>
        </div>
        <div class="mt-3 mx-2 d-flex justify-content-center">
          <b-button v-if="checkApplied(targetId)" disabled size="lg" block>応募済み</b-button>
          <b-button v-else size="lg" variant="primary" block @click="$bvModal.show('applyConfirm')">応募する</b-button>
        </div>
      </div>
    </b-modal>
  </body>
</template>

<script>
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import { faTimes, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { firestore } from '~/plugin/firebase'
import Firestore from '~/plugin/firestore'

export default {
  name: 'ApplyUser',
  data () {
    return {
      prizes: {},
      userInfo: this.$store.getters.userInfo,
      stampInfo: this.$store.getters.stampInfo.stamps,
      stampsCount: 0,
      loaded: false,
      detail: {},
      imgLength: 0,
      page: 0,
      ticket: {},
      form: {},
      tickets: {},
      forms: {},
      clock: {
        hour: '',
        min: '',
        sec: ''
      },
      displayClock: '',
      targetId: null,
      targetType: null,
      required: null,
      available: this.$store.getters.currentStamprally.prize,
      applyLoading: false,
      apply: {
        userName: '',
        date: null,
        zip: ['', ''],
        address: ['', ''],
        phone: ['', '', ''],
        mail: '',
        prizeId: null,
        prizeName: '',
        userId: null,
        stamprallyId: this.$store.getters.currentStamprally.id
      }
    }
  },
  computed: {
    faQuestionCircle () {
      return faQuestionCircle
    },
    faArrowRight () {
      return faArrowRight
    },
    faArrowLeft () {
      return faArrowLeft
    },
    faTimes () {
      return faTimes
    }
  },
  async created () {
    // Firestoreから景品情報の取得
    this.loaded = false
    const _this = this
    await firestore
      .collection('prizes')
      .where('stamprallyId', '==', this.$route.params.id)
      .orderBy('required', 'desc')
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.prizes, doc.data().id, doc.data())
        })
        _this.categorizePrizes()
      })
    await this.ownedStampCheck()
    this.loaded = true
  },
  methods: {
    checkRequire (num) {
      // スタンプ所持数が必要個数より多いかチェック
      return this.stampsCount >= num
    },
    checkApplied (id) {
      // すでに応募済みかチェック
      let status = false
      if (this.userInfo.applied.length) {
        status = true
      }
      return status
    },
    checkRequiredStamp () {
      let status = true
      if (this.userInfo.ownedStamps) {
        if (this.userInfo.ownedStamps.some(element => element.id === 'W5V1t2mhvD4mugKm88xk')) {
          status = false
        }
      }
      return status
    },
    checkEmpty () {
      let status = false
      if (this.apply.userName === '' || this.apply.zip[0] === '' || this.apply.zip[1] === '' || this.apply.address[0] === '' || this.apply.phone[0] === '' || this.apply.phone[1] === '' || this.apply.phone[2] === '') {
        status = true
      }
      return status
    },
    showDetail (id) {
      // 景品詳細の表示
      this.detail = this.prizes[id]
      this.page = 0
      if (this.detail.image) {
        this.imgLength = this.detail.image.length
      } else {
        this.imgLength = 0
      }
      this.$bvModal.show('detail')
    },
    showTicketorForm (id, type) {
      // チケットまたは応募画面を表示
      this.targetId = id
      this.targetType = type
      this.required = this.prizes[id].required
      if (type === 'ticket') {
        this.ticket = this.prizes[id]
        this.displayClock = setInterval(() => this.showClock1(), 1000)
        this.$bvModal.show('useTicket')
      } else if (type === 'form') {
        this.form = this.prizes[id]
        this.$bvModal.show('applyForm')
      }
    },
    showClock1 () {
      // チケット使用時のリアルタイム時間表示（スクショ対策）
      const time = new Date()
      this.clock.hour = this.showClock2(time.getHours())
      this.clock.min = this.showClock2(time.getMinutes())
      this.clock.sec = this.showClock2(time.getSeconds())
    },
    showClock2 (num) {
      // 一桁の数字に0をつけたい
      if (num < 10) { return '0' + num } else { return num }
    },
    closeApply () {
      // チケットまたは応募画面を閉じる
      if (this.targetType === 'ticket') {
        clearInterval(this.displayClock)
        this.$bvModal.hide('useTicket')
      } else if (this.targetType === 'form') {
        this.$bvModal.hide('applyForm')
      }
      this.targetId = null
      this.targetType = null
      this.required = null
    },
    ownedStampCheck () {
      // 所持スタンプのチェック
      let count = 0
      const stamps = Object.entries(this.stampInfo)
      if (stamps.length) {
        for (let i = 0; i < this.userInfo.ownedStamps.length; i++) {
          if (stamps.some(element => element[1].id === this.userInfo.ownedStamps[i].id)) {
            count++
          }
        }
      }
      this.stampsCount = count
      if (this.userInfo.points) {
        this.stampsCount = this.userInfo.points
      }
    },
    openModal (id, type) {
      // ポップアップの表示
      this.targetId = id
      this.targetType = type
      this.$bvModal.show('applyConfirm')
    },
    closeModal () {
      // ポップアップの非表示
      this.$bvModal.hide('applyConfirm')
    },
    async doApply (id) {
      // 応募の実行
      this.applyLoading = true
      this.$bvModal.hide('applyConfirm')
      this.apply.date = new Date()
      this.apply.prizeId = id
      this.apply.prizeName = this.prizes[id].name
      this.apply.userId = this.userInfo.uid
      const point = this.prizes[id].required
      await Firestore.applyPrize(this.apply, this.targetType, point, this.userInfo)
      if (this.targetType === 'ticket') {
        this.$bvToast.toast('チケットを使用しました。', {
          variant: 'info'
        })
      } else {
        this.$bvToast.toast('応募が完了しました。', {
          variant: 'info'
        })
      }
      this.targetId = null
      this.targetType = null
      this.applyLoading = false
    },
    categorizePrizes () {
      const prizes = Object.entries(this.prizes)
      for (let i = 0; i < prizes.length; i++) {
        if (prizes[i][1].type === 'ticket') {
          this.$set(this.tickets, prizes[i][1].id, this.prizes[prizes[i][1].id])
        } else {
          this.$set(this.forms, prizes[i][1].id, this.prizes[prizes[i][1].id])
        }
      }
    }
  }
}
</script>

<style scoped>
body {
  font-family: 'Noto Sans JP', sans-serif;
  padding-top: 75px;
  margin-bottom: 180px;
  color: #333333
}
#detail {
  font-family: 'Noto Sans JP', sans-serif !important;
}
#applyConfirm {
  font-family: 'Noto Sans JP', sans-serif !important;
}
#useTicket {
  font-family: 'Noto Sans JP', sans-serif !important;
}
.card {
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
  border-radius: 10px;
  border: none;
  background-color: #fafafa;
}
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.closebtn {
  position: absolute;
  right: 12px;
  top: -1px;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  font-size: 24px;
  color: #696969;
  background-color: transparent;
  padding: 0 0;
  border: none;
  cursor: pointer;
  outline: none;
}
</style>
