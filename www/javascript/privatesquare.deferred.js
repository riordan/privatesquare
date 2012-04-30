function privatesquare_deferred_checkin(lat, lon, reason){

	 privatesquare_unset_status();

	if (reason=='offline'){
		privatesquare_set_status("I've lost the network.");
	}

	else if (reason=='api error'){
		privatesquare_set_status("foursquare is sad.");
	}

	else if (reason){
		privatesquare_set_status(reason);
	}

	else {}

	_privatesquare_show_map(lat, lon);

	var w = $("#deferred_where");
	w.val("");

	w.attr("data-latitude", lat);
	w.attr("data-longitude", lon);

	$("#deferred_checkin").submit(privatesquare_deferred_checkin_submit);
	$("#deferred").show();
}

function privatesquare_deferred_checkin_submit(){

	var dt = new Date();
	var ts = parseInt(dt.getTime() / 1000);

	var w = $("#deferred_where");
	var venue = w.val();

	var id = venue + "#" + ts;

	var checkin = {
		'id': id,
		'venue': venue,
		'latitude': w.attr('data-latitude'),
		'longitude': w.attr('data-longitude'),
		'created': ts
	};

	privatesquare_deferred_store(checkin, privatesquare_deferred_checkin_stored);
	return false;
}

function privatesquare_deferred_checkin_stored(checkin){

	console.log(checkin);

	var msg = "Okay! Your checkin at '" + checkin['venue'] + "' has been recorded.";
	privatesquare_set_status(msg);

	_privatesquare_hide_map();
	$("#deferred_checkin").hide();
}

function privatesquare_deferred_indicator(){

	var store = new Store("privatesquare");
	var deferred = store.get("deferred");

	var count = (deferred) ? Object.keys(deferred).length : 0;

	var wrapper = $("#pending");
	var indicator = $("#pending_count");

	if (count){
		indicator.html(count + " pending");
		wrapper.show();
	}

	else {
		indicator.html("");
		wrapper.hide();
	}
}

function privatesquare_deferred_list(sort_order){

	sort_order = (sort_order) ? sort_order.toLowerCase() : 'asc';

	var store = new Store("privatesquare");
	var deferred = store.get("deferred");

	var list = new Array();

	if (! deferred){
		return list;
	}

	for (var k in deferred){
		list.push(deferred[k]);
	}

	list.sort(function(a, b){

		if (a['created'] < b['created']){
			return (sort_order=='desc') ? 1 : -1;
		}

		if (a['created'] > b['created']){
			return (sort_order=='desc') ? -1 : 1;
		}

		return 0;
	});

	return list;
}

function privatesquare_deferred_store(checkin, callback){

	var store = new Store("privatesquare");
	var deferred = store.get("deferred");

	if (! deferred){
		deferred = {};
	}

	var key = checkin['id'];
	deferred[key] = checkin;

	store.set("deferred", deferred);

	var _callback = null;

	if (callback){

		_callback = function(){
			callback(checkin);
		};
	}

	_privatesquare_deferred_onupdate(_callback);
}

function privatesquare_deferred_remove(checkin_id, callback){

	var store = new Store("privatesquare");
	var deferred = store.get("deferred");

	if (deferred){
		delete deferred[checkin_id];
		store.set("deferred", deferred);
	}

	_privatesquare_deferred_onupdate(callback);
}

function privatesquare_deferred_purge(callback){
	var store = new Store("privatesquare");
	var deferred = store.get("deferred");

	if (deferred){
		store.remove("deferred");
	}

	_privatesquare_deferred_onupdate(callback);
}

function _privatesquare_deferred_onupdate(callback){

	privatesquare_deferred_indicator();

	if (callback){
		callback();
	}
}