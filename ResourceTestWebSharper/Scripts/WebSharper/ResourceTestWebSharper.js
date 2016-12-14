(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Concurrency,Remoting,AjaxRemotingProvider,UI,Next,Var,Doc,List,AttrProxy,ResourceTestWebSharper,Root,Client,Var1,T;
 Runtime.Define(Global,{
  ResourceTestWebSharper:{
   Root:{
    Client:{
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
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Var=Runtime.Safe(Next.Var);
  Doc=Runtime.Safe(Next.Doc);
  List=Runtime.Safe(Global.WebSharper.List);
  AttrProxy=Runtime.Safe(Next.AttrProxy);
  ResourceTestWebSharper=Runtime.Safe(Global.ResourceTestWebSharper);
  Root=Runtime.Safe(ResourceTestWebSharper.Root);
  Client=Runtime.Safe(Root.Client);
  Var1=Runtime.Safe(Next.Var1);
  return T=Runtime.Safe(List.T);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
