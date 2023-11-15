<template>
  <div v-if="loaded" id="app" class="scroll-lock">
    <!--上部ナビゲーションバー-->
    <b-navbar class="fixed-top shadow-sm" style="background-color: #fafafa;">
      <b-button variant="primary" class="mr-2" @click="$router.push({ name: 'console' })">
        コンソールへ戻る
      </b-button>
      <b-navbar-brand style="color: dimgrey">権限付きアカウントの管理</b-navbar-brand>
    </b-navbar>
    <!--アカウント一覧-->
    <body v-if="admin" class="mx-1" style="background-color: #fafafa; color: dimgrey">
      <b-container class="p-3" style="font-family: 'Noto Sans JP', sans-serif !important;">
        <b-row class="p-2">
          <b-button size="lg" variant="outline-primary" @click="$bvModal.show('newAccount')">
            <fa :icon="faPlus" /> アカウントの新規作成
          </b-button>
        </b-row>
        <h5 class="my-2">運用中のアカウント</h5>
        <!--管理者（ロケモ）のアカウント表示-->
        <b-row v-if="!processing && users['XXXXX']" class="p-2">
          <b-col class="col-12 py-2">
            <div class="p-3 d-flex align-items-center" style="border: #e14e53 1px solid; background-color: #fafafa; border-radius: 8px">
              <span class="mx-3" style="font-size: 20px">{{ users['XXXXX'].name }}</span>
              <span class="mx-3">{{ users['XXXXX'].mail }}</span>
              <span class="mx-2 p-1" style="background-color: #007bff; border-radius: 3px; color: #fafafa; font-size: 14px">admin</span>
              <div class="ml-auto">
                <span class="mx-3">作成日：{{ users['XXXXX'].createdAt.toLocaleString() }}</span>
                <b-button size="sm" variant="outline-primary" class="mx-1" @click="selectUser(users['XXXXX'].uid, 'detail')">
                  詳細
                </b-button>
              </div>
            </div>
          </b-col>
        </b-row>
        <!--運用中のアカウントの表示-->
        <b-row v-if="!processing" class="p-2" style="max-height: 680px; overflow-y: scroll">
          <b-col v-for="user in users" :key="user.id" class="col-12 py-2">
            <div v-if="user.id !== 'XXXXX'" class="p-3 d-flex align-items-center" style="border: #696969 1px solid; background-color: #fafafa; border-radius: 8px">
              <span class="mx-3" style="font-size: 20px">{{ user.name }}</span>
              <span class="mx-3">{{ user.mail }}</span>
              <span v-if="user.disabled" class="mx-2 p-1" style="background-color: #e14e53; border-radius: 3px; color: #fafafa; font-size: 14px">停止中</span>
              <div class="ml-auto">
                <span class="mx-3">作成日：{{ user.createdAt.toLocaleString() }}</span>
                <b-button size="sm" variant="outline-primary" class="mx-1" @click="selectUser(user.uid, 'detail')">
                  詳細
                </b-button>
                <b-button v-if="!user.disabled" size="sm" variant="warning" class="mx-1" @click="selectUser(user.uid, 'deactivate')">
                  停止
                </b-button>
                <b-button v-else size="sm" variant="warning" class="mx-1" @click="selectUser(user.uid, 'activate')">
                  有効化
                </b-button>
                <b-button size="sm" variant="danger" class="mx-1" @click="selectUser(user.uid, 'delete')">
                  削除
                </b-button>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
      <!--詳細を表示するポップアップ-->
      <b-modal id="detail" centered no-close-on-backdrop hide-footer>
        <template #modal-title>
          詳細
        </template>
        <div v-if="usersInfo[selected]" class="p-3" style="font-family: 'Noto Sans JP', sans-serif !important;">
          <p>UID: {{ usersInfo[selected].uid }}</p>
          <p>名前: {{ usersInfo[selected].name }}</p>
          <p v-if="users[selected].login">最終ログイン: {{ new Date(users[selected].login.seconds * 1000).toLocaleString() }}</p>
          <p>ログインID: {{ users[selected].mail }}</p>
          <div class="d-flex justify-content-center">
            <b-button size="sm" variant="outline-danger" @click="$bvModal.show('newPassword')">
              パスワードを再設定
            </b-button>
          </div>
        </div>
      </b-modal>
      <!--アカウント削除確認のポップアップ-->
      <b-modal id="deleteAccount" size="sm" centered hide-footer hide-header>
        <div v-if="selected" class="p-3 text-center" style="font-family: 'Noto Sans JP', sans-serif !important;">
          <h5 class="my-3">
            {{ users[selected].name }}を削除しますか？
          </h5>
          <div v-if="processing" class="d-flex justify-content-center">
            <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="my-3" />
          </div>
          <div v-else class="d-flex justify-content-center">
            <b-button size="md" variant="primary" clss="mx-3" @click="deleteAccount()">
              はい
            </b-button>
            <b-button size="md" variant="outline-primary" class="mx-3" @click="$bvModal.hide('deleteAccount')">
              いいえ
            </b-button>
          </div>
        </div>
      </b-modal>
      <!--アカウント停止確認のポップアップ-->
      <b-modal id="deactivateAccount" size="sm" centered hide-footer hide-header>
        <div v-if="selected" class="p-3 text-center" style="font-family: 'Noto Sans JP', sans-serif !important;">
          <h5 class="my-3">
            {{ users[selected].name }}を停止しますか？
          </h5>
          <div v-if="processing" class="d-flex justify-content-center">
            <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="my-3" />
          </div>
          <div v-else class="d-flex justify-content-center">
            <b-button size="md" variant="primary" clss="mx-3" @click="deactivateAccount()">
              はい
            </b-button>
            <b-button size="md" variant="outline-primary" class="mx-3" @click="$bvModal.hide('deactivateAccount')">
              いいえ
            </b-button>
          </div>
        </div>
      </b-modal>
      <!--アカウント有効化確認のポップアップ-->
      <b-modal id="activateAccount" size="sm" centered hide-footer hide-header>
        <div v-if="selected" class="p-3 text-center" style="font-family: 'Noto Sans JP', sans-serif !important;">
          <h5 class="my-3">
            {{ users[selected].name }}を有効化しますか？
          </h5>
          <div v-if="processing" class="d-flex justify-content-center">
            <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="my-3" />
          </div>
          <div v-else class="d-flex justify-content-center">
            <b-button size="md" variant="primary" clss="mx-3" @click="activateAccount()">
              はい
            </b-button>
            <b-button size="md" variant="outline-primary" class="mx-3" @click="$bvModal.hide('activateAccount')">
              いいえ
            </b-button>
          </div>
        </div>
      </b-modal>
      <!--アカウントのパスワードリセットのポップアップ-->
      <b-modal id="newPassword" size="sm" centered hide-footer hide-header>
        <div v-if="selected" class="p-3 text-center" style="font-family: 'Noto Sans JP', sans-serif !important;">
          <h5 class="my-3">
            新しいパスワードを入力してください。
          </h5>
          <b-form-input v-model="reset.password" class="my-3" placeholder="パスワード（6文字以上）" />
          <div v-if="reset.loading" class="d-flex justify-content-center">
            <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="my-3" />
          </div>
          <div v-else class="d-flex justify-content-center">
            <b-button v-if="passwordValid(reset.password)" size="md" variant="primary" class="mx-2" @click="resetPassword()">
              確定
            </b-button>
            <b-button v-else size="md" class="mx-2" disabled>
              確定
            </b-button>
            <b-button size="md" variant="outline-primary" class="mx-2" @click="$bvModal.hide('newPassword')">
              キャンセル
            </b-button>
          </div>
        </div>
      </b-modal>
      <!--アカウント作成のポップアップ-->
      <b-modal id="newAccount" size="md" centered hide-footer>
        <template #modal-title>
          管理アカウントの作成
        </template>
        <div class="p-3" style="font-family: 'Noto Sans JP', sans-serif !important;">
          <div class="mb-3">
            <span>アカウント名</span>
            <b-form-input v-model="create.name" placeholder="" />
          </div>
          <div class="my-3">
            <span>ログインID（メールアドレス）</span>
            <b-form-input v-model="create.mail" type="email" placeholder="～～@○○.comの形式で入力" />
          </div>
          <div class="my-3">
            <span>パスワード</span>
            <b-form-input v-model="create.password" placeholder="6文字以上" />
          </div>
          <div v-if="create.loading" class="d-flex justify-content-center">
            <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="my-3" />
          </div>
          <div v-else class="d-flex justify-content-center">
            <b-button
              v-if="passwordValid(create.password) && nameValid(create.name) && mailValid(create.mail)"
              size="md"
              variant="primary"
              class="mx-2"
              @click="createAccount()"
            >
              確定
            </b-button>
            <b-button v-else size="md" class="mx-2" disabled>
              確定
            </b-button>
            <b-button size="md" variant="outline-primary" class="mx-2" @click="$bvModal.hide('newAccount')">
              キャンセル
            </b-button>
          </div>
        </div>
      </b-modal>
    </body>
  </div>
</template>

<script>
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import firebase from 'firebase/compat'
import { firestore } from '../../plugin/firebase'

export default {
  name: 'Index',
  data () {
    return {
      loaded: false,
      admin: false,
      users: {},
      usersInfo: {},
      selected: null,
      create: {
        loading: false,
        password: '',
        name: '',
        mail: ''
      },
      reset: {
        loading: false,
        password: ''
      },
      processing: false
    }
  },
  computed: {
    faPlus () {
      return faPlus
    }
  },
  async created () {
    // ログイン済みアカウントがロケモのものかどうか確認
    const _this = this
    if (this.$store.getters.isAuthenticated) {
      if (this.$store.getters.user._delegate.uid === 'XXXXX') {
        this.admin = true
      }
    } else {
      // ロケモじゃなければ前のページに戻る
      await this.$router.push({ path: '/console/login' })
    }
    // firestoreからユーザ情報取得
    await firestore
      .collection('adminUser')
      .orderBy('created', 'desc')
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.users, doc.id, doc.data())
          const createdAt = new Date(doc.data().created.seconds * 1000)
          _this.$set(_this.users[doc.id], 'createdAt', createdAt)
        })
      })
    await firestore
      .collection('users')
      .where('admin', '==', true)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.usersInfo, doc.id, doc.data())
        })
      })
    this.loaded = true
  },
  methods: {
    // パスワードが最低６文字かどうかのバリデーションチェック
    passwordValid (password) {
      return password.length >= 6
    },
    // 名前が１文字以上かどうかのバリデーションチェック
    nameValid (name) {
      return name.length >= 1
    },
    // IDがメールアドレスの形式をとっているかかどうかのバリデーションチェック
    mailValid (mail) {
      return mail.includes('@') && mail.includes('.com')
    },
    // アカウントの選択
    selectUser (id, state) {
      this.selected = id
      if (state === 'detail') {
        this.$bvModal.show('detail')
      } else if (state === 'delete') {
        this.$bvModal.show('deleteAccount')
      } else if (state === 'deactivate') {
        this.$bvModal.show('deactivateAccount')
      } else if (state === 'activate') {
        this.$bvModal.show('activateAccount')
      }
    },
    // アカウントの削除
    async deleteAccount () {
      this.processing = true
      // firebase functions呼び出し
      const deleteAccount = firebase.app().functions().httpsCallable('deleteUser')
      await deleteAccount(this.users[this.selected].uid)
        .then(() => {
          this.$bvToast.toast('アカウントを削除しました。', {
            variant: 'info'
          })
          this.$bvModal.hide('deleteAccount')
          this.processing = false
        })
        .catch((error) => {
          console.log(error)
          this.$bvToast.toast('削除に失敗しました。', {
            variant: 'danger'
          })
          this.$bvModal.hide('deleteAccount')
          this.processing = false
        })
    },
    // アカウントの停止
    async deactivateAccount () {
      this.processing = true
      // firebase functions呼び出し
      const deleteAccount = firebase.app().functions().httpsCallable('deactivateUser')
      await deleteAccount(this.users[this.selected].uid)
        .then(() => {
          this.$bvToast.toast('アカウントを停止しました。', {
            variant: 'info'
          })
          this.$bvModal.hide('deactivateAccount')
          this.processing = false
        })
        .catch((error) => {
          console.log(error)
          this.$bvToast.toast('アカウントの停止に失敗しました。', {
            variant: 'danger'
          })
          this.$bvModal.hide('deactivateAccount')
          this.processing = false
        })
    },
    // アカウントの有効化
    async activateAccount () {
      this.processing = true
      // firebase functions呼び出し
      const deleteAccount = firebase.app().functions().httpsCallable('activateUser')
      await deleteAccount(this.users[this.selected].uid)
        .then(() => {
          this.$bvToast.toast('アカウントを有効化しました。', {
            variant: 'info'
          })
          this.$bvModal.hide('activateAccount')
          this.processing = false
        })
        .catch((error) => {
          console.log(error)
          this.$bvToast.toast('アカウントの有効化に失敗しました。', {
            variant: 'danger'
          })
          this.$bvModal.hide('activateAccount')
          this.processing = false
        })
    },
    // パスワードのリセット
    async resetPassword () {
      this.reset.loading = true
      // firebase functions呼び出し
      const resetPW = firebase.app().functions().httpsCallable('resetPassword')
      await resetPW({
        uid: this.users[this.selected].uid,
        password: this.reset.password
      })
        .then(() => {
          this.$bvToast.toast('パスワードを変更しました。', {
            variant: 'info'
          })
          this.$bvModal.hide('newPassword')
          this.reset = {
            loading: false,
            password: ''
          }
        })
        .catch((error) => {
          console.log(error)
          this.$bvToast.toast('更新に失敗しました。', {
            variant: 'danger'
          })
          this.$bvModal.hide('newPassword')
          this.reset = {
            loading: false,
            password: ''
          }
        })
    },
    // アカウントの作成
    async createAccount () {
      this.create.loading = true
      // firebase functions呼び出し
      const createUser = firebase.app().functions().httpsCallable('createUser')
      await createUser({
        email: this.create.mail,
        name: this.create.name,
        password: this.create.password
      })
        .then(() => {
          this.$bvToast.toast('アカウントを作成しました。', {
            variant: 'info'
          })
          this.$bvModal.hide('newAccount')
          this.create = {
            loading: false,
            password: '',
            name: '',
            mail: ''
          }
        })
        .catch((error) => {
          console.log(error)
          this.$bvToast.toast('作成に失敗しました。', {
            variant: 'danger'
          })
          this.$bvModal.hide('newAccount')
          this.create = {
            loading: false,
            password: '',
            name: '',
            mail: ''
          }
        })
    }
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  padding-top: 50px;
  background-color: #fafafa;
  font-family: 'Noto Sans JP', sans-serif !important;
}
.card {
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
  border: none;
  border-radius: 8px;
  background-color: #fafafa;
}
</style>
