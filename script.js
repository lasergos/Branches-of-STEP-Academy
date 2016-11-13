var xhr = new XMLHttpRequest(),
	dataGlobal,
	address,
	countries = [],
	cities = [],
	$massage = $('.massage'),
	$h3 = $('h3'),
	$map = $('#map'),
	$pre = $('.massage pre'),
	map = null,
	geocoder = new google.maps.Geocoder(),
	z = 'aries';
	url = 'http://testajax.zzz.com.ua/horoscope/controller/index.php';


xhr.open('get', 'http://testajax.zzz.com.ua/filials.php');

xhr.onload = function () {
	data = JSON.parse(xhr.response);
	setCountries();
	$('.sk-circle').slideToggle('slow');
}

xhr.send();

function setCountries() {
	
	countriesList = document.querySelector('#countries'),
	countries.push(data[0].country);

	data.forEach(function (val) {
		if (countries.indexOf(val.country) == -1){
			countries.push(val.country);
		}
	});
	countries.forEach(function (val) {
		var option = document.createElement('option');
		option.textContent = val;
		option.value = val;
		countriesList.appendChild(option);
	});
	countriesList.addEventListener('change', function (e) {
		var countryName = e.target.value;
		clearOption ();
		setCities(countryName);
	});
}

function setCities(countryName) {
	if (map !== null) {
		$map.hide();
	}
	cities = data.filter(function  (val) {
		return val.country === countryName;
	}).map(function (val) {
		return val.city;
	});
	cities.unshift('Выберите город');

	var citiesList = document.querySelector('#cities'),
		value,
		options;
	cities.forEach(function (val, i, a) {
		var option = document.createElement('option');
		option.value = val;
		option.textContent = val;
		citiesList.appendChild(option);
	});
	options = citiesList.querySelectorAll('option');

	citiesList.addEventListener('change', function (e) {
		value = e.target.value;
		showMassage(value);
		showMap();
	});
}

function clearOption () {
	var $citiesList = $('#cities').empty();
	$h3.css('display', 'none');
	$massage.css('display', 'none');
}

function showMassage(value) {
	$pre.text('');
	data.forEach(function (val){
		if (val.city === value) {
			for (var key in val) {
				$pre.text($pre.text() + '- ' + key + ' : ' + val[key] + ' ;' + '\n');
			};
			address = val.fullAddress;
		} 
	});
	$massage.css('display', 'block');
}

//--------------- google map ---------------------

function showMap () {
	$h3.show();
	$map.show();

	if (map !== null) {
		geocoder.geocode({'address': address}, function(result, status){
			if (status == google.maps.GeocoderStatus.OK && status != google.maps.GeocoderStatus.ZERO_RESULTS) {
				map.setCenter(result[0].geometry.location);

				var infowindow = new google.maps.InfoWindow({
			    content: '<b>' + address + '</b>',
			    size: new google.maps.Size(150, 50)
				});

			  var marker = new google.maps.Marker({
			    position: result[0].geometry.location,
			    map: map,
			    title: address
			  });
			  google.maps.event.addListener(marker, 'click', function() {
			    infowindow.open(map, marker);
			  });

			}});
	} else {
		geocoder.geocode({'address': address}, function(result, status){
			console.log(result);
			if (status == google.maps.GeocoderStatus.OK && status != google.maps.GeocoderStatus.ZERO_RESULTS) {
				map = new google.maps.Map(document.getElementById('map'), {
				  center: result[0].geometry.location,
				  zoom: 8,
				  disableDefaultUI: true,
				});
				var infowindow = new google.maps.InfoWindow({
					content: '<b>' + address + '</b>',
					size: new google.maps.Size(150, 50)
				});

			  var marker = new google.maps.Marker({
			    position: result[0].geometry.location,
			    map: map,
			    title: address
			  });
			  google.maps.event.addListener(marker, 'click', function() {
			    infowindow.open(map, marker);
			  });
			}
		});
	}
}

/*  //----------- yandex map ---------
function showMap () {
	$h3.show();
	$map.show();
	if (map === null) {
		ymaps.geocode(address).then(function (res) {
			console.log(res);
			console.log(res.geoObjects.get(0).geometry.getCoordinates());
			map = new ymaps.Map(document.getElementById('map'), {
				center: res.geoObjects.get(0).geometry.getCoordinates(),
				zoom: 10,
				controls: [],
			});
		})
	} else {
		ymaps.geocode(address).then(function (res) {
			console.log(res.geoObjects.get(0).geometry.getCoordinates());
			map.setCenter(res.geoObjects.get(0).geometry.getCoordinates());
		});
	}
}
**/
