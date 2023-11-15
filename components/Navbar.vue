<template>
  <!--上部ナビバー（コンソール）-->
  <header>
    <b-navbar class="fixed-top shadow-sm" style="background-color: #fafafa">
      <b-button variant="primary" class="mr-2" @click="goTop()">
        トップ
      </b-button>
      <div class="mr-auto d-flex justify-content-center">
        <b-navbar-brand>
          コンソール
        </b-navbar-brand>
        <b-navbar-brand v-if="$store.getters.selectedStamprally" class="eventTitle">
          {{ $store.getters.selectedStamprallyName }}
        </b-navbar-brand>
        <b-button
          v-if="$store.getters.selectedStamprally"
          variant="primary"
          class="p-auto"
          style="border: none; background-color: #fafafa"
          @click="$bvModal.show('showQr')"
        >
          <fa :icon="faQrcode" style="font-size: 24px; color: dimgrey" />
        </b-button>
      </div>
      <template>
        <div class="d-flex align-items-center">
          <span class="mr-2"> {{ $store.getters.userInfo.name }} </span>
          <fa :icon="faUserCircle" class="userIcon" :style="{color: $store.getters.userInfo.color}" />
          <b-button
            v-if="$store.getters.user._delegate.uid === 'XXXXX'"
            variant="danger"
            class="ml-2"
            size="sm"
            @click="$router.push({ name: 'account-manager' })"
          >
            <i class="fas fa-align-left" />
            <span>アカウントマネージャー</span>
          </b-button>
          <b-button size="sm" class="ml-2" variant="primary" @click="$bvModal.show('logout')">
            ログアウト
          </b-button>
          <b-modal id="logout" size="sm" hide-header hide-footer centered>
            <div class="text-center mt-4 mb-2 modalContent">
              <h4>ログアウトしますか？</h4>
              <div class="mt-4">
                <b-button class="mx-2" variant="primary" @click="logout()">
                  はい
                </b-button>
                <b-button class="mx-2" variant="outline-primary" @click="$bvModal.hide('logout')">
                  いいえ
                </b-button>
              </div>
            </div>
          </b-modal>
        </div>
      </template>
    </b-navbar>
    <div class="wrapper">
      <nav id="sidebar">
        <ul class="list-unstyled components">
          <li class="active">
            <a href="#">トップ</a>
          </li>
          <li>
            <a href="#">応募者リスト</a>
          </li>
        </ul>
      </nav>
    </div>
    <!--イベントQRコード表示のポップアップ-->
    <b-modal id="showQr" hide-footer>
      <template #modal-title>
        イベントURL
      </template>
      <div class="d-flex justify-content-center modalContent">
        <div class="mx-3">
          <div class="text-center">
            <qrcode id="eventQr" :value="eventURL + $store.getters.selectedStamprally + '/'" :options="{width: 300, height: 300}" tag="canvas" />
          </div>
          <h6 style="width: 300px; word-wrap: break-word; font-size: 18px">
            {{ eventURL }}{{ $store.getters.selectedStamprally }}/
          </h6>
          <div class="my-3 text-center" style="width: 300px">
            <b-button variant="primary" style="font-size: 14px" @click="downloadQr()">
              QRコードダウンロード
            </b-button>
            <b-button variant="outline-primary" style="font-size: 14px" @click="copyURL()">
              URLをコピー
            </b-button>
          </div>
        </div>
      </div>
    </b-modal>
  </header>
</template>

<script>
import { faUserCircle, faQrcode } from '@fortawesome/free-solid-svg-icons'
import { firestore } from '~/plugin/firebase'

export default {
  name: 'Navbar',
  data () {
    return {
      userName: 'テストユーザ',
      userColor: '#696969',
      eventURL: location.origin + '/stamprally/'
    }
  },
  computed: {
    faUserCircle () {
      return faUserCircle
    },
    faQrcode () {
      return faQrcode
    }
  },
  mounted () {
    this.detectUser()
  },
  methods: {
    logout () {
      // ログアウト
      this.goTop()
      this.$store.dispatch('signOut')
        .then(() => {
          this.$store.dispatch('setUserInfo', {
            name: '',
            age: '',
            region: '',
            color: '#696969',
            selectedCourse: '',
            completedCourse: [],
            ownedStamps: []
          })
          this.$router.push({
            name: 'console-login'
          })
        })
        .catch((err) => {
          window.alert(err.message)
        })
    },
    async detectUser () {
      // 遷移時に管理アカウントではない場合，自動ログアウト
      if (this.$store.getters.user) {
        const _this = this
        console.log(this.$store.getters.user._delegate.uid)
        await firestore
          .collection('adminUser')
          .doc(this.$store.getters.user._delegate.uid)
          .onSnapshot(function (doc) {
            if (!doc.exists) {
              _this.logout()
            }
          })
      }
    },
    goTop () {
      // トップ（スタンプラリー一覧）へ戻る
      this.$store.dispatch('selectStamprally', null)
      this.$store.dispatch('selectStamprallyName', null)
    },
    downloadQr () {
      // イベントQRコードのダウンロード
      const canvas = document.getElementById('eventQr')
      const type = 'imge/png'
      const dataURL = canvas.toDataURL(type)
      const bin = atob(dataURL.split(',')[1])
      const buffer = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i)
      }
      const blob = new Blob([buffer.buffer], { type })

      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = this.$store.getters.selectedStamprallyName + '.png'
      link.click()
    },
    copyURL () {
      // イベントURLをクリップボードにコピー
      navigator.clipboard.writeText(this.eventURL + this.$store.getters.selectedStamprally + '/')
        .then(() => {
          this.$bvToast.toast('クリップボードにコピーしました．', {
            variant: 'info'
          })
        })
        .catch((e) => {
          console.error(e)
        })
    }
  }
}
</script>

<style scoped>
header {
  font-family: 'Noto Sans JP', sans-serif;
}
.modalContent {
  font-family: 'Noto Sans JP', sans-serif !important;
}
.userIcon {
  background-color: white;
  font-size: 36px;
  border-radius: 50px;
}
.wrapper {
  display: flex;
  width: 100%;
  align-items: stretch;
}
#sidebar {
  min-width: 250px;
  max-width: 250px;
}
#sidebar.active {
  margin-left: -250px;
}
.eventTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
