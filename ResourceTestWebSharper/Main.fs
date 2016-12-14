namespace ResourceTestWebSharper

open WebSharper.Html.Server
open WebSharper
open WebSharper.Sitelets
open WebSharper.UI.Next
open WebSharper.UI.Next.Html
open WebSharper.UI.Next.Server
open WebSharper.Resources

module ResourceTest =
    
    type TestCss() =
        inherit BaseResource("test.css")

    [<assembly: System.Web.UI.WebResource("test.css", "html/css");
      assembly: Require(typeof<TestCss>)>]
    do()

type MainTemplate = Templating.Template<"Main.html">

module Root =
    open global.Owin
    open Microsoft.Owin
    open Microsoft.Owin.Hosting
    open Microsoft.Owin.StaticFiles
    open Microsoft.Owin.FileSystems
    open WebSharper.Owin
    open WebSharper.Web

    [<Rpc>]
    let get() =
        let ctx = Remoting.GetContext()
        let owinCtx = unbox<OwinContext> <| ctx.Environment.Item("OwinContext")
        
        async { 
            return "Hello world" 
        }

    [<JavaScript>]
    module Client =
        open WebSharper.JavaScript
        open WebSharper.UI.Next.Client

        let onClick() =
            async {
                let! text = get()
                Console.Log text
            } |> Async.StartImmediate

        let page() =
            divAttr 
                [ attr.``class`` "box" ] 
                [ text "Hello world"
                  div [ Doc.Button "Rpc" [] onClick ] ]

    let sitelet = Application.SinglePage(fun ctx -> Content.Page(MainTemplate.Doc("Test", [ client <@ Client.page() @> ])))

    [<EntryPoint>]
    let main args =
        let rootDirectory, url =
            match args with
            | [| rootDirectory; url |] -> rootDirectory, url
            | [| url |] -> "..", url
            | [| |] -> "..", "http://localhost:9000/"
            | _ -> eprintfn "Usage: ResourceTestWebSharper ROOT_DIRECTORY URL"; exit 1

        let startup (app: IAppBuilder) =
            let opt = WebSharperOptions<_>()
            opt.ServerRootDirectory <- rootDirectory
            opt.Debug <- true
                
            app.UseWebSharper(opt.WithSitelet(sitelet))
               .UseStaticFiles(StaticFileOptions(FileSystem = PhysicalFileSystem(rootDirectory)))
            |> ignore

        use server = WebApp.Start(url, startup)

        stdout.WriteLine("Serving {0}", url)
        stdin.ReadLine() |> ignore
        0
