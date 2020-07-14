require.config({
    baseUrl: '../',
    paths: {
        jquery: 'lib/jquery-1.11.3.min',
        // vue: 'lib/vue',
        // ELEMENT: 'lib/element.min',
        comm: 'js/helper/comm',
        gunmaps: 'js/helper/gunMaps',
        echarts: 'lib/echarts/echarts.min'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        comm: {
            deps: ['jquery']
        }
    }
});

define(['jquery', 'comm', 'echarts', 'gunmaps'], function ($, comm, echarts, gunmaps) {
  new Vue({
      el: '#vm-app',
      data () {
        return {
          initUser: false,
          showPage: false,
          loadingSearch: false,
          loadingSeasonData: false,
          loadingData15: false,
          loadingUserData: false,
          loadingMore: false,
          goodsList: [],
          seasonList: [],
          seasonData: [],
          matchesList: [],
          teamList: [],
          weaponMasterList: [],
          userData: null,
          srhVal: '',
          data15: null,
          data15Index: 0,
          sessonSelectName: '',
          sessonTypeSelectName: '',
          gunmaps: gunmaps,
          weaponMasterTitles: [
            {key: 'medalDeadeye', name: '死亡之眼', desc: '以命中头部击败1名敌人', url : 'dead-eye.png'},
            {key: 'medalAssassin', name: '刺客', desc: '在未受到任何伤害的情况下以命中头部击败1名敌人', url : 'cike.png'},
            {key: 'medalDoubleKill', name: '双击败', desc: '短时间内快速击败2名敌人', url : 'double-kill.png'},
            {key: 'medalPunisher', name: '子弹暴雨', desc: '在单局比赛使用1个武器对敌人造成300以上伤害', url : 'boll-rain.png'},
            {key: 'medalFrenzy', name: '狂战士', desc: '在单局比赛使用1个武器击败5名敌人', url : 'kuang-hero.png'},
            {key: 'medalLastManStanding', name: '最终生存者', desc: '击败游戏中最后一名敌人', url : 'final-live.png'},
            {key: 'medalTripleKill', name: '三击败', desc: '短时间内快速击败3名敌人', url : 'tree-kill.png'},
            {key: 'medalLongshot', name: '远距离', desc: '至少在200m之外的距离击败1名敌人', url : 'long-kill.png'},
            {key: 'medalAnnihilation', name: '全部淘汰', desc: '一个人击败一个四排队伍的所有敌人', url : 'all-out.png'},
            {key: 'medalFirstBlood', name: '第一滴血', desc: '在游戏中最先击败敌人', url : 'first-blood.png'},
            {key: 'medalQuadKill', name: '四击败', desc: '短时间内快速击败4名敌人', url : 'four-kill.png'},
            {key: 'medalRampage', name: '奋勇突进', desc: '在单局比赛使用1个武器击败10名敌人', url : 'brave-go.png'}
          ]
        }
      },
      watch: {
        data15Index (val) {
          this.render15daysData()
        }
      },
      mounted () {
          if (comm.getUrlParam('userName')) {
            this.srhVal = comm.getUrlParam('userName')
            this.search()
          } else {
            this.getGoods()
          }
          comm.initPage()
          this.showPage = true
          this.getRecentUser()
      },
      filters: {
        filteLevel (val) {
          let title = ''
          if (val >= 100 ) {
            title = '大师'
          } else if (val >= 90 ) {
            title = '王牌'
          } else if (val >= 80 ) {
            title = '达人'
          } else if (val >= 70 ) {
            title = '专家'
          } else if (val >= 60 ) {
            title = '精英'
          } else if (val >= 50 ) {
            title = '职业'
          } else if (val >= 40 ) {
            title = '专业'
          } else if (val >= 30 ) {
            title = '业余'
          } else if (val >= 20 ) {
            title = '初学者'
          } else if (val >= 10 ) {
            title = '学徒'
          } else {
            title = '新手'
          }
          return title + ' [lv.' + val + ']'
        },
        formatNumTree (val) {
          return Math.ceil(val / 1000) / 10
        },
        filterMapname (val) {
          let maps = {
            DihorOtok_Main: '维寒迪',
            Savage_Main: '萨诺',
            Desert_Main: '米拉玛',
            Baltic_Main: '艾伦格',
            Summerland_Main: '卡拉金',
            HIT_Everett: '训练场'
          }
          return maps[val] || '-'
        }
      },
      methods: {
          defImg () {
            let img = event.srcElement
            img.src = require('./assets/img/guns/default-gun.png')
          },
          formTime (val) {
              return comm.ptime(val).substr(3).replace(':', '分') + '秒'
          },
          formScore (val) {
            if (val > 1000) {
              return String(val).substring(0,3) + ',' + String(val).substr(3)
            }
          },
          formatTimeStr (val, opt) {
            return comm.formatTimeStr(val, opt)
          },
          filterStrong (key, item) {
            let max = 0
            item.forEach((n) => {
              if (n[key] > max) {
                max = n[key]
              }
            })
            return max
          },
          scrollRight () {
            let dis = $('.weapon-item-wrapper').scrollLeft()
            dis += 325
            $('.weapon-item-wrapper').animate({
              scrollLeft: dis + 'px'
            })
          },
          scrollLeft () {
            let dis = $('.weapon-item-wrapper').scrollLeft()
            if (!dis || dis <= 0) {
              return
            }
            dis -= 325
            $('.weapon-item-wrapper').animate({
              scrollLeft: dis + 'px'
            })
          },
          showTeam (item) {
            item.showTeam = !item.showTeam
            if (item.showTeam) {
              this.getTeamData(item)
            }
          },
          getGoods () {
            $.post('/api/pg/shopInfoList')
              .then((res) => {
                if (res.code === 0) {
                  this.goodsList = res.data
                }
              })
          },
          getTeamData (item) {
              if (item.teamList) {
                return
              }
              item.loadingTeamDetail = true
              $.post('/api/pg/matchesPlayerTeam', {
                  matchId: item.matchesInfo.matchId,
                  teamId: item.playerInfo.teamId
              })
              .then((res) => {
                item.loadingTeamDetail = false
                  if (res.code === 0 && res.data) {
                      let damageDealtAll = 0
                      let mvp = 0

                      res.data.forEach((item) => {
                        let n = Math.ceil(item.damageDealt / 1000) + item.kills * 100 + item.dbnos * 100 + item.assists * 100
                        if (n > mvp) {
                          mvp = n
                        }
                        item.mvp = false
                        item.loadingTeamDetail = false
                      })

                      res.data.forEach((item) => {
                          damageDealtAll += Number(item.damageDealt)
                          let n = Math.ceil(item.damageDealt / 1000) + item.kills * 100 + item.dbnos * 100 + item.assists * 100
                          if (n === mvp) {
                            item.mvp = true
                          }
                      })
                      item.teamList = res.data
                      // item.mvp = res.data
                      item.damageDealtAll = damageDealtAll
                      // this.teamList = res.data
                  }
              })
          },
          getWeaponMaster () {
            $.post('/api/pg/weaponMasteryData', {
              userId: this.userData.id
            })
            .then((res) => {
                if (res.code === 0 && res.data) {
                  res.data.forEach((item) => {
                    item.showDetail = false
                  })
                  this.weaponMasterList = res.data
                }
            })
          },
          renderSeasonData (data) {
              data = this.seasonDataInit
              var mode = this.sessonTypeSelectName
              var dataDuo = mode === 'TPP' ? data.duo : data['duo-fpp']
              var dataSolo = mode === 'TPP' ? data.solo : data['solo-fpp']
              var dataSquad = mode === 'TPP' ? data.squad : data['squad-fpp']
              this.seasonData = [dataSolo, dataDuo, dataSquad]
          },
          getSeasonData (key) {
            // 查询比赛
            var params = {
                key: key,
                userId: this.userData.id
            }
            this.loadingSeasonData = true
            $.post('/api/pg/seasonData', params)
                .then((res) => {
                    this.loadingSeasonData = false
                    if (res.code === 0 && res.data) {
                        this.seasonDataInit = res.data
                        this.renderSeasonData(res.data)
                    }
                })
          },
          getSeasonList () {
            // 查询场次
            $.post('/api/pg/seasonList')
                .then((res) => {
                    if (res.code === 0 && res.data) {
                        this.seasonList = res.data
                        this.sessonSelectName = this.seasonList[0].name
                        this.sessonTypeSelectName = 'TPP'
                        this.getSeasonData(this.seasonList[0].key)
                    }
                })
          },
          sessonSelectHandler (item) {
            this.sessonSelectName = item.name
            this.getSeasonData(item.key)
          },
          sessonTypeSelectHandler (mode) {
            this.sessonTypeSelectName = mode
            this.renderSeasonData()
          },
          render15daysData () {
              $('.sec-recent').removeClass('hide');
              var keymaps = ['killsSum', 'damageDealtAvg', 'assistsSum', 'kd', 'healsSum']
              var namemaps = ['击杀', '场均伤害', '助攻', 'KD', '救队友']
              var echartModel = echarts.init($('#ecahrt-model')[0])
              var tabIdx = this.data15Index
              let xData = this.data15.map((item) => {
                  return item.day.substring(5, 100) + ' ('+ item.count +'场)'
              })
              let yData = this.data15.map((item) => {
                  if (namemaps[tabIdx] === 'KD' || namemaps[tabIdx] === '场均伤害') {
                    return Math.ceil(item[keymaps[tabIdx]] / 10) / 100
                  } else {
                    return item[keymaps[tabIdx]]
                  }
              })
              // 指定图表的配置项和数据
              var option = {
                  tooltip: {},
                  textStyle: {
                      color: 'rgba(255, 255, 255, 1)'
                  },
                  xAxis: {
                      data: xData
                  },
                  yAxis: {},
                  series: [{
                      name: namemaps[tabIdx],
                      type: 'line',
                      lineStyle: {
                          width: 3
                      },
                      itemStyle: {
                          color: 'rgb(242, 169, 0)'
                      },
                      areaStyle: {
                          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                              offset: 0,
                              color: 'rgba(242, 169, 0, .5)'
                          }, {
                              offset: 1,
                              color: 'rgba(75, 61, 33, .2)'
                          }])
                      },
                      label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                      },
                      data: yData
                  }]
              };
  
              // 使用刚指定的配置项和数据显示图表。
              echartModel.setOption(option);
          },
          get15daysData () {
            // 查询场次
            this.loadingData15 = true
            $.post('/api/pg/matchesPlayerDayData', {userId: this.userData.id})
                .then((res) => {
                    this.loadingData15 = false
                    if (res.code === 0 && res.data) {
                        this.data15 = res.data
                        this.render15daysData()
                    }
                })
          },
          getMatchesPlayerlist () {
            if (this.loadingMore) {
              return
            }
            this.loadingMore = true
            if (!this.lastId) {
              this.lastId = 0
            }
            var params = {
                lastId: this.lastId,
                pageSize: 5,
                userId: this.userData.id
            }
            $.post('/api/pg/matchesPlayerList', params)
                .then((res) => {
                    this.loadingMore = false
                    if (res.code === 0 && res.data && res.data.length) {
                        // 使用vue渲染数据
                        res.data.forEach((item) => {
                            item.showTeam = false
                            item.teamList = null
                        })
                        this.matchesList = this.matchesList.concat(res.data)
                        this.lastId = res.data[res.data.length - 1].playerInfo.id
                    } else {
                      this.loadingMore = 'finish'
                    }
                })
          },
          getRecentUser () {
            // 近期查询用户
            $.post('/api/pg/recentUsers')
                .then((res) => {
                    this.loadingMore = false
                    if (res.code === 0 && res.data && res.data.length) {
                        
                    } else {
                    }
                })
          },
          goPage (name) {
            window.location.href = location.origin + location.pathname + '?userName=' + name
          },
          refresh () {
            let params = {
              userName: this.srhVal
            }
            $.post('/api/pg/updateUserData', params)
                .then((res) => {
                  if (res.code === 0) {
                    this.search()
                  } else {
                    this.$message(res.msg)
                    this.initUser = false
                    this.loadingSeasonData = true
                    this.loadingData15 = true
                    if (res.msg.indexOf('用户不存在') >= 0) {
                      this.userData = false
                    }
                    // 假刷新
                    setTimeout(() => {
                      this.loadingSeasonData = false
                      this.loadingData15 = false
                    }, 300)

                  }
                })
          },
          reset () {
            this.seasonList = []
            this.seasonData = []
            this.matchesList = []
            this.teamList = []
            this.weaponMasterList = []
            this.userData = null
          },
          search (e) {
            if (!this.srhVal) {
              return
            }
            if (!this.userData) {
              this.loadingUserData = true
            }
            this.goodsList = []
            $.post('/api/pg/searchUserByAccount', {
              userName: this.srhVal
            })
              .then((res) => {
                this.loadingUserData = false
                this.initUser = false
                if (res.code === 0) {
                  if (res.data) {
                    this.userData = res.data
                    this.getSeasonList()
                    this.get15daysData()
                    this.getMatchesPlayerlist()
                    this.getWeaponMaster()
                    this.matchesList = []
                  } else if (res.data === null) {
                    this.reset()
                    // 只允许一次初始化
                    if (this.refreshAccount !== this.srhVal) {
                      this.initUser = true
                      this.refresh()
                      this.refreshAccount = this.srhVal
                    } else {
                      this.userData = false
                    }
                  }
                } else {
                  this.userData = false
                }
              })
          }
      }
  })
});