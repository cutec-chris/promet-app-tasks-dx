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
      var Self = this;
      function GenerateCard(obj) {
        var Result = "";
        Result = ("<div style='width:5px;height:100%;background:#" + $mod.StringToColor("" + obj["PROJECT"])) + ";float:left;'><\/div>";
        Result = ((Result + "<b>") + ("" + obj["SUMMARY"])) + "<\/b>";
        Result = Result + "<br>";
        Result = ((Result + "<p style='font-size:85%'>") + ("" + obj["PROJECT"])) + "<\/p><\/div>";
        return Result;
      };
      pas.AvammForms.TAvammListForm.Create$2.call(Self,aParent,aDataSet,aPattern);
      Self.Page.cells("a").showHeader();
      Self.Page.cells("a").setText(rtl.getResStr(pas.tasks,"strBacklog"));
      Self.Page.cells("b").setText(rtl.getResStr(pas.tasks,"strInProgress"));
      Self.Page.cells("c").setText(rtl.getResStr(pas.tasks,"strTesting"));
      Self.Page.cells("d").setText(rtl.getResStr(pas.tasks,"strDone"));
      Self.Page.cells("d").collapse();
      Self.Page.cells("a").collapse();
      Self.ToDo = rtl.getObject(Self.Page.cells("a").attachDataView(pas.JS.New(["template",GenerateCard,"height",60,"padding",0,"width",100,"drag",true])));
      Self.InProgress = rtl.getObject(Self.Page.cells("b").attachDataView(pas.JS.New(["template",GenerateCard,"height",60,"padding",0,"width",100,"drag",true])));
      Self.Testing = rtl.getObject(Self.Page.cells("c").attachDataView(pas.JS.New(["template",GenerateCard,"height",60,"padding",0,"width",100,"drag",true])));
      Self.Done = rtl.getObject(Self.Page.cells("d").attachDataView(pas.JS.New(["template",GenerateCard,"height",60,"padding",0,"width",100,"drag",true])));
      Self.Toolbar.unload();
    };
    this.DoLoadData = function () {
      var dv = null;
      this.Page.progressOff();
      this.FDataSet.DisableControls();
      this.FDataSet.First();
      while (!this.FDataSet.FEOF) {
        if ((this.FDataSet.FieldByName("COMPLETED").GetAsString() !== "Y") && this.FDataSet.FieldByName("STARTEDAT").GetIsNull()) {
          dv = this.ToDo}
         else if (this.FDataSet.FieldByName("COMPLETED").GetAsString() !== "Y") {
          dv = this.InProgress}
         else if ((this.FDataSet.FieldByName("COMPLETED").GetAsString() === "Y") && (this.FDataSet.FieldByName("CHECKED").GetAsString() !== "Y")) {
          dv = this.Testing}
         else dv = this.Done;
        if (this.FDataSet.GetActiveRecord() != null) dv.add(this.FDataSet.GetActiveRecord());
        this.FDataSet.Next();
      };
      pas.System.Writeln("Progess off");
      this.FDataSet.EnableControls();
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
  this.StringToColor = function (aStr) {
    var Result = "";
    function hashCode(s) {
      var Result = 0;
      var h = 0, l = s.length, i = 0;
      if ( l > 0 )
        while (i < l)
          h = (h << 5) - h + s.charCodeAt(i++) | 0;
      return h;
      return Result;
    };
    Result = pas.System.Copy(pas.SysUtils.IntToHex(hashCode(new String(aStr)),6),0,6);
    return Result;
  };
  $mod.$resourcestrings = {strTasks: {org: "Aufgaben"}, strBacklog: {org: "zu erledigen"}, strInProgress: {org: "in Arbeit"}, strTesting: {org: "in Prüfung"}, strDone: {org: "erledigt"}};
  $mod.$init = function () {
    if (pas.Avamm.getRight("tasks") > 0) pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.tasks,"strTasks"),"tasks",$mod.ShowTasks,"fa-task");
  };
});
//# sourceMappingURL=tasks.js.map
