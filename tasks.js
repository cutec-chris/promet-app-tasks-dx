function RefreshTasks() {
  siTasks.progressOn();
  console.log("Refresh Tasks");
  dsTasks.FillGrid(gTasks);
  siTasks.progressOff();
}
function AddTask() {
  console.log("New Task");
  var aId = gTasks.uid();
  //dsTasks.add({id:aId})
  //gTasks.sync(dsTasks);
  gTasks.addRow(aId,"");
  gTasks.selectCell(gTasks.getRowIndex(aId),1);
  window.setTimeout(function(){
    gTasks.editCell();
    gTasks.enableKeyboardSupport(true);
    gTasks.setActive();
  },1);
}
function SetSeen() {
  gTasks.cells(gTasks.getSelectedRowId(),4).setValue(1);
}
function SetDone() {
  gTasks.cells(gTasks.getSelectedRowId(),0).setValue(1);
}
var siTasks,tbToolbar,gTasks,dsTasks;

dhtmlxEvent(window,"load",function(){
  console.log("Loading Tasks Page...");
  sbMain.addItem({id: 'siTasks', text: 'Aufgaben', icon: ''});
  siTasks = window.parent.sbMain.cells('siTasks');
  tbToolbar = siTasks.attachToolbar({
    parent:"pToolbar",
      items:[
         {id: "new", type: "button", text: "Neu", img: "fa fa-plus-circle"}
        ,{id: "sep1", type: "separator" }
        ,{id: "seen", type: "button", text: "Gesehen", img: "fa fa-eye"}
        ,{id: "done", type: "button", text: "Erledigt", img: "fa fa-check"}
        ,{id: "problem", type: "button", text: "Problem", img: "fa fa-exclamation-triangle"}
        ,{id: "sep1", type: "separator" }
        ,{id: "refresh", type: "button", text: "Aktualisieren", img: "fa fa-refresh"}
      ],
    iconset: "awesome"
  });
  tbToolbar.attachEvent("onClick", function(id) {
    if (id=='new') {
      AddTask();
    } else if (id=='refresh') {
      RefreshTasks();
    } else if (id=='seen') {
      SetSeen();
    } else if (id=='done') {
      SetDone();
    }
		});
  gTasks = siTasks.attachGrid({parent:"pTasks"});
  gTasks.setImagePath("codebase/imgs/");
  //gTasks.enableAutoWidth(true);
  //gTasks.enableAutoHeight(true);
  gTasks.setSizes();
  gTasks.setHeader(["erledigt","Aufgabe","Projekt","Bis","gesehen","Reihenfolge"]);
  gTasks.setColumnIds('COMPLETED,SUMMARY,PROJECT,DUEDATE,SEEN,GPRIORITY')
  gTasks.setColTypes("ch,edtxt,co,dhxCalendar,edtxt,edtxt");
  gTasks.setColumnHidden(4,true);
  gTasks.setColumnHidden(5,true);
  //gTasks.enableEditEvents(false,true,true);
  var cbProject = gTasks.getCombo(2);
  /*
  if (cbProject) {
    cbProject.attachEvent("onOpen", function(){
      //TODO:fill with first Project Items
    });
    cbProject.attachEvent("onChange", function(value, text){
      //TODO:fill with Project Items based on text
    });
  }
  */
  gTasks.setDateFormat("%d.%m.%Y");
  gTasks.setColSorting('ch,str,str,date');
  gTasks.enableValidation(false,false,true,false);
  //gTasks.setColValidators(",NotEmpty,,");
  gTasks.setColumnMinWidth('30' , 0);
  gTasks.setInitWidths('50,*,*,70');
  //gTasks.attachFooter(",,,#stat_max");
  gTasks.init();

  dsTasks = newPrometDataStore('tasks');
  dsTasks.DataProcessor.init(gTasks);

  //RefreshTasks();
});
