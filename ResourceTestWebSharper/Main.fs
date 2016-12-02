namespace ResourceTestWebSharper

open WebSharper.Html.Server
open WebSharper
open WebSharper.Sitelets
open WebSharper.UI.Next
open WebSharper.UI.Next.Html
open WebSharper.UI.Next.Server

type MainTemplate = Templating.Template<"Main.html">

[<JavaScript>]
module Client =

    let main () =
        ResourceLibrary.Client.page()

module Root =
    open global.Owin
    open Microsoft.Owin.Hosting
    open Microsoft.Owin.StaticFiles
    open Microsoft.Owin.FileSystems
    open WebSharper.Owin

    let site =
        Application.SinglePage(fun _ -> Content.Page(MainTemplate.Doc("Test", [ client <@ Client.main() @> ]))) 

    [<EntryPoint>]
    let main args =
        let rootDirectory, url =
            match args with
            | [| rootDirectory; url |] -> rootDirectory, url
            | [| url |] -> "..", url
            | [| |] -> "..", "http://localhost:9000/"
            | _ -> eprintfn "Usage: ResourceTestWebSharper ROOT_DIRECTORY URL"; exit 1

        use server = WebApp.Start(url, fun appB ->
            appB.UseStaticFiles(
                    StaticFileOptions(
                        FileSystem = PhysicalFileSystem(rootDirectory)))
                .UseSitelet(rootDirectory, site)
            |> ignore)
        stdout.WriteLine("Serving {0}", url)
        stdin.ReadLine() |> ignore
        0
