<template>
  <!--コンソール画面-->
  <div id="app" class="scroll-lock">
    <Navbar />
    <body class="mx-1" style="background-color: #fafafa; color: dimgrey">
      <b-container v-if="$store.state.selected" fluid style="margin-top: 15px; background-color: #fafafa">
        <b-tabs pills content-class="mt-3">
          <b-tab class="tabs" title="統計" style="height: 88vh; overflow: auto" active>
            <Statistics v-if="loaded" />
          </b-tab>
          <b-tab class="tabs" title="イベント設定" style="height: 88vh; overflow: auto">
            <Settings v-if="loaded" />
          </b-tab>
          <b-tab class="tabs" title="スポット設定" style="height: 88vh; overflow: auto">
            <Stamps v-if="loaded" />
          </b-tab>
          <b-tab class="tabs" title="コース管理" style="height: 88vh; overflow: auto">
            <Course v-if="loaded" />
          </b-tab>
          <b-tab class="tabs" title="景品" style="height: 88vh; overflow: auto">
            <Prize v-if="loaded" />
          </b-tab>
          <b-tab class="tabs" title="応募者リスト" style="height: 88vh; overflow: auto">
            <AppliedList v-if="loaded" />
          </b-tab>
          <b-tab class="tabs" title="広告" style="height: 88vh; overflow: auto">
            <Ads v-if="loaded" />
          </b-tab>
          <b-tab class="tabs" title="投稿写真" style="height: 88vh; overflow: auto">
            <UsersPhoto v-if="loaded" />
          </b-tab>
        </b-tabs>
      </b-container>
      <b-container v-else class="py-1" style="border-radius: 3px; background-color: #fafafa; font-family: 'Noto Sans JP', sans-serif !important;">
        <h3 v-if="!Object.entries(stamprally).length">
          登録されたスタンプラリーはありません
        </h3>
        <h3 v-else>
          登録済みのスタンプラリー
        </h3>
        <b-row class="d-flex">
          <b-col class="col-4 my-3">
            <b-button
              variant="outline-primary"
              style="border-width: 3px; border-radius: 15px; height: 100%; min-height: 80px"
              block
              @click="createStamprally()"
            >
              <fa :icon="faPlus" style="font-size: 30px" />
            </b-button>
          </b-col>
          <b-col
            v-for="rallies in stamprally"
            :key="rallies.id"
            class="col-4 my-3"
          >
            <b-card
              class="shadow-sm stamprallyCard"
              style="width: 100%; border-radius: 15px; background-color: #fafafa"
            >
              <div class="d-flex">
                <b-card-title>
                  {{ rallies.name }}
                </b-card-title>
                <p class="ml-auto col-1" style="border-radius: 50%; width: 30px; height: 30px" :style="{backgroundColor: rallies.primaryColor}" />
              </div>
              <b-card-text class="my-auto">
                開催期間：
              </b-card-text>
              <div class="d-flex">
                <p style="font-size: 20px">
                  {{ rallies.startDate }}
                </p>&nbsp;~&nbsp;<p style="font-size: 20px">
                  {{ rallies.endDate }}
                </p>
              </div>
              <b-button
                variant="primary"
                style="border: none"
                size="sm"
                @click="select(rallies.id, rallies.name)"
              >
                コンソールへ
              </b-button>
              <b-button variant="outline-primary" size="sm" :to="{ name: 'stamprally-id', params: { id: rallies.id } }" target="_blank">
                ページを開く
              </b-button>
            </b-card>
          </b-col>
        </b-row>
        <!--新規スタンプラリー作成のポップアップ-->
        <b-modal id="new" hide-footer centered no-close-on-backdrop no-close-on-esc>
          <template #modal-title>
            新規作成
          </template>
          <div v-if="!loading && page===1">
            <b-form-group class="mb-2">
              <label for="title">タイトル</label>
              <b-form-input id="title" v-model="title" class="col-9" />
              <label for="term" class="mt-3">開催期間</label>
              <div class="d-flex">
                <b-form-datepicker
                  id="term"
                  v-model="formStart"
                  class="col-5"
                  :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                  locale="jp"
                />
                <p class="col-1 align-content-center">
                  ～
                </p>
                <b-form-datepicker
                  id="term2"
                  v-model="formEnd"
                  class="col-5"
                  :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                  locale="ja"
                />
              </div>
              <label for="color" class="mt-3">テーマカラー</label>
              <div class="d-flex flex-wrap">
                <b-button
                  v-for="h in hsl"
                  :key="h.index"
                  class="m-2"
                  style="border: none; border-radius: 50%; width: 40px; height: 40px"
                  :style="{backgroundColor: hsl2rgb(Number(h), 80, 0.5)}"
                  @click="colorHandler(h)"
                />
              </div>
              <label for="image" class="mt-3">ロゴ画像(500px X 500px以上を推奨)</label>
              <div class="px-2">
                <b-form-file accept="image/jpeg, image/png" @change="select_file" />
                <b-img v-if="imagePreview" :src="imagePreview" alt="logo" class="my-2" style="height: 200px; max-width: 100%" />
              </div>
            </b-form-group>
            <b-button
              block
              size="lg"
              style="border: none; border-radius: 5px"
              :style="{backgroundColor: themeColor}"
              class="mt-4"
              @click="uploadHandler()"
            >
              次へ
            </b-button>
          </div>
          <div v-else-if="!loading && page===2">
            <b-button
              block
              size="lg"
              style="border: none; border-radius: 5px"
              :style="{backgroundColor: themeColor}"
              class="mt-4"
              @click="confirmCreate()"
            >
              作成
            </b-button>
          </div>
          <div v-else-if="loading" class="text-center my-3">
            <b-spinner
              style="width: 3rem; height: 3rem;"
              :style="{color: themeColor}"
            />
            <h5 class="my-2">
              {{ statusMessage }}
            </h5>
          </div>
        </b-modal>
      </b-container>
    </body>
  </div>
</template>

<script>
import { faPlus } from '@fortawesome/free-solid-svg-icons'
// import { ColorPicker } from 'vue-color-gradient-picker'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import Compressor from 'compressorjs'
import Navbar from '../../components/Navbar'
import { firestore } from '../../plugin/firebase'
import Statistics from '../../components/Statistics'
import AppliedList from '../../components/AppliedList'
import Stamps from '../../components/Stamps'
import Ads from '../../components/Advertise'
import Settings from '../../components/EventSettings'
import UsersPhoto from '../../components/UsersPhoto'
import Prize from '../../components/Prize'
import Course from '../../components/Course'

export default {
  components: { Navbar, Statistics, AppliedList, Stamps, Ads, Settings, UsersPhoto, Prize, Course },
  data () {
    return {
      uid: this.$store.getters.user._delegate.uid,
      users: {},
      loaded: false,
      stamprally: {},
      title: '',
      formStart: '',
      formEnd: '',
      colorPallet: [
        '#F2320C', '#F2960C', '#F2E60C', '#74F20C', '#0CF223', '#0CF2AD', '#0CADF2', '#700CF2'
      ],
      // hsl: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
      hsl: [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350],
      selectedH: '',
      themeColor: '#696969',
      subColor: '',
      newId: null,
      page: 1,
      file: null,
      imagePreview: null,
      imageURL: null,
      loading: false,
      statusMessage: ''
    }
  },
  computed: {
    faPlus () {
      return faPlus
    }
  },
  watch: {
    users (newVal) {
      this.$store.dispatch('setUsers', newVal)
      console.log('update')
    }
  },
  async created () {
    // firestoreからスタンプラリー情報を取得
    const _this = this
    await firestore
      .collection('stamprally')
      .where('uid', '==', this.uid)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.stamprally, doc.id, doc.data())
          const createdAt = _this.timeConverter(
            doc.data().start.seconds * 1000
          )
          _this.$set(_this.stamprally[doc.id], 'startDate', createdAt)
          const createdAt2 = _this.timeConverter(
            doc.data().end.seconds * 1000
          )
          _this.$set(_this.stamprally[doc.id], 'endDate', createdAt2)
        })
        _this.$store.dispatch('setStamprally', _this.stamprally)
      })
    setTimeout(this.loadComplete, 1000)
  },
  mounted () {
  },
  methods: {
    onChange (attrs, name) {
      this.color = { ...attrs }
    },
    async select_file (e) {
      // 画像選択後の処理
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
            console.log(file)
            resolve(file)
          },
          error (err) {
            console.log(err.message)
          }
        })
      })
    },
    colorHandler (h) {
      // テーマカラーの選択
      this.themeColor = this.hsl2rgb(h, 80, 0.5)
      this.selectedH = h
    },
    timeConverter (time) {
      // 時間表記の変換
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return year + '年' + month + '/' + day
    },
    loadComplete () {
      // ロード完了
      this.loaded = true
    },
    select (id, name) {
      // スタンプラリー選択
      console.log(id)
      this.$store.dispatch('selectStamprally', id)
      this.$store.dispatch('selectStamprallyName', name)
    },
    createStamprally () {
      // スタンプラリーの新規作成
      this.$bvModal.show('new')
    },
    createId () {
      // IDの生成
      const length = 20
      const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let r = ''
      for (let i = 0; i < length; i++) {
        r += c[Math.floor(Math.random() * c.length)]
      }
      return r
    },
    hsl2rgb (h, s, l) {
      // 色のhslをRGBに変換
      const a = s * Math.min(l, 1 - l) / 100
      const f = (n) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0')
      }
      return `#${f(0)}${f(8)}${f(4)}`
    },
    createSubColor () {
      // メインカラーからサブカラーの生成
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
    async uploadHandler () {
      // 画像のサイズと形式チェック
      if (this.themeColor === '#696969' || !this.formEnd || !this.formStart || !this.title || !this.file) {
        this.$bvToast.toast('必要事項を入力してください', { variant: 'danger' })
      } else if (this.file.size / 1000 > 1000) {
        this.$bvToast.toast(`ファイルサイズが大きすぎます(${this.file.size / 1000} KB)`, { variant: 'danger' })
      } else if (!['image/jpeg', 'image/png', 'image/jpg', 'image/jfif'].includes(this.file.type)) {
        this.$bvToast.toast('使用できるファイル形式は，.jpeg/.jpg/.png/.jfifです', { variant: 'danger' })
      } else {
        this.statusMessage = '画像をアップロードしています...'
        this.loading = true
        this.createSubColor()
        this.newId = this.createId()
        await this.uploadImage(this.newId)
      }
    },
    uploadImage (id) {
      // firebase storageに画像をアップロード
      const storageRef = ref(getStorage(), `stamprally/${id}/` + this.file.name)
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
            this.imageURL = downloadURL
            this.file = null
            this.loading = false
            this.page++
          })
        })
    },
    async confirmCreate () {
      // firestoreにスタンプラリー情報をアップロード
      this.statusMessage = 'スタンプラリーを作成しています...'
      this.loading = true
      await firestore
        .collection('stamprally')
        .doc(this.newId).set({
          name: this.title,
          start: new Date(this.formStart + ' 00:00:00'),
          end: new Date(this.formEnd + ' 23:59:59'),
          primaryColor: this.themeColor,
          id: this.newId,
          created: new Date(),
          defaultLat: 36,
          defaultLng: 140,
          uid: this.uid,
          subColor: this.subColor,
          logo: this.imageURL
          // inquiry: { mail: '', name: this.$store.getters.userName, phone: '' }
        })
      this.$bvToast.toast('スタンプラリーを作成しました．', { variant: 'info' })
      this.$bvModal.hide('new')
      this.newId = null
      this.page = 1
      this.statusMessage = ''
      this.imagePreview = null
      this.loading = false
    }
  }
}
</script>
<style>
.tabs {
  font-family: 'Noto Sans JP', sans-serif !important;
}
.stamprallyCard {
  font-family: 'Noto Sans JP', sans-serif !important;
}
#new {
  font-family: 'Noto Sans JP', sans-serif !important;
}
#app {
  background-color: #fafafa;
  font-family: 'Noto Sans JP', sans-serif !important;
}
.scroll-lock {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
