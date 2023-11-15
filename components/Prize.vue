<template>
  <!--景品情報の設定（コンソール）-->
  <b-container class="py-0" style="border-radius: 3px; height: 88vh; overflow: scroll">
    <b-row class="d-flex mb-3">
      <!--左半分（一覧とプレビュー）-->
      <b-col class="col-6 my-3">
        <div class="px-1">
          <b-button
            id="tooltip3"
            variant="outline-primary"
            class="col-8 px-2 my-2"
            style="border-width: 3px; height: 80px"
            block
            @click="createPrize()"
          >
            <fa :icon="faPlus" style="font-size: 20px" />
          </b-button>
          <b-tooltip target="tooltip3" triggers="hover">
            新規追加
          </b-tooltip>
          <div v-for="prize in prizes" :key="prize.id" class="col-8 px-2 mx-0">
            <div class="item p-0 my-2" @click="openInfo(prize.id)">
              <div class="p-3">
                <div class="d-flex">
                  <h5 class="title">
                    {{ prize.name }}
                  </h5>
                </div>
                <div>
                  <p v-if="prize.type==='ticket'" style="font-size: 14px">
                    その場で引き換えて使用できる電子チケットです
                  </p>
                  <p v-else-if="prize.type==='form'" style="font-size: 14px">
                    応募すると抽選で景品が当たります
                  </p>
                </div>
                <div class="d-flex align-items-center" style="font-size: 14px; color: dimgrey">
                  <p>スタンプが</p>
                  <p class="mx-1" style="font-size: 16px">
                    {{ prize.required }}
                  </p>
                  <p>pt必要</p>
                  <div class="d-flex ml-auto">
                    <b-button
                      v-if="prize.id===edit"
                      variant="danger"
                      disabled
                      size="sm"
                      class="mx-2"
                      style="border-radius: 6px"
                      block
                    >
                      編集中
                    </b-button>
                    <b-button variant="outline-primary" size="sm" class="mx-2" style="border-radius: 6px; white-space: nowrap" @click="showDetail(prize.id)">
                      詳細
                    </b-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-col>
      <!--右半分（編集画面）-->
      <b-col class="col-6 my-3" style="overflow: scroll; height: 45rem">
        <div v-if="upload" class="text-center align-items-center">
          <b-spinner type="grow" label="Spinning" style="width: 3rem; height: 3rem;" class="my-3" />
        </div>
        <div v-else>
          <div class="d-flex align-items-center mt-4">
            <h5 class="mr-auto">
              景品情報
            </h5>
            <b-button class="mr-1 my-0" style="background-color: #fafafa; border: none" @click="$bvModal.show('deletePrize')">
              <fa :icon="faTrash" style="font-size: 20px; color: dimgrey" />
            </b-button>
          </div>
          <b-row class="d-flex align-items-center mt-3">
            <b-col class="col-3">
              <label for="name">景品の表示名：</label>
            </b-col>
            <b-col class="col-6">
              <b-form-input id="name" v-model="form.name" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="text">景品の説明：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-textarea id="text" v-model="form.text" rows="6" max-rows="10" style="overflow: auto" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="required">引き換えに必要なスタンプ数：</label>
            </b-col>
            <b-col class="col-3">
              <b-form-input id="required" v-model.number="form.required" type="number" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="type">景品の方式：</label>
            </b-col>
            <div class="col-9 px-0">
              <b-col class="col-6">
                <b-form-select id="type" v-model="form.type" :options="[{value: 'form', text: 'フォーム'},{value: 'ticket', text: '電子チケット'}]" />
              </b-col>
              <div class="col-12 mt-2">
                <p style="font-size: 12px">
                  {{ typeOptions[form.type] }}
                </p>
              </div>
            </div>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="image">画像：</label>
            </b-col>
            <b-col v-if="!imageLoading" class="col-9">
              <div v-if="form.imagePreview && form.imagePreview.length">
                <div v-for="(image, index) in form.imagePreview" :key="index" class="d-flex">
                  <b-img-lazy :src="image" class="my-2" style="max-height: 250px; max-width: 100%" />
                  <b-button
                    v-if="form.deletePath.length"
                    size="sm"
                    variant="danger"
                    class="ml-auto"
                    style="font-size: 14px; white-space: nowrap"
                    @click="deleteImage(edit, index)"
                  >
                    削除
                  </b-button>
                </div>
              </div>
              <div
                v-else
                class="my-2 text-center"
                style="height: 200px; width: 100%; border-radius: 5px; background-color: #efefef; padding-top: 90px"
              >
                <span>
                  画像がありません
                </span>
              </div>
              <div class="d-flex">
                <b-form-file ref="stampImage" accept="image/jpeg, image/png" placeholder="クリックして画像を追加" class="mr-1" @change="select_file" />
              </div>
            </b-col>
          </b-row>
          <b-row class="text-center mt-5 mb-3">
            <b-col>
              <b-button v-if="imageUploading" variant="secondary" disabled size="lg">
                画像をアップロード中
              </b-button>
              <b-button v-else-if="edit" variant="primary" size="lg" @click="uploadImage(edit)">
                変更の確定
              </b-button>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
    <!--プレビューの詳細表示のポップアップ-->
    <b-modal id="detail" size="sm" centered hide-footer hide-header>
      <div class="p-2" style="color: #333333">
        <h5 class="my-2" style="font-weight: bold">
          {{ detail.name }}
        </h5>
        <div v-for="(img, index) in detail.image" :key="index">
          <b-img-lazy v-if="index===page" :src="img" style="width: 100%" />
        </div>
        <div v-if="imgLength !== 0" class="d-flex align-items-center justify-content-center">
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
    <!--削除確認のポップアップ-->
    <b-modal id="deletePrize" size="sm" hide-header hide-footer centered>
      <div v-if="edit" class="text-center mt-4 mb-2" style="font-family: 'Noto Sans JP', sans-serif !important;">
        <h4>{{ prizes[edit].name }}</h4>
        <h4>を削除しますか？</h4>
        <div class="mt-4">
          <b-button class="mx-2" variant="primary" @click="deletePrize(edit)">
            はい
          </b-button>
          <b-button class="mx-2" variant="outline-primary" @click="$bvModal.hide('deletePrize')">
            いいえ
          </b-button>
        </div>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import { faPlus, faTrash, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import firebase from 'firebase/compat/app'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import Compressor from 'compressorjs'
import { firestore } from '../plugin/firebase'

export default {
  name: 'Prize',
  data () {
    return {
      loaded: false,
      upload: false,
      imageUploading: false,
      imageLoading: false,
      prizes: {},
      detail: {},
      page: 0,
      imgLength: 0,
      edit: null,
      form: {
        name: '',
        desc: '',
        text: '',
        required: 0,
        image: [],
        imagePreview: [],
        deletePath: [],
        type: 'form'
      },
      typeOptions: {
        form: '応募フォームに，名前・住所・連絡先等必要事項を入力して応募します。',
        ticket: 'その場で画面上に表示して使う電子チケットに引き換えます。'
      },
      file: {
        image: [],
        storagePath: []
      }
    }
  },
  computed: {
    faPlus () {
      return faPlus
    },
    faTrash () {
      return faTrash
    },
    faArrowRight () {
      return faArrowRight
    },
    faArrowLeft () {
      return faArrowLeft
    },
    faQuestionCircle () {
      return faQuestionCircle
    }
  },
  async created () {
    // firestoreから景品情報を取得
    const _this = this
    await firestore
      .collection('prizes')
      .where('stamprallyId', '==', this.$store.getters.selectedStamprally)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.prizes, doc.id, doc.data())
        })
      })
    console.log(this.prizes)
    this.loaded = true
  },
  methods: {
    showDetail (id) {
      // 該当idのプレビューの詳細を表示
      this.detail = {}
      this.detail = this.prizes[id]
      this.page = 0
      if (this.detail.image) {
        this.imgLength = this.detail.image.length
      } else {
        this.imgLength = 0
      }
      this.$bvModal.show('detail')
    },
    createId (length) {
      // 新規作成時のIDの生成
      const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let r = ''
      for (let i = 0; i < length; i++) {
        r += c[Math.floor(Math.random() * c.length)]
      }
      return r
    },
    createPrize () {
      // 新規作成
      const newId = this.createId(20)
      this.edit = newId
      const data = {
        name: '新しい景品',
        status: 'new',
        desc: '',
        required: 0,
        id: newId,
        text: [],
        type: 'form',
        image: [],
        path: [],
        stamprallyId: this.$store.getters.selectedStamprally
      }
      this.$set(this.prizes, newId, data)
      this.openInfo(newId)
    },
    openInfo (id) {
      // 選択したidの情報を表示
      this.edit = id
      this.form.name = this.prizes[id].name
      this.form.desc = this.prizes[id].desc
      this.form.text = ''
      for (let i = 0; i < this.prizes[id].text.length; i++) {
        this.form.text += this.prizes[id].text[i]
        if (i !== (this.prizes[id].text.length - 1)) {
          this.form.text += '\n'
        }
      }
      this.form.required = this.prizes[id].required
      this.form.type = this.prizes[id].type
      if (this.prizes[id].image) {
        this.form.image = this.prizes[id].image
        this.form.imagePreview = this.form.image
      } else {
        this.form.image = []
        this.form.imagePreview = []
      }
      if (this.prizes[id].path) {
        this.form.deletePath = this.prizes[id].path
      } else { this.form.deletePath = [] }
      this.file = { image: [], storagePath: [] }
      console.log(this.form)
    },
    async select_file (e) {
      // 画像ファイル選択後の処理
      this.imageLoading = true
      const key = Math.random().toString(36).slice(-6) // ファイル名重複回避のためのやつ
      const compressed = await this.compressImage(e.target.files[0], 'image', key)
      this.file.image.push(compressed)
      this.form.imagePreview.push(URL.createObjectURL(compressed))
      this.imageLoading = false
      // this.uploadImage()
    },
    compressImage (file, type) {
      // 画像の圧縮
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
              file = new File([result], 'thumbnail_' + result.name, { type: 'image/jpeg' })
            } else {
              file = new File([result], result.name, { type: 'image/jpeg' })
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
    uploadImage (id) {
      // 画像をfirebase storageにアップロード
      this.upload = true
      if (this.file.image.length) {
        const uploader = this.file.image
        let promises = []
        promises = uploader.map((img, index) => {
          const url = `stamprally/${this.$store.getters.selectedStamprally}/prizes/` + img.name
          const storageRef = ref(getStorage(), url)
          this.file.storagePath.push(url)
          this.form.deletePath.push(url)
          return uploadBytesResumable(storageRef, img)
            .then(snapshot => getDownloadURL(snapshot.ref))
            .catch(error => console.log(error.message))
        })
        Promise.all(promises).then((URLlist) => {
          this.form.image = URLlist
          this.uploadPrize(id)
        }).catch((error) => {
          console.log(error.message)
        })
      } else {
        this.uploadPrize(id)
      }
    },
    async uploadPrize (id) {
      // 景品情報をfirestoreにアップロード
      const splitText = this.form.text.split('\n')
      const data = {
        name: this.form.name,
        desc: this.form.desc,
        id,
        text: splitText,
        required: this.form.required,
        type: this.form.type,
        path: this.form.deletePath,
        stamprallyId: this.$store.getters.selectedStamprally
      }
      if (this.prizes[id].status === 'new') {
        this.$set(data, 'created', new Date())
      } else {
        this.$set(data, 'updated', new Date())
      }
      await firestore
        .collection('prizes')
        .doc(id)
        .set(data, { merge: true })
      const n = this.form.image.length
      for (let i = 0; i < n; i++) {
        console.log(this.form.image[i])
        await firestore
          .collection('prizes')
          .doc(id)
          .update({
            image: firebase.firestore.FieldValue.arrayUnion(this.form.image[i])
          })
      }
      // const dataAdd = { ...data, image: this.form.image }
      this.file = { image: [], storagePath: [] }
      // this.$set(this.prizes, id, dataAdd)
      if (this.prizes[id].status === 'new') {
        this.$bvToast.toast(this.form.name + ' を追加しました。', {
          variant: 'info'
        })
      } else {
        this.$bvToast.toast(this.form.name + ' を変更しました。', {
          variant: 'info'
        })
      }
      this.openInfo(id)
      this.upload = false
    },
    deletePrize (id) {
      // 景品の削除
      this.$bvModal.hide('deletePrize')
      let promises = []
      if (this.prizes[id].path && this.prizes[id].path.length) {
        promises = this.prizes[id].path.map((img, index) => {
          const storageRef = ref(getStorage(), img)
          return deleteObject(storageRef)
            .catch(error => console.log(error.message))
        })
        Promise.all(promises).then(() => this.deletePrizeInfo(id))
          .catch((error) => {
            console.log(error.message)
          })
      } else { this.deletePrizeInfo(id) }
    },
    deleteImage (id, index) {
      // 画像をfirebase storageから削除
      if (this.form.deletePath.length) {
        const storageRef = ref(getStorage(), this.form.deletePath[index])
        return deleteObject(storageRef).then(async () => {
          await firestore
            .collection('prizes')
            .doc(id)
            .update({
              image: firebase.firestore.FieldValue.arrayRemove(this.form.image[index]),
              path: firebase.firestore.FieldValue.arrayRemove(this.form.deletePath[index])
            })
          this.form.image = this.form.image.splice(index, 1)
          this.form.deletePath = this.form.deletePath.splice(index, 1)
          this.$bvToast.toast('画像を削除しました．', {
            variant: 'info'
          })
          this.openInfo(id)
        })
      }
    },
    async deletePrizeInfo (id) {
      // 景品情報をfirestoreから削除
      const deleteName = this.prizes[id].name
      await firestore
        .collection('prizes')
        .doc(id)
        .delete()
      this.$delete(this.prizes, id)
      this.form = {
        name: '',
        desc: '',
        text: '',
        required: 0,
        image: [],
        deletePath: [],
        type: 'form'
      }
      this.edit = null
      this.file = { image: [], storagePath: [] }
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
#detail {
  font-family: 'Noto Sans JP', sans-serif !important;
}
.item {
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
</style>
