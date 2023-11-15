<template>
  <!--マップ画面（ユーザ）-->
  <body v-if="loaded">
    <GmapMap
      ref="gMap"
      map-type-id="roadmap"
      :center="initialLocation"
      :zoom="zoom"
      :style="styleMap"
      :options="mapOptions"
      style="z-index: 1"
    >
      <div v-if="adInfo && Object.entries(adInfo).length" slot="visible" class="carousel">
        <Ad />
      </div>
      <b-button id="setting-target" slot="visible" class="setting">
        <fa :icon="faLayerGroup" style="font-size: 18px; color: #fafafa" />
      </b-button>
      <GmapInfoWindow
        :position="infoWindowPos"
        :options="{pixelOffset: {width: 0, height: -20}}"
        :opened="infoWinOpen"
        @closeclick="closeInfoSt()"
      >
        <div v-if="displayTarget==='stamp'">
          <h6 class="m-1" style="max-width: 120px; font-size: 14px; color: #333333">
            {{ displayName }}
          </h6>
        </div>
      </GmapInfoWindow>
      <gmap-custom-marker
        v-for="stamp in displayStamps"
        :key="stamp[1].id"
        :marker="{lat: stamp[1].location._lat, lng: stamp[1].location._long}"
        :offset-y="20"
        @click.native="toggleInfoSt(stamp[1], 'stamp')"
      >
        <div class="iconSquare" :style="{backgroundColor: stampColor(stamp[1].id)}">
          <fa :icon="faStamp" class="iconSize-s" :style="{color: '#fff'}" />
        </div>
      </gmap-custom-marker>
      <gmap-custom-marker
        v-for="spot in displaySpots"
        :key="spot[1].id"
        :marker="{lat: spot[1].location._lat, lng: spot[1].location._long}"
        :offset-y="20"
        @click.native="toggleInfoSt(spot[1], 'stamp')"
      >
        <div class="iconSquare" style="background-color: orange">
          <fa :icon="faMapMarkerAlt" class="iconSize-s" :style="{color: '#fff'}" />
        </div>
      </gmap-custom-marker>
      <gmap-custom-marker
        v-for="shop in displayShops"
        :key="shop[1].id"
        :marker="{lat: shop[1].location._lat, lng: shop[1].location._long}"
        :offset-y="20"
        @click.native="toggleInfoSt(shop[1], 'stamp')"
      >
        <div class="iconSquare" style="background-color: tomato">
          <fa :icon="faShop" class="iconSize-s" :style="{color: '#fff'}" />
        </div>
      </gmap-custom-marker>
      <gmap-custom-marker
        v-for="toilet in displayToilets"
        :key="toilet[1].id"
        :marker="{lat: toilet[1].location._lat, lng: toilet[1].location._long}"
        :offset-y="20"
        @click.native="toggleInfoSt(toilet[1], 'stamp')"
      >
        <div class="iconSquare" style="background-color: yellowgreen">
          <fa :icon="faRestroom" class="iconSize-s" :style="{color: '#fff'}" />
        </div>
      </gmap-custom-marker>
      <gmap-cluster
        :grid-size="30"
        :average-center="true"
        :styles="clusterStyle"
        @click="clusteredInfo($event)"
      >
      </gmap-cluster>
      <gmap-custom-marker
        :marker="location"
        :offset-y="20"
        @click.native="distanceWindowStatus=true"
      >
        <fa :icon="faUserCircle" class="iconSize-m" style="background-color: white; border-radius: 50px; z-index: 100" :style="{color: userInfo.color}" />
      </gmap-custom-marker>
      <GmapPolyline
        v-if="userInfo.selectedCourse && userInfo.selectedCourse.length && $store.getters.courseStatus.path"
        :path.sync="coursePath"
        :options="{
          strokeColor: $store.getters.courseStatus.color,
          strokeWeight: 6
        }"
      />
      <GmapInfoWindow
        v-if="userInfo.selectedCourse && userInfo.selectedCourse.length && $store.getters.courseStatus.path"
        :position="location"
        :options="{pixelOffset: {width: 0, height: -20}}"
        :opened="distanceWindowStatus"
        @closeclick="distanceWindowStatus=false"
      >
        <div style="font-size: 12px">
          <span>次のスタンプまで，</span><br>
          <span style="font-weight: bold">{{ calcDistance }}</span>
        </div>
      </GmapInfoWindow>
    </GmapMap>
    <!--アイテムの表示・非表示設定-->
    <b-popover target="setting-target" triggers="click blur" placement="bottomleft">
      <p class="pop" style="font-size: 16px; color: #333333">
        表示設定
      </p>
      <b-form-checkbox-group
        v-model="settingSelected"
        button-variant="outline-primary"
        style="font-family: 'Noto Sans JP', sans-serif !important; color: #333333"
        stacked
      >
        <b-form-checkbox value="stamp">
          スタンプ
        </b-form-checkbox>
        <b-form-checkbox value="spot">
          スポット
        </b-form-checkbox>
        <b-form-checkbox value="shop">
          お店
        </b-form-checkbox>
        <b-form-checkbox value="toilet">
          トイレ
        </b-form-checkbox>
      </b-form-checkbox-group>
    </b-popover>
    <!--スポット・スタンプ詳細-->
    <SpotDetail v-if="$store.getters.spotDetail.state===true" />
  </body>
</template>

<script>
import { faBell, faExternalLinkAlt, faStamp, faUserCircle, faMapMarkerAlt, faCamera, faLayerGroup, faShop, faRestroom } from '@fortawesome/free-solid-svg-icons'
import { gmapApi } from 'vue2-google-maps'
import GmapCustomMarker from 'vue2-gmap-custom-marker'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'
import SpotDetail from '~/components/SpotDetail-User'
import Ad from '~/components/Ad-User'

export default {
  name: 'HomeUser',
  components: { 'gmap-custom-marker': GmapCustomMarker, Ad, GmapCluster, SpotDetail },
  data () {
    return {
      loaded: false,
      user: this.$store.getters.user,
      userInfo: this.$store.getters.userInfo,
      stampInfo: this.$store.getters.stampInfo.stamps,
      photos: this.$store.getters.photos.photo,
      adInfo: this.$store.getters.adInfo.ads,
      location: { lat: 0, lng: 0 },
      initialLocation: { lat: this.$store.getters.currentStamprally.defaultLat, lng: this.$store.getters.currentStamprally.defaultLng },
      zoom: 12,
      styleMap: {
        width: '100%',
        height: window.innerHeight + 'px'
      },
      geoOption: {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 0
      },
      mapOptions: {
        disableDefaultUi: true,
        mapTypeControl: false,
        zoomControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        clickableIcons: false,
        gestureHandling: 'greedy', // 1本指でスクロール可能
        styles: []
      },
      infoWindowPos: { lat: 0, lng: 0 },
      infoWinOpen: false,
      distanceWindowStatus: true,
      getStatus: '',
      displayURL: null,
      displayName: '',
      stampOrNot: null,
      displayImage: '',
      displayComment: '',
      displayDate: '',
      displayTarget: null,
      settingSelected: ['spot', 'stamp', 'shop', 'toilet', 'photo'],
      clusterStyle: [
        {
          width: 35,
          height: 35,
          url: require('../assets/image/iconmonstr-circle-filled-32.png'),
          textSize: 16,
          anchorText: [-1, -1],
          textColor: 'white'
        },
        {
          width: 35,
          height: 35,
          url: require('../assets/image/iconmonstr-circle-filled-32.png'),
          textSize: 16,
          anchorText: [-1, -1],
          textColor: 'white'
        },
        {
          width: 35,
          height: 35,
          url: require('../assets/image/iconmonstr-circle-filled-32.png'),
          textSize: 16,
          anchorText: [-1, -1],
          textColor: 'white'
        }
      ],
      coursePath: [this.$store.getters.courseStatus.path, this.location]
    }
  },
  computed: {
    faUserCircle () {
      return faUserCircle
    },
    faBell () {
      return faBell
    },
    faStamp () {
      return faStamp
    },
    faExternalLinkAlt () {
      return faExternalLinkAlt
    },
    faMapMarkerAlt () {
      return faMapMarkerAlt
    },
    faCamera () {
      return faCamera
    },
    faLayerGroup () {
      return faLayerGroup
    },
    faShop () {
      return faShop
    },
    faRestroom () {
      return faRestroom
    },
    displayPhotos () {
      if (this.photos && this.settingSelected.includes('photo')) {
        return this.photos
      }
      return null
    },
    displaySpots () {
      if (this.stampInfo && this.settingSelected.includes('spot')) {
        return Object.entries(this.stampInfo).filter((stamp) => {
          return stamp[1].display === 0 && (!stamp[1].icon || stamp[1].icon === 'spot')
        })
      }
      return null
    },
    displayShops () {
      if (this.stampInfo && this.settingSelected.includes('shop')) {
        return Object.entries(this.stampInfo).filter((stamp) => {
          return stamp[1].display === 0 && stamp[1].icon === 'shop'
        })
      }
      return null
    },
    displayToilets () {
      if (this.stampInfo && this.settingSelected.includes('toilet')) {
        return Object.entries(this.stampInfo).filter((stamp) => {
          return stamp[1].display === 0 && stamp[1].icon === 'toilet'
        })
      }
      return null
    },
    displayStamps () {
      if (this.stampInfo && this.settingSelected.includes('stamp')) {
        if (this.userInfo.selectedCourse && this.userInfo.selectedCourse.length) {
          return Object.entries(this.stampInfo).filter((stamp) => {
            return stamp[1].display === 1 && stamp[1].invisible !== 1 && this.$store.getters.courseStatus.stamps.includes(stamp[1].id)
          })
        } else {
          return Object.entries(this.stampInfo).filter((stamp) => {
            return stamp[1].display === 1 && stamp[1].invisible !== 1
          })
        }
      }
      return null
    },
    calcDistance () {
      const user = this.location
      const stamp = this.$store.getters.courseStatus.path
      let dist = 0.0
      const e = 6378137.0
      dist = Math.floor(e * Math.acos(Math.cos(this.RAD(user.lat)) *
        Math.cos(this.RAD(stamp.lat)) * Math.cos(this.RAD(stamp.lng) - this.RAD(user.lng)) +
        Math.sin(this.RAD(user.lat)) * Math.sin(this.RAD(stamp.lat))))
      if (dist > 1000) {
        return dist / 1000 + ' km'
      } else {
        return dist + ' m'
      }
    },
    google: gmapApi
  },
  async created () {
    // 現在地を取得
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition(
        (position) => {
          this.initialLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          this.zoom = 16
        },
        (error) => {
          console.log(error.message)
        }, this.geoOption
      )
    }
    await this.$nextTick(() => this.getPlace())
    this.loaded = true
  },
  mounted () {
    // storeの値が更新されたタイミングで，情報を取得
    this.$store.watch((state, getters) => getters.userInfo,
      (newValue) => {
        this.userInfo = newValue
      }
    )
    this.$store.watch((state, getters) => getters.stampInfo.stamps,
      (newValue) => {
        this.stampInfo = newValue
      }
    )
    this.$store.watch((state, getters) => getters.adInfo.ads,
      (newValue) => {
        this.adInfo = newValue
      }
    )
    this.$store.watch((state, getters) => getters.photos.photo,
      (newValue) => {
        this.photos = newValue
      }
    )
    this.$store.watch((state, getters) => getters.courseStatus.path,
      (newValue) => {
        this.coursePath[0] = newValue
      }
    )
  },
  methods: {
    RAD (deg) {
      // ラジアンに変換
      return deg * Math.PI / 180
    },
    getPlace () {
      // ユーザの現在地を監視
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            this.location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            this.$store.dispatch('setUserLocation', this.location)
            if (this.userInfo.selectedCourse && this.userInfo.selectedCourse.length) {
              this.coursePath.splice(1, 1)
              this.coursePath.push(this.location)
            }
          },
          () => {
          }, this.geoOption
        )
      } else {
        alert('ブラウザがGPSをサポートしていません')
      }
    },
    async toggleInfoSt (param, target) {
      // マップ上で選択したスポット・スタンプ・写真の詳細表示
      await this.$store.dispatch('setSpotDetail', { state: false, id: '' })
      await this.$store.dispatch('setPhotoDetail', { state: false, id: [] })
      this.displayTarget = target
      this.infoWindowPos = { lat: param.location._lat, lng: param.location._long }
      if (target === 'stamp') {
        this.displayName = param.name
        this.infoWinOpen = true
        await this.$store.dispatch('setSpotDetail', { state: true, id: param.id })
      } else if (target === 'photo') {
        await this.$store.dispatch('setPhotoDetail', { state: true, id: [param.id] })
      }
    },
    closeInfoSt () {
      // 詳細表示を閉じる
      this.displayName = ''
      this.displayImage = ''
      this.displayTarget = null
      this.infoWinOpen = false
    },
    recenterMap (loc) {
      // マップの中心点をユーザの現在地に戻す
      this.location = loc
    },
    stampColor (id) {
      // スタンプの取得状況に合わせてスタンプの表示カラーを変更
      if (this.$store.getters.courseStatus.nextStamp && id === this.$store.getters.courseStatus.nextStamp) {
        return this.$store.getters.courseStatus.color
      } else if (this.userInfo.ownedStamps.length) {
        for (let i = 0; i < this.userInfo.ownedStamps.length; i++) {
          if (this.userInfo.ownedStamps[i].id === id) {
            return '#f15e64'
          }
        }
      }
      return '#696969'
    },
    clusteredInfo (e) {
      // 写真クラスタをタップした際の写真詳細表示
      const bounds = Object.entries(e.bounds_)
      const lat = bounds[0][1]
      const lng = bounds[1][1]
      const photos = Object.entries(this.photos)
      const array = photos.filter(photo => (photo[1].location._lat <= lat.hi && photo[1].location._lat >= lat.lo && photo[1].location._long <= lng.hi && photo[1].location._long >= lng.lo))
      const array2 = array.map((photo) => {
        return photo[0]
      })
      this.$store.dispatch('setPhotoDetail', { state: true, id: array2 })
    }
  }
}
</script>

<style scoped>
body {
  font-family: 'Noto Sans JP', sans-serif;
  overflow: hidden;
  height: 100%;
}
.iconSize-s {
  font-size: 18px;
}
.iconSize-m {
  font-size: 36px;
}
.iconSize-camera {
  position: absolute;
  right: -9px;
  top: 16px;
  font-size: 22px;
}
.iconCircle {
  max-width: 52px;
  max-height: 44px;
  border-radius: 0px;
  border: solid 2px white;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.iconSquare {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border-color: white;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.infowindow {
  font-family: 'Noto Sans JP', sans-serif;
  max-width: 160px;
  margin-left: 5px;
}
.modalFont {
  font-family: 'Noto Sans JP', sans-serif !important;
}
.carousel {
  width: 260px;
  height: 85px !important;
  position: absolute;
  top: 70px;
  right: 10px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
}
.setting {
  width: 36px;
  height: 36px;
  padding: 0;
  background-color: #555555;
  position: absolute;
  top: 250px;
  right: 15px;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
  display: flex;
  justify-content: center;
  align-items: center;
}
.pop {
  font-family: 'Noto Sans JP', sans-serif;
}

</style>
