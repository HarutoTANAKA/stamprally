<template>
  <!--スタンプカード（ユーザ）-->
  <body class="mx-1">
    <b-container fluid>
      <b-row>
        <b-col>
          <h3 class="mb-3">
            スタンプカード
          </h3>
        </b-col>
      </b-row>
      <b-row class="d-flex mx-0">
        <b-col
          v-for="stamp in stamps"
          :key="stamp.id"
          class="p-2 col-md-3 col-4"
        >
          <div
            class="m-0 mx-auto"
            style="border: none; border-radius: 8px; width: 90px; height: 90px"
            @click="openModal(stamp[1].id)"
          >
            <img v-if="got(stamp[1].id) && stamp[1].thumbnail2" :src="stamp[1].thumbnail2" alt="" style="border-radius: 8px; width: 100%; height: 100%; object-fit: cover">
            <img v-else-if="got(stamp[1].id) && stamp[1].thumbnail && stamp[1].thumbnail2 === ''" :src="stamp[1].thumbnail" alt="" style="border-radius: 8px; width: 100%; height: 100%; object-fit: cover">
            <div
              v-else
              :style="{backgroundColor: stColor(stamp[1].id)}"
              style="border-radius: 8px; width: 100%; height: 100%;"
            />
          </div>
          <h6 class="mx-auto mb-0 mt-1" style="font-size: 12px; font-weight: bold; width: 90px;">
            {{ stamp[1].name }}
          </h6>
        </b-col>
      </b-row>
      <!--スタンプ詳細のポップアップ-->
      <b-modal id="description" class="p-0" centered hide-header hide-footer>
        <b-overlay
          :show="loading"
          variant="transparent"
          opacity="1.0"
          blur="2px"
          spinner-type="grow"
          style="border-radius: 12px"
        >
          <b-card no-body class="m-0" style="border: none; max-height: 520px; overflow: auto; color: #333333">
            <b-card-img-lazy
              v-if="spotRef"
              :src="spotRef"
              alt="image"
              img-top
            />
            <b-card-body class="font">
              <b-card-title>{{ modalTitle }}</b-card-title>
              <b-card-text v-for="text in modalText" :key="text.index">
                {{ text }}
              </b-card-text>
              <div class="d-flex align-items-center">
                <h6>{{ stDate }}</h6>
              </div>
            </b-card-body>
          </b-card>
          <div class="d-flex align-items-center justify-content-end">
            <b-button
              v-if="stURL"
              class="urlBtn mx-1"
              @click="openURL()"
            >
              <fa :icon="faGlobe" style="font-size: 24px" />
            </b-button>
            <b-button
              v-if="stTwitter"
              class="twitterBtn mx-1"
              @click="openURL()"
            >
              <fa :icon="faTwitter" style="font-size: 24px" />
            </b-button>
            <b-button
              v-if="stInstagram"
              class="instagramBtn mx-1"
              @click="openURL()"
            >
              <fa :icon="faInstagram" style="font-size: 24px" />
            </b-button>
            <b-button v-if="stImage2" class="ComicBtn mx-1" @click="$bvModal.show('comic2')">
              <fa :icon="faBookOpen" style="font-size: 22px" />
            </b-button>
          </div>
        </b-overlay>
      </b-modal>
      <b-modal v-if="stImage2" id="comic2" centered hide-footer>
        <template #modal-title>
          {{ modalTitle }}
        </template>
        <div style="font-family: 'Noto Sans JP', sans-serif !important; font-size: 16px">
          <div v-for="(img, index) in stImage2" :key="index">
            <b-img v-if="index===page" :src="img" style="width: 100%" />
          </div>
          <div class="d-flex align-items-center justify-content-center">
            <div class="mr-auto ml-3">
              <fa v-if="page !== 0" :icon="faArrowLeft" @click="page--">←</fa>
            </div>
            <div style="position: absolute; bottom: 15px">{{ page + 1 }} / {{ stImage2.length }}</div>
            <div class="ml-auto mr-3">
              <fa v-if="page + 1 !== stImage2.length" :icon="faArrowRight" @click="page++">→</fa>
            </div>
          </div>
        </div>
      </b-modal>
    </b-container>
  </body>
</template>

<script>
import { faGlobe, faBookOpen, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import Firestore from '~/plugin/firestore'

export default {
  name: 'StampsUser',
  data () {
    return {
      loading: false,
      userInfo: this.$store.getters.user,
      ownedStamps: {},
      dateInfo: {},
      stampInfo: {},
      ownedStampsList: this.$store.getters.userInfo.ownedStamps,
      modalTitle: '',
      stDate: '',
      modalText: '',
      spotRef: '',
      spotRef2: null,
      stURL: null,
      stTwitter: null,
      stInstagram: null,
      stImage2: null,
      page: 0
    }
  },
  async created () {
    // firestoreからスタンプ情報を取得
    this.stampInfo = await Firestore.getStampsInfo(this.$route.params.id)
    console.log(this.stampInfo)
  },
  mounted () {
    // storeの値が更新されたタイミングで情報を取得
    this.$store.watch((state, getters) => getters.stampInfo.stamps,
      (newValue) => {
        this.stampInfo = newValue
      }
    )
  },
  computed: {
    faGlobe () {
      return faGlobe
    },
    faTwitter () {
      return faTwitter
    },
    faInstagram () {
      return faInstagram
    },
    faBookOpen () {
      return faBookOpen
    },
    faArrowRight () {
      return faArrowRight
    },
    faArrowLeft () {
      return faArrowLeft
    },
    stamps () {
      return Object.entries(this.stampInfo).filter((stamp) => {
        return stamp[1].display === 1
      })
    }
  },
  methods: {
    openModal (id) {
      // 詳細のポップアップ表示
      this.page = 0
      this.spotRef = this.stampInfo[id].image
      if (this.got(id) === true && this.stampInfo[id].stampIcon) {
        this.spotRef = this.stampInfo[id].stampIcon
      }
      if (this.stampInfo[id].image2) {
        this.spotRef2 = this.stampInfo[id].image2
      } else {
        this.spotRef2 = null
      }
      this.modalTitle = this.stampInfo[id].name
      this.stDate = this.stStatus(id)
      this.modalText = this.stampInfo[id].description
      if (this.stampInfo[id].URL !== '') {
        this.stURL = this.stampInfo[id].URL
      } else {
        this.stURL = null
      }
      if (this.stampInfo[id].twitter !== '') {
        this.stTwitter = this.stampInfo[id].twitter
      } else {
        this.stTwitter = null
      }
      if (this.stampInfo[id].instagram !== '') {
        this.stInstagram = this.stampInfo[id].instagram
      } else {
        this.stInstagram = null
      }
      if (this.stampInfo[id].image2 && this.stampInfo[id].image2.length) {
        this.stImage2 = this.stampInfo[id].image2
      } else {
        this.stImage2 = null
      }
      this.$bvModal.show('description')
    },
    openURL () {
      // urlを新しいタブで開く
      window.open(this.stURL, '_blank')
    },
    stColor (id) {
      // スタンプの取得状況で表示色を変える
      for (let i = 0; i < this.ownedStampsList.length; i++) {
        if (this.ownedStampsList[i].id === id) {
          // return this.stampInfo[id].color
          return '#e54400'
        }
      }
      return '#696969'
    },
    got (id) {
      // 取得済みのスタンプかどうか
      for (let i = 0; i < this.ownedStampsList.length; i++) {
        if (this.ownedStampsList[i].id === id) {
          return true
        }
      }
      return false
    },
    stStatus (id) {
      // スタンプの取得状況
      for (let i = 0; i < this.ownedStampsList.length; i++) {
        if (this.ownedStampsList[i].id === id) {
          const getday = new Date(this.ownedStampsList[i].date.seconds * 1000)
          const times = this.ownedStampsList[i].times
          return getday.getFullYear() + '年' + (getday.getMonth() + 1) + '月' + getday.getDate() + '日に取得(累計' + times + '回)'
        }
      }
      return '未取得'
    }
  }
}
</script>

<style scoped>
body {
  font-family: 'Noto Sans JP', sans-serif;
  padding-top: 75px;
  margin-bottom: 180px;
  color: #333333;
}
.font {
  font-family: 'Noto Sans JP', sans-serif;
}
.urlBtn {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: orange;
  border: none;
  padding-top: 6px;
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
  display: flex;
  justify-content: center;
  align-items: center;
}
.twitterBtn {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: #1da1f2;
  border: none;
  padding-top: 6px;
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
  display: flex;
  justify-content: center;
  align-items: center;
}
.instagramBtn {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background: linear-gradient(to bottom,#b039db,#f1224d,#ffa915);
  border: none;
  padding-top: 6px;
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
  display: flex;
  justify-content: center;
  align-items: center;
}
.ComicBtn {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background: #70C178;
  border: none;
  padding-top: 6px;
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
