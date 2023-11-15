<template>
  <div class="ranking">
    <div class="card d-flex justify-content-center align-items-center" @click="open()">
      <span style="font-size: 16px">ランキング</span>
      <fa :icon="faRankingStar" style="color: #ffd700" />
    </div>
    <b-modal id="ranking" hide-footer hide-header centered >
      <b-button
        class="closebtn mt-1 mr-2"
        @click="close()"
      >
        <fa :icon="faTimes" />
      </b-button>
      <div class="ranking">
        <div class="text-center">
          <h5>ランキング</h5>
        </div>
        <div v-if="!loading" class="p-3 my-3" style="max-height: 500px; overflow-y: scroll">
          <div v-for="(user, index) in Object.entries(users)" :key="user.id">
            <div class="scoreCard my-3 px-2 d-flex justify-content-center align-items-center">
              <span class="col-1">{{ index + 1 }}</span>
              <div class="col-7 d-flex align-items-center">
                <fa :icon="faUserCircle" class="userIcon" :style="{color: user[1].color}" />
                <span class="ml-2" style="font-size: 14px">{{ user[1].name }}</span>
              </div>
              <div class="col-2 d-flex align-items-center" style="font-size: 14px">
                <span style="font-weight: bold">{{ user[1].stamprally[$route.params.id].points }}</span>
                <span>pt</span>
              </div>
              <fa v-if="index < 3" :icon="faMedal" class="col-2" style="font-size: 28px" :style="{color: top3Color(index)}" />
              <span v-else class="col-2" style="font-size: 28px" />
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-center">
          <span>あなたのポイント：</span>
          <span class="mx-2" style="font-weight: bold">{{ userInfo.points }}</span>
          <span>pt</span>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { faRankingStar, faTimes, faUserCircle, faMedal } from '@fortawesome/free-solid-svg-icons'
import Firestore from '~/plugin/firestore'

export default {
  name: 'RankingUser',
  data () {
    return {
      loading: false,
      users: {},
      userInfo: this.$store.getters.userInfo
    }
  },
  computed: {
    faRankingStar () {
      return faRankingStar
    },
    faTimes () {
      return faTimes
    },
    faUserCircle () {
      return faUserCircle
    },
    faMedal () {
      return faMedal
    }
  },
  methods: {
    async open () {
      this.loading = true
      this.$bvModal.show('ranking')
      this.users = await Firestore.getRanking(this.$route.params.id)
      this.loading = false
    },
    close () {
      this.$bvModal.hide('ranking')
    },
    top3Color (index) {
      if (index === 0) {
        return '#ffd700'
      } else if (index === 1) {
        return '#c0c0c0'
      } else if (index === 2) {
        return '#cbb99e'
      }
    }
  }
}
</script>

<style scoped>
.ranking {
  font-family: 'Noto Sans JP', sans-serif !important;
}
.card {
  width: 140px;
  height: 60px;
  background-color: #fafafa;
  color: dimgrey;
  border-radius: 10px;
  border: none;
}
.closebtn {
  position: absolute;
  right: 12px;
  top: -1px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-size: 24px;
  color: #696969;
  background-color: transparent;
  padding: 0 0;
  border: none;
  cursor: pointer;
  outline: none;
}
.userIcon {
  background-color: white;
  font-size: 28px;
  border-radius: 50px;
}
.scoreCard {
  min-height: 56px;
  background-color: #fafafa;
  border-radius: 6px;
  border: none;
  color: #757575;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, .13);
}
</style>
