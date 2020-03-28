(function() {

	var app = {
		bind: function() {
			$('.srh-tabs .item').on('click', function() {
				$('.srh-tabs .selected').removeClass('selected');
				$(this).addClass('selected');
			})

			$('.srh-btn').on('click', function() {
				var type = $('.srh-tabs .selected').index();
				var srh_val = $('.srh-inp').val();
				if (type === 0) {
					window.open('https://www.baidu.com/s?wd=' + srh_val);
				} else if (type === 1) {
					window.open('https://www.so.com/s?q=' + srh_val);
				} else { // 绝地求生战绩查询

				}
			})

			$('.game-cate-sec .tabs .tab').on('click', function() {
				var idx = $(this).index();
				$('.game-cate-sec .tabs .selected').removeClass('selected');
				$(this).addClass('selected');
				$('.game-cate-content').addClass('hide').eq(idx).removeClass('hide');
			})

			// 换肤
			$('.skin-btn').on('click', function() {
				console.log(33)
				var $css = document.getElementById('css-link')
				console.log($css.href)
				if ($css.href.indexOf('index.css') >= 0) {
					console.log(4545)
					$css.href = './css/index_girl.css?t=' + (+new Date())
				} else {
					$css.href = './css/index.css?t=' + (+new Date())
				}
			})
		},
		init: function() {
			$('.game-cate-content').eq(0).removeClass('hide')
			$('.tabs .tab').eq(0).addClass('selected')
			this.bind()
		}
	}

	app.init()

})()