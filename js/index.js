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
				$('.game-cate-main').addClass('hide').eq(idx).removeClass('hide');
			})
		},
		init: function() {
			this.bind()
		}
	}

	app.init()

})()