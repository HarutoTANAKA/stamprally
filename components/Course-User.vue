<template>
  <!--コースメニューの表示（ユーザ）-->
  <div v-if="loaded && Object.entries(courseInfo).length" class="fixed-bottom">
    <div v-if="!$store.state.courseMenu" id="courseWindowClose" class="courseWindowClose">
      <b-row>
        <b-col class="d-flex justify-content-center">
          <fa :icon="faAngleUp" class="switch mt-1" @click="switchMenuOpen()" />
        </b-col>
      </b-row>
      <b-row v-if="$store.getters.userInfo.selectedCourse.length" class="px-3">
        <b-col class="d-flex align-items-center mb-1" style="font-size: 12px">
          <div class="d-flex align-items-center ml-2" style="max-width: 130px">
            <span style="font-weight: bold; margin: 0">
              {{ $store.getters.courseStatus.name }}
            </span>
          </div>
          <div v-if="$store.getters.courseStatus.nextStamp" class="ml-auto" style="width: 110px">
            <span>次のスタンプ</span>
            <span>
              ({{ $store.getters.courseStatus.progress + 1 }}/{{ $store.getters.courseStatus.length }})
            </span><br>
            <span class="wrap" style="font-size: 12px; border: none; padding: 0; color: #007bff">
              {{ stampInfo[$store.getters.courseStatus.nextStamp].name }}
            </span>
          </div>
        </b-col>
      </b-row>
      <b-row v-else class="px-3">
        <b-col class="d-flex align-items-center mb-1 justify-content-center" style="font-size: 12px">
          <p style="font-weight: bold; margin: 0">
            進行中のコースなし
          </p>
        </b-col>
      </b-row>
    </div>
    <div v-else id="courseWindowOpen" class="courseWindowOpen">
      <b-row>
        <b-col class="d-flex justify-content-center">
          <fa :icon="faAngleDown" class="switch mt-1" @click="switchMenuClose()" />
        </b-col>
      </b-row>
      <b-row v-if="$store.getters.userInfo.selectedCourse.length" class="px-3">
        <b-col class="d-flex align-items-center mb-1" style="font-size: 12px">
          <div class="d-flex align-items-center ml-2" style="max-width: 130px">
            <span style="font-weight: bold; margin: 0">
              {{ $store.getters.courseStatus.name }}
            </span>
          </div>
          <div v-if="$store.getters.courseStatus.nextStamp" class="ml-auto" style="width: 110px">
            <span>次のスタンプ</span>
            <span>
              ({{ $store.getters.courseStatus.progress + 1 }}/{{ $store.getters.courseStatus.length }})
            </span><br>
            <span class="wrap" style="font-size: 12px; border: none; padding: 0; color: #007bff">
              {{ stampInfo[$store.getters.courseStatus.nextStamp].name }}
            </span>
          </div>
        </b-col>
      </b-row>
      <b-row v-else class="px-3">
        <b-col class="d-flex align-items-center mb-1 justify-content-center" style="font-size: 12px">
          <p style="font-weight: bold; margin: 0">
            進行中のコースなし
          </p>
        </b-col>
      </b-row>
      <b-row v-if="loaded" class="d-flex pb-3 px-3 justify-content-start scroll">
        <div v-if="!$store.getters.userInfo.selectedCourse.length" class="d-flex pt-2">
          <div class="card pl-4" style="box-shadow: none">
            <div class="p-3">
              <h6>コースが選択できます→</h6>
            </div>
            <p style="font-size: 10px">
              コースに沿ってスタンプを集めることで，スタンプごとにミッションを楽しんだり，ボーナスptをもらうことができます。
            </p>
          </div>
          <div v-for="course in courseInfo" :key="course.id" class="card" :style="{backgroundColor: course.color}" @click="openModal(course.id)">
            <div class="p-3">
              <div class="d-flex align-items-center">
                <h6 style="font-size: 14px">{{ course.name }}</h6>
                <span v-if="$store.getters.userInfo.completedCourse.length && $store.getters.userInfo.completedCourse.includes(course.id)" style="color: #fafafa; background-color: #e14e53; border-radius: 8px; font-size: 10px; width: 70px" class="ml-auto px-2 py-1 text-center">
                  完了
                </span>
              </div>
              <div>
                <p v-for="text in course.description" :key="text.index" style="font-size: 10px">
                  {{ text }}
                </p>
                <div class="d-flex align-items-center">
                  <div class="d-flex align-items-center">
                    <span style="font-size: 10px">スポット数： </span><br>
                    <span style="font-size: 12px; font-weight: bold">{{ course.stamps.length }}</span>
                  </div>
                  <div class="ml-auto">
                    <div class="d-flex align-items-center">
                      <span style="font-size: 10px">移動距離：約</span>
                      <span style="font-size: 12px; font-weight: bold">{{ totalDistance(course.distance) }}</span>
                    </div>
                    <div class="d-flex align-items-center">
                      <span style="font-size: 10px">消費カロリー：約</span>
                      <span style="font-size: 12px; font-weight: bold">{{ totalCalorie(course.distance) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="d-flex mx-auto">
          <div class="card" :style="{backgroundColor: completeOrNot($store.getters.userInfo.selectedCourse)}" @click="openModal($store.getters.userInfo.selectedCourse)">
            <div class="p-3">
              <div class="d-flex align-items-center">
                <h6 style="font-size: 14px">{{ courseInfo[$store.getters.userInfo.selectedCourse].name }}</h6>
                <span style="color: #fafafa; background-color: #007bff; border-radius: 8px; font-size: 10px; width: 70px" class="ml-auto px-2 py-1">
                  進行中
                </span>
              </div>
              <div>
                <p v-for="text in courseInfo[$store.getters.userInfo.selectedCourse].description" :key="text.index" style="font-size: 10px">
                  {{ text }}
                </p>
                <div class="d-flex align-items-center">
                  <div class="d-flex align-items-center">
                    <span style="font-size: 10px">スポット数： </span><br>
                    <span style="font-size: 12px; font-weight: bold">{{ courseInfo[$store.getters.userInfo.selectedCourse].stamps.length }}</span>
                  </div>
                  <div class="ml-auto">
                    <div class="d-flex align-items-center">
                      <span style="font-size: 10px">移動距離：約</span>
                      <span style="font-size: 12px; font-weight: bold">{{ totalDistance(courseInfo[$store.getters.userInfo.selectedCourse].distance) }}</span>
                    </div>
                    <div class="d-flex align-items-center">
                      <span style="font-size: 10px">消費カロリー：約</span>
                      <span style="font-size: 12px; font-weight: bold">{{ totalCalorie(courseInfo[$store.getters.userInfo.selectedCourse].distance) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-row>
      <!--コースに含まれるスタンプ一覧のポップアップ-->
      <b-modal id="selectCourse" centered hide-header hide-footer no-close-on-backdrop>
        <div style="font-family: 'Noto Sans JP', sans-serif !important;">
          <div v-if="targetId" class="text-center">
            <p>このコースのスポット一覧</p>
            <b-list-group class="mx-3" style="max-height: 280px; overflow: scroll">
              <b-list-group-item
                v-for="stamp in courseInfo[targetId].stamps"
                :key="stamp.index"
                style="font-size: 14px"
              >
                {{ stampInfo[stamp].name }}
              </b-list-group-item>
            </b-list-group>
            <div class="d-flex justify-content-center my-2">
              <b-button v-if="targetId === $store.getters.userInfo.selectedCourse" variant="danger" size="sm" class="mx-2" @click="cancel()">
                中断する
              </b-button>
              <b-button v-else-if="!completeStatus" variant="primary" size="sm" class="mx-2" @click="select(targetId)">
                このコースを選択
              </b-button>
              <b-button variant="outline-primary" size="sm" class="mx-2" @click="$bvModal.hide('selectCourse')">
                閉じる
              </b-button>
            </div>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import Firestore from '~/plugin/firestore'

export default {
  name: 'CourseUser',
  data () {
    return {
      loaded: false,
      courseInfo: {},
      stampInfo: {},
      targetId: null,
      completeStatus: false,
      ownedStamps: this.$store.getters.userInfo.ownedStamps,
      selectedCourse: this.$store.getters.userInfo.selectedCourse,
      completedCourse: this.$store.getters.userInfo.completedCourse,
      stamp: null
    }
  },
  computed: {
    faAngleDown () {
      return faAngleDown
    },
    faAngleUp () {
      return faAngleUp
    }
  },
  async created () {
    // Firestoreからコース情報取得
    this.courseInfo = await Firestore.getCourseInfo(this.$route.params.id)
    // storeにコース情報をセット
    await this.$store.dispatch('setCourses', this.courseInfo)
    // storeからスタンプ情報を取得
    this.stampInfo = await this.$store.getters.stampInfo.stamps
    if (this.$store.getters.userInfo.selectedCourse.length) {
      await this.courseProgress(this.$store.getters.userInfo.selectedCourse)
    }
    this.loaded = true
  },
  mounted () {
    // storeの値が更新されたタイミングで情報を取得
    this.$store.watch((state, getters) => getters.courses.course,
      (newValue) => {
        this.courseInfo = newValue
      }
    )
    this.$store.watch((state, getters) => getters.stampInfo.stamps,
      (newValue) => {
        this.stampInfo = newValue
      }
    )
  },
  methods: {
    totalDistance (distanceArray) {
      let sum = 0
      for (let i = 0; i < distanceArray.length; i++) {
        sum += distanceArray[i]
      }
      if (sum > 1000) {
        return Math.floor(sum / 100) / 10 + ' km'
      } else {
        return Math.floor(sum * 10) / 10 + ' m'
      }
    },
    totalCalorie (distanceArray) {
      const m = 8.0
      const weight = 56.4
      const speed = 20
      let sum = 0
      for (let i = 0; i < distanceArray.length; i++) {
        sum += distanceArray[i]
      }
      sum = sum / 1000
      const calorie = m * weight * sum / speed * 1.05
      return Math.floor(calorie * 10) / 10 + 'kcal'
    },
    completeOrNot (id) {
      // コースをすでにコンプリート済みかどうかチェック
      if (this.$store.getters.userInfo.completedCourse.length && this.$store.getters.userInfo.completedCourse.includes(id)) {
        return '#696969'
      } else { return this.courseInfo[id].color }
    },
    openModal (id) {
      // コースのスタンプ一覧表示
      this.completeStatus = false
      this.targetId = id
      if (this.$store.getters.userInfo.completedCourse.includes(id)) {
        this.completeStatus = true
      }
      this.$bvModal.show('selectCourse')
    },
    async select (id) {
      // コース選択
      await Firestore.selectCourse(id, this.$store.getters.user._delegate.uid, this.$route.params.id)
      console.log('selected')
      await this.$bvModal.hide('selectCourse')
      this.targetId = null
      await this.courseProgress(id)
    },
    async cancel () {
      // 選択中のコースを中断
      await Firestore.selectCourse('', this.$store.getters.user._delegate.uid, this.$route.params.id)
      await this.$store.dispatch('setCourseStatus', {
        name: '',
        length: 0,
        nextStamp: null,
        progress: 0,
        stamps: [],
        path: { lat: 0, lng: 0 }
      })
    },
    switchMenuClose () {
      // コースメニューの非表示
      const element = document.getElementById('courseWindowOpen')
      element.classList.add('fadeout')
      setTimeout(() => {
        this.$store.dispatch('switchCourseMenu', false)
      }, 400)
    },
    switchMenuOpen () {
      // コースメニューの表示
      this.$store.dispatch('switchCourseMenu', true)
    },
    async courseProgress (id) {
      // 選択したコースの進行状況のチェック
      // コース進捗状況の初期化
      let progress = 0
      let next = null
      let nextPath = null
      // コースに含まれるスタンプをユーザが持っているか一個ずつチェック
      for (let i = this.courseInfo[id].stamps.length - 1; i >= 0; i--) {
        // ユーザが持つスタンプの中に該当スタンプがあった場合
        if (this.ownedStamps.length && this.ownedStamps.some(s => s.id === this.courseInfo[id].stamps[i])) {
          // 進捗+１
          progress++
          // コースのスタンプ数=進捗になった場合
          if (progress === this.courseInfo[id].stamps.length) {
            // firestore上のコース進捗状況を更新
            await Firestore.completeCourse(id, this.$store.getters.user._delegate.uid, this.$route.params.id)
            // コース選択の初期化
            await this.$store.dispatch('setCourseStatus', {
              name: '',
              length: 0,
              nextStamp: null,
              progress: 0,
              stamps: [],
              path: { lat: 0, lng: 0 }
            })
            return
          }
          // 該当のスタンプがそのコースの最後のスタンプではない，かつ，該当のスタンプをユーザが持っていない場合
          if (i + 1 < this.courseInfo[id].stamps.length && !this.ownedStamps.some(s => s.id === this.courseInfo[id].stamps[i + 1])) {
            // 該当のスタンプの次のスタンプを目標に設定
            next = this.courseInfo[id].stamps[i + 1]
            nextPath = this.courseInfo[id].path[i + 1]
          }
        }
      }
      // 進捗0の場合
      if (progress === 0) {
        // コースの最初のスタンプを目標に設定
        next = this.courseInfo[id].stamps[0]
        nextPath = this.courseInfo[id].path[0]
        this.stamp = 0
      }
      // 最後にコースの進捗状況を反映
      await this.$store.dispatch('setCourseStatus', {
        name: this.courseInfo[id].name,
        color: this.courseInfo[id].color,
        length: this.courseInfo[id].stamps.length,
        nextStamp: next,
        progress,
        stamps: this.courseInfo[id].stamps,
        path: nextPath
      })
    }
  }
}
</script>

<style scoped>
.courseWindowOpen {
  height: 330px;
  background-color: #fafafa;
  border-radius: 26px;
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
  color: #333333;
  font-family: 'Noto Sans JP', sans-serif !important;
  max-width: 325px;
  margin: auto auto 25px;
  z-index: 1000 !important;
  animation: anim 0.5s forwards;
  overflow: hidden;
}
@keyframes anim {
  0% {
    transform: translateY(56%);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateY(0);
  }
}
.courseWindowOpen.fadeout {
  animation: fadeout 0.5s forwards;
}
@keyframes fadeout {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(56%);
    opacity: 0;
  }
}
.courseWindowClose {
  max-width: 325px;
  height: 145px;
  margin: auto auto 25px;
  background-color: #fafafa;
  border-radius: 26px;
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
  color: #333333;
  font-family: 'Noto Sans JP', sans-serif !important;
}
.card {
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
  width: 260px;
  min-height: 130px;
  margin-left: 20px;
  margin-right: 20px;
  border-radius: 10px;
  border: none;
  background-color: #fafafa;
}
.switch {
  border: none;
  font-size: 20px;
  padding: 0;
  transform: scale(2.5, 1.0);
  background-color: transparent;
  color: dimgray;
}
.wrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scroll {
  overflow-x: scroll;
}
.scroll::-webkit-scrollbar {
  display: none;
}
.stamp{
  width: 170pt;
  height: 160pt;
  margin-left: 100px;
  animation: fadeout-anim 0.3s linear 2s forwards;
}
@keyframes fadeout-anim {
  100% {
    opacity: 0;
  }
}
</style>
