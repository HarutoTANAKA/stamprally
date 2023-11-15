<template>
  <!--統計情報の表示（コンソール）-->
  <b-container class="my-0" style="height: 88vh; overflow: scroll">
    <b-row class="d-flex align-items-end">
      <b-col class="col-md-8 col-xs-12 my-3" align-self="stretch">
        <div class="d-flex">
          <b-card class="shadow-sm col-md-4 col-xs-12 mr-3" style="border: none">
            <div class="d-flex align-items-end">
              <div>
                <h4 class="mr-auto">
                  ユーザー総数
                </h4>
                <h4 style="font-size: 45px">
                  {{ usersLength }}
                </h4>
              </div>
            </div>
          </b-card>
          <b-card class="shadow-sm ml-3 col-xs-12 ml-auto" style="border: none">
            <div class="d-flex align-items-end">
              <div>
                <h4 class="mr-auto">
                  アクティブユーザー（過去24時間）
                </h4>
                <h4 v-if="loaded" style="font-size: 45px">
                  {{ activeUserNum }}
                </h4>
              </div>
            </div>
          </b-card>
        </div>
        <b-card class="shadow-sm col-xs-12 mt-4" style="border: none">
          <div>
            <div class="d-flex align-items-center">
              <h4 class="mr-4">
                市町別
              </h4>
              <b-button
                v-if="otherRegions.length"
                variant="outline-primary"
                size="sm"
                class="ml-auto"
                style="border: none"
                @click="$bvModal.show('otherRegion')"
              >
                その他の内訳を見る
              </b-button>
            </div>
            <bar-chart v-if="loaded" :chart-data="regionData" :options="barOptions" class="pr-2" style="height: 237px" />
          </div>
        </b-card>
      </b-col>
      <b-col class="col-md-4 my-3 col-xs-12" align-self="stretch">
        <div>
          <b-card class="shadow-sm" style="border: none">
            <div>
              <h4 class="mr-4">
                年代別
              </h4>
              <doughnut-chart v-if="loaded" :chart-data="ageData" :options="doughnutOptions" />
            </div>
          </b-card>
        </div>
      </b-col>
    </b-row>
    <b-row class="mb-3 d-flex align-items-end">
      <b-col class="col-md-12 col-xs-12 my-3" align-self="stretch">
        <div class="d-flex">
          <b-card class="shadow-sm col-md-12 col-xs-12" style="border: none">
            <div>
              <div class="d-flex align-items-center">
                <h4 class="mr-3">
                  日付別新規ユーザー
                </h4>
                <div class="d-flex">
                  <div v-for="month in dateSetting.termMonth" :key="month.index">
                    <b-button v-if="selectedMonth === month" class="btneffect" style="background-color: rgba(0, 0, 0, 0); color: #007bff" variant="primary">{{ month[1] + 1 }}月</b-button>
                    <b-button v-else variant="outline-primary" class="btneffect" style="background-color: rgba(0, 0, 0, 0); color: #757575" @click="handler(4, month)">{{ month[1] + 1 }}月</b-button>
                  </div>
                </div>
              </div>
              <line-chart v-if="loaded && lineLoaded" :chart-data="dateData" :options="lineOptions" />
            </div>
          </b-card>
        </div>
      </b-col>
    </b-row>
    <b-modal id="otherRegion" centered hide-footer>
      <template #modal-title>その他の内訳</template>
      <div class="p-3" style="font-family: 'Noto Sans JP', sans-serif !important;">
        <div v-for="(region, index) in otherRegions" :key="index" class="py-2">
          <div class="d-flex align-items-center justify-content-center">
            <span class="col-6">{{ region.name.split(':')[1] }}</span>
            <span class="col-2">{{ region.num }}</span>
          </div>
        </div>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { firestore } from '../plugin/firebase'
import Firestore from '~/plugin/firestore'

export default {
  name: 'Statistics',
  data () {
    return {
      loaded: false,
      lineLoaded: false,
      users: {},
      usersLength: 0,
      stamprallyData: {},
      selectedMonth: null,
      activeUserNum: 0,
      regionDataValues: [],
      otherRegions: [],
      ageDataValues: [],
      dateDataValues: [],
      dateSetting: {
        current: new Date(),
        start: null,
        end: null,
        termMonth: []
      },
      doughnutOptions: {
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic'
        },
        responsive: true
      },
      barOptions: {
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic'
        },
        responsive: true,
        scales: {
          xAxes: [{
            stacked: true,
            ticks: {
              display: false
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            stacked: true,
            categoryPercentage: 1.0,
            barPercentage: 0.3,
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: false
            }
          }]
        }
      },
      lineOptions: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MM/D'
              }
            }
          }],
          yAxes: [{
            ticks: {
              min: 0
            }
          }]
        }
      },
      chartColors: [
        '#332288',
        '#88CCEE',
        '#44AA99',
        '#117733',
        '#999933',
        '#DDCC77',
        '#CC6677',
        '#882255',
        '#AA4499',
        '#DDDDDD'
      ],
      ageColors: [
        '#036e38',
        '#8ab72c',
        '#e7930f',
        '#c73728',
        '#7000cc',
        '#3f82bb'
      ],
      dateLabels: [],
      regionLabels: [],
      ageLabels: ['10代', '20代', '30代', '40代', '50代', '60代以上'],
      displayRegionLabels: [],
      displayRegionDataValues: []
    }
  },
  computed: {
    faSyncAlt () {
      return faSyncAlt
    },
    regionData () {
      return {
        datasets: [
          {
            label: this.displayRegionLabels[0],
            data: [this.displayRegionDataValues[0]],
            backgroundColor: this.chartColors[0],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.displayRegionLabels[1],
            data: [this.displayRegionDataValues[1]],
            backgroundColor: this.chartColors[1],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.displayRegionLabels[2],
            data: [this.displayRegionDataValues[2]],
            backgroundColor: this.chartColors[2],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.displayRegionLabels[3],
            data: [this.displayRegionDataValues[3]],
            backgroundColor: this.chartColors[3],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.displayRegionLabels[4],
            data: [this.displayRegionDataValues[4]],
            backgroundColor: this.chartColors[4],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.displayRegionLabels[5],
            data: [this.displayRegionDataValues[5]],
            backgroundColor: this.chartColors[5],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.displayRegionLabels[6],
            data: [this.displayRegionDataValues[6]],
            backgroundColor: this.chartColors[6],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.displayRegionLabels[7],
            data: [this.displayRegionDataValues[7]],
            backgroundColor: this.chartColors[7],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.displayRegionLabels[8],
            data: [this.displayRegionDataValues[8]],
            backgroundColor: this.chartColors[8],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          },
          {
            label: this.displayRegionLabels[9],
            data: [this.displayRegionDataValues[9]],
            backgroundColor: this.chartColors[9],
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          }
        ],
        labels: []
      }
    },
    ageData () {
      return {
        datasets: [
          {
            data: this.ageDataValues,
            backgroundColor: this.ageColors,
            datalabels: {
              color: 'white',
              fontStyle: 'bold'
            }
          }
        ],
        labels: this.ageLabels
      }
    },
    dateData () {
      return {
        datasets: [
          {
            data: this.dateDataValues,
            borderColor: '#00bfe5',
            fill: false,
            label: '人数'
          }
        ],
        labels: this.dateLabels
      }
    }
  },
  async created () {
    // firestoreからスタンプラリー情報とユーザ情報を取得
    const _this = this
    this.stamprallyData = await Firestore.getStamprallyInfo(this.$store.state.selected)
    await firestore
      .collection('users')
      .where(`stamprally.${this.$store.state.selected}.id`, '==', this.$store.state.selected)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (!doc.data().admin) {
            _this.$set(_this.users, doc.id, doc.data())
            const createdAt = new Date(
              doc.data().stamprally[_this.$store.state.selected].joinDate.seconds * 1000
            )
            let createdAt2
            if (doc.data().login) {
              createdAt2 = new Date(
                doc.data().login.seconds * 1000
              )
              _this.$set(_this.users[doc.id], 'logined', createdAt2)
            }
            _this.$set(_this.users[doc.id], 'joinedAt', createdAt)
          }
        })
        _this.userCount()
        _this.setDateInfo()
        _this.activeUserCount()
        _this.regionDataSetting()
        _this.ageDataSetting()
        _this.dateDataSetting(_this.dateSetting.termMonth[0])
      })
    this.loaded = true
    this.lineLoaded = true
  },
  async mounted () {
    // await this.handler()
  },
  methods: {
    handler (n, month) {
      // グラフの初期化
      if (n === 4) {
        this.lineLoaded = false
      } else { this.loaded = false }
      if (n === 1) {
        this.activeUserCount()
      } else if (n === 2) {
        this.regionDataSetting()
      } else if (n === 3) {
        this.ageDataSetting()
      } else if (n === 4) {
        this.dateDataSetting(month)
      }
      this.$nextTick(() => {
        if (n === 4) {
          this.lineLoaded = true
        } else { this.loaded = true }
      })
    },
    userCount () {
      // ユーザ数のカウント
      this.usersLength = 0
      const users = Object.entries(this.users)
      for (let i = 0; i < users.length; i++) {
        this.usersLength++
      }
    },
    setDateInfo () {
      // 日付情報のセット
      this.dateSetting = {
        current: new Date(),
        start: null,
        end: null,
        termMonth: []
      }
      this.dateSetting.start = new Date(this.stamprallyData.start.seconds * 1000)
      this.dateSetting.end = new Date(this.stamprallyData.end.seconds * 1000)
      this.dateSetting.termDay = Math.floor((this.dateSetting.end - this.dateSetting.start) / 86400000)
      const month1 = this.dateSetting.end.getFullYear() * 12 + this.dateSetting.end.getMonth()
      const month2 = this.dateSetting.start.getFullYear() * 12 + this.dateSetting.start.getMonth()
      for (let i = 0; i < (month1 - month2) + 1; i++) {
        let year = this.dateSetting.start.getFullYear()
        let month = this.dateSetting.start.getMonth() + i
        while (month > 11) {
          year++
          month -= 12
        }
        const date = new Date(year, month, 1)
        if (!this.dateSetting.termMonth.includes([date.getFullYear(), date.getMonth()])) {
          this.dateSetting.termMonth.push([date.getFullYear(), date.getMonth()])
        }
      }
      console.log(this.dateSetting)
    },
    activeUserCount () {
      // アクティブユーザ数のカウント
      this.activeUserNum = 0
      const users = Object.entries(this.users)
      for (let i = 0; i < users.length; i++) {
        const from = new Date(users[i][1].logined)
        const diff = new Date().getTime() - from.getTime()
        if (diff / (60 * 60 * 1000) <= 24) {
          this.activeUserNum++
        }
      }
    },
    regionDataSetting () {
      // 地域別カウント
      const region = []
      const otherRegions = []
      const users = Object.entries(this.users)
      for (let i = 0; i < users.length; i++) {
        if (this.regionLabels.includes(users[i][1].region) === false && users[i][1].region.includes('その他') === false) {
          this.regionLabels.push(users[i][1].region)
        }
      }
      this.regionLabels.push('その他')
      for (let i = 0; i < this.regionLabels.length; i++) {
        region.push(0)
      }
      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < region.length - 1; j++) {
          if (users[i][1].region === this.regionLabels[j]) {
            region[j]++
          }
        }
      }
      for (let i = 0; i < users.length; i++) {
        if (users[i][1].region.includes('その他')) {
          if (otherRegions.some(region => region.name === users[i][1].region)) {
            const index = otherRegions.findIndex(region => region.name === users[i][1].region)
            otherRegions[index].num++
          } else {
            otherRegions.push({ name: users[i][1].region, num: 1 })
          }
          region[region.length - 1]++
        }
      }
      const position = this.regionLabels.indexOf('')
      this.regionLabels[position] = '無回答'
      this.regionDataValues = region
      this.otherRegions = otherRegions
      const x = this.regionLabels
      const y = this.regionDataValues
      const zip = (x, y) => Array.from(Array(Math.max(x.length, y.length)), (_, i) => [x[i], y[i]])
      const z = zip(x, y)
      z.sort(function (a, b) {
        return b[1] - a[1]
      })
      // console.log(z)
      for (let i = 0; i < region.length; i++) {
        const data = z[i]
        this.displayRegionLabels.push(data[0])
        this.displayRegionDataValues.push(data[1])
      }
    },
    ageDataSetting () {
      // 年齢別カウント
      const age = [0, 0, 0, 0, 0, 0]
      const users = Object.entries(this.users)
      for (let i = 0; i < users.length; i++) {
        if (users[i][1].age === '10代') {
          age[0]++
        } else if (users[i][1].age === '20代') {
          age[1]++
        } else if (users[i][1].age === '30代') {
          age[2]++
        } else if (users[i][1].age === '40代') {
          age[3]++
        } else if (users[i][1].age === '50代') {
          age[4]++
        } else if (users[i][1].age === '60代以上') {
          age[5]++
        }
      }
      this.ageDataValues = age
    },
    dateDataSetting (month) {
      // 日付別カウント
      this.selectedMonth = month
      const datedata = []
      this.dateLabels = []
      const users = Object.entries(this.users)
      const start = new Date(month[0], month[1], 1)
      const today = new Date(month[0], month[1] + 1, 0)
      const diff = Math.floor((today - start) / 86400000)
      console.log(start, today, diff)
      for (let i = 0; i < diff + 1; i++) {
        this.dateLabels.push(start.getFullYear() + '/' + (start.getMonth() + 1) + '/' + (start.getDate() + i))
        datedata.push(0)
      }
      for (let i = 0; i < users.length; i++) {
        console.log(users[i][1].joinedAt)
        const day = (users[i][1].joinedAt).getFullYear() + '/' + ((users[i][1].joinedAt).getMonth() + 1) + '/' + (users[i][1].joinedAt).getDate()
        const index = this.dateLabels.indexOf(day)
        datedata[index]++
      }
      console.log(this.dateLabels, datedata)
      this.dateDataValues = datedata
    }
  }
}
</script>

<style scoped>
.btneffect {
  border: none;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  cursor: pointer;
  outline: none;
}
.btneffect:active,
.btneffect:hover,
.btneffect:focus {
  background-color: rgba(0, 0, 0, 0);
  outline: 0;
  box-shadow: none !important;
}
::-webkit-scrollbar {
  width: 10px
}
::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, .3);
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, .3);
}
</style>
