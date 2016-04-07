function showLoader() {
	var t = document.createElement("DIV");
	t.className = "app_loader";
	t.innerHTML = '<div class="app_loader_logo"><div class="app_loader_icon"> </div></div>';
	document.body.appendChild(t);
	t.firstChild.style.marginTop = Math.round((window.innerHeight||document.documentElement.offsetHeight)/2-t.firstChild.offsetHeight/2)+"px";
	A.loader = {bg:t};
	t = null;
}
function hideLoader() {
	if (A.loader.tr == null) A.loader.tr = window.dhx4.transDetect();
	if (A.loader.tr.transProp !== false) {
		A.loader.bg.addEventListener(A.loader.tr.transEv, unloadLoader, false);
		A.loader.bg.className = "app_loader app_loader_hidden";
	} else {
		unloadLoader();
	}
	
}
function unloadLoader(e) {
	if (A.loader.tr.transProp != false) {
		A.loader.bg.removeEventListener(A.loader.tr.transEv, unloadLoader, false);
	}
	A.loader.bg.parentNode.removeChild(A.loader.bg);
	A.loader.bg = A.loader.tr = null;
	A.loader = null;
	delete A.loader;
}