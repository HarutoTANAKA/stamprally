<template>
  <!--ログイン画面（ユーザ）-->
  <body id="app" class="mx-1">
    <b-row class="px-3 mx-2" style="margin-top: 80px">
      <h4>登録 / ログイン</h4>
    </b-row>
    <b-row v-if="$store.getters.isAuthenticated" id="register" class="px-3 d-flex justify-content-center align-items-center" style="padding-top: 30%">
      <div v-if="loading && !userExists" class="my-4 text-center">
        <b-spinner type="grow" label="Spinning" style="width: 3rem; height: 3rem;" class="my-3" :style="{color: userColor}" />
        <h5>しばらくお待ちください</h5>
      </div>
      <div v-else-if="loading && userExists" class="my-4 text-center">
        <h5>既に登録済みのユーザです。</h5>
        <h5>トップへ戻ります。</h5>
      </div>
      <div v-else class="my-2 text-center">
        <div v-if="formNum === 1">
          <h5>ニックネームを決めてください</h5>
          <div class="d-flex align-items-center">
            <div class="col-3" />
            <div class="col-6">
              <fa :icon="faUserCircle" class="userIcon mt-3" :style="{color: userColor}" />
              <b-form class="form-inline justify-content-center mt-3">
                <div>
                  <b-form-input
                    v-model="user.name"
                    class="form-control"
                    type="text"
                    placeholder="最大10文字"
                    @submit.prevent
                  />
                </div>
              </b-form>
            </div>
            <div class="col-3">
              <b-button v-if="user.name !== ''" variant="outline-primary" class="shadow-sm" style="border-radius: 50%; border: none" @click="formNum++">
                <fa :icon="faArrowRight" />
              </b-button>
            </div>
          </div>
        </div>
        <div v-else-if="formNum === 2">
          <h5>年齢を選択してください</h5>
          <div class="d-flex align-items-center">
            <div class="col-3">
              <b-button variant="outline-primary" class="shadow-sm" style="border: none; border-radius: 50%" @click="formNum--">
                <fa :icon="faArrowLeft" />
              </b-button>
            </div>
            <div class="col-6">
              <fa :icon="faUserCircle" class="userIcon mt-3" :style="{color: userColor}" />
              <b-form class="form-inline justify-content-center mt-3">
                <b-dropdown :text="user.age" variant="outline-secondary">
                  <b-dropdown-item @click="user.age = '10代'">
                    10代
                  </b-dropdown-item>
                  <b-dropdown-item @click="user.age = '20代'">
                    20代
                  </b-dropdown-item>
                  <b-dropdown-item @click="user.age = '30代'">
                    30代
                  </b-dropdown-item>
                  <b-dropdown-item @click="user.age = '40代'">
                    40代
                  </b-dropdown-item>
                  <b-dropdown-item @click="user.age = '50代'">
                    50代
                  </b-dropdown-item>
                  <b-dropdown-item @click="user.age = '60代以上'">
                    60代以上
                  </b-dropdown-item>
                </b-dropdown>
              </b-form>
            </div>
            <div class="col-3">
              <b-button v-if="user.age !== ''" variant="outline-primary" class="shadow-sm" style="border-radius: 50%; border: none" @click="formNum++">
                <fa :icon="faArrowRight" />
              </b-button>
            </div>
          </div>
        </div>
        <div v-else-if="formNum === 3">
          <h5>性別を選択してください</h5>
          <div class="d-flex align-items-center">
            <div class="col-3">
              <b-button variant="outline-primary" class="shadow-sm" style="border: none; border-radius: 50%" @click="formNum--">
                <fa :icon="faArrowLeft" />
              </b-button>
            </div>
            <div class="col-6">
              <fa :icon="faUserCircle" class="userIcon mt-3" :style="{color: userColor}" />
              <b-form class="form-inline justify-content-center mt-3">
                <b-dropdown :text="user.sex" variant="outline-secondary">
                  <b-dropdown-item @click="user.sex = '男性'">
                    男性
                  </b-dropdown-item>
                  <b-dropdown-item @click="user.sex = '女性'">
                    女性
                  </b-dropdown-item>
                  <b-dropdown-item @click="user.sex = '未設定'">
                    設定しない
                  </b-dropdown-item>
                </b-dropdown>
              </b-form>
            </div>
            <div class="col-3">
              <b-button v-if="user.sex !== ''" variant="outline-primary" class="shadow-sm" style="border-radius: 50%; border: none" @click="formNum++">
                <fa :icon="faArrowRight" />
              </b-button>
            </div>
          </div>
        </div>
        <div v-else-if="formNum === 4">
          <h5>居住地を選択してください</h5>
          <div class="d-flex align-items-center">
            <div class="col-3">
              <b-button variant="outline-primary" class="shadow-sm" style="border: none; border-radius: 50%" @click="formNum--">
                <fa :icon="faArrowLeft" />
              </b-button>
            </div>
            <div class="col-6">
              <fa :icon="faUserCircle" class="userIcon mt-3" :style="{color: userColor}" /><br>
              <div>
                <b-form inline>
                  <label>都道府県</label>
                  <b-form-select v-model="selected" :options="options"></b-form-select><br>
                </b-form>
                <b-form inline>
                  <label>市町村群</label>
                  <b-form-select v-if="selected === 1" v-model="user.region" :options="options1" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 2" v-model="user.region" :options="options2" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 3" v-model="user.region" :options="options3" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 4" v-model="user.region" :options="options4" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 5" v-model="user.region" :options="options5" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 6" v-model="user.region" :options="options6" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 7" v-model="user.region" :options="options7" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 8" v-model="user.region" :options="options8" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 9" v-model="user.region" :options="options9" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 10" v-model="user.region" :options="options10" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 11" v-model="user.region" :options="options11" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 12" v-model="user.region" :options="options12" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 13" v-model="user.region" :options="options13" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 14" v-model="user.region" :options="options14" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 15" v-model="user.region" :options="options15" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 16" v-model="user.region" :options="options16" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 17" v-model="user.region" :options="options17" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 18" v-model="user.region" :options="options18" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 19" v-model="user.region" :options="options19" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 20" v-model="user.region" :options="options20" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 21" v-model="user.region" :options="options21" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 22" v-model="user.region" :options="options22" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 23" v-model="user.region" :options="options23" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 24" v-model="user.region" :options="options24" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 25" v-model="user.region" :options="options25" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 26" v-model="user.region" :options="options26" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 27" v-model="user.region" :options="options27" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 28" v-model="user.region" :options="options28" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 29" v-model="user.region" :options="options29" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 30" v-model="user.region" :options="options30" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 31" v-model="user.region" :options="options31" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 32" v-model="user.region" :options="options32" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 33" v-model="user.region" :options="options33" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 34" v-model="user.region" :options="options34" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 35" v-model="user.region" :options="options35" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 36" v-model="user.region" :options="options36" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 37" v-model="user.region" :options="options37" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 38" v-model="user.region" :options="options38" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 39" v-model="user.region" :options="options39" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 40" v-model="user.region" :options="options40" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 41" v-model="user.region" :options="options41" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 42" v-model="user.region" :options="options42" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 43" v-model="user.region" :options="options43" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 44" v-model="user.region" :options="options44" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 45" v-model="user.region" :options="options45" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 46" v-model="user.region" :options="options46" :select-size="10"></b-form-select>
                  <b-form-select v-if="selected === 47" v-model="user.region" :options="options47" :select-size="10"></b-form-select>
                  <b-form-input v-if="user.region ==='その他'" v-model="user.regionOption" placeholder="居住地を入力" class="my-2" style="font-size: 14px" />
                </b-form>
              </div>
            </div>
            <div class="col-3">
              <b-button v-if="user.region==='その他' && !user.regionOption.length" variant="outline-secondary" class="shadow-sm" style="border-radius: 50%; border: none" disabled>
                <fa :icon="faCheck" />
              </b-button>
              <b-button v-else-if="user.region!==''" variant="outline-primary" class="shadow-sm" style="border-radius: 50%; border: none" @click="addUser()">
                <fa :icon="faCheck" />
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </b-row>
    <b-row v-else class="px-3 d-flex justify-content-center align-items-center" style="margin-bottom: 30px">
      <b-col class="my-2 col-10">
        <div class="my-3">
          <b-form-input v-model="loginEmail" placeholder="メールアドレス" />
        </div>
        <div class="my-3 d-flex">
          <b-form-input v-model="loginPassword" placeholder="パスワード" :type="inputType" />
          <div style="position: absolute; right: 30px; margin-top: 5px;">
            <fa v-if="!passChecked" :icon="faEyeSlash" class="ml-auto" @click="passClick()" />
            <fa v-else :icon="faEye" class="ml-auto" @click="passClick()" />
          </div>
        </div>
        <p v-if="loginErrorMessage" class="text-center" style="color: #e14e53; font-size: 14px">
          {{ loginErrorMessage }}
        </p>
        <div class="my-1 d-flex justify-content-center">
          <div v-if="loginEmail.length && loginPassword.length" class="d-flex justify-content-center">
            <b-button size="lg" variant="primary" class="mx-2" pill @click="signInWithMailAndPW()">
              ログイン
            </b-button>
          </div>
          <div v-else class="d-flex justify-content-center">
            <b-button size="lg" class="mx-2" disabled pill>
              ログイン
            </b-button>
          </div>
        </div>
        <div class="mt-4 d-flex justify-content-center" style="font-size: 20px">
          <p>または</p>
          <p style="color: #007bff; text-decoration: underline" @click="$bvModal.show('signup')">
            新規登録
          </p>
        </div>
        <div class="my-2 text-center" style="font-size: 12px">
          <p>
            「小城ing2022」など他イベントに参加された方は<br>アカウントを引き継ぎます
          </p>
          <p style="color: #007bff" @click="$bvModal.show('resetPW')">
            パスワードをお忘れの方はこちら
          </p>
        </div>
        <hr class="mt-4 flex-grow-1">
      </b-col>
      <b-col class="text-center my-2 col-10">
        <b-button class="py-2" style="background-color: #E94235; border: none; font-size: 14px;" block @click="signInWithGoogle()">
          <fa :icon="faGoogle" class="mr-3" style="font-size: 20px" />
          Googleでログイン
        </b-button>
      </b-col>
      <b-col class="text-center my-2 col-10">
        <b-button class="py-2" style="background-color: #00b900; border: none; font-size: 14px;" block @click="$bvModal.show('lineLogin')">
          <fa :icon="faLine" class="mr-3" style="font-size: 20px" />
          LINEでログイン
        </b-button>
      </b-col>
      <b-col class="text-center my-2 col-10">
        <b-button class="py-2" style="background-color: #1d9bf0; border: none; font-size: 14px;" block @click="signInWithTwitter()">
          <fa :icon="faTwitter" class="mr-3" style="font-size: 20px" />
          Twitterでログイン
        </b-button>
      </b-col>
    </b-row>
    <!--新規登録のポップアップ-->
    <b-modal id="signup" centered hide-footer no-close-on-esc no-close-on-backdrop>
      <template #modal-title>
        新規登録
      </template>
      <div class="py-1" style="font-family: 'Noto Sans JP', sans-serif !important;">
        <h6>メールアドレスとパスワードを入力してアカウントを作成します。</h6>
        <div class="my-2 px-3" style="font-size: 16px">
          <div class="my-3">
            <b-form-input v-model="newEmail" placeholder="メールアドレス" />
          </div>
          <div class="my-3 d-flex">
            <b-form-input v-model="newPassword" placeholder="パスワード（6文字以上）" :type="inputType" />
            <div style="position: absolute; right: 40px; margin-top: 5px;">
              <fa v-if="!passChecked" :icon="faEyeSlash" class="ml-auto" @click="passClick()" />
              <fa v-else :icon="faEye" class="ml-auto" @click="passClick()" />
            </div>
          </div>
          <p v-if="signUpErrorMessage" class="text-center" style="color: #e14e53; font-size: 14px">
            {{ signUpErrorMessage }}
          </p>
        </div>
        <div class="my-1 d-flex justify-content-center">
          <b-button v-if="newEmail.length && newPassword.length" variant="primary" class="mx-2" @click="signUp()">
            登録
          </b-button>
          <b-button v-else class="mx-2" disabled>
            登録
          </b-button>
        </div>
      </div>
    </b-modal>
    <!--パスワードリセット用のポップアップ-->
    <b-modal id="resetPW" centered hide-footer>
      <template #modal-title>
        パスワードの再設定
      </template>
      <div class="py-1" style="font-family: 'Noto Sans JP', sans-serif !important;">
        <div class="my-1 px-1">
          <h6>登録したメールアドレスを入力してください。</h6>
          <div class="my-3">
            <b-form-input v-model="resetEmail" placeholder="登録時のメールアドレス" />
          </div>
          <p v-if="isMailSend===true" class="text-center" style="color: #e14e53; font-size: 14px">
            入力されたメールアドレスへパスワード再設定用のリンクを送信しました。
          </p>
          <p v-else-if="resetErrorMessage" class="text-center" style="color: #e14e53; font-size: 14px">
            {{ resetErrorMessage }}
          </p>
        </div>
        <div class="my-1 d-flex justify-content-center">
          <b-button v-if="resetEmail.length && isMailSend===false" variant="primary" @click="passwordReset()">
            送信
          </b-button>
          <b-button v-else-if="resetEmail.length && isMailSend===true" variant="primary" @click="passwordReset()">
            再送信
          </b-button>
          <b-button v-else disabled>
            送信
          </b-button>
        </div>
      </div>
    </b-modal>
    <!--LINEログインのポップアップ-->
    <b-modal id="lineLogin" centered hide-footer>
      <template #modal-title>
        LINEアカウントでログイン
      </template>
      <div class="py-1" style="font-family: 'Noto Sans JP', sans-serif !important;">
        <div class="my-1 px-1">
          <h5>LINEアカウントを使用してログインします。</h5>
          <div class="my-3" style="font-size: 14px">
            <p class="mb-1">
              LINEログイン時の認証画面で許可を行うと，本サービスはあなたのLINEアカウントに紐づけされたメールアドレスを取得する場合があります。
            </p>
            <p>取得されたメールアドレスは以下の目的で使用され，法令に定められた場合を除き，第三者への提供は行いません。</p>
            <p class="mb-0">
              ・本サービスでのアカウント管理
            </p>
          </div>
        </div>
        <div class="my-1 d-flex justify-content-center">
          <b-button style="background-color: #00b900; border: none" @click="signInWithLine()">
            同意してログイン
          </b-button>
        </div>
      </div>
    </b-modal>
  </body>
</template>

<script>
import { getAuth } from 'firebase/auth'
import { faUserCircle, faArrowRight, faArrowLeft, faCheck, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faTwitter, faLine } from '@fortawesome/free-brands-svg-icons'
import { auth } from '~/plugin/firebase.js'
import Firestore from '~/plugin/firestore'

export default {
  name: 'Register',
  data () {
    return {
      auth: getAuth(),
      userInfo: null,
      user: {
        uid: null,
        provider: null,
        name: '',
        age: '年齢を選択してください',
        sex: '性別を選択してください',
        region: '',
        regionOption: ''
      },
      loading: true,
      formNum: 1,
      userColor: null,
      resetEmail: '',
      loginEmail: '',
      loginPassword: '',
      newEmail: '',
      newPassword: '',
      authState: 0,
      isMailSend: false,
      userExists: false,
      loginErrorMessage: null,
      signUpErrorMessage: null,
      resetErrorMessage: null,
      passChecked: false,
      selected: null,
      selected2: null,
      options: [
        { value: null, text: '都道府県を選択' },
        { value: 1, text: '北海道' },
        { value: 2, text: '青森県' },
        { value: 3, text: '岩手県' },
        { value: 4, text: '宮城県' },
        { value: 5, text: '秋田県' },
        { value: 6, text: '山形県' },
        { value: 7, text: '福島県' },
        { value: 8, text: '茨城県' },
        { value: 9, text: '栃木県' },
        { value: 10, text: '群馬県' },
        { value: 11, text: '埼玉県' },
        { value: 12, text: '千葉県' },
        { value: 13, text: '東京都' },
        { value: 14, text: '神奈川県' },
        { value: 15, text: '新潟県' },
        { value: 16, text: '富山県' },
        { value: 17, text: '石川県' },
        { value: 18, text: '福井県' },
        { value: 19, text: '山梨県' },
        { value: 20, text: '長野県' },
        { value: 21, text: '岐阜県' },
        { value: 22, text: '静岡県' },
        { value: 23, text: '愛知県' },
        { value: 24, text: '三重県' },
        { value: 25, text: '滋賀県' },
        { value: 26, text: '京都府' },
        { value: 27, text: '大阪府' },
        { value: 28, text: '兵庫県' },
        { value: 29, text: '奈良県' },
        { value: 30, text: '和歌山県' },
        { value: 31, text: '鳥取県' },
        { value: 32, text: '島根県' },
        { value: 33, text: '岡山県' },
        { value: 34, text: '広島県' },
        { value: 35, text: '山口県' },
        { value: 36, text: '徳島県' },
        { value: 37, text: '香川県' },
        { value: 38, text: '愛媛県' },
        { value: 39, text: '高知県' },
        { value: 40, text: '福岡県' },
        { value: 41, text: '佐賀県' },
        { value: 42, text: '長崎県' },
        { value: 43, text: '熊本県' },
        { value: 44, text: '大分県' },
        { value: 45, text: '宮崎県' },
        { value: 46, text: '鹿児島県' },
        { value: 47, text: '沖縄県' }
      ],
      options1: [
        { value: '札幌市中央区', text: '札幌市中央区' },
        { value: '札幌市北区', text: '札幌市北区' },
        { value: '札幌市東区', text: '札幌市東区' },
        { value: '札幌市白石区', text: '札幌市白石区' },
        { value: '札幌市豊平区', text: '札幌市豊平区' },
        { value: '札幌市南区', text: '札幌市南区' },
        { value: '札幌市西区', text: '札幌市西区' },
        { value: '札幌市厚別区', text: '札幌市厚別区' },
        { value: '札幌市手稲区', text: '札幌市手稲区' },
        { value: '札幌市清田区', text: '札幌市清田区' },
        { value: '函館市', text: '函館市' },
        { value: '小樽市', text: '小樽市' },
        { value: '旭川市', text: '旭川市' },
        { value: '室蘭市', text: '室蘭市' },
        { value: '釧路市', text: '釧路市' },
        { value: '帯広市', text: '帯広市' },
        { value: '北見市', text: '北見市' },
        { value: '夕張市', text: '夕張市' },
        { value: '岩見沢市', text: '岩見沢市' },
        { value: '網走市', text: '網走市' },
        { value: '留萌市', text: '留萌市' },
        { value: '苫小牧市', text: '苫小牧市' },
        { value: '稚内市', text: '稚内市' },
        { value: '美唄市', text: '美唄市' },
        { value: '芦別市', text: '芦別市' },
        { value: '江別市', text: '江別市' },
        { value: '赤平市', text: '赤平市' },
        { value: '紋別市', text: '紋別市' },
        { value: '士別市', text: '士別市' },
        { value: '名寄市', text: '名寄市' },
        { value: '三笠市', text: '三笠市' },
        { value: '根室市', text: '根室市' },
        { value: '千歳市', text: '千歳市' },
        { value: '滝川市', text: '滝川市' },
        { value: '砂川市', text: '砂川市' },
        { value: '歌志内市', text: '歌志内市' },
        { value: '深川市', text: '深川市' },
        { value: '富良野市', text: '富良野市' },
        { value: '登別市', text: '登別市' },
        { value: '恵庭市', text: '恵庭市' },
        { value: '伊達市', text: '伊達市' },
        { value: '北広島市', text: '北広島市' },
        { value: '石狩市', text: '石狩市' },
        { value: '北斗市', text: '北斗市' },
        { value: '石狩郡当別町', text: '石狩郡当別町' },
        { value: '石狩郡新篠津村', text: '石狩郡新篠津村' },
        { value: '松前郡松前町', text: '松前郡松前町' },
        { value: '松前郡福島町', text: '松前郡福島町' },
        { value: '上磯郡知内町', text: '上磯郡知内町' },
        { value: '上磯郡木古内町', text: '上磯郡木古内町' },
        { value: '亀田郡七飯町', text: '亀田郡七飯町' },
        { value: '茅部郡鹿部町', text: '茅部郡鹿部町' },
        { value: '茅部郡森町', text: '茅部郡森町' },
        { value: '二海郡八雲町', text: '二海郡八雲町' },
        { value: '山越郡長万部町', text: '山越郡長万部町' },
        { value: '檜山郡江差町', text: '檜山郡江差町' },
        { value: '檜山郡上ノ国町', text: '檜山郡上ノ国町' },
        { value: '檜山郡厚沢部町', text: '檜山郡厚沢部町' },
        { value: '爾志郡乙部町', text: '爾志郡乙部町' },
        { value: '奥尻郡奥尻町', text: '奥尻郡奥尻町' },
        { value: '瀬棚郡今金町', text: '瀬棚郡今金町' },
        { value: '久遠郡せたな町', text: '久遠郡せたな町' },
        { value: '島牧郡島牧村', text: '島牧郡島牧村' },
        { value: '寿都郡寿都町', text: '寿都郡寿都町' },
        { value: '寿都郡黒松内町', text: '寿都郡黒松内町' },
        { value: '磯谷郡蘭越町', text: '磯谷郡蘭越町' },
        { value: '虻田郡ニセコ町', text: '虻田郡ニセコ町' },
        { value: '虻田郡真狩村', text: '虻田郡真狩村' },
        { value: '虻田郡留寿都村', text: '虻田郡留寿都村' },
        { value: '虻田郡喜茂別町', text: '虻田郡喜茂別町' },
        { value: '虻田郡京極町', text: '虻田郡京極町' },
        { value: '虻田郡倶知安町', text: '虻田郡倶知安町' },
        { value: '岩内郡共和町', text: '岩内郡共和町' },
        { value: '岩内郡岩内町', text: '岩内郡岩内町' },
        { value: '古宇郡泊村', text: '古宇郡泊村' },
        { value: '古宇郡神恵内村', text: '古宇郡神恵内村' },
        { value: '積丹郡積丹町', text: '積丹郡積丹町' },
        { value: '古平郡古平町', text: '古平郡古平町' },
        { value: '余市郡仁木町', text: '余市郡仁木町' },
        { value: '余市郡余市町', text: '余市郡余市町' },
        { value: '余市郡赤井川村', text: '余市郡赤井川村' },
        { value: '空知郡南幌町', text: '空知郡南幌町' },
        { value: '空知郡奈井江町', text: '空知郡奈井江町' },
        { value: '空知郡上砂川町', text: '空知郡上砂川町' },
        { value: '夕張郡由仁町', text: '夕張郡由仁町' },
        { value: '夕張郡長沼町', text: '夕張郡長沼町' },
        { value: '夕張郡栗山町', text: '夕張郡栗山町' },
        { value: '樺戸郡月形町', text: '樺戸郡月形町' },
        { value: '樺戸郡浦臼町', text: '樺戸郡浦臼町' },
        { value: '樺戸郡新十津川町', text: '樺戸郡新十津川町' },
        { value: '雨竜郡妹背牛町', text: '雨竜郡妹背牛町' },
        { value: '雨竜郡秩父別町', text: '雨竜郡秩父別町' },
        { value: '雨竜郡雨竜町', text: '雨竜郡雨竜町' },
        { value: '雨竜郡北竜町', text: '雨竜郡北竜町' },
        { value: '雨竜郡沼田町', text: '雨竜郡沼田町' },
        { value: '上川郡鷹栖町', text: '上川郡鷹栖町' },
        { value: '上川郡東神楽町', text: '上川郡東神楽町' },
        { value: '上川郡当麻町', text: '上川郡当麻町' },
        { value: '上川郡比布町', text: '上川郡比布町' },
        { value: '上川郡愛別町', text: '上川郡愛別町' },
        { value: '上川郡上川町', text: '上川郡上川町' },
        { value: '上川郡東川町', text: '上川郡東川町' },
        { value: '上川郡美瑛町', text: '上川郡美瑛町' },
        { value: '空知郡上富良野町', text: '空知郡上富良野町' },
        { value: '空知郡中富良野町', text: '空知郡中富良野町' },
        { value: '空知郡南富良野町', text: '空知郡南富良野町' },
        { value: '勇払郡占冠村', text: '勇払郡占冠村' },
        { value: '上川郡和寒町', text: '上川郡和寒町' },
        { value: '上川郡剣淵町', text: '上川郡剣淵町' },
        { value: '上川郡下川町', text: '上川郡下川町' },
        { value: '中川郡美深町', text: '中川郡美深町' },
        { value: '中川郡音威子府村', text: '中川郡音威子府村' },
        { value: '中川郡中川町', text: '中川郡中川町' },
        { value: '雨竜郡幌加内町', text: '雨竜郡幌加内町' },
        { value: '増毛郡増毛町', text: '増毛郡増毛町' },
        { value: '留萌郡小平町', text: '留萌郡小平町' },
        { value: '苫前郡苫前町', text: '苫前郡苫前町' },
        { value: '苫前郡羽幌町', text: '苫前郡羽幌町' },
        { value: '苫前郡初山別村', text: '苫前郡初山別村' },
        { value: '天塩郡遠別町', text: '天塩郡遠別町' },
        { value: '天塩郡天塩町', text: '天塩郡天塩町' },
        { value: '宗谷郡猿払村', text: '宗谷郡猿払村' },
        { value: '枝幸郡浜頓別町', text: '枝幸郡浜頓別町' },
        { value: '枝幸郡中頓別町', text: '枝幸郡中頓別町' },
        { value: '枝幸郡枝幸町', text: '枝幸郡枝幸町' },
        { value: '天塩郡豊富町', text: '天塩郡豊富町' },
        { value: '礼文郡礼文町', text: '礼文郡礼文町' },
        { value: '利尻郡利尻町', text: '利尻郡利尻町' },
        { value: '利尻郡利尻富士町', text: '利尻郡利尻富士町' },
        { value: '天塩郡幌延町', text: '天塩郡幌延町' },
        { value: '網走郡美幌町', text: '網走郡美幌町' },
        { value: '網走郡津別町', text: '網走郡津別町' },
        { value: '斜里郡斜里町', text: '斜里郡斜里町' },
        { value: '斜里郡清里町', text: '斜里郡清里町' },
        { value: '斜里郡小清水町', text: '斜里郡小清水町' },
        { value: '常呂郡訓子府町', text: '常呂郡訓子府町' },
        { value: '常呂郡置戸町', text: '常呂郡置戸町' },
        { value: '常呂郡佐呂間町', text: '常呂郡佐呂間町' },
        { value: '紋別郡遠軽町', text: '紋別郡遠軽町' },
        { value: '紋別郡湧別町', text: '紋別郡湧別町' },
        { value: '紋別郡滝上町', text: '紋別郡滝上町' },
        { value: '紋別郡興部町', text: '紋別郡興部町' },
        { value: '紋別郡西興部村', text: '紋別郡西興部村' },
        { value: '紋別郡雄武町', text: '紋別郡雄武町' },
        { value: '網走郡大空町', text: '網走郡大空町' },
        { value: '虻田郡豊浦町', text: '虻田郡豊浦町' },
        { value: '有珠郡壮瞥町', text: '有珠郡壮瞥町' },
        { value: '白老郡白老町', text: '白老郡白老町' },
        { value: '勇払郡厚真町', text: '勇払郡厚真町' },
        { value: '虻田郡洞爺湖町', text: '虻田郡洞爺湖町' },
        { value: '勇払郡安平町', text: '勇払郡安平町' },
        { value: '勇払郡むかわ町', text: '勇払郡むかわ町' },
        { value: '沙流郡日高町', text: '沙流郡日高町' },
        { value: '沙流郡平取町', text: '沙流郡平取町' },
        { value: '新冠郡新冠町', text: '新冠郡新冠町' },
        { value: '浦河郡浦河町', text: '浦河郡浦河町' },
        { value: '様似郡様似町', text: '様似郡様似町' },
        { value: '幌泉郡えりも町', text: '幌泉郡えりも町' },
        { value: '日高郡新ひだか町', text: '日高郡新ひだか町' },
        { value: '河東郡音更町', text: '河東郡音更町' },
        { value: '河東郡士幌町', text: '河東郡士幌町' },
        { value: '河東郡上士幌町', text: '河東郡上士幌町' },
        { value: '河東郡鹿追町', text: '河東郡鹿追町' },
        { value: '上川郡新得町', text: '上川郡新得町' },
        { value: '上川郡清水町', text: '上川郡清水町' },
        { value: '河西郡芽室町', text: '河西郡芽室町' },
        { value: '河西郡中札内村', text: '河西郡中札内村' },
        { value: '河西郡更別村', text: '河西郡更別村' },
        { value: '広尾郡大樹町', text: '広尾郡大樹町' },
        { value: '広尾郡広尾町', text: '広尾郡広尾町' },
        { value: '中川郡幕別町', text: '中川郡幕別町' },
        { value: '中川郡池田町', text: '中川郡池田町' },
        { value: '中川郡豊頃町', text: '中川郡豊頃町' },
        { value: '中川郡本別町', text: '中川郡本別町' },
        { value: '足寄郡足寄町', text: '足寄郡足寄町' },
        { value: '足寄郡陸別町', text: '足寄郡陸別町' },
        { value: '十勝郡浦幌町', text: '十勝郡浦幌町' },
        { value: '釧路郡釧路町', text: '釧路郡釧路町' },
        { value: '厚岸郡厚岸町', text: '厚岸郡厚岸町' },
        { value: '厚岸郡浜中町', text: '厚岸郡浜中町' },
        { value: '川上郡標茶町', text: '川上郡標茶町' },
        { value: '川上郡弟子屈町', text: '川上郡弟子屈町' },
        { value: '阿寒郡鶴居村', text: '阿寒郡鶴居村' },
        { value: '白糠郡白糠町', text: '白糠郡白糠町' },
        { value: '野付郡別海町', text: '野付郡別海町' },
        { value: '標津郡中標津町', text: '標津郡中標津町' },
        { value: '標津郡標津町', text: '標津郡標津町' },
        { value: '目梨郡羅臼町', text: '目梨郡羅臼町' },
        { value: 'その他', text: 'その他' }
      ],
      options2: [
        { value: '青森市', text: '青森市' },
        { value: '弘前市', text: '弘前市' },
        { value: '八戸市', text: '八戸市' },
        { value: '黒石市', text: '黒石市' },
        { value: '五所川原市', text: '五所川原市' },
        { value: '十和田市', text: '十和田市' },
        { value: '三沢市', text: '三沢市' },
        { value: 'むつ市', text: 'むつ市' },
        { value: 'つがる市', text: 'つがる市' },
        { value: '平川市', text: '平川市' },
        { value: '東津軽郡平内町', text: '東津軽郡平内町' },
        { value: '東津軽郡今別町', text: '東津軽郡今別町' },
        { value: '東津軽郡蓬田村', text: '東津軽郡蓬田村' },
        { value: '東津軽郡外ヶ浜町', text: '東津軽郡外ヶ浜町' },
        { value: '西津軽郡鰺ヶ沢町', text: '西津軽郡鰺ヶ沢町' },
        { value: '西津軽郡深浦町', text: '西津軽郡深浦町' },
        { value: '中津軽郡西目屋村', text: '中津軽郡西目屋村' },
        { value: '南津軽郡藤崎町', text: '南津軽郡藤崎町' },
        { value: '南津軽郡大鰐町', text: '南津軽郡大鰐町' },
        { value: '南津軽郡田舎館村', text: '南津軽郡田舎館村' },
        { value: '北津軽郡板柳町', text: '北津軽郡板柳町' },
        { value: '北津軽郡鶴田町', text: '北津軽郡鶴田町' },
        { value: '北津軽郡中泊町', text: '北津軽郡中泊町' },
        { value: '上北郡野辺地町', text: '上北郡野辺地町' },
        { value: '上北郡七戸町', text: '上北郡七戸町' },
        { value: '上北郡六戸町', text: '上北郡六戸町' },
        { value: '上北郡横浜町', text: '上北郡横浜町' },
        { value: '上北郡東北町', text: '上北郡東北町' },
        { value: '上北郡六ヶ所村', text: '上北郡六ヶ所村' },
        { value: '上北郡おいらせ町', text: '上北郡おいらせ町' },
        { value: '下北郡大間町', text: '下北郡大間町' },
        { value: '下北郡東通村', text: '下北郡東通村' },
        { value: '下北郡風間浦村', text: '下北郡風間浦村' },
        { value: '下北郡佐井村', text: '下北郡佐井村' },
        { value: '三戸郡三戸町', text: '三戸郡三戸町' },
        { value: '三戸郡五戸町', text: '三戸郡五戸町' },
        { value: '三戸郡田子町', text: '三戸郡田子町' },
        { value: '三戸郡南部町', text: '三戸郡南部町' },
        { value: '三戸郡階上町', text: '三戸郡階上町' },
        { value: '三戸郡新郷村', text: '三戸郡新郷村' },
        { value: 'その他', text: 'その他' }
      ],
      options3: [
        { value: '盛岡市', text: '盛岡市' },
        { value: '宮古市', text: '宮古市' },
        { value: '大船渡市', text: '大船渡市' },
        { value: '花巻市', text: '花巻市' },
        { value: '北上市', text: '北上市' },
        { value: '久慈市', text: '久慈市' },
        { value: '遠野市', text: '遠野市' },
        { value: '一関市', text: '一関市' },
        { value: '陸前高田市', text: '陸前高田市' },
        { value: '釜石市', text: '釜石市' },
        { value: '二戸市', text: '二戸市' },
        { value: '八幡平市', text: '八幡平市' },
        { value: '奥州市', text: '奥州市' },
        { value: '滝沢市', text: '滝沢市' },
        { value: '岩手郡雫石町', text: '岩手郡雫石町' },
        { value: '岩手郡葛巻町', text: '岩手郡葛巻町' },
        { value: '岩手郡岩手町', text: '岩手郡岩手町' },
        { value: '紫波郡紫波町', text: '紫波郡紫波町' },
        { value: '紫波郡矢巾町', text: '紫波郡矢巾町' },
        { value: '和賀郡西和賀町', text: '和賀郡西和賀町' },
        { value: '胆沢郡金ケ崎町', text: '胆沢郡金ケ崎町' },
        { value: '西磐井郡平泉町', text: '西磐井郡平泉町' },
        { value: '気仙郡住田町', text: '気仙郡住田町' },
        { value: '上閉伊郡大槌町', text: '上閉伊郡大槌町' },
        { value: '下閉伊郡山田町', text: '下閉伊郡山田町' },
        { value: '下閉伊郡岩泉町', text: '下閉伊郡岩泉町' },
        { value: '下閉伊郡田野畑村', text: '下閉伊郡田野畑村' },
        { value: '下閉伊郡普代村', text: '下閉伊郡普代村' },
        { value: '九戸郡軽米町', text: '九戸郡軽米町' },
        { value: '九戸郡野田村', text: '九戸郡野田村' },
        { value: '九戸郡九戸村', text: '九戸郡九戸村' },
        { value: '九戸郡洋野町', text: '九戸郡洋野町' },
        { value: '二戸郡一戸町', text: '二戸郡一戸町' },
        { value: 'その他', text: 'その他' }
      ],
      options4: [
        { value: '仙台市青葉区', text: '仙台市青葉区' },
        { value: '仙台市宮城野区', text: '仙台市宮城野区' },
        { value: '仙台市若林区', text: '仙台市若林区' },
        { value: '仙台市太白区', text: '仙台市太白区' },
        { value: '仙台市泉区', text: '仙台市泉区' },
        { value: '石巻市', text: '石巻市' },
        { value: '塩竈市', text: '塩竈市' },
        { value: '気仙沼市', text: '気仙沼市' },
        { value: '白石市', text: '白石市' },
        { value: '名取市', text: '名取市' },
        { value: '角田市', text: '角田市' },
        { value: '多賀城市', text: '多賀城市' },
        { value: '岩沼市', text: '岩沼市' },
        { value: '登米市', text: '登米市' },
        { value: '栗原市', text: '栗原市' },
        { value: '東松島市', text: '東松島市' },
        { value: '大崎市', text: '大崎市' },
        { value: '富谷市', text: '富谷市' },
        { value: '刈田郡蔵王町', text: '刈田郡蔵王町' },
        { value: '刈田郡七ヶ宿町', text: '刈田郡七ヶ宿町' },
        { value: '柴田郡大河原町', text: '柴田郡大河原町' },
        { value: '柴田郡村田町', text: '柴田郡村田町' },
        { value: '柴田郡柴田町', text: '柴田郡柴田町' },
        { value: '柴田郡川崎町', text: '柴田郡川崎町' },
        { value: '伊具郡丸森町', text: '伊具郡丸森町' },
        { value: '亘理郡亘理町', text: '亘理郡亘理町' },
        { value: '亘理郡山元町', text: '亘理郡山元町' },
        { value: '宮城郡松島町', text: '宮城郡松島町' },
        { value: '宮城郡七ヶ浜町', text: '宮城郡七ヶ浜町' },
        { value: '宮城郡利府町', text: '宮城郡利府町' },
        { value: '黒川郡大和町', text: '黒川郡大和町' },
        { value: '黒川郡大郷町', text: '黒川郡大郷町' },
        { value: '黒川郡大衡村', text: '黒川郡大衡村' },
        { value: '加美郡色麻町', text: '加美郡色麻町' },
        { value: '加美郡加美町', text: '加美郡加美町' },
        { value: '遠田郡涌谷町', text: '遠田郡涌谷町' },
        { value: '遠田郡美里町', text: '遠田郡美里町' },
        { value: '牡鹿郡女川町', text: '牡鹿郡女川町' },
        { value: '本吉郡南三陸町', text: '本吉郡南三陸町' },
        { value: 'その他', text: 'その他' }
      ],
      options5: [
        { value: '秋田市', text: '秋田市' },
        { value: '能代市', text: '能代市' },
        { value: '横手市', text: '横手市' },
        { value: '大館市', text: '大館市' },
        { value: '男鹿市', text: '男鹿市' },
        { value: '湯沢市', text: '湯沢市' },
        { value: '鹿角市', text: '鹿角市' },
        { value: '由利本荘市', text: '由利本荘市' },
        { value: '潟上市', text: '潟上市' },
        { value: '大仙市', text: '大仙市' },
        { value: '北秋田市', text: '北秋田市' },
        { value: 'にかほ市', text: 'にかほ市' },
        { value: '仙北市', text: '仙北市' },
        { value: '鹿角郡小坂町', text: '鹿角郡小坂町' },
        { value: '北秋田郡上小阿仁村', text: '北秋田郡上小阿仁村' },
        { value: '山本郡藤里町', text: '山本郡藤里町' },
        { value: '山本郡三種町', text: '山本郡三種町' },
        { value: '山本郡八峰町', text: '山本郡八峰町' },
        { value: '南秋田郡五城目町', text: '南秋田郡五城目町' },
        { value: '南秋田郡八郎潟町', text: '南秋田郡八郎潟町' },
        { value: '南秋田郡井川町', text: '南秋田郡井川町' },
        { value: '南秋田郡大潟村', text: '南秋田郡大潟村' },
        { value: '仙北郡美郷町', text: '仙北郡美郷町' },
        { value: '雄勝郡羽後町', text: '雄勝郡羽後町' },
        { value: '雄勝郡東成瀬村', text: '雄勝郡東成瀬村' },
        { value: 'その他', text: 'その他' }
      ],
      options6: [
        { value: '山形市', text: '山形市' },
        { value: '米沢市', text: '米沢市' },
        { value: '鶴岡市', text: '鶴岡市' },
        { value: '酒田市', text: '酒田市' },
        { value: '新庄市', text: '新庄市' },
        { value: '寒河江市', text: '寒河江市' },
        { value: '上山市', text: '上山市' },
        { value: '村山市', text: '村山市' },
        { value: '長井市', text: '長井市' },
        { value: '天童市', text: '天童市' },
        { value: '東根市', text: '東根市' },
        { value: '尾花沢市', text: '尾花沢市' },
        { value: '南陽市', text: '南陽市' },
        { value: '東村山郡山辺町', text: '東村山郡山辺町' },
        { value: '東村山郡中山町', text: '東村山郡中山町' },
        { value: '西村山郡河北町', text: '西村山郡河北町' },
        { value: '西村山郡西川町', text: '西村山郡西川町' },
        { value: '西村山郡朝日町', text: '西村山郡朝日町' },
        { value: '西村山郡大江町', text: '西村山郡大江町' },
        { value: '北村山郡大石田町', text: '北村山郡大石田町' },
        { value: '最上郡金山町', text: '最上郡金山町' },
        { value: '最上郡最上町', text: '最上郡最上町' },
        { value: '最上郡舟形町', text: '最上郡舟形町' },
        { value: '最上郡真室川町', text: '最上郡真室川町' },
        { value: '最上郡大蔵村', text: '最上郡大蔵村' },
        { value: '最上郡鮭川村', text: '最上郡鮭川村' },
        { value: '最上郡戸沢村', text: '最上郡戸沢村' },
        { value: '東置賜郡高畠町', text: '東置賜郡高畠町' },
        { value: '東置賜郡川西町', text: '東置賜郡川西町' },
        { value: '西置賜郡小国町', text: '西置賜郡小国町' },
        { value: '西置賜郡白鷹町', text: '西置賜郡白鷹町' },
        { value: '西置賜郡飯豊町', text: '西置賜郡飯豊町' },
        { value: '東田川郡三川町', text: '東田川郡三川町' },
        { value: '東田川郡庄内町', text: '東田川郡庄内町' },
        { value: '飽海郡遊佐町', text: '飽海郡遊佐町' },
        { value: 'その他', text: 'その他' }
      ],
      options7: [
        { value: '福島市', text: '福島市' },
        { value: '会津若松市', text: '会津若松市' },
        { value: '郡山市', text: '郡山市' },
        { value: 'いわき市', text: 'いわき市' },
        { value: '白河市', text: '白河市' },
        { value: '須賀川市', text: '須賀川市' },
        { value: '喜多方市', text: '喜多方市' },
        { value: '相馬市', text: '相馬市' },
        { value: '二本松市', text: '二本松市' },
        { value: '田村市', text: '田村市' },
        { value: '南相馬市', text: '南相馬市' },
        { value: '本宮市', text: '本宮市' },
        { value: '伊達郡桑折町', text: '伊達郡桑折町' },
        { value: '伊達郡国見町', text: '伊達郡国見町' },
        { value: '伊達郡川俣町', text: '伊達郡川俣町' },
        { value: '安達郡大玉村', text: '安達郡大玉村' },
        { value: '岩瀬郡鏡石町', text: '岩瀬郡鏡石町' },
        { value: '岩瀬郡天栄村', text: '岩瀬郡天栄村' },
        { value: '南会津郡下郷町', text: '南会津郡下郷町' },
        { value: '南会津郡檜枝岐村', text: '南会津郡檜枝岐村' },
        { value: '南会津郡只見町', text: '南会津郡只見町' },
        { value: '南会津郡南会津町', text: '南会津郡南会津町' },
        { value: '耶麻郡北塩原村', text: '耶麻郡北塩原村' },
        { value: '耶麻郡西会津町', text: '耶麻郡西会津町' },
        { value: '耶麻郡磐梯町', text: '耶麻郡磐梯町' },
        { value: '耶麻郡猪苗代町', text: '耶麻郡猪苗代町' },
        { value: '河沼郡会津坂下町', text: '河沼郡会津坂下町' },
        { value: '河沼郡湯川村', text: '河沼郡湯川村' },
        { value: '河沼郡柳津町', text: '河沼郡柳津町' },
        { value: '大沼郡三島町', text: '大沼郡三島町' },
        { value: '大沼郡金山町', text: '大沼郡金山町' },
        { value: '大沼郡昭和村', text: '大沼郡昭和村' },
        { value: '大沼郡会津美里町', text: '大沼郡会津美里町' },
        { value: '西白河郡西郷村', text: '西白河郡西郷村' },
        { value: '西白河郡泉崎村', text: '西白河郡泉崎村' },
        { value: '西白河郡中島村', text: '西白河郡中島村' },
        { value: '西白河郡矢吹町', text: '西白河郡矢吹町' },
        { value: '東白川郡棚倉町', text: '東白川郡棚倉町' },
        { value: '東白川郡矢祭町', text: '東白川郡矢祭町' },
        { value: '東白川郡塙町', text: '東白川郡塙町' },
        { value: '東白川郡鮫川村', text: '東白川郡鮫川村' },
        { value: '石川郡石川町', text: '石川郡石川町' },
        { value: '石川郡玉川村', text: '石川郡玉川村' },
        { value: '石川郡平田村', text: '石川郡平田村' },
        { value: '石川郡浅川町', text: '石川郡浅川町' },
        { value: '石川郡古殿町', text: '石川郡古殿町' },
        { value: '田村郡三春町', text: '田村郡三春町' },
        { value: '田村郡小野町', text: '田村郡小野町' },
        { value: '双葉郡広野町', text: '双葉郡広野町' },
        { value: '双葉郡楢葉町', text: '双葉郡楢葉町' },
        { value: '双葉郡富岡町', text: '双葉郡富岡町' },
        { value: '双葉郡川内村', text: '双葉郡川内村' },
        { value: '双葉郡大熊町', text: '双葉郡大熊町' },
        { value: '双葉郡双葉町', text: '双葉郡双葉町' },
        { value: '双葉郡浪江町', text: '双葉郡浪江町' },
        { value: '双葉郡葛尾村', text: '双葉郡葛尾村' },
        { value: '相馬郡新地町', text: '相馬郡新地町' },
        { value: '相馬郡飯舘村', text: '相馬郡飯舘村' },
        { value: 'その他', text: 'その他' }
      ],
      options8: [
        { value: '水戸市', text: '水戸市' },
        { value: '日立市', text: '日立市' },
        { value: '土浦市', text: '土浦市' },
        { value: '古河市', text: '古河市' },
        { value: '石岡市', text: '石岡市' },
        { value: '結城市', text: '結城市' },
        { value: '龍ケ崎市', text: '龍ケ崎市' },
        { value: '下妻市', text: '下妻市' },
        { value: '常総市', text: '常総市' },
        { value: '常陸太田市', text: '常陸太田市' },
        { value: '高萩市', text: '高萩市' },
        { value: '北茨城市', text: '北茨城市' },
        { value: '笠間市', text: '笠間市' },
        { value: '取手市', text: '取手市' },
        { value: '牛久市', text: '牛久市' },
        { value: 'つくば市', text: 'つくば市' },
        { value: 'ひたちなか市', text: 'ひたちなか市' },
        { value: '鹿嶋市', text: '鹿嶋市' },
        { value: '潮来市', text: '潮来市' },
        { value: '守谷市', text: '守谷市' },
        { value: '常陸大宮市', text: '常陸大宮市' },
        { value: '那珂市', text: '那珂市' },
        { value: '筑西市', text: '筑西市' },
        { value: '坂東市', text: '坂東市' },
        { value: '稲敷市', text: '稲敷市' },
        { value: 'かすみがうら市', text: 'かすみがうら市' },
        { value: '桜川市', text: '桜川市' },
        { value: '神栖市', text: '神栖市' },
        { value: '行方市', text: '行方市' },
        { value: '鉾田市', text: '鉾田市' },
        { value: 'つくばみらい市', text: 'つくばみらい市' },
        { value: '小美玉市', text: '小美玉市' },
        { value: '東茨城郡茨城町', text: '東茨城郡茨城町' },
        { value: '東茨城郡大洗町', text: '東茨城郡大洗町' },
        { value: '東茨城郡城里町', text: '東茨城郡城里町' },
        { value: '那珂郡東海村', text: '那珂郡東海村' },
        { value: '久慈郡大子町', text: '久慈郡大子町' },
        { value: '稲敷郡美浦村', text: '稲敷郡美浦村' },
        { value: '稲敷郡阿見町', text: '稲敷郡阿見町' },
        { value: '稲敷郡河内町', text: '稲敷郡河内町' },
        { value: '結城郡八千代町', text: '結城郡八千代町' },
        { value: '猿島郡五霞町', text: '猿島郡五霞町' },
        { value: '猿島郡境町', text: '猿島郡境町' },
        { value: '北相馬郡利根町', text: '北相馬郡利根町' },
        { value: 'その他', text: 'その他' }
      ],
      options9: [
        { value: '宇都宮市', text: '宇都宮市' },
        { value: '足利市', text: '足利市' },
        { value: '栃木市', text: '栃木市' },
        { value: '佐野市', text: '佐野市' },
        { value: '鹿沼市', text: '鹿沼市' },
        { value: '日光市', text: '日光市' },
        { value: '小山市', text: '小山市' },
        { value: '真岡市', text: '真岡市' },
        { value: '大田原市', text: '大田原市' },
        { value: '矢板市', text: '矢板市' },
        { value: '那須塩原市', text: '那須塩原市' },
        { value: 'さくら市', text: 'さくら市' },
        { value: '那須烏山市', text: '那須烏山市' },
        { value: '下野市', text: '下野市' },
        { value: '河内郡上三川町', text: '河内郡上三川町' },
        { value: '芳賀郡益子町', text: '芳賀郡益子町' },
        { value: '芳賀郡茂木町', text: '芳賀郡茂木町' },
        { value: '芳賀郡市貝町', text: '芳賀郡市貝町' },
        { value: '芳賀郡芳賀町', text: '芳賀郡芳賀町' },
        { value: '下都賀郡壬生町', text: '下都賀郡壬生町' },
        { value: '下都賀郡野木町', text: '下都賀郡野木町' },
        { value: '塩谷郡塩谷町', text: '塩谷郡塩谷町' },
        { value: '塩谷郡高根沢町', text: '塩谷郡高根沢町' },
        { value: '那須郡那須町', text: '那須郡那須町' },
        { value: '那須郡那珂川町', text: '那須郡那珂川町' },
        { value: 'その他', text: 'その他' }
      ],
      options10: [
        { value: '前橋市', text: '前橋市' },
        { value: '高崎市', text: '高崎市' },
        { value: '桐生市', text: '桐生市' },
        { value: '伊勢崎市', text: '伊勢崎市' },
        { value: '太田市', text: '太田市' },
        { value: '沼田市', text: '沼田市' },
        { value: '館林市', text: '館林市' },
        { value: '渋川市', text: '渋川市' },
        { value: '藤岡市', text: '藤岡市' },
        { value: '富岡市', text: '富岡市' },
        { value: '安中市', text: '安中市' },
        { value: 'みどり市', text: 'みどり市' },
        { value: '北群馬郡榛東村', text: '北群馬郡榛東村' },
        { value: '北群馬郡吉岡町', text: '北群馬郡吉岡町' },
        { value: '多野郡上野村', text: '多野郡上野村' },
        { value: '多野郡神流町', text: '多野郡神流町' },
        { value: '甘楽郡下仁田町', text: '甘楽郡下仁田町' },
        { value: '甘楽郡南牧村', text: '甘楽郡南牧村' },
        { value: '甘楽郡甘楽町', text: '甘楽郡甘楽町' },
        { value: '吾妻郡中之条町', text: '吾妻郡中之条町' },
        { value: '吾妻郡長野原町', text: '吾妻郡長野原町' },
        { value: '吾妻郡嬬恋村', text: '吾妻郡嬬恋村' },
        { value: '吾妻郡草津町', text: '吾妻郡草津町' },
        { value: '吾妻郡高山村', text: '吾妻郡高山村' },
        { value: '吾妻郡東吾妻町', text: '吾妻郡東吾妻町' },
        { value: '利根郡片品村', text: '利根郡片品村' },
        { value: '利根郡川場村', text: '利根郡川場村' },
        { value: '利根郡昭和村', text: '利根郡昭和村' },
        { value: '利根郡みなかみ町', text: '利根郡みなかみ町' },
        { value: '佐波郡玉村町', text: '佐波郡玉村町' },
        { value: '邑楽郡板倉町', text: '邑楽郡板倉町' },
        { value: '邑楽郡明和町', text: '邑楽郡明和町' },
        { value: '邑楽郡千代田町', text: '邑楽郡千代田町' },
        { value: '邑楽郡大泉町', text: '邑楽郡大泉町' },
        { value: '邑楽郡邑楽町', text: '邑楽郡邑楽町' },
        { value: 'その他', text: 'その他' }
      ],
      options11: [
        { value: 'さいたま市西区', text: 'さいたま市西区' },
        { value: 'さいたま市北区', text: 'さいたま市北区' },
        { value: 'さいたま市大宮区', text: 'さいたま市大宮区' },
        { value: 'さいたま市見沼区', text: 'さいたま市見沼区' },
        { value: 'さいたま市中央区', text: 'さいたま市中央区' },
        { value: 'さいたま市桜区', text: 'さいたま市桜区' },
        { value: 'さいたま市浦和区', text: 'さいたま市浦和区' },
        { value: 'さいたま市南区', text: 'さいたま市南区' },
        { value: 'さいたま市緑区', text: 'さいたま市緑区' },
        { value: 'さいたま市岩槻区', text: 'さいたま市岩槻区' },
        { value: '川越市', text: '川越市' },
        { value: '熊谷市', text: '熊谷市' },
        { value: '川口市', text: '川口市' },
        { value: '行田市', text: '行田市' },
        { value: '秩父市', text: '秩父市' },
        { value: '所沢市', text: '所沢市' },
        { value: '飯能市', text: '飯能市' },
        { value: '加須市', text: '加須市' },
        { value: '本庄市', text: '本庄市' },
        { value: '東松山市', text: '東松山市' },
        { value: '春日部市', text: '春日部市' },
        { value: '狭山市', text: '狭山市' },
        { value: '羽生市', text: '羽生市' },
        { value: '鴻巣市', text: '鴻巣市' },
        { value: '深谷市', text: '深谷市' },
        { value: '上尾市', text: '上尾市' },
        { value: '草加市', text: '草加市' },
        { value: '越谷市', text: '越谷市' },
        { value: '蕨市', text: '蕨市' },
        { value: '戸田市', text: '戸田市' },
        { value: '入間市', text: '入間市' },
        { value: '朝霞市', text: '朝霞市' },
        { value: '志木市', text: '志木市' },
        { value: '和光市', text: '和光市' },
        { value: '新座市', text: '新座市' },
        { value: '桶川市', text: '桶川市' },
        { value: '久喜市', text: '久喜市' },
        { value: '北本市', text: '北本市' },
        { value: '八潮市', text: '八潮市' },
        { value: '富士見市', text: '富士見市' },
        { value: '三郷市', text: '三郷市' },
        { value: '蓮田市', text: '蓮田市' },
        { value: '坂戸市', text: '坂戸市' },
        { value: '幸手市', text: '幸手市' },
        { value: '鶴ヶ島市', text: '鶴ヶ島市' },
        { value: '日高市', text: '日高市' },
        { value: '吉川市', text: '吉川市' },
        { value: 'ふじみ野市', text: 'ふじみ野市' },
        { value: '白岡市', text: '白岡市' },
        { value: '北足立郡伊奈町', text: '北足立郡伊奈町' },
        { value: '入間郡三芳町', text: '入間郡三芳町' },
        { value: '入間郡毛呂山町', text: '入間郡毛呂山町' },
        { value: '入間郡越生町', text: '入間郡越生町' },
        { value: '比企郡滑川町', text: '比企郡滑川町' },
        { value: '比企郡嵐山町', text: '比企郡嵐山町' },
        { value: '比企郡小川町', text: '比企郡小川町' },
        { value: '比企郡川島町', text: '比企郡川島町' },
        { value: '比企郡吉見町', text: '比企郡吉見町' },
        { value: '比企郡鳩山町', text: '比企郡鳩山町' },
        { value: '比企郡ときがわ町', text: '比企郡ときがわ町' },
        { value: '秩父郡横瀬町', text: '秩父郡横瀬町' },
        { value: '秩父郡皆野町', text: '秩父郡皆野町' },
        { value: '秩父郡長瀞町', text: '秩父郡長瀞町' },
        { value: '秩父郡小鹿野町', text: '秩父郡小鹿野町' },
        { value: '秩父郡東秩父村', text: '秩父郡東秩父村' },
        { value: '児玉郡美里町', text: '児玉郡美里町' },
        { value: '児玉郡神川町', text: '児玉郡神川町' },
        { value: '児玉郡上里町', text: '児玉郡上里町' },
        { value: '大里郡寄居町', text: '大里郡寄居町' },
        { value: '南埼玉郡宮代町', text: '南埼玉郡宮代町' },
        { value: '北葛飾郡杉戸町', text: '北葛飾郡杉戸町' },
        { value: '北葛飾郡松伏町', text: '北葛飾郡松伏町' },
        { value: 'その他', text: 'その他' }
      ],
      options12: [
        { value: '千葉市中央区', text: '千葉市中央区' },
        { value: '千葉市花見川区', text: '千葉市花見川区' },
        { value: '千葉市稲毛区', text: '千葉市稲毛区' },
        { value: '千葉市若葉区', text: '千葉市若葉区' },
        { value: '千葉市緑区', text: '千葉市緑区' },
        { value: '千葉市美浜区', text: '千葉市美浜区' },
        { value: '銚子市', text: '銚子市' },
        { value: '市川市', text: '市川市' },
        { value: '船橋市', text: '船橋市' },
        { value: '館山市', text: '館山市' },
        { value: '木更津市', text: '木更津市' },
        { value: '松戸市', text: '松戸市' },
        { value: '野田市', text: '野田市' },
        { value: '茂原市', text: '茂原市' },
        { value: '成田市', text: '成田市' },
        { value: '佐倉市', text: '佐倉市' },
        { value: '東金市', text: '東金市' },
        { value: '旭市', text: '旭市' },
        { value: '習志野市', text: '習志野市' },
        { value: '柏市', text: '柏市' },
        { value: '勝浦市', text: '勝浦市' },
        { value: '市原市', text: '市原市' },
        { value: '流山市', text: '流山市' },
        { value: '八千代市', text: '八千代市' },
        { value: '我孫子市', text: '我孫子市' },
        { value: '鴨川市', text: '鴨川市' },
        { value: '鎌ケ谷市', text: '鎌ケ谷市' },
        { value: '君津市', text: '君津市' },
        { value: '富津市', text: '富津市' },
        { value: '浦安市', text: '浦安市' },
        { value: '四街道市', text: '四街道市' },
        { value: '袖ケ浦市', text: '袖ケ浦市' },
        { value: '八街市', text: '八街市' },
        { value: '印西市', text: '印西市' },
        { value: '白井市', text: '白井市' },
        { value: '富里市', text: '富里市' },
        { value: '南房総市', text: '南房総市' },
        { value: '匝瑳市', text: '匝瑳市' },
        { value: '香取市', text: '香取市' },
        { value: '山武市', text: '山武市' },
        { value: 'いすみ市', text: 'いすみ市' },
        { value: '大網白里市', text: '大網白里市' },
        { value: '印旛郡酒々井町', text: '印旛郡酒々井町' },
        { value: '印旛郡栄町', text: '印旛郡栄町' },
        { value: '香取郡神崎町', text: '香取郡神崎町' },
        { value: '香取郡多古町', text: '香取郡多古町' },
        { value: '香取郡東庄町', text: '香取郡東庄町' },
        { value: '山武郡九十九里町', text: '山武郡九十九里町' },
        { value: '山武郡芝山町', text: '山武郡芝山町' },
        { value: '山武郡横芝光町', text: '山武郡横芝光町' },
        { value: '長生郡一宮町', text: '長生郡一宮町' },
        { value: '長生郡睦沢町', text: '長生郡睦沢町' },
        { value: '長生郡長生村', text: '長生郡長生村' },
        { value: '長生郡白子町', text: '長生郡白子町' },
        { value: '長生郡長柄町', text: '長生郡長柄町' },
        { value: '長生郡長南町', text: '長生郡長南町' },
        { value: '夷隅郡大多喜町', text: '夷隅郡大多喜町' },
        { value: '夷隅郡御宿町', text: '夷隅郡御宿町' },
        { value: '安房郡鋸南町', text: '安房郡鋸南町' },
        { value: 'その他', text: 'その他' }
      ],
      options13: [
        { value: '千代田区', text: '千代田区' },
        { value: '中央区', text: '中央区' },
        { value: '港区', text: '港区' },
        { value: '新宿区', text: '新宿区' },
        { value: '文京区', text: '文京区' },
        { value: '台東区', text: '台東区' },
        { value: '墨田区', text: '墨田区' },
        { value: '江東区', text: '江東区' },
        { value: '品川区', text: '品川区' },
        { value: '目黒区', text: '目黒区' },
        { value: '大田区', text: '大田区' },
        { value: '世田谷区', text: '世田谷区' },
        { value: '渋谷区', text: '渋谷区' },
        { value: '中野区', text: '中野区' },
        { value: '杉並区', text: '杉並区' },
        { value: '豊島区', text: '豊島区' },
        { value: '北区', text: '北区' },
        { value: '荒川区', text: '荒川区' },
        { value: '板橋区', text: '板橋区' },
        { value: '練馬区', text: '練馬区' },
        { value: '足立区', text: '足立区' },
        { value: '葛飾区', text: '葛飾区' },
        { value: '江戸川区', text: '江戸川区' },
        { value: '八王子市', text: '八王子市' },
        { value: '立川市', text: '立川市' },
        { value: '武蔵野市', text: '武蔵野市' },
        { value: '三鷹市', text: '三鷹市' },
        { value: '青梅市', text: '青梅市' },
        { value: '府中市', text: '府中市' },
        { value: '昭島市', text: '昭島市' },
        { value: '調布市', text: '調布市' },
        { value: '町田市', text: '町田市' },
        { value: '小金井市', text: '小金井市' },
        { value: '小平市', text: '小平市' },
        { value: '日野市', text: '日野市' },
        { value: '東村山市', text: '東村山市' },
        { value: '国分寺市', text: '国分寺市' },
        { value: '国立市', text: '国立市' },
        { value: '福生市', text: '福生市' },
        { value: '狛江市', text: '狛江市' },
        { value: '東大和市', text: '東大和市' },
        { value: '清瀬市', text: '清瀬市' },
        { value: '東久留米市', text: '東久留米市' },
        { value: '武蔵村山市', text: '武蔵村山市' },
        { value: '多摩市', text: '多摩市' },
        { value: '稲城市', text: '稲城市' },
        { value: '羽村市', text: '羽村市' },
        { value: 'あきる野市', text: 'あきる野市' },
        { value: '西東京市', text: '西東京市' },
        { value: '西多摩郡瑞穂町', text: '西多摩郡瑞穂町' },
        { value: '西多摩郡日の出町', text: '西多摩郡日の出町' },
        { value: '西多摩郡檜原村', text: '西多摩郡檜原村' },
        { value: '西多摩郡奥多摩町', text: '西多摩郡奥多摩町' },
        { value: '大島町', text: '大島町' },
        { value: '利島村', text: '利島村' },
        { value: '新島村', text: '新島村' },
        { value: '神津島村', text: '神津島村' },
        { value: '三宅島三宅村', text: '三宅島三宅村' },
        { value: '御蔵島村', text: '御蔵島村' },
        { value: '八丈島八丈町', text: '八丈島八丈町' },
        { value: '青ヶ島村', text: '青ヶ島村' },
        { value: '小笠原村', text: '小笠原村' },
        { value: 'その他', text: 'その他' }
      ],
      options14: [
        { value: '横浜市鶴見区', text: '横浜市鶴見区' },
        { value: '横浜市神奈川区', text: '横浜市神奈川区' },
        { value: '横浜市西区', text: '横浜市西区' },
        { value: '横浜市中区', text: '横浜市中区' },
        { value: '横浜市南区', text: '横浜市南区' },
        { value: '横浜市保土ケ谷区', text: '横浜市保土ケ谷区' },
        { value: '横浜市磯子区', text: '横浜市磯子区' },
        { value: '横浜市金沢区', text: '横浜市金沢区' },
        { value: '横浜市港北区', text: '横浜市港北区' },
        { value: '横浜市戸塚区', text: '横浜市戸塚区' },
        { value: '横浜市港南区', text: '横浜市港南区' },
        { value: '横浜市旭区', text: '横浜市旭区' },
        { value: '横浜市緑区', text: '横浜市緑区' },
        { value: '横浜市瀬谷区', text: '横浜市瀬谷区' },
        { value: '横浜市栄区', text: '横浜市栄区' },
        { value: '横浜市泉区', text: '横浜市泉区' },
        { value: '横浜市青葉区', text: '横浜市青葉区' },
        { value: '横浜市都筑区', text: '横浜市都筑区' },
        { value: '川崎市川崎区', text: '川崎市川崎区' },
        { value: '川崎市幸区', text: '川崎市幸区' },
        { value: '川崎市中原区', text: '川崎市中原区' },
        { value: '川崎市高津区', text: '川崎市高津区' },
        { value: '川崎市多摩区', text: '川崎市多摩区' },
        { value: '川崎市宮前区', text: '川崎市宮前区' },
        { value: '川崎市麻生区', text: '川崎市麻生区' },
        { value: '相模原市緑区', text: '相模原市緑区' },
        { value: '相模原市中央区', text: '相模原市中央区' },
        { value: '相模原市南区', text: '相模原市南区' },
        { value: '横須賀市', text: '横須賀市' },
        { value: '平塚市', text: '平塚市' },
        { value: '鎌倉市', text: '鎌倉市' },
        { value: '藤沢市', text: '藤沢市' },
        { value: '小田原市', text: '小田原市' },
        { value: '茅ヶ崎市', text: '茅ヶ崎市' },
        { value: '逗子市', text: '逗子市' },
        { value: '三浦市', text: '三浦市' },
        { value: '秦野市', text: '秦野市' },
        { value: '厚木市', text: '厚木市' },
        { value: '大和市', text: '大和市' },
        { value: '伊勢原市', text: '伊勢原市' },
        { value: '海老名市', text: '海老名市' },
        { value: '座間市', text: '座間市' },
        { value: '南足柄市', text: '南足柄市' },
        { value: '綾瀬市', text: '綾瀬市' },
        { value: '三浦郡葉山町', text: '三浦郡葉山町' },
        { value: '高座郡寒川町', text: '高座郡寒川町' },
        { value: '中郡大磯町', text: '中郡大磯町' },
        { value: '中郡二宮町', text: '中郡二宮町' },
        { value: '足柄上郡中井町', text: '足柄上郡中井町' },
        { value: '足柄上郡大井町', text: '足柄上郡大井町' },
        { value: '足柄上郡松田町', text: '足柄上郡松田町' },
        { value: '足柄上郡山北町', text: '足柄上郡山北町' },
        { value: '足柄上郡開成町', text: '足柄上郡開成町' },
        { value: '足柄下郡箱根町', text: '足柄下郡箱根町' },
        { value: '足柄下郡真鶴町', text: '足柄下郡真鶴町' },
        { value: '足柄下郡湯河原町', text: '足柄下郡湯河原町' },
        { value: '愛甲郡愛川町', text: '愛甲郡愛川町' },
        { value: '愛甲郡清川村', text: '愛甲郡清川村' },
        { value: 'その他', text: 'その他' }
      ],
      options15: [
        { value: '新潟市北区', text: '新潟市北区' },
        { value: '新潟市東区', text: '新潟市東区' },
        { value: '新潟市中央区', text: '新潟市中央区' },
        { value: '新潟市江南区', text: '新潟市江南区' },
        { value: '新潟市秋葉区', text: '新潟市秋葉区' },
        { value: '新潟市南区', text: '新潟市南区' },
        { value: '新潟市西区', text: '新潟市西区' },
        { value: '新潟市西蒲区', text: '新潟市西蒲区' },
        { value: '長岡市', text: '長岡市' },
        { value: '三条市', text: '三条市' },
        { value: '柏崎市', text: '柏崎市' },
        { value: '新発田市', text: '新発田市' },
        { value: '小千谷市', text: '小千谷市' },
        { value: '加茂市', text: '加茂市' },
        { value: '十日町市', text: '十日町市' },
        { value: '見附市', text: '見附市' },
        { value: '村上市', text: '村上市' },
        { value: '燕市', text: '燕市' },
        { value: '糸魚川市', text: '糸魚川市' },
        { value: '妙高市', text: '妙高市' },
        { value: '五泉市', text: '五泉市' },
        { value: '上越市', text: '上越市' },
        { value: '阿賀野市', text: '阿賀野市' },
        { value: '佐渡市', text: '佐渡市' },
        { value: '魚沼市', text: '魚沼市' },
        { value: '南魚沼市', text: '南魚沼市' },
        { value: '胎内市', text: '胎内市' },
        { value: '北蒲原郡聖籠町', text: '北蒲原郡聖籠町' },
        { value: '西蒲原郡弥彦村', text: '西蒲原郡弥彦村' },
        { value: '南蒲原郡田上町', text: '南蒲原郡田上町' },
        { value: '東蒲原郡阿賀町', text: '東蒲原郡阿賀町' },
        { value: '三島郡出雲崎町', text: '三島郡出雲崎町' },
        { value: '南魚沼郡湯沢町', text: '南魚沼郡湯沢町' },
        { value: '中魚沼郡津南町', text: '中魚沼郡津南町' },
        { value: '刈羽郡刈羽村', text: '刈羽郡刈羽村' },
        { value: '岩船郡関川村', text: '岩船郡関川村' },
        { value: '岩船郡粟島浦村', text: '岩船郡粟島浦村' },
        { value: 'その他', text: 'その他' }
      ],
      options16: [
        { value: '富山市', text: '富山市' },
        { value: '高岡市', text: '高岡市' },
        { value: '魚津市', text: '魚津市' },
        { value: '氷見市', text: '氷見市' },
        { value: '滑川市', text: '滑川市' },
        { value: '黒部市', text: '黒部市' },
        { value: '砺波市', text: '砺波市' },
        { value: '小矢部市', text: '小矢部市' },
        { value: '南砺市', text: '南砺市' },
        { value: '射水市', text: '射水市' },
        { value: '中新川郡舟橋村', text: '中新川郡舟橋村' },
        { value: '中新川郡上市町', text: '中新川郡上市町' },
        { value: '中新川郡立山町', text: '中新川郡立山町' },
        { value: '下新川郡入善町', text: '下新川郡入善町' },
        { value: '下新川郡朝日町', text: '下新川郡朝日町' },
        { value: 'その他', text: 'その他' }
      ],
      options17: [
        { value: '金沢市', text: '金沢市' },
        { value: '七尾市', text: '七尾市' },
        { value: '小松市', text: '小松市' },
        { value: '輪島市', text: '輪島市' },
        { value: '珠洲市', text: '珠洲市' },
        { value: '加賀市', text: '加賀市' },
        { value: '羽咋市', text: '羽咋市' },
        { value: 'かほく市', text: 'かほく市' },
        { value: '白山市', text: '白山市' },
        { value: '能美市', text: '能美市' },
        { value: '野々市市', text: '野々市市' },
        { value: '能美郡川北町', text: '能美郡川北町' },
        { value: '河北郡津幡町', text: '河北郡津幡町' },
        { value: '河北郡内灘町', text: '河北郡内灘町' },
        { value: '羽咋郡志賀町', text: '羽咋郡志賀町' },
        { value: '羽咋郡宝達志水町', text: '羽咋郡宝達志水町' },
        { value: '鹿島郡中能登町', text: '鹿島郡中能登町' },
        { value: '鳳珠郡穴水町', text: '鳳珠郡穴水町' },
        { value: '鳳珠郡能登町', text: '鳳珠郡能登町' },
        { value: 'その他', text: 'その他' }
      ],
      options18: [
        { value: '福井市', text: '福井市' },
        { value: '敦賀市', text: '敦賀市' },
        { value: '小浜市', text: '小浜市' },
        { value: '大野市', text: '大野市' },
        { value: '勝山市', text: '勝山市' },
        { value: '鯖江市', text: '鯖江市' },
        { value: 'あわら市', text: 'あわら市' },
        { value: '越前市', text: '越前市' },
        { value: '坂井市', text: '坂井市' },
        { value: '吉田郡永平寺町', text: '吉田郡永平寺町' },
        { value: '今立郡池田町', text: '今立郡池田町' },
        { value: '南条郡南越前町', text: '南条郡南越前町' },
        { value: '丹生郡越前町', text: '丹生郡越前町' },
        { value: '三方郡美浜町', text: '三方郡美浜町' },
        { value: '大飯郡高浜町', text: '大飯郡高浜町' },
        { value: '大飯郡おおい町', text: '大飯郡おおい町' },
        { value: '三方上中郡若狭町', text: '三方上中郡若狭町' },
        { value: 'その他', text: 'その他' }
      ],
      options19: [
        { value: '甲府市', text: '甲府市' },
        { value: '富士吉田市', text: '富士吉田市' },
        { value: '都留市', text: '都留市' },
        { value: '山梨市', text: '山梨市' },
        { value: '大月市', text: '大月市' },
        { value: '韮崎市', text: '韮崎市' },
        { value: '南アルプス市', text: '南アルプス市' },
        { value: '北杜市', text: '北杜市' },
        { value: '甲斐市', text: '甲斐市' },
        { value: '笛吹市', text: '笛吹市' },
        { value: '上野原市', text: '上野原市' },
        { value: '甲州市', text: '甲州市' },
        { value: '中央市', text: '中央市' },
        { value: '西八代郡市川三郷町', text: '西八代郡市川三郷町' },
        { value: '南巨摩郡早川町', text: '南巨摩郡早川町' },
        { value: '南巨摩郡身延町', text: '南巨摩郡身延町' },
        { value: '南巨摩郡南部町', text: '南巨摩郡南部町' },
        { value: '南巨摩郡富士川町', text: '南巨摩郡富士川町' },
        { value: '中巨摩郡昭和町', text: '中巨摩郡昭和町' },
        { value: '南都留郡道志村', text: '南都留郡道志村' },
        { value: '南都留郡西桂町', text: '南都留郡西桂町' },
        { value: '南都留郡忍野村', text: '南都留郡忍野村' },
        { value: '南都留郡山中湖村', text: '南都留郡山中湖村' },
        { value: '南都留郡鳴沢村', text: '南都留郡鳴沢村' },
        { value: '南都留郡富士河口湖町', text: '南都留郡富士河口湖町' },
        { value: '北都留郡小菅村', text: '北都留郡小菅村' },
        { value: '北都留郡丹波山村', text: '北都留郡丹波山村' },
        { value: 'その他', text: 'その他' }
      ],
      options20: [
        { value: '長野市', text: '長野市' },
        { value: '松本市', text: '松本市' },
        { value: '上田市', text: '上田市' },
        { value: '岡谷市', text: '岡谷市' },
        { value: '飯田市', text: '飯田市' },
        { value: '諏訪市', text: '諏訪市' },
        { value: '須坂市', text: '須坂市' },
        { value: '小諸市', text: '小諸市' },
        { value: '伊那市', text: '伊那市' },
        { value: '駒ヶ根市', text: '駒ヶ根市' },
        { value: '中野市', text: '中野市' },
        { value: '大町市', text: '大町市' },
        { value: '飯山市', text: '飯山市' },
        { value: '茅野市', text: '茅野市' },
        { value: '塩尻市', text: '塩尻市' },
        { value: '佐久市', text: '佐久市' },
        { value: '千曲市', text: '千曲市' },
        { value: '東御市', text: '東御市' },
        { value: '安曇野市', text: '安曇野市' },
        { value: '南佐久郡小海町', text: '南佐久郡小海町' },
        { value: '南佐久郡川上村', text: '南佐久郡川上村' },
        { value: '南佐久郡南牧村', text: '南佐久郡南牧村' },
        { value: '南佐久郡南相木村', text: '南佐久郡南相木村' },
        { value: '南佐久郡北相木村', text: '南佐久郡北相木村' },
        { value: '南佐久郡佐久穂町', text: '南佐久郡佐久穂町' },
        { value: '北佐久郡軽井沢町', text: '北佐久郡軽井沢町' },
        { value: '北佐久郡御代田町', text: '北佐久郡御代田町' },
        { value: '北佐久郡立科町', text: '北佐久郡立科町' },
        { value: '小県郡青木村', text: '小県郡青木村' },
        { value: '小県郡長和町', text: '小県郡長和町' },
        { value: '諏訪郡下諏訪町', text: '諏訪郡下諏訪町' },
        { value: '諏訪郡富士見町', text: '諏訪郡富士見町' },
        { value: '諏訪郡原村', text: '諏訪郡原村' },
        { value: '上伊那郡辰野町', text: '上伊那郡辰野町' },
        { value: '上伊那郡箕輪町', text: '上伊那郡箕輪町' },
        { value: '上伊那郡飯島町', text: '上伊那郡飯島町' },
        { value: '上伊那郡南箕輪村', text: '上伊那郡南箕輪村' },
        { value: '上伊那郡中川村', text: '上伊那郡中川村' },
        { value: '上伊那郡宮田村', text: '上伊那郡宮田村' },
        { value: '下伊那郡松川町', text: '下伊那郡松川町' },
        { value: '下伊那郡高森町', text: '下伊那郡高森町' },
        { value: '下伊那郡阿南町', text: '下伊那郡阿南町' },
        { value: '下伊那郡阿智村', text: '下伊那郡阿智村' },
        { value: '下伊那郡平谷村', text: '下伊那郡平谷村' },
        { value: '下伊那郡根羽村', text: '下伊那郡根羽村' },
        { value: '下伊那郡下條村', text: '下伊那郡下條村' },
        { value: '下伊那郡売木村', text: '下伊那郡売木村' },
        { value: '下伊那郡天龍村', text: '下伊那郡天龍村' },
        { value: '下伊那郡泰阜村', text: '下伊那郡泰阜村' },
        { value: '下伊那郡喬木村', text: '下伊那郡喬木村' },
        { value: '下伊那郡豊丘村', text: '下伊那郡豊丘村' },
        { value: '下伊那郡大鹿村', text: '下伊那郡大鹿村' },
        { value: '木曽郡上松町', text: '木曽郡上松町' },
        { value: '木曽郡南木曽町', text: '木曽郡南木曽町' },
        { value: '木曽郡木祖村', text: '木曽郡木祖村' },
        { value: '木曽郡王滝村', text: '木曽郡王滝村' },
        { value: '木曽郡大桑村', text: '木曽郡大桑村' },
        { value: '木曽郡木曽町', text: '木曽郡木曽町' },
        { value: '東筑摩郡麻績村', text: '東筑摩郡麻績村' },
        { value: '東筑摩郡生坂村', text: '東筑摩郡生坂村' },
        { value: '東筑摩郡山形村', text: '東筑摩郡山形村' },
        { value: '東筑摩郡朝日村', text: '東筑摩郡朝日村' },
        { value: '東筑摩郡筑北村', text: '東筑摩郡筑北村' },
        { value: '北安曇郡池田町', text: '北安曇郡池田町' },
        { value: '北安曇郡松川村', text: '北安曇郡松川村' },
        { value: '北安曇郡白馬村', text: '北安曇郡白馬村' },
        { value: '北安曇郡小谷村', text: '北安曇郡小谷村' },
        { value: '埴科郡坂城町', text: '埴科郡坂城町' },
        { value: '上高井郡小布施町', text: '上高井郡小布施町' },
        { value: '上高井郡高山村', text: '上高井郡高山村' },
        { value: '下高井郡山ノ内町', text: '下高井郡山ノ内町' },
        { value: '下高井郡木島平村', text: '下高井郡木島平村' },
        { value: '下高井郡野沢温泉村', text: '下高井郡野沢温泉村' },
        { value: '上水内郡信濃町', text: '上水内郡信濃町' },
        { value: '上水内郡小川村', text: '上水内郡小川村' },
        { value: '上水内郡飯綱町', text: '上水内郡飯綱町' },
        { value: '下水内郡栄村', text: '下水内郡栄村' },
        { value: 'その他', text: 'その他' }
      ],
      options21: [
        { value: '岐阜市', text: '岐阜市' },
        { value: '大垣市', text: '大垣市' },
        { value: '高山市', text: '高山市' },
        { value: '多治見市', text: '多治見市' },
        { value: '関市', text: '関市' },
        { value: '中津川市', text: '中津川市' },
        { value: '美濃市', text: '美濃市' },
        { value: '瑞浪市', text: '瑞浪市' },
        { value: '羽島市', text: '羽島市' },
        { value: '恵那市', text: '恵那市' },
        { value: '美濃加茂市', text: '美濃加茂市' },
        { value: '土岐市', text: '土岐市' },
        { value: '各務原市', text: '各務原市' },
        { value: '可児市', text: '可児市' },
        { value: '山県市', text: '山県市' },
        { value: '瑞穂市', text: '瑞穂市' },
        { value: '飛騨市', text: '飛騨市' },
        { value: '本巣市', text: '本巣市' },
        { value: '郡上市', text: '郡上市' },
        { value: '下呂市', text: '下呂市' },
        { value: '海津市', text: '海津市' },
        { value: '羽島郡岐南町', text: '羽島郡岐南町' },
        { value: '羽島郡笠松町', text: '羽島郡笠松町' },
        { value: '養老郡養老町', text: '養老郡養老町' },
        { value: '不破郡垂井町', text: '不破郡垂井町' },
        { value: '不破郡関ケ原町', text: '不破郡関ケ原町' },
        { value: '安八郡神戸町', text: '安八郡神戸町' },
        { value: '安八郡輪之内町', text: '安八郡輪之内町' },
        { value: '安八郡安八町', text: '安八郡安八町' },
        { value: '揖斐郡揖斐川町', text: '揖斐郡揖斐川町' },
        { value: '揖斐郡大野町', text: '揖斐郡大野町' },
        { value: '揖斐郡池田町', text: '揖斐郡池田町' },
        { value: '本巣郡北方町', text: '本巣郡北方町' },
        { value: '加茂郡坂祝町', text: '加茂郡坂祝町' },
        { value: '加茂郡富加町', text: '加茂郡富加町' },
        { value: '加茂郡川辺町', text: '加茂郡川辺町' },
        { value: '加茂郡七宗町', text: '加茂郡七宗町' },
        { value: '加茂郡八百津町', text: '加茂郡八百津町' },
        { value: '加茂郡白川町', text: '加茂郡白川町' },
        { value: '加茂郡東白川村', text: '加茂郡東白川村' },
        { value: '可児郡御嵩町', text: '可児郡御嵩町' },
        { value: '大野郡白川村', text: '大野郡白川村' },
        { value: 'その他', text: 'その他' }
      ],
      options22: [
        { value: '静岡市葵区', text: '静岡市葵区' },
        { value: '静岡市駿河区', text: '静岡市駿河区' },
        { value: '静岡市清水区', text: '静岡市清水区' },
        { value: '浜松市中区', text: '浜松市中区' },
        { value: '浜松市東区', text: '浜松市東区' },
        { value: '浜松市西区', text: '浜松市西区' },
        { value: '浜松市南区', text: '浜松市南区' },
        { value: '浜松市北区', text: '浜松市北区' },
        { value: '浜松市浜北区', text: '浜松市浜北区' },
        { value: '浜松市天竜区', text: '浜松市天竜区' },
        { value: '沼津市', text: '沼津市' },
        { value: '熱海市', text: '熱海市' },
        { value: '三島市', text: '三島市' },
        { value: '富士宮市', text: '富士宮市' },
        { value: '伊東市', text: '伊東市' },
        { value: '島田市', text: '島田市' },
        { value: '富士市', text: '富士市' },
        { value: '磐田市', text: '磐田市' },
        { value: '焼津市', text: '焼津市' },
        { value: '掛川市', text: '掛川市' },
        { value: '藤枝市', text: '藤枝市' },
        { value: '御殿場市', text: '御殿場市' },
        { value: '袋井市', text: '袋井市' },
        { value: '下田市', text: '下田市' },
        { value: '裾野市', text: '裾野市' },
        { value: '湖西市', text: '湖西市' },
        { value: '伊豆市', text: '伊豆市' },
        { value: '御前崎市', text: '御前崎市' },
        { value: '菊川市', text: '菊川市' },
        { value: '伊豆の国市', text: '伊豆の国市' },
        { value: '牧之原市', text: '牧之原市' },
        { value: '賀茂郡東伊豆町', text: '賀茂郡東伊豆町' },
        { value: '賀茂郡河津町', text: '賀茂郡河津町' },
        { value: '賀茂郡南伊豆町', text: '賀茂郡南伊豆町' },
        { value: '賀茂郡松崎町', text: '賀茂郡松崎町' },
        { value: '賀茂郡西伊豆町', text: '賀茂郡西伊豆町' },
        { value: '田方郡函南町', text: '田方郡函南町' },
        { value: '駿東郡清水町', text: '駿東郡清水町' },
        { value: '駿東郡長泉町', text: '駿東郡長泉町' },
        { value: '駿東郡小山町', text: '駿東郡小山町' },
        { value: '榛原郡吉田町', text: '榛原郡吉田町' },
        { value: '榛原郡川根本町', text: '榛原郡川根本町' },
        { value: '周智郡森町', text: '周智郡森町' },
        { value: 'その他', text: 'その他' }
      ],
      options23: [
        { value: '名古屋市千種区', text: '名古屋市千種区' },
        { value: '名古屋市東区', text: '名古屋市東区' },
        { value: '名古屋市北区', text: '名古屋市北区' },
        { value: '名古屋市西区', text: '名古屋市西区' },
        { value: '名古屋市中村区', text: '名古屋市中村区' },
        { value: '名古屋市中区', text: '名古屋市中区' },
        { value: '名古屋市昭和区', text: '名古屋市昭和区' },
        { value: '名古屋市瑞穂区', text: '名古屋市瑞穂区' },
        { value: '名古屋市熱田区', text: '名古屋市熱田区' },
        { value: '名古屋市中川区', text: '名古屋市中川区' },
        { value: '名古屋市港区', text: '名古屋市港区' },
        { value: '名古屋市南区', text: '名古屋市南区' },
        { value: '名古屋市守山区', text: '名古屋市守山区' },
        { value: '名古屋市緑区', text: '名古屋市緑区' },
        { value: '名古屋市名東区', text: '名古屋市名東区' },
        { value: '名古屋市天白区', text: '名古屋市天白区' },
        { value: '豊橋市', text: '豊橋市' },
        { value: '岡崎市', text: '岡崎市' },
        { value: '一宮市', text: '一宮市' },
        { value: '瀬戸市', text: '瀬戸市' },
        { value: '半田市', text: '半田市' },
        { value: '春日井市', text: '春日井市' },
        { value: '豊川市', text: '豊川市' },
        { value: '津島市', text: '津島市' },
        { value: '碧南市', text: '碧南市' },
        { value: '刈谷市', text: '刈谷市' },
        { value: '豊田市', text: '豊田市' },
        { value: '安城市', text: '安城市' },
        { value: '西尾市', text: '西尾市' },
        { value: '蒲郡市', text: '蒲郡市' },
        { value: '犬山市', text: '犬山市' },
        { value: '常滑市', text: '常滑市' },
        { value: '江南市', text: '江南市' },
        { value: '小牧市', text: '小牧市' },
        { value: '稲沢市', text: '稲沢市' },
        { value: '新城市', text: '新城市' },
        { value: '東海市', text: '東海市' },
        { value: '大府市', text: '大府市' },
        { value: '知多市', text: '知多市' },
        { value: '知立市', text: '知立市' },
        { value: '尾張旭市', text: '尾張旭市' },
        { value: '高浜市', text: '高浜市' },
        { value: '岩倉市', text: '岩倉市' },
        { value: '豊明市', text: '豊明市' },
        { value: '日進市', text: '日進市' },
        { value: '田原市', text: '田原市' },
        { value: '愛西市', text: '愛西市' },
        { value: '清須市', text: '清須市' },
        { value: '北名古屋市', text: '北名古屋市' },
        { value: '弥富市', text: '弥富市' },
        { value: 'みよし市', text: 'みよし市' },
        { value: 'あま市', text: 'あま市' },
        { value: '長久手市', text: '長久手市' },
        { value: '愛知郡東郷町', text: '愛知郡東郷町' },
        { value: '西春日井郡豊山町', text: '西春日井郡豊山町' },
        { value: '丹羽郡大口町', text: '丹羽郡大口町' },
        { value: '丹羽郡扶桑町', text: '丹羽郡扶桑町' },
        { value: '海部郡大治町', text: '海部郡大治町' },
        { value: '海部郡蟹江町', text: '海部郡蟹江町' },
        { value: '海部郡飛島村', text: '海部郡飛島村' },
        { value: '知多郡阿久比町', text: '知多郡阿久比町' },
        { value: '知多郡東浦町', text: '知多郡東浦町' },
        { value: '知多郡南知多町', text: '知多郡南知多町' },
        { value: '知多郡美浜町', text: '知多郡美浜町' },
        { value: '知多郡武豊町', text: '知多郡武豊町' },
        { value: '額田郡幸田町', text: '額田郡幸田町' },
        { value: '北設楽郡設楽町', text: '北設楽郡設楽町' },
        { value: '北設楽郡東栄町', text: '北設楽郡東栄町' },
        { value: '北設楽郡豊根村', text: '北設楽郡豊根村' },
        { value: 'その他', text: 'その他' }
      ],
      options24: [
        { value: '津市', text: '津市' },
        { value: '四日市市', text: '四日市市' },
        { value: '伊勢市', text: '伊勢市' },
        { value: '松阪市', text: '松阪市' },
        { value: '桑名市', text: '桑名市' },
        { value: '鈴鹿市', text: '鈴鹿市' },
        { value: '名張市', text: '名張市' },
        { value: '尾鷲市', text: '尾鷲市' },
        { value: '亀山市', text: '亀山市' },
        { value: '鳥羽市', text: '鳥羽市' },
        { value: '熊野市', text: '熊野市' },
        { value: 'いなべ市', text: 'いなべ市' },
        { value: '志摩市', text: '志摩市' },
        { value: '伊賀市', text: '伊賀市' },
        { value: '桑名郡木曽岬町', text: '桑名郡木曽岬町' },
        { value: '員弁郡東員町', text: '員弁郡東員町' },
        { value: '三重郡菰野町', text: '三重郡菰野町' },
        { value: '三重郡朝日町', text: '三重郡朝日町' },
        { value: '三重郡川越町', text: '三重郡川越町' },
        { value: '多気郡多気町', text: '多気郡多気町' },
        { value: '多気郡明和町', text: '多気郡明和町' },
        { value: '多気郡大台町', text: '多気郡大台町' },
        { value: '度会郡玉城町', text: '度会郡玉城町' },
        { value: '度会郡度会町', text: '度会郡度会町' },
        { value: '度会郡大紀町', text: '度会郡大紀町' },
        { value: '度会郡南伊勢町', text: '度会郡南伊勢町' },
        { value: '北牟婁郡紀北町', text: '北牟婁郡紀北町' },
        { value: '南牟婁郡御浜町', text: '南牟婁郡御浜町' },
        { value: '南牟婁郡紀宝町', text: '南牟婁郡紀宝町' },
        { value: 'その他', text: 'その他' }
      ],
      options25: [
        { value: '大津市', text: '大津市' },
        { value: '彦根市', text: '彦根市' },
        { value: '長浜市', text: '長浜市' },
        { value: '近江八幡市', text: '近江八幡市' },
        { value: '草津市', text: '草津市' },
        { value: '守山市', text: '守山市' },
        { value: '栗東市', text: '栗東市' },
        { value: '甲賀市', text: '甲賀市' },
        { value: '野洲市', text: '野洲市' },
        { value: '湖南市', text: '湖南市' },
        { value: '高島市', text: '高島市' },
        { value: '東近江市', text: '東近江市' },
        { value: '米原市', text: '米原市' },
        { value: '蒲生郡日野町', text: '蒲生郡日野町' },
        { value: '蒲生郡竜王町', text: '蒲生郡竜王町' },
        { value: '愛知郡愛荘町', text: '愛知郡愛荘町' },
        { value: '犬上郡豊郷町', text: '犬上郡豊郷町' },
        { value: '犬上郡甲良町', text: '犬上郡甲良町' },
        { value: '犬上郡多賀町', text: '犬上郡多賀町' },
        { value: 'その他', text: 'その他' }
      ],
      options26: [
        { value: '京都市北区', text: '京都市北区' },
        { value: '京都市上京区', text: '京都市上京区' },
        { value: '京都市左京区', text: '京都市左京区' },
        { value: '京都市中京区', text: '京都市中京区' },
        { value: '京都市東山区', text: '京都市東山区' },
        { value: '京都市下京区', text: '京都市下京区' },
        { value: '京都市南区', text: '京都市南区' },
        { value: '京都市右京区', text: '京都市右京区' },
        { value: '京都市伏見区', text: '京都市伏見区' },
        { value: '京都市山科区', text: '京都市山科区' },
        { value: '京都市西京区', text: '京都市西京区' },
        { value: '福知山市', text: '福知山市' },
        { value: '舞鶴市', text: '舞鶴市' },
        { value: '綾部市', text: '綾部市' },
        { value: '宇治市', text: '宇治市' },
        { value: '宮津市', text: '宮津市' },
        { value: '亀岡市', text: '亀岡市' },
        { value: '城陽市', text: '城陽市' },
        { value: '向日市', text: '向日市' },
        { value: '長岡京市', text: '長岡京市' },
        { value: '八幡市', text: '八幡市' },
        { value: '京田辺市', text: '京田辺市' },
        { value: '京丹後市', text: '京丹後市' },
        { value: '南丹市', text: '南丹市' },
        { value: '木津川市', text: '木津川市' },
        { value: '乙訓郡大山崎町', text: '乙訓郡大山崎町' },
        { value: '久世郡久御山町', text: '久世郡久御山町' },
        { value: '綴喜郡井手町', text: '綴喜郡井手町' },
        { value: '綴喜郡宇治田原町', text: '綴喜郡宇治田原町' },
        { value: '相楽郡笠置町', text: '相楽郡笠置町' },
        { value: '相楽郡和束町', text: '相楽郡和束町' },
        { value: '相楽郡精華町', text: '相楽郡精華町' },
        { value: '相楽郡南山城村', text: '相楽郡南山城村' },
        { value: '船井郡京丹波町', text: '船井郡京丹波町' },
        { value: '与謝郡伊根町', text: '与謝郡伊根町' },
        { value: '与謝郡与謝野町', text: '与謝郡与謝野町' },
        { value: 'その他', text: 'その他' }
      ],
      options27: [
        { value: '大阪市都島区', text: '大阪市都島区' },
        { value: '大阪市福島区', text: '大阪市福島区' },
        { value: '大阪市此花区', text: '大阪市此花区' },
        { value: '大阪市西区', text: '大阪市西区' },
        { value: '大阪市港区', text: '大阪市港区' },
        { value: '大阪市大正区', text: '大阪市大正区' },
        { value: '大阪市天王寺区', text: '大阪市天王寺区' },
        { value: '大阪市浪速区', text: '大阪市浪速区' },
        { value: '大阪市西淀川区', text: '大阪市西淀川区' },
        { value: '大阪市東淀川区', text: '大阪市東淀川区' },
        { value: '大阪市東成区', text: '大阪市東成区' },
        { value: '大阪市生野区', text: '大阪市生野区' },
        { value: '大阪市旭区', text: '大阪市旭区' },
        { value: '大阪市城東区', text: '大阪市城東区' },
        { value: '大阪市阿倍野区', text: '大阪市阿倍野区' },
        { value: '大阪市住吉区', text: '大阪市住吉区' },
        { value: '大阪市東住吉区', text: '大阪市東住吉区' },
        { value: '大阪市西成区', text: '大阪市西成区' },
        { value: '大阪市淀川区', text: '大阪市淀川区' },
        { value: '大阪市鶴見区', text: '大阪市鶴見区' },
        { value: '大阪市住之江区', text: '大阪市住之江区' },
        { value: '大阪市平野区', text: '大阪市平野区' },
        { value: '大阪市北区', text: '大阪市北区' },
        { value: '大阪市中央区', text: '大阪市中央区' },
        { value: '堺市堺区', text: '堺市堺区' },
        { value: '堺市中区', text: '堺市中区' },
        { value: '堺市東区', text: '堺市東区' },
        { value: '堺市西区', text: '堺市西区' },
        { value: '堺市南区', text: '堺市南区' },
        { value: '堺市北区', text: '堺市北区' },
        { value: '堺市美原区', text: '堺市美原区' },
        { value: '岸和田市', text: '岸和田市' },
        { value: '豊中市', text: '豊中市' },
        { value: '池田市', text: '池田市' },
        { value: '吹田市', text: '吹田市' },
        { value: '泉大津市', text: '泉大津市' },
        { value: '高槻市', text: '高槻市' },
        { value: '貝塚市', text: '貝塚市' },
        { value: '守口市', text: '守口市' },
        { value: '枚方市', text: '枚方市' },
        { value: '茨木市', text: '茨木市' },
        { value: '八尾市', text: '八尾市' },
        { value: '泉佐野市', text: '泉佐野市' },
        { value: '富田林市', text: '富田林市' },
        { value: '寝屋川市', text: '寝屋川市' },
        { value: '河内長野市', text: '河内長野市' },
        { value: '松原市', text: '松原市' },
        { value: '大東市', text: '大東市' },
        { value: '和泉市', text: '和泉市' },
        { value: '箕面市', text: '箕面市' },
        { value: '柏原市', text: '柏原市' },
        { value: '羽曳野市', text: '羽曳野市' },
        { value: '門真市', text: '門真市' },
        { value: '摂津市', text: '摂津市' },
        { value: '高石市', text: '高石市' },
        { value: '藤井寺市', text: '藤井寺市' },
        { value: '東大阪市', text: '東大阪市' },
        { value: '泉南市', text: '泉南市' },
        { value: '四條畷市', text: '四條畷市' },
        { value: '交野市', text: '交野市' },
        { value: '大阪狭山市', text: '大阪狭山市' },
        { value: '阪南市', text: '阪南市' },
        { value: '三島郡島本町', text: '三島郡島本町' },
        { value: '豊能郡豊能町', text: '豊能郡豊能町' },
        { value: '豊能郡能勢町', text: '豊能郡能勢町' },
        { value: '泉北郡忠岡町', text: '泉北郡忠岡町' },
        { value: '泉南郡熊取町', text: '泉南郡熊取町' },
        { value: '泉南郡田尻町', text: '泉南郡田尻町' },
        { value: '泉南郡岬町', text: '泉南郡岬町' },
        { value: '南河内郡太子町', text: '南河内郡太子町' },
        { value: '南河内郡河南町', text: '南河内郡河南町' },
        { value: '南河内郡千早赤阪村', text: '南河内郡千早赤阪村' },
        { value: 'その他', text: 'その他' }
      ],
      options28: [
        { value: '神戸市東灘区', text: '神戸市東灘区' },
        { value: '神戸市灘区', text: '神戸市灘区' },
        { value: '神戸市兵庫区', text: '神戸市兵庫区' },
        { value: '神戸市長田区', text: '神戸市長田区' },
        { value: '神戸市須磨区', text: '神戸市須磨区' },
        { value: '神戸市垂水区', text: '神戸市垂水区' },
        { value: '神戸市北区', text: '神戸市北区' },
        { value: '神戸市中央区', text: '神戸市中央区' },
        { value: '神戸市西区', text: '神戸市西区' },
        { value: '姫路市', text: '姫路市' },
        { value: '尼崎市', text: '尼崎市' },
        { value: '明石市', text: '明石市' },
        { value: '西宮市', text: '西宮市' },
        { value: '洲本市', text: '洲本市' },
        { value: '芦屋市', text: '芦屋市' },
        { value: '伊丹市', text: '伊丹市' },
        { value: '相生市', text: '相生市' },
        { value: '豊岡市', text: '豊岡市' },
        { value: '加古川市', text: '加古川市' },
        { value: '赤穂市', text: '赤穂市' },
        { value: '西脇市', text: '西脇市' },
        { value: '宝塚市', text: '宝塚市' },
        { value: '三木市', text: '三木市' },
        { value: '高砂市', text: '高砂市' },
        { value: '川西市', text: '川西市' },
        { value: '小野市', text: '小野市' },
        { value: '三田市', text: '三田市' },
        { value: '加西市', text: '加西市' },
        { value: '丹波篠山市', text: '丹波篠山市' },
        { value: '養父市', text: '養父市' },
        { value: '丹波市', text: '丹波市' },
        { value: '南あわじ市', text: '南あわじ市' },
        { value: '朝来市', text: '朝来市' },
        { value: '淡路市', text: '淡路市' },
        { value: '宍粟市', text: '宍粟市' },
        { value: '加東市', text: '加東市' },
        { value: 'たつの市', text: 'たつの市' },
        { value: '川辺郡猪名川町', text: '川辺郡猪名川町' },
        { value: '多可郡多可町', text: '多可郡多可町' },
        { value: '加古郡稲美町', text: '加古郡稲美町' },
        { value: '加古郡播磨町', text: '加古郡播磨町' },
        { value: '神崎郡市川町', text: '神崎郡市川町' },
        { value: '神崎郡福崎町', text: '神崎郡福崎町' },
        { value: '神崎郡神河町', text: '神崎郡神河町' },
        { value: '揖保郡太子町', text: '揖保郡太子町' },
        { value: '赤穂郡上郡町', text: '赤穂郡上郡町' },
        { value: '佐用郡佐用町', text: '佐用郡佐用町' },
        { value: '美方郡香美町', text: '美方郡香美町' },
        { value: '美方郡新温泉町', text: '美方郡新温泉町' },
        { value: 'その他', text: 'その他' }
      ],
      options29: [
        { value: '奈良市', text: '奈良市' },
        { value: '大和高田市', text: '大和高田市' },
        { value: '大和郡山市', text: '大和郡山市' },
        { value: '天理市', text: '天理市' },
        { value: '橿原市', text: '橿原市' },
        { value: '桜井市', text: '桜井市' },
        { value: '五條市', text: '五條市' },
        { value: '御所市', text: '御所市' },
        { value: '生駒市', text: '生駒市' },
        { value: '香芝市', text: '香芝市' },
        { value: '葛城市', text: '葛城市' },
        { value: '宇陀市', text: '宇陀市' },
        { value: '山辺郡山添村', text: '山辺郡山添村' },
        { value: '生駒郡平群町', text: '生駒郡平群町' },
        { value: '生駒郡三郷町', text: '生駒郡三郷町' },
        { value: '生駒郡斑鳩町', text: '生駒郡斑鳩町' },
        { value: '生駒郡安堵町', text: '生駒郡安堵町' },
        { value: '磯城郡川西町', text: '磯城郡川西町' },
        { value: '磯城郡三宅町', text: '磯城郡三宅町' },
        { value: '磯城郡田原本町', text: '磯城郡田原本町' },
        { value: '宇陀郡曽爾村', text: '宇陀郡曽爾村' },
        { value: '宇陀郡御杖村', text: '宇陀郡御杖村' },
        { value: '高市郡高取町', text: '高市郡高取町' },
        { value: '高市郡明日香村', text: '高市郡明日香村' },
        { value: '北葛城郡上牧町', text: '北葛城郡上牧町' },
        { value: '北葛城郡王寺町', text: '北葛城郡王寺町' },
        { value: '北葛城郡広陵町', text: '北葛城郡広陵町' },
        { value: '北葛城郡河合町', text: '北葛城郡河合町' },
        { value: '吉野郡吉野町', text: '吉野郡吉野町' },
        { value: '吉野郡大淀町', text: '吉野郡大淀町' },
        { value: '吉野郡下市町', text: '吉野郡下市町' },
        { value: '吉野郡黒滝村', text: '吉野郡黒滝村' },
        { value: '吉野郡天川村', text: '吉野郡天川村' },
        { value: '吉野郡野迫川村', text: '吉野郡野迫川村' },
        { value: '吉野郡十津川村', text: '吉野郡十津川村' },
        { value: '吉野郡下北山村', text: '吉野郡下北山村' },
        { value: '吉野郡上北山村', text: '吉野郡上北山村' },
        { value: '吉野郡川上村', text: '吉野郡川上村' },
        { value: '吉野郡東吉野村', text: '吉野郡東吉野村' },
        { value: 'その他', text: 'その他' }
      ],
      options30: [
        { value: '和歌山市', text: '和歌山市' },
        { value: '海南市', text: '海南市' },
        { value: '橋本市', text: '橋本市' },
        { value: '有田市', text: '有田市' },
        { value: '御坊市', text: '御坊市' },
        { value: '田辺市', text: '田辺市' },
        { value: '新宮市', text: '新宮市' },
        { value: '紀の川市', text: '紀の川市' },
        { value: '岩出市', text: '岩出市' },
        { value: '海草郡紀美野町', text: '海草郡紀美野町' },
        { value: '伊都郡かつらぎ町', text: '伊都郡かつらぎ町' },
        { value: '伊都郡九度山町', text: '伊都郡九度山町' },
        { value: '伊都郡高野町', text: '伊都郡高野町' },
        { value: '有田郡湯浅町', text: '有田郡湯浅町' },
        { value: '有田郡広川町', text: '有田郡広川町' },
        { value: '有田郡有田川町', text: '有田郡有田川町' },
        { value: '日高郡美浜町', text: '日高郡美浜町' },
        { value: '日高郡日高町', text: '日高郡日高町' },
        { value: '日高郡由良町', text: '日高郡由良町' },
        { value: '日高郡印南町', text: '日高郡印南町' },
        { value: '日高郡みなべ町', text: '日高郡みなべ町' },
        { value: '日高郡日高川町', text: '日高郡日高川町' },
        { value: '西牟婁郡白浜町', text: '西牟婁郡白浜町' },
        { value: '西牟婁郡上富田町', text: '西牟婁郡上富田町' },
        { value: '西牟婁郡すさみ町', text: '西牟婁郡すさみ町' },
        { value: '東牟婁郡那智勝浦町', text: '東牟婁郡那智勝浦町' },
        { value: '東牟婁郡太地町', text: '東牟婁郡太地町' },
        { value: '東牟婁郡古座川町', text: '東牟婁郡古座川町' },
        { value: '東牟婁郡北山村', text: '東牟婁郡北山村' },
        { value: '東牟婁郡串本町', text: '東牟婁郡串本町' },
        { value: 'その他', text: 'その他' }
      ],
      options31: [
        { value: '鳥取市', text: '鳥取市' },
        { value: '米子市', text: '米子市' },
        { value: '倉吉市', text: '倉吉市' },
        { value: '境港市', text: '境港市' },
        { value: '岩美郡岩美町', text: '岩美郡岩美町' },
        { value: '八頭郡若桜町', text: '八頭郡若桜町' },
        { value: '八頭郡智頭町', text: '八頭郡智頭町' },
        { value: '八頭郡八頭町', text: '八頭郡八頭町' },
        { value: '東伯郡三朝町', text: '東伯郡三朝町' },
        { value: '東伯郡湯梨浜町', text: '東伯郡湯梨浜町' },
        { value: '東伯郡琴浦町', text: '東伯郡琴浦町' },
        { value: '東伯郡北栄町', text: '東伯郡北栄町' },
        { value: '西伯郡日吉津村', text: '西伯郡日吉津村' },
        { value: '西伯郡大山町', text: '西伯郡大山町' },
        { value: '西伯郡南部町', text: '西伯郡南部町' },
        { value: '西伯郡伯耆町', text: '西伯郡伯耆町' },
        { value: '日野郡日南町', text: '日野郡日南町' },
        { value: '日野郡日野町', text: '日野郡日野町' },
        { value: '日野郡江府町', text: '日野郡江府町' },
        { value: 'その他', text: 'その他' }
      ],
      options32: [
        { value: '松江市', text: '松江市' },
        { value: '浜田市', text: '浜田市' },
        { value: '出雲市', text: '出雲市' },
        { value: '益田市', text: '益田市' },
        { value: '大田市', text: '大田市' },
        { value: '安来市', text: '安来市' },
        { value: '江津市', text: '江津市' },
        { value: '雲南市', text: '雲南市' },
        { value: '仁多郡奥出雲町', text: '仁多郡奥出雲町' },
        { value: '飯石郡飯南町', text: '飯石郡飯南町' },
        { value: '邑智郡川本町', text: '邑智郡川本町' },
        { value: '邑智郡美郷町', text: '邑智郡美郷町' },
        { value: '邑智郡邑南町', text: '邑智郡邑南町' },
        { value: '鹿足郡津和野町', text: '鹿足郡津和野町' },
        { value: '鹿足郡吉賀町', text: '鹿足郡吉賀町' },
        { value: '隠岐郡海士町', text: '隠岐郡海士町' },
        { value: '隠岐郡西ノ島町', text: '隠岐郡西ノ島町' },
        { value: '隠岐郡知夫村', text: '隠岐郡知夫村' },
        { value: '隠岐郡隠岐の島町', text: '隠岐郡隠岐の島町' },
        { value: 'その他', text: 'その他' }
      ],
      options33: [
        { value: '岡山市北区', text: '岡山市北区' },
        { value: '岡山市中区', text: '岡山市中区' },
        { value: '岡山市東区', text: '岡山市東区' },
        { value: '岡山市南区', text: '岡山市南区' },
        { value: '倉敷市', text: '倉敷市' },
        { value: '津山市', text: '津山市' },
        { value: '玉野市', text: '玉野市' },
        { value: '笠岡市', text: '笠岡市' },
        { value: '井原市', text: '井原市' },
        { value: '総社市', text: '総社市' },
        { value: '高梁市', text: '高梁市' },
        { value: '新見市', text: '新見市' },
        { value: '備前市', text: '備前市' },
        { value: '瀬戸内市', text: '瀬戸内市' },
        { value: '赤磐市', text: '赤磐市' },
        { value: '真庭市', text: '真庭市' },
        { value: '美作市', text: '美作市' },
        { value: '浅口市', text: '浅口市' },
        { value: '和気郡和気町', text: '和気郡和気町' },
        { value: '都窪郡早島町', text: '都窪郡早島町' },
        { value: '浅口郡里庄町', text: '浅口郡里庄町' },
        { value: '小田郡矢掛町', text: '小田郡矢掛町' },
        { value: '真庭郡新庄村', text: '真庭郡新庄村' },
        { value: '苫田郡鏡野町', text: '苫田郡鏡野町' },
        { value: '勝田郡勝央町', text: '勝田郡勝央町' },
        { value: '勝田郡奈義町', text: '勝田郡奈義町' },
        { value: '英田郡西粟倉村', text: '英田郡西粟倉村' },
        { value: '久米郡久米南町', text: '久米郡久米南町' },
        { value: '久米郡美咲町', text: '久米郡美咲町' },
        { value: '加賀郡吉備中央町', text: '加賀郡吉備中央町' },
        { value: 'その他', text: 'その他' }
      ],
      options34: [
        { value: '広島市中区', text: '広島市中区' },
        { value: '広島市東区', text: '広島市東区' },
        { value: '広島市南区', text: '広島市南区' },
        { value: '広島市西区', text: '広島市西区' },
        { value: '広島市安佐南区', text: '広島市安佐南区' },
        { value: '広島市安佐北区', text: '広島市安佐北区' },
        { value: '広島市安芸区', text: '広島市安芸区' },
        { value: '広島市佐伯区', text: '広島市佐伯区' },
        { value: '呉市', text: '呉市' },
        { value: '竹原市', text: '竹原市' },
        { value: '三原市', text: '三原市' },
        { value: '尾道市', text: '尾道市' },
        { value: '福山市', text: '福山市' },
        { value: '三次市', text: '三次市' },
        { value: '庄原市', text: '庄原市' },
        { value: '大竹市', text: '大竹市' },
        { value: '東広島市', text: '東広島市' },
        { value: '廿日市市', text: '廿日市市' },
        { value: '安芸高田市', text: '安芸高田市' },
        { value: '江田島市', text: '江田島市' },
        { value: '安芸郡府中町', text: '安芸郡府中町' },
        { value: '安芸郡海田町', text: '安芸郡海田町' },
        { value: '安芸郡熊野町', text: '安芸郡熊野町' },
        { value: '安芸郡坂町', text: '安芸郡坂町' },
        { value: '山県郡安芸太田町', text: '山県郡安芸太田町' },
        { value: '山県郡北広島町', text: '山県郡北広島町' },
        { value: '豊田郡大崎上島町', text: '豊田郡大崎上島町' },
        { value: '世羅郡世羅町', text: '世羅郡世羅町' },
        { value: '神石郡神石高原町', text: '神石郡神石高原町' },
        { value: 'その他', text: 'その他' }
      ],
      options35: [
        { value: '下関市', text: '下関市' },
        { value: '宇部市', text: '宇部市' },
        { value: '山口市', text: '山口市' },
        { value: '萩市', text: '萩市' },
        { value: '防府市', text: '防府市' },
        { value: '下松市', text: '下松市' },
        { value: '岩国市', text: '岩国市' },
        { value: '光市', text: '光市' },
        { value: '長門市', text: '長門市' },
        { value: '柳井市', text: '柳井市' },
        { value: '美祢市', text: '美祢市' },
        { value: '周南市', text: '周南市' },
        { value: '山陽小野田市', text: '山陽小野田市' },
        { value: '大島郡周防大島町', text: '大島郡周防大島町' },
        { value: '玖珂郡和木町', text: '玖珂郡和木町' },
        { value: '熊毛郡上関町', text: '熊毛郡上関町' },
        { value: '熊毛郡田布施町', text: '熊毛郡田布施町' },
        { value: '熊毛郡平生町', text: '熊毛郡平生町' },
        { value: '阿武郡阿武町', text: '阿武郡阿武町' },
        { value: 'その他', text: 'その他' }
      ],
      options36: [
        { value: '徳島市', text: '徳島市' },
        { value: '鳴門市', text: '鳴門市' },
        { value: '小松島市', text: '小松島市' },
        { value: '阿南市', text: '阿南市' },
        { value: '吉野川市', text: '吉野川市' },
        { value: '阿波市', text: '阿波市' },
        { value: '美馬市', text: '美馬市' },
        { value: '三好市', text: '三好市' },
        { value: '勝浦郡勝浦町', text: '勝浦郡勝浦町' },
        { value: '勝浦郡上勝町', text: '勝浦郡上勝町' },
        { value: '名東郡佐那河内村', text: '名東郡佐那河内村' },
        { value: '名西郡石井町', text: '名西郡石井町' },
        { value: '名西郡神山町', text: '名西郡神山町' },
        { value: '那賀郡那賀町', text: '那賀郡那賀町' },
        { value: '海部郡牟岐町', text: '海部郡牟岐町' },
        { value: '海部郡美波町', text: '海部郡美波町' },
        { value: '海部郡海陽町', text: '海部郡海陽町' },
        { value: '板野郡松茂町', text: '板野郡松茂町' },
        { value: '板野郡北島町', text: '板野郡北島町' },
        { value: '板野郡藍住町', text: '板野郡藍住町' },
        { value: '板野郡板野町', text: '板野郡板野町' },
        { value: '板野郡上板町', text: '板野郡上板町' },
        { value: '美馬郡つるぎ町', text: '美馬郡つるぎ町' },
        { value: '三好郡東みよし町', text: '三好郡東みよし町' },
        { value: 'その他', text: 'その他' }
      ],
      options37: [
        { value: '高松市', text: '高松市' },
        { value: '丸亀市', text: '丸亀市' },
        { value: '坂出市', text: '坂出市' },
        { value: '善通寺市', text: '善通寺市' },
        { value: '観音寺市', text: '観音寺市' },
        { value: 'さぬき市', text: 'さぬき市' },
        { value: '東かがわ市', text: '東かがわ市' },
        { value: '三豊市', text: '三豊市' },
        { value: '小豆郡土庄町', text: '小豆郡土庄町' },
        { value: '小豆郡小豆島町', text: '小豆郡小豆島町' },
        { value: '木田郡三木町', text: '木田郡三木町' },
        { value: '香川郡直島町', text: '香川郡直島町' },
        { value: '綾歌郡宇多津町', text: '綾歌郡宇多津町' },
        { value: '綾歌郡綾川町', text: '綾歌郡綾川町' },
        { value: '仲多度郡琴平町', text: '仲多度郡琴平町' },
        { value: '仲多度郡多度津町', text: '仲多度郡多度津町' },
        { value: '仲多度郡まんのう町', text: '仲多度郡まんのう町' },
        { value: 'その他', text: 'その他' }
      ],
      options38: [
        { value: '松山市', text: '松山市' },
        { value: '今治市', text: '今治市' },
        { value: '宇和島市', text: '宇和島市' },
        { value: '八幡浜市', text: '八幡浜市' },
        { value: '新居浜市', text: '新居浜市' },
        { value: '西条市', text: '西条市' },
        { value: '大洲市', text: '大洲市' },
        { value: '伊予市', text: '伊予市' },
        { value: '四国中央市', text: '四国中央市' },
        { value: '西予市', text: '西予市' },
        { value: '東温市', text: '東温市' },
        { value: '越智郡上島町', text: '越智郡上島町' },
        { value: '上浮穴郡久万高原町', text: '上浮穴郡久万高原町' },
        { value: '伊予郡松前町', text: '伊予郡松前町' },
        { value: '伊予郡砥部町', text: '伊予郡砥部町' },
        { value: '喜多郡内子町', text: '喜多郡内子町' },
        { value: '西宇和郡伊方町', text: '西宇和郡伊方町' },
        { value: '北宇和郡松野町', text: '北宇和郡松野町' },
        { value: '北宇和郡鬼北町', text: '北宇和郡鬼北町' },
        { value: '南宇和郡愛南町', text: '南宇和郡愛南町' },
        { value: 'その他', text: 'その他' }
      ],
      options39: [
        { value: '高知市', text: '高知市' },
        { value: '室戸市', text: '室戸市' },
        { value: '安芸市', text: '安芸市' },
        { value: '南国市', text: '南国市' },
        { value: '土佐市', text: '土佐市' },
        { value: '須崎市', text: '須崎市' },
        { value: '宿毛市', text: '宿毛市' },
        { value: '土佐清水市', text: '土佐清水市' },
        { value: '四万十市', text: '四万十市' },
        { value: '香南市', text: '香南市' },
        { value: '香美市', text: '香美市' },
        { value: '安芸郡東洋町', text: '安芸郡東洋町' },
        { value: '安芸郡奈半利町', text: '安芸郡奈半利町' },
        { value: '安芸郡田野町', text: '安芸郡田野町' },
        { value: '安芸郡安田町', text: '安芸郡安田町' },
        { value: '安芸郡北川村', text: '安芸郡北川村' },
        { value: '安芸郡馬路村', text: '安芸郡馬路村' },
        { value: '安芸郡芸西村', text: '安芸郡芸西村' },
        { value: '長岡郡本山町', text: '長岡郡本山町' },
        { value: '長岡郡大豊町', text: '長岡郡大豊町' },
        { value: '土佐郡土佐町', text: '土佐郡土佐町' },
        { value: '土佐郡大川村', text: '土佐郡大川村' },
        { value: '吾川郡いの町', text: '吾川郡いの町' },
        { value: '吾川郡仁淀川町', text: '吾川郡仁淀川町' },
        { value: '高岡郡中土佐町', text: '高岡郡中土佐町' },
        { value: '高岡郡佐川町', text: '高岡郡佐川町' },
        { value: '高岡郡越知町', text: '高岡郡越知町' },
        { value: '高岡郡檮原町', text: '高岡郡檮原町' },
        { value: '高岡郡日高村', text: '高岡郡日高村' },
        { value: '高岡郡津野町', text: '高岡郡津野町' },
        { value: '高岡郡四万十町', text: '高岡郡四万十町' },
        { value: '幡多郡大月町', text: '幡多郡大月町' },
        { value: '幡多郡三原村', text: '幡多郡三原村' },
        { value: '幡多郡黒潮町', text: '幡多郡黒潮町' },
        { value: 'その他', text: 'その他' }
      ],
      options40: [
        { value: '北九州市門司区', text: '北九州市門司区' },
        { value: '北九州市若松区', text: '北九州市若松区' },
        { value: '北九州市戸畑区', text: '北九州市戸畑区' },
        { value: '北九州市小倉北区', text: '北九州市小倉北区' },
        { value: '北九州市小倉南区', text: '北九州市小倉南区' },
        { value: '北九州市八幡東区', text: '北九州市八幡東区' },
        { value: '北九州市八幡西区', text: '北九州市八幡西区' },
        { value: '福岡市東区', text: '福岡市東区' },
        { value: '福岡市博多区', text: '福岡市博多区' },
        { value: '福岡市中央区', text: '福岡市中央区' },
        { value: '福岡市南区', text: '福岡市南区' },
        { value: '福岡市西区', text: '福岡市西区' },
        { value: '福岡市城南区', text: '福岡市城南区' },
        { value: '福岡市早良区', text: '福岡市早良区' },
        { value: '大牟田市', text: '大牟田市' },
        { value: '久留米市', text: '久留米市' },
        { value: '直方市', text: '直方市' },
        { value: '飯塚市', text: '飯塚市' },
        { value: '田川市', text: '田川市' },
        { value: '柳川市', text: '柳川市' },
        { value: '八女市', text: '八女市' },
        { value: '筑後市', text: '筑後市' },
        { value: '大川市', text: '大川市' },
        { value: '行橋市', text: '行橋市' },
        { value: '豊前市', text: '豊前市' },
        { value: '中間市', text: '中間市' },
        { value: '小郡市', text: '小郡市' },
        { value: '筑紫野市', text: '筑紫野市' },
        { value: '春日市', text: '春日市' },
        { value: '大野城市', text: '大野城市' },
        { value: '宗像市', text: '宗像市' },
        { value: '太宰府市', text: '太宰府市' },
        { value: '古賀市', text: '古賀市' },
        { value: '福津市', text: '福津市' },
        { value: 'うきは市', text: 'うきは市' },
        { value: '宮若市', text: '宮若市' },
        { value: '嘉麻市', text: '嘉麻市' },
        { value: '朝倉市', text: '朝倉市' },
        { value: 'みやま市', text: 'みやま市' },
        { value: '糸島市', text: '糸島市' },
        { value: '那珂川市', text: '那珂川市' },
        { value: '糟屋郡宇美町', text: '糟屋郡宇美町' },
        { value: '糟屋郡篠栗町', text: '糟屋郡篠栗町' },
        { value: '糟屋郡志免町', text: '糟屋郡志免町' },
        { value: '糟屋郡須惠町', text: '糟屋郡須惠町' },
        { value: '糟屋郡新宮町', text: '糟屋郡新宮町' },
        { value: '糟屋郡久山町', text: '糟屋郡久山町' },
        { value: '糟屋郡粕屋町', text: '糟屋郡粕屋町' },
        { value: '遠賀郡芦屋町', text: '遠賀郡芦屋町' },
        { value: '遠賀郡水巻町', text: '遠賀郡水巻町' },
        { value: '遠賀郡岡垣町', text: '遠賀郡岡垣町' },
        { value: '遠賀郡遠賀町', text: '遠賀郡遠賀町' },
        { value: '鞍手郡小竹町', text: '鞍手郡小竹町' },
        { value: '鞍手郡鞍手町', text: '鞍手郡鞍手町' },
        { value: '嘉穂郡桂川町', text: '嘉穂郡桂川町' },
        { value: '朝倉郡筑前町', text: '朝倉郡筑前町' },
        { value: '朝倉郡東峰村', text: '朝倉郡東峰村' },
        { value: '三井郡大刀洗町', text: '三井郡大刀洗町' },
        { value: '三潴郡大木町', text: '三潴郡大木町' },
        { value: '八女郡広川町', text: '八女郡広川町' },
        { value: '田川郡香春町', text: '田川郡香春町' },
        { value: '田川郡添田町', text: '田川郡添田町' },
        { value: '田川郡糸田町', text: '田川郡糸田町' },
        { value: '田川郡川崎町', text: '田川郡川崎町' },
        { value: '田川郡大任町', text: '田川郡大任町' },
        { value: '田川郡赤村', text: '田川郡赤村' },
        { value: '田川郡福智町', text: '田川郡福智町' },
        { value: '京都郡苅田町', text: '京都郡苅田町' },
        { value: '京都郡みやこ町', text: '京都郡みやこ町' },
        { value: '築上郡吉富町', text: '築上郡吉富町' },
        { value: '築上郡上毛町', text: '築上郡上毛町' },
        { value: '築上郡築上町', text: '築上郡築上町' },
        { value: 'その他', text: 'その他' }
      ],
      options41: [
        { value: '佐賀市', text: '佐賀市' },
        { value: '唐津市', text: '唐津市' },
        { value: '鳥栖市', text: '鳥栖市' },
        { value: '多久市', text: '多久市' },
        { value: '伊万里市', text: '伊万里市' },
        { value: '武雄市', text: '武雄市' },
        { value: '鹿島市', text: '鹿島市' },
        { value: '小城市', text: '小城市' },
        { value: '嬉野市', text: '嬉野市' },
        { value: '神埼市', text: '神埼市' },
        { value: '神埼郡吉野ヶ里町', text: '神埼郡吉野ヶ里町' },
        { value: '三養基郡基山町', text: '三養基郡基山町' },
        { value: '三養基郡上峰町', text: '三養基郡上峰町' },
        { value: '三養基郡みやき町', text: '三養基郡みやき町' },
        { value: '東松浦郡玄海町', text: '東松浦郡玄海町' },
        { value: '西松浦郡有田町', text: '西松浦郡有田町' },
        { value: '杵島郡大町町', text: '杵島郡大町町' },
        { value: '杵島郡江北町', text: '杵島郡江北町' },
        { value: '杵島郡白石町', text: '杵島郡白石町' },
        { value: '藤津郡太良町', text: '藤津郡太良町' },
        { value: 'その他', text: 'その他' }
      ],
      options42: [
        { value: '長崎市', text: '長崎市' },
        { value: '佐世保市', text: '佐世保市' },
        { value: '島原市', text: '島原市' },
        { value: '諫早市', text: '諫早市' },
        { value: '大村市', text: '大村市' },
        { value: '平戸市', text: '平戸市' },
        { value: '松浦市', text: '松浦市' },
        { value: '対馬市', text: '対馬市' },
        { value: '壱岐市', text: '壱岐市' },
        { value: '五島市', text: '五島市' },
        { value: '西海市', text: '西海市' },
        { value: '雲仙市', text: '雲仙市' },
        { value: '南島原市', text: '南島原市' },
        { value: '西彼杵郡長与町', text: '西彼杵郡長与町' },
        { value: '西彼杵郡時津町', text: '西彼杵郡時津町' },
        { value: '東彼杵郡東彼杵町', text: '東彼杵郡東彼杵町' },
        { value: '東彼杵郡川棚町', text: '東彼杵郡川棚町' },
        { value: '東彼杵郡波佐見町', text: '東彼杵郡波佐見町' },
        { value: '北松浦郡小値賀町', text: '北松浦郡小値賀町' },
        { value: '北松浦郡佐々町', text: '北松浦郡佐々町' },
        { value: '南松浦郡新上五島町', text: '南松浦郡新上五島町' },
        { value: 'その他', text: 'その他' }
      ],
      options43: [
        { value: '熊本市中央区', text: '熊本市中央区' },
        { value: '熊本市東区', text: '熊本市東区' },
        { value: '熊本市西区', text: '熊本市西区' },
        { value: '熊本市南区', text: '熊本市南区' },
        { value: '熊本市北区', text: '熊本市北区' },
        { value: '八代市', text: '八代市' },
        { value: '人吉市', text: '人吉市' },
        { value: '荒尾市', text: '荒尾市' },
        { value: '水俣市', text: '水俣市' },
        { value: '玉名市', text: '玉名市' },
        { value: '山鹿市', text: '山鹿市' },
        { value: '菊池市', text: '菊池市' },
        { value: '宇土市', text: '宇土市' },
        { value: '上天草市', text: '上天草市' },
        { value: '宇城市', text: '宇城市' },
        { value: '阿蘇市', text: '阿蘇市' },
        { value: '天草市', text: '天草市' },
        { value: '合志市', text: '合志市' },
        { value: '下益城郡美里町', text: '下益城郡美里町' },
        { value: '玉名郡玉東町', text: '玉名郡玉東町' },
        { value: '玉名郡南関町', text: '玉名郡南関町' },
        { value: '玉名郡長洲町', text: '玉名郡長洲町' },
        { value: '玉名郡和水町', text: '玉名郡和水町' },
        { value: '菊池郡大津町', text: '菊池郡大津町' },
        { value: '菊池郡菊陽町', text: '菊池郡菊陽町' },
        { value: '阿蘇郡南小国町', text: '阿蘇郡南小国町' },
        { value: '阿蘇郡小国町', text: '阿蘇郡小国町' },
        { value: '阿蘇郡産山村', text: '阿蘇郡産山村' },
        { value: '阿蘇郡高森町', text: '阿蘇郡高森町' },
        { value: '阿蘇郡西原村', text: '阿蘇郡西原村' },
        { value: '阿蘇郡南阿蘇村', text: '阿蘇郡南阿蘇村' },
        { value: '上益城郡御船町', text: '上益城郡御船町' },
        { value: '上益城郡嘉島町', text: '上益城郡嘉島町' },
        { value: '上益城郡益城町', text: '上益城郡益城町' },
        { value: '上益城郡甲佐町', text: '上益城郡甲佐町' },
        { value: '上益城郡山都町', text: '上益城郡山都町' },
        { value: '八代郡氷川町', text: '八代郡氷川町' },
        { value: '葦北郡芦北町', text: '葦北郡芦北町' },
        { value: '葦北郡津奈木町', text: '葦北郡津奈木町' },
        { value: '球磨郡錦町', text: '球磨郡錦町' },
        { value: '球磨郡多良木町', text: '球磨郡多良木町' },
        { value: '球磨郡湯前町', text: '球磨郡湯前町' },
        { value: '球磨郡水上村', text: '球磨郡水上村' },
        { value: '球磨郡相良村', text: '球磨郡相良村' },
        { value: '球磨郡五木村', text: '球磨郡五木村' },
        { value: '球磨郡山江村', text: '球磨郡山江村' },
        { value: '球磨郡球磨村', text: '球磨郡球磨村' },
        { value: '球磨郡あさぎり町', text: '球磨郡あさぎり町' },
        { value: '天草郡苓北町', text: '天草郡苓北町' },
        { value: 'その他', text: 'その他' }
      ],
      options44: [
        { value: '大分市', text: '大分市' },
        { value: '別府市', text: '別府市' },
        { value: '中津市', text: '中津市' },
        { value: '日田市', text: '日田市' },
        { value: '佐伯市', text: '佐伯市' },
        { value: '臼杵市', text: '臼杵市' },
        { value: '津久見市', text: '津久見市' },
        { value: '竹田市', text: '竹田市' },
        { value: '豊後高田市', text: '豊後高田市' },
        { value: '杵築市', text: '杵築市' },
        { value: '宇佐市', text: '宇佐市' },
        { value: '豊後大野市', text: '豊後大野市' },
        { value: '由布市', text: '由布市' },
        { value: '国東市', text: '国東市' },
        { value: '東国東郡姫島村', text: '東国東郡姫島村' },
        { value: '速見郡日出町', text: '速見郡日出町' },
        { value: '玖珠郡九重町', text: '玖珠郡九重町' },
        { value: '玖珠郡玖珠町', text: '玖珠郡玖珠町' },
        { value: 'その他', text: 'その他' }
      ],
      options45: [
        { value: '宮崎市', text: '宮崎市' },
        { value: '都城市', text: '都城市' },
        { value: '延岡市', text: '延岡市' },
        { value: '日南市', text: '日南市' },
        { value: '小林市', text: '小林市' },
        { value: '日向市', text: '日向市' },
        { value: '串間市', text: '串間市' },
        { value: '西都市', text: '西都市' },
        { value: 'えびの市', text: 'えびの市' },
        { value: '北諸県郡三股町', text: '北諸県郡三股町' },
        { value: '西諸県郡高原町', text: '西諸県郡高原町' },
        { value: '東諸県郡国富町', text: '東諸県郡国富町' },
        { value: '東諸県郡綾町', text: '東諸県郡綾町' },
        { value: '児湯郡高鍋町', text: '児湯郡高鍋町' },
        { value: '児湯郡新富町', text: '児湯郡新富町' },
        { value: '児湯郡西米良村', text: '児湯郡西米良村' },
        { value: '児湯郡木城町', text: '児湯郡木城町' },
        { value: '児湯郡川南町', text: '児湯郡川南町' },
        { value: '児湯郡都農町', text: '児湯郡都農町' },
        { value: '東臼杵郡門川町', text: '東臼杵郡門川町' },
        { value: '東臼杵郡諸塚村', text: '東臼杵郡諸塚村' },
        { value: '東臼杵郡椎葉村', text: '東臼杵郡椎葉村' },
        { value: '東臼杵郡美郷町', text: '東臼杵郡美郷町' },
        { value: '西臼杵郡高千穂町', text: '西臼杵郡高千穂町' },
        { value: '西臼杵郡日之影町', text: '西臼杵郡日之影町' },
        { value: '西臼杵郡五ヶ瀬町', text: '西臼杵郡五ヶ瀬町' },
        { value: 'その他', text: 'その他' }
      ],
      options46: [
        { value: '鹿児島市', text: '鹿児島市' },
        { value: '鹿屋市', text: '鹿屋市' },
        { value: '枕崎市', text: '枕崎市' },
        { value: '阿久根市', text: '阿久根市' },
        { value: '出水市', text: '出水市' },
        { value: '指宿市', text: '指宿市' },
        { value: '西之表市', text: '西之表市' },
        { value: '垂水市', text: '垂水市' },
        { value: '薩摩川内市', text: '薩摩川内市' },
        { value: '日置市', text: '日置市' },
        { value: '曽於市', text: '曽於市' },
        { value: '霧島市', text: '霧島市' },
        { value: 'いちき串木野市', text: 'いちき串木野市' },
        { value: '南さつま市', text: '南さつま市' },
        { value: '志布志市', text: '志布志市' },
        { value: '奄美市', text: '奄美市' },
        { value: '南九州市', text: '南九州市' },
        { value: '伊佐市', text: '伊佐市' },
        { value: '姶良市', text: '姶良市' },
        { value: '鹿児島郡三島村', text: '鹿児島郡三島村' },
        { value: '鹿児島郡十島村', text: '鹿児島郡十島村' },
        { value: '薩摩郡さつま町', text: '薩摩郡さつま町' },
        { value: '出水郡長島町', text: '出水郡長島町' },
        { value: '姶良郡湧水町', text: '姶良郡湧水町' },
        { value: '曽於郡大崎町', text: '曽於郡大崎町' },
        { value: '肝属郡東串良町', text: '肝属郡東串良町' },
        { value: '肝属郡錦江町', text: '肝属郡錦江町' },
        { value: '肝属郡南大隅町', text: '肝属郡南大隅町' },
        { value: '肝属郡肝付町', text: '肝属郡肝付町' },
        { value: '熊毛郡中種子町', text: '熊毛郡中種子町' },
        { value: '熊毛郡南種子町', text: '熊毛郡南種子町' },
        { value: '熊毛郡屋久島町', text: '熊毛郡屋久島町' },
        { value: '大島郡大和村', text: '大島郡大和村' },
        { value: '大島郡宇検村', text: '大島郡宇検村' },
        { value: '大島郡瀬戸内町', text: '大島郡瀬戸内町' },
        { value: '大島郡龍郷町', text: '大島郡龍郷町' },
        { value: '大島郡喜界町', text: '大島郡喜界町' },
        { value: '大島郡徳之島町', text: '大島郡徳之島町' },
        { value: '大島郡天城町', text: '大島郡天城町' },
        { value: '大島郡伊仙町', text: '大島郡伊仙町' },
        { value: '大島郡和泊町', text: '大島郡和泊町' },
        { value: '大島郡知名町', text: '大島郡知名町' },
        { value: '大島郡与論町', text: '大島郡与論町' },
        { value: 'その他', text: 'その他' }
      ],
      options47: [
        { value: '那覇市', text: '那覇市' },
        { value: '宜野湾市', text: '宜野湾市' },
        { value: '石垣市', text: '石垣市' },
        { value: '浦添市', text: '浦添市' },
        { value: '名護市', text: '名護市' },
        { value: '糸満市', text: '糸満市' },
        { value: '沖縄市', text: '沖縄市' },
        { value: '豊見城市', text: '豊見城市' },
        { value: 'うるま市', text: 'うるま市' },
        { value: '宮古島市', text: '宮古島市' },
        { value: '南城市', text: '南城市' },
        { value: '国頭郡国頭村', text: '国頭郡国頭村' },
        { value: '国頭郡大宜味村', text: '国頭郡大宜味村' },
        { value: '国頭郡東村', text: '国頭郡東村' },
        { value: '国頭郡今帰仁村', text: '国頭郡今帰仁村' },
        { value: '国頭郡本部町', text: '国頭郡本部町' },
        { value: '国頭郡恩納村', text: '国頭郡恩納村' },
        { value: '国頭郡宜野座村', text: '国頭郡宜野座村' },
        { value: '国頭郡金武町', text: '国頭郡金武町' },
        { value: '国頭郡伊江村', text: '国頭郡伊江村' },
        { value: '中頭郡読谷村', text: '中頭郡読谷村' },
        { value: '中頭郡嘉手納町', text: '中頭郡嘉手納町' },
        { value: '中頭郡北谷町', text: '中頭郡北谷町' },
        { value: '中頭郡北中城村', text: '中頭郡北中城村' },
        { value: '中頭郡中城村', text: '中頭郡中城村' },
        { value: '中頭郡西原町', text: '中頭郡西原町' },
        { value: '島尻郡与那原町', text: '島尻郡与那原町' },
        { value: '島尻郡南風原町', text: '島尻郡南風原町' },
        { value: '島尻郡渡嘉敷村', text: '島尻郡渡嘉敷村' },
        { value: '島尻郡座間味村', text: '島尻郡座間味村' },
        { value: '島尻郡粟国村', text: '島尻郡粟国村' },
        { value: '島尻郡渡名喜村', text: '島尻郡渡名喜村' },
        { value: '島尻郡南大東村', text: '島尻郡南大東村' },
        { value: '島尻郡北大東村', text: '島尻郡北大東村' },
        { value: '島尻郡伊平屋村', text: '島尻郡伊平屋村' },
        { value: '島尻郡伊是名村', text: '島尻郡伊是名村' },
        { value: '島尻郡久米島町', text: '島尻郡久米島町' },
        { value: '島尻郡八重瀬町', text: '島尻郡八重瀬町' },
        { value: '宮古郡多良間村', text: '宮古郡多良間村' },
        { value: '八重山郡竹富町', text: '八重山郡竹富町' },
        { value: '八重山郡与那国町', text: '八重山郡与那国町' },
        { value: 'その他', text: 'その他' }
      ]
    }
  },
  computed: {
    faUserCircle () {
      return faUserCircle
    },
    faArrowRight () {
      return faArrowRight
    },
    faArrowLeft () {
      return faArrowLeft
    },
    faCheck () {
      return faCheck
    },
    faEnvelope () {
      return faEnvelope
    },
    faGoogle () {
      return faGoogle
    },
    faTwitter () {
      return faTwitter
    },
    faLine () {
      return faLine
    },
    faEye () {
      return faEye
    },
    faEyeSlash () {
      return faEyeSlash
    },
    inputType () {
      return this.passChecked ? 'text' : 'password'
    }
  },
  watch: {
    inputName (inputName) {
      this.inputName = this.nameLimit(inputName)
    }
  },
  async created () {
    // ユーザカラー生成
    this.makeUserColor()
    const user = await auth.getRedirectResult()
    if (user.user) {
      await this.authCheck(user)
    } else if (this.$store.getters.isAuthenticated) {
      await this.$store.dispatch('signOut')
    }
    this.loading = false
    // if (this.$store.getters.isAuthenticated) {
    //   this.user.uid = this.$store.getters.user._delegate.uid
    //   this.user.provider = this.$store.getters.user.providerData[0].providerId
    //   this.user.name = this.$store.getters.user._delegate.displayName
    // }
  },
  mounted () {
    // if (auth.isSignInWithEmailLink(window.location.href)) {
    //   this.loading = true
    //   const mail = window.localStorage.getItem('email')
    //   if (!mail) {
    //     this.loading = false
    //     this.authState = 2
    //     this.$bvModal.show('mailLogin')
    //   } else {
    //     this.loading = false
    //     this.signInWithMailLink(mail)
    //   }
    // }
  },
  methods: {
    passClick () {
      // 入力パスワードの表示・非表示
      this.passChecked = !this.passChecked
    },
    signInWithGoogle () {
      // Googleアカウントでログイン
      this.$store.dispatch('signInWithGoogle')
        .then(result => this.authCheck(result))
        .catch(error => console.log(error.message))
    },
    signInWithTwitter () {
      // Twitterアカウントでログイン
      this.$store.dispatch('signInWithTwitter')
        .then(result => this.authCheck(result))
        .catch(error => console.log(error.message))
    },
    signInWithMailAndPW () {
      // メールアドレスとパスワードでログイン
      this.loginErrorMessage = null
      this.authState = 0
      this.$store.dispatch('signInWithEmail', { email: this.loginEmail, password: this.loginPassword })
        .then(result => this.authCheck(result))
        .catch((error) => {
          if (error.code === 'auth/user-disabled') {
            this.loginErrorMessage = 'このアカウントはブロックされています。'
          } else {
            this.loginErrorMessage = 'メールアドレスまたはパスワードに誤りがあります。'
          }
        })
    },
    async passwordReset () {
      // パスワードリセットのメール送信
      this.isMailSend = false
      this.resetErrorMessage = null
      await auth.sendPasswordResetEmail(this.resetEmail)
        .then(() => {
          this.isMailSend = true
        })
        .catch((error) => {
          if (error.code === 'auth/invalid-email') {
            this.resetErrorMessage = 'メールアドレスの形式に誤りがあります。'
          } else if (error.code === 'auth/user-not-found') {
            this.resetErrorMessage = '登録されていないメールアドレスです。'
          }
        })
    },
    signUp () {
      // 新規登録
      this.authState = 0
      this.signUpErrorMessage = null
      this.$store.dispatch('signUpWithEmailAndPassword', { email: this.newEmail, password: this.newPassword })
        .then(result => this.authCheck(result))
        .catch((error) => {
          if (error.code === 'auth/invalid-email') {
            this.signUpErrorMessage = 'メールアドレスの形式に誤りがあります。'
          } else if (error.code === 'auth/email-already-in-use') {
            this.signUpErrorMessage = 'このメールアドレスは既に使用されています。'
          } else if (error.code === 'auth/weak-password') {
            this.signUpErrorMessage = 'パスワードは6文字以上にしてください。'
          } else {
            this.signUpErrorMessage = '新規登録に失敗しました。'
          }
        })
    },
    async signInWithLine () {
      // lineアカウントでログイン
      await this.$store.dispatch('signInWithLine')
        .then(result => this.authCheck(result))
        .catch(error => console.log(error.message))
    },
    async authCheck (result) {
      this.loading = true
      // firebase auth認証情報チェック
      window.localStorage.removeItem('email')
      this.$bvModal.hide('mailLogin')
      this.$bvModal.hide('passwordLogin')
      this.$bvModal.hide('lineLogin')
      this.$bvModal.hide('signup')
      this.user.uid = result.user._delegate.uid
      if (result.additionalUserInfo.profile.name) {
        this.user.name = result.additionalUserInfo.profile.name
      } else { this.user.name = '' }
      this.user.provider = result.additionalUserInfo.providerId
      console.log(result, this.user)
      if (!result.additionalUserInfo.isNewUser) {
        this.userInfo = await Firestore.getUserStatus(this.user.uid)
        await this.$store.dispatch('setUserInfo', this.userInfo)
        console.log(this.userInfo)
        if (this.userInfo) {
          this.userExists = true
          if (this.$store.getters.currentStamprally.id) {
            await this.$router.push({
              name: 'stamprally-id-home',
              params: { id: this.$store.getters.currentStamprally.id }
            })
          } else {
            await this.$router.push({ name: 'stamprally' })
          }
        }
      }
      this.loading = false
    },
    async addUser () {
      // firestoreにユーザ追加
      this.loading = true
      const user = await Firestore.getUserStatus(this.user.uid)
      if (user) {
        this.userExists = true
        setTimeout(() => {
          this.$router.push({ name: 'stamprally' })
        }, 3000)
      } else {
        if (this.user.region === 'その他') {
          this.user.region += ':' + this.user.regionOption
        }
        await Firestore.addUser(
          this.user.uid,
          this.userName(this.user.name),
          this.userColor,
          this.user.age,
          this.user.sex,
          this.user.region,
          this.user.provider
        )
        if (this.$store.getters.currentStamprally.id) {
          await Firestore.makeUserLog(this.user.uid, this.$store.getters.currentStamprally.id)
          await this.$router.push({ name: 'stamprally-id-home', params: { id: this.$store.getters.currentStamprally.id } })
          this.loading = false
        } else {
          await this.$router.push({ name: 'stamprally' })
          this.loading = false
        }
      }
    },
    makeUserColor () {
      // ユーザカラー生成
      const h = Math.random() * 360
      const s = 80
      const l = Math.random() * 0.05 + 0.55
      const a = s * Math.min(l, 1 - l) / 100
      const f = (n) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0')
      }
      this.userColor = `#${f(0)}${f(8)}${f(4)}`
    },
    nameLimit (inputName) {
      // ニックネームの長さ上限
      return inputName.length > 10 ? inputName.slice(0, -1) : inputName
    },
    userName (input) {
      // ニックネームが空の場合，「ユーザ」を返す
      if (input === '') {
        return 'ユーザ'
      }
      return input
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Noto Sans JP', sans-serif !important;
  background-color: #fafafa;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
}
.userIcon {
  background-color: white;
  font-size: 60px;
  border-radius: 50px;
}
</style>
