<template>
  <!--スポット・スタンプの表示画面（ユーザ）-->
  <div id="spotDetail" class="detail p-3">
    <div>
      <b-button
        class="closebtn mt-1 mr-2"
        @click="close()"
      >
        <fa :icon="faArrowLeft" />
      </b-button>
    </div>
    <div class="detailInfo ml-1">
      <h5>{{ $store.getters.stampInfo.stamps[id].name }}</h5>
      <b-img-lazy
        v-if="$store.getters.stampInfo.stamps[id].image.length"
        :src="$store.getters.stampInfo.stamps[id].image"
        style="width: 100%; border-radius: 5px;"
      />
      <div class="mt-3">
        <div
          v-for="(text, index) in $store.getters.stampInfo.stamps[id].description"
          :key="index"
          class="my-1"
          style="font-size: 14px;"
        >
          <span>{{ text }}</span><br>
        </div>
      </div>
      <div v-if="$store.getters.stampInfo.stamps[id].menuAvailable" class="mt-3">
        <hr class="mt-4 flex-grow-1">
        <div>
          <p style="font-size: 14px">商品紹介</p>
        </div>
        <div v-for="(menu, index) in $store.getters.stampInfo.stamps[id].menu" :key="index">
          <h6>{{ menu.name }}</h6>
          <b-img-lazy
            v-if="menu.image"
            :src="menu.image"
            style="width: 100%; border-radius: 5px; margin-bottom: 5px"
          />
          <h6 v-if="menu.discount" style="color: #c73728">割引価格:{{ menu.discountPrice }}</h6>
          <h6 v-else>価格:{{ menu.price }}</h6>
          <h6>商品説明</h6>
          <p style="font-size: 12px">{{ menu.description }}</p>
        </div>
      </div>
      <div v-else-if="$store.getters.stampInfo.stamps[id].facility.length" class="mt-3">
        <hr class="mt-4 flex-grow-1">
        <div class="d-flex align-items-center">
          <p style="font-size: 14px">設備</p>
          <span class="ml-auto" style="font-size: 10px; color: #007bff" @click="$bvModal.show('iconDetail')">アイコンについて</span>
        </div>
        <div class="d-flex" style="color: #696969">
          <fa v-if="$store.getters.stampInfo.stamps[id].facility.includes('toilet')" :icon="faRestroom" style="font-size: 18px" class="mx-2 align-items-center" />
          <fa v-if="$store.getters.stampInfo.stamps[id].facility.includes('restaurant')" :icon="faUtensils" style="font-size: 18px" class="mx-2" />
          <fa v-if="$store.getters.stampInfo.stamps[id].facility.includes('break')" :icon="faMugSaucer" style="font-size: 18px" class="mx-2" />
        </div>
      </div>
      <div v-if="$store.getters.stampInfo.stamps[id].hours.date.length || $store.getters.stampInfo.stamps[id].hours.detail[0] !== ''" class="mt-3" style="font-size: 14px">
        <hr class="mt-4 flex-grow-1">
        <p>営業時間</p>
        <div class="d-flex">
          <span v-for="date in $store.getters.stampInfo.stamps[id].hours.date" :key="date.index" class="mx-2">
            {{ date.name }}
          </span>
        </div>
        <div v-for="(text, index) in $store.getters.stampInfo.stamps[id].hours.detail" :key="index" class="mx-2">
          <span>{{ text }}</span><br>
        </div>
      </div>
      <div v-for="(text, index) in $store.getters.stampInfo.stamps[id].description" :key="index" class="d-flex align-items-center" style="position: absolute; right: 12px; bottom: 12px; z-index: 1;">
        <b-button v-if="$store.getters.stampInfo.stamps[id].URL" class="urlBtn mx-1" @click="openURL($store.getters.stampInfo.stamps[id].URL)">
          <fa :icon="faGlobe" style="font-size: 20px" />
        </b-button>
        <b-button v-if="$store.getters.stampInfo.stamps[id].twitter" class="twitterBtn mx-1" @click="openURL($store.getters.stampInfo.stamps[id].twitter)">
          <fa :icon="faTwitter" style="font-size: 20px" />
        </b-button>
        <b-button v-if="$store.getters.stampInfo.stamps[id].instagram" class="instagramBtn mx-1" @click="openURL($store.getters.stampInfo.stamps[id].instagram)">
          <fa :icon="faInstagram" style="font-size: 22px" />
        </b-button>
        <b-button v-if="$store.getters.stampInfo.stamps[id].youtube" class="youtubeBtn mx-1" @click="openURL($store.getters.stampInfo.stamps[id].youtube)">
          <fa :icon="faYoutube" style="font-size: 22px" />
        </b-button>
        <b-button v-if="$store.getters.stampInfo.stamps[id].image2 && $store.getters.stampInfo.stamps[id].image2.length" class="ComicBtn mx-1" @click="$bvModal.show('comic')">
          <fa :icon="faBookOpen" style="font-size: 22px" />
        </b-button>
        <b-button v-if="$store.getters.stampInfo.stamps[id].image3 && $store.getters.stampInfo.stamps[id].image3.length" class="ImageBtn mx-1" @click="$bvModal.show('image')">
          <fa :icon="faImage" style="font-size: 22px" />
        </b-button>
      </div>
    </div>
    <b-modal id="iconDetail" size="sm" hide-footer centered>
      <template #modal-title>
        設備アイコン
      </template>
      <div style="font-family: 'Noto Sans JP', sans-serif !important; font-size: 14px">
        <span>・スポットに備えられている設備について，アイコンで表示しています。</span><br>
        <div class="p-3">
          <div class="d-flex align-items-top my-1">
            <fa :icon="faRestroom" style="color: #696969; font-size: 20px" class="col-2" />
            <span >・・・</span>
            <span>トイレを表しています。</span>
          </div>
          <div class="d-flex align-items-top my-1">
            <fa :icon="faUtensils" style="color: #696969; font-size: 20px" class="col-2" />
            <span >・・・</span>
            <span>食事可能なスペースか，レストランを表しています。</span>
          </div>
          <div class="d-flex align-items-top my-1">
            <fa :icon="faMugSaucer" style="color: #696969; font-size: 20px" class="col-2" />
            <span >・・・</span>
            <span>休憩可能なスペースを表しています。</span>
          </div>
        </div>
        <span>なお，スポットの営業時間によっては設備が利用できない場合もございます。</span>
      </div>
    </b-modal>
    <b-modal v-if="$store.getters.stampInfo.stamps[id].image2 && $store.getters.stampInfo.stamps[id].image2.length" id="comic" centered hide-footer>
      <template #modal-title>
        {{ $store.getters.stampInfo.stamps[id].name }}
      </template>
      <div style="font-family: 'Noto Sans JP', sans-serif !important; font-size: 16px">
        <div v-for="(img, index) in $store.getters.stampInfo.stamps[id].image2" :key="index">
          <b-img v-if="index===page" :src="img" style="width: 100%" />
        </div>
        <div class="d-flex align-items-center justify-content-center">
          <div class="mr-auto ml-3">
            <fa v-if="page !== 0" :icon="faArrowLeft" @click="page--">←</fa>
          </div>
          <div style="position: absolute; bottom: 15px">{{ page + 1 }} / {{ $store.getters.stampInfo.stamps[id].image2.length }}</div>
          <div class="ml-auto mr-3">
            <fa v-if="page + 1 !== $store.getters.stampInfo.stamps[id].image2.length" :icon="faArrowRight" @click="page++">→</fa>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal v-if="$store.getters.stampInfo.stamps[id].image3 && $store.getters.stampInfo.stamps[id].image3.length" id="image" centered hide-footer>
      <template #modal-title>
        みんなの投稿
      </template>
      <div style="font-family: 'Noto Sans JP', sans-serif !important; font-size: 16px">
        <div v-for="(img, index) in $store.getters.stampInfo.stamps[id].image3" :key="index">
          <b-img v-if="index===page2" :src="img" style="width: 100%" />
        </div>
        <div class="d-flex align-items-center justify-content-center">
          <div class="mr-auto ml-3">
            <fa v-if="page2 !== 0" :icon="faArrowLeft" @click="page2--">←</fa>
          </div>
          <div style="position: absolute; bottom: 15px">{{ page2 + 1 }} / {{ $store.getters.stampInfo.stamps[id].image3.length }}</div>
          <div class="ml-auto mr-3">
            <fa v-if="page2 + 1 !== $store.getters.stampInfo.stamps[id].image3.length" :icon="faArrowRight" @click="page2++">→</fa>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { faArrowLeft, faGlobe, faRestroom, faUtensils, faMugSaucer, faVolumeHigh, faBookOpen, faArrowRight, faImage } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'

export default {
  name: 'SpotDetailUser',
  data () {
    return {
      id: this.$store.getters.spotDetail.id,
      page: 0,
      page2: 0,
      daysOfWeek: ['月', '火', '水', '木', '金', '土', '日']
    }
  },
  computed: {
    faArrowLeft () {
      return faArrowLeft
    },
    faGlobe () {
      return faGlobe
    },
    faRestroom () {
      return faRestroom
    },
    faUtensils () {
      return faUtensils
    },
    faMugSaucer () {
      return faMugSaucer
    },
    faTwitter () {
      return faTwitter
    },
    faInstagram () {
      return faInstagram
    },
    faVolumeHigh () {
      return faVolumeHigh
    },
    faBookOpen () {
      return faBookOpen
    },
    faArrowRight () {
      return faArrowRight
    },
    faImage () {
      return faImage
    },
    faYoutube () {
      return faYoutube
    }
  },
  methods: {
    close () {
      // 表示を閉じる
      const element = document.getElementById('spotDetail')
      element.classList.add('fadeout')
      setTimeout(() => {
        this.page = 0
        this.$store.dispatch('setSpotDetail', { state: false, id: '' })
      }, 500)
    },
    openURL (url) {
      // URLを別タブで開く
      window.open(url, '_blank')
    },
    haveOrNot (id) {
      // スタンプが取得済みかどうか
      if (this.$store.getters.userInfo.ownedStamps) {
        for (let i = 0; i < this.$store.getters.userInfo.ownedStamps.length; i++) {
          if (this.$store.getters.userInfo.ownedStamps[i].id === id) {
            return '取得済み'
          }
        }
      }
      return '未取得'
    },
    playSound (text) {
      if (window.speechSynthesis.speaking !== true) {
        // 設定
        const audio = new SpeechSynthesisUtterance()
        audio.text = text
        audio.lang = 'ja-JP'
        // 再生
        window.speechSynthesis.speak(audio)
      } else {
        window.speechSynthesis.cancel()
      }
    }
  }
}
</script>

<style scoped>
.detail {
  /*min-height: 31rem;*/
  font-family: 'Noto Sans JP', sans-serif !important;
  min-height: 18vh;
  max-height: 54vh;
  min-width: 75%;
  max-width: 75%;
  position: absolute;
  /*bottom: 130px;*/
  top: 105px;
  left: 0;
  margin: auto;
  z-index: 1000 !important;
  background-color: #fafafa;
  color: #333333;
  border: none;
  border-radius: 0 15px 15px 0;
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
  /*box-shadow:0 -5px 5px #D67200;*/
  animation: anim 0.5s forwards;
  overflow: hidden;
}
@keyframes anim {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
.detail.fadeout {
  animation: fadeout 0.5s forwards;
}
@keyframes fadeout {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
.detailInfo {
  font-family: 'Noto Sans JP', sans-serif !important;
  max-width: 95%;
  max-height: 50vh;
  margin-top: 20px;
  padding-bottom: 60px;
  overflow: scroll;
}
::-webkit-scrollbar {
  display: none;
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
.urlBtn {
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background-color: orange;
  border: none;
  padding-top: 6px;
  /*box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);*/
  display: flex;
  justify-content: center;
  align-items: center;
}
.twitterBtn {
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background-color: #1da1f2;
  border: none;
  padding-top: 6px;
  /*box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);*/
  display: flex;
  justify-content: center;
  align-items: center;
}
.instagramBtn {
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background: linear-gradient(to bottom,#b039db,#f1224d,#ffa915);
  border: none;
  padding-top: 6px;
  /*box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);*/
  display: flex;
  justify-content: center;
  align-items: center;
}
.youtubeBtn {
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background-color: #ff0000;
  border: none;
  padding-top: 6px;
  /*box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);*/
  display: flex;
  justify-content: center;
  align-items: center;
}
.stampBtn {
  height: 45px;
  border-radius: 50px;
  background-color: #007bff;
  border: none;
  font-size: 14px;
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
}
.SoundBtn {
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background: #EA5532;
  border: none;
  padding-top: 6px;
  /*box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);*/
  display: flex;
  justify-content: center;
  align-items: center;
}
.ComicBtn {
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background: #70C178;
  border: none;
  padding-top: 6px;
  /*box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);*/
  display: flex;
  justify-content: center;
  align-items: center;
}
.ImageBtn {
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background: #EA5532;
  border: none;
  padding-top: 6px;
  /*box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);*/
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
