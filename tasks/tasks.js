function RefreshTasks() {
  siTasks.progressOn();
  console.log("Refresh Tasks");
  gTasks.addRow(gTasks.uid(),"0,The Rainmaker,John Grisham,2012/01/01");
  siTasks.progressOff();
}
function AddTask() {
  console.log("New Task");
  var aId = gTasks.uid();
  gTasks.addRow(aId,",,");
  gTasks.selectCell(gTasks.getRowIndex(aId),1);
  window.setTimeout(function(){
    gTasks.editCell();
    gTasks.enableKeyboardSupport(false);
  },1);
}

var siTasks,tbToolbar,gTasks;

dhtmlxEvent(window,"load",function(){                          //provides your script as a handler of the 'onload' HTML event
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
  gTasks.setColTypes("ch,edtxt,co,dhxCalendar");
  gTasks.enableEditEvents(false,true,true);
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
  gTasks.enableValidation(false,false,true, false);
  gTasks.setColValidators(',,,ValidDate');
  gTasks.setColumnMinWidth('30', 0);
  gTasks.setColumnMinWidth('100', 1);
  gTasks.setColumnMinWidth('100', 2);
  gTasks.setInitWidths('50,*,*,120');
  //gTasks.attachFooter(",,,#stat_max");
  gTasks.init();
  RefreshTasks();
});
