<template>
  <!--写真の表示画面（ユーザ）-->
  <div id="photoDetail" class="detail p-3">
    <div>
      <b-button
        class="closebtn mt-1 ml-2"
        @click="close()"
      >
        <fa :icon="faArrowRight" />
      </b-button>
    </div>
    <div class="detailInfo ml-1">
      <div
        v-for="photo in id"
        :key="photo"
        class="my-3"
        style="width: 100%"
      >
        <h5 v-if="$store.getters.photos.photo[photo].userName.length">{{ $store.getters.photos.photo[photo].userName }}さんの写真</h5>
        <h5 v-else>名無しさんの写真</h5>
        <b-img-lazy
          :src="$store.getters.photos.photo[photo].url"
          style="width: 100%; border-radius: 5px;"
        ></b-img-lazy>
        <div class="mt-2">
          <div v-if="$store.getters.photos.photo[photo].comment.length" class="my-1 balloon1-top" style="font-size: 14px;">
            {{ $store.getters.photos.photo[photo].comment }}
          </div>
          <div class="d-flex">
            <p class="my-1" style="font-size: 14px">
              {{ new Date($store.getters.photos.photo[photo].date.seconds*1000).toLocaleString() }}
            </p>
            <div class="d-flex ml-auto">
              <div class="d-flex mx-1 align-items-center">
                <fa
                  v-if="$store.getters.photos.photo[photo].likes && $store.getters.photos.photo[photo].likes.some((likes) => likes.id === uid)"
                  :icon="faHeart"
                  style="font-size: 18px; color: #DF6B6B"
                  @click="removeLike(photo)"
                />
                <fa v-else :icon="faHeartEmpty" style="font-size: 18px" @click="doLike(photo)" />
                <span class="mx-1" style="font-size: 12px">{{ likesCount(photo) }}</span>
              </div>
              <div class="d-flex mx-1 align-items-center">
                <fa
                  v-if="$store.getters.photos.photo[photo].comments && Object.entries($store.getters.photos.photo[photo].comments).some((comment) => comment[1].user.id === uid)"
                  :icon="faComment"
                  style="font-size: 18px; color: #6BA1DF"
                  @click="openComments(photo)"
                />
                <fa v-else :icon="faCommentEmpty" style="font-size: 18px" @click="openComments(photo)" />
                <span class="mx-1" style="font-size: 12px">{{ commentsCount(photo) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal id="comments" centered hide-footer no-close-on-backdrop>
      <template #modal-title>コメント一覧</template>
      <div v-if="targetId.length" class="p-3" style="font-family: 'Noto Sans JP', sans-serif !important; font-size: 14px; color: #555">
        <div v-if="$store.getters.photos.photo[targetId].comments && Object.entries($store.getters.photos.photo[targetId].comments).length" style="max-height: 300px; overflow-y: scroll; padding-bottom: 30px">
          <div v-for="comment in sortedComments" :key="comment[1].id" class="p-2">
            <div class="d-flex align-items-center">
              <fa :icon="faUserCircle" class="userIcon" :style="{color: comment[1].user.color}" />
              <span class="mx-2">{{ comment[1].user.name }}</span>
              <span v-if="comment[1].id === edit" class="mx-2" style="color: #e14e53">編集中</span>
            </div>
            <div v-if="comment[1].id === edit" style="margin-top: 0.8em">
              <b-form-textarea v-model="formComment2" placeholder="ここにコメントを入力" rows="2" style="font-size: 14px" />
              <div class="d-flex align-items-center py-1">
                <b-button variant="primary" class="ml-auto mx-1" style="font-size: 12px" @click="confirmEditComment">確定</b-button>
                <b-button class="mx-1" style="font-size: 12px" @click="cancelEditComment">キャンセル</b-button>
              </div>
            </div>
            <div v-else class="balloon1-top">
              {{ comment[1].text }}
            </div>
            <div v-if="comment[1].id !== edit" class="d-flex align-items-center">
              <span style="font-size: 12px">{{ new Date(comment[1].date.seconds * 1000).toLocaleString() }}</span>
              <span v-if="comment[1].edited" style="font-size: 10px">（編集済み）</span>
              <div class="d-flex ml-auto mr-2 align-items-center">
                <div v-if="comment[1].user.id === $store.getters.user._delegate.uid" class="d-flex align-items-center mx-1" style="font-size: 16px">
                  <fa :icon="faPen" class="mx-1" @click="editComment(comment[1].id, comment[1].text)" />
                  <fa :icon="faTrash" class="mx-1" @click="openDeleteModal(comment[1].id)" />
                </div>
                <fa
                  v-if="comment[1].likes && comment[1].likes.some((likes) => likes.id === uid)"
                  :icon="faHeart"
                  style="font-size: 16px; color: #DF6B6B"
                  @click="removeLikeFromComment(comment[1].id)"
                />
                <fa v-else :icon="faHeartEmpty" style="font-size: 16px" @click="doLikeToComment(comment[1].id)" />
                <span class="mx-1">{{ comment[1].likes.length }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center">
          <p>まだコメントはありません</p>
        </div>
        <div v-if="!edit.length" class="px-2">
          <b-form-textarea v-model="formComment" placeholder="ここにコメントを入力" rows="2" max-rows="3" style="font-size: 14px" />
          <div class="d-flex justify-content-center mt-2">
            <b-button v-if="formComment.length" variant="primary" class="px-3" style="font-size: 14px; flex-wrap: nowrap" @click="sendComment()">投稿</b-button>
            <b-button v-else class="px-3" style="font-size: 14px; flex-wrap: nowrap" disabled>投稿</b-button>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal id="deleteComment" size="sm" centered hide-header hide-footer>
      <div class="p-3" style="font-family: 'Noto Sans JP', sans-serif !important; font-size: 14px; color: #555">
        <p class="text-center">このコメントを削除しますか？</p>
        <div class="d-flex align-items-center justify-content-center">
          <b-button variant="primary" size="sm" class="mx-2" @click="deleteComment">削除する</b-button>
          <b-button size="sm" class="mx-2" @click="$bvModal.hide('deleteComment')">キャンセル</b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { faArrowRight, faExternalLinkAlt, faHeart, faComment, faUserCircle, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartEmpty, faComment as faCommentEmpty } from '@fortawesome/free-regular-svg-icons'
import Firestore from '~/plugin/firestore'

export default {
  name: 'PhotoDetail-User',
  data () {
    return {
      id: this.$store.getters.photoDetail.id,
      uid: this.$store.getters.user._delegate.uid,
      formComment: '',
      formComment2: '',
      targetId: '',
      edit: '',
      delete: ''
    }
  },
  computed: {
    faArrowRight () {
      return faArrowRight
    },
    faHeartEmpty () {
      return faHeartEmpty
    },
    faHeart () {
      return faHeart
    },
    faCommentEmpty () {
      return faCommentEmpty
    },
    faComment () {
      return faComment
    },
    faUserCircle () {
      return faUserCircle
    },
    faExternalLinkAlt () {
      return faExternalLinkAlt
    },
    faPen () {
      return faPen
    },
    faTrash () {
      return faTrash
    },
    sortedComments () {
      const comments = Object.entries(this.$store.getters.photos.photo[this.targetId].comments)
      return comments.sort((a, b) => {
        return (a[1].date.seconds > b[1].date.seconds ? 1 : -1)
      })
    }
  },
  methods: {
    close () {
      // 表示を閉じる
      const element = document.getElementById('photoDetail')
      element.classList.add('fadeout')
      setTimeout(() => {
        this.$store.dispatch('setPhotoDetail', { state: false, id: [] })
      }, 500)
    },
    likesCount (photo) {
      if (this.$store.getters.photos.photo[photo].likes) {
        return this.$store.getters.photos.photo[photo].likes.length
      } else {
        return 0
      }
    },
    commentsCount (photo) {
      if (this.$store.getters.photos.photo[photo].comments) {
        return Object.entries(this.$store.getters.photos.photo[photo].comments).length
      } else {
        return 0
      }
    },
    async doLike (photo) {
      await Firestore.doLike(photo, this.uid)
    },
    async removeLike (photo) {
      const removeData = this.$store.getters.photos.photo[photo].likes.find(item => item.id === this.uid)
      await Firestore.removeLike(photo, removeData)
    },
    openComments (photo) {
      this.targetId = photo
      this.$bvModal.show('comments')
    },
    createId (length) {
      // 新規作成時のID生成
      const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let r = ''
      for (let i = 0; i < length; i++) {
        r += c[Math.floor(Math.random() * c.length)]
      }
      return r
    },
    async sendComment () {
      if (this.targetId.length) {
        const newId = this.createId(20)
        const data = {
          date: new Date(),
          id: newId,
          likes: [],
          text: this.formComment,
          user: {
            color: this.$store.getters.userInfo.color,
            id: this.$store.getters.userInfo.uid,
            name: this.$store.getters.userInfo.name
          }
        }
        await Firestore.sendComment(this.targetId, data)
        this.formComment = ''
      }
    },
    async doLikeToComment (id) {
      await Firestore.doLikeToComment(this.targetId, id, this.uid)
    },
    async removeLikeFromComment (id) {
      const removeData = this.$store.getters.photos.photo[this.targetId].comments[id].likes.find(item => item.id === this.uid)
      await Firestore.removeLikeFromComment(this.targetId, id, removeData)
    },
    editComment (id, text) {
      this.edit = id
      this.formComment2 = text
    },
    openDeleteModal (id) {
      this.delete = id
      this.$bvModal.show('deleteComment')
    },
    async deleteComment () {
      await Firestore.deleteComment(this.targetId, this.delete)
      this.$bvToast.toast('コメントを削除しました。', { variant: 'info' })
      this.delete = ''
      this.$bvModal.hide('deleteComment')
    },
    async confirmEditComment () {
      const data = {
        edited: new Date(),
        text: this.formComment2
      }
      await Firestore.editComment(this.targetId, this.edit, data)
      this.$bvToast.toast('コメントを編集しました。', { variant: 'info' })
      this.edit = ''
      this.formComment2 = ''
    },
    cancelEditComment () {
      this.edit = ''
      this.formComment2 = ''
    }
  }
}
</script>

<style scoped>
.detail {
  /*min-height: 31rem;*/
  font-family: 'Noto Sans JP', sans-serif !important;
  min-height: 18vh;
  max-height: 54vh;
  min-width: 75%;
  max-width: 75%;
  position: absolute;
  /*bottom: 130px;*/
  top: 105px;
  right: 0;
  margin: auto;
  z-index: 1001 !important;
  background-color: #fafafa;
  color: #333333;
  border: none;
  border-radius: 15px 0 0 15px;
  box-shadow: 0 6px 15px 0 rgba(0, 0, 0, .13);
  /*box-shadow:0 -5px 5px #D67200;*/
  animation: anim 0.5s forwards;
  overflow: hidden;
}
@keyframes anim {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
.detail.fadeout {
  animation: fadeout 0.5s forwards;
}
@keyframes fadeout {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}
::-webkit-scrollbar {
  display: none;
}
.detailInfo {
  font-family: 'Noto Sans JP', sans-serif !important;
  max-width: 95%;
  max-height: 50vh;
  margin-top: 22px;
  padding-bottom: 20px;
  overflow: scroll;
}
.closebtn {
  position: absolute;
  left: 12px;
  top: -1px;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
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
  font-size: 30px;
  border-radius: 50px;
}
.balloon1-top {
  position: relative;
  display: inline-block;
  margin-top: 0.8em;
  padding: 7px 10px;
  min-width: 60px;
  max-width: 100%;
  border-radius: 8px;
  color: #555;
  font-size: 14px;
  background: #efefef;
}

.balloon1-top:before {
  content: "";
  position: absolute;
  top: -23px;
  left: 0;
  border: 15px solid transparent;
  border-bottom: 15px solid #efefef;
}

.balloon1-top p {
  margin: 0;
  padding: 0;
}
</style>
