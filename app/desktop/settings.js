var settingsDataView;
var settingsLayout;
var settingsForm;

function settingsInit(cell) {
	
	if (settingsLayout == null) {
		
		// init layout
		settingsLayout = cell.attachLayout("2U");
		settingsLayout.cells("a").hideHeader();
		settingsLayout.cells("b").hideHeader();
		settingsLayout.cells("b").setWidth(330);
		settingsLayout.cells("b").fixSize(true, true);
		settingsLayout.setAutoSize("a", "a;b");
		
		// attach data view
		settingsDataView = settingsLayout.cells("a").attachDataView({
			type: {
				template: "<div style='position:relative;'>"+
						"<div class='settings_image'><img src='imgs/settings/#image#' border='0' ondragstart='return false;'></div>"+
						"<div class='settings_title'>#title#"+
							"<div class='settings_descr'>#descr#</div>"+
						"</div>"+
						"</div>",
				margin: 10,
				padding: 20,
				height: 120
			},
			autowidth: 2,
			drag: false,
			select: true,
			edit: false
		});
		
		settingsDataView.load(A.server+"settings.xml?type="+A.deviceType, function(){
			settingsDataView.select("contacts");
		});
		
		settingsDataView.attachEvent("onAfterSelect", function(id){
			// attach form
			var formData = [];
			formData.push({type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160});
			formData = formData.concat(settingsFormStruct[id]);
			settingsForm = settingsLayout.cells("b").attachForm(formData);
			settingsForm.setSizes = settingsForm.centerForm;
			settingsForm.setSizes();
		});
		
	}
	
}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "settings") settingsInit(cell);
});