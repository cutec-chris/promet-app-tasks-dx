library tasks;
  uses js, web, classes, Avamm, webrouter, AvammForms, SysUtils, db,
    dhtmlx_calendar,dhtmlx_base, dhtmlx_grid, AvammAutocomplete,
    dhtmlx_dataview;

type

  { TTimeregForm }

  { TTaskForm }

  { TKanbanTaskForm }

  TKanbanTaskForm = class(TAvammListForm)
  private
    ToDo, InProgress, Testing, Done: TDHTMLXDataView;
  protected
  public
    constructor Create(aParent : TJSElement;aDataSet : string;aPattern : string = '4W');override;
    procedure DoLoadData; override;
  end;

resourcestring
  strTasks     = 'Aufgaben';
  strBacklog   = 'zu erledigen';
  strInProgress  = 'in Arbeit';
  strTesting     = 'in Prüfung';
  strDone        = 'erledigt';

var
  List: TAvammListForm = nil;

Procedure ShowTasks(URl : String; aRoute : TRoute; Params: TStrings);
var
  aParent: TJSHTMLElement;
begin
  if not Assigned(List) then
    begin
      aParent := TJSHTMLElement(GetAvammContainer());
      List := TKanbanTaskForm.Create(aParent,'tasks');
    end;
  List.Show;
end;

{ TTaskForm }

constructor TKanbanTaskForm.Create(aParent: TJSElement; aDataSet: string;
  aPattern: string);
begin
  inherited Create(aParent, aDataSet, aPattern);
  Page.cells('a').showHeader;
  Page.cells('a').setText(strBacklog);
  Page.cells('b').setText(strInProgress);
  Page.cells('c').setText(strTesting);
  Page.cells('d').setText(strDone);
  Page.cells('d').collapse;
  ToDo := TDHTMLXDataView(Page.cells('a').attachDataView(js.new([])));
  ToDo.customize(js.new(['template','#SUMMARY#<br>#PROJECT#',
                         'height',40]));
  InProgress := TDHTMLXDataView(Page.cells('b').attachDataView(js.new([])));
  Testing := TDHTMLXDataView(Page.cells('c').attachDataView(js.new([])));
  Done := TDHTMLXDataView(Page.cells('d').attachDataView(js.new([])));
  Toolbar.Destroy;
end;

procedure TKanbanTaskForm.DoLoadData;
var
  dv: TDHTMLXDataView;
begin
  DataSet.First;
  while not DataSet.EOF do
    begin
      if  (DataSet.FieldByName('COMPLETED').AsString<>'Y')
      and (DataSet.FieldByName('STARTEDAT').IsNull) then
        dv := ToDo
      else if (DataSet.FieldByName('COMPLETED').AsString<>'Y') then
        dv := InProgress
      else if (DataSet.FieldByName('COMPLETED').AsString='Y')
          and (DataSet.FieldByName('CHECKED').AsString<>'Y') then
        dv := Testing
      else
        dv := Done;
      dv.add(DataSet.ActiveRecord);
      DataSet.Next;
    end;
end;

initialization
  if getRight('tasks')>0 then
    RegisterSidebarRoute(strTasks,'tasks',@ShowTasks,'fa-task');
end.

