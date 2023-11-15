<template>
  <!--スタンプラリーの設定-->
  <b-container class="py-2" style="border-radius: 3px; height: 88vh; overflow: scroll">
    <b-row class="d-flex mb-4">
      <b-col class="col-12">
        <div v-if="loaded">
          <b-list-group>
            <b-list-group-item class="d-flex align-items-center">
              <b-col class="col-2">
                ID：
              </b-col>
              <b-col>{{ stamprallyData.id }}</b-col>
            </b-list-group-item>
            <b-list-group-item class="d-flex align-items-center">
              <b-col class="col-2">
                名前：
              </b-col>
              <b-col v-if="changeTarget!=='name'">
                {{ stamprallyData.name }}
              </b-col>
              <b-form-input v-else v-model="stamprallyData.name" class="col-3" />
              <b-button v-if="changeTarget==='name'" class="ml-auto mr-3" variant="outline-danger" @click="confirmChange()">
                確定
              </b-button>
              <b-button v-if="changeTarget==='name'" class="ml-3 mr-3" variant="outline-secondary" @click="changeTarget=null">
                キャンセル
              </b-button>
              <b-button v-else class="ml-auto mr-3" variant="link" @click="changeTarget='name'">
                変更
              </b-button>
            </b-list-group-item>
            <b-list-group-item class="d-flex align-items-center">
              <b-col class="col-2">
                開催期間：
              </b-col>
              <b-col v-if="changeTarget!=='date'">
                {{ stamprallyData.startDate }}&nbsp;~&nbsp;{{ stamprallyData.endDate }}
              </b-col>
              <b-col v-else class="d-flex align-items-center">
                <b-form-datepicker
                  id="term"
                  v-model="formStart"
                  class="col-3"
                  placeholder="日付を選択"
                  :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                  locale="jp"
                />
                &nbsp;~&nbsp;
                <b-form-datepicker
                  id="term2"
                  v-model="formEnd"
                  class="col-3"
                  placeholder="日付を選択"
                  :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                  locale="ja"
                />
              </b-col>
              <b-button v-if="changeTarget==='date'" class="ml-auto mr-3" variant="outline-danger" @click="confirmChange()">
                確定
              </b-button>
              <b-button v-if="changeTarget==='date'" class="ml-3 mr-3" variant="outline-secondary" @click="changeTarget=null">
                キャンセル
              </b-button>
              <b-button v-else class="ml-auto mr-3" variant="link" @click="changeTarget='date'">
                変更
              </b-button>
            </b-list-group-item>
            <b-list-group-item class="d-flex align-items-center">
              <b-col class="col-2">
                テーマカラー：
              </b-col>
              <div v-if="changeTarget!=='color'" class="ml-3" style="border-radius: 3px; width: 70px; height: 35px" :style="{backgroundColor: stamprallyData.primaryColor}" />
              <div v-else class="d-flex">
                <div
                  v-for="h in hsl"
                  :key="h.index"
                  class="mx-2"
                >
                  <b-button
                    style="border: none; border-radius: 3px; width: 40px; height: 35px"
                    :style="{backgroundColor: hsl2rgb(Number(h), 80, 0.5)}"
                    @click="colorHandler(h)"
                  />
                </div>
              </div>
              <b-button v-if="changeTarget==='color'" class="ml-auto mr-3" variant="outline-danger" @click="confirmChange()">
                確定
              </b-button>
              <b-button v-if="changeTarget==='color'" class="ml-3 mr-3" variant="outline-secondary" @click="changeTarget=null">
                キャンセル
              </b-button>
              <b-button v-else class="ml-auto mr-3" variant="link" @click="changeTarget='color'">
                変更
              </b-button>
            </b-list-group-item>
            <b-list-group-item class="d-flex align-items-center">
              <b-col class="col-2">
                ロゴ画像：
              </b-col>
              <b-img-lazy v-if="imagePreview" :src="imagePreview" alt="logo" class="ml-3" style="height: 200px; width:300px" />
              <b-img-lazy v-else-if="stamprallyData.logo" :src="stamprallyData.logo" class="ml-3" style="height: 200px; width:300px" />
              <b-col v-if="changeTarget==='logo'" class="col-3">
                <b-form-file accept="image/jpeg, image/png" @change="select_file" />
              </b-col>
              <b-spinner
                v-if="uploading"
                variant="primary"
              />
              <div v-else-if="changeTarget==='logo'" class="ml-auto mr-3">
                <b-button variant="outline-danger" @click="uploadImage()">
                  確定
                </b-button>
                <b-button class="ml-3" variant="outline-secondary" @click="changeTarget=null; imagePreview=null">
                  キャンセル
                </b-button>
              </div>
              <b-button v-else class="ml-auto mr-3" variant="link" @click="changeTarget='logo'">
                変更
              </b-button>
            </b-list-group-item>
            <b-list-group-item class="d-flex align-items-center">
              <b-col class="col-2">
                マップの中心点：
              </b-col>
              <div class="ml-3">
                <GmapMap
                  v-if="loaded && stamprallyData"
                  ref="gMAp"
                  map-type-id="roadmap"
                  :center="initialLocation"
                  :zoom="zoom"
                  :style="styleMap"
                  :options="mapOptions"
                  style="overflow: hidden; border-radius: 3px; z-index: 1"
                  @click="ping($event)"
                >
                  <GmapMarker
                    v-if="markerPos"
                    :position="markerPos"
                    :draggable="false"
                  />
                </GmapMap>
              </div>
              <b-button v-if="changeTarget==='map'" class="ml-auto mr-3" variant="outline-danger" @click="confirmChange()">
                確定
              </b-button>
              <b-button v-if="changeTarget==='map'" class="ml-3 mr-3" variant="outline-secondary" @click="changeTarget=null">
                キャンセル
              </b-button>
              <b-button v-else class="ml-auto mr-3" variant="link" @click="changeTarget='map'">
                変更
              </b-button>
            </b-list-group-item>
            <b-list-group-item class="d-flex align-items-center">
              <b-col class="col-2">
                アンケートURL：
              </b-col>
              <b-col v-if="changeTarget!=='question'" class="col-8">
                <span style="word-wrap: break-word">{{ stamprallyData.question }}</span>
              </b-col>
              <b-form-input v-else v-model="stamprallyData.question" class="col-8" />
              <b-button v-if="changeTarget==='question'" class="ml-auto mr-3" variant="outline-danger" @click="confirmChange()">
                確定
              </b-button>
              <b-button v-if="changeTarget==='question'" class="ml-3 mr-3" variant="outline-secondary" @click="changeTarget=null">
                キャンセル
              </b-button>
              <b-button v-else class="ml-auto mr-3" variant="link" @click="changeTarget='question'">
                変更
              </b-button>
            </b-list-group-item>
            <b-list-group-item class="d-flex align-items-center">
              <b-col class="col-2">
                サンプル設定：
              </b-col>
              <b-form-checkbox
                v-if="changeTarget==='sample'"
                v-model="stamprallyData.sample"
                switch
                size="lg"
                value="true"
                unchecked-value="false"
              ></b-form-checkbox>
              <b-button v-if="changeTarget==='sample'" class="ml-auto mr-3" variant="outline-danger" @click="confirmChange()">
                確定
              </b-button>
              <b-button v-if="changeTarget==='sample'" class="ml-3 mr-3" variant="outline-secondary" @click="changeTarget=null">
                キャンセル
              </b-button>
              <b-button v-else class="ml-auto mr-3" variant="link" @click="changeTarget='sample'">
                変更
              </b-button>
            </b-list-group-item>
            <b-list-group-item class="d-flex align-items-center">
              <b-col class="col-3">
                スタンプ取得可能回数：
              </b-col>
              <b-col class="col">
                <b-form-select v-if="changeTarget==='stamp'" id="stamp" v-model="stamprallyData.stamp" size="sm" :options="[{value: 'once', text: '1回だけ'}, {value: 'again', text: '1日1回'}]" />
              </b-col>
              <b-button v-if="changeTarget==='stamp'" class="ml-auto mr-3" variant="outline-danger" @click="confirmChange()">
                確定
              </b-button>
              <b-button v-if="changeTarget==='stamp'" class="ml-3 mr-3" variant="outline-secondary" @click="changeTarget=null">
                キャンセル
              </b-button>
              <b-button v-else class="ml-auto mr-3" variant="link" @click="changeTarget='stamp'">
                変更
              </b-button>
            </b-list-group-item>
            <b-list-group-item class="d-flex align-items-center">
              <b-col class="col-3">
                景品応募可能回数：
              </b-col>
              <b-col class="col">
                <b-form-select v-if="changeTarget==='prize'" id="stamp" v-model="stamprallyData.prize" size="sm" :options="[{value: 'one', text: '1回だけ（1つの景品にのみ応募可能）'}, {value: 'more', text: '複数回（複数の景品に何回でも応募可能）'}]" />
              </b-col>
              <b-button v-if="changeTarget==='prize'" class="ml-auto mr-3" variant="outline-danger" @click="confirmChange()">
                確定
              </b-button>
              <b-button v-if="changeTarget==='prize'" class="ml-3 mr-3" variant="outline-secondary" @click="changeTarget=null">
                キャンセル
              </b-button>
              <b-button v-else class="ml-auto mr-3" variant="link" @click="changeTarget='prize'">
                変更
              </b-button>
            </b-list-group-item>
            <b-list-group-item v-if="stamprallyData.inquiry" class="d-flex align-items-center">
              <b-col class="col-2">
                主催者お問い合わせ先：
              </b-col>
              <b-col v-if="changeTarget!=='inquiry'">
                <div>
                  {{ stamprallyData.inquiry.name }}
                </div>
                <div>
                  {{ stamprallyData.inquiry.phone }}
                </div>
                <div>
                  {{ stamprallyData.inquiry.mail }}
                </div>
              </b-col>
              <div v-else>
                <b-form-input v-model="stamprallyData.inquiry.name" class="col-12 my-1" placeholder="名前" />
                <b-form-input v-model="stamprallyData.inquiry.phone" class="col-12 my-1" placeholder="電話番号" />
                <b-form-input v-model="stamprallyData.inquiry.mail" class="col-12 my-1" placeholder="メールアドレス" />
              </div>
              <b-button v-if="changeTarget==='inquiry'" class="ml-auto mr-3" variant="outline-danger" @click="confirmChange()">
                確定
              </b-button>
              <b-button v-if="changeTarget==='inquiry'" class="ml-3 mr-3" variant="outline-secondary" @click="changeTarget=null">
                キャンセル
              </b-button>
              <b-button v-else class="ml-auto mr-3" variant="link" @click="changeTarget='inquiry'">
                変更
              </b-button>
            </b-list-group-item>
          </b-list-group>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import Compressor from 'compressorjs'
import { firestore } from '../plugin/firebase'

export default {
  name: 'Settings',
  data () {
    return {
      loaded: false,
      uploading: false,
      stamprallyData: this.$store.getters.stamprally[this.$store.getters.selectedStamprally],
      changeTarget: null,
      hsl: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300],
      selectedH: null,
      themeColor: '',
      subColor: null,
      file: null,
      imagePreview: null,
      formStart: null,
      formEnd: null,
      initialLocation: { lng: 0, lat: 0 },
      styleMap: {
        width: '400px',
        height: '250px'
      },
      zoom: 11,
      mapOptions: {
        disableDefaultUi: true,
        mapTypeControl: false,
        zoomControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        clickableIcons: false,
        styles: []
      },
      markerPos: null
    }
  },
  mounted () {
    // storeの値が更新されたタイミングでスタンプラリー情報の取得
    this.$store.watch((state, getters) => getters.stamprally,
      (newValue) => {
        this.stamprallyData = newValue[this.$store.getters.selectedStamprally]
        console.log(newValue)
      }
    )
    this.initialLocation = { lat: this.stamprallyData.defaultLat, lng: this.stamprallyData.defaultLng }
    this.markerPos = this.initialLocation
    this.loaded = true
  },
  methods: {
    timeConverter (time) {
      // 時間の表示形式の返還
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return year + '年' + month + '/' + day
    },
    async select_file (e) {
      // 画像ファイル選択後の処理
      this.file = await this.compressImage(e.target.files[0])
      this.imagePreview = URL.createObjectURL(this.file)
    },
    compressImage (file) {
      // 画像の圧縮
      const width = 720
      const height = 720
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-new
        new Compressor(file, {
          convertSize: 50000,
          maxHeight: height,
          maxWidth: width,
          success (result) {
            let file = null
            file = new File([result], result.name, { type: 'image/jpeg' })
            // this.uploader.storagePath[0] = `stamprally/${this.$route.params.id}/userImages/` + result.name
            console.log(file)
            resolve(file)
          },
          error (err) {
            console.log(err.message)
          }
        })
      })
    },
    ping (event) {
      // マップ上にピンを立てる
      if (event) {
        this.markerPos = { lat: event.latLng.lat(), lng: event.latLng.lng() }
      }
    },
    colorHandler (h) {
      // テーマカラーの選択
      this.themeColor = this.hsl2rgb(h, 80, 0.5)
      this.selectedH = h
    },
    hsl2rgb (h, s, l) {
      // テーマカラーのhsl値をRGBに変換
      const a = s * Math.min(l, 1 - l) / 100
      const f = (n) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0')
      }
      return `#${f(0)}${f(8)}${f(4)}`
    },
    createSubColor () {
      // テーマカラーからサブカラーを生成
      const h = this.selectedH
      const s = 80
      const l = 0.85
      const a = s * Math.min(l, 1 - l) / 100
      const f = (n) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0')
      }
      this.subColor = `#${f(0)}${f(8)}${f(4)}`
    },
    confirmChange () {
      // 変更の確定をFirestoreに保存
      if (this.changeTarget === 'name') {
        firestore
          .collection('stamprally')
          .doc(this.$store.getters.selectedStamprally).set({
            name: this.stamprallyData.name
          }, { merge: true }).then(() => {
            this.$store.dispatch('selectStamprallyName', this.stamprallyData.name)
            this.$bvToast.toast('名前を変更しました。', {
              variant: 'info'
            })
          })
      } else if (this.changeTarget === 'logo') {
        firestore
          .collection('stamprally')
          .doc(this.$store.getters.selectedStamprally).set({
            logo: this.stamprallyData.logo
          }, { merge: true }).then(() => {
            this.$bvToast.toast('ロゴ画像を変更しました。', {
              variant: 'info'
            })
            this.file = null
            this.imagePreview = null
          })
      } else if (this.changeTarget === 'date') {
        if (!this.formStart || !this.formEnd) {
          this.$bvToast.toast('日付が入力されていません', {
            variant: 'danger'
          })
        } else {
          firestore
            .collection('stamprally')
            .doc(this.$store.getters.selectedStamprally).set({
              start: new Date(this.formStart + ' 00:00:00'),
              end: new Date(this.formEnd + ' 23:59:59')
            }, { merge: true }).then(() => {
              this.$bvToast.toast('期間を変更しました。', {
                variant: 'info'
              })
              this.formStart = null
              this.formEnd = null
            })
        }
      } else if (this.changeTarget === 'color') {
        if (!this.selectedH) {
          this.$bvToast.toast('色が選択されていません', {
            variant: 'danger'
          })
        } else {
          this.createSubColor()
          firestore
            .collection('stamprally')
            .doc(this.$store.getters.selectedStamprally).set({
              primaryColor: this.themeColor,
              subColor: this.subColor
            }, { merge: true }).then(() => {
              this.$bvToast.toast('テーマカラーを変更しました。', {
                variant: 'info'
              })
              this.selectedH = null
              this.subColor = null
            })
        }
      } else if (this.changeTarget === 'map') {
        if (this.markerPos !== this.initialLocation) {
          firestore
            .collection('stamprally')
            .doc(this.$store.getters.selectedStamprally).set({
              defaultLat: this.markerPos.lat,
              defaultLng: this.markerPos.lng
            }, { merge: true }).then(() => {
              this.$bvToast.toast('中心地点を変更しました。', {
                variant: 'info'
              })
              this.initialLocation = this.markerPos
            })
        }
      } else if (this.changeTarget === 'inquiry') {
        firestore
          .collection('stamprally')
          .doc(this.$store.getters.selectedStamprally).set({
            inquiry: { name: this.stamprallyData.inquiry.name, phone: this.stamprallyData.inquiry.phone, mail: this.stamprallyData.inquiry.mail }
          }, { merge: true }).then(() => {
            this.$bvToast.toast('お問い合わせ先を変更しました。', {
              variant: 'info'
            })
          })
      } else if (this.changeTarget === 'prize') {
        firestore
          .collection('stamprally')
          .doc(this.$store.getters.selectedStamprally).set({
            prize: this.stamprallyData.prize
          }, { merge: true }).then(() => {
            this.$bvToast.toast('景品応募可能回数を変更しました。', {
              variant: 'info'
            })
          })
      } else if (this.changeTarget === 'question') {
        firestore
          .collection('stamprally')
          .doc(this.$store.getters.selectedStamprally).set({
            question: this.stamprallyData.question
          }, { merge: true }).then(() => {
            this.$bvToast.toast('アンケートURLを変更しました。', {
              variant: 'info'
            })
          })
      } else if (this.changeTarget === 'sample') {
        firestore
          .collection('stamprally')
          .doc(this.$store.getters.selectedStamprally).set({
            sample: this.stamprallyData.sample
          }, { merge: true }).then(() => {
            this.$bvToast.toast('サンプル設定を変更しました。', {
              variant: 'info'
            })
          })
      } else if (this.changeTarget === 'stamp') {
        firestore
          .collection('stamprally')
          .doc(this.$store.getters.selectedStamprally).set({
            stamp: this.stamprallyData.stamp
          }, { merge: true }).then(() => {
            this.$bvToast.toast('スタンプ取得可能回数を変更しました。', {
              variant: 'info'
            })
          })
      }
      this.changeTarget = null
    },
    uploadImage () {
      // 画像をFirebase storageにアップロード
      if (!this.file) {
        this.$bvToast.toast('画像が選択されていません', {
          variant: 'danger'
        })
      } else if (this.file.size / 1000 > 1000) {
        this.$bvToast.toast(`ファイルサイズが大きすぎます(${this.file.size / 1000} KB)`, { variant: 'danger' })
      } else if (!['image/jpeg', 'image/png', 'image/jpg', 'image/jfif'].includes(this.file.type)) {
        this.$bvToast.toast('使用できるファイル形式は，.jpeg/.jpg/.png/.jfifです', { variant: 'danger' })
      } else {
        this.uploading = true
        const storageRef = ref(getStorage(), `stamprally/${this.$store.getters.selectedStamprally}/` + this.file.name)
        const uploadTask = uploadBytesResumable(storageRef, this.file)
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
            }
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break
              case 'storage/canceled':
                // User canceled the upload
                break

                // ...

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL)
              this.stamprallyData.logo = downloadURL
              this.confirmChange()
              this.uploading = false
            })
          })
      }
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 10px
}
::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, .3);
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, .3);
}
label {
  font-size: 14px;
}
</style>
