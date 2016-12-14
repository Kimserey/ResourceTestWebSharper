namespace LibraryWithTemplate

open WebSharper
open WebSharper.UI.Next

type TestTemplate = Templating.Template<"template.html">

[<JavaScript>]
module Test =
    
    let main() = TestTemplate.Doc()