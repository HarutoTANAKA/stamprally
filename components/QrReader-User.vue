<template>
  <!--カメラを使う機能のボタン-->
  <div>
    <b-button class="btn-hover1 color-11" style="background-color: #c73728" @click="openModal()">
      <fa :icon="faCamera" />
    </b-button>
    <!--カメラ機能のポップアップ-->
    <b-modal
      v-if="stamprallyInfo.stamp === 'again'"
      id="cameraMenu"
      size="sm"
      centered
      hide-footer
      no-close-on-backdrop
      no-close-on-esc
    >
      <template #modal-title>
        <p class="modalFont mb-0">
          カメラ
        </p>
      </template>
      <b-tabs pills align="center" class="modalFont" style="font-size: 12px">
        <b-tab title="スタンプQRコード読み取り" active>
          <div class="d-block text-center">
            <b-overlay
              :show="loading || !QRloaded"
              variant="transparent"
              opacity="1.0"
              blur="2px"
              spinner-type="grow"
              style="border-radius: 10px"
            >
              <div class="mx-auto my-3">
                <qrcode-stream
                  :track="paintOutline"
                  class="mx-auto"
                  style="overflow: hidden; border-radius: 8px; width: 200px; height: 200px;"
                  @decode="onDecode2"
                  @init="onInit"
                />
              </div>
            </b-overlay>
            <p v-if="errorNo === 0 && displayMsg" style="font-size: 14px">
              QRコードが画面内に収まるようにかざしてください。
            </p>
            <h6 v-if="errorNo === 1 && displayMsg" style="color: red">
              無効なQRコードです。
            </h6>
            <h6 v-if="errorNo === 2 && displayMsg" style="color: red">
              現在地を取得できませんでした。
            </h6>
            <h6 v-if="errorNo === 3 && displayMsg" style="color: red">
              スタンプから離れすぎています。
            </h6>
            <h6 v-if="errorNo === 4 && displayMsg" style="color: red">
              スタンプ取得は一日一回までです。
            </h6>
          </div>
        </b-tab>
      </b-tabs>
    </b-modal>
    <b-modal
      v-else
      id="cameraMenu"
      size="sm"
      centered
      hide-footer
      no-close-on-backdrop
      no-close-on-esc
    >
      <template #modal-title>
        <p class="modalFont mb-0">
          カメラ
        </p>
      </template>
      <b-tabs pills align="center" class="modalFont" style="font-size: 12px">
        <b-tab title="スタンプQRコード読み取り" active>
          <div class="d-block text-center">
            <b-overlay
              :show="loading || !QRloaded"
              variant="transparent"
              opacity="1.0"
              blur="2px"
              spinner-type="grow"
              style="border-radius: 10px"
            >
              <div class="mx-auto my-3">
                <qrcode-stream
                  :track="paintOutline"
                  class="mx-auto"
                  style="overflow: hidden; border-radius: 8px; width: 200px; height: 200px;"
                  @decode="onDecode"
                  @init="onInit"
                />
              </div>
            </b-overlay>
            <p v-if="errorNo === 0 && displayMsg" style="font-size: 14px">
              QRコードが画面内に収まるようにかざしてください。
            </p>
            <h6 v-if="errorNo === 1 && displayMsg" style="color: red">
              無効なQRコードです。
            </h6>
            <h6 v-if="errorNo === 2 && displayMsg" style="color: red">
              現在地を取得できませんでした。
            </h6>
            <h6 v-if="errorNo === 3 && displayMsg" style="color: red">
              スタンプから離れすぎています。
            </h6>
            <h6 v-if="errorNo === 4 && displayMsg" style="color: red">
              取得済みのスタンプです。
            </h6>
          </div>
        </b-tab>
      </b-tabs>
    </b-modal>
    <!--スタンプ取得時のポップアップ-->
    <b-modal
      id="success"
      class="d-flex justify-content-center"
      hide-footer
      hide-header
      centered
      no-close-on-backdrop
    >
      <div>
        <b-button
          class="closebtn mt-1 mr-2"
          @click="close()"
        >
          <fa :icon="faTimes" />
        </b-button>
      </div>
      <div class="d-block text-center my-auto">
        <h4>スタンプ獲得</h4>
        <img v-if="displayImg" :src="displayImg" alt="image" style="width: 100%">
        <h3 class="mt-3 fadeText">
          {{ displayStampName }}
        </h3>
      </div>
    </b-modal>
    <!--クイズ発生時のポップアップ-->
    <b-modal id="mission" hide-footer hide-header centered no-close-on-backdrop>
      <b-button class="closebtn mt-1 mr-2" @click="closeQuiz()">
        <fa :icon="faTimes" />
      </b-button>
      <Quiz :stampId="displayStampId" />
    </b-modal>
  </div>
</template>

<script>
import { faTimes, faCamera } from '@fortawesome/free-solid-svg-icons'
import loadImage from 'blueimp-load-image'
import Compressor from 'compressorjs'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import firebase from 'firebase/compat'
import Firestore from '~/plugin/firestore'
import Quiz from '~/components/Quiz-User'

export default {
  name: 'QrReader',
  components: { Quiz },
  data () {
    return {
      loading: false,
      QRloaded: false,
      errorNo: 0,
      success: 0,
      displayMsg: true,
      displayImg: null,
      geoOption: {
        enableHighAccuracy: true,
        timeout: 2000,
        maximumAge: 0
      },
      location: { lng: 0, lat: 0 },
      displayStampName: '',
      displayStampId: '',
      stampInfo: {},
      stamprallyInfo: {},
      userInfo: {},
      uploader: {
        storagePath: [],
        file: null,
        thumbnail: null,
        preview: null,
        comment: '',
        url: '',
        loading: false,
        lat: null,
        lng: null
      },
      stamp: null,
      options: [{ value: null, text: 'スポットを選択' }],
      selected: null
    }
  },
  computed: {
    faTimes () {
      return faTimes
    },
    faCamera () {
      return faCamera
    }
  },
  async created () {
    // firestoreからスタンプ情報を取得
    this.stampInfo = await Firestore.getStampsInfo(this.$route.params.id)
    this.stamprallyInfo = await Firestore.getStamprallyInfo(this.$route.params.id)
    this.errorNo = 0
    this.success = 0
    this.QRloaded = false
    this.setOptions()
  },
  methods: {
    setOptions () {
      const stamp = Object.entries(this.stampInfo)
      for (let i = 0; i < stamp.length; i++) {
        this.options.push({ value: stamp[i][1].id, text: stamp[i][1].name })
      }
    },
    RAD (deg) {
      // ラジアンに変換
      return deg * Math.PI / 180
    },
    openModal () {
      // ポップアップ表示
      this.errorNo = 0
      this.success = 0
      this.QRloaded = false
      this.$bvModal.show('cameraMenu')
      console.log(this.stamprallyInfo.stamp)
    },
    async onDecode (result) {
      // QRコード読み取り後の処理
      // const _this = this
      this.errorNo = 0
      this.displayMsg = false
      this.loading = true
      this.userInfo = await Firestore.getUserStatus(this.$store.getters.user._delegate.uid)
      if (result.length === 28) {
        const stampId = result.slice(8)
        console.log(stampId)
        if (this.userInfo.ownedStamps.length && this.userInfo.ownedStamps.some(s => s.id === stampId)) {
          console.log('got')
          this.errorNo = 4
          this.displayMsg = true
          this.loading = false
          return
        }
        // this.getPlace(stampId)
        this.$bvModal.hide('cameraMenu')
        this.$bvModal.show('success')
        await this.getSuccess(stampId)
      } else {
        this.errorNo = 1
        this.loading = false
        this.displayMsg = true
      }
    },
    async onDecode2 (result) {
      // QRコード読み取り後の処理
      // const _this = this
      this.errorNo = 0
      this.displayMsg = false
      this.loading = true
      this.userInfo = await Firestore.getUserStatus(this.$store.getters.user._delegate.uid)
      const ownedStamps = Object.entries(this.userInfo.ownedStamps)
      if (result.length === 28) {
        const stampId = result.slice(8)
        console.log(stampId)
        for (let i = 0; i < ownedStamps.length; i++) {
          if (ownedStamps[i][1].id === stampId) {
            const gotTime = new Date(ownedStamps[i][1].date.seconds * 1000)
            const today = new Date()
            if (gotTime.getFullYear() <= today.getFullYear()) {
              if (gotTime.getMonth() + 1 === today.getMonth() + 1 && gotTime.getDate() === today.getDate()) {
                console.log('got')
                this.errorNo = 4
                this.displayMsg = true
                this.loading = false
                return
              } else {
                console.log('again')
                this.$bvModal.hide('cameraMenu')
                this.$bvModal.show('success')
                await this.getSuccessAgain(stampId, ownedStamps[i][1].date, ownedStamps[i][1].times)
                return
              }
            }
          }
        }
        // this.getPlace(stampId)
        console.log('first')
        this.$bvModal.hide('cameraMenu')
        this.$bvModal.show('success')
        await this.getSuccess(stampId)
      } else {
        this.errorNo = 1
        this.loading = false
        this.displayMsg = true
      }
    },
    async onInit (promise) {
      // QRコードリーダーの初期化
      try {
        await promise
        this.QRloaded = true
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          console.log('許可できてない')
          this.QRloaded = true
        } else if (error.name === 'NotFoundError') {
          console.log('カメラない')
          this.QRloaded = true
        } else if (error.name === 'NotSupportedError') {
          console.log('ERROR: secure context required (HTTPS, localhost)')
          this.QRloaded = true
        } else if (error.name === 'NotReadableError') {
          console.log('ERROR: is the camera already in use?')
          this.QRloaded = true
        } else if (error.name === 'OverconstrainedError') {
          console.log('ERROR: installed cameras are not suitable')
          this.QRloaded = true
        } else if (error.name === 'StreamApiNotSupportedError') {
          console.log('ERROR: Stream API is not supported in this browser')
          this.QRloaded = true
        }
      }
    },
    paintOutline (detectedCodes, ctx) {
      // QRコードリーダーの四角いやつ
      for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

        ctx.strokeStyle = 'blue'

        ctx.beginPath()
        ctx.moveTo(firstPoint.x, firstPoint.y)
        for (const {
          x,
          y
        } of otherPoints) {
          ctx.lineTo(x, y)
        }
        ctx.lineTo(firstPoint.x, firstPoint.y)
        ctx.closePath()
        ctx.stroke()
      }
    },
    getPlace (stampId) {
      // 現在地を取得
      this.errorNo = 0
      this.displayMsg = false
      this.loading = true
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            this.location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          },
          () => {
            console.log('error')
            this.errorNo = 2
            this.loading = false
          }, this.geoOption
        )
        setTimeout(() => {
          navigator.geolocation.clearWatch(watchId)
          this.computeDistanceQR(stampId)
        }, 3000)
      } else {
        alert('ブラウザがGPSをサポートしていません')
        this.loading = false
        this.displayMsg = true
      }
    },
    computeDistanceQR (stampId) {
      // スタンプ中心地と現在地の距離を計算し，判定
      let dist = 0.0
      const e = 6378137.0
      const rad = this.stampInfo[stampId].radius
      const lat2 = this.stampInfo[stampId].location._lat
      const lng2 = this.stampInfo[stampId].location._long
      dist = e * Math.acos(Math.cos(this.RAD(this.location.lat)) *
        Math.cos(this.RAD(lat2)) * Math.cos(this.RAD(lng2) - this.RAD(this.location.lng)) +
        Math.sin(this.RAD(this.location.lat)) * Math.sin(this.RAD(lat2)))
      if (dist <= rad) {
        this.$bvModal.show('success')
        this.getSuccess(stampId)
      } else {
        this.errorNo = 3
        this.loading = false
        this.displayMsg = true
      }
    },
    async getSuccess (stampId) {
      // スタンプ取得成功
      this.displayStampName = this.stampInfo[stampId].name
      this.displayStampId = stampId
      if (this.stampInfo[stampId].stampIcon) {
        this.displayImg = this.stampInfo[stampId].stampIcon
      } else if (this.stampInfo[stampId].image) {
        this.displayImg = this.stampInfo[stampId].image
      } else { this.displayImg = null }
      this.loading = false
      this.displayMsg = true
      await Firestore.userGetStamp(this.$store.getters.user._delegate.uid, stampId, this.$route.params.id)
      this.$bvToast.toast('スタンプを獲得しました！', {
        variant: 'info'
      })
      if (this.$store.getters.userInfo.selectedCourse.length && this.stampInfo[stampId].quizAvailable) {
        setTimeout(() => {
          this.$bvModal.show('mission')
        }, 3000)
      }
    },
    async getSuccessAgain (stampId, date, times) {
      // スタンプ取得成功
      this.displayStampName = this.stampInfo[stampId].name
      this.displayStampId = stampId
      if (this.stampInfo[stampId].stampIcon) {
        this.displayImg = this.stampInfo[stampId].stampIcon
      } else if (this.stampInfo[stampId].thumbnail) {
        this.displayImg = this.stampInfo[stampId].thumbnail
      } else { this.displayImg = null }
      this.loading = false
      this.displayMsg = true
      await Firestore.userGetStampAgain(this.$store.getters.user._delegate.uid, stampId, this.$route.params.id, date, times)
      this.$bvToast.toast('スタンプを獲得しました！', {
        variant: 'info'
      })
      if (this.$store.getters.userInfo.selectedCourse.length && this.stampInfo[stampId].quizAvailable) {
        setTimeout(() => {
          this.$bvModal.show('mission')
        }, 3000)
      }
    },
    async select_file (e) {
      // ファイル選択後の処理
      this.uploader.lat = this.$store.getters.userLocation.lat
      this.uploader.lng = this.$store.getters.userLocation.lng
      const key = Math.random().toString(36).slice(-6) // ファイル名重複回避のためのやつ
      this.uploader.file = await this.compressImage(e.target.files[0], 'image', key)
      this.uploader.thumbnail = await this.compressImage(e.target.files[0], 'thumbnail', key)
      this.uploader.preview = URL.createObjectURL(this.uploader.file)
      // this.uploadImage()
    },
    checkExif (file) {
      // 写真のExif情報をチェック
      const _this = this
      loadImage.parseMetaData(file, function (data) {
        if (data.exif && data.exif.get('GPSInfo') && !isNaN(data.exif.get('GPSInfo')[2][0])) {
          const gps = data.exif.get('GPSInfo')
          console.log(gps)
          const latitude = gps[2][0] + gps[2][1] / 60 + gps[2][2] / 3600
          const longitude = gps[4][0] + gps[4][1] / 60 + gps[4][2] / 3600
          _this.uploader.lat = latitude
          _this.uploader.lng = longitude
          console.log('exifloc: ', _this.uploader.lat, _this.uploader.lng)
        } else {
          _this.uploader.lat = _this.$store.getters.userLocation.lat
          _this.uploader.lng = _this.$store.getters.userLocation.lng
          console.log('userloc: ', _this.uploader.lat, _this.uploader.lng)
        }
      })
    },
    createTimestamp () {
      // 写真のタイムスタンプを作成
      const d = new Date() // Today
      const DateTimeFormat = 'YYYYMMDD_hhmiss' // "2019/10/04 12:34:56" -> "20191004_123456"
      return DateTimeFormat
        .replace(/YYYY/g, String(d.getFullYear()))
        .replace(/MM/g, ('0' + (d.getMonth() + 1)).slice(-2))
        .replace(/DD/g, ('0' + d.getDate()).slice(-2))
        .replace(/hh/g, ('0' + d.getHours()).slice(-2))
        .replace(/mi/g, ('0' + d.getMinutes()).slice(-2))
        .replace(/ss/g, ('0' + d.getSeconds()).slice(-2))
    },
    compressImage (file, type, key) {
      // 画像の圧縮
      const filename = this.createTimestamp() + key
      let width = 720
      let height = 720
      if (type === 'thumbnail') {
        width = 256
        height = 256
      }
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-new
        new Compressor(file, {
          convertSize: 50000,
          maxHeight: height,
          maxWidth: width,
          success (result) {
            let file = null
            if (type === 'thumbnail') {
              file = new File([result], 'thumbnail_' + filename, { type: 'image/jpeg' })
              // this.uploader.storagePath[1] = `stamprally/${this.$route.params.id}/userImages/` + 'thumbnail_' + result.name
            } else {
              file = new File([result], filename, { type: 'image/jpeg' })
              // this.uploader.storagePath[0] = `stamprally/${this.$route.params.id}/userImages/` + result.name
            }
            console.log(file)
            resolve(file)
          },
          error (err) {
            console.log(err.message)
          }
        })
      })
    },
    uploadImage () {
      // firebase storageに写真をアップロード
      this.uploader.loading = true
      const uploader = [this.uploader.file, this.uploader.thumbnail]
      if (this.uploader.file.size / 1000 > 5000) {
        this.$bvToast.toast(`ファイルサイズが大きすぎます(${this.uploader.file.size / 1000} KB)`, { variant: 'danger' })
        this.uploader.loading = false
      } else {
        let promises = []
        promises = uploader.map((img, index) => {
          const url = `stamprally/${this.$route.params.id}/userImages/` + img.name
          const storageRef = ref(getStorage(), url)
          this.uploader.storagePath.push(url)
          return uploadBytesResumable(storageRef, img)
            .then(snapshot => getDownloadURL(snapshot.ref))
            .catch(error => console.log(error.message))
        })
        Promise.all(promises).then(URLlist => this.postImage(URLlist)
        ).catch((error) => {
          console.log(error.message)
        })
      }
    },
    cancelUpload () {
      // 写真投稿のキャンセル
      this.uploader = {
        storagePath: [],
        file: null,
        thumbnail: null,
        comment: '',
        url: '',
        preview: null,
        loading: false,
        lat: null,
        lng: null
      }
    },
    async postImage (list) {
      // Firestoreに写真情報のアップロード
      console.log(list)
      const id = firebase.firestore().collection('photos').doc().id
      console.log(this.uploader.lat, this.uploader.lng)
      await firebase.firestore()
        .collection('photos')
        .doc(id)
        .set({
          id,
          url: list[0],
          thumbnail: list[1],
          path: this.uploader.storagePath,
          comment: this.uploader.comment,
          user: this.$store.getters.user._delegate.uid,
          userName: this.$store.getters.userInfo.name,
          stamprally: this.$route.params.id,
          location: new firebase.firestore.GeoPoint(Number(this.uploader.lat), Number(this.uploader.lng)),
          date: new Date()
        })
        .then(() => {
          console.log('done!')
          this.$bvToast.toast('写真を投稿しました', { variant: 'info' })
          this.uploader = {
            storagePath: [],
            file: null,
            thumbnail: null,
            comment: '',
            url: '',
            preview: null,
            loading: false,
            lat: null,
            lng: null
          }
          this.$bvModal.hide('uploader')
        })
      await firebase.firestore()
        .collection('stamps')
        .doc(this.selected)
        .update({
          image3: firebase.firestore.FieldValue.arrayUnion(list[1])
        })
    },
    closeQuiz () {
      // クイズを閉じる
      this.$bvModal.hide('mission')
    },
    close () {
      let mod = 0
      let check = 0
      // 「スタンプ獲得」のポップアップを閉じる
      this.$bvModal.hide('success')
      // アニメーション表示の処理
      const progress = this.$store.getters.courseStatus.progress
      mod = this.$store.getters.courseStatus.length % 3
      check = Math.floor(this.$store.getters.courseStatus.length / 3)
      if (mod === 2) {
        if (progress === check + 1) {
          this.stamp = 1
        } else if (progress === (check + 1) * 2) {
          this.stamp = 2
        }
      } else if (mod === 0 || mod === 1) {
        if (progress === check) {
          this.stamp = 1
        } else if (progress === check * 2) {
          this.stamp = 2
        }
      }
      if (this.$store.getters.userInfo.completedCourse.length && this.$store.getters.userInfo.selectedCourse === '') {
        this.stamp = 3
      }
    }
  }
}
</script>

<style scoped>
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
.modalFont {
  font-family: 'Noto Sans JP', sans-serif !important;
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
.stamp{
  width: 170pt;
  height: 160pt;
  margin-left: -100px;
  margin-top: -730px;
  animation: fadeout-anim 0.3s linear 2s forwards;
}
@keyframes fadeout-anim {
  100% {
    opacity: 0;
  }
}
.fadeText {
  white-space: nowrap;
  overflow: hidden;
  animation: flowing-anim 4s;
}
@keyframes flowing-anim {
  0%{
    width: 0%;
  }
  100%{
    width: 100%;
  }
}
</style>
