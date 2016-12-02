(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,UI,Next,Doc,AttrProxy;
 Runtime.Define(Global,{
  ResourceLibrary:{
   Client:{
    page:function()
    {
     return Doc.Concat([Doc.Element("div",[AttrProxy.Create("class","library-style")],[Doc.TextNode("Hello from library")])]);
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Doc=Runtime.Safe(Next.Doc);
  return AttrProxy=Runtime.Safe(Next.AttrProxy);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
