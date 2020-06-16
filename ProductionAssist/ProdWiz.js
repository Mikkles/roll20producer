const Roll20Pro = (() => {
    let menuText = "",
        category = [],
        tokenModInstall,
        theAaronConfigInstall;
    if (!_.has(state, "Roll20Pro")) {
        reinstallRoll20Pro();
    }
    
    //IF NEED TO REINSTALL, USE !prod reinstall
    const reinstallRoll20Pro = function(){
        state.Roll20Pro = {};
        state.Roll20Pro.sortCats = {};
        state.Roll20Pro.buddyTracker = {};
    }

    const scriptName = "Roll20 Producer Wizard",
        version = "0.1.9",
        

        //============CHAT RESPONSES SETUP============

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

        makeTitle = function(title) {
            return '<h2 style="' + styles.title + '">' + title + '</h2>';
        },

        makeButton = function(title, href, style) {
            return '<a style="' + style + '" href="' + href + '">' + title + '</a>';
        },

        makeAndSendMenu = function(contents, title, whisper, callback) {
            title = (title && title != '') ? makeTitle(title) : '';
            whisper = (whisper && whisper !== '') ? '/w ' + whisper + ' ' : '';
            sendChat(scriptName, whisper + '<div style="' + styles.menu + styles.overflow + '">' + title + contents + '</div>', null, {
                noarchive: true
            });
        },

        chatMenu = function() {
            menuText = "v" + version + " ready.<br /><br />";
            menuText += "These are tools to help in the creation of Roll20 modules! If you need any help, ask Mik! <br />" +
                "For documentation <a href='https://github.com/Mikkles/roll20producer/tree/master/ProductionAssist'>**click Here**</a><br /><br />";
            menuText += (!tokenModInstall) ? "TOKEN MOD IS NOT INSTALLED.<br />" : "";
            menuText += (!theAaronConfigInstall) ? "THE AARON CONFIG IS NOT INSTALLED.<br />" : "";
            menuText += "**Text Autolinker Examples** <br />"
            menuText += makeButton("Autolinker Examples", "!prod autoLinker", styles.button);
            menuText += "<br /><br />**Token Page Creator.** Script to categorize and autosort Token Pages.<br />"
            menuText += makeButton("Token Page Creator Menu", "!prod tokenPage", styles.button);
            menuText += "<br /><br />**Token Editor Tools.** Quickly edit groups of tokens.<br />"
            menuText += makeButton("Token Editor Tools Menu", "!prod tokenEditor", styles.button);
            menuText += "<br /><br />**Map/Dynamic Lighting Tools.** Tools to assist map making and dynamic lighting.<br />"
            menuText += makeButton("Map Tools Menu", "!prod map", styles.button);
            menuText += "<br /><br />**Art Handout Linker.** Add 'Picture: [Handout: Name]' to character bios. <br />"
            menuText += makeButton("Handout Linker Menu", "!prod artLinker", styles.button);
            menuText += "<br /><br />**Ashtonmancer.** Administrators' tools. <br />"
            menuText += makeButton("Ashtonmancer Menu", "!prod ashtonmancer", styles.button);
            makeAndSendMenu(menuText, scriptName, 'gm');
        },
        
        findAndMakeHandout = function(title, text) {
            let check = findHandout(title);
            if (findHandout(title)) {
                makeHandout(title, text)
            }
        },
        
        findHandout = function(title) {
            let handout = findObjs({
                _type: 'handout',
                name: title
            })
            return handout
        },

        makeHandout = function(title, text) {
            let handout = createObj("handout", {
                name: title,
            });
            handout.set({
                notes: text
            });
        },

        handleInput = function(msg) {
            if (msg.type == "api" && msg.content.indexOf("!prod") === 0) {
                let selected = msg.selected;
                let args = msg.content.split(" ");
                let command = args[1];
                let lastPageID = getObj('player', msg.playerid).get('_lastpage');

                switch (command) {
                    default:
                    case "menu":
                        chatMenu();
                        break;
                    case "map":
                        if (!args[2]){
                            mapToolsMenu();
                        } else {
                            switch (args[2]) {
                                default:
                                    makeAndSendMenu("Argument not found for Map Tools; please contact Mik.", "Roll20 Producer Error", 'gm');
                                    break;
                                case "resizeMap":
                                    resizeMap(args[3],args[4],msg);
                                    break;
                                case "dlSetup":
                                    mapQuickChange(args[3],args[4], msg);
                                    break;
                                case "buddy":
                                    toggleBuddy();
                                    break;
                                case "buddyFinder":
                                    buddyFinder();
                                    break;
                            }
                        }
                        break
                    case "tokenEditor":
                        tokenEditorMenu();
                        break;
                    case "tokenPage":
                        if (!args[2]) {
                            tokenPageMenu();
                        } else {
                            switch (args[2]) {
                                default:
                                    makeAndSendMenu("Argument not found for Token Page Creator; please contact Mik.", "Roll20 Producer Error", 'gm');
                                    break;
                                case "seeCats":
                                    seeCats();
                                    break;
                                case "resetCats":
                                    state.Roll20Pro.sortCats = {};
                                    cleanupNoCatTokens();
                                    break;
                                case "addSort":
                                    log("Got here?")
                                    if (!args[3]) {
                                        makeAndSendMenu("Need to have some sort of integer!", "Roll20 Producer Error", 'gm');
                                        break;
                                    } else {
                                        int = parseInt(args[3]);
                                        if (int == NaN) {
                                            makeAndSendMenu("Need to set category as an integer!", "Roll20 Producer Error", 'gm');
                                            break;
                                        }
                                        addToTokenPageCategories(int, selected);
                                    }
                                    break;
                                case "run":
                                    runGenerateTokenPage();
                                    break;
                                }
                        }
                        break;
                    case "reinstall":
                        reinstallRoll20Pro();
                        break;
                    case "artLinker":
                        if (!args[2]) {
                            artLinkerMenu();
                        } else {
                            switch (args[2]) {
                                default:
                                    makeAndSendMenu("Argument not found for Art Linker; please contact Mik.", "Roll20 Producer Error", 'gm');
                                    break;
                                case "linkAll":
                                    let chars = findObjs({type: "character"})
                                    runArtLinker(chars);
                                    break;
                                case "linkSelected":
                                    let queue = [];
                                    if (selected){
                                        _.each(selected, function(token){
                                            let tokenObj = getObj("graphic", token._id)
                                            let charID = tokenObj.get("represents");
                                            let charObj = getObj("character", charID);
                                            queue.push(charObj)
                                        })
                                        runArtLinker(queue);
                                    } else {
                                           makeAndSendMenu("No tokens selected", "Roll20 Producer Error", 'gm');

                                    }
                                    
                                
                            }
                        }
                                   
                        break;
                    //case...
                }
            }
        },
        //===========TOKEN PAGE GENERATOR=============
        //--------------Create asterisks for token page generator\
    
        tokenPageMenu = function(){
            menuText = "";
            menuText += makeButton("Change Token Category", "!prod tokenPage addSort ?{Category Number}", styles.button);
            menuText += makeButton("See Categories", "!prod tokenPage seeCats", styles.button);
            menuText += "<br /><br />"
            menuText += makeButton("Run Token Page Creator", "!prod tokenPage run", styles.button);
            menuText += makeButton("Reset Categories [IF SURE]", "!prod tokenPage resetCats", styles.button);
            menuText += "<br /><br />" + makeButton("Back", "!prod menu", styles.button);
            makeAndSendMenu(menuText, "Token Page Creator", 'gm');
        },
            
        makeText = function(x, y, defaultText) {
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
        
        checkTokenExistsOrDelete = function(tokenID){
            //log(tokenID);
            tokenObj = getObj("graphic", tokenID);
            
            if (!tokenObj) {
                delete state.Roll20Pro.sortCats[tokenID];
                return false;
            } else {
                return true;
            }
        },
        
        cleanupNoCatTokens = function(){
            //Put all non-categorized tokens in category[99]. 
            //We just assume there's not already 99 categories.
            let allTokens = findObjs({
                _type: "graphic",
                _pageid: Campaign().get("playerpageid")
            });
            _.each(allTokens, function(token) {
                let tokenID = token.id;
                if (!state.Roll20Pro.sortCats[tokenID]) {
                    //log(tokenID + " is added to cats")
                    state.Roll20Pro.sortCats[tokenID] = 99;
                }
            })
        }
        
        //---------------Add to categories
        addToTokenPageCategories = function(arg, selected) {
            log("Adding to Token Page Category")
            menuText = "";
            //For each selected, add to category.
            _.each(selected, function(token) {
                tokenID = token._id;
                tokenObject = getObj("graphic", tokenID)

                state.Roll20Pro.sortCats[tokenID] = arg;

                name = tokenObject.get("name");
                menuText += "<br />" + name;
            })
            cleanupNoCatTokens();
            menuText = "**Added to category: " + arg + "**" + menuText
            makeAndSendMenu(menuText, "Add to Category", 'gm');

        },

        //-------------------Actually run token page!
        runGenerateTokenPage = function() {
            //Safety Test
            let page = getObj("page", Campaign().get("playerpageid"));
            let pageName = page.get("name");
            if (pageName != "Token Page") {
                makeAndSendMenu("For safety, the page with the player ribbon must be named Token Page! Double check you're on the right page!", "Token Page Maker", 'gm');
                return;
            }

            //Remove Asterisks
            var text = findObjs({
                _type: "text",
                _pageid: Campaign().get("playerpageid"),
                text: "*"
            })
            _.each(text, function(star) {
                star.remove();
            })

            //Initialize some vars.
            let x = 70;
            let y = 70;
            let initialY = 70; //This is used to add an extra 70px/1 unit to the height.
            let tallestHeight = 0;
            let pageWidth = page.get("width") * 70; //Pages are in 70px units.
            let pageHeight = page.get("height") * 70;
            //
            category = []; //Clear previous category array.

            //Put all uncategorized tokens in s.
            cleanupNoCatTokens();
            
            //Put all categorized tokens in the category array. 
            Object.keys(state.Roll20Pro.sortCats).forEach(tokenID => { //Object.keys(state.Roll20pro.sortCats)
                value = state.Roll20Pro.sortCats[tokenID];
                if (checkTokenExistsOrDelete(tokenID)) {
                    log("This is run" + tokenID);
                    if (!_.isArray(category[value])) {
                        category[value] = [];
                        log("category made")
                    }
                    obj = getObj("graphic", tokenID)
                    category[value].push(obj);
                }
            })
            
            //For each category, sort the tokens inside them.
            for (var cat in category) {
                if (category[cat].length) {
                    let sorted = category[cat].sort(function(a, b) {
                        let xx = a.get("name").toLowerCase();
                        let yy = b.get("name").toLowerCase();
                        //log("category: " + cat + "widths: " + a.get("width") + " xx: " + xx + " yy: " + yy)
                        if (xx < yy) {
                            return -1;
                        }
                        if (xx > yy) {
                            return 1;
                        }
                        return 0;
                    })
                    

                    //Now sorted, go through each sorted category and place tokens.
                    _.each(sorted, function(token) {
                        
                        width = token.get("width");
                        height = token.get("height");
                        if (x + width >= pageWidth) {
                            x = 70;
                            y = y + tallestHeight + 70 + initialY;
                            tallestHeight = 0;
                            initialY = 0; //we're only using initialY for the first row. There's probably a better way to do this.

                        }
                        //If the height of tokens is larger than the page, add one unit until it's safe.
                        while (y + height >= pageHeight) {
                            page.set("height", (pageHeight / 70) + 1); //Pages are set in units.
                            pageHeight = page.get("height") * 70;
                        }

                        token.set("left", x + (width / 2));
                        token.set("top", y + (height / 2) + initialY);
                        sides = token.get("sides");
                        //If it's a rollable token, add an asterisk.
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
                        tallestHeight = (height > tallestHeight) ? height : tallestHeight; //check if this token is the tallest.
                    })

                    //Now that each in category[i] are sorted, reset for next category. 
                    x = 70;
                    y = y + tallestHeight + 140;
                    tallestHeight = 0;

                }
            }
        },
        
        //------------View categories
        seeCats = function(){
            menuText = "";
            
            Object.keys(state.Roll20Pro.sortCats).forEach(key => {
                if (checkTokenExistsOrDelete(key)){
                    token = getObj("graphic", key)
                    name = token.get("name");
                    category = state.Roll20Pro.sortCats[key];
                    menuText += name + " is in category " + category + ".<br />"
                }
            })

            menuText += "<br />" + makeButton("Back", "!prod tokenPage", styles.button);
            makeAndSendMenu(menuText, "Categories", 'gm');
        },

//===========TOKEN EDITING TOOLS=============
    
        tokenEditorMenu = function(){
            menuText = "Tokens must have 'Represented' filled out. All tools work for all selected tokens.<br /><br />";
            menuText += "**Toggle Show Names.**<br />";
            menuText += makeButton("Toggle Show Names", "!token-mod --flip showname", styles.button);
            menuText += "<br /><br />**Setup NPC Tokens for System.**<br />"
            menuText += makeButton("D&D 5e", "!token-mod --set bar1_link|hp bar2_link|npc_ac bar3| bar3_link| &#13;!token-mod --set bar1_link|", styles.button);
            menuText += makeButton("Pathfinder 2e", "!token-mod --set bar1_link|hit_points bar2_link|ac bar3| bar3_link| &#13;!token-mod --set bar1_link|", styles.button);
            menuText += makeButton("Starfinder", "!token-mod --set bar1_link|hp bar2_link|eac bar3_link|kac &#13;!token-mod --set bar1_link|", styles.button);
            menuText += makeButton("Pathfinder 1e", "!token-mod --set bar1_link|hp bar2_link|ac bar3| bar3_link| &#13;!token-mod --set bar1_link|", styles.button);
            menuText += "<br /><br />**Assign Token as Default Token**"
            menuText += "<br />" + makeButton("Reassign", "!token-mod --set defaulttoken", styles.button)
            menuText += "<br /><br />" + makeButton("Back", "!prod menu", styles.button);
            makeAndSendMenu(menuText, "Token Editor", 'gm');
        },

//==========MAP EDITING TOOLS================
        
        mapToolsMenu = function(){
            menuText = "";
            menuText += "Tools to aid in map/page creation! For all tools, YOU MUST PUT THE PLAYER BOOKMARK ON THE PAGE THAT YOU ARE ON."
            menuText += "<br /><br />**RESIZE MAP+PAGE**<br /> Select map graphic, click button, enter width/height of JPG when prompted. <br /> "
            menuText += makeButton("Resize Map and Page", "!prod map resizeMap ?{Pixel width of JPG} ?{Pixel height of JPG}", styles.button);
            menuText += "<br /><br />**QUICK-CHANGE PAGE SETTINGS**<br />" +
            "**--Grid Width** <br />" +
            makeButton("Width 1", "!prod map dlSetup snapping_increment 1", styles.button) +
            makeButton("Width 0.5", "!prod map dlSetup snapping_increment 0.5", styles.button) +
            makeButton("Width 0.25", "!prod map dlSetup snapping_increment 0.25", styles.button) +
            makeButton("Width 0.125", "!prod map dlSetup snapping_increment 0.125", styles.button) +
            "<br />**--Grid Opacity** <br />" +
            makeButton("Prompt", "!prod map dlSetup grid_opacity ?{1 to 100|100}", styles.button) +
            "<br />**--Grid Color** <br />" +
            makeButton("Default Grey", "!prod map dlSetup gridcolor #C0C0C0", styles.button) +
            makeButton("High Vis Pink", "!prod map dlSetup gridcolor #ff00ff", styles.button) +
            makeButton("High Vis Green", "!prod map dlSetup gridcolor #00ff00", styles.button) +
            makeButton("Med Vis Green", "!prod map dlSetup gridcolor #93c47d", styles.button) +
            "<br /><br />**CREATE DL BUDDY**<br /> Creates a token to test Dynamic Light. <br />" +
            makeButton("Toggle On/Off Buddy", "!prod map buddy", styles.button) + "<br />"
            makeButton
            
            menuText += "<br /><br />" + makeButton("Back", "!prod menu", styles.button);
            makeAndSendMenu(menuText, "Map Tools", 'gm');
        },
        
        resizeMap = function(width, height, msg){
            log("ResizeMap Called");
            selected = msg.selected
            if (!width || width == "" || !height || height == ""){
                makeAndSendMenu("Height or Width arguments not found!", "Roll20 Producer Error", 'gm');
            } else {
                if (!selected || !selected[0]) {
                    makeAndSendMenu("No map image selected!", "Roll20 Producer Error", 'gm');
                } else {
                    
                    let lastPageID = getObj('player', msg.playerid).get('_lastpage');
                    let pageID = Campaign().get("playerpageid")
                    let page = getObj("page", pageID);
                    if (pageID == lastPageID) {
                        page.set("width", width / 70);
                        page.set("height", height / 70);
                        tokenID = selected[0]._id;
                        tokenObject = getObj("graphic", tokenID)
                        tokenObject.set({
                            width: width,
                            height: height,
                            left: width / 2,
                            top: height / 2,
                        });
                    } else {
                        makeAndSendMenu("For safety, The player bookmark must be on your page!", "Roll20 Producer Error", 'gm');
                    }

                }
            }
        },
        
        mapQuickChange = function(param, value, msg){
            if (!param || !value){
                makeAndSendMenu("Parameters not found", "Roll20 Producer Error", 'gm');
            } else {
                let lastPageID = getObj('player', msg.playerid).get('_lastpage');
                let pageID = Campaign().get("playerpageid")
                let page = getObj("page", pageID);
                if (pageID == lastPageID) {
                    page.set(param, value);
                } else {
                    makeAndSendMenu("For safety, The player bookmark must be on your page!", "Roll20 Producer Error", 'gm');
                }
            }
        },
        
        toggleBuddy = function(msg){
            let lastPageID = getObj('player', msg.playerid).get('_lastpage');
            let pageID = Campaign().get("playerpageid")
            let page = getObj("page", pageID);
            if (pageID == lastPageID) {
                if (_.isUndefined(state.Roll20Pro.buddyTracker[pageID])) {
                    state.Roll20Pro.buddyTracker[pageID] = createObj("graphic", {
                        name: "Dynamic Lighting Buddy",
                        imgsrc: 'https://s3.amazonaws.com/files.d20.io/images/140823448/E4Kn8ggLQWyRtaJHzLAPAw/thumb.png?1591297505',
                        _pageid: pageID,
                        layer: "objects",
                        light_radius: "100",
                        top: 70,
                        left: 70,
                        width: 70,
                        height: 70,
                    })
                } else {
                    state.Roll20Pro.buddyTracker[pageID].remove();
                    delete state.Roll20Pro.buddyTracker[pageID]
                }
            } else {
                makeAndSendMenu("For safety, The player bookmark must be on your page!", "Roll20 Producer Error", 'gm');
            }
        },
        
        findBuddies = function(msg){
            pages = ""
            _.each(state.Roll20Pro.buddyTracker, function(buddy){
                page = getObj("page", buddy.get("pageid"))
                pageName = page.get("name");
                pages += pageName + "<br />"
            })
            if (pages !== "") {
                makeAndSendMenu("DL Buddies found on: </br>" + pages, "Buddy Finder", 'gm');
            } else {
                makeAndSendMenu("No Buddies Found!" + pages, "Buddy Finder", 'gm');
            }
        },

//==========HANDOUT EDITING TOOLS=========
        //Art Linker
        
        artLinkerMenu = function(arg){
            menuText = "";
            menuText += "This will connect art handouts onto characters. When using the selected tokens option "
            + "they must have their 'represented' set.<br /><br />"
            menuText += makeButton("Link ALL characters", "!prod artLinker linkAll", styles.button); + "<br /><br />"
            menuText += makeButton("Link ONLY selected tokens", "!prod artLinker linkSelected", styles.button);
 
            makeAndSendMenu(menuText, "Art Handout Linker", 'gm');
        
        },
        
        runArtLinker = function(queue){
        let report = ""
    
        const burndown = () =>{
            if (queue.length){
                let charObj = queue.shift();
                let charName = charObj.get("name");
                let handoutName = "Handout: " + charName;
                let handouts = findObjs ({type:"handout"})
                const burndownHandouts = ()=>{
                  if(handouts.length){
                    let handout = handouts.shift();
                    let hID = handout.id
                    if (handout.get("name") == handoutName){
                        charObj.get("bio", function(bioText){
                            if (!bioText.includes("Picture:")){
                                newText = "<b>Picture: </b><a href='http://journal.roll20.net/handout/" + handout.id + "'>" + handoutName + "</a><br/><br>" + bioText;
                                charObj.set("bio", newText);
                                report += "Added: " + charName + "<br />";
                            }
                            setTimeout(burndownHandouts,0);
                        })
                    } else {
                      setTimeout(burndownHandouts,0);
                    }
                  } else {
                    setTimeout(burndown,0);
                  }
                };
                burndownHandouts();
            } else {
                if (report == ""){
                    makeAndSendMenu("No characters were linked!", "Art Linker Error", 'gm')
                } else {
                    makeAndSendMenu(report, "Links Added", 'gm');
                }
            }
        }
    
        burndown();
    },

//==========AUTO LINKER===================

        autoLink = function(str, callerName) {
            let newStr = ""
            if (str == null) {str = ""};
            let m = str.match(/\[(?:(([^\]|]*))|([^|]*)\|([^\]|]*))\]/g);
            if (m) {
                for (let i = 0; i < m.length; i++) {
                    let n_arr = m[i].toString().match(/\[(?:(([^\]|]*))|([^|]*)\|([^\]|]*))\]/g);
                    let n = n_arr[0]; // Contains the entire piped link
                    let a = n_arr[1]; // Contains everything before pipe
                    let b = n_arr[2]; // Contains everything after pipe
                    let spell;
                    if (a && b) {
                        spell = a.split(":");
                    } else {
                        spell = n.split(":");
                        if (spell[1]) {
                            a = spell[1];
                            b = spell[1];
                            
                        }
                    }
                    //log("a: " + a + " spell: " + spell);

                    switch (spell[0]) {
                        default:
                            let targetObj = findObjs({
                                name: a
                            }, {caseInsensitive: true});
        
                            if (_.isArray(targetObj) && targetObj[0]) {
                                let targetID = targetObj[0].get("id"); //Get the ID of the first object with the name of "a"
                                let targetType = targetObj[0].get("type");
 
                                if (targetType == "handout") {
                                    newStr = str.replace(n, "<a href='http://journal.roll20.net/handout/" + targetID + "'>" + b + "</a>")
                                } else if (targetType == "character") {
                                    newStr = str.replace(n, "<a href='http://journal.roll20.net/character/" + targetID + "'>" + b + "</a>")
                                }
                                //log("NEW STRING FROM AUTOLINKER is:" + newstr)
                            } else {
                                menuText = callerName + ": no object found for " + a + "!";
                                makeAndSendMenu(menuText, "AutoLinker Error", 'gm');
                                //return str;
                            }
                            break;
                        case "5e":
                            a = a.replace("5e:","");
                            if (a == ""){
                                newStr = str.replace(n, "<i><a href='https://roll20.net/compendium/dnd5e/Spells:" + b + "'>" + b + "</a></i>")
                            } else {
                                newStr = str.replace(n, "<i><a href='https://roll20.net/compendium/dnd5e/Spells:" + a + "'>" + b + "</a></i>")
                            }
                            break;
                        case "pf2": 
                            a = a.replace("pf2:","");
                            if (a == ""){
                                newStr = str.replace(n, "<i><a href='https://roll20.net/compendium/pf2/Spells:" + b + "'>" + b + "</a></i>")
                            } else {
                                newStr = str.replace(n, "<i><a href='https://roll20.net/compendium/pf2/Spells:" + a + "'>" + b + "</a></i>")
                            }
                            break;
                    }
                }

                if (newStr !== "") {
                    return newStr;
                } else {
                    return str;
                }

            } else {
                return str;
            }
        },
        
        runAutoLinkTester = function(obj, field) {
            if (!eventChangeLockout) {
                
                eventChangeLockout = true;
                let type = obj.get("_type");
                let name = obj.get("name");
                log("Auto Linker running on: " + name + " - " + field);
                obj.get(field, function(str){
                    let newText = autoLink(str, name)
                    obj.set(field, newText)
                 })
            } else {
                log("Lockout Happened for: " + obj.get("name"));
                eventChangeLockout = false;
            }
            
            
        }

//=============ASHTONMANCER=========
    //List of all of the HTML handouts.
    const html = {
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
        credits: `
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
        thankYouPaizo: `<p>
                    Thank you for your purchase! To see more of our Paizo modules and content, please visit our&nbsp;<a href="https://marketplace.roll20.net/browse/publisher/281/paizo-inc" style="background-color: rgb(255, 255, 255);">Marketplace</a>.
                </p>
                <p>For any issues with <i>PRODUCT NAME</i>, please visit our <a href="https://roll20.zendesk.com/hc/en-us">Help Center</a>.</p>
                <p>
                    Happy Gaming!<br />
                    -Roll20 Production Team<br />
                </p>`,
        thankYouWotc: `
                <p>
                    <span style="color: rgb(64, 64, 64);">Thank you for your purchase! To see more of our Wizards of the Coast modules and content, please visit our&nbsp;</span>
                    <a href="https://marketplace.roll20.net/browse/publisher/242/wizards-of-the-coast" style="background-color: rgb(255, 255, 255);">Marketplace</a><span style="color: rgb(64, 64, 64);">.</span>
                </p>
                <p>
                    <span style="color: rgb(64, 64, 64);">For any issues with <i>PRODUCT NAME</i></span><span style="color: rgb(64, 64, 64);">, please visit our <a href="https://roll20.zendesk.com/hc/en-us">Help Center</a>.</span>
                </p>
                <p>
                    <span style="color: rgb(64, 64, 64);">Happy Gaming!</span><br style="color: rgb(64, 64, 64);" />
                    <span style="color: rgb(64, 64, 64);">-Roll20 Production Team</span><br />
                </p>`,
        thankYouOther: ``,
        tablesAndMacros: `<h2 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">Rollable Random Tables &amp; Macros</h2>
                <p>
                    With&nbsp;<i>PRODUCT NAME</i>, Roll20 has provided all Random Encounters as rollable tables for ease of use, found in the "Collections" tab. In this handout are also Macros for GMs to add to their game as
                    they see fit. Be sure to check the specific handout for random encounters for any additional information.
                </p>
                <hr />
                <h3 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;"><span style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">How To Use</span></h3>
                <p>There are two ways that rollable tables and these macros can be used:</p>
                <p>Rolling from the rollable tables will provide you with the text on the encounter. However, rolling this way always displays this roll to players.</p>
                <p>Rolling using a macro allows you to roll so only the GM can see the results of the roll. These macros also will roll to see if an encounter occurs as a whisper to the GM.&nbsp;</p>
                <p>
                    The included code for macros will only display to the GM. Learn more about macros on the&nbsp;
                    <span style="background-color: rgb(255, 255, 255);"><a href="https://roll20.zendesk.com/hc/en-us/articles/360037256794-Macros">Roll20 Help Center page</a></span>.<br />
                </p>
                <p>For faster access to macros, make sure there is a checkmark next to "Show macro quick bar?" and check "In Bar" next to each macro to display them in a box at the bottom of your screen.</p>
                <hr />`,
        rollableTokens: `<p>
                    The tokens for (LIST TOKENS) are multi-sided rollable table tokens. Each side of
                    these tokens are a different appearance for the creature. To swap between the different sides, right click on one of these tokens and choose Multi-Sided -&gt; Choose Side.<br />
                </p>`,
        npcInitPF2: `<h2>NPC Initiative</h2>
                <p>
                    Like PCs, the Pathfinder Second Edition by Roll20 character sheet allows you to roll NPC Initiative directly from it. For NPCs, just press "Initiative" near the top of the NPC's stat block on the sheet and it will roll for
                    initiative.
                </p>
                <p>
                    If you have the&nbsp;<a href="https://roll20.zendesk.com/hc/en-us/articles/360039178634-Turn-Tracker">Turn Tracker</a>&nbsp;tool open, having the NPC token selected while rolling Initiative will automatically add the NPC and its
                    initiative roll to the tracker. Creatures on the GM layer that are added to the tracker in this fashion will have their entries hidden from the players.
                </p>
                <p>
                    You can also create a global&nbsp;<a href="https://roll20.zendesk.com/hc/en-us/articles/360037256794-Macros">Macro</a>&nbsp;that will pop up as a Token Action button in the upper left-hand corner of the tabletop every time a token
                    is selected. This will allow you to roll without looking at the NPC sheet at all. The macro formula should look just like this:<br />
                </p>
                <pre style="font-size: 11.7px; line-height: 1.42857;">%{selected|INITIATIVE}</pre>`,
        npcInit5e: `<h2 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">NPC Initiative</h2>
                 <p>
                    Like PCs, the D&amp;D 5th Edition NPC Sheet allows you to roll NPC Initiative directly from it. For NPCs, just click on the d20 icon at the top of their statblock on their sheet and it'll roll for Initiative.<br />
                    <br />
                    If you have the&nbsp;<a href="https://roll20.zendesk.com/hc/en-us/articles/360039178634-Turn-Tracker">Turn Tracker</a>&nbsp;tool open, having the NPC token selected while rolling Initiative will automatically add the NPC and its
                    initiative roll to the tracker. Creatures on the GM layer that are added to the tracker in this fashion will have their entries hidden from the players.<br />
                    <br />
                    You can also create a global&nbsp;<a href="https://roll20.zendesk.com/hc/en-us/articles/360037256794-Macros">Macro</a>&nbsp;that will pop up as a Token Action button in the upper left hand corner of the tabletop every time a token
                    is selected. This will allow you to roll without looking at the NPC sheet at all. The macro formula should look just like this:<br />
                </p>
                <pre style="font-size: 11.7px; line-height: 1.42857;">%{selected|npc_init}</pre>`,
        npcInitBB: ``,
        gameSettings5e: `
                <h2 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">Game Settings</h2>
                <p>
                    This module has been set up with the following Game Settings. For more information on how to change these settings, please check out the
                    <a href="https://roll20.zendesk.com/hc/en-us/articles/360039715753-Game-Management">Game Management page on the Help Center</a>.<br />
                </p>
                <h3 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">Map Settings</h3>
                <p>
                    <strong>Advanced Fog of War:</strong>&nbsp;Off, for performance<br />
                    <br />
                    <strong>Dynamic Lighting:</strong>&nbsp;Enabled<br />
                    <strong>Enforce Line of Sight:</strong>&nbsp;On<br />
                    <br />
                    <strong>Only Update on Drop:</strong>&nbsp;Off<br />
                    <strong>Restrict Movement:</strong>&nbsp;Off<br />
                </p>
                <h3 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">Token Settings</h3>
                <p>
                    <strong>Bar 1:</strong>&nbsp;hp (set to None to aid placement of multiple monsters using the same stat block)<br />
                    <strong>Bar 2:</strong>&nbsp;npc_ac<br />
                    <strong>Bar 3:</strong>&nbsp;Intentionally left blank for GM use<br />
                    <strong>Show Nameplate Toggle:</strong>&nbsp;On<br />
                    <br />
                    <strong>Light Radius:</strong>&nbsp;Used for Darkvision or if a NPC exudes light<br />
                    <b><i>Note:</i></b>&nbsp;On large, performance heavy maps, groups of NPCs with darkvision may be adjusted so only one will have this radius turned on. This assists with game performance.&nbsp;<br />
                    <strong>All Players See Light:</strong>&nbsp;On if NPC exudes light<br />
                    <strong>Has Sight Toggle:</strong>&nbsp;Off, for performance.<br />
                    <b>Aura:&nbsp;</b>Enabled for creatures with aura or innate area-of-effect ability, not visible to players
                </p>
                <h3 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">Sheet Settings</h3>
                <p>
                    <strong>Roll Queries:</strong>&nbsp;Always Roll Advantage<br />
                    <strong>Whisper Rolls to GM:</strong>&nbsp;Always Whisper Rolls<br />
                    <strong>Auto Roll Damage:</strong>&nbsp;Auto Roll Damage and Crit
                </p>
            
            `,
        gameSettingsPF2: `<h2>Game Settings</h2>
                <p>
                    This module has been set up with the following Game Settings. For more information on how to change these settings, please check out the
                    <a href="https://roll20.zendesk.com/hc/en-us/articles/360039715753-Game-Management">Game Management page on the Help Center</a>.<br />
                </p>
                <h3 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">Map Settings</h3>
                <p><strong>Advanced Fog of War:</strong>&nbsp;Off, for performance</p>
                <p>
                    <strong>Dynamic Lighting:</strong>&nbsp;Enabled<br />
                    <strong>Enforce Line of Sight:</strong>&nbsp;On
                </p>
                <p>
                    <strong>Only Update on Drop:</strong>&nbsp;Off<br />
                    <strong>Restrict Movement:</strong>&nbsp;Off<br />
                </p>
                <h3 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">Token Settings</h3>
                <p>
                    <strong>Bar 1:</strong>&nbsp;hit_points<br />
                    <strong>Bar 2:</strong>&nbsp;ac<br />
                    <strong>Bar 3:</strong>&nbsp;Intentionally left blank for GM use<br />
                    <strong>Show Nameplate Toggle:</strong>&nbsp;On<br />
                    <br />
                    <strong>Light Radius:</strong>&nbsp;Used for darkvision or if a NPC exudes light<br />
                    <b><i>Note:</i></b>&nbsp;On large, performance heavy maps, groups of NPC's with darkvision may be adjusted so only one will have this radius turned on. This assists with game performance.&nbsp;<br />
                    <strong>All Players See Light:</strong>&nbsp;On if NPC exudes light<br />
                    <strong>Has Sight Toggle:</strong>&nbsp;Off, for performance.
                </p>`,
        playingBurnBryte: `<h2>Thank you for playing <i>PRODUCT NAME</i> on Roll20!</h2>
                <p>You can find more Burn Bryte content on the <a href="https://marketplace.roll20.net/">Roll20 Marketplace</a>.</p>
                <p>
                    For any issues with <i>PRODUCT NAMEt</i>, please contact us on the <a href="https://roll20.zendesk.com/hc/en-us">Roll20 Help Center</a>. If you're new to Roll20 please check out our
                    <a href="https://roll20.zendesk.com/hc/en-us/articles/360039223834-Roll20-Crash-Course">Crash Course</a>!
                </p>
                <p>Happy Gaming!</p>
                <p>Roll20 Production Team</p>
                <hr />
                <h2>Battle Map Scale</h2>
                <h3 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">5 Foot Maps<br /></h3>
                <p style="color: rgb(64, 64, 64);">Each grid square is 5' on the art as well as 5' on the Roll20 grid. No adjustments are needed.</p>
                <h4 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">
                    <strong>5</strong><strong>&nbsp;Foot Maps in&nbsp;<i>PRODUCT NAME</i></strong>
                </h4>
                <ul style="color: rgb(64, 64, 64);">
                    <li>MAP</li>
                    
                </ul>
                <h3 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">Unscaled Maps<br /></h3>
                <p style="color: rgb(64, 64, 64);">These maps do not have a grid.<br /></p>
                <h4 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">
                    <strong>Unscaled Maps in&nbsp;<i>PRODUCT NAME</i></strong>
                </h4>
                <ul style="color: rgb(64, 64, 64);">
                    <li>Olaxis</li>
                </ul>
                <hr />
                <h2 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">Game Settings</h2>
                <p style="color: rgb(64, 64, 64);">
                    This module has been set up with the following Game Settings. For more information on how to change these settings, please check out the&nbsp;
                    <a href="https://roll20.zendesk.com/hc/en-us/articles/360039715753-Game-Management">Game Management page on the Help Center</a>.<br />
                </p>
                <h3 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">Map Settings</h3>
                <p style="color: rgb(64, 64, 64);">
                    <strong>Dynamic Lighting:</strong>&nbsp;Enabled<br />
                    <strong>Enforce Line of Sight:</strong>&nbsp;On
                </p>
                <p style="color: rgb(64, 64, 64);">
                    <strong>Only Update on Drop:</strong>&nbsp;Off<br />
                    <strong>Restrict Movement:</strong>&nbsp;Off<br />
                </p>
                <h3 style="font-family: 'helvetica neue', 'helvetica', 'arial', sans-serif;">Token Settings</h3>
                <p style="color: rgb(64, 64, 64);">
                    <strong>Bar 1:</strong>&nbsp;hp<br />
                    <strong>Bar 2:</strong>&nbsp;Intentionally left blank for GM use<br />
                    <strong>Bar 3:</strong>&nbsp;Intentionally left blank for GM use<br />
                    <strong>Show Nameplate Toggle:</strong>&nbsp;On
                </p>
                `,
        safetyDeck: `<h2>Safety Deck</h2>
                <p>Every game in Roll20 with a <i>Burn Bryte</i> character sheet comes with a deck of infinite cards that allows players to inform the GM and each other when they feel safe or unsafe during a game.</p>
                <p>
                    Gaming is for everyone, and the number one goal of <i>Burn Bryte</i> is for the people playing the game to have fun. In <i>Burn Bryte</i> and many roleplaying games narratives allow the players to take the game to places that may make
                    the people involved feel uncomfortable or unsafe. Some topics, like sexual violence, are obvious problem areas, while others, like dealing with grief, may be less expected. Every player brings different life experience to the game.
                    There's no telling what might make another person unsafe. You should respect the safety of others, and they are expected to respect your safety.
                </p>
                <p>
                    The Safety Deck makes communication about questionable topics easy and anonymous between players and the GM. Each deck has an unlimited number of three different cards. Remind your GM to put this deck out at the beginning of the game if
                    they do not on their own. Everyone should draw at least one type of each card at the beginning of a session and the GM should leave the deck available during play.
                </p>
                <h3>No Questions Asked</h3>
                <p>
                    When a person places a card on the table, the group should pay attention and follow the rules of the card without asking who placed the card or why the card was placed. If the person who placed the card wishes to explain why they did
                    so, that is their prerogative, but there is no obligation or expectation to do so. You owe no explanation to the group when you place a card on the table. The goal of the safety deck is to keep the game safe for everyone, and going into
                    detail about why a particular subject makes a person feel unsafe could be just as terrible for an individual as living the experience through a game. When a card is placed, follow its rules and move on.
                </p>
                <h3>Keep Going Card</h3>
                <p>
                    The Keep Going Card is green and an indicator to others that you are currently enjoying the content that's occurring. You don't need to play this card every time you're having fun or at all. This card is meant to be played when your
                    game gets into a topic that could make others feel unsafe. It is a way to check in with everyone and say, "I'm feeling good, let's keep going with this topic." If someone else drops this card on the table and no one else drops a Slow
                    Down or Stop Card, you can keep going and even dive deeper into the content you're covering.
                </p>
                <h3>Slow Down Card</h3>
                <p>
                    The Slow Down Card is yellow and an indicator to others that you are fine with current content of the game, but going further with the description or detail would make you uncomfortable or unsafe. Play this card as a heads up to your
                    fellow players that you don't want them to get more descriptive about a specific topic. If someone else drops this card on the table, respect your fellow player, consider pulling back some of your description or discussion of your
                    current content, and move on from the scene as quickly as possible without asking any questions of the other players.
                </p>
                <h3>Stop Card</h3>
                <p>
                    The Stop Card is red and is an indicator to others that you feel uncomfortable or unsafe and want the current content of the game to end. When this card is played, all players should immediately end the scene and move on without asking
                    any questions of the other players.
                </p>
                `,
        moduleShortcuts: `<h2>Module Shortcuts</h2>
                <p>
                    The Roll20 Tabletop is equipped with keyboard shortcuts. Some of the most popular are listed below.
                    <a href="https://roll20.zendesk.com/hc/en-us/articles/360039675393-Default-Shortcuts">A full list of shortcuts can be found on the Help Center</a>.
                </p>
                <p>
                    <strong>Double click:</strong>&nbsp;Opens Token options, including light radius and "Has Sight" options.<br />
                    <strong>Shift+ Double click:</strong>&nbsp;Opens up token's character sheet
                </p>
                <p>
                    <strong>Ctrl/Cmd+Shift+O:</strong>&nbsp;Move selected object to token layer<br />
                    <strong>Ctrl/Cmd+Shift+K:</strong>&nbsp;Move selected object to GM layer
                </p>
                <p>
                    <strong>Pressing "Z" with an object selected</strong>&nbsp;shows a larger version of that object in a modal popup<br />
                    <strong>Pressing Shift+Z as the GM</strong>&nbsp;shows all players the larger version of that object<br />
                    <strong>Pressing Ctrl/Cmd+L with a token selected</strong>&nbsp;<strong>as the GM</strong>&nbsp;to view the environment as that token would.<br />
                </p>`,
    }
    
//=========SCRIPT FUNCTIONALITY==============

    const checkInstalls = function() {
        tokenModInstall = ('undefined' !== typeof TokenMod) ? true : false;
        theAaronConfigInstall = (state.TheAaron) ? true : false;

    }

    const registerEventHandlers = function() {
        on('chat:message', handleInput);
        on('change:handout:notes', function(obj, prev){runAutoLinkTester(obj, "notes")});
        on('change:handout:gmnotes', function(obj, prev){runAutoLinkTester(obj, "gmnotes")});
        on('change:character:bio', function(obj, prev){runAutoLinkTester(obj, "bio")});
        on('change:character:gmnotes', function(obj, prev){runAutoLinkTester(obj, "gmnotes")});
    };

    on("ready", () => {
        eventChangeLockout = false;
        registerEventHandlers();
        checkInstalls();
        log("==== " + scriptName + " v" + version + " ====");
        startText = "Production Wizard ready! <br /> v" + version + "<br/>" + makeButton("Main Menu", "!prod", styles.button)
        makeAndSendMenu(startText, "Production Wizard", 'gm');

    });
})();
