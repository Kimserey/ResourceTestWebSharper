(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,ResourceTestWebSharper,WebSite,Client,AjaxHelper,AjaxOptions,Concurrency,Exception,Option,jQuery,String,console,Remoting,CustomXhrProvider,Remoting1,AjaxRemotingProvider,UI,Next,Var,List,AttrProxy,Doc,Var1,T;
 Runtime.Define(Global,{
  ResourceTestWebSharper:{
   WebSite:{
    Client:{
     AjaxHelper:{
      AjaxOptions:Runtime.Class({},{
       get_GET:function()
       {
        return Runtime.New(AjaxOptions,{
         Url:"",
         RequestType:"GET",
         Headers:{
          $:0
         },
         Data:{
          $:0
         },
         ContentType:{
          $:0
         }
        });
       },
       get_POST:function()
       {
        var inputRecord;
        inputRecord=AjaxOptions.get_GET();
        return Runtime.New(AjaxOptions,{
         Url:inputRecord.Url,
         RequestType:"POST",
         Headers:inputRecord.Headers,
         Data:inputRecord.Data,
         ContentType:inputRecord.ContentType
        });
       }
      }),
      httpRequest:function(options)
      {
       return Concurrency.Delay(function()
       {
        return Concurrency.TryWith(Concurrency.Delay(function()
        {
         var arg00;
         arg00=function(tupledArg)
         {
          var ok,ko,_arg5,settings,action,option,action1,option1,action2,option2,value;
          ok=tupledArg[0];
          ko=tupledArg[1];
          _arg5=tupledArg[2];
          settings={
           url:options.Url,
           type:options.RequestType,
           dataType:"json",
           success:function(result)
           {
            return ok(result);
           },
           error:function(jqXHR)
           {
            return ko(Exception.New1(Global.String(jqXHR.status)));
           }
          };
          action=function(c)
          {
           settings.contentType=c;
          };
          option=options.ContentType;
          Option.iter(action,option);
          action1=function(h)
          {
           settings.headers=Runtime.NewObject(h);
          };
          option1=options.Headers;
          Option.iter(action1,option1);
          action2=function(d)
          {
           settings.data=d;
          };
          option2=options.Data;
          Option.iter(action2,option2);
          value=jQuery.ajax(settings);
          return;
         };
         return Concurrency.Bind(Concurrency.FromContinuations(arg00),function(_arg1)
         {
          return Concurrency.Return({
           $:0,
           $0:_arg1
          });
         });
        }),function(_arg2)
        {
         var arg00;
         arg00=String(_arg2);
         console?console.log(arg00):undefined;
         return Concurrency.Return({
          $:1,
          $0:_arg2.message
         });
        });
       });
      }
     },
     Remoting:{
      CustomXhrProvider:Runtime.Class({
       AddHeaders:function(headers)
       {
        headers.Authorization="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb20ua2ltc2VyZXkiLCJzdWIiOiJzb21lX3VzZXIiLCJleHAiOiIyMDE2LTEyLTE0VDIzOjUzOjQxLjA0NTA3OThaIiwiaWF0IjoiMjAxNi0xMi0xNFQyMzo1MTo0MS4wNDUwNzk4WiIsImp0aSI6IjJmMDhlZTAxMDgwNjQ5NzdhMjE5Yjk0NmNiNWU0YWJkIn0.UsRwXaqKrnIENQFw6jp78P79u1R-caGg-NnldvoK0I0";
        return headers;
       },
       Async:function(url,headers,data,ok,err)
       {
        var arg10;
        arg10=this.AddHeaders(headers);
        return Remoting.originalProvider().Async(url,arg10,data,ok,err);
       },
       Sync:function(url,headers,data)
       {
        var arg10;
        arg10=this.AddHeaders(headers);
        return Remoting.originalProvider().Sync(url,arg10,data);
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      }),
      installBearer:function()
      {
       var _;
       _=CustomXhrProvider.New();
       Remoting1.AjaxProvider=function()
       {
        return _;
       };
       return;
      },
      originalProvider:Runtime.Field(function()
      {
       return Remoting1.AjaxProvider();
      })
     },
     onAjaxClick:function(callback)
     {
      var arg00;
      arg00=Concurrency.Delay(function()
      {
       var inputRecord;
       inputRecord=AjaxOptions.get_GET();
       return Concurrency.Bind(AjaxHelper.httpRequest(Runtime.New(AjaxOptions,{
        Url:"something",
        RequestType:inputRecord.RequestType,
        Headers:inputRecord.Headers,
        Data:inputRecord.Data,
        ContentType:inputRecord.ContentType
       })),function(_arg1)
       {
        var _,res;
        if(_arg1.$==1)
         {
          _arg1.$0;
          _=Concurrency.Return(null);
         }
        else
         {
          res=_arg1.$0;
          callback(Global.String(res));
          _=Concurrency.Return(null);
         }
        return _;
       });
      });
      return Concurrency.Start(arg00,{
       $:0
      });
     },
     onClick:function(callback)
     {
      var arg00;
      arg00=Concurrency.Delay(function()
      {
       return Concurrency.Bind(AjaxRemotingProvider.Async("ResourceTestWebSharper:0",[]),function(_arg1)
       {
        callback(_arg1);
        return Concurrency.Return(null);
       });
      });
      return Concurrency.Start(arg00,{
       $:0
      });
     },
     page:function()
     {
      var token,result,ats,arg20,arg201,arg202,arg203,arg204,arg205;
      Remoting.installBearer();
      token=Var.Create("");
      result=Var.Create("");
      ats=List.ofArray([AttrProxy.Create("class","box")]);
      arg20=List.ofArray([Doc.TextView(token.get_View())]);
      arg201=List.ofArray([Doc.TextView(result.get_View())]);
      arg203=function()
      {
       return Client.onClick(function(arg10)
       {
        return Var1.Set(token,arg10);
       });
      };
      arg202=List.ofArray([Doc.Button("Rpc",Runtime.New(T,{
       $:0
      }),arg203)]);
      arg205=function()
      {
       return Client.onAjaxClick(function(arg10)
       {
        return Var1.Set(result,arg10);
       });
      };
      arg204=List.ofArray([Doc.Button("Ajax call",Runtime.New(T,{
       $:0
      }),arg205)]);
      return Doc.Element("div",ats,List.ofArray([Doc.TextNode("Hello world"),Doc.Element("div",[],arg20),Doc.Element("div",[],arg201),Doc.Element("div",[],arg202),Doc.Element("div",[],arg204)]));
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  ResourceTestWebSharper=Runtime.Safe(Global.ResourceTestWebSharper);
  WebSite=Runtime.Safe(ResourceTestWebSharper.WebSite);
  Client=Runtime.Safe(WebSite.Client);
  AjaxHelper=Runtime.Safe(Client.AjaxHelper);
  AjaxOptions=Runtime.Safe(AjaxHelper.AjaxOptions);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Exception=Runtime.Safe(Global.WebSharper.Exception);
  Option=Runtime.Safe(Global.WebSharper.Option);
  jQuery=Runtime.Safe(Global.jQuery);
  String=Runtime.Safe(Global.String);
  console=Runtime.Safe(Global.console);
  Remoting=Runtime.Safe(Client.Remoting);
  CustomXhrProvider=Runtime.Safe(Remoting.CustomXhrProvider);
  Remoting1=Runtime.Safe(Global.WebSharper.Remoting);
  AjaxRemotingProvider=Runtime.Safe(Remoting1.AjaxRemotingProvider);
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Var=Runtime.Safe(Next.Var);
  List=Runtime.Safe(Global.WebSharper.List);
  AttrProxy=Runtime.Safe(Next.AttrProxy);
  Doc=Runtime.Safe(Next.Doc);
  Var1=Runtime.Safe(Next.Var1);
  return T=Runtime.Safe(List.T);
 });
 Runtime.OnLoad(function()
 {
  Remoting.originalProvider();
  return;
 });
}());
