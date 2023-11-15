<template>
  <!--コンソールでの広告管理-->
  <b-container class="py-0" style="border-radius: 3px; height: 88vh; overflow: scroll">
    <b-row class="d-flex mb-3">
      <!--画面の左半分-->
      <b-col class="col-6 my-3">
        <b-button
          id="tooltip2"
          variant="outline-primary"
          class="my-3"
          style="border-width: 3px; height: 60px"
          block
          @click="createEvent()"
        >
          <fa :icon="faPlus" style="font-size: 20px" />
        </b-button>
        <b-tooltip target="tooltip2" triggers="hover">
          新規追加
        </b-tooltip>
        <div style="overflow: scroll; height: 39rem">
          <b-list-group>
            <b-list-group-item
              v-for="event in events"
              :key="event.id"
              button
              class="d-flex"
              @click="openInfo(event.id)"
            >
              {{ event.title }}
              <fa :icon="faTrash" class="ml-auto mr-3 mt-1" style="font-size: 18px" @click="openModal(event.id)" />
            </b-list-group-item>
          </b-list-group>
        </div>
        <!--削除確認のポップアップ-->
        <b-modal id="deleteE" size="sm" hide-header hide-footer centered>
          <div v-if="deleteId" class="text-center mt-4 mb-2" style="font-family: 'Noto Sans JP', sans-serif !important;">
            <h4>{{ events[deleteId].title }}</h4>
            <h4>を削除しますか？</h4>
            <div class="mt-4">
              <b-button class="mx-2" variant="primary" @click="deleteEvent(deleteId)">
                はい
              </b-button>
              <b-button class="mx-2" variant="outline-primary" @click="$bvModal.hide('deleteE')">
                いいえ
              </b-button>
            </div>
          </div>
        </b-modal>
      </b-col>
      <!--画面の右半分-->
      <b-col class="col-6 my-3" style="overflow: scroll; height: 45rem">
        <div v-if="upload" class="text-center align-items-center">
          <b-spinner label="Spinning" variant="primary" style="width: 5rem; height: 5rem;" class="my-3" />
          <h5 class="my-3">アップロード中です...</h5>
        </div>
        <div v-else>
          <h5 class="mt-4">
            広告情報
          </h5>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="title">広告<br>タイトル：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="title" v-model="formTitle" />
            </b-col>
          </b-row>
          <b-row class="d-flex align-items-center mt-4">
            <b-col class="col-3">
              <label for="date">掲載期間：</label>
            </b-col>
            <b-col class="col-4">
              <b-form-datepicker
                id="date"
                v-model="formStart"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                size="sm"
                locale="jp"
              />
            </b-col>
            <b-col class="col-1 align-content-center">
              <p>～</p>
            </b-col>
            <b-col class="col-4">
              <b-form-datepicker
                id="date2"
                v-model="formEnd"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                size="sm"
                min="minDate"
                max="maxDate"
                locale="ja"
              />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="text">説明：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-textarea
                id="text"
                v-model="formText"
                rows="3"
                max-rows="10"
                style="height: 240px; overflow: auto;"
              />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="webURL">ウェブサイトURL：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="webURL" v-model.number="formURL" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="image">画像：</label>
            </b-col>
            <b-col class="col-9">
              <b-img-lazy v-if="croppedImg" :src="croppedImg" class="my-2" style="height: 120px" />
              <b-img-lazy v-else-if="formImage" :src="formImage" class="my-2" style="height: 120px" />
              <b-form-file accept="image/jpeg, image/png" @change="select_file" />
            </b-col>
          </b-row>
          <b-row class="text-center mt-5 mb-3">
            <b-col>
              <b-button v-if="edit" variant="primary" size="lg" @click="uploadImage()">
                変更の確定
              </b-button>
              <b-button v-else variant="secondary" disabled size="lg">
                変更の確定
              </b-button>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
    <!--広告画像の切り抜きのポップアップ-->
    <b-modal id="crop" hide-footer centered no-close-on-backdrop no-close-on-esc>
      <template #modal-title>
        画像の切り抜き
      </template>
      <div>
        <VueCropper
          ref="cropper"
          :guides="true"
          :max-container-height="300"
          :rotatable="false"
          :img-style="{ 'width': '500px', 'height': '400px' }"
          :src="imagePreview"
          :aspect-ratio="1048 / 480"
          drag-mode="crop"
        />
        <b-button v-if="!imagePreview" class="mt-3" disabled block>
          確定
        </b-button>
        <b-button v-else class="mt-3" variant="primary" block @click="cropImage">
          確定
        </b-button>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
// import firebase from 'firebase/compat/app'
import Compressor from 'compressorjs'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { firestore } from '../plugin/firebase'
// import firebase from 'firebase/compat'

export default {
  name: 'Events',
  components: { VueCropper },
  data () {
    return {
      loaded: false,
      windowHeight: window.innerHeight,
      events: {},
      composing: false,
      edit: null,
      deleteId: null,
      upload: false,
      formTitle: '',
      formText: '',
      formDesc: '',
      formStart: null,
      formEnd: null,
      formURL: '',
      formImage: null,
      file: null,
      imagePreview: null,
      croppedImg: null,
      uploadImg: '',
      imagePath: null
    }
  },
  computed: {
    faPlus () {
      return faPlus
    },
    faTrash () {
      return faTrash
    }
  },
  async created () {
    // Firestoreから広告情報の取得
    const _this = this
    await firestore
      .collection('advertise')
      .where('stamprallyId', '==', this.$store.getters.selectedStamprally)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.events, doc.id, doc.data())
          const startDate = _this.timeConverter(doc.data().start.seconds * 1000)
          _this.$set(_this.events[doc.id], 'start', startDate)
          const endDate = _this.timeConverter(doc.data().end.seconds * 1000)
          _this.$set(_this.events[doc.id], 'end', endDate)
        })
      })
    console.log(this.events)
    this.loaded = true
  },
  methods: {
    // 時間をDate形式に変換
    timeConverter (time) {
      return new Date(time)
    },
    async select_file (e) {
      // 広告画像の選択
      this.file = await this.compressImage(e.target.files[0])
      this.imagePreview = URL.createObjectURL(this.file)
      await this.$bvModal.show('crop')
    },
    compressImage (file) {
      // 画像の圧縮
      const width = 720
      const height = 720
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-new
        new Compressor(file, {
          convertSize: 500000,
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
    cropImage () {
      // 画像の切り抜き
      this.$refs.cropper.getCroppedCanvas().toBlob((b) => {
        const file = new File([b], this.edit + '_image.jpg', { type: 'image/jpeg' })
        this.croppedImg = URL.createObjectURL(file)
        this.file = file
        this.$bvModal.hide('crop')
        console.log(file)
      }, 'image/jpeg')
    },
    openInfo (id) {
      // 広告情報の表示
      this.edit = id
      this.file = null
      this.imagePreview = null
      this.croppedImg = null
      if (this.events[id].path.length) {
        this.imagePath = this.events[id].path
      } else { this.imagePath = '' }
      this.formTitle = this.events[id].title
      this.formText = ''
      for (let i = 0; i < this.events[id].text.length; i++) {
        this.formText += this.events[id].text[i] + '\n'
      }
      this.formDesc = this.events[id].desc
      this.formURL = this.events[id].url
      this.formStart = (this.events[id].start).getFullYear() + '-' + ((this.events[id].start).getMonth() + 1) + '-' + (this.events[id].start).getDate()
      this.formEnd = (this.events[id].end).getFullYear() + '-' + ((this.events[id].end).getMonth() + 1) + '-' + (this.events[id].end).getDate()
      if (this.events[id].image) {
        this.formImage = this.events[id].image
      } else {
        this.formImage = null
      }
      // console.log(this.formStart, this.formEnd)
    },
    createId () {
      // 広告登録時のIDの生成
      const length = 20
      const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let r = ''
      for (let i = 0; i < length; i++) {
        r += c[Math.floor(Math.random() * c.length)]
      }
      return r
    },
    createEvent () {
      // 広告の新規作成
      const newId = this.createId()
      this.edit = newId
      const data = {
        title: '新しい広告',
        id: newId,
        path: '',
        desc: '',
        url: '',
        text: [],
        image: '',
        thumbnail: '',
        start: new Date(2021, 10, 1),
        end: new Date(2021, 10, 1, 23, 59, 59)
      }
      this.$set(this.events, newId, data)
      this.openInfo(newId)
    },
    uploadImage () {
      // 画像をFirebase Storageにアップロード
      this.upload = true
      if (this.file) {
        if (this.file.size / 1000 > 5000) {
          this.$bvToast.toast(`ファイルサイズが大きすぎます(${this.file.size / 1000} KB)`, { variant: 'danger' })
          this.upload = false
        } else {
          const url = `stamprally/${this.$store.getters.selectedStamprally}/advertise/` + this.file.name
          const storageRef = ref(getStorage(), url)
          this.imagePath = url
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
                this.uploadImg = downloadURL
                this.uploadEvent(this.edit)
              })
            })
        }
      } else {
        this.uploadEvent(this.edit)
      }
    },
    async uploadEvent (id) {
      // 広告情報をFirestoreにアップロード
      this.edit = null
      const splitText = this.formText.split('\n')
      if (this.uploadImg === '') {
        this.uploadImg = this.formImage
      }
      const data = {
        title: this.formTitle,
        id,
        path: this.imagePath,
        image: this.uploadImg,
        stamprallyId: this.$store.getters.selectedStamprally,
        url: this.formURL,
        text: splitText,
        start: new Date(this.formStart + ' 00:00:00'),
        end: new Date(this.formEnd + ' 23:59:59'),
        added: new Date()
      }
      // console.log(data.start, data.end, (data.end).getTime())
      if ((data.end).getTime() - (data.start).getTime() <= 0) {
        this.$bvToast.toast('期間が不正です', {
          variant: 'danger'
        })
        this.upload = false
        return
      }
      await firestore
        .collection('advertise')
        .doc(id)
        .set(data, { merge: true })
      this.$set(this.events, id, data)
      this.$bvToast.toast(this.formTitle + ' を追加しました。', {
        variant: 'info'
      })
      this.uploadImg = ''
      this.imagePath = null
      this.upload = false
      // console.log(this.events)
    },
    openModal (id) {
      // ポップアップを表示
      this.deleteId = id
      this.$bvModal.show('deleteE')
    },
    async deleteEvent (id) {
      // 広告の画像と情報の削除
      this.$bvModal.hide('deleteE')
      const deleteName = this.events[id].title
      if (this.imagePath.length) {
        const storageRef = ref(getStorage(), this.imagePath)
        await deleteObject(storageRef)
      }
      await firestore
        .collection('advertise')
        .doc(id)
        .delete()
      this.$delete(this.events, id)
      this.deleteId = null
      this.formTitle = ''
      this.formText = []
      this.formDesc = ''
      this.formURL = ''
      this.formStart = null
      this.formEnd = null
      this.file = null
      this.imagePreview = null
      this.croppedImg = null
      this.imagePath = null
      this.edit = null
      this.$bvToast.toast(deleteName + ' を削除しました。', {
        variant: 'info'
      })
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
