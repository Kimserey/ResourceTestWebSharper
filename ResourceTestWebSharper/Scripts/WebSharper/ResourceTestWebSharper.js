(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,ResourceLibrary,Client;
 Runtime.Define(Global,{
  ResourceTestWebSharper:{
   Client:{
    main:function()
    {
     return Client.page();
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  ResourceLibrary=Runtime.Safe(Global.ResourceLibrary);
  return Client=Runtime.Safe(ResourceLibrary.Client);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
