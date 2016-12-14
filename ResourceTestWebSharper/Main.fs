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
    open System
    open System.Collections
    open System.Collections.Generic
    open System.Security.Cryptography
    open Newtonsoft.Json

    module Token =
        
        type JwtPayload =
            {
                [<JsonProperty "iss">]
                Issuer: string
                [<JsonProperty "sub">]
                Subject: string
                [<JsonProperty "exp">]
                Expiry: DateTime
                [<JsonProperty "iat">]
                IssuedAtTime: DateTime
                [<JsonProperty "jti">]
                Id: string
            }

        // Better not to be stored in code 256 bytes encoded in base64
        let privateKey = 
            "Lu0YxSQm4UNb+MG1hZA1xhMJaaenYVMVm8U1I4N7Hm7BdkATU05XZz02y1bAvrrf/6ie1ZRo/6Mb1Oqxg0QJs2QgCBpClD/xup/2AZ3mBetJ0YxDIozYsalGiifNpAKNAayOUz+VgEYgQBh8lOsdiA9mTvr1g0VeNlUAktcTdzb9SqleZnnVZKA8BPWff/gcSXtbFtxEnJM5YJJPayEMyDf1HHfxUmC/0Zu6aQIorxe8puwfYmXgNhzJdAgNT65exM3XBKNzBAv/GcOvw0xIkhqkcoBBYq7Avd/vXjVSIaFmF5tyyRNrkTGkEJ34pl1qWgeU9tHrxNQ1rdmutDSLZg=="

        let generateToken (subject: string) (expiry: DateTime) =
            let payload = 
                {
                    Issuer = "com.kimserey"
                    Subject = subject
                    Expiry = expiry
                    IssuedAtTime = DateTime.UtcNow
                    Id = Guid.NewGuid().ToString("N")
                }
            Jose.JWT.Encode(JsonConvert.SerializeObject(payload), Convert.FromBase64String(privateKey), Jose.JwsAlgorithm.HS256);

    module Rpcs =
        open Token

        [<Rpc>]
        let token() =
            async { 
                return generateToken "some_user" (DateTime.UtcNow.AddMinutes(2.))
            }

    [<JavaScript>]
    module Client =
        open WebSharper.JavaScript
        open WebSharper.UI.Next.Client

        let onClick (callback: string -> unit) =
            async {
                let! text = Rpcs.token()
                callback text
            } |> Async.StartImmediate

        let page() =
            let token = Var.Create ""

            divAttr 
                [ attr.``class`` "box" ] 
                [ text "Hello world"
                  div [ Doc.TextView token.View ] 
                  div [ Doc.Button "Rpc" [] (fun () -> onClick (Var.Set token)) ] ]

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
