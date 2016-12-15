namespace ResourceTestWebSharper

open System
open System.Security.Claims
open System.Security.Principal
open WebSharper
open WebSharper.Sitelets
open WebSharper.UI.Next
open WebSharper.UI.Next.Html
open WebSharper.UI.Next.Server
open WebSharper.Resources
open global.Owin
open Microsoft.Owin
open Microsoft.Owin.Security
open Microsoft.Owin.Hosting
open Microsoft.Owin.StaticFiles
open Microsoft.Owin.FileSystems
open WebSharper.Owin
open WebSharper.Web
open Newtonsoft.Json

type UserIdentity = 
    {
        Name: string
        IsAuthenticated: bool
        AuthenticationType: string
    } with
        interface IIdentity with
            member self.AuthenticationType = self.AuthenticationType
            member self.IsAuthenticated = self.IsAuthenticated
            member self.Name = self.Name

type UserPrincipal =
    {
        Identity: UserIdentity
        Claims: string list
    } with
        interface IPrincipal with
            member self.Identity with get() = self.Identity :> IIdentity 
            member self.IsInRole role = self.Claims |> List.exists ((=) role)

type JwtPayload =
    {
        [<JsonProperty "principal">]
        Principal: UserPrincipal
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

module ResourceTest =
    
    type TestCss() =
        inherit BaseResource("test.css")

    [<assembly: System.Web.UI.WebResource("test.css", "html/css");
      assembly: Require(typeof<TestCss>)>]
    do()

type MainTemplate = Templating.Template<"Main.html">

module JwtToken =

    // TODO authenticate and generate Principal then jsn payload

    let generate key (subject: string) (expiry: DateTime) =
        let payload = 
            {
                Issuer = "com.kimserey"
                Subject = subject
                Expiry = expiry
                IssuedAtTime = DateTime.UtcNow
                Id = Guid.NewGuid().ToString("N")
                Principal = Unchecked.defaultof<UserPrincipal>
            }
        Jose.JWT.Encode(JsonConvert.SerializeObject(payload), Convert.FromBase64String(key), Jose.JwsAlgorithm.HS256);

    let decode key token =
        JsonConvert.DeserializeObject<JwtPayload>(Jose.JWT.Decode(token, Convert.FromBase64String(key)))

module Authentication =
    open System.Threading.Tasks
    open Microsoft.Owin.Security.Infrastructure

    type JwtMiddlewareOptions(privateKey) =
        inherit AuthenticationOptions("Bearer")

        member val PrivateKey = privateKey

    type private JwtAuthenticationHandler() =
        inherit AuthenticationHandler<JwtMiddlewareOptions>()

        // The core authentication logic which must be provided by the handler. Will be invoked at most once per request. Do not call directly, call the wrapping Authenticate method instead.(Inherited from AuthenticationHandler.)
        override self.AuthenticateCoreAsync() =
            let prefix = "Bearer "

            match self.Context.Request.Headers.Get("Authorization") with
            | token when not (String.IsNullOrWhiteSpace(token)) && token.StartsWith(prefix) -> 
                let payload =
                    token.Substring(prefix.Length)
                    |> JwtToken.decode self.Options.PrivateKey
                
                if payload.Expiry > DateTime.UtcNow then
                    Task.FromResult(null)
                else
                    Task.FromResult(new AuthenticationTicket(new ClaimsIdentity(payload.Principal.Identity, payload.Principal.Claims |> List.map (fun claim -> Claim(ClaimTypes.Role, claim))), new AuthenticationProperties()))
            | _ -> 
                Task.FromResult(null)

    type JwtMiddleware(next, options) =
        inherit AuthenticationMiddleware<JwtMiddlewareOptions>(next, options)

        override __.CreateHandler() =
            JwtAuthenticationHandler() :> AuthenticationHandler<JwtMiddlewareOptions>

module WebSite =
    open System
    open System.Collections
    open System.Collections.Generic
    open System.Security.Cryptography
    open Authentication
    open JwtToken
    
    module private Rpcs =

        [<Rpc>]
        let token() =
            let ctx = Remoting.GetContext()
            let owinContext = unbox<OwinContext> <| ctx.Environment.["OwinContext"]

            
            async { 
//                return generateToken "some_user" (DateTime.UtcNow.AddMinutes(2.))
                return ""
            }
    

    [<JavaScript>]
    module private Client =
        open WebSharper.JavaScript
        open WebSharper.UI.Next.Client
        
        [<AutoOpen>]
        module private Remoting =
            open WebSharper.JavaScript

            let private originalProvider = WebSharper.Remoting.AjaxProvider

            type CustomXhrProvider () =
                member this.AddHeaders(headers) =
                    JS.Set headers "Authorization" "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb20ua2ltc2VyZXkiLCJzdWIiOiJzb21lX3VzZXIiLCJleHAiOiIyMDE2LTEyLTE0VDIzOjUzOjQxLjA0NTA3OThaIiwiaWF0IjoiMjAxNi0xMi0xNFQyMzo1MTo0MS4wNDUwNzk4WiIsImp0aSI6IjJmMDhlZTAxMDgwNjQ5NzdhMjE5Yjk0NmNiNWU0YWJkIn0.UsRwXaqKrnIENQFw6jp78P79u1R-caGg-NnldvoK0I0"
                    headers

                interface WebSharper.Remoting.IAjaxProvider with
                    member this.Async url headers data ok err =
                        originalProvider.Async url (this.AddHeaders headers) data ok err
                    member this.Sync url headers data =
                        originalProvider.Sync url (this.AddHeaders headers) data
            
            let installBearer() =
                WebSharper.Remoting.AjaxProvider <- CustomXhrProvider()


        let onClick (callback: string -> unit) =
            async {
                let! text = Rpcs.token()
                callback text
            } |> Async.StartImmediate

        let page() =
            Remoting.installBearer()

            let token = Var.Create ""

            divAttr 
                [ attr.``class`` "box" ] 
                [ text "Hello world"
                  div [ Doc.TextView token.View ] 
                  div [ Doc.Button "Rpc" [] (fun () -> onClick (Var.Set token)) ] ]

    let sitelet = Application.SinglePage(fun ctx -> Content.Page(MainTemplate.Doc("Test", [ client <@ Client.page() @> ])))


module EntryPoint =
    open Authentication

    [<EntryPoint>]
    let main args =
        let rootDirectory, url =
            match args with
            | [| rootDirectory; url |] -> rootDirectory, url
            | [| url |] -> "..", url
            | [| |] -> "..", "http://localhost:9000/"
            | _ -> eprintfn "Usage: ResourceTestWebSharper ROOT_DIRECTORY URL"; exit 1

        // Better not to be stored in code 256 bytes encoded in base64
        let privateKey = 
            "Lu0YxSQm4UNb+MG1hZA1xhMJaaenYVMVm8U1I4N7Hm7BdkATU05XZz02y1bAvrrf/6ie1ZRo/6Mb1Oqxg0QJs2QgCBpClD/xup/2AZ3mBetJ0YxDIozYsalGiifNpAKNAayOUz+VgEYgQBh8lOsdiA9mTvr1g0VeNlUAktcTdzb9SqleZnnVZKA8BPWff/gcSXtbFtxEnJM5YJJPayEMyDf1HHfxUmC/0Zu6aQIorxe8puwfYmXgNhzJdAgNT65exM3XBKNzBAv/GcOvw0xIkhqkcoBBYq7Avd/vXjVSIaFmF5tyyRNrkTGkEJ34pl1qWgeU9tHrxNQ1rdmutDSLZg=="

        let startup (app: IAppBuilder) =
            
            // Jwt
            app.Use<JwtMiddleware>(new JwtMiddlewareOptions(privateKey)) 
            |> ignore

            // Websharper sitelet
            let opt = WebSharperOptions<_>()
            opt.ServerRootDirectory <- rootDirectory
            opt.Debug <- true
                
            app.UseWebSharper(opt.WithSitelet(WebSite.sitelet))
               .UseStaticFiles(StaticFileOptions(FileSystem = PhysicalFileSystem(rootDirectory)))
            |> ignore

        use server = WebApp.Start(url, startup)

        stdout.WriteLine("Serving {0}", url)
        stdin.ReadLine() |> ignore
        0
