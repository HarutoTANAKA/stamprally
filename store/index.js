import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  OAuthProvider
} from 'firebase/auth'
import { auth } from '~/plugin/firebase.js'

export const strict = false

// ↓の「state」は，セッションストレージに格納されるデータ
export const state = () => ({
  user: null,
  userInfo: {
    name: '',
    age: '',
    sex: '',
    region: '',
    color: '#696969',
    selectedCourse: '',
    completedCourse: [],
    ownedStamps: []
  },
  userLocation: {
    lat: 0,
    lng: 0
  },
  currentStamprally: {
    id: null,
    name: null,
    lat: 0,
    lng: 0,
    color: '#fafafa',
    inquiry: null,
    question: '',
    prizeType: 'normal'
  },
  users: {},
  // userName: '',
  // userColor: '#696969',
  stamprally: {},
  stampInfo: {},
  adInfo: {},
  photos: {},
  courses: {},
  selected: null,
  selectedName: null,
  spotDetail: {
    state: false,
    id: ''
  },
  photoDetail: {
    state: false,
    id: []
  },
  indexOfStamprally: 0,
  courseMenu: true,
  courseStatus: {
    name: '',
    color: '#696969',
    length: 0,
    nextStamp: null,
    progress: 0,
    stamps: [],
    path: { lat: 0, lng: 0 }
  }
})

export const mutations = {
  setUser (state, payload) {
    // ユーザの認証情報をセット
    state.user = payload
  },
  setUserInfo (state, payload) {
    // ユーザ情報をセット
    state.userInfo = payload
  },
  setUsers (state, users) {
    // スタンプラリー参加ユーザの情報をセット
    state.users = {
      ...state.users,
      users
    }
  },
  setUserLocation (state, loc) {
    // ユーザの現在地をセット
    state.userLocation = loc
  },
  // setUserName (state, name) {
  //   // ユーザ名をセット
  //   state.userName = name
  // },
  setCurrentStamprally (state, param) {
    // 現在プレイ中のスタンプラリーをセット
    state.currentStamprally = param
  },
  // setUserColor (state, color) {
  //   // ユーザーカラーをセット
  //   state.userColor = color
  // },
  setStamprally (state, stamprallies) {
    // スタンプラリー情報をセット
    state.stamprally = {
      ...state.stamprally,
      stamprallies
    }
  },
  selectStamprally (state, select) {
    // 現在選択中のスタンプラリー（コンソール）
    state.selected = select
    console.log(state.selected + ' is selected.')
  },
  selectStamprallyName (state, select) {
    // 現在選択中のスタンプラリー名（コンソール）
    state.selectedName = select
  },
  setStampInfo (state, stamps) {
    // スタンプ情報をセット
    state.stampInfo = {
      ...state.stampInfo,
      stamps
    }
  },
  setPhotos (state, photo) {
    // 写真の情報をセット
    state.photos = {
      ...state.photos,
      photo
    }
  },
  setAdInfo (state, ads) {
    // 広告情報をセット
    state.adInfo = {
      ...state.adInfo,
      ads
    }
  },
  setCourses (state, course) {
    // コース情報をセット
    state.courses = {
      ...state.courses,
      course
    }
  },
  setSpotDetail (state, param) {
    // スポット・スタンプ情報をセット（ユーザ）
    state.spotDetail = param
  },
  setPhotoDetail (state, param) {
    // 写真情報をセット（ユーザ）
    state.photoDetail = param
  },
  setIndexOfStamprally (state, num) {
    // スタンプラリーのインデックス（何番目か）をセット
    state.indexOfStamprally = num
  },
  switchCourseMenu (state, param) {
    // コースメニューのオン・オフ
    state.courseMenu = param
  },
  setCourseStatus (state, param) {
    // コースの進行状況をセット
    state.courseStatus = param
  }
}

export const actions = {
  signInWithEmail ({ commit }, { email, password }) {
    return auth.signInWithEmailAndPassword(email, password)
  },
  signUpWithEmailAndPassword ({ commit }, { email, password }) {
    return auth.createUserWithEmailAndPassword(email, password)
  },
  signInWithEmailLink ({ commit }, { email, url }) {
    return auth.signInWithEmailLink(email, url)
  },
  signInWithPhoneNumber ({ commit }, { phoneNumber, verifier }) {
    return auth.signInWithPhoneNumber(phoneNumber, verifier)
  },
  signInWithGoogle () {
    const provider = new GoogleAuthProvider()
    // return auth.signInWithRedirect(provider)
    return auth.signInWithPopup(provider)
      .then((result) => {
        console.log(result)
        return result
      }).catch((error) => {
        console.log(error.message, 'sign in failed')
      })
  },
  signInWithTwitter () {
    const provider = new TwitterAuthProvider()
    // return auth.signInWithRedirect(provider)
    return auth.signInWithPopup(provider)
      .then((result) => {
        console.log(result)
        return result
      }).catch((error) => {
        console.log(error.message, 'sign in failed')
      })
  },
  signInWithFacebook () {
    const provider = new FacebookAuthProvider()
    return auth.signInWithRedirect(provider)
    // return auth.signInWithPopup(provider)
    //   .then((result) => {
    //     console.log(result)
    //     return result
    //   }).catch((error) => {
    //     console.log(error.message, 'sign in failed')
    //   })
  },
  signInWithCustomToken ({ commit }, token) {
    return auth.signInWithCustomToken(token)
      .then((result) => {
        console.log(result)
        return result
      }).catch((error) => {
        console.log(error.message, 'sign in failed')
      })
  },
  signInWithLine () {
    const provider = new OAuthProvider('oidc.line')
    provider.setCustomParameters({
      disable_auto_login: 'true'
    })
    // return auth.signInWithRedirect(provider)
    return auth.signInWithPopup(provider)
      .then((result) => {
        console.log(result)
        return result
      }).catch((error) => {
        console.log(error.message, 'sign in failed')
      })
  },
  signOut () {
    return auth.signOut()
  },
  setCurrentStamprally ({ commit }, data) {
    commit('setCurrentStamprally', data)
  },
  setUser ({ commit }, user) {
    commit('setUser', user)
  },
  setUserInfo ({ commit }, payload) {
    commit('setUserInfo', payload)
  },
  setUserLocation ({ commit }, loc) {
    commit('setUserLocation', loc)
  },
  setUsers ({ commit }, users) {
    commit('setUsers', users)
  },
  // setUserName ({ commit }, name) {
  //   commit('setUserName', name)
  // },
  // setUserColor ({ commit }, color) {
  //   commit('setUserColor', color)
  // },
  setStamprally ({ commit }, stamprallies) {
    commit('setStamprally', stamprallies)
  },
  selectStamprally ({ commit }, select) {
    commit('selectStamprally', select)
  },
  selectStamprallyName ({ commit }, select) {
    commit('selectStamprallyName', select)
  },
  setStampInfo ({ commit }, stamps) {
    commit('setStampInfo', stamps)
  },
  setAdInfo ({ commit }, ads) {
    commit('setAdInfo', ads)
  },
  setPhotos ({ commit }, photos) {
    commit('setPhotos', photos)
  },
  setIndexOfStamprally ({ commit }, num) {
    commit('setIndexOfStamprally', num)
  },
  setCourses ({ commit }, courses) {
    commit('setCourses', courses)
  },
  setSpotDetail ({ commit }, param) {
    commit('setSpotDetail', param)
  },
  setPhotoDetail ({ commit }, param) {
    commit('setPhotoDetail', param)
  },
  switchCourseMenu ({ commit }, param) {
    commit('switchCourseMenu', param)
  },
  setCourseStatus ({ commit }, param) {
    commit('setCourseStatus', param)
  }
}
// getterは，他のコンポーネントからデータ取得に使うやつ
export const getters = {
  user (state) {
    return state.user
  },
  userInfo (state) {
    return state.userInfo
  },
  userLocation (state) {
    return state.userLocation
  },
  isAuthenticated (state) {
    return !!state.user
  },
  // userName (state) {
  //   return state.userName
  // },
  // userColor (state) {
  //   return state.userColor
  // },
  currentStamprally (state) {
    return state.currentStamprally
  },
  stamprally (state) {
    return state.stamprally.stamprallies
  },
  selectedStamprally (state) {
    return state.selected
  },
  selectedStamprallyName (state) {
    return state.selectedName
  },
  stampInfo (state) {
    return state.stampInfo
  },
  adInfo (state) {
    return state.adInfo
  },
  photos (state) {
    return state.photos
  },
  courses (state) {
    return state.courses
  },
  QRreader (state) {
    return state.QRreader
  },
  spotDetail (state) {
    return state.spotDetail
  },
  photoDetail (state) {
    return state.photoDetail
  },
  indexOfStamprally (state) {
    return state.indexOfStamprally
  },
  courseStatus (state) {
    return state.courseStatus
  }
}
