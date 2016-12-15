(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,ResourceTestWebSharper,WebSite,Client,Remoting,CustomXhrProvider,Remoting1,Concurrency,AjaxRemotingProvider,UI,Next,Var,Doc,List,AttrProxy,Var1,T;
 Runtime.Define(Global,{
  ResourceTestWebSharper:{
   WebSite:{
    Client:{
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
      var token,arg20,arg201,arg202;
      Remoting.installBearer();
      token=Var.Create("");
      arg20=List.ofArray([Doc.TextView(token.get_View())]);
      arg202=function()
      {
       return Client.onClick(function(arg10)
       {
        return Var1.Set(token,arg10);
       });
      };
      arg201=List.ofArray([Doc.Button("Rpc",Runtime.New(T,{
       $:0
      }),arg202)]);
      return Doc.Element("div",List.ofArray([AttrProxy.Create("class","box")]),List.ofArray([Doc.TextNode("Hello world"),Doc.Element("div",[],arg20),Doc.Element("div",[],arg201)]));
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
  Remoting=Runtime.Safe(Client.Remoting);
  CustomXhrProvider=Runtime.Safe(Remoting.CustomXhrProvider);
  Remoting1=Runtime.Safe(Global.WebSharper.Remoting);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  AjaxRemotingProvider=Runtime.Safe(Remoting1.AjaxRemotingProvider);
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Var=Runtime.Safe(Next.Var);
  Doc=Runtime.Safe(Next.Doc);
  List=Runtime.Safe(Global.WebSharper.List);
  AttrProxy=Runtime.Safe(Next.AttrProxy);
  Var1=Runtime.Safe(Next.Var1);
  return T=Runtime.Safe(List.T);
 });
 Runtime.OnLoad(function()
 {
  Remoting.originalProvider();
  return;
 });
}());
