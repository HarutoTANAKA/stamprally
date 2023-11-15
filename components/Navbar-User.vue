<template>
  <!--上部のナビバー（ユーザ）-->
  <header>
    <b-navbar class="fixed-top shadow-sm" style="background-color: #fafafa; height: 62px;">
      <fa :icon="faHome" class="mr-3" style="font-size: 20px; color: #696969" @click="goTop()"></fa>
      <b-navbar-brand v-if="$route.name!=='stamprally'" class="mr-auto title" @click="$router.push('home')">
        {{ $store.getters.currentStamprally.name }}
      </b-navbar-brand>
      <b-navbar-brand v-else class="mr-auto title">
        ホーム
      </b-navbar-brand>
      <template>
        <div v-if="!$store.getters.isAuthenticated" class="d-flex align-items-center ml-2">
          <b-button variant="outline-primary" style="font-size: 12px; white-space: nowrap" @click="$router.push({name: 'stamprally-register'})">
            登録 / ログイン
          </b-button>
        </div>
        <div v-else class="d-flex align-items-center ml-2">
          <span class="mr-2" style="white-space: nowrap; color: #333333"> {{ userName }}</span>
          <b-button id="popover-target" pill class="mt-1" style="padding: 0; background-color: white; border: none">
            <fa :icon="faUserCircle" class="userIcon" :style="{color: userColor}" />
          </b-button>
        </div>
      </template>
    </b-navbar>
  </header>
</template>

<script>
// eslint-disable-next-line import/order
import { faUserCircle, faHome } from '@fortawesome/free-solid-svg-icons'
import Firestore from '~/plugin/firestore'

export default {
  name: 'NavbarUser',
  data () {
    return {
      userId: '',
      userName: this.$store.getters.userInfo.name,
      userColor: this.$store.getters.userInfo.color,
      inputName: '',
      stampInfo: {}
    }
  },
  computed: {
    faUserCircle () {
      return faUserCircle
    },
    faHome () {
      return faHome
    }
  },
  watch: {
    inputName (inputName) {
      this.inputName = this.nameLimit(inputName)
    }
  },
  created () {
    // ユーザがログイン済みの場合，storeからユーザIDを取得
    if (this.$store.getters.isAuthenticated) {
      this.userId = this.$store.getters.user._delegate.uid
    }
    console.log(this.$store.getters.currentStamprally, this.$route.name)
  },
  mounted () {
    // storeの値が更新されたタイミングで情報を取得
    this.$store.watch(state => state.userInfo,
      (newValue) => {
        this.userName = newValue.name
        this.userColor = newValue.color
        if (this.userName === 'none') {
          this.logOut()
        }
      })
  },
  methods: {
    nameSubmit () {
      // ニックネームの変更
      this.userName = this.inputName
      this.$store.dispatch('setUserName', this.userName)
      Firestore.userRename(this.userId, this.userName)
    },
    nameLimit (inputName) {
      // 入力ニックネームの文字数チェック
      return inputName.length > 10 ? inputName.slice(0, -1) : inputName
    },
    goTop () {
      // ホーム画面に戻る
      this.$store.dispatch('setCurrentStamprally', { id: null, name: null, lat: 0, lng: 0, color: '#696969' })
      this.$router.push({ name: 'stamprally' })
    }
  }
}
</script>

<style scoped>
.userIcon {
  background-color: white;
  font-size: 36px;
  border-radius: 50px;
}
header {
  font-family: 'Noto Sans JP', sans-serif;
}
.pop {
  font-family: 'Noto Sans JP', sans-serif;
}
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
