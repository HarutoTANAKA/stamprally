<template>
  <!--インフォメーション（ユーザ）-->
  <body class="mx-1">
    <b-container fluid>
      <b-row v-if="loaded">
        <b-col>
          <h3 class="mb-4">
            インフォメーション
          </h3>
          <div class="mt-4">
            <h4 v-b-toggle="'kiyaku'" class="menu">
              利用規約
            </h4>
            <b-collapse id="kiyaku" style="color: #333333">
              <b-card style="height: 30rem; overflow: auto">
                <p style="font-size: 12px">
                  この利用規約（以下、「本規約」といいます）は、スタンプラリーアプリ（以下、「本アプリ」といいます）の利用規約です。
                  参加されるユーザーの皆様（以下、「ユーザー」といいます）には、本規約に従ってサービスをご利用いただきます。
                </p>
                <h6>第1条（適用）</h6>
                <p style="font-size: 12px">
                  1：本規約は、合同会社ロケモAI（以下、「当社」といいます）が本アプリを提供するにあたり、当社とユーザーとの一切の関係適用されます。
                </p>
                <p style="font-size: 12px">
                  2：ユーザーは、本アプリを利用することにより、本規約のすべての記載内容に同意したものとみなされます。
                </p>
                <p style="font-size: 12px">
                  3：当社は、本アプリに関して、本規約とは別に、ご利用にあたってのルール等（以下、「個別規定」といいます）を定める場合があります。
                  その場合、ユーザーは、個別規定にも従って本アプリを利用しなければいけません。
                </p>
                <p style="font-size: 12px">
                  4：前項の個別規定が本規約の規定と矛盾する場合、矛盾する箇所に限り、個別規定の内容が優先して適用されます。
                </p>
                <h6>第2条（利用登録）</h6>
                <p style="font-size: 12px">
                  1：本アプリは、本規約に同意の上、当社の定める方法でユーザー登録を行うことにより利用することができます。
                </p>
                <p style="font-size: 12px">
                  2：当社は、登録されたユーザーに以下の事由があると判断した場合、予告なくユーザー登録を解除することができるものとします。<br><br>
                  &nbsp;1．登録者が存在しない場合<br>
                  &nbsp;2．本規約に違反したことがある者空の登録である場合<br>
                  &nbsp;3．その他、当社がユーザーとして適切ではないと判断した場合<br>
                </p>
                <h6>第3条（禁止事項）</h6>
                <p style="font-size: 12px">
                  ユーザーは、本アプリの利用にあたり、以下の行為をしてはなりません。<br><br>
                  &nbsp;1．法令または公序良俗に違反する行為<br>
                  &nbsp;2．犯罪行為に関連する行為<br>
                  &nbsp;3．本アプリの内容等、本アプリに含まれる著作権、商標権ほか知的財産権を侵害する行為<br>
                  &nbsp;4．当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為<br>
                  &nbsp;5．当社のアプリの運営を妨害するおそれのある行為<br>
                  &nbsp;6．不正アクセスをし、またはこれを試みる行為<br>
                  &nbsp;7．他のユーザーに関する個人情報等を収集または蓄積する行為<br>
                  &nbsp;8．ユーザーの現在位置を含む、個人情報等を偽装する、またはそれを試みる行為<br>
                  &nbsp;9．他のユーザーになりすます行為<br>
                  &nbsp;10．当社のアプリに関連して、反社会的勢力に対して直接または間接に利益を供与する行為<br>
                  &nbsp;11．その他、当社が不適切と判断する行為
                </p>
                <h6>第4条（本アプリの変更、終了）</h6>
                <p style="font-size: 12px">
                  1：当社は、予告なく、当社の都合により、本アプリの変更または提供の終了をすることができます。
                </p>
                <p style="font-size: 12px">
                  2：当社は、本条に基づき当社が行った措置によりユーザーに生じた損害について一切の責任を負いません。
                </p>
                <h6>第5条（利用環境等）</h6>
                <p style="font-size: 12px">
                  ユーザーは、本アプリを利用するにあたり、必要なスマートフォン、通信機器、通信手段及び電力等を、ユーザーの費用と責任で用意するものとします。
                </p>
                <h6>第6条（保証の認否及び免責事項）</h6>
                <p style="font-size: 12px">
                  1：当社は、本アプリに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに
                  関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                </p>
                <p style="font-size: 12px">
                  2：当社は、本アプリに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。
                </p>
                <p style="font-size: 12px">
                  3：当社は、本アプリに関して、ユーザーと他のユーザーまたは第三者との間に生じた取引、連絡または紛争等において一切責任を負いません。
                </p>
                <h6>第7条（利用規約の変更）</h6>
                <p style="font-size: 12px">
                  当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
                  なお、本規約の変更後、本アプリの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
                </p>
                <h6>第8条（個人情報の取扱い）</h6>
                <p style="font-size: 12px;">
                  当社は、本アプリの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。
                </p>
                <h6>第9条（準拠法・裁判管轄）</h6>
                <p style="font-size: 12px">
                  1：本規約の解釈にあたっては、日本法を準拠法とします。
                </p>
                <p style="font-size: 12px">
                  2：本アプリに関して紛争が生じた場合には、当社の所在地を管轄する裁判所を専属的合意管轄とします。
                </p>
              </b-card>
            </b-collapse>
          </div>
          <div class="mt-3">
            <h4 v-b-toggle="'privacy'" class="menu">
              プライバシーポリシー
            </h4>
            <b-collapse id="privacy">
              <b-card style="height: 30rem; overflow: auto">
                <p style="font-size: 12px">
                  合同会社ロケモAI（以下、「当社」といいます）は、スタンプラリーアプリ（以下、「本アプリ」といいます）における，，個人情報の取り扱いについて、
                  以下の通りプライバシーポリシー（以下、「本ポリシー」といいます）を定めます。
                </p>
                <h6>第1条（個人情報）</h6>
                <p style="font-size: 12px">
                  「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先
                  その他の記述等により特定の個人を識別できる情報（個人識別情報）を指します。
                </p>
                <h6>第2条（Cookie・IPアドレス及び位置情報）</h6>
                <p style="font-size: 12px">
                  当社は、Cookie・IPアドレス及び位置情報については、それら単独では特定の個人を識別することができないため、個人情報とは考えておりません。
                  ただしこれらの情報と個人情報が一体となって使用される場合にはこれらの情報も個人情報とみなします。
                </p>
                <h6>第3条（個人情報を収集・利用する目的）</h6>
                <p style="font-size: 12px">
                  当社が個人情報を収集・利用する目的は以下の通りです。<br><br>
                  &nbsp;1．本アプリの提供・運営のため<br>
                  &nbsp;2．ユーザーから応募いただいた景品の送付のため<br>
                  &nbsp;3．利用規約に違反したユーザーや、不正・不当な目的でアプリを利用しようとするユーザーの特定をし、ご利用をお断りするため<br>
                  &nbsp;4．上記の利用目的に付随する目的
                </p>
                <h6>第4条（個人情報の第三者提供）</h6>
                <p style="font-size: 12px">
                  当社は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ずに、個人情報を第3者に提供しません。<br><br>
                  &nbsp;1．法令に基づく場合<br>
                  &nbsp;2．人の生命、身体または財産の保護のために必要がある場合であって、ご本人の同意を得ることが困難なとき<br>
                  &nbsp;3，公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、ご本人の同意を得ることが困難なとき<br>
                  &nbsp;4．国の機関もしくは地方公共団体またはその委託を受けたも者が法令の定める事務を遂行することに対して協力する必要がある場合であって、
                  ご本人の同意を得ることが困難なとき<br>
                  &nbsp;5．あらかじめ次の事項を告知あるいは公表をしている場合<br><br>
                  &emsp;・利用目的に第三者への提供を含むこと<br>
                  &emsp;・第三者に提供されるデータの項目<br>
                  &emsp;・第三者への提供の手段または方法<br>
                  &emsp;・ご本人の求めに応じて個人情報の第三者への提供を停止すること
                </p>
                <p style="font-size: 12px">
                  ただし、次に掲げる場合は上記に定める第三者には該当しません。<br><br>
                  &nbsp;1．当社が利用目的の達成に必要な範囲内において個人情報の取り扱いの全部または一部を委託する場合<br>
                  &nbsp;2．合併その他の事由による事業の継承に伴って個人情報が提供される場合<br>
                  &nbsp;3．個人情報を特定の者との間で共有して利用する場合であって、その旨並びに共同して利用される個人情報の項目、共同して利用する者の範囲、
                  利用する者の利用目的及び該当個人情報の管理について責任を有する者の氏名又は名称について、あらかじめご本人に通知し、またはご本人が容易に知り得る状態に置いているとき<br>
                </p>
                <h6>第5条（個人情報の開示）</h6>
                <p style="font-size: 12px">
                  当社は、ユーザーから個人情報の開示を求められた時は、ご本人の求めに応じて遅滞なく回答します。ただし、開示することにより次のいずれかに該当する場合は、
                  その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。<br><br>
                  &nbsp;1．本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合<br>
                  &nbsp;2．当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合<br>
                  &nbsp;3．その他法令に違反することとなる場合<br><br>
                  前項の定めに関わらず、履歴情報および特性情報などの個人情報以外の情報については、原則として開示いたしません。
                </p>
                <h6>第6条（個人情報の訂正及び削除）</h6>
                <p style="font-size: 12px">
                  ユーザーは、当社が保有する個人情報について、個人情報が誤りであるという理由によって、内容の訂正、追加または削除を請求することができます。
                  当社は、他の法令の規定により特別な手続きが定められている場合を除き、利用目的の達成に必要な範囲内において、遅滞なく必要な調査を行い、その結果に基づき、
                  個人情報の内容の訂正を行い、その旨ご本人に通知します。
                </p>
                <h6>第7条（個人情報の利用停止等）</h6>
                <p style="font-size: 12px">
                  当社は、ご本人から、ご本人の個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、
                  その利用の停止または消去（以下、「利用停止等」といいます）を求められた場合には、遅滞なく必要な調査を行い、その結果に基づき、個人情報の利用停止等を行い、その旨ご本人に通知します。
                  ただし、個人情報の利用停止等に多額の費用を有する場合その他利用停止等を行うことが困難な場合であって、ご本人の権利利益を保護するために必要なこれに代わるべき措置をとれる場合は、
                  この代替策を講じます。
                </p>
                <h6>第8条（プライバシーポリシーの変更）</h6>
                <p style="font-size: 12px">
                  本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。また、
                  当社が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
                </p>
              </b-card>
            </b-collapse>
          </div>
          <div v-if="$store.getters.currentStamprally.inquiry" class="mt-3">
            <h4 v-b-toggle="'ask'" class="menu">
              主催者お問い合わせ
            </h4>
            <b-collapse id="ask">
              <b-card>
                <h6 v-if="$store.getters.currentStamprally.inquiry.phone.length">
                  {{ $store.getters.currentStamprally.inquiry.name }}
                </h6>
                <p v-if="$store.getters.currentStamprally.inquiry.phone.length" style="font-size: 14px">
                  TEL: {{ $store.getters.currentStamprally.inquiry.phone }}
                </p>
                <p v-if="$store.getters.currentStamprally.inquiry.mail.length" style="font-size: 14px">
                  メール: {{ $store.getters.currentStamprally.inquiry.mail }}
                </p>
              </b-card>
            </b-collapse>
          </div>
        </b-col>
      </b-row>
      <b-row style="margin-top: 10px">
        <b-col>
          <div class="text-center p-auto">
            <p class="mx-auto" style="font-size: 12px;">
              (C) 2022 合同会社ロケモAI
            </p>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </body>
</template>

<script>
import { faEnvelope, faListAlt } from '@fortawesome/free-regular-svg-icons'

export default {
  name: 'InfoUser',
  data () {
    return {
      loaded: true,
      state: null
    }
  },
  computed: {
    faEnvelope () {
      return faEnvelope
    },
    faListAlt () {
      return faListAlt
    }
  },
  methods: {
  }
}
</script>

<style scoped>
body {
  font-family: 'Noto Sans JP', sans-serif;
  padding-top: 75px;
  margin-bottom: 180px;
  color: #333333
}
.menu:active,
.menu:hover,
.menu:focus {
  outline:none
}
</style>
