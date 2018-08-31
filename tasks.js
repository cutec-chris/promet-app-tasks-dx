rtl.module("tasks",["System","JS","Web","Classes","Avamm","webrouter","AvammForms","SysUtils","DB","dhtmlx_base","dhtmlx_dataview"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass($mod,"TKanbanTaskForm",pas.AvammForms.TAvammListForm,function () {
    this.$init = function () {
      pas.AvammForms.TAvammListForm.$init.call(this);
      this.ToDo = null;
      this.InProgress = null;
      this.Testing = null;
      this.Done = null;
    };
    this.$final = function () {
      this.ToDo = undefined;
      this.InProgress = undefined;
      this.Testing = undefined;
      this.Done = undefined;
      pas.AvammForms.TAvammListForm.$final.call(this);
    };
    this.Create$2 = function (aParent, aDataSet, aPattern) {
      pas.AvammForms.TAvammListForm.Create$2.call(this,aParent,aDataSet,aPattern);
      this.Page.cells("a").showHeader();
      this.Page.cells("a").setText(rtl.getResStr(pas.tasks,"strBacklog"));
      this.Page.cells("b").setText(rtl.getResStr(pas.tasks,"strInProgress"));
      this.Page.cells("c").setText(rtl.getResStr(pas.tasks,"strTesting"));
      this.Page.cells("d").setText(rtl.getResStr(pas.tasks,"strDone"));
      this.Page.cells("d").collapse();
      this.ToDo = rtl.getObject(this.Page.cells("a").attachDataView(pas.JS.New([])));
      this.ToDo.customize(pas.JS.New(["template","#SUMMARY#<br>#PROJECT#","height",40]));
      this.InProgress = rtl.getObject(this.Page.cells("b").attachDataView(pas.JS.New([])));
      this.Testing = rtl.getObject(this.Page.cells("c").attachDataView(pas.JS.New([])));
      this.Done = rtl.getObject(this.Page.cells("d").attachDataView(pas.JS.New([])));
      this.Toolbar.unload();
    };
    this.DoLoadData = function () {
      var dv = null;
      this.FDataSet.First();
      while (!this.FDataSet.FEOF) {
        if ((this.FDataSet.FieldByName("COMPLETED").GetAsString() !== "Y") && this.FDataSet.FieldByName("STARTEDAT").GetIsNull()) {
          dv = this.ToDo}
         else if (this.FDataSet.FieldByName("COMPLETED").GetAsString() !== "Y") {
          dv = this.InProgress}
         else if ((this.FDataSet.FieldByName("COMPLETED").GetAsString() === "Y") && (this.FDataSet.FieldByName("CHECKED").GetAsString() !== "Y")) {
          dv = this.Testing}
         else dv = this.Done;
        dv.add(this.FDataSet.GetActiveRecord());
        this.FDataSet.Next();
      };
    };
  });
  this.List = null;
  this.ShowTasks = function (URl, aRoute, Params) {
    var aParent = null;
    if (!($mod.List != null)) {
      aParent = rtl.getObject(pas.Avamm.GetAvammContainer());
      $mod.List = $mod.TKanbanTaskForm.$create("Create$2",[aParent,"tasks","4W"]);
    };
    $mod.List.Show();
  };
  $mod.$resourcestrings = {strTasks: {org: "Aufgaben"}, strBacklog: {org: "zu erledigen"}, strInProgress: {org: "in Arbeit"}, strTesting: {org: "in Prüfung"}, strDone: {org: "erledigt"}};
  $mod.$init = function () {
    if (pas.Avamm.getRight("tasks") > 0) pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.tasks,"strTasks"),"tasks",$mod.ShowTasks,"fa-task");
  };
});
//# sourceMappingURL=tasks.js.map
