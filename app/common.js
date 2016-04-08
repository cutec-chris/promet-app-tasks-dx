// common app settings
var A = {
	deviceOrient: (typeof(window.orientation)=="undefined"?(window.innerWidth>window.innerHeight?"landscape":"portrait"):doOnRotate()),
	deviceType: (function(i){return (i<1024?"phone":(i<1280?"tablet":"desktop"));})(Math.max(screen.width, screen.height)),
	server: "server/",
	cache: true,
	modules: {
		dhtmlx: ["dhtmlx"],
		app: ["init", "contacts", "settings"],
		common: ["settings_forms"]
	}
};

// app enter-point
function doOnLoad() {
	// apply device-related css
	document.body.className = "device_type_"+A.deviceType;
	// show loader
	showLoader();
	// build modules to load
	var k = [];
	for (var a in A.modules) {
		for (var q=0; q<A.modules[a].length; q++) {
			if (a == "dhtmlx") k.push("dhtmlx/"+A.modules[a][q]+".js");
			if (a == "app") k.push("app/"+A.deviceType+"/"+A.modules[a][q]+".js");
			if (a == "common") k.push("app/"+A.modules[a][q]+".js");
		}
	}
	A.modules = k;
	// start loading
	loadModule();
};

// load single module with requirejs
function loadModule(name) {
	if (A.modules.length == 0) {
		window.dhx4.callEvent("init",[]);
		window.setTimeout(hideLoader, 500);
	} else {
		require([A.modules[0]+(A.cache?"?r="+new Date().getTime():"")], function(){
			var name = A.modules.shift();
			loadModule(name);
		});
	}
};

// app unload
function doOnUnload() {
	if (typeof(window.addEventListener) == "function") {
		window.removeEventListener("load", doOnLoad, false);
		window.removeEventListener("unload", doOnUnload, false);
		window.removeEventListener("orientationchange", doOnRotate, false);
	} else {
		window.detachEvent("onload", doOnLoad);
		window.detachEvent("onunload", doOnUnload);
	}
	window.dhx4.callEvent("unload",[]);
};

// common rotate callback
function doOnRotate(e) {
	var deviceOrient = (window.orientation == 0 || window.orientation == 180 ? "portrait":"landscape");
	if (typeof(e) == "undefined") return deviceOrient;
	if (A != null) A.deviceOrient = deviceOrient;
	window.dhx4.callEvent("onOrientationChange", [deviceOrient]);
};

// page-load event
if (typeof(window.addEventListener) == "function") {
	window.addEventListener("load", doOnLoad, false);
	window.addEventListener("unload", doOnUnload, false);
	window.addEventListener("orientationchange", doOnRotate, false);
} else {
	window.attachEvent("onload", doOnLoad);
	window.attachEvent("onunload", doOnUnload);
}
