(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,UI,Next,Doc,List,AttrProxy,ResourceTestWebSharper,Root,Client;
 Runtime.Define(Global,{
  ResourceTestWebSharper:{
   Root:{
    Client:{
     page:Runtime.Field(function()
     {
      return Doc.Element("div",List.ofArray([AttrProxy.Create("class","box")]),List.ofArray([Doc.TextNode("Hello world")]));
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Doc=Runtime.Safe(Next.Doc);
  List=Runtime.Safe(Global.WebSharper.List);
  AttrProxy=Runtime.Safe(Next.AttrProxy);
  ResourceTestWebSharper=Runtime.Safe(Global.ResourceTestWebSharper);
  Root=Runtime.Safe(ResourceTestWebSharper.Root);
  return Client=Runtime.Safe(Root.Client);
 });
 Runtime.OnLoad(function()
 {
  Client.page();
  return;
 });
}());
