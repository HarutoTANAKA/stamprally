<template>
  <!--クイズ画面（ユーザ）-->
  <div v-if="loaded" class="quiz">
    <h5 class="text-center">クイズ</h5>
    <div v-if="status===0">
      <div class="d-flex justify-content-center" style="font-size: 14px">
        <p>{{ shuffledQuiz.question }}</p>
      </div>
      <div class="d-flex flex-wrap">
        <div v-for="answer in shuffleAnswer(shuffledQuiz.answer)" :key="answer.index" class="col-6 text-center">
          <b-button class="ansButton p-3 my-2" @click="answerCheck(answer.value)">{{ answer.text }}</b-button>
        </div>
      </div>
    </div>
    <!--正解の場合-->
    <div v-else-if="status===1" class="px-4">
      <h3 class="text-center" style="color: #e14e53">正解</h3>
      <div class="my-3">
        <p class="text-center" style="font-size: 14px">解説</p>
        <div v-for="(text, index) in shuffledQuiz.description" :key="index" style="font-size: 12px" class="my-1 px-3">
          <span>{{ text }}</span><br>
        </div>
      </div>
      <div class="my-3 text-center" style="font-size: 14px;">
        <span>おめでとうございます</span><br>
        <span>1ptゲット！</span>
      </div>
    </div>
    <!--不正解の場合-->
    <div v-else-if="status===-1" class="px-4">
      <h3 class="text-center" style="color: #e14e53">不正解</h3>
      <div class="my-3">
        <div class="d-flex justify-content-center">
          <p>正解は，</p>
          <p>{{ shuffledQuiz.answer.find(a => a.value === 1).text }}</p>
        </div>
        <p class="text-center" style="font-size: 14px">解説</p>
        <div v-for="(text, index) in shuffledQuiz.description" :key="index" style="font-size: 12px" class="my-1 px-3">
          <span>{{ text }}</span><br>
        </div>
      </div>
      <div class="my-3 text-center" style="font-size: 14px;">
        <span>残念...</span><br>
        <span>また挑戦してみてね。</span>
      </div>
    </div>
  </div>
</template>

<script>
import Firestore from '~/plugin/firestore'

export default {
  name: 'Quiz-User',
  props: {
    stampId: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      quiz: this.$store.getters.stampInfo.stamps[this.stampId].quiz,
      shuffledQuiz: {},
      status: 0,
      loaded: false
    }
  },
  created () {
    // 出題するクイズの選択
    if (this.quiz.length > 1) {
      // クイズが２個以上設定されている場合，ランダムな一個を出題する
      const r = Math.floor(Math.random() * this.quiz.length)
      this.shuffledQuiz = this.quiz[r]
    } else {
      // クイズが１個だけ設定されている場合，その一個を出題する
      this.shuffledQuiz = this.quiz[0]
    }
    this.loaded = true
  },
  methods: {
    async answerCheck (value) {
      // 正誤チェック（正解：1，不正解：0）
      if (value === 1) {
        await Firestore.getPoints(this.$store.getters.user._delegate.uid, this.$route.params.id, 1)
        this.status = 1
      } else if (value === 0) {
        this.status = -1
      }
    },
    shuffleAnswer (answer) {
      // 回答の入っていない選択肢を削除
      for (let i = 0; i < answer.length; i++) {
        if (answer[i].text === '') {
          answer.splice(i, 1)
        }
      }
      // 選択肢をランダムに並び替え
      for (let i = (answer.length - 1); i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1))
        const tmp = answer[i]
        answer[i] = answer[r]
        answer[r] = tmp
      }
      return answer
    }
  }
}
</script>

<style scoped>
.quiz {
  font-family: 'Noto Sans JP', sans-serif !important;
}
.ansButton {
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
}
</style>
