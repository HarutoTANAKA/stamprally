<template>
  <!--スタンプ情報の設定（コンソール）-->
  <b-container class="py-0" style="border-radius: 3px; height: 88vh; overflow: scroll">
    <b-row class="d-flex mb-3">
      <!--左半分（一覧）-->
      <b-col class="col-6 my-3">
        <b-button
          id="tooltip2"
          variant="outline-primary"
          class="my-3"
          style="border-width: 3px; height: 60px"
          block
          @click="createStamp()"
        >
          <fa :icon="faPlus" style="font-size: 20px" />
        </b-button>
        <b-tooltip target="tooltip2" triggers="hover">
          新規追加
        </b-tooltip>
        <div style="overflow: scroll; height: 39rem">
          <b-list-group>
            <b-list-group-item
              v-for="stamp in stamps"
              :key="stamp.id"
              button
              class="d-flex"
              style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
              @click="openInfo(stamp.id)"
            >
              {{ stamp.name }}
              <span v-if="edit === stamp.id" class="ml-3 px-1 my-auto" style="color: #e14e53; font-size: 14px; border: #e14e53 1px solid; border-radius: 3px">編集中</span>
              <fa v-if="stamp.editURL" :icon="faLink" class="ml-auto mt-1" style="font-size: 18px; color: #007bff" @click="openModal(stamp.id, 'editUrl')" />
              <fa v-else :icon="faLink" class="ml-auto mt-1" style="font-size: 18px" @click="openModal(stamp.id, 'editUrl')" />
              <fa :icon="faQrcode" class="ml-3 mt-1" style="font-size: 18px" @click="showQr(stamp.id)" />
              <fa :icon="faTrash" class="ml-3 mr-3 mt-1" style="font-size: 18px" @click="openModal(stamp.id, 'delete')" />
            </b-list-group-item>
          </b-list-group>
        </div>
        <!--削除確認のポップアップ-->
        <b-modal id="deleteS" size="sm" hide-header hide-footer centered>
          <div v-if="editId" class="text-center mt-4 mb-2" style="font-family: 'Noto Sans JP', sans-serif !important;">
            <h4>{{ stamps[editId].name }}</h4>
            <h4>を削除しますか？</h4>
            <div class="mt-4">
              <b-button class="mx-2" variant="primary" @click="deleteStamp(editId)">
                はい
              </b-button>
              <b-button class="mx-2" variant="outline-primary" @click="$bvModal.hide('deleteS')">
                いいえ
              </b-button>
            </div>
          </div>
        </b-modal>
        <!--編集用URL管理のポップアップ-->
        <b-modal id="editUrlSetting" hide-footer centered>
          <template #modal-title>
            編集用URLの発行
          </template>
          <div class="text-center fontConf">
            <p>編集用URLを発行すると，URLを知っている人がこのスポットの情報を編集できるようになります．</p>
            <div v-if="isEditUrl" class="my-4">
              <h5 style="word-wrap: break-word; font-weight: bold">
                {{ stamps[editId].editURL.url }}
              </h5>
              <p class="mt-3" style="font-size: 12px">
                最終更新：{{ new Date(stamps[editId].editURL.date.seconds*1000).toLocaleString() }}
              </p>
              <b-button variant="primary" class="mx-1 mt-3" @click="$bvModal.show('reNewEditUrl')">
                URLを再発行
              </b-button>
              <b-button variant="outline-primary" class="mx-1 mt-3" @click="copyURL(stamps[editId].editURL.url)">
                URLをコピー
              </b-button>
            </div>
            <div v-else class="my-4">
              <h5>現在，発行されたURLはありません</h5>
              <b-button variant="primary" class="mt-3" @click="$bvModal.show('makeEditUrl')">
                URLを発行
              </b-button>
            </div>
          </div>
        </b-modal>
        <!--編集用URLの発行確認のポップアップ-->
        <b-modal id="makeEditUrl" size="sm" hide-footer hide-header centered>
          <div class="text-center fontConf mt-4 mb-2">
            <h5>編集用URLを発行します</h5>
            <p style="font-size: 14px">
              第三者に知られることの無いよう，注意して管理してください．
            </p>
            <div class="mt-4">
              <b-button class="mx-2" variant="primary" @click="createEditUrl(editId)">
                はい
              </b-button>
              <b-button class="mx-2" variant="outline-primary" @click="$bvModal.hide('makeEditUrl')">
                いいえ
              </b-button>
            </div>
          </div>
        </b-modal>
        <!--編集用URLの再発行確認のポップアップ-->
        <b-modal id="reNewEditUrl" size="sm" hide-footer hide-header centered>
          <div class="text-center fontConf mt-4 mb-2">
            <h5>編集用URLを再発行します</h5>
            <p style="font-size: 14px">
              以前の編集用URLは使用できなくなります．
            </p>
            <div class="mt-4">
              <b-button class="mx-2" variant="primary" @click="createEditUrl(editId)">
                はい
              </b-button>
              <b-button class="mx-2" variant="outline-primary" @click="$bvModal.hide('reNewEditUrl')">
                いいえ
              </b-button>
            </div>
          </div>
        </b-modal>
      </b-col>
      <!--右半分（編集画面）-->
      <b-col v-if="upload || loading" class="text-center align-items-center col-6 my-3" style="overflow: scroll; height: 45rem">
        <b-spinner type="grow" label="Spinning" style="width: 3rem; height: 3rem;" class="my-3" />
      </b-col>
      <b-col v-else class="col-6 my-3" style="overflow: scroll; height: 45rem">
        <div v-if="qrCode" class="d-flex justify-content-center text-center" style="width: 100%; height: 400px">
          <div>
            <h4> {{ stamps[qrCode].name }} </h4>
            <qrcode id="qrimg" :value="'https://' + qrCode" :options="{width: 300, height: 300}" tag="canvas" />
            <div>
              <p>ID: {{ qrCode }}</p>
            </div>
            <div>
              <b-button variant="primary" @click="downloadQr(stamps[qrCode].name + '.png')">
                ダウンロード
                <fa :icon="faDownload" style="font-size: 18px" />
              </b-button>
              <b-button variant="danger" @click="qrCode = null">
                閉じる
              </b-button>
            </div>
          </div>
        </div>
        <div v-else>
          <GmapMap
            ref="gMAp"
            map-type-id="roadmap"
            :center="initialLocation"
            :zoom="zoom"
            :style="styleMap"
            :options="mapOptions"
            style="overflow: hidden; border-radius: 13px; z-index: 1"
            @click="ping($event)"
          >
            <GmapMarker
              v-if="markerPos"
              :position="markerPos"
              :draggable="false"
            />
            <GmapCircle
              v-if="markerPos"
              :center="markerPos"
              :radius="form.radius"
              :visible="true"
              :options="{strokeColor: 'red', strokeOpacity: '0.5', fillColor: 'red', fillOpacity: '0.2'}"
            />
          </GmapMap>
          <div class="mt-1" style="font-size: 12px">
            <p>マップ上で任意の場所をクリックすることで緯度と経度を指定できます。</p>
          </div>
        </div>
        <div>
          <div class="d-flex align-items-center mt-4">
            <h5 class="mr-auto">
              スポット情報
            </h5>
            <b-button class="mr-1 my-0" @click="openInfo(edit)">
              <fa :icon="faRedo" />
            </b-button>
          </div>
          <b-row class="d-flex align-items-center mt-3">
            <b-col class="col-3">
              <label for="latitude">緯度：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="latitude" v-model.number="form.lat" type="number" @keydown="markerPos.lat=form.lat" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="longitude">経度：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="longitude" v-model.number="form.lng" type="number" @keydown="markerPos.lng=form.lng" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="stampOrNot">スタンプとして設定：</label>
            </b-col>
            <b-col class="col-4">
              <b-form-checkbox
                id="stampOrNot"
                v-model="form.isStamp"
                switch
                size="lg"
                value="1"
                unchecked-value="0"
              />
            </b-col>
          </b-row>
          <b-row v-if="form.isStamp==='1'" class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="QRorGPS">スタンプ方式：</label>
            </b-col>
            <b-col class="col-4">
              <b-form-select id="QRorGPS" v-model="form.QRorGPS" :options="[{value: 'QR', text: 'QRコード'}]" />
            </b-col>
          </b-row>
          <b-row v-if="form.isStamp==='1'" class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="displayOrNot">マップ上に非表示：</label>
            </b-col>
            <b-col class="col-4">
              <b-form-checkbox
                id="displayOrNot"
                v-model="form.invisible"
                switch
                size="lg"
                value="1"
                unchecked-value="0"
              />
            </b-col>
          </b-row>
          <b-row v-if="form.isStamp==='0'" class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="icon">スポットアイコン：</label>
            </b-col>
            <b-col class="col-4">
              <b-form-select id="icon" v-model="form.icon" :options="icons" />
            </b-col>
            <b-col class="col-3">
              <fa v-if="form.icon==='spot'" :icon="faLocationDot" style="color: dimgrey" />
              <fa v-if="form.icon==='toilet'" :icon="faRestroom" style="color: dimgrey" />
              <fa v-if="form.icon==='shop'" :icon="faShop" style="color: dimgrey" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="radius">スタンプ有効半径：</label>
            </b-col>
            <b-col class="col-4">
              <b-form-input id="radius" v-model.number="form.radius" type="number" />
            </b-col>
            <h6>m（QRの場合は0）</h6>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="name">スポット名：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="name" v-model="form.name" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="desc">スポット説明：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-textarea id="desc" v-model="form.description" rows="6" max-rows="10" style="overflow: auto" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="facility">設備：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-checkbox-group id="facility" v-model="form.facility">
                <b-form-checkbox value="toilet">
                  トイレ
                </b-form-checkbox>
                <b-form-checkbox value="break">
                  休憩所
                </b-form-checkbox>
                <b-form-checkbox value="restaurant">
                  食事処
                </b-form-checkbox>
              </b-form-checkbox-group>
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="hours">営業日：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-checkbox-group id="hours" v-model="form.hours.date" :options="dateOptions" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="hoursDetail">営業時間詳細：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-textarea id="hoursDetail" v-model="form.hours.detail" rows="4" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="webURL">ウェブサイトURL：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="webURL" v-model.number="form.url" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="twitterURL">ツイッターURL：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="twitterURL" v-model.number="form.twitter" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="instaURL">インスタグラムURL：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="instaURL" v-model.number="form.instagram" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="youtubeURL">YoutubeURL：</label>
            </b-col>
            <b-col class="col-9">
              <b-form-input id="youtubeURL" v-model.number="form.youtube" />
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="image">スポット画像：</label>
            </b-col>
            <b-col v-if="!imageLoading" class="col-9">
              <div v-if="form.imagePreview">
                <b-img-lazy :src="form.imagePreview" class="my-2" style="max-height: 250px; max-width: 100%" />
              </div>
              <div
                v-else
                class="my-2 text-center"
                style="height: 200px; width: 100%; border-radius: 5px; background-color: #efefef; padding-top: 90px"
              >
                <span>
                  画像がありません
                </span>
              </div>
              <div class="d-flex">
                <b-form-file ref="stampImage" accept="image/jpeg, image/png" placeholder="クリックして選択" class="mr-1" @change="select_file" />
                <b-button
                  v-if="form.deletePath.length"
                  size="sm"
                  variant="danger"
                  class="ml-1"
                  style="font-size: 14px; white-space: nowrap"
                  @click="deleteImage(edit)"
                >
                  削除
                </b-button>
              </div>
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="image">スタンプ画像：</label>
            </b-col>
            <b-col v-if="!imageLoading" class="col-9">
              <div v-if="form.stampIconPreview">
                <b-img-lazy :src="form.stampIconPreview" class="my-2" style="max-height: 250px; max-width: 100%" />
              </div>
              <div
                v-else
                class="my-2 text-center"
                style="height: 200px; width: 100%; border-radius: 5px; background-color: #efefef; padding-top: 90px"
              >
                <span>
                  画像がありません
                </span>
              </div>
              <div class="d-flex">
                <b-form-file ref="stampImage" accept="image/jpeg, image/png" placeholder="クリックして選択" class="mr-1" @change="select_file3" />
                <b-button
                  v-if="form.deletePath3.length"
                  size="sm"
                  variant="danger"
                  class="ml-1"
                  style="font-size: 14px; white-space: nowrap"
                  @click="deleteImage3(edit)"
                >
                  削除
                </b-button>
              </div>
            </b-col>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="other">その他の画像：</label>
            </b-col>
            <b-col v-if="!imageLoading" class="col-9">
              <div v-if="form.image2Preview && form.image2Preview.length">
                <div v-for="(image, index) in form.image2Preview" :key="index" class="d-flex">
                  <b-img-lazy :src="image" class="my-2" style="max-height: 250px; max-width: 100%" />
                  <b-button
                    v-if="form.deletePath2.length"
                    size="sm"
                    variant="danger"
                    class="ml-auto"
                    style="font-size: 14px; white-space: nowrap"
                    @click="deleteImage2(edit, index)"
                  >
                    削除
                  </b-button>
                </div>
              </div>
              <div
                v-else
                class="my-2 text-center"
                style="height: 200px; width: 100%; border-radius: 5px; background-color: #efefef; padding-top: 90px"
              >
                <span>
                  画像がありません
                </span>
              </div>
              <div class="d-flex">
                <b-form-file ref="stampImage" accept="image/jpeg, image/png" placeholder="クリックして画像を追加" class="mr-1" @change="select_file2" />
              </div>
            </b-col>
          </b-row>
          <b-row v-if="form.isStamp==='1'" class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="quiz">クイズを設定：</label>
            </b-col>
            <b-col class="col-4">
              <b-form-checkbox
                id="quiz"
                v-model="form.quizAvailable"
                switch
                size="lg"
                :value="true"
                :unchecked-value="false"
              />
            </b-col>
          </b-row>
          <b-row v-if="form.isStamp==='1' && form.quizAvailable" class="mt-3 align-items-center">
            <b-col v-for="(quiz, index) in form.quiz" :key="index" class="col-12 d-flex pb-3">
              <div class="col-3" />
              <div class="col-9">
                <div class="d-flex">
                  <p style="font-weight: bold; color: #007bff">
                    クイズ{{ index + 1 }}
                  </p>
                  <fa v-if="form.quiz.length!==1" :icon="faTrash" class="ml-auto mr-3" style="color: dimgrey" @click="removeQuiz(index)" />
                </div>
                <div class="mb-2">
                  <span>問題文</span><br>
                  <b-form-textarea v-model="quiz.question" rows="3" max-rows="3" style="overflow: auto" />
                </div>
                <div class="mb-2">
                  <span>選択肢</span><br>
                  <b-form-input v-model="quiz.answer[0].text" placeholder="正解の回答" class="col-8 my-1" style="border: #e14e53 solid 2px; font-size: 14px" />
                  <b-form-input v-model="quiz.answer[1].text" placeholder="回答1（空欄は選択肢から除外）" class="col-8 my-1" style="font-size: 14px" />
                  <b-form-input v-model="quiz.answer[2].text" placeholder="回答2（空欄は選択肢から除外）" class="col-8 my-1" style="font-size: 14px" />
                  <b-form-input v-model="quiz.answer[3].text" placeholder="回答3（空欄は選択肢から除外）" class="col-8 my-1" style="font-size: 14px" />
                </div>
                <div>
                  <span>解説文</span><br>
                  <b-form-textarea v-model="quiz.description" rows="3" max-rows="5" style="overflow: auto" />
                </div>
              </div>
            </b-col>
            <div class="mx-auto my-2 text-center">
              <b-button size="sm" variant="outline-primary" @click="addQuiz()">
                クイズを追加
              </b-button>
              <p class="mt-2" style="font-size: 14px">
                クイズを複数設定した場合，ランダムに出題されます。
              </p>
            </div>
          </b-row>
          <b-row class="mt-3 align-items-center">
            <b-col class="col-3">
              <label for="quiz">商品を設定：</label>
            </b-col>
            <b-col class="col-4">
              <b-form-checkbox
                id="menu"
                v-model="form.menuAvailable"
                switch
                size="lg"
                :value="true"
                :unchecked-value="false"
              />
            </b-col>
          </b-row>
          <b-row v-if="form.menuAvailable" class="mt-3 align-items-center">
            <b-col v-for="(menu, index) in form.menu" :key="index" class="col-12 d-flex pb-3">
              <div class="col-3" />
              <div class="col-9">
                <div class="d-flex">
                  <p style="font-weight: bold; color: #007bff">
                    商品{{ index + 1 }}
                  </p>
                  <fa v-if="form.menu.length!==0" :icon="faTrash" class="ml-auto mr-3" style="color: dimgrey" @click="removeMenu(index)" />
                </div>
                <div class="mb-2">
                  <span>商品名</span><br>
                  <b-form-textarea v-model="menu.name" rows="3" max-rows="3" style="overflow: auto" />
                </div>
                <div class="mb-2">
                  <span>価格</span><br>
                  <b-form-input v-model="menu.price" placeholder="価格を入力" class="col-8 my-1" style="font-size: 14px" />
                </div>
                <div class="mb-2">
                  <span>割引価格を設定する</span><br>
                  <b-form-checkbox
                    id="discount"
                    v-model="menu.discount"
                    switch
                    size="lg"
                    :value="true"
                    :unchecked-value="false"
                  />
                </div>
                <div v-if="menu.discount" class="mb-2">
                  <span>割引価格</span><br>
                  <b-form-input v-model="menu.discountPrice" placeholder="割引後価格を入力" class="col-8 my-1" style="font-size: 14px" />
                </div>
                <div class="mb-2">
                  <span>画像</span><br>
                  <b-col v-if="!imageLoading" class="col-9">
                    <div v-if="menu.imagePreview">
                      <b-img-lazy :src="menu.imagePreview" class="my-2" style="max-height: 250px; max-width: 100%" />
                    </div>
                    <div
                      v-else
                      class="my-2 text-center"
                      style="height: 200px; width: 100%; border-radius: 5px; background-color: #efefef; padding-top: 90px"
                    >
                      <span>
                        画像がありません
                      </span>
                    </div>
                    <div class="d-flex">
                      <b-form-file ref="menuImage" accept="image/jpeg, image/png" placeholder="クリックして選択" class="mr-1" @change="select_file4($event, index)" />
                      <b-button
                        v-if="menu.path"
                        size="sm"
                        variant="danger"
                        class="ml-1"
                        style="font-size: 14px; white-space: nowrap"
                        @click="deleteImage4(edit, index)"
                      >
                        削除
                      </b-button>
                    </div>
                    <b-button v-if="imageUploaded === false" variant="primary" size="sm" @click="uploadImage4(edit, index)">
                      画像をアップロード
                    </b-button>
                  </b-col>
                </div>
                <div>
                  <span>説明文</span><br>
                  <b-form-textarea v-model="menu.description" rows="3" max-rows="5" style="overflow: auto" />
                </div>
              </div>
            </b-col>
            <div class="mx-auto my-2 text-center">
              <b-button size="sm" variant="outline-primary" @click="addMenu()">
                商品を追加
              </b-button>
            </div>
          </b-row>
          <b-row class="text-center mt-5 mb-3">
            <b-col>
              <b-button v-if="imageUploading" variant="secondary" disabled size="lg">
                画像をアップロード中
              </b-button>
              <b-button v-else-if="edit" variant="primary" size="lg" @click="uploadImage(edit)">
                変更の保存
              </b-button>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { faPlus, faTrash, faQrcode, faDownload, faLink, faRedo, faLocationDot, faShop, faRestroom } from '@fortawesome/free-solid-svg-icons'
import { gmapApi } from 'vue2-google-maps'
import firebase from 'firebase/compat/app'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import Compressor from 'compressorjs'
import { firestore } from '../plugin/firebase'
import Firestore from '~/plugin/firestore'

export default {
  name: 'Stamps',
  data () {
    return {
      loading: false,
      imageLoading: false,
      windowHeight: window.innerHeight,
      stamps: {},
      stamprallyData: this.$store.getters.stamprally[this.$store.getters.selectedStamprally],
      initialLocation: { lng: 130.27, lat: 33.3 },
      styleMap: {
        width: '100%',
        height: '450px'
      },
      zoom: 10,
      mapOptions: {
        disableDefaultUi: true,
        mapTypeControl: true,
        zoomControl: true,
        fullscreenControl: false,
        streetViewControl: false,
        clickableIcons: false,
        styles: []
      },
      markerPos: null,
      form: {
        name: '',
        lat: 0,
        lng: 0,
        radius: 0,
        isStamp: false,
        invisible: false,
        icon: 'spot',
        description: '',
        QRorGPS: 'QR',
        url: '',
        facility: [],
        hours: { date: [], detail: '' },
        twitter: '',
        instagram: '',
        youtube: '',
        image: ['', ''],
        imagePreview: '',
        image2: [],
        image2Preview: [],
        stampIcon: ['', ''],
        stampIconPreview: '',
        quizAvailable: false,
        menuAvailable: false,
        quiz: [{
          question: '',
          answer: [{ text: '', value: 1 }, { text: '', value: 0 }, { text: '', value: 0 }, { text: '', value: 0 }],
          description: ''
        }],
        menu: [{
          image: null,
          imagePreview: null,
          path: '',
          name: '',
          price: '',
          discount: false,
          discountPrice: '',
          description: ''
        }],
        deletePath: '',
        deletePath2: [],
        deletePath3: ''
      },
      icons: [{ value: 'spot', text: 'スポット' }, { value: 'shop', text: 'お店' }, { value: 'toilet', text: 'トイレ' }],
      dateOptions: [
        { text: '月', value: { name: '月', index: 0 } },
        { text: '火', value: { name: '火', index: 1 } },
        { text: '水', value: { name: '水', index: 2 } },
        { text: '木', value: { name: '木', index: 3 } },
        { text: '金', value: { name: '金', index: 4 } },
        { text: '土', value: { name: '土', index: 5 } },
        { text: '日', value: { name: '日', index: 6 } }
      ],
      edit: null,
      editId: null,
      isEditUrl: false,
      qrCode: null,
      upload: false,
      imageUploading: false,
      imageUploaded: true,
      height1: (window.innerHeight - 160) + 'px',
      height2: (window.height - 220) + 'px',
      file: {
        image: null,
        thumbnail: null,
        storagePath: []
      },
      file2: {
        image: [],
        storagePath: []
      },
      file3: {
        image: null,
        thumbnail: null,
        storagePath: []
      }
    }
  },
  computed: {
    faPlus () {
      return faPlus
    },
    faTrash () {
      return faTrash
    },
    faQrcode () {
      return faQrcode
    },
    faDownload () {
      return faDownload
    },
    faLink () {
      return faLink
    },
    faRedo () {
      return faRedo
    },
    faLocationDot () {
      return faLocationDot
    },
    faShop () {
      return faShop
    },
    faRestroom () {
      return faRestroom
    },
    correctAnswer (quiz) {
      console.log(quiz)
      return quiz.answer.find(a => a.value === 1)
    },
    otherChoice (quiz) {
      return quiz.answer.filter(a => a.value === 0)
    },
    google: gmapApi
  },
  watch: {
  },
  async created () {
    // firestoreからスタンプ情報を取得
    const _this = this
    await firestore
      .collection('stamps')
      .where('stamprallyId', '==', this.$store.getters.selectedStamprally)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.$set(_this.stamps, doc.id, doc.data())
        })
      })
    console.log(this.stamps)
    this.initialLocation = { lat: this.stamprallyData.defaultLat, lng: this.stamprallyData.defaultLng }
    console.log(this.initialLocation)
    this.loaded = true
  },
  methods: {
    arrayToString (array) {
      // 配列から表示用の文字列へ変換
      if (typeof (array) === 'object') {
        let text = ''
        for (let i = 0; i < array.length; i++) {
          text += array[i]
          if (i !== array.length - 1) {
            text += '\n'
          }
        }
        return text
      } else if (typeof (array) === 'string') {
        return array
      }
    },
    stringToArray (text) {
      // 文字列からデータ用の配列に変換
      if (typeof (text) === 'string') {
        return text.split('\n')
      } else if (typeof (text) === 'object') {
        return text
      }
    },
    openInfo (id) {
      // スタンプ情報を表示
      this.loading = true
      this.edit = id
      this.$refs.stampImage.reset()
      this.form.lat = this.stamps[id].location._lat
      this.form.lng = this.stamps[id].location._long
      this.markerPos = { lat: this.form.lat, lng: this.form.lng }
      this.initialLocation = { lat: this.form.lat, lng: this.form.lng }
      this.form.name = this.stamps[id].name
      this.form.radius = this.stamps[id].radius
      this.form.description = this.arrayToString(this.stamps[id].description)
      this.form.isStamp = String(this.stamps[id].display)
      this.form.invisible = String(this.stamps[id].invisible)
      if (this.stamps[id].icon) {
        this.form.icon = this.stamps[id].icon
      } else { this.form.icon = 'spot' }
      this.form.QRorGPS = this.stamps[id].type
      if (this.stamps[id].facility) {
        this.form.facility = this.stamps[id].facility
      } else { this.form.facility = [] }
      if (this.stamps[id].hours) {
        this.form.hours.date = this.stamps[id].hours.date
        this.form.hours.detail = this.arrayToString(this.stamps[id].hours.detail)
      } else { this.form.hours = { date: [], detail: '' } }
      this.form.url = this.stamps[id].URL
      if (this.stamps[id].twitter) {
        this.form.twitter = this.stamps[id].twitter
      } else { this.form.twitter = '' }
      if (this.stamps[id].instagram) {
        this.form.instagram = this.stamps[id].instagram
      } else { this.form.instagram = '' }
      if (this.stamps[id].youtube) {
        this.form.youtube = this.stamps[id].youtube
      } else { this.form.youtube = '' }
      this.form.image[0] = this.stamps[id].image
      this.form.image[1] = this.stamps[id].thumbnail
      this.form.imagePreview = this.form.image[0]
      if (this.stamps[id].image2) {
        this.form.image2 = this.stamps[id].image2
        this.form.image2Preview = this.form.image2
      } else {
        this.form.image2 = []
        this.form.image2Preview = []
      }
      this.form.stampIcon[0] = this.stamps[id].stampIcon
      this.form.stampIcon[1] = this.stamps[id].thumbnail2
      this.form.stampIconPreview = this.form.stampIcon[0]
      if (this.stamps[id].path) {
        this.form.deletePath = this.stamps[id].path
      } else { this.form.deletePath = '' }
      if (this.stamps[id].path2) {
        this.form.deletePath2 = this.stamps[id].path2
      } else { this.form.deletePath2 = [] }
      if (this.stamps[id].path3) {
        this.form.deletePath3 = this.stamps[id].path3
      } else { this.form.deletePath3 = '' }
      if (this.stamps[id].quizAvailable) {
        this.form.quizAvailable = this.stamps[id].quizAvailable
      } else { this.form.quizAvailable = false }
      if (this.stamps[id].quiz && this.stamps[id].quiz.length) {
        this.form.quiz = []
        for (let i = 0; i < this.stamps[id].quiz.length; i++) {
          this.form.quiz.push({
            question: this.stamps[id].quiz[i].question,
            answer: this.stamps[id].quiz[i].answer,
            description: this.arrayToString(this.stamps[id].quiz[i].description)
          })
        }
      } else {
        this.form.quiz = [{
          question: '',
          answer: [{ text: '', value: 1 }, { text: '', value: 0 }, { text: '', value: 0 }, { text: '', value: 0 }],
          description: ''
        }]
      }
      if (this.stamps[id].menuAvailable) {
        this.form.menuAvailable = this.stamps[id].menuAvailable
      } else { this.form.menuAvailable = false }
      if (this.stamps[id].menu && this.stamps[id].menu.length) {
        this.form.menu = []
        for (let i = 0; i < this.stamps[id].menu.length; i++) {
          this.form.menu.push({
            image: this.stamps[id].menu[i].image,
            imagePreview: this.stamps[id].menu[i].image,
            path: this.stamps[id].menu[i].path,
            name: this.stamps[id].menu[i].name,
            price: this.stamps[id].menu[i].price,
            discount: this.stamps[id].menu[i].discount,
            discountPrice: this.stamps[id].menu[i].discountPrice,
            description: this.arrayToString(this.stamps[id].menu[i].description)
          })
        }
      } else {
        this.form.menu = [{
          image: null,
          imagePreview: null,
          path: '',
          name: '',
          price: '',
          discount: false,
          discountPrice: '',
          description: ''
        }]
      }
      this.zoom = 17
      this.loading = false
      console.log(this.form)
    },
    addQuiz () {
      this.form.quiz.push({
        question: '',
        answer: [{ text: '', value: 1 }, { text: '', value: 0 }, { text: '', value: 0 }, { text: '', value: 0 }],
        description: ''
      })
    },
    removeQuiz (index) {
      this.form.quiz.splice(index, 1)
    },
    addMenu () {
      this.form.menu.push({
        image: null,
        imagePreview: null,
        path: '',
        name: '',
        price: '',
        discount: false,
        discountPrice: '',
        description: ''
      })
    },
    removeMenu (index) {
      this.form.menu.splice(index, 1)
    },
    ping (event) {
      // マップ上にピンを指す
      if (event) {
        this.form.lat = event.latLng.lat()
        this.form.lng = event.latLng.lng()
        this.markerPos = { lat: this.form.lat, lng: this.form.lng }
      }
    },
    async select_file (e) {
      // ファイル選択後の処理
      this.imageLoading = true
      console.log(this.form.image)
      const key = Math.random().toString(36).slice(-6) // ファイル名重複回避のためのやつ
      this.file.image = await this.compressImage(e.target.files[0], 'image', key)
      this.file.thumbnail = await this.compressImage(e.target.files[0], 'thumbnail', key)
      this.form.imagePreview = URL.createObjectURL(this.file.image)
      this.imageLoading = false
      // this.uploadImage()
    },
    async select_file2 (e) {
      this.imageLoading = true
      const key = Math.random().toString(36).slice(-6) // ファイル名重複回避のためのやつ
      const compressed = await this.compressImage(e.target.files[0], 'image', key)
      this.file2.image.push(compressed)
      this.form.image2Preview.push(URL.createObjectURL(compressed))
      this.imageLoading = false
    },
    async select_file3 (e) {
      this.imageLoading = true
      console.log(this.form.stampIcon)
      const key = Math.random().toString(36).slice(-6) // ファイル名重複回避のためのやつ
      this.file3.image = await this.compressImage(e.target.files[0], 'image', key)
      this.file3.thumbnail = await this.compressImage(e.target.files[0], 'thumbnail', key)
      this.form.stampIconPreview = URL.createObjectURL(this.file3.image)
      this.imageLoading = false
    },
    async select_file4 (e, index) {
      // ファイル選択後の処理
      this.imageLoading = true
      const key = Math.random().toString(36).slice(-6) // ファイル名重複回避のためのやつ
      this.form.menu[index].image = await this.compressImage(e.target.files[0], 'image', key)
      this.form.menu[index].imagePreview = URL.createObjectURL(this.form.menu[index].image)
      console.log(this.form.menu[index])
      this.imageLoading = false
      this.imageUploaded = false
    },
    createTimestamp () {
      // 写真のタイムスタンプを作成
      const d = new Date() // Today
      const DateTimeFormat = 'YYYYMMDD_hhmiss' // "2019/10/04 12:34:56" -> "20191004_123456"
      return DateTimeFormat
        .replace(/YYYY/g, String(d.getFullYear()))
        .replace(/MM/g, ('0' + (d.getMonth() + 1)).slice(-2))
        .replace(/DD/g, ('0' + d.getDate()).slice(-2))
        .replace(/hh/g, ('0' + d.getHours()).slice(-2))
        .replace(/mi/g, ('0' + d.getMinutes()).slice(-2))
        .replace(/ss/g, ('0' + d.getSeconds()).slice(-2))
    },
    compressImage (file, type, key) {
      const filename = this.createTimestamp() + key
      // 画像の圧縮
      let width = 720
      let height = 720
      if (type === 'thumbnail') {
        width = 256
        height = 256
      }
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-new
        new Compressor(file, {
          convertSize: 50000,
          maxHeight: height,
          maxWidth: width,
          success (result) {
            let file = null
            if (type === 'thumbnail') {
              file = new File([result], 'thumbnail_' + filename, { type: 'image/jpeg' })
            } else {
              file = new File([result], filename, { type: 'image/jpeg' })
            }
            console.log(file)
            resolve(file)
          },
          error (err) {
            console.log(err.message)
          }
        })
      })
    },
    uploadImage (id) {
      // 画像をfirebase storageアップロード
      this.upload = true
      const oldPath = this.form.deletePath
      if (this.file.image) {
        if (this.file.image.size / 1000 > 1000) {
          this.$bvToast.toast(`ファイルサイズが大きすぎます(${this.file.size / 1000} KB)`, { variant: 'danger' })
          this.upload = false
        } else {
          const uploader = [this.file.image, this.file.thumbnail]
          if (this.file.image.size / 1000 > 1000) {
            this.$bvToast.toast(`ファイルサイズが大きすぎます(${this.file.size / 1000} KB)`, { variant: 'danger' })
          } else {
            let promises = []
            promises = uploader.map((img, index) => {
              const url = `stamprally/${this.$store.getters.selectedStamprally}/stamps/` + img.name
              const storageRef = ref(getStorage(), url)
              this.file.storagePath.push(url)
              this.form.deletePath = this.file.storagePath
              return uploadBytesResumable(storageRef, img)
                .then(snapshot => getDownloadURL(snapshot.ref))
                .catch(error => console.log(error.message))
            })
            Promise.all(promises).then((URLlist) => {
              this.form.image = URLlist
              let promises = []
              if (oldPath && oldPath.length) {
                promises = oldPath.map((img, index) => {
                  const storageRef = ref(getStorage(), img)
                  return deleteObject(storageRef)
                    .catch(error => console.log(error.message))
                })
                Promise.all(promises).then(() => {
                  this.uploadImage2(id)
                })
              } else {
                this.uploadImage2(id)
              }
            }).catch((error) => {
              console.log(error.message)
            })
          }
        }
      } else {
        this.uploadImage2(id)
      }
    },
    uploadImage2 (id) {
      // 画像をfirebase storageアップロード
      this.upload = true
      if (this.file2.image.length) {
        const uploader = this.file2.image
        let promises = []
        promises = uploader.map((img, index) => {
          const url = `stamprally/${this.$store.getters.selectedStamprally}/stamps/` + img.name
          const storageRef = ref(getStorage(), url)
          this.file2.storagePath.push(url)
          this.form.deletePath2.push(url)
          return uploadBytesResumable(storageRef, img)
            .then(snapshot => getDownloadURL(snapshot.ref))
            .catch(error => console.log(error.message))
        })
        Promise.all(promises).then((URLlist) => {
          this.form.image2 = URLlist
          this.uploadImage3(id)
        }).catch((error) => {
          console.log(error.message)
        })
      } else {
        this.uploadImage3(id)
      }
    },
    uploadImage3 (id) {
      // 画像をfirebase storageアップロード
      this.upload = true
      const oldPath = this.form.deletePath3
      if (this.file3.image) {
        if (this.file3.image.size / 1000 > 1000) {
          this.$bvToast.toast(`ファイルサイズが大きすぎます(${this.file3.size / 1000} KB)`, { variant: 'danger' })
          this.upload = false
        } else {
          const uploader = [this.file3.image, this.file3.thumbnail]
          if (this.file3.image.size / 1000 > 1000) {
            this.$bvToast.toast(`ファイルサイズが大きすぎます(${this.file.size / 1000} KB)`, { variant: 'danger' })
          } else {
            let promises = []
            promises = uploader.map((img, index) => {
              const url = `stamprally/${this.$store.getters.selectedStamprally}/stamps/` + img.name
              const storageRef = ref(getStorage(), url)
              this.file3.storagePath.push(url)
              this.form.deletePath3 = this.file3.storagePath
              return uploadBytesResumable(storageRef, img)
                .then(snapshot => getDownloadURL(snapshot.ref))
                .catch(error => console.log(error.message))
            })
            Promise.all(promises).then((URLlist) => {
              this.form.stampIcon = URLlist
              if (oldPath && oldPath.length) {
                oldPath.map((img, index) => {
                  const storageRef = ref(getStorage(), img)
                  return deleteObject(storageRef)
                    .catch(error => console.log(error.message))
                })
              } else {
                this.uploadStamp(id)
              }
            }).catch((error) => {
              console.log(error.message)
            })
          }
        }
      } else {
        this.uploadStamp(id)
      }
    },
    uploadImage4 (id, x) {
      // 画像をfirebase storageアップロード
      const oldPath = this.form.menu[x].path
      if (this.form.menu[x].image) {
        if (this.form.menu[x].image.size / 1000 > 1000) {
          this.$bvToast.toast(`ファイルサイズが大きすぎます(${this.file.size / 1000} KB)`, { variant: 'danger' })
        } else {
          const uploader = [this.form.menu[x].image]
          if (this.form.menu[x].image.size / 1000 > 1000) {
            this.$bvToast.toast(`ファイルサイズが大きすぎます(${this.file.size / 1000} KB)`, { variant: 'danger' })
          } else {
            let promises = []
            promises = uploader.map((img, index) => {
              const url = `stamprally/${this.$store.getters.selectedStamprally}/stamps/` + img.name
              const storageRef = ref(getStorage(), url)
              this.form.menu[x].path = url
              return uploadBytesResumable(storageRef, img)
                .then(snapshot => getDownloadURL(snapshot.ref))
                .catch(error => console.log(error.message))
            })
            Promise.all(promises).then((URLlist) => {
              this.form.menu[x].image = URLlist
              if (oldPath && oldPath.length) {
                const storageRef = ref(getStorage(), oldPath)
                try {
                  deleteObject(storageRef)
                } catch (error) {
                  console.error(error.message)
                }
              }
            }).catch((error) => {
              console.log(error.message)
            })
          }
        }
      }
      this.imageUploaded = true
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
    createStamp () {
      // スタンプの新規作成
      const newId = this.createId(20)
      this.edit = newId
      const data = {
        id: newId,
        name: '新しいスポット',
        status: 'new',
        user: this.$store.getters.userInfo.name,
        location: new firebase.firestore.GeoPoint(this.initialLocation.lat, this.initialLocation.lng),
        radius: 0,
        display: 1,
        invisible: 0,
        icon: 'spot',
        description: [],
        URL: '',
        type: 'QR',
        course: '',
        facility: [],
        hours: { date: [], detail: '' },
        twitter: '',
        instagram: '',
        youtube: '',
        image: '',
        image2: [],
        stampIcon: '',
        quizAvailable: false,
        menuAvailable: false,
        quiz: [{
          question: '',
          answer: [{ text: '', value: 1 }, { text: '', value: 0 }, { text: '', value: 0 }, { text: '', value: 0 }],
          description: ''
        }],
        menu: [{
          image: null,
          imagePreview: null,
          path: '',
          name: '',
          price: '',
          description: ''
        }],
        path: [],
        path2: [],
        path3: [],
        stamprallyId: this.$store.getters.selectedStamprally
      }
      this.$set(this.stamps, newId, data)
      this.openInfo(newId)
    },
    async uploadStamp (id) {
      // firestoreにスタンプ情報をアップロード
      for (let i = 0; i < this.form.quiz.length; i++) {
        this.form.quiz[i].description = this.stringToArray(this.form.quiz[i].description)
      }
      for (let i = 0; i < this.form.menu.length; i++) {
        this.form.menu[i].description = this.stringToArray(this.form.menu[i].description)
      }
      for (let i = 0; i < this.form.menu.length; i++) {
        if (this.form.menu[i].image) {
          this.form.menu[i].image = this.arrayToString(this.form.menu[i].image)
        }
      }
      let thumb = ''
      let thumb2 = ''
      if (this.form.image[1]) {
        thumb = this.form.image[1]
      }
      if (this.form.stampIcon[1]) {
        thumb2 = this.form.stampIcon[1]
      }
      const data = {
        name: this.form.name,
        user: this.$store.getters.userInfo.name,
        id,
        location: new firebase.firestore.GeoPoint(Number(this.form.lat), Number(this.form.lng)),
        display: Number(this.form.isStamp),
        invisible: Number(this.form.invisible),
        icon: this.form.icon,
        description: this.stringToArray(this.form.description),
        radius: this.form.radius,
        type: this.form.QRorGPS,
        facility: this.form.facility,
        hours: {
          date: this.form.hours.date,
          detail: this.stringToArray(this.form.hours.detail)
        },
        URL: this.form.url,
        twitter: this.form.twitter,
        instagram: this.form.instagram,
        youtube: this.form.youtube,
        image: this.form.image[0],
        stampIcon: this.form.stampIcon[0],
        thumbnail: thumb,
        thumbnail2: thumb2,
        path: this.form.deletePath,
        path2: this.form.deletePath2,
        path3: this.form.deletePath3,
        quizAvailable: this.form.quizAvailable,
        menuAvailable: this.form.menuAvailable,
        quiz: this.form.quiz,
        menu: this.form.menu,
        stamprallyId: this.$store.getters.selectedStamprally
      }
      for (let i = 0; i < this.form.quiz.length; i++) {
        this.form.quiz[i].description = this.arrayToString(this.form.quiz[i].description)
      }
      for (let i = 0; i < this.form.menu.length; i++) {
        this.form.menu[i].description = this.arrayToString(this.form.menu[i].description)
      }
      if (this.stamps[id].status === 'new') {
        this.$set(data, 'created', new Date())
      } else {
        this.$set(data, 'updated', new Date())
      }
      await this.syncCourseInfo(id, 'update')
      await firestore
        .collection('stamps')
        .doc(id)
        .set(data, { merge: true })
      const n = this.form.image2.length
      for (let i = 0; i < n; i++) {
        await firestore
          .collection('stamps')
          .doc(id)
          .update({
            image2: firebase.firestore.FieldValue.arrayUnion(this.form.image2[i])
          })
      }
      this.form.image2 = this.stamps[id].image2
      this.file = { image: null, thumbnail: null, storagePath: [] }
      this.file2 = { image: [], storagePath: [] }
      this.file3 = { image: null, thumbnail: null, storagePath: [] }
      if (this.stamps[id].status === 'new') {
        this.$bvToast.toast(this.form.name + ' を追加しました。', {
          variant: 'info'
        })
      } else {
        this.$bvToast.toast(this.form.name + ' を変更しました。', {
          variant: 'info'
        })
      }
      this.upload = false
    },
    openModal (id, mode) {
      // ポップアップ表示（削除・編集用URL）
      if (mode === 'delete') {
        this.editId = id
        this.$bvModal.show('deleteS')
      }
      if (mode === 'editUrl') {
        this.editId = id
        this.isEditUrl = !!this.stamps[id].editURL
        this.$bvModal.show('editUrlSetting')
      }
    },
    async createEditUrl (id) {
      // 編集用URLの生成
      const newId = this.createId(36)
      const url = location.origin + `/edit/${id}_${newId}`
      console.log(url)
      await firestore
        .collection('stamps')
        .doc(id)
        .set({
          editURL: { url, date: new Date() }
        }, { merge: true })
      if (this.isEditUrl) {
        this.$bvModal.hide('editUrlSetting')
        this.$bvModal.hide('reNewEditUrl')
        this.$bvToast.toast('編集用URLを再発行しました．', {
          variant: 'info'
        })
      } else {
        this.$bvModal.hide('editUrlSetting')
        this.$bvModal.hide('makeEditUrl')
        this.$bvToast.toast('編集用URLを発行しました．', {
          variant: 'info'
        })
      }
    },
    copyURL (url) {
      // URLをクリップボードにコピー
      navigator.clipboard.writeText(url)
        .then(() => {
          this.$bvToast.toast('クリップボードにコピーしました．', {
            variant: 'info'
          })
        })
        .catch((e) => {
          console.error(e)
        })
    },
    deleteStamp (id) {
      // スタンプの削除
      this.$bvModal.hide('deleteS')
      let promises = []
      if (this.stamps[id].path && this.stamps[id].path.length) {
        promises = this.stamps[id].path.map((img, index) => {
          const storageRef = ref(getStorage(), img)
          return deleteObject(storageRef)
            .catch(error => console.log(error.message))
        })
        Promise.all(promises).then(() => this.deleteStampInfo(id))
          .catch((error) => {
            console.log(error.message)
          })
      } else { this.deleteStampInfo(id) }
    },
    deleteImage (id) {
      // 画像だけ削除
      let promises = []
      if (this.form.deletePath && this.form.deletePath.length) {
        promises = this.form.deletePath.map((img, index) => {
          const storageRef = ref(getStorage(), img)
          return deleteObject(storageRef)
            .catch(error => console.log(error.message))
        })
        Promise.all(promises).then(async () => {
          await firestore
            .collection('stamps')
            .doc(id)
            .set({
              path: [],
              image: '',
              thumbnail: ''
            }, { merge: true })
          this.form.image = ['', '']
          this.$bvToast.toast('画像を削除しました．', {
            variant: 'info'
          })
          this.openInfo(id)
        })
      }
    },
    deleteImage2 (id, index) {
      // 画像だけ削除
      if (this.form.deletePath2.length) {
        const storageRef = ref(getStorage(), this.form.deletePath2[index])
        return deleteObject(storageRef).then(async () => {
          await firestore
            .collection('stamps')
            .doc(id)
            .update({
              image2: firebase.firestore.FieldValue.arrayRemove(this.form.image2[index]),
              path2: firebase.firestore.FieldValue.arrayRemove(this.form.deletePath2[index])
            })
          this.form.image2 = this.form.image2.splice(index, 1)
          this.form.deletePath2 = this.form.deletePath2.splice(index, 1)
          this.$bvToast.toast('画像を削除しました．', {
            variant: 'info'
          })
          this.openInfo(id)
        })
      }
    },
    deleteImage3 (id) {
      // 画像だけ削除
      let promises = []
      if (this.form.deletePath3 && this.form.deletePath3.length) {
        promises = this.form.deletePath3.map((img, index) => {
          const storageRef = ref(getStorage(), img)
          return deleteObject(storageRef)
            .catch(error => console.log(error.message))
        })
        Promise.all(promises).then(async () => {
          await firestore
            .collection('stamps')
            .doc(id)
            .set({
              path3: [],
              stampIcon: '',
              thumbnail2: ''
            }, { merge: true })
          this.form.stampIcon = ['', '']
          this.$bvToast.toast('画像を削除しました．', {
            variant: 'info'
          })
          this.openInfo(id)
        })
      }
    },
    async deleteImage4 (id, index) {
      // 画像だけ削除
      if (this.form.menu[index].path && this.form.menu[index].path.length) {
        const storageRef = ref(getStorage(), this.form.menu[index].path)

        try {
          await deleteObject(storageRef) // 非同期操作の完了を待つ
          this.form.menu[index].image = null
          this.form.menu[index].imagePreview = null
          this.form.menu[index].path = ''
          this.$bvToast.toast('画像を削除しました．', {
            variant: 'info'
          })
        } catch (error) {
          console.error(error.message)
        }
      }
    },
    async deleteStampInfo (id) {
      // firestoreからスタンプ情報を削除
      const deleteName = this.stamps[id].name
      await firestore
        .collection('stamps')
        .doc(id)
        .delete()
      await this.syncCourseInfo(id, 'delete')
      this.$delete(this.stamps, id)
      this.editId = null
      this.form = {
        name: '',
        lat: 0,
        lng: 0,
        radius: 0,
        isStamp: false,
        invisible: false,
        icon: 'spot',
        description: '',
        QRorGPS: 'QR',
        url: '',
        facility: [],
        hours: { date: [], detail: '' },
        twitter: '',
        instagram: '',
        youtube: '',
        image: ['', ''],
        imagePreview: null,
        image2: [],
        image2Preview: [],
        stampIcon: ['', ''],
        stampIconPreview: '',
        quizAvailable: false,
        menuAvailable: false,
        quiz: [{
          question: '',
          answer: [{ text: '', value: 1 }, { text: '', value: 0 }, { text: '', value: 0 }, { text: '', value: 0 }],
          description: ''
        }],
        menu: [{
          image: null,
          imagePreview: null,
          path: '',
          name: '',
          price: '',
          discount: false,
          discountPrice: '',
          description: ''
        }],
        deletePath: '',
        deletePath2: [],
        deletePath3: ''
      }
      this.markerPos = null
      this.initialLocation = { lng: 130.27, lat: 33.3 }
      this.zoom = 17
      this.edit = null
      this.file = { image: null, thumbnail: null }
      this.file2 = { image: [] }
      this.file3 = { image: null, thumbnail: null }
      this.$bvToast.toast(deleteName + ' を削除しました。', {
        variant: 'info'
      })
    },
    async syncCourseInfo (id, type) {
      // スタンプ情報をコース情報に反映
      const courses = await Firestore.CourseArrayInStamps(id)
      const courseArray = Object.entries(courses)
      for (let i = 0; i < courseArray.length; i++) {
        if (type === 'delete') {
          const index = courseArray[i][1].stamps.indexOf(id)
          courseArray[i][1].stamps.splice(index, 1)
          courseArray[i][1].path.splice(index, 1)
          await firestore
            .collection('course')
            .doc(courseArray[i][1].id)
            .update({
              path: courseArray[i][1].path,
              stamps: courseArray[i][1].stamps
            })
        } else if (type === 'update') {
          if (this.form.lat !== this.stamps[id].location._lat || this.form.lng !== this.stamps[id].location._long) {
            const index = courseArray[i][1].stamps.indexOf(id)
            courseArray[i][1].path[index].lat = this.form.lat
            courseArray[i][1].path[index].lng = this.form.lng
            await firestore
              .collection('course')
              .doc(courseArray[i][1].id)
              .update({
                path: courseArray[i][1].path
              })
          }
        }
      }
    },
    showQr (id) {
      // スタンプQRコードの表示
      this.qrCode = id
    },
    downloadQr (name) {
      // スタンプQRコードのダウンロード
      const canvas = document.getElementById('qrimg')
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
      link.download = name
      link.click()
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 10px
}
::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, .3);
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, .3);
}
label {
  font-size: 14px;
}
.fontConf {
  font-family: 'Noto Sans JP', sans-serif !important;
}

</style>
