namespace ResourceLibrary

open WebSharper
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Html
open WebSharper.Resources

type LibaryTemplate = Templating.Template<"library-template.html"> 
type LibaryAnotherTemplate = Templating.Template<"library-another-template.html"> 
 
[<AutoOpen>]
module Resources =
    type Style() =
        inherit BaseResource("library-style.css")
    type AnotherStyle() =
        inherit BaseResource("library-another-style.css")

    [<assembly:System.Web.UI.WebResource("library-style.css", "text/css");
      assembly:System.Web.UI.WebResource("library-another-style.css", "text/css")>]
    do()

[<JavaScript>]
module Client =
    
    [<Require(typeof<Style>)>]
    let page() =
        LibaryTemplate.Doc("Hello from library")
        
    [<Require(typeof<AnotherStyle>)>]
    let pageWithAnotherStyle() =
        LibaryAnotherTemplate.Doc("Hello from library")