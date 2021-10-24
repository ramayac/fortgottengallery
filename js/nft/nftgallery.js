/*
 * Fort Gotten Gallery
 * Copyright 2021, @ramayac
 */
$(function () {
	'use strict'
	var dataContainer = $('div#data-container')
	var searchInput = $('input#searchInput')
	//var paginationContainer = $('#pagination-container')

	function searchByText(collection, text, exclude) {
		return _.filter(collection, _.flow(
			_.partial(_.omit, _, exclude),
			_.partial(
				_.some, _,
				_.flow(_.toLower, _.partial(_.includes, _, _.toLower(text), 0))
			)
		));
	}

	function nftsTemplate(nftJson) {
		var rows = $('<div class="row row-cols-5"></div>')

		$.each(nftJson, function (_, nftElement) {
			var thumbnail = $('<img class="card-img-top">')
				.prop('loading', 'lazy')
				.prop('width', 250)
				.prop('height', 250)
				.prop('src', nftElement.image)
				.prop('alt', nftElement.name)

			var cardBody = $(`<div class="card-body">
					<h5 class="card-title">Kid # ${nftElement['01 Kid Number']}</h5>
					<p class="card-text">
					 ${nftElement['03 Camp']} - ${nftElement['04 Role']}
					</p>
					<small class="text-muted">${nftElement['00 Episode']}</small>
				</div>`)

			var btn = $('<a class="btn btn btn-sm btn-outline-secondary">More</a>')
				.prop('title', nftElement.name)
				.prop('href', nftElement.image)
				.attr('data-gallery', '')

			var card = $('<div class="card shadow-sm">')
				.append(thumbnail)
				.append(cardBody)
				.append(btn)

			var col = $('<div class="col"></div>')
				.append(card)

			rows.append(col)
		})
		return rows
	};

	NFTS = NFTS.sort(() => Math.random() - 0.5)
	var col = nftsTemplate(NFTS.slice(0, 20));
	dataContainer.html(col);

	searchInput.bind("enterKey", function (e) {
		let filteredNFT = searchByText(NFTS, searchInput.val())
		var col = nftsTemplate(filteredNFT);
		dataContainer.html(col);
	});

	searchInput.keyup(function (e) {
		if (e.keyCode == 13) {
			$(this).trigger("enterKey");
		}
	});
	/*paginationContainer.pagination({
		dataSource: NFTS,
		pageSize: 30,
		callback: function (data, pagination) {
			// template method of yourself
			var col = nftsTemplate(data);
			dataContainer.html(col);
		}
	})*/

})
