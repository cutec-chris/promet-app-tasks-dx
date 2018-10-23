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

function StringToColor(aStr : string) : string;
function hashCode(s : TJSString) : Integer;
begin
asm
  var h = 0, l = s.length, i = 0;
  if ( l > 0 )
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
  return h;
end;
end;

begin
  Result := copy(IntToHex(hashCode(TJSString.New(aStr)),6),0,6);
end;

constructor TKanbanTaskForm.Create(aParent: TJSElement; aDataSet: string;
  aPattern: string);
  function GenerateCard(obj : TJSObject) : string;
  begin
    Result := '<div style=''width:5px;height:100%;background:#'+StringToColor(string(obj.Properties['PROJECT']))+';float:left;''></div>';
    Result := Result+'<b>'+string(obj.Properties['SUMMARY'])+'</b>';
    Result := Result+'<br>';
    Result := Result+'<p style=''font-size:85%''>'+string(obj.Properties['PROJECT'])+'</p></div>';
  end;

begin
  inherited Create(aParent, aDataSet, aPattern);
  Page.cells('a').showHeader;
  Page.cells('a').setText(strBacklog);
  Page.cells('b').setText(strInProgress);
  Page.cells('c').setText(strTesting);
  Page.cells('d').setText(strDone);
  Page.cells('d').collapse;
  Page.cells('a').collapse;
  ToDo := TDHTMLXDataView(Page.cells('a').attachDataView(js.new(['template',@GenerateCard,
                         'height',60,
                         'padding',0,
                         'width',100,
                         'drag',true
                         ])));
  InProgress := TDHTMLXDataView(Page.cells('b').attachDataView(js.new(['template',@GenerateCard,
                         'height',60,
                         'padding',0,
                         'width',100,
                         'drag',true
                         ])));
  Testing := TDHTMLXDataView(Page.cells('c').attachDataView(js.new(['template',@GenerateCard,
                         'height',60,
                         'padding',0,
                         'width',100,
                         'drag',true
                         ])));
  Done := TDHTMLXDataView(Page.cells('d').attachDataView(js.new(['template',@GenerateCard,
                         'height',60,
                         'padding',0,
                         'width',100,
                         'drag',true
                         ])));
  Toolbar.Destroy;
end;

procedure TKanbanTaskForm.DoLoadData;
var
  dv: TDHTMLXDataView;
begin
  Page.progressOff;
  DataSet.DisableControls;
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
      if Assigned(DataSet.ActiveRecord) then
        dv.add(DataSet.ActiveRecord);
      DataSet.Next;
    end;
  console.log('Progess off');
  DataSet.EnableControls;
end;

initialization
  if getRight('tasks')>0 then
    RegisterSidebarRoute(strTasks,'tasks',@ShowTasks,'fa-task');
end.

