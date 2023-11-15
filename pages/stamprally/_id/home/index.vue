<template>
  <!--スタンプラリーのホーム画面と画面下部のメニュー（ユーザ）-->
  <div id="app" style="max-width: 600px; margin: 0 auto">
    <Navbar v-if="loaded" />
    <body v-if="loaded">
      <Home v-if="state === 'home'" />
      <Stamps v-else-if="state === 'stamps'" />
      <Status v-else-if="state === 'status'" />
      <Apply v-else-if="state === 'apply'" />
    </body>
    <Course v-if="loaded && state==='home'" />
    <div id="menu" class="fixed-bottom d-flex justify-content-center">
      <b-button-group size="lg" style="min-width: 325px; height: 70px; box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13); border-radius: 20px">
        <b-button
          class="menubtn"
          style="border-radius: 20px 0 0 20px"
          @click="selectMenu('home')"
        >
          <h6 v-if="state === 'home'" class="menuText">
            <fa :icon="faMapMarkedAlt" class="mb-1" style="margin: 0; font-size: 22px; color: #8ab72c" /><br>
            マップ
          </h6>
          <fa v-else :icon="faMapMarkedAlt" class="iconSize-ms" style="margin: 0" />
        </b-button>
        <b-button
          style="border-radius: 0 20px 0 0"
          class="menubtn"
          @click="selectMenu('stamps')"
        >
          <h6 v-if="state === 'stamps'" class="menuText">
            <fa :icon="faStamp" style="transform: rotate(40deg); font-size: 20px; margin-bottom: 6px; color: #e7930f" /><br>
            スタンプ
          </h6>
          <fa v-else :icon="faStamp" class="iconSize-ms" style="transform: rotate(40deg); font-size: 24px; margin-bottom: 6px" />
        </b-button>
        <b-button
          class="menubtn col-3"
          style="background-color: transparent"
        />
        <b-button
          class="menubtn"
          style="border-radius: 20px 0 0 0"
          @click="selectMenu('apply')"
        >
          <h6 v-if="state === 'apply'" class="menuText">
            <fa :icon="faGift" class="mb-1" style="font-size: 22px; margin: 0; color: #c73728" /><br>
            応募
          </h6>
          <fa v-else :icon="faGift" class="iconSize-ms" />
        </b-button>
        <b-button
          style="border-radius: 0 20px 20px 0"
          class="menubtn"
          @click="selectMenu('status')"
        >
          <h6 v-if="state === 'status'" class="menuText">
            <fa :icon="faUser" class="mb-1" style="font-size: 20px; margin: 0; color: #3f82bb" /><br>
            ユーザ
          </h6>
          <fa v-else :icon="faUser" class="iconSize-ms" />
        </b-button>
      </b-button-group>
      <QrReader class="shape1" />
    </div>
  </div>
</template>

<script>
import { faStamp, faGift, faUser, faCamera, faMapMarkedAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import Navbar from '~/components/Navbar-User'
import Home from '~/components/Home-User'
import Firestore from '~/plugin/firestore'
import { firestore } from '~/plugin/firebase'
import Course from '~/components/Course-User'
const Apply = () => import('~/components/Apply-User')
const Status = () => import('~/components/Status-User')
const Stamps = () => import('~/components/Stamps-User')
const QrReader = () => import('~/components/QrReader-User')

export default {
  name: 'Index',
  components: { Navbar, Apply, Status, Home, Stamps, QrReader, Course },
  data () {
    return {
      loaded: false,
      state: 'home',
      userInfo: {
        color: '#696969'
      },
      userId: this.$store.getters.user._delegate.uid,
      location: { lng: 0, lat: 0 },
      geoOption: {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 0
      },
      stamprally: {},
      stampInfo: {},
      adInfo: {},
      ownedStamps: {},
      photos: {},
      courseInfo: {},
      stamprallyId: this.$route.params.id
    }
  },
  computed: {
    faStamp () {
      return faStamp
    },
    faTimes () {
      return faTimes
    },
    faGift () {
      return faGift
    },
    faUser () {
      return faUser
    },
    faCamera () {
      return faCamera
    },
    faMapMarkedAlt () {
      return faMapMarkedAlt
    }
  },
  async created () {
    // firestoreからスタンプラリー情報を取得
    this.stamprally = await Firestore.getStamprallyInfo(this.$route.params.id)
    await this.$store.dispatch('setCurrentStamprally', this.stamprally)
    await this.getUserInfo()
    await this.getStampInfo()
    await this.getPhotos()
    await this.getAdInfo()
    await this.$nextTick(() => {
      // 現在地を取得
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            this.location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            await Firestore.latestLogin(this.userId, this.location.lat, this.location.lng, this.stamprally.id)
            console.log(this.location)
          },
          (error) => {
            console.log(error.message)
          }, this.geoOption
        )
      } else {
        alert('ブラウザがGPSをサポートしていません')
        this.loaded = true
      }
    })
    setTimeout(() => {
      this.loaded = true
    }, 1000)
  },
  mounted () {
    // storeの値が更新されたタイミングで情報を取得（ユーザ情報，スタンプ情報，広告）
    this.$store.watch((state, getters) => getters.userInfo,
      (newValue) => {
        this.userInfo = newValue
        this.loaded = false
        this.$nextTick(() => (this.loaded = true))
      }
    )
    this.$store.watch((state, getters) => getters.stampInfo.stamps,
      (newValue) => {
        this.stampInfo = newValue
      }
    )
    this.$store.watch((state, getters) => getters.adInfo.ads,
      (newValue) => {
        this.adInfo = newValue
      }
    )
  },
  methods: {
    selectMenu (state) {
      // メニュー選択
      this.state = state
      const elem = document.activeElement
      elem.blur()
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
              if (!(Object.entries(_this.userInfo.stamprally).some(s => s[1].id === _this.stamprally.id))) {
                const date = new Date()
                Firestore.addStamprally(_this.userInfo.uid, _this.stamprally.id, date)
              }
              _this.$set(_this.userInfo, 'selectedCourse', _this.userInfo.stamprally[_this.stamprally.id].selectedCourse)
              _this.$set(_this.userInfo, 'completedCourse', _this.userInfo.stamprally[_this.stamprally.id].completedCourse)
              _this.$set(_this.userInfo, 'applied', _this.userInfo.stamprally[_this.stamprally.id].applied)
              _this.$set(_this.userInfo, 'points', _this.userInfo.stamprally[_this.stamprally.id].points)
              if (!_this.userInfo.sex) {
                _this.$set(_this.userInfo, 'sex', '未設定')
              }
              console.log(_this.userInfo)
              _this.$store.dispatch('setUserInfo', _this.userInfo)
            } else {
              _this.$router.push({ name: 'stamprally-id', params: { id: _this.stamprallyId } })
            }
          })
      } catch (e) {
        console.log(e)
      }
    },
    async getStampInfo () {
      // firestoreからスタンプ情報を取得
      const _this = this
      await firestore
        .collection('stamps')
        .where('stamprallyId', '==', this.$route.params.id)
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            _this.$set(_this.stampInfo, doc.id, doc.data())
          })
          _this.$store.dispatch('setStampInfo', _this.stampInfo)
        })
    },
    async getPhotos () {
      // firestoreから写真情報を取得
      const _this = this
      await firestore
        .collection('photos')
        .where('stamprally', '==', this.$route.params.id)
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            _this.$set(_this.photos, doc.id, doc.data())
          })
          _this.$store.dispatch('setPhotos', _this.photos)
        })
    },
    async getAdInfo () {
      // firestoreから広告情報を取得
      const _this = this
      await firestore
        .collection('advertise')
        .where('stamprallyId', '==', this.$route.params.id)
        // .orderBy('order')
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (_this.openAd(doc.data())) {
              _this.$set(_this.adInfo, doc.id, doc.data())
            }
          })
          _this.$store.dispatch('setAdInfo', _this.adInfo)
          console.log(_this.adInfo)
        })
    },
    openAd (ad) {
      // 広告が期限内かどうかをチェック
      const start = new Date(ad.start.seconds * 1000)
      const stop = new Date(ad.end.seconds * 1000)
      const now = new Date()
      const diff1 = now.getTime() - start.getTime()
      const diff2 = stop.getTime() - now.getTime()
      return diff1 >= 0 && diff2 > 0
    }
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  font-family: 'Noto Sans JP', sans-serif;
}
#menu {
  margin-top: auto;
  margin-bottom: 25px;
}
.shape1 {
  width: 65px;
  height: 50px;
  position: absolute;
  bottom: 0px;
  background-color: white;
}
.shape2 {
  width: 65px;
  height: 65px;
  position: absolute;
  bottom: 25px;
  border: none;
  border-radius: 50%;
  background-color: dimgray;
}
.btn-hover1 {
  width: 65px;
  font-size: 26px;
  position: absolute;
  bottom: 25px;
  color: #fafafa;
  cursor: pointer;
  height: 65px;
  text-align: center;
  border: none;
  padding-bottom: 10px;
  /*background-size: 300% 100%;*/
  border-radius: 50px;
}

.btn-hover1:focus {
  outline: none;
}
.btn-hover1.color-11 {
  background-image: linear-gradient(to right, #eb3941, #f15e64, #e14e53, #e2373f);  box-shadow: 0 5px 15px rgba(242, 97, 103, .4);
}
.menubtn {
  width: 65px;
  background-color: white;
  color: dimgray;
  border: none;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  cursor: pointer;
  outline: none;
}
.menubtn:active,
.menubtn:hover,
.menubtn:focus {
  background-color: white;
  outline: none;
}
.iconSize-ms {
  font-size: 26px;
}
.menuText {
  margin: 0;
  font-weight: bold;
  color: dimgray;
  font-size: 10px;
}
.modalFont {
  font-family: 'Noto Sans JP', sans-serif !important;
}
.closeImage {
  position: absolute;
  top: -10px;
  right: -10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #e14e53;
}

</style>
