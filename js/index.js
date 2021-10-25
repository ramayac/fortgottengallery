/*
 * Fort Gotten Gallery
 * Copyright 2021, @ramayac
 */
var jquery = require("jquery")
window.$ = window.jQuery = jquery

import * as _ from "lodash";
import { NFTS, FILTERS } from "./stats";

$(function () {
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

	function searchByElement(collection, elements) {
		return _.filter(collection, elements)
	}

	function nftsTemplate(nftJson) {
		var rows = $('<div class="row row-cols-4"></div>')
		$.each(nftJson, function (_, nftElement) {
			var card = $(`
			<div class="col mb-2">
				<!-- Card -->
				<div class="card shadow-sm">
					<img class="card-img-top"
					src="${nftElement.image}" 
					alt="${nftElement.name}" 
					width="250" height="250">
					<div class="card-body">
						<h5 class="card-title">Kid # ${nftElement['01 Kid Number']}</h5>
						<p class="card-text">${nftElement['03 Camp']} - ${nftElement['04 Role']}</p>
						<small class="text-muted">${nftElement['00 Episode']}</small>
					</div>
					<button type="button" class="btn btn-primary" data-bs-toggle="modal" 
					data-bs-target="#nftModal${nftElement['01 Kid Number']}">More</button>
					<!-- Modal -->
					<div class="modal fade" id="nftModal${nftElement['01 Kid Number']}" 
					tabindex="-1" aria-labelledby="nftModalLabel" aria-hidden="true">
						<div class="modal-dialog modal-xl modal-dialog-centered">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="nftModalLabel">Fort-Gotten Kidz # ${nftElement['01 Kid Number']}</h5>
									<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body">
									<div class="container">
									<div class="row">
										<div class="col text-center">
											<img class="rounded float-left" src="${nftElement.image}" alt="${nftElement.name}" width="450" height="450">
											<br/>
											<div class="text-muted">
												${nftElement['00 Episode']} - fort-gotten.com - &#169;2021
											</div>
										</div>
										<div class="col">
											<table class="table table-borderless table-sm">
												<thead>
													<tr>
														<th scope="col">Attribute</th>
														<th scope="col">Value</th>
														<th scope="col">%</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<th scope="row">Rarity Score</th>
														<td>${nftElement['rarityScore']}</td>
														<td></td>
													</tr>
													<tr>
														<th scope="row">00 Episode</th>
														<td>${nftElement['00 Episode']}</td>
														<td>100.00 %</td>
													</tr>
													<tr>
														<th scope="row">01 Kid Number</th>
														<td>${nftElement['01 Kid Number']}</td>
														<td>1.00 %</td>
													</tr>
													<tr>
														<th scope="row">02 Region</th>
														<td>${nftElement['02 Region']}</td>
														<td>100.00 %</td>
													</tr>
													<tr>
														<th scope="row">03 Camp</th>
														<td>${nftElement['03 Camp']}</td>
														<td>${nftElement['03 Camp_perc']} %</td>
													</tr>
													<tr>
														<th scope="row">04 Role</th>
														<td>${nftElement['04 Role']}</td>
														<td>${nftElement['04 Role_perc']} %</td>
													</tr>
													<tr>
														<th scope="row">05 Body</th>
														<td>${nftElement['05 Body']}</td>
														<td>${nftElement['05 Body_perc']} %</td>
													</tr>
													<tr>
														<th scope="row">06 Clothing</th>
														<td>${nftElement['06 Clothing']}</td>
														<td>${nftElement['06 Clothing_perc']} %</td>
													</tr>
													<tr>
														<th scope="row">07 Hat</th>
														<td>${nftElement['07 Hat']}</td>
														<td>${nftElement['07 Hat_perc']} %</td>
													</tr>
													<tr>
														<th scope="row">08 Neck</th>
														<td>${nftElement['08 Neck']}</td>
														<td>${nftElement['08 Neck_perc']} %</td>
													</tr>
													<tr>
														<th scope="row">09 Accessory</th>
														<td>${nftElement['09 Accessory']}</td>
														<td>${nftElement['09 Accessory_perc']} %</td>
													</tr>
													<tr>
														<th scope="row">10 Mask</th>
														<td>${nftElement['10 Mask']}</td>
														<td>${nftElement['10 Mask_perc']} %</td>
													</tr>
													<tr>
														<th scope="row">11 Face Decoration</th>
														<td>${nftElement['11 Face Decoration']}</td>
														<td>${nftElement['11 Face Decoration_perc']} %</td>
													</tr>
													<tr>
														<th scope="row">12 Face Cover</th>
														<td>${nftElement['12 Face Cover']}</td>
														<td>${nftElement['12 Face Cover_perc']} %</td>
													</tr>
													<tr>
														<th scope="row">13 Atmosphere</th>
														<td>${nftElement['13 Atmosphere']}</td>
														<td>${nftElement['13 Atmosphere_perc']} %</td>
													</tr>
													<tr>
														<th scope="row">14 Special</th>
														<td>${nftElement['14 Special']}</td>
														<td>${nftElement['14 Special_perc']} %</td>
													</tr>
												</tbody>
											</table>
										</div>
										</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`
			)
			rows.append(card)
		})
		return rows
	};

	function renderFilterCheckboxes(key, element) {
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

	function renderFilters(filter) {
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

	//NFTS = NFTS.sort(() => Math.random() - 0.5)
	renderFilters(FILTERS)

	searchInput.on("keyup", function (e) {
		if (e.key === "Enter") {
			if (searchInput.val().length > 0) {
				dataContainer.hide()
				dataLoading.show()
				//let filteredNFT = searchByText(NFTS, searchInput.val(), EXCLUDE_FROM_SEARCH)
				let filteredNFT = searchByElement(NFTS, {'01 Kid Number': searchInput.val()})
				var col = nftsTemplate(filteredNFT)
				dataContainer.html(col)
				dataLoading.hide()
				dataContainer.show()
			}
		}
	})

	filterMenu.on("click", function (e) {
		var checked = $(filterMenu).find('input:radio:checked')
		if (checked !== undefined && checked.length < 1) {
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

	function resetSearch() {
		dataLoading.show()
		searchInput.val('')
		$(filterMenu).find('input:radio:checked').each(function (ele) {
			$(this).prop('checked', false)
		});
		var col = nftsTemplate(NFTS.slice(0, 48))
		dataContainer.html(col)
		dataLoading.hide()
	}

	btnClearFilters.on("click", function () {
		resetSearch()
	})

	resetSearch();

});
