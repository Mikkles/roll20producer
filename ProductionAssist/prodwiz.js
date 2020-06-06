const Roll20Pro = (() => {
    let menuText = "",
        category = [];

    if (!_.has(state, "Roll20Pro")) {
        state.Roll20Pro = {};
        state.Roll20Pro.sortCats = {};
    }

    const scriptName = "Roll20 Producer Wizard",
        version = "0.5",

        styles = {
            reset: 'padding: 0; margin: 0;',
            menu: 'background-color: #fff; border: 1px solid #000; padding: 5px; font-family: &quot;Good Pro Condensed&quot;, &quot;Roboto&quot;, &quot;Verdana&quot;,sans-serif;, ',
            button: 'background-color: pink; border: 1px solid black; border-radius: 3px; padding: 0px, 2px; margin: 2px; color: #000; text-align: center; ',
            textButton: 'background-color: transparent; border: none; padding: 0; color: #000; text-decoration: underline',
            list: 'list-style: none;',
            float: {
                right: 'float: right;',
                left: 'float: left;'
            },
            overflow: 'overflow: hidden;',
            fullWidth: 'width: 100%;',
            title: 'margin-bottom: 10px; text-transform: capitalize; border-bottom: 2px solid; '
        },

        makeTitle = (title) => {
            return '<h2 style="' + styles.title + '">' + title + '</h2>';
        },

        makeButton = (title, href, style) => {
            return '<a style="' + style + '" href="' + href + '">' + title + '</a>';
        },

        makeAndSendMenu = (contents, title, whisper, callback) => {
            title = (title && title != '') ? makeTitle(title) : '';
            whisper = (whisper && whisper !== '') ? '/w ' + whisper + ' ' : '';
            sendChat(scriptName, whisper + '<div style="' + styles.menu + styles.overflow + '">' + title + contents + '</div>', null, {
                noarchive: true
            });
        },

        makeText = (x, y, defaultText) => {
            let newObj = createObj('text', {
                pageid: Campaign().get("playerpageid"),
                layer: "objects",
                top: y,
                left: x,
                text: defaultText,
                font_family: "Patrick Hand",
                font_size: 32
            });
            return newObj.id;
        },

        chatMenu = () => {
            menuText = "";
            menuText += "**TOKEN PAGE CREATOR**<br />This tool allows you to quickly make Token Pages. It requires you to"
            + "have a page titled 'Token Page' with the player bookmark on it. <br />"
            menuText += makeButton("Token Page Menu", "!prod tokenPage", styles.button);
            makeAndSendMenu(menuText, scriptName, 'gm');
        },

        handleInput = (msg) => {
            if (msg.type == "api" && msg.content.indexOf("!prod") === 0) {
                var selected = msg.selected;
                var args = msg.content.split(" ");
                var command = args[1];

                switch (command) {
                    default:
                        log("Error, no command found for Roll20 Production");

                    case "menu":
                        chatMenu();
                        break;

                        ///////////TOKEN PAGE MAKER//////////////
                    case "tokenPage":
                        if (!args[2]) {
                            menuText = "";
                            menuText +=  "To begin, all tokens in the game should be dragged onto the page titled 'Token Page' in any order, "
                            + "but grouped roughly by category so you can select them easily later. <br /><br />"
                            
                            + "**Categorizing.** "
                            + "To categorize tokens into, for example, 'Named NPCs and Creatures' or 'NPC Spaceships'...<br /> "
                            + "**1.** Decide the order of each category, and assign it a number; for example, Named NPCs are category 1, "
                            + "NPC Spaceships are category 3, and so on. Lower numbered categories will be sorted first, and uncategorized "
                            + "tokens will always be sorted last. <br />"
                            + "**2.** Select tokens you want to put in a particular category. Then, click the 'Change Token Category' button "
                            + "and enter the category number in the prompt. This will tag the selected tokens as " 
                            + "belonging to that category. Repeat this for each category. <br />"
                            
                    
                            menuText += makeButton("Change Token Category", "!prod tokenPage addSort ?{Category Number}", styles.button);
                            
                            menuText += "<br />**Token Page Creator.** Once you've categorized everything, click this to sort tokens. If you "
                            + "make changes to the tokens or recategorize anything, click this again to resort.<br />";
                            menuText += makeButton("Run Token Page Creator", "!prod tokenPage run", styles.button);
                            menuText += "<br />**See Categories.** To view the categories of each token, click this. <br />";
                            menuText += makeButton("See Categories", "!prod tokenPage seeCats", styles.button);
                            menuText += "<br />**Reset Categories.** If you'd like to fully remove all category tags from all tokens, click this. This "
                            + "is irreversable; you'll need to recategorize everything!"
                            menuText += makeButton("Reset Categories", "!prod tokenPage resetCats", styles.button);
                            menuText += "<br /><br />" + makeButton("Back", "!prod menu", styles.button);
                            makeAndSendMenu(menuText, "Token Page Creator", 'gm');

                        } else {
                            switch (args[2]) {
                                default:
                                    makeAndSendMenu("Argument not found for Token Page Creator; please contact Mik.", "Roll20 Producer Error", 'gm');
                                    break;
                                case "resetCats":
                                    state.Roll20Pro.sortCats = {};
                                    break;
                                case "addSort":
                                    if (!args[3]) {
                                        makeAndSendMenu("Need to have some sort of integer!", "Roll20 Producer Error", 'gm');
                                        break;
                                    } else {
                                        int = parseInt(args[3]);
                                        if (int == NaN) {
                                            makeAndSendMenu("Need to set category as an integer!", "Roll20 Producer Error", 'gm');
                                            break;

                                        }
                                        menuText = "";

                                        _.each(selected, function(token) {
                                            tokenID = token._id;
                                            tokenObject = getObj("graphic", tokenID)

                                            state.Roll20Pro.sortCats[tokenID] = int;

                                            name = tokenObject.get("name");
                                            menuText += name + " added to category " + int + "<br />";
                                        })
                                        makeAndSendMenu(menuText, scriptName, 'gm');
                                        //log(state.Roll20Pro.sortCats);

                                    }
                                    break;
                                case "seeCats":
                                    menuText = "";

                                    Object.keys(state.Roll20Pro.sortCats).forEach(key => {
                                        token = getObj("graphic", key)
                                        name = token.get("name");
                                        category = state.Roll20Pro.sortCats[key];
                                        menuText += name + " is in category " + category + ".<br />"
                                    })

                                    menuText += "<br />" + makeButton("Back", "!prod tokenPage", styles.button);
                                    makeAndSendMenu(menuText, "Categories", 'gm');

                                    break;

                                case "run":
                                    //SAFETY TEST
                                    let page = getObj("page", Campaign().get("playerpageid"));
                                    let pageName = page.get("name");

                                    if (pageName != "Token Page") {
                                        makeAndSendMenu("For safety, the page with the player ribbon must be named Token Page! Double check you're on the right page!", "Token Page Maker", 'gm');
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
                                    //INITIALIZE SOME VARS
                                    var x = 70;
                                    var y = 70;
                                    var tallestHeight = 0;
                                    var pageWidth = page.get("width") * 70;
                                    var pageHeight = page.get("height") * 70;
                                    var s = state.Roll20Pro.sortCats;
                                    var category = [];
                                    category[99] = [];

                                    //PUT ALL CATEGORIZED TOKENS IN THE CATEGORY ARRAY
                                    Object.keys(s).forEach(tokenID => {
                                        value = s[tokenID];
                                        if (!_.isArray(category[value])) {
                                            category[value] = [];
                                        }
                                        obj = getObj("graphic", tokenID)
                                        category[value].push(obj);

                                    })

                                    //PUT REST OF TOKENS IN CATEGORY[0]
                                    let allTokens = findObjs({
                                        _type: "graphic",
                                        _pageid: Campaign().get("playerpageid")
                                    });
                                    _.each(allTokens, function(token) {
                                        tokenID = token.id;
                                        if (!(tokenID in s)) {
                                            category[99].push(token);
                                        }
                                    })

                                    //FOR EACH CATEGORY, SORT!
                                    for (var cat in category) {
                                        if (category[cat].length) {
                                            let sorted = category[cat].sort(function(a, b) {
                                                let xx = a.get("name").toLowerCase();
                                                let yy = b.get("name").toLowerCase();
                                                if (xx < yy) {
                                                    return -1;
                                                }
                                                if (xx > yy) {
                                                    return 1;
                                                }
                                                return 0;
                                            })

                                            _.each(sorted, function(token) {
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
                                            y = y + tallestHeight + 140;
                                            tallestHeight = 0;
                                            
                                        }

                                    }

                            }
                        }

                        break;
                }
            }
        }

    const registerEventHandlers = function() {
        on('chat:message', handleInput);
    };

    on("ready", () => {
        registerEventHandlers();
    });
})();
