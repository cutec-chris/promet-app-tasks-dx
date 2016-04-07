var mainSidebar;
var mainToolbar;

function appInit() {
	
	// init sidebar
	mainSidebar = new dhtmlXSideBar({
		parent: document.body,
		icons_path: "imgs/sidebar/",
		width: 180,
		template: "tiles",
		items: [
			{id: "contacts", text: "Contacts", icon: "contacts.png"},
			{id: "projects", text: "Projects", icon: "projects.png"},
			{id: "events",   text: "Events",   icon: "events.png"  },
			{id: "settings", text: "Settings", icon: "settings.png"}
		]
	});
	
	// init toolbar
	mainToolbar = mainSidebar.attachToolbar({
		icons_size: 32,
		icons_path: "imgs/toolbar/",
		items: [
			{type: "text", id: "title", text: "&nbsp;"},
			{type: "spacer"},
			{type: "button", id: "add", img: "add.png"},
			{type: "button", id: "save", img: "save.png"}
		]
	});
	
	mainSidebar.attachEvent("onSelect", function(id){
		mainToolbar.setItemText("title", window.dhx4.template("<span style='font-weight: bold; font-size: 14px;'>#text#</span>", {text:mainSidebar.cells(id).getText().text}));
		window.dhx4.callEvent("onSidebarSelect", [id, this.cells(id)]);
	});
	
	mainSidebar.cells("contacts").setActive(true);
	
}

function appUnload() {
	if (mainSidebar != null && mainSidebar.unload != null) {
		mainSidebar.unload();
		mainSidebar = null;
	}
}

window.dhx4.attachEvent("init", appInit);
window.dhx4.attachEvent("unload", appUnload);