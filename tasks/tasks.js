function RefreshTasks() {
  siTasks.progressOn();
  console.log("Refresh Tasks");
  gTasks.sync(dsTasks);
  siTasks.progressOff();
}
function AddTask() {
  console.log("New Task");
  var aId = gTasks.uid();
  dsTasks.add({id:aId})
  gTasks.sync(dsTasks);
  gTasks.selectCell(gTasks.getRowIndex(aId),1);
  window.setTimeout(function(){
    gTasks.editCell();
    gTasks.enableKeyboardSupport(true);
    gTasks.setActive();
  },1);
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
        ,{id: "seen", type: "button", text: "gesehen", img: "fa fa-eye"}
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
    }
		});
  gTasks = siTasks.attachGrid({parent:"pTasks"});
  gTasks.setImagePath("codebase/imgs/");
  //gTasks.enableAutoWidth(true);
  //gTasks.enableAutoHeight(true);
  gTasks.setSizes();
  gTasks.setHeader(["erledigt","Aufgabe","Projekt","Bis"]);
  gTasks.setColumnIds('DONE,SUMMARY,PROJECT,DUEDATE')
  gTasks.setColTypes("ch,edtxt,co,dhxCalendar");
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
  gTasks.setColumnMinWidth('30', 0);
  gTasks.setColumnMinWidth('100', 1);
  gTasks.setColumnMinWidth('100', 2);
  gTasks.setInitWidths('50,*,*,120');
  //gTasks.attachFooter(",,,#stat_max");
  gTasks.attachEvent("onEditCell", function(stage, id){
     if (stage == 2) {
        gTasks.save(id); //push updates back to the datastore
        gTasks.sync(dsTasks);
    }
  });
  gTasks.init();

  dsTasks = newPrometDataStore('tasks');

  RefreshTasks();
});
