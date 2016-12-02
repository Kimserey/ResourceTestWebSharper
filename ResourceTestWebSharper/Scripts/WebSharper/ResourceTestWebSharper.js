(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,List,UI,Next,Doc;
 Runtime.Define(Global,{
  ResourceTestWebSharper:{
   Client:{
    main:function()
    {
     var arg20;
     arg20=List.ofArray([Doc.TextNode("hello")]);
     return Doc.Element("div",[],arg20);
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  List=Runtime.Safe(Global.WebSharper.List);
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  return Doc=Runtime.Safe(Next.Doc);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
