/*
Roll20 Prod Wizard
By Mik
*/
on("ready", function() {
    scriptName = "Prod Wizard"
    sendChat(scriptName, "<b>Prod Wizard appears!</b><br>Use '!prod tokenPage' or '!prod mapSizer' to begin!", null, {
        noarchive: true
    });
});
on("chat:message", function(msg) {
    if (msg.type == "api" && msg.content.indexOf("!prod") === 0) {
        var args = msg.content.split(" ");
        var command = args[1];
        if (command = "tokenPage") {
            let page = getObj("page", Campaign().get("playerpageid"));
            let pageName = page.get("name");
            //log(pageName);
            if (pageName != "Token Page") {
                sendChat("Prod Wizard", "For safety, the page with the player ribbon must be named Token Page! Double check you're on the right page!", null, {
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
            _.each(text, function(star) {
                star.remove();
            })
            var x = 70;
            var y = 70;
            var tallestHeight = 0;
            var pageWidth = page.get("width") * 70;
            var pageHeight = page.get("height") * 70;
            var markers = ["", "red", "blue", "green", "brown", "purple", "pink", "yellow"]
            _.each(markers, function(marker) {
                let unsorted = findObjs({
                    _type: "graphic",
                    _pageid: Campaign().get("playerpageid"),
                    statusmarkers: marker
                });
                if (unsorted.length != 0) {
                    y = y + tallestHeight + 70;
                    
                    let tokens = unsorted.sort(function(a, b) {
                        let name1 = a.get("name");
                        let xx = name1.toLowerCase();
                        let name2 = b.get("name");
                        let yy = name2.toLowerCase();
                        if (xx < yy) {
                            return -1;
                        }
                        if (xx > yy) {
                            return 1;
                        }
                        return 0;
                    });
                    _.each(tokens, function(token) {
                        width = token.get("width");
                        height = token.get("height");
                        if (x + width >= pageWidth) {
                            x = 70;
                            y = y + tallestHeight + 70;
                            tallestHeight = 0;
                        }
                        while (y + height >= pageHeight) {
                            page.set("height", (pageHeight / 70) + 1);
                            pageHeight = page.get("height") * 70;
                        }
                        token.set("left", x + (width / 2));
                        token.set("top", y + (height / 2));
                        sides = token.get("sides");
                        if (sides.length) {
                            createObj("text", {
                                text: "*",
                                left: x + width,
                                top: y,
                                width: 20,
                                height: 20,
                                layer: "objects",
                                pageid: Campaign().get("playerpageid"),
                                font_size: 22
                            })
                        }
                        x = x + width + 70;
                        tallestHeight = (height > tallestHeight) ? height : tallestHeight;
                    })
                    
                    x = 70;
                    y = y + tallestHeight + 70;
                    tallestHeight = 0;
                }
            })
            sendChat(scriptName, "Tokens should be sorted! If they're not, there's a problem!", null, {
                noarchive: true
            });
        } else if (command = "mapSizer") {
            log("Map Sizer Selected");
        } else {
            sendChat(scriptName, "Your command wasn't recognized. Use tokenPage or mapSizer.", null, {
                noarchive: true
            });
        }
    }
});
