/*
Roll20 Creation Helper
By Mik
*/
on("ready", function() {
    sendChat("Roll20 Creation Helper", "Helper is active!<br>Use '!r20c tokenPage' or '!r20c mapSizer' to begin!", null, {
                noarchive: true
                });
});

on("chat:message", function(msg) {


    if (msg.type == "api" && msg.content.indexOf("!r20c") === 0) {
        var args = msg.content.split(" ");
        var command = args[1];
        if (command = "tokenPage") {
            
            let page = getObj("page", Campaign().get("playerpageid"));
            let pageName = page.get("name");
            log(pageName);
            if (pageName != "Token Page"){
                sendChat("Roll20 Creation Helper", "For safety, the page with the player ribbon must be named Token Page! Double check you're on the right page!", null, {
                noarchive: true
                });
                return;
            }
            
            //REMOVE ASTERISKS
            var text = findObjs({
                _type: "text",
                _pageid: Campaign().get("playerpageid"),
                text: "*"
            })
            _.each(text,function(star){
                star.remove();
            })
            
            var x = 70;
            var y = 70;
            var tallestHeight = 0;
            var pageWidth = page.get("width") *70;
            var pageHeight = page.get("height") *70;
            
            
                //GET UNSORTED
            let unsorted = findObjs({
                _type: "graphic",
                _pageid: Campaign().get("playerpageid"),
                
            });
            let tokens = unsorted.sort(function(a, b){
                let name1 = a.get("name");
                let xx = name1.toLowerCase();
                let name2 = b.get("name");
                let yy = name2.toLowerCase();

              if (xx < yy) {return -1;}
              if (xx > yy) {return 1;}
              return 0;
            });

            _.each(tokens, function(token) {
                width = token.get("width");
                height = token.get("height");
                
                if (x+width >= pageWidth) {
                    x = 70;
                    y = y + tallestHeight + 70;
                    tallestHeight = 0;
                }
                
                while (y + height >= pageHeight) {
                    page.set("height", (pageHeight/70) + 1);
                    pageHeight = page.get("height") *70;
                }
                
                
                token.set("left", x+(width/2));
                token.set("top", y+(height/2));
                
                sides = token.get("sides");
                if(sides.length){
                    createObj("text",{
                        text:"*",
                        left: x+width,
                        top: y,
                        width: 20,
                        height: 20,
                        layer: "objects",
                        pageid: Campaign().get("playerpageid")
                        
                    })
                }
                
                
                x = x + width + 70;
                
                tallestHeight = (height > tallestHeight) ? height : tallestHeight;
                //log(tallestHeight);

            })
                
            
            
            


        sendChat("Roll20 Creation Helper", "Tokens should be sorted! If they're not, there's a problem!", null, {
                noarchive: true
            });
        } else if (command = "mapSizer") {
            log("Map Sizer Selected");



        } else {
            sendChat("Roll20 Creation Helper", "Your command wasn't recognized. Use tokenPage or mapSizer.", null, {
                noarchive: true
            });
        }

    }

});
