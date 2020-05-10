const api_url = "https://api.rootnet.in/covid19-in/stats/latest";
var coviddata = [];
const dis_url = "./data/zones_district.json";
const pin_url = "./data/pinlatlon.json";
var covidDisData = {};

const fs = require('browserify-fs');
var locations = [
  ["16010115","203131", 28.4070, 77.8498],
  ["16010112","530068", 12.9716, 77.5946],
  ["16010111","795002", 24.8170, 93.9368],
  ["16010113","781001", 26.1445, 91.7362],
  ["16010125","403801", 15.2993, 74.1240]
];
var stuData = [];

async function getCases() {
	const response3 = await fetch(pin_url);
	const pinData = await response3.json();
	pinCode = Object.keys(pinData);
	fs.mkdir('/home', function() {
		fs.readFile('/home/hello-world.txt', 'utf-8', function(err, x) {
			
			var res = x.split("\n");
			for (i = 0; i < res.length-1; i++) {
				var details = {};
				details["pin"]=res[i].split(",")[0];
				details["roll"]=res[i].split(",")[1];
				for (ind = 0; ind < pinCode.length; ind++) {
					var key = "IN/"+details["pin"];
					if(key == pinCode[ind]){
						details["latitude"] = pinData[pinCode[ind]].latitude;
						details["longitude"] = pinData[pinCode[ind]].longitude;
					}					
				}
				stuData.push(details);
			}
		});
	});

	//console.log(stuData);

	const response = await fetch(api_url);
	const data = await response.json();

	document.getElementById("stat").innerHTML =
        '<form action=""> <label for="roll">Roll Number:</label><br> <input type="number" id="roll" name="roll" value="Roll Number"><br> <label for="pin">Pin Code:</label><br><input type="number" id="pin" name="pin" value="Pin Code"><br><br><input type="submit" id="submit"  value="Submit"></form>';

	for (ind = 0; ind < data.data.regional.length; ind++) {
		var details = {};
		details["state"] = data.data.regional[ind].loc;
		var active = data.data.regional[ind].confirmedCasesIndian +
data.data.regional[ind].confirmedCasesForeign -data.data.regional[ind].discharged -data.data.regional[ind].deaths;
		if (active < 10) {
			details["color"] = "#2df700";
		} else if (active >= 10 && active < 250) {
			details["color"] = "#fee8c8";
		} else if (active >= 250 && active < 500) {
			details["color"] = "#fdd49e";
		} else if (active >= 500 && active < 1000) {
			details["color"] = "#fdbb84";
		} else if (active >= 1000 && active < 2000) {
			details["color"] = "#fc8d59";
		} else if (active >= 2000 && active < 3000) {
			details["color"] = "#ef6548";
		} else if (active >= 3000 && active < 4000) {
			details["color"] = "#d7301f";
		} else if (active >= 4000 && active < 5000) {
			details["color"] = "#b30000";
		} else {
			details["color"] = "#8a0000";
		}
        	coviddata.push(details);
	
	}
	const response2 = await fetch(dis_url);
	const disData = await response2.json();
	stateNames = Object.keys(disData);

	for (ind = 0; ind < stateNames.length; ind++) {
		dis = disData[stateNames[ind]];
		covidDisData[stateNames[ind]] = [];
		for (i = 0; i < dis.length; i++) {
			disDetails = {};
			disDetails["districtName"] = dis[i].District.trim();
			if(dis[i].Zone.trim() == "Green Zone"){
				disDetails["color"] = "green";
			} else if(dis[i].Zone.trim() == "Red Zone"){
				disDetails["color"] = "red";
			} else if(dis[i].Zone.trim() == "Orange Zone"){
				disDetails["color"] = "orange";
			}
			covidDisData[stateNames[ind]].push(disDetails);
		}
	}

};
var stateJson = {
    "Andaman and Nicobar Islands": "andamannicobarislands_district.json",
    "Andhra Pradesh": "andhrapradesh_district.json",
    "Arunachal Pradesh": "arunachalpradesh_district.json",
    "Assam": "assam_district.json",
    "Bihar": "bihar_district.json",
    "Chhattisgarh": "chhattisgarh_district.json",
    "Delhi": "delhi_district.json",
    "Goa": "goa_district.json",
    "Gujarat": "gujarat_district.json",
    "Haryana": "haryana_district.json",
    "Himachal Pradesh": "himachalpradesh_district.json",
    "Jammu and Kashmir": "jammukashmir_district.json",
    "Jharkhand": "jharkhand_district.json",
    "Karnataka": "karnataka_district.json",
    "Kerala": "kerala_district.json",
    "Ladakh": "ladakh_district.json",
    "Madhya Pradesh": "madhyapradesh_district.json",
    "Maharashtra": "maharashtra_district.json",
    "Manipur": "manipur_district.json",
    "Meghalaya": "meghalaya_district.json",
    "Mizoram": "mizoram_district.json",
    "Nagaland": "nagaland_district.json",
    "Odisha": "odisha_district.json",
    "Punjab": "punjab_district.json",
    "Rajasthan": "rajasthan_district.json",
    "Sikkim": "sikkim_district.json",
    "Tamil Nadu": "tamilnadu_district.json",
    "Telengana": "telangana_district.json",
    "Tripura": "tripura_district.json",
    "Uttarakhand": "uttarakhand_district.json",
    "Uttar Pradesh": "uttarpradesh_district.json",
    "West Bengal": "westbengal_district.json",
};
getCases().then((response) => {
	var L = require("leaflet");
	var Chart = require("chart.js");

	var map = L.map("map", {
		scrollWheelZoom: true,
	});

	map.setView([23.5937, 82.9629],5);

	var osm_mapnik = L.tileLayer("", {
		maxZoom: 6,
		minZoom: 4,
		attribution:
		'&copy;<a href="https://sites.google.com/view/gauravkumarraghav">Gaurav Kumar Raghav</a>',
	}).addTo(map);
     
	geojson = L.geoJson(india, {
		style: style,
		onEachFeature: onEachFeature,
	}).addTo(map);
	console.log(stuData.length);
	for (var i = 0; i < stuData.length; i++) {
		var res = stuData[i]["roll"].concat("</a> <br> <a> Pin Code :-",stuData[i]["pin"],"</a>");
   		var res = "<a>Roll Number:- ".concat(res);
		console.log(res);
		marker = new L.marker(L.latLng(parseFloat(stuData[i]["latitude"]),parseFloat(stuData[i]["longitude"])))
		.bindPopup(res)
		.addTo(map);
		
	}
	function style(feature) {
		return {
			weight: 2,
			opacity: 0.7,
			color: "black",
			dashArray: "2",
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.NAME_1) || "#2df700",
		};
	};

	function getColor(name) {
		for (i in coviddata) {
			if (name == coviddata[i]["state"]) {
				return coviddata[i]["color"];
			}
		}
	};
    
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
            		mouseout: resetHighlight,
			click: zoomToFeature,
		});
	};

	function fetchJSON(url) {
		return fetch(url).then(function (response) {
			return response.json();
		});
	};
    
	var stateLevel = false;
	var STATENAME;


	async function zoomToFeature(e) {
		if (stateLevel === false){
			map.fitBounds(e.target.getBounds());
			var clickedState = e.target.feature.properties.NAME_1;
			var url = "/data/stateJsonData/" + stateJson[clickedState];
			var clickedStateJson = await fetchJSON(url);
			stateLevel = true;
			stateLevelJson = L.geoJson(clickedStateJson, {
				style: styleState,
				onEachFeature: onEachFeature,
			}).addTo(map);
		}
	};
	function checkState() {
		var zoom = map.getZoom();
		if (stateLevel === true && zoom < 6) {
			map.addLayer(geojson);
			map.removeLayer(stateLevelJson);
			map.setView([23.5937, 82.9629], 5);
			stateLevel = false;
			resetHighlight(map);
		}
	};
    
	setInterval(checkState, 1000);

	function resetHighlight(e) {
		if (!stateLevel) {
			geojson.resetStyle(e.target);
		}
		if (stateLevel) {
			stateLevelJson.resetStyle(e.target);
		}
		document.getElementById("stat").innerHTML ='<form action=""> <label for="roll">Roll Number:</label><br> <input type="number" id="roll" name="roll" value="Roll Number"><br> <label for="pin">Pin Code:</label><br><input type="number" id="pin" name="pin" value="Pin Code"><br><br><input id="submit" type="submit" value="Submit"></form>';
	};
    
	function highlightFeature(e) {
	        var layer = e.target;
	        layer.setStyle({
			weight: 5,
			color: "#666",
			dashArray: "",
		});
		if (stateLevel) {
			var distName = e.target.feature.properties.district;
			document.getElementById("stat").innerHTML ="<h3>" + distName + "</h3><br>district Zone: "+getColorDist(distName);
		}
	};
    
	function styleState(feature) {
	        return {
			weight: 2,
			opacity: 0.7,
			color: "black",
			dashArray: "2",
			fillOpacity: 0.7,
			fillColor: getColorDist(feature.properties.district),
		};
	};

	function getColorDist(dname) {
		for (i in covidDisData) {
			for (j in covidDisData[i]) {
				if (dname == covidDisData[i][j]['districtName']) {
					return covidDisData[i][j]['color'];
				}
			}
		}
	};

	var submitButton = document.getElementById("submit");
	submitButton.onclick = getFormData;
	function getFormData() {
		var pin = document.getElementById("pin").value;
		var roll = document.getElementById("roll").value;
		var result = pin.concat(",",roll,"\n");
		fs.mkdir('/home', function() {
			fs.appendFile('/home/hello-world.txt', result);
		});
	}


});



