(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Concurrency,Remoting,AjaxRemotingProvider,console,UI,Next,Doc,List,AttrProxy,ResourceTestWebSharper,Root,Client,T;
 Runtime.Define(Global,{
  ResourceTestWebSharper:{
   Root:{
    Client:{
     onClick:function()
     {
      var arg00;
      arg00=Concurrency.Delay(function()
      {
       return Concurrency.Bind(AjaxRemotingProvider.Async("ResourceTestWebSharper:0",[]),function(_arg1)
       {
        if(console)
         {
          console.log(_arg1);
         }
        return Concurrency.Return(null);
       });
      });
      return Concurrency.Start(arg00,{
       $:0
      });
     },
     page:function()
     {
      var arg20,arg201;
      arg201=function()
      {
       return Client.onClick();
      };
      arg20=List.ofArray([Doc.Button("Rpc",Runtime.New(T,{
       $:0
      }),arg201)]);
      return Doc.Element("div",List.ofArray([AttrProxy.Create("class","box")]),List.ofArray([Doc.TextNode("Hello world"),Doc.Element("div",[],arg20)]));
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
  console=Runtime.Safe(Global.console);
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Doc=Runtime.Safe(Next.Doc);
  List=Runtime.Safe(Global.WebSharper.List);
  AttrProxy=Runtime.Safe(Next.AttrProxy);
  ResourceTestWebSharper=Runtime.Safe(Global.ResourceTestWebSharper);
  Root=Runtime.Safe(ResourceTestWebSharper.Root);
  Client=Runtime.Safe(Root.Client);
  return T=Runtime.Safe(List.T);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
