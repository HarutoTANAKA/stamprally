<template>
  <!--コンソールのログイン画面-->
  <b-container>
    <b-row class="justify-content-center">
      <b-col>
        <h2 class="my-2" style="padding-top: 100px">
          ログイン
        </h2>
        <b-card style="border: none">
          <b-form
            ref="loginForm"
            v-model="loginValid"
            lazy-validation
          >
            <b-form-input
              v-model="loginEmail"
              placeholder="メールアドレス"
              class="my-3"
              size="lg"
              required
            />
            <b-form-input
              v-model="loginPassword"
              type="password"
              placeholder="パスワード"
              class="my-3"
              size="lg"
              required
            />
            <b-button
              :disabled="!loginValid"
              variant="primary"
              class="my-4"
              size="lg"
              block
              @click="login()"
            >
              ログイン
            </b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

export default {
  data () {
    return {
      loginValid: true,
      loginEmail: '',
      loginPassword: '',
      loginErrorMsg: ''
    }
  },
  methods: {
    login () {
      // firebase authでログイン
      this.$store.dispatch('signInWithEmail', {
        email: this.loginEmail,
        password: this.loginPassword
      }).then(() => {
        this.loginEmail = ''
        this.loginPassword = ''
        console.log('success')
        this.$router.push({
          name: 'console'
        })
      }).catch((err) => {
        if (err.code === 'auth/user-disabled') {
          this.loginErrorMsg = 'このアカウントは管理者により停止されています。'
          this.$bvToast.toast(this.loginErrorMsg, {
            variant: 'danger'
          })
        } else {
          this.loginErrorMsg = 'メールアドレスまたはパスワードに誤りがあります。'
          this.$bvToast.toast(this.loginErrorMsg, {
            variant: 'danger'
          })
          console.log(this.loginErrorMsg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
