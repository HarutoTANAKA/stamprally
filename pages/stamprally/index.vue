<template>
  <!--ホーム画面（ユーザ）-->
  <div id="app" style="max-width: 800px; margin: 0 auto">
    <Navbar v-if="loaded" />
    <body class="mx-1" style="color: #333333">
      <b-container fluid>
        <div class="d-flex justify-content-between">
          <h6 v-if="Object.entries(userInfo).length">
            参加中のスタンプラリー
          </h6>
          <b-button v-if="filtered === false" variant="outline-primary" size="sm" style="font-size: 12px; margin-bottom: 5px" @click="filterStamprally">近くのイベントを探す</b-button>
          <b-button v-else variant="outline-primary" size="sm" style="font-size: 12px; margin-bottom: 5px" @click="checkTime">全てのイベントを表示</b-button>
        </div>
        <b-row v-if="Object.entries(userInfo).length" class="px-2 pb-4 mb-3" style="width: 98vw; overflow-x: scroll">
          <div class="d-flex">
            <div v-for="stamprally in joinedStamprally" :key="stamprally.id" class="card mx-2" @click="goStamprally(stamprally[1].id)">
              <b-img-lazy v-if="stamprally[1].logo" :src="stamprally[1].logo" class="cardImg" />
              <div class="overlay d-flex justify-content-center align-items-end p-1">
                <p style="font-size: 14px; color: #fafafa">
                  {{ stamprally[1].name }}
                </p>
              </div>
            </div>
          </div>
        </b-row>
        <h6>開催中のスタンプラリー</h6>
        <b-row v-if="Object.entries(running).length" class="px-2 pb-4 mb-3" style="width: 98vw; overflow-x: scroll">
          <div class="d-flex">
            <div v-for="stamprally in running" :key="stamprally.id" class="card mx-2" @click="goStamprally(stamprally.id)">
              <b-img-lazy v-if="stamprally.logo" :src="stamprally.logo" class="cardImg" />
              <div v-else class="cardImg" :style="{backgroundColor: stamprally[1].subColor}" />
              <div class="overlay d-flex justify-content-center align-items-end p-1">
                <p style="font-size: 14px; color: #fafafa">
                  {{ stamprally.name }}
                </p>
              </div>
            </div>
          </div>
        </b-row>
        <b-row v-else class="px-2 pb-4 my-3 mx-auto" style="width: 98vw">
          <h5 class="text-center">
            開催中のイベントはありません。
          </h5>
        </b-row>
        <h6 v-if="Object.entries(preparation).length">
          開催予定のスタンプラリー
        </h6>
        <b-row class="px-2 pb-4 mb-3" style="width: 98vw; overflow-x: scroll">
          <div class="d-flex">
            <div v-for="stamprally in preparation" :key="stamprally.id" class="card mx-2" @click="goStamprally(stamprally.id)">
              <b-img-lazy v-if="stamprally.logo" :src="stamprally.logo" class="cardImg" />
              <div v-else class="cardImg" :style="{backgroundColor: stamprally.subColor}" />
              <div class="overlay d-flex justify-content-center align-items-end p-1">
                <p style="font-size: 14px; color: #fafafa">
                  {{ stamprally.name }}
                </p>
              </div>
            </div>
          </div>
        </b-row>
      </b-container>
    </body>
  </div>
</template>

<script>
import axios from 'axios'
import Navbar from '~/components/Navbar-User'
import { firestore } from '~/plugin/firebase'

export default {
  name: 'Index',
  components: { Navbar },
  data () {
    return {
      loaded: false,
      userId: '',
      stamprally: {},
      running: {},
      preparation: {},
      userInfo: {},
      isRegistered: true,
      nowTime: 0,
      location: { lat: 0, lng: 0 },
      filtered: false
    }
  },
  computed: {
    // 参加中のスタンプラリーのリスト
    joinedStamprally () {
      return Object.entries(this.stamprally).filter((stamprally) => {
        return Object.entries(this.userInfo.stamprally).some(s => s[1].id === stamprally[1].id)
      })
    }
  },
  async created () {
    // サーバ時間を取得
    await axios.head(location.href).then((res) => {
      this.nowTime = new Date(res.headers.date)
    })
    // ログイン済みの場合，ユーザ情報を取得
    if (this.$store.getters.isAuthenticated) {
      this.userId = this.$store.getters.user._delegate.uid
      await this.getUserInfo()
    }
    // スタンプラリー情報を取得
    await this.getStamprally()
    this.loaded = true
    console.log(this.stamprally)
    console.log(this.loaded)
  },
  methods: {
    async getStamprally () {
      // firestoreからスタンプリー情報を取得
      const _this = this
      await firestore
        .collection('stamprally')
        .orderBy('end', 'desc')
        .endAt(_this.nowTime)
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (!doc.data().version) {
              _this.$set(_this.stamprally, doc.id, doc.data())
            }
          })
          _this.checkTime()
        })
    },
    async getUserInfo () {
      // firestoreからユーザ情報を取得
      const _this = this
      try {
        await firestore
          .collection('users')
          .doc(this.userId)
          .onSnapshot(function (doc) {
            if (doc.exists) {
              _this.userInfo = doc.data()
              console.log(_this.userInfo)
              _this.$store.dispatch('setUserInfo', _this.userInfo)
              _this.$store.dispatch('setUserName', _this.userInfo.name)
              _this.$store.dispatch('setUserColor', _this.userInfo.color)
            } else {
              _this.$store.dispatch('setUserInfo', {})
              _this.$store.dispatch('setUserName', 'none')
              _this.$store.dispatch('setUserColor', '#696969')
            }
          })
      } catch (e) {
        console.log(e)
      }
    },
    async goStamprally (id) {
      // スタンプラリーを選択
      await this.$store.dispatch('setCurrentStamprally', {
        id,
        name: this.stamprally[id].name,
        lat: this.stamprally[id].defaultLat,
        lng: this.stamprally[id].defaultLng,
        color: this.stamprally[id].subColor
      })
      await this.$router.push({ name: 'stamprally-id', params: { id: this.$store.getters.currentStamprally.id } })
    },
    RAD (deg) {
      // ラジアンに変換
      return deg * Math.PI / 180
    },
    checkTime () {
      // 開催期間内かどうかのチェック
      this.filtered = false
      this.running = {}
      this.preparation = {}
      const stamprally = Object.entries(this.stamprally)
      const now = this.nowTime.getTime()
      for (let i = 0; i < stamprally.length; i++) {
        const open = new Date(stamprally[i][1].start.seconds * 1000)
        const close = new Date(stamprally[i][1].end.seconds * 1000)
        if (now >= open && now < close && stamprally[i][1].sample !== 'true') {
          this.$set(this.running, stamprally[i][1].id, this.stamprally[stamprally[i][1].id])
        } else if (now < open && stamprally[i][1].sample !== 'true') {
          this.$set(this.preparation, stamprally[i][1].id, this.stamprally[stamprally[i][1].id])
        }
      }
    },
    getPosition () {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
              resolve(this.location) // 成功時にPromiseを解決
            },
            (error) => {
              console.log(error.message)
              this.$bvToast.toast('位置情報の取得に失敗しました。', {
                variant: 'danger',
                solid: true
              })
              reject(error) // エラー時にPromiseを拒否
            }
          )
        } else {
          reject(new Error('Geolocation is not supported'))
        }
      })
    },
    async filterStamprally () {
      this.filtered = true
      this.running = {}
      this.preparation = {}
      await this.getPosition()
      const stamprally = Object.entries(this.stamprally)
      const now = this.nowTime.getTime()
      const user = this.location
      const e = 6371
      for (let i = 0; i < stamprally.length; i++) {
        let dist = 0.0
        const open = new Date(stamprally[i][1].start.seconds * 1000)
        const close = new Date(stamprally[i][1].end.seconds * 1000)
        dist = Math.floor(e * Math.acos(Math.cos(this.RAD(user.lat)) *
          Math.cos(this.RAD(stamprally[i][1].defaultLat)) * Math.cos(this.RAD(stamprally[i][1].defaultLng) - this.RAD(user.lng)) +
          Math.sin(this.RAD(user.lat)) * Math.sin(this.RAD(stamprally[i][1].defaultLat))))
        if (now >= open && now < close && dist <= 100 && stamprally[i][1].sample !== 'true') {
          this.$set(this.running, stamprally[i][1].id, this.stamprally[stamprally[i][1].id])
        } else if (now < open && dist <= 100 && stamprally[i][1].sample !== 'true') {
          this.$set(this.preparation, stamprally[i][1].id, this.stamprally[stamprally[i][1].id])
        }
      }
    }
  }
}
</script>

<style scoped>
#app {
  height: 100vh;
  background-color: #fafafa;
  font-family: 'Noto Sans JP', sans-serif !important;
  color: #333333;
}
body {
  min-height: 100%;
  padding-top: 75px;
  margin-bottom: 180px;
  font-family: 'Noto Sans JP', sans-serif !important;
  background-color: #fafafa;
  overflow: scroll;
}
.card {
  width: 120px;
  height: 160px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
}
.cardImg {
  object-fit: cover;
  border-radius: 8px;
  width: 120px;
  height: 160px;
}
.overlay {
  margin-top: 60px;
  width: 120px;
  height: 100px;
  border: none;
  border-radius: 0 0 8px 8px;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
  position: absolute;
}
.scroll {
  overflow-x: scroll;
}
.scroll::-webkit-scrollbar {
  display: none;
}
</style>
