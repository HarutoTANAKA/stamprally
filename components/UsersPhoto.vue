<template>
  <!--投稿写真の管理（コンソール）-->
  <b-container class="py-0" style="border-radius: 3px; height: 88vh">
    <b-row v-if="loaded && !Object.entries(photos).length" class="d-flex mb-3">
      <!--左半分（一覧）-->
      <b-col class="d-flex justify-content-center my-4">
        <h3>写真はまだ投稿されていないようです。</h3>
      </b-col>
    </b-row>
    <b-row v-else class="d-flex mb-3">
      <b-col class="col-6 my-3">
        <div style="overflow: scroll; height: 44rem">
          <b-list-group v-if="loaded">
            <b-list-group-item
              v-for="photo in photos"
              :key="photo.id"
              button
              class="d-flex"
              @click="openInfo(photo.id)"
            >
              {{ photo.id }}
              <fa :icon="faTrash" class="ml-auto mr-3 mt-1" style="font-size: 18px" @click="openModal(photo.id)" />
            </b-list-group-item>
          </b-list-group>
        </div>
        <!--写真削除確認のポップアップ-->
        <b-modal id="deletePhoto" size="sm" hide-header hide-footer centered>
          <div v-if="deleteId" class="text-center mt-4 mb-2" style="font-family: 'Noto Sans JP', sans-serif !important;">
            <h4>{{ deleteId }}</h4>
            <h4>を削除しますか？</h4>
            <div class="mt-4">
              <b-button class="mx-2" variant="primary" @click="deletePhoto(deleteId)">
                はい
              </b-button>
              <b-button class="mx-2" variant="outline-primary" @click="$bvModal.hide('deletePhoto')">
                いいえ
              </b-button>
            </div>
          </div>
        </b-modal>
      </b-col>
      <!--右半分-->
      <b-col v-if="loaded" class="col-6 my-3" style="overflow: scroll; height: 45rem">
        <div class="d-flex justify-content-center">
          <b-img-lazy :src="formImage" @error="loadError=true" class="text-center" style="max-height: 390px; border-radius: 5px" />
        </div>
        <div>
          <h5 class="mt-4">
            写真情報
          </h5>
          <b-row class="d-flex align-items-center mt-3">
            <b-col class="col-3">
              <label for="id">ID：</label>
            </b-col>
            <b-col class="col-9">
              <p class="mt-2">{{ formId }}</p>
            </b-col>
          </b-row>
          <b-row class="d-flex align-items-center mt-2">
            <b-col class="col-3">
              <label for="user">投稿ユーザ：</label>
            </b-col>
            <b-col class="col-9">
              <p class="mt-2">{{ formUser }}</p>
            </b-col>
          </b-row>
          <b-row class="mt-2 align-items-center">
            <b-col class="col-3">
              <label for="comment">ひとこと：</label>
            </b-col>
            <b-col class="col-9">
              <p class="mt-2">{{ formComment }}</p>
            </b-col>
          </b-row>
          <b-row class="mt-2 align-items-center">
            <b-col class="col-3">
              <label for="date">投稿日時：</label>
            </b-col>
            <b-col class="col-9">
              <p v-if="formDate" class="mt-2">{{ new Date(formDate.seconds*1000).toLocaleString() }}</p>
            </b-col>
          </b-row>
          <b-row class="mt-2 align-items-center">
            <b-col class="col-3">
              <label for="position">位置情報：</label>
            </b-col>
            <b-col class="col-9">
              <p>緯度： {{ formPosition.lat }}</p>
              <p>経度： {{ formPosition.lng }}</p>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import { firestore } from '../plugin/firebase'

export default {
  name: 'UsersPhoto',
  data () {
    return {
      loaded: false,
      photos: {},
      deleteId: null,
      formId: null,
      formImage: '',
      formUser: null,
      formComment: null,
      formDate: null,
      formPosition: { lat: null, lng: null },
      loadError: false
    }
  },
  computed: {
    faTrash () {
      return faTrash
    }
  },
  async created () {
    // firestoreからスタンプラリー情報を取得
    const _this = this
    await firestore
      .collection('photos')
      .where('stamprally', '==', this.$store.getters.selectedStamprally)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.photos, doc.id, doc.data())
        })
      })
    console.log(this.photos)
    this.loaded = true
  },
  methods: {
    openInfo (id) {
      // 選択した写真の情報の表示
      this.loadError = false
      this.formId = id
      this.formImage = this.photos[id].url
      this.formUser = this.photos[id].userName
      this.formComment = this.photos[id].comment
      this.formDate = this.photos[id].date
      this.formPosition = { lat: this.photos[id].location._lat, lng: this.photos[id].location._long }
    },
    openModal (id) {
      // 削除確認のポップアップ表示
      this.deleteId = id
      this.$bvModal.show('deletePhoto')
    },
    deletePhoto (id) {
      // firebase storageから写真を削除
      this.$bvModal.hide('deletePhoto')
      let promises = []
      if (this.photos[id].path && this.photos[id].path.length) {
        promises = this.photos[id].path.map((img, index) => {
          const storageRef = ref(getStorage(), img)
          return deleteObject(storageRef)
            .catch(error => console.log(error.message))
        })
        Promise.all(promises).then(() =>
          this.deletePhotoInfo(id)).catch((error) => {
          console.log(error.message)
        })
      } else {
        this.deletePhotoInfo(id)
      }
    },
    async deletePhotoInfo (id) {
      // firestoreから写真情報の削除
      await firestore
        .collection('photos')
        .doc(id)
        .delete()
      this.$delete(this.photos, id)
      this.formId = null
      this.formImage = ''
      this.formUser = null
      this.formComment = null
      this.formDate = null
      this.formPosition = { lat: null, lng: null }
      this.$bvToast.toast(id + ' を削除しました。', {
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
