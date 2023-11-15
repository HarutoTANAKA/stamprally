<template>
  <!--コンソールのコース管理-->
  <b-container class="py-1" style="border-radius: 3px">
    <b-row class="d-flex mb-4">
      <!--左半分-->
      <b-col class="col-6 my-3">
        <b-button
          id="tooltip2"
          variant="outline-primary"
          class="my-3"
          style="border-width: 3px; height: 60px"
          block
          @click="createCourse()"
        >
          <fa :icon="faPlus" style="font-size: 20px" />
        </b-button>
        <b-tooltip target="tooltip2" triggers="hover">
          新規追加
        </b-tooltip>
        <div style="overflow: scroll; height: 39rem">
          <b-list-group>
            <b-list-group-item
              v-for="course in courses"
              :key="course.id"
              button
              class="d-flex"
              @click="openInfo(course.id)"
            >
              {{ course.name }}
              <fa :icon="faTrash" class="ml-auto mr-3 mt-1" style="font-size: 18px" @click="openModal(course.id)" />
            </b-list-group-item>
          </b-list-group>
        </div>
        <!--削除確認のポップアップ-->
        <b-modal id="deleteC" size="sm" hide-header hide-footer centered>
          <div v-if="deleteId" class="text-center mt-4 mb-2" style="font-family: 'Noto Sans JP', sans-serif !important;">
            <h4>{{ courses[deleteId].name }}</h4>
            <h4>を削除しますか？</h4>
            <div class="mt-4">
              <b-button class="mx-2" variant="primary" @click="deleteCourse(deleteId)">
                はい
              </b-button>
              <b-button class="mx-2" variant="outline-primary" @click="$bvModal.hide('deleteC')">
                いいえ
              </b-button>
            </div>
          </div>
        </b-modal>
      </b-col>
      <!--右半分-->
      <b-col v-if="edit" class="col-6 my-3" style="height: 45rem">
        <GmapMap
          map-type-id="roadmap"
          :center="initialLocation"
          :zoom="zoom"
          :style="styleMap"
          :options="mapOptions"
          style="overflow: hidden; border-radius: 13px; z-index: 1"
        >
          <GmapPolyline
            v-if="formPath.length>=2"
            :path.sync="formPath"
            :options="{
              strokeColor: formColor,
              strokeWeight: 5
            }"
          />
          <GmapMarker
            v-for="point in formPath"
            :key="point.index"
            :position="point"
            :draggable="false"
          />
        </GmapMap>
        <div v-if="upload" class="text-center align-items-center">
          <b-spinner type="grow" label="Spinning" style="width: 3rem; height: 3rem;" class="my-3" />
        </div>
        <div v-else style="overflow-y: scroll; overflow-x: hidden; height: calc(45rem - 400px)" class="px-1">
          <h5 class="mt-4">
            コース情報
          </h5>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="name">コース名：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="name" v-model="formName" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-top">
            <b-col class="col-3">
              <label for="color">テーマカラー：</label>
            </b-col>
            <b-col class="col-9">
              <div id="color" class="mx-1 mb-2" style="width: 50px; height: 36px; border: none; border-radius: 4px" :style="{backgroundColor: formColor}" />
              <div class="d-flex flex-wrap">
                <div
                  v-for="h in hsl"
                  :key="h.index"
                  class="m-1"
                >
                  <b-button
                    style="border: none; border-radius: 50%; width: 36px; height: 36px"
                    :style="{backgroundColor: hsl2rgb(Number(h), 80, 0.68)}"
                    @click="colorHandler(h)"
                  />
                </div>
              </div>
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="desc">コース説明：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-textarea id="desc" v-model="formDesc" rows="3" max-rows="4" style="overflow: auto" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-top">
            <b-col class="col-3">
              <label for="stamps">スタンプ：</label>
            </b-col>
            <b-col class="col-9">
              <b-list-group id="stamps">
                <b-list-group-item
                  v-for="stamp in formStamps"
                  :key="stamp"
                  class="d-flex align-items-center"
                >
                  {{ formStamps.indexOf(stamp) + 1 }} : {{ stamps[stamp].name }}
                  <fa :icon="faCaretUp" class="ml-auto mr-2 pb-0" style="font-size: 22px" @click="sortUp(stamp)" />
                  <fa :icon="faCaretDown" class="ml-2 mr-3 pt-0" style="font-size: 22px" @click="sortDown(stamp)" />
                  <fa :icon="faTrash" class="ml-3 mr-2" style="font-size: 16px" @click="deleteFromCourse(stamp)" />
                </b-list-group-item>
                <b-list-group-item variant="outline-primary" button @click="openModal2">
                  追加
                </b-list-group-item>
              </b-list-group>
            </b-col>
          </b-row>
          <b-row class="text-center mt-5 mb-3">
            <b-col>
              <b-button v-if="edit" variant="primary" size="lg" @click="uploadCourse(edit)">
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
    <!--スタンプを追加する画面のポップアップ-->
    <b-modal id="addStampToCourse" centered hide-footer>
      <template #modal-title>
        スタンプを追加
      </template>
      <div style="font-family: 'Noto Sans JP', sans-serif !important;">
        <b-list-group style="max-height: 600px; overflow: scroll">
          <b-list-group-item
            v-for="stamp in stampCandidate"
            :key="stamp.id"
            button
            @click="addStamps(stamp.id)"
          >
            {{ stamp.name }}
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import { faPlus, faTrash, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { gmapApi } from 'vue2-google-maps'
import { firestore } from '../plugin/firebase'

export default {
  name: 'Course',
  data () {
    return {
      loaded: false,
      upload: false,
      courses: {},
      stamps: {},
      initialLocation: { lng: 130.27, lat: 33.3 },
      styleMap: {
        width: '100%',
        height: '400px'
      },
      zoom: 10,
      mapOptions: {
        disableDefaultUi: true,
        mapTypeControl: true,
        zoomControl: true,
        fullscreenControl: false,
        streetViewControl: false,
        clickableIcons: false,
        styles: []
      },
      hsl: [10, 50, 90, 130, 170, 210, 250, 290, 330],
      selectedH: null,
      deleteId: null,
      formPath: [],
      formName: '',
      formDesc: '',
      formColor: '#696969',
      formStamps: [],
      stampCandidate: [],
      edit: null
    }
  },
  computed: {
    faPlus () {
      return faPlus
    },
    faTrash () {
      return faTrash
    },
    faCaretUp () {
      return faCaretUp
    },
    faCaretDown () {
      return faCaretDown
    },
    google: gmapApi
  },
  async created () {
    // Firestoreからコース情報とスタンプ情報の取得
    const _this = this
    await firestore
      // .collection('stamps')
      .collection('course')
      .where('stamprallyId', '==', this.$store.getters.selectedStamprally)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.courses, doc.id, doc.data())
        })
      })
    console.log(this.courses)
    await firestore
      .collection('stamps')
      .where('stamprallyId', '==', this.$store.getters.selectedStamprally)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.stamps, doc.id, doc.data())
        })
      })
    this.loaded = true
  },
  methods: {
    openInfo (id) {
      // 選択したコース情報の表示
      this.edit = id
      this.formPath = this.courses[id].path
      if (this.formPath.length) {
        this.initialLocation = this.formPath[0]
      }
      this.formName = this.courses[id].name
      this.formColor = this.courses[id].color
      this.formStamps = this.courses[id].stamps
      this.formDesc = ''
      for (let i = 0; i < this.courses[id].description.length; i++) {
        this.formDesc += this.courses[id].description[i]
        if (i !== (this.courses[id].description.length - 1)) {
          this.formDesc += '\n'
        }
      }
      this.zoom = 10
    },
    colorHandler (h) {
      // コースカラーの選択
      this.formColor = this.hsl2rgb(h, 80, 0.68)
      this.selectedH = h
    },
    hsl2rgb (h, s, l) {
      // コースカラーのhsl値をRGBに変換
      const a = s * Math.min(l, 1 - l) / 100
      const f = (n) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0')
      }
      return `#${f(0)}${f(8)}${f(4)}`
    },
    openModal (id) {
      // ポップアップの表示
      this.deleteId = id
      this.$bvModal.show('deleteC')
    },
    openModal2 () {
      // スタンプ追加画面の表示
      const stamps = Object.entries(this.stamps)
      this.stampCandidate = []
      for (let i = 0; i < stamps.length; i++) {
        if (stamps[i][1].display === 1) {
          this.stampCandidate.push(stamps[i][1])
        }
      }
      this.$bvModal.show('addStampToCourse')
    },
    addStamps (id) {
      // コースにスタンプ追加
      this.formStamps.push(this.stamps[id].id)
      this.formPath.push({ lat: this.stamps[id].location._lat, lng: this.stamps[id].location._long })
      this.$bvModal.hide('addStampToCourse')
    },
    deleteFromCourse (id) {
      // コースからスタンプ削除
      const index = this.formStamps.indexOf(id)
      this.formStamps.splice(index, 1)
      this.formPath.splice(index, 1)
    },
    sortUp (id) {
      // 選択したスタンプの順番を一つ手前に
      const index = this.formStamps.indexOf(id)
      if (index !== 0) {
        const stamp = this.formStamps.splice(index, 1)
        this.formStamps.splice(index - 1, 0, stamp[0])
        const path = this.formPath.splice(index, 1)
        this.formPath.splice(index - 1, 0, path[0])
      }
    },
    sortDown (id) {
      // 選択したスタンプの順番を一つ後ろに
      const index = this.formStamps.indexOf(id)
      if (index !== this.formStamps.length) {
        const stamp = this.formStamps.splice(index, 1)
        this.formStamps.splice(index + 1, 0, stamp[0])
        const path = this.formPath.splice(index, 1)
        this.formPath.splice(index + 1, 0, path[0])
      }
    },
    createId () {
      // コース作成時のID生成
      const length = 20
      const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let r = ''
      for (let i = 0; i < length; i++) {
        r += c[Math.floor(Math.random() * c.length)]
      }
      return r
    },
    createCourse () {
      // 新規コースの作成
      const newId = this.createId()
      this.edit = newId
      // demo番のみ，demo: trueを追加
      const data = {
        name: '新しいコース',
        id: newId,
        color: '#696969',
        path: [],
        stamps: [],
        description: [],
        stamprallyId: this.$store.getters.selectedStamprally,
        distance: []
      }
      this.$set(this.courses, newId, data)
      this.openInfo(newId)
    },
    async uploadCourse (id) {
      // コース情報をFirestoreにアップロード
      this.uplaod = true
      const distance = [0]
      for (let i = 1; i < this.formPath.length; i++) {
        distance.push(this.calcDistance(this.formPath[i - 1], this.formPath[i]))
      }
      const splitText = this.formDesc.split('\n')
      const data = {
        name: this.formName,
        id,
        color: this.formColor,
        path: this.formPath,
        stamps: this.formStamps,
        description: splitText,
        stamprallyId: this.$store.getters.selectedStamprally,
        distance
      }
      await firestore
        // .collection('stamps')
        .collection('course')
        .doc(id)
        .set(data, { merge: true })
      this.$set(this.courses, id, data)
      this.$bvToast.toast(this.formName + ' を更新しました。', {
        variant: 'info'
      })
      this.edit = null
      this.upload = false
    },
    RAD (deg) {
      // ラジアンに変換
      return deg * Math.PI / 180
    },
    calcDistance (spot1, spot2) {
      let dist = 0.0
      const e = 6378137.0
      dist = Math.floor(e * Math.acos(Math.cos(this.RAD(spot1.lat)) *
        Math.cos(this.RAD(spot2.lat)) * Math.cos(this.RAD(spot2.lng) - this.RAD(spot1.lng)) +
        Math.sin(this.RAD(spot1.lat)) * Math.sin(this.RAD(spot2.lat))))
      return dist
    },
    async deleteCourse (id) {
      // コース情報の削除
      this.$bvModal.hide('deleteC')
      const deleteName = this.courses[id].name
      await firestore
        // .collection('stamps')
        .collection('course')
        .doc(id)
        .delete()
      this.$delete(this.courses, id)
      this.deleteId = null
      this.formPath = []
      this.initialLocation = { lng: 130.27, lat: 33.3 }
      this.formColor = '#696969'
      this.formStamps = []
      this.formDesc = ''
      this.zoom = 10
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
</style>
