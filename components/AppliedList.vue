<template>
  <!--景品に応募した人のリスト-->
  <b-container class="py-2" style="border-radius: 3px; height: 88vh; overflow: scroll">
    <b-row>
      <b-col class="my-3">
        <b-table if="loaded" hover :items="userslist" :fields="fields" style="max-height: 600px" />
      </b-col>
    </b-row>
    <b-row class="my-4">
      <b-col class="text-center">
        <h3 v-if="!userslist.length">
          現在、表示できるものがありません。
        </h3>
        <b-button v-else variant="primary" @click="downloadCSV(userslist)">
          CSVダウンロード
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { firestore } from '../plugin/firebase'

export default {
  name: 'AppliedList',
  data () {
    return {
      loaded: false,
      userslist: [],
      fields: [
        {
          key: 'name',
          label: '氏名'
        },
        {
          key: 'zip',
          label: '郵便番号',
          sortable: true
        },
        {
          key: 'address',
          label: '住所'
        },
        {
          key: 'phone',
          label: '電話番号'
        },
        {
          key: 'prize',
          label: '景品',
          sortable: true
        },
        {
          key: 'date',
          label: '申込日時',
          sortable: true
        }
      ],
      csvData: ''
    }
  },
  watch: {
    appliedUsers (newData) {
      console.log(newData)
    }
  },
  async created () {
    // Firestoreから応募者情報の取得
    const _this = this
    await firestore
      .collection('appliedUsers')
      .where('stamprally', '==', this.$store.getters.selectedStamprally)
      .orderBy('date')
      .onSnapshot(function (querySnapshot) {
        _this.userslist = []
        querySnapshot.forEach(function (doc) {
          if (doc.data().type !== 'ticket') {
            _this.userslist.push({
              name: doc.data().userName,
              zip: doc.data().zip,
              address: doc.data().address,
              phone: doc.data().phone,
              prize: doc.data().prizeName,
              date: _this.timeConverter(doc.data().date.seconds * 1000)
            })
          }
        })
      })
  },
  methods: {
    timeConverter (time) {
      // 時間の表示形式の返還
      const Time = new Date(time)
      const year = Time.getFullYear()
      const month = 1 + Time.getMonth()
      const day = Time.getDate()
      const hour = Time.getHours()
      const minute = Time.getMinutes()
      let format = 'YYYY/MM/DD hh:mm'
      format = format.replace(/YYYY/g, year)
      format = format.replace(/MM/g, month)
      format = format.replace(/DD/g, day)
      format = format.replace(/hh/g, hour)
      format = format.replace(/mm/g, minute)
      return format
    },
    downloadCSV (users) {
      // リストをCSVでダウンロード
      const filename = '景品応募者リスト.csv'
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
      for (let i = 0; i < users.length; i++) {
        this.csvData += users[i].name + ',' + users[i].zip + ',' + users[i].address +
          ',' + users[i].phone + ',' + users[i].prize.toString() +
          ',' + users[i].date + '\n'
      }
      const blob = new Blob([bom, this.csvData], { type: 'text/csv' })
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        const url = (window.URL || window.webkitURL).createObjectURL(blob)
        const download = document.createElement('a')
        download.href = url
        download.download = filename
        download.click();
        (window.URL || window.webkitURL).revokeObjectURL(url)
      }
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
</style>
