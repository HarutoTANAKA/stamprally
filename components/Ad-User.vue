<template>
  <!--ユーザに表示される広告-->
  <div class="advertise">
    <b-carousel
      v-if="loaded && Object.entries(adInfo).length === 1"
      id="carousel-ad"
      v-model="slide"
      :interval="5000"
      fade
      background="#696969"
      style="text-shadow: 0px 0px 2px #000; bottom: 17px; font-family: 'Noto Sans JP', sans-serif;"
      img-width="1048"
      img-height="480"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >
      <b-carousel-slide
        v-for="ad in adInfo"
        :key="ad.id"
        class="pt-1"
      >
        <h5 class="adDisplay" @click="openModal(ad.id)">
          {{ ad.title }}
        </h5>
        <template #img>
          <img
            v-if="ad.image.length"
            class="d-block img-fluid w-100"
            :src="ad.image"
            alt="image slot"
          >
          <img
            v-else
            class="d-block img-fluid w-100"
            src="https://picsum.photos/1024/480/?image=54"
            alt="image slot"
          >
          <div class="overlay" />
        </template>
      </b-carousel-slide>
    </b-carousel>
    <b-carousel
      v-if="loaded && Object.entries(adInfo).length !== 1"
      id="carousel-ad"
      v-model="slide"
      :interval="5000"
      controls
      fade
      background="#696969"
      style="text-shadow: 0px 0px 2px #000; bottom: 17px; font-family: 'Noto Sans JP', sans-serif;"
      img-width="1048"
      img-height="480"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >
      <b-carousel-slide
        v-for="ad in adInfo"
        :key="ad.id"
        class="pt-1"
      >
        <h5 class="adDisplay" @click="openModal(ad.id)">
          {{ ad.title }}
        </h5>
        <template #img>
          <img
            v-if="ad.image.length"
            class="d-block img-fluid w-100"
            :src="ad.image"
            alt="image slot"
          >
          <img
            v-else
            class="d-block img-fluid w-100"
            src="https://picsum.photos/1024/480/?image=54"
            alt="image slot"
          >
          <div class="overlay" />
        </template>
      </b-carousel-slide>
    </b-carousel>
    <!--広告の詳細画面のポップアップ-->
    <b-modal id="ad" centered hide-footer>
      <template #modal-title>詳細</template>
      <b-card no-body class="m-0 advertise" style="border: none; max-height: 520px; overflow: auto; color: #333333">
        <b-card-img-lazy
          v-if="imageRef"
          :src="imageRef"
          alt="image"
          img-top
        />
        <b-card-body>
          <b-card-title>{{ modalTitle }}</b-card-title>
          <b-card-text v-for="text in modalText" :key="text.index" style="font-size: 14px">
            {{ text }}
          </b-card-text>
          <br>
        </b-card-body>
      </b-card>
      <div class="d-flex align-items-center">
        <b-button
          v-if="URL"
          class="ml-auto shadow"
          style="position: absolute; right: 10px; bottom: 10px; width: 60px; height: 60px; padding-top: 10px; border-radius: 50px; z-index: 1; background-color: #e58900; border: none"
          @click="openURL()"
        >
          <fa :icon="faExternalLinkAlt" style="font-size: 24px" />
          <p style="font-size: 12px">HPへ</p>
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'Ad-User',
  data () {
    return {
      loaded: false,
      adInfo: this.$store.getters.adInfo.ads,
      slide: 0,
      sliding: null,
      URL: null,
      modalTitle: null,
      modalText: null,
      imageRef: null
    }
  },
  computed: {
    faExternalLinkAlt () {
      return faExternalLinkAlt
    }
  },
  created () {
    this.loaded = true
  },
  mounted () {
    // storeから広告情報を取得
    this.$store.watch((state, getters) => getters.adInfo.ads,
      (newValue) => {
        this.adInfo = newValue
      }
    )
  },
  methods: {
    onSlideStart (slide) {
      // 広告が数秒おきに切り替わるやつ
      this.sliding = true
    },
    onSlideEnd (slide) {
      // 広告が数秒おきに切り替わるやつ
      this.sliding = false
    },
    openModal (id) {
      // 詳細のポップアップ表示
      this.modalTitle = this.adInfo[id].title
      this.modalText = this.adInfo[id].text
      if (this.adInfo[id].image) {
        this.imageRef = this.adInfo[id].image
      } else { this.imageRef = null }
      if (this.adInfo[id].url) {
        this.URL = this.adInfo[id].url
      } else {
        this.URL = null
      }
      this.$bvModal.show('ad')
    },
    openURL () {
      // リンク先を新規タブで開く
      window.open(this.URL, '_blank')
    }
  }
}
</script>

<style scoped>
.advertise {
  font-family: 'Noto Sans JP', sans-serif
}
.adDisplay {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.overlay {
  position: absolute;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
}
</style>
