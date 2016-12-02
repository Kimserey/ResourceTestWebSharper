(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,UI,Next,Doc,AttrProxy,ResourceLibrary,Client;
 Runtime.Define(Global,{
  ResourceLibrary:{
   Client:{
    page:Runtime.Field(function()
    {
     return Doc.Concat([Doc.Element("div",[AttrProxy.Create("class","library-style")],[Doc.TextNode("Hello from library")])]);
    })
   }
  }
 });
 Runtime.OnInit(function()
 {
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Doc=Runtime.Safe(Next.Doc);
  AttrProxy=Runtime.Safe(Next.AttrProxy);
  ResourceLibrary=Runtime.Safe(Global.ResourceLibrary);
  return Client=Runtime.Safe(ResourceLibrary.Client);
 });
 Runtime.OnLoad(function()
 {
  Client.page();
  return;
 });
}());
