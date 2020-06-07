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
        
        html = {
            battleMap: `
                <h2>Battle Map Scale</h2>
                <p>
                    Map scale varies across the collection of battle maps within <i>PRODUCT NAME</i>. To make movement and token placement ideal, we have adjusted the grid on some of the maps so that tokens are easier to select and
                    manipulate. Listed below are all the maps in this module and what scale they are currently set to.
                </p>
                <hr />
                <h3 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">100 Foot Maps</h3>
                <p style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">Each grid square on the art is 100' with no Roll20 subdivisions. Medium/Small tokens are set to 1 to 1 units (technically 100' by 100') here.</p>
                <p>
                    If you wish to set it for scale accuracy, enable the Grid and set the Grid Size in Page Settings to 0.05 units. Token Sizing is as follows: Medium/Small/Tiny (0.05 unit by 0.05 unit), Large (0.1 unit by 0.1 unit), Huge (0.15 unit by
                    0.15 unit), gargantuan (0.2 unit by 0.2 unit).
                </p>
                <p><br /></p>
                <p>
                    <b>100 Foot Maps in <i>CAMPAIGN NAME</i></b>
                </p>
                <ul>
                    <li>MAP NAME</li>
                </ul>
                <hr />
                <h3>20 Foot Maps</h3>
                <p>
                    Each grid square on the art is 20' with four subdivisions in the Roll20 grid (Grid Size set to 0.5 units). Each Roll20 grid square is 5'. Tokens are sized accordingly to Pathfinder Second Edition rules (5', 10', 15', 20'). No
                    adjustments are needed for strategy accuracy.
                </p>
                
                <p>
                    <b>20 Foot Maps in <i>CAMPAIGN NAME</i></b>
                </p>
                <ul>
                    <li>MAP NAME</li>
                </ul>
                <hr />
                
                <h3 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">5 Foot Maps</h3>
                <p>Each grid square is 5' on the art as well as 5' on the Roll20 grid. No adjustments are needed.<br /></p>
                <p>
                    <br />
                    <strong>5</strong><strong>&nbsp;Foot Maps in <i>CAMPAIGN NAME</i></strong><br />
                </p>
                <ul>
                    <li>MAP NAME</li>
                </ul>
            `,
            credits:`
                <h2>Title</h2>
                <p>
                    Blurb
                </p>
                
                <hr />
                <h3>Roll20</h3>
                <p><b>Roll20 Production Team: </b>Ashton Duncan, Todd Gizzi, Eve Crockett, Echo Diaz, Fulcrum, Mik Holmes, Jennawynn, Gabby Parker, Munky, Rachel Savicki, and Harry Whitelaw.</p>
                <p>
                    <b>Roll20 Staff: </b>Riley Dutton, Richard Zayas, Phil Behrenberg, Kristin Carlson, Dean Bigbee, Austin Kelly, Jeff Lamb, Trivia Fox, Nathanael Winget, Miles Procise, CeeJay Bachus, Soraya Een Hajji, Stephanie Bryant, Tyler Jackson,
                    Kenton Hansen, Eric Levanduski, Vix, Cassie Levett, Olivia Lemmelin, Carlos Luna, Shawn Conlin, Sam Corder, William Elder, Bunny Hanlon, Jelisa Varnado, Amber Cook, Ashton Duncan, June Lalonde, Nicholas Robbins, Dylan Todd, Corey
                    Jeffers, Jarrett Green, Morgan Buck, Todd Gizzi, Preston Wilson, and Nolan T. Jones.
                </p>
                <hr />
            `,
            thankYouPaizo:``,
            thankYouWotc:``,
            thankYouOther:``,
            tablesAndMacros:``,
            rollableTokens:``,
            npcInitPF2:``,
            npcInit5e:``,
            npcInitBB:``,
            gameSettings:``,
            playingBurnBryte:``,
            safetyDeck:``,
            
            
        }

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
        
        findAndMakeHandout = (title, text) => {
            let check = findObjs({_type:'handout', name:title})
            if (!check[0]){
                let handout = createObj("handout", {
                    name: title,
                });
                handout.set({notes:text}); 
            }
        }
        
        makeHandout = (title, text) => {
            let handout = createObj("handout", {
                name: title,
            });
            handout.set({notes:text}); 
        }
        
        findHandout = function (title) {
            let handout = findObjs({_type:'handout', name:title})
            return handout
        },  

        chatMenu = () => {
            menuText = "";
            menuText += "These are tools to help in the creation of Roll20 modules! If you need any help, ask Mik! <br /><br />"
            menuText += "**TOKEN PAGE CREATOR** <br />"
            menuText += makeButton("Token Page Creator Menu", "!prod tokenPage", styles.button);
            menuText += "<br /><br />**TOKEN EDITOR TOOLS** <br />"
            menuText += makeButton("Token Editor Tools Menu","!prod tokenEditor", styles.button);
            menuText += "<br /><br />**ASHTONMANCER** <br />"
            menuText += makeButton("Ashtonmancer Menu","!prod ashtonmancer", styles.button);
            makeAndSendMenu(menuText, "Producer Tools", 'gm');
        },

        handleInput = (msg) => {
            if (msg.type == "api" && msg.content.indexOf("!prod") === 0) {
                var selected = msg.selected;
                var args = msg.content.split(" ");
                var command = args[1];

                switch (command) {
                    default:
                    case "menu":
                        chatMenu();
                        break;

                        ///////////TOKEN PAGE MAKER//////////////
                    case "tokenPage":
                        if (!args[2]) {
                            menuText = "";
                            menuText += makeButton("Change Token Category", "!prod tokenPage addSort ?{Category Number}", styles.button);
                            menuText += makeButton("Run Token Page Creator", "!prod tokenPage run", styles.button);
                            menuText += makeButton("See Categories", "!prod tokenPage seeCats", styles.button);
                            menuText += makeButton("Reset Categories [IF SURE]", "!prod tokenPage resetCats", styles.button);
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
                        
                    ////TOKEN MOD BOOKMARKS
                    case "tokenEditor":
                         if (!args[2]) {
                            menuText = "";
                            menuText += "**Toggle Show Names.**<br />";
                            menuText += makeButton("Toggle Show Names","!token-mod --flip showname",styles.button);
                            menuText += "<br /><br />**Setup NPC Tokens for System.**<br />"
                            menuText += makeButton("D&D 5e", "!token-mod --set bar1_link|hp bar2_link|npc_ac bar3| bar3_link| &#13;!token-mod --set bar1_link|", styles.button);
                            menuText += makeButton("Pathfinder 2e", "!token-mod --set bar1_link|hit_points bar2_link|armor_class bar3| bar3_link| &#13;!token-mod --set bar1_link|", styles.button);
                            menuText += makeButton("Starfinder", "!token-mod --set bar1_link|hp bar2_link|eac bar3_link|kac &#13;!token-mod --set bar1_link|", styles.button);
                            menuText += makeButton("Pathfinder 1e", "!token-mod --set bar1_link|hp bar2_link|ac bar3| bar3_link| &#13;!token-mod --set bar1_link|", styles.button);
                            
                            menuText += "<br />" + makeButton("Reassign", "!token-mod --set defaulttoken", styles.button)
                            
                            
                            menuText += "<br /><br />" + makeButton("Back", "!prod menu", styles.button);
                            makeAndSendMenu(menuText, "Token Editor", 'gm');

                        } else {
                            switch (args[2]){
                                default: 
                                    makeAndSendMenu("Argument not found for Token Tool; please contact Mik.", "Roll20 Producer Error", 'gm');
                                    break;
                                
                                
                            }
                        
                        }
                        break;
                    case "ashtonmancer":
                        if (!args[2]){
                            menuText = "";
                            menuText += "These scripts will create templates for our typical pages and handouts! This should probably "
                            menuText += "only be used by a lead!<br /><br />**First Time Setup.** Run this once (or until Help Handouts are OFF).<br />"
                            menuText += makeButton("First Time Setup", "!the-aaron --toggle-help-handouts&#13;!prod ashtonmancer first", styles.button);
                            menuText += "<br /><br />"
                            menuText += "**THE ASHTONMANCER IS NOT COMPLETE. PLEASE DO NOT USE UNTIL UPDATED** <br />"
                            menuText += makeButton("Create Stock Handouts", "!prod ashtonmancer create", styles.button);

                            makeAndSendMenu(menuText, "Ashtonmancer", 'gm');
                        } else {
                            switch (args[2]){
                                default: 
                                    makeAndSendMenu("Argument not found for Ashtonmancer; please contact Mik.", "Roll20 Producer Error", 'gm');
                                    break;
                                case "first":
                                    var handout = findObjs({ type: 'handout', name: 'Help: TokenMod' });
                                    if (handout && handout[0]){
                                        handout[0].remove();
                                    }
                                    break;
                                case "create":
                                    
                                    findAndMakeHandout("Battle Map Scale", html.battleMap);
                                    findAndMakeHandout("Credits", html.credits);
                                    
                                    
                                    
                                    break;
                            }
                        }
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
