/*
 * Fort Gotten Gallery
 * Copyright 2021, @ramayac
 */
$(function () {
	'use strict'
	var dataLoading = $('div#data-loading')
	var dataContainer = $('div#data-container')
	var searchInput = $('input#searchInput')
	var filterMenu = $('ul#filterMenu')
	var btnClearFilters = $('button#clear-filters');

	function searchByText(collection, text, exclude) {
		return _.filter(collection, _.flow(
			_.partial(_.omit, _, exclude),
			_.partial(
				_.some, _,
				_.flow(_.toLower, _.partial(_.includes, _, _.toLower(text), 0))
			)
		))
	}

	function searchByElement(collection, elements){
		return _.filter(collection, elements)
	}

	function nftsTemplate(nftJson) {
		var rows = $('<div class="row row-cols-4"></div>')
		$.each(nftJson, function (_, nftElement) {
			var card = $(`
			<div class="col mb-2">
				<div class="card shadow-sm">
					<img class="card-img-top"
					src="${nftElement.image}" 
					alt="${nftElement.name}" 
					width="250" height="250">
					<div class="card-body">
						<h5 class="card-title">Kid # ${nftElement['01 Kid Number']}</h5>
						<p class="card-text">
						${nftElement['03 Camp']} - ${nftElement['04 Role']}
						</p>
						<small class="text-muted">${nftElement['00 Episode']}</small>
					</div>
					<a class="btn btn btn-sm" href="#">More</a>
				</div>
			</div>`
			)
			rows.append(card)
		})
		return rows
	};

	function renderFilterCheckboxes(key, element){
		var htmlLi = ''
		$.each(element, function (attr, element) {
			var li = `<li class="mx-4">
				<input data-key="${key}:${attr}"
				id="${key}:${attr}Radios"
				name="${key}Radios"
				class="form-check-input" type="radio" value="">
				<label class="form-check-label" 
				style="font-size: 0.7rem!important;">
						${attr} 
						- <span class="badge bg-primary">${element}</span>
				</label>
			</li>`
			htmlLi += li
		})
		return htmlLi
	}

	function renderFilters(filter){
		filterMenu.remove('li')
		$.each(filter, function (key, element) {
			var id = key.split(/ (.+)/)[0];
			var name = key.split(/ (.+)/)[1];
			var htmlElements = renderFilterCheckboxes(key, element);
			var li = $(`
			<li class="nav-item">
				<a class="nav-link" data-bs-toggle="collapse" href="#submenu${id}">${name}</a>
				<ul class="submenu collapse list-unstyled" id="submenu${id}">${htmlElements}</ul>
			</li>
			`)
			filterMenu.append(li)
		})
	}

	var EXCLUDE_FROM_SEARCH = [
		"image", "15 Website","16 Copyright",
		"00 Episode_perc","01 Kid Number_perc",
		"02 Region_perc","03 Camp_perc",
		"04 Role_perc","05 Body_perc",
		"06 Clothing_perc","07 Hat_perc","08 Neck_perc",
		"09 Accessory_perc","10 Mask_perc",
		"11 Face Decoration_perc",
		"12 Face Cover_perc","13 Atmosphere_perc","14 Special_perc"]

	
	//NFTS = NFTS.sort(() => Math.random() - 0.5)
	renderFilters(FILTERS)

	searchInput.on("keyup", function (e) {
		if(e.key === "Enter"){
			if(searchInput.val().length > 2){
				dataContainer.hide()
				dataLoading.show()
				let filteredNFT = searchByText(NFTS, searchInput.val(), EXCLUDE_FROM_SEARCH)
				var col = nftsTemplate(filteredNFT)
				dataContainer.html(col)
				dataLoading.hide()
				dataContainer.show()
			}
		}
	})

	filterMenu.on("click", function(e){
		var checked = $(filterMenu).find('input:radio:checked')
		if(checked !== undefined && checked.length < 1) {
			resetSearch();
			return;
		}
		
		var searchFilters = {};
		dataLoading.show()
		$(filterMenu).find('input:radio:checked').each(function (ele) {
			var attr = $(this).data('key').split(':');
			console.log(attr);
			searchFilters[attr[0]] = attr[1];
		});
		
		var result = searchByElement(NFTS, searchFilters)
		//result = [...result, searchByElement(NFTS, searchFilters)];
		var col = nftsTemplate(result)
		dataContainer.html(col)
		dataLoading.hide()
	})

	function resetSearch(){
		dataLoading.show()
		searchInput.val('')
		$(filterMenu).find('input:radio:checked').each(function (ele) {
			$(this).prop('checked', false)
		});
		var col = nftsTemplate(NFTS.slice(0, 12))
		dataContainer.html(col)
		dataLoading.hide()
	}

	btnClearFilters.on("click", function(){
		resetSearch()
	})

	resetSearch();

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
