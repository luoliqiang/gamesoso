require.config({
    baseUrl: '../',
    paths: {
        jquery: 'lib/jquery-1.11.3.min',
    	vue: 'lib/vue',
        comm: 'js/helper/comm',
        echarts: 'lib/echarts/echarts'
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

define(['jquery', 'vue', 'comm', 'echarts'], function ($, vue, comm, echarts) {
    var vueInstance = new vue({
        el: '#vm-app',
        data: {
            sessonList: [],
            matchesList: [],
            teamList: []
        },
        mounted () {
            comm.initPage()
        },
        methods: {
            formTime (val) {
                return comm.ptime(val)
            },
            getTeamData (item) {
                // 查询场次
                $.post('/api/pg/matchesPlayerTeam', {
                    matchId: item.matchesInfo.matchId,
                    teamId: item.playerInfo.teamId
                })
                .then((res) => {
                    if (res.code === 0 && res.data) {
                        let damageDealtAll = 0
                        res.data.forEach((item) => {
                            damageDealtAll += Number(item.damageDealt)
                        })
                        item.teamList = res.data
                        item.damageDealtAll = damageDealtAll
                        // this.teamList = res.data
                    }
                })
            },
            showTeam (item) {
                item.showTeam = !item.showTeam
                this.getTeamData(item)
            }
        }
    })
    var app = {}
    // 用户数据相关
    app.user = {
        renderUser (data) {
            $('.nick-name').html(data.account)
            $('.refresh-time-num').html(comm.formatTimeStr(data.lastUpdateTime))
        },
        search (srhVal) {
            srhVal = srhVal || $('#search-inp').val();
            if (!srhVal || srhVal === '-') {
                return;
            }
            var params = {
                userName: srhVal
            }
            $.post('/api/pg/searchUserByAccount', params)
                .then((res) => {
                    if (res.code === 0 && res.data) {
                        this.renderUser(res.data)
                        this.userData = res.data
                        app.match.init();
                    }
                })
        },
        bind () {
            $('.srh-btn').on('click', () => {
                this.search()
            });
            $('#search-inp').on('keyup', (e) => {
                if (e.keyCode === 13) {
                    this.search()
                }
            });
            $('.btn-refresh').on('click', () => {
                this.search($('.nick-name').html())
            })
        },
        init () {
            this.bind()
            if (comm.getUrlParam('userName')) {
                this.search(comm.getUrlParam('userName'))
            }
        }
    }

    app.match = {
        renderSessonList (data) {
            var htmlsSession = ''
            data.forEach((item) => {
                htmlsSession += '<div class="dropdown-item" data-val="'+ item.key +'">'+ item.name +'</div>'
            })
            $('.dropdown-session .dropdown-menu').html(htmlsSession)
            $('.dropdown-session .dropdown-name').html(data[0].name)
        },
        renderSeasonData (data) {
            var mode = $('.dropdown-session-mode .dropdown-name').html();
            var dataDuo = mode === 'TPP' ? data.duo : data['duo-fpp'];
            var dataSolo = mode === 'TPP' ? data.solo : data['solo-fpp'];
            var dataSquad = mode === 'TPP' ? data.squad : data['squad-fpp'];
            var list = [dataSolo, dataDuo, dataSquad]
            // 使用vue渲染数据
            vue.set(vueInstance.$data, 'sessonList', list)
        },
        getSeasonData () {
            // 查询比赛
            var key = $('.dropdown-session').data('val')
            if (typeof key === 'undefined') {
                key = $('.dropdown-session .dropdown-item').eq(0).data('val');
            }
            var params = {
                key: key,
                userId: app.user.userData.id
            }
            $.post('/api/pg/seasonData', params)
                .then((res) => {
                    if (res.code === 0 && res.data) {
                        this.renderSeasonData(res.data)
                    }
                })
        },
        getSeasonList () {
            // 查询场次
            $.post('/api/pg/seasonList')
                .then((res) => {
                    if (res.code === 0 && res.data) {
                        this.renderSessonList(res.data)
                        this.getSeasonData()
                    }
                })
        },
        render15daysData (data) {
            $('.sec-recent').removeClass('hide');
            var keymaps = ['killsSum', 'damageDealtAvg', 'assistsSum', 'kd', 'healsSum']
            var namemaps = ['击杀', '场均伤害', '助攻', 'KD', '救队友']
            var echartModel = echarts.init($('#ecahrt-model')[0])
            var tabIdx = $('.tabs-15day .selected').index()
            let xData = this.data15.map((item) => {
                return item.day.substring(5, 100)
            })
            let yData = this.data15.map((item) => {
                return item[keymaps[tabIdx]]
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
                    data: yData
                }]
            };

            // 使用刚指定的配置项和数据显示图表。
            echartModel.setOption(option);
        },
        get15daysData () {
            // 查询场次
            $.post('/api/pg/matchesPlayerDayData', {userId: app.user.userData.id})
                .then((res) => {
                    if (res.code === 0 && res.data) {
                        this.data15 = res.data
                        this.render15daysData(res.data)
                        // $('#ecahrt-model')
                    }
                })
        },
        getMatchesPlayerlist () {
            // 查询场次
            var params = {
                lastId: this.lastId || 0,
                pageSize: 20,
                userId: app.user.userData.id
            }
            $.post('/api/pg/matchesPlayerList', params)
                .then((res) => {
                    if (res.code === 0 && res.data) {
                        // 使用vue渲染数据
                        res.data.forEach((item) => {
                            item.showTeam = false
                            item.teamList = null
                        })
                        if (res.data.length) {
                            if (vueInstance.$data.matchesList && vueInstance.$data.matchesList.length) {
                                vueInstance.$data.matchesList.push(res.data)
                            } else {
                                vue.set(vueInstance.$data, 'matchesList', res.data)
                            }
                        } else {
                            $('.btn-showmore').hide()
                        }
                    }
                    this.lock = false
                })
        },
        bind () {
            var _this = this
            $('.session-select .dropdown').on('click', (e) => {
                if (e.target.className === 'dropdown-item') {
                    var $target = $(e.target)
                    var html = $target.html()
                    $target.closest('.dropdown').find('.dropdown-name').html(html);
                    this.getSeasonData()
                }
            });
            $('.tabs-15day .tab').on('click', function () {
                $('.tabs-15day .selected').removeClass('selected')
                $(this).addClass('selected')
                _this.render15daysData()
            });
            $('.btn-showmore').on('click', () => {
                if (this.lock) {
                    return
                }
                this.lock = true
                if (!this.lastId) {
                    this.lastId = 0
                }
                this.lastId++
                this.getMatchesPlayerlist()
            })
        },
        init () {
            this.getSeasonList()
            this.get15daysData()
            this.getMatchesPlayerlist()
            this.bind()
        }
    }

    app.user.init();
});