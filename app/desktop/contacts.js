var contactsGrid;
var contactsLayout;
var contactsForm;

function contactsInit(cell) {
	
	if (contactsLayout == null) {
		
		// init layout
		contactsLayout = cell.attachLayout("2U");
		contactsLayout.cells("a").hideHeader();
		contactsLayout.cells("b").hideHeader();
		contactsLayout.cells("b").setWidth(330);
		contactsLayout.cells("b").fixSize(true, true);
		contactsLayout.setAutoSize("a", "a;b");
		
		// attach grid
		contactsGrid = contactsLayout.cells("a").attachGrid();
		//contactsGrid.load(A.server+"contacts.xml?type="+A.deviceType, function(){
		//	contactsGrid.selectRow(0, true);
		//});
		contactsGrid.attachEvent("onRowSelect", contactsFillForm);
		contactsGrid.attachEvent("onRowInserted", contactsGridBold);
		
		// attach form
		contactsForm = contactsLayout.cells("b").attachForm([
			{type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
			{type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65},
			{type: "input", name: "name",    label: "Name", offsetTop: 20},
			{type: "input", name: "email",   label: "E-mail"},
			{type: "input", name: "phone",   label: "Phone"},
			{type: "input", name: "company", label: "Company"},
			{type: "input", name: "info",    label: "Additional info"}
		]);
		//contactsForm.setSizes = contactsForm.centerForm;
		//contactsForm.setSizes();
	}
	
}

function contactsFillForm(id) {
	// update form
	var data = contactsForm.getFormData();
	for (var a in data) {
		var index = contactsGrid.getColIndexById(a);
		if (index != null && index >=0) data[a] = String(contactsGrid.cells(id, index).getValue()).replace(/\&amp;?/gi,"&");
	}
	contactsForm.setFormData(data);
	// change photo
	var img = contactsGrid.cells(id, contactsGrid.getColIndexById("photo")).getValue(); // <img src=....>
	var src = img.match(/src=\"([^\"]*)\"/)[1];
	contactsForm.getContainer("photo").innerHTML = "<img src='imgs/contacts/big/"+src.match(/[^\/]*$/)[0]+"' border='0' class='form_photo'>";
}

function contactsGridBold(r, index) {
	contactsGrid.setCellTextStyle(contactsGrid.getRowId(index), contactsGrid.getColIndexById("name"), "font-weight:bold;border-left-width:0px;");
	contactsGrid.setCellTextStyle(contactsGrid.getRowId(index), contactsGrid.getColIndexById("photo"), "border-right-width:0px;");
}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "contacts") contactsInit(cell);
});