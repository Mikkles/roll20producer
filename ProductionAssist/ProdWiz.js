const Roll20Pro = (() => {
    let category = [],
        tokenModInstall,
        theAaronConfigInstall;
    
    const reinstallRoll20Pro = function () {
        state.Roll20Pro = {};
        state.Roll20Pro.sortCats = {};
        state.Roll20Pro.buddy = null;
        state.Roll20Pro.productName = "PRODUCT NAME";
    }
    
    if (! _.has(state, "Roll20Pro")) {
        reinstallRoll20Pro();
    }
    
    const scriptName = "Roll20 Production Wizard",
        version = "0.7.2",
        
        styles = {
            reset: 'padding: 0; margin: 0;',
            menu: 'background-color: #fff; border: 1px solid #000; padding: 5px; font-family: &quot;Good Pro Condensed&quot;, &quot;Roboto&quot;, &quot;Verdana&quot;,sans-serif;, ',
            bigButton: 'font-size: 1.2em; background-color: pink; border: 1px solid black; border-radius: 3px; padding: 4px; margin: 2px; color: #000; text-align: center; ',
            button: 'background-color: pink; border: 1px solid black; border-radius: 3px; padding: 0px, 2px; margin: 2px; color: #000; text-align: center; ',
            textButton: 'background-color: transparent; border: none; padding: 0; color: #000; text-decoration: underline',
            list: 'list-style: none;',
            float: {
                right: 'float: right;',
                left: 'float: left;'
            },
            overflow: 'overflow: hidden;',
            fullWidth: 'width: 100%;',
            title: 'margin-bottom: 10px; text-transform: capitalize; border-bottom: 2px solid; ',
            warning: 'background-color:salmon; color:black; ',
            note: 'background-color:powderblue;'
        },
        
        
        makeTitle = function (title) {
            return '<h2 style="' + styles.title + '">' + title + '</h2>';
        },

        makeButton = function (title, href, style) {
            return '<a style="' + style + '" href="' + href + '">' + title + '</a>';
        },
        
        makeBackButton = function () {
            return '<br /><a style="' + styles.button + '" href="' + '!prod' + '">' + 'Back' + '</a>';
        },
        
        makeH4 = function(text){
            return '<h4>' + text + '</h4>';  
        },

        makeAndSendMenu = function (contents, title, whisper, callback) {
            title = (title && title != '') ? makeTitle(title) : '';
            whisper = (whisper && whisper !== '') ? '/w ' + whisper + ' ' : '';
            sendChat(scriptName, whisper + '<div style="' + styles.menu + styles.overflow + '">' + title + contents + '</div>', null, {
                noarchive: true
            });
        },
        
        onPlayerPage = function(msg){
            let lastPageID = getObj('player', msg.playerid).get('_lastpage');
            let pageID = Campaign().get("playerpageid")
            let page = getObj("page", pageID);
            if (pageID == lastPageID) {
                return true; 
            }else{
                makeAndSendMenu(menuText.playerPageError(), "Error", 'gm');
                return false;
            }
        },
        
        menuText = {
            main: () => "<p>v" + version + " ready.</p>" +
            ((!tokenModInstall) ? "<p style='" + styles.warning + "'> TOKEN MOD is not installed!</p>" : "") +
            //((!theAaronConfigInstall) ? "<p style='" + styles.warning + "'> AARON CONFIG is not installed!</p>" : "") +
            ((locateBuddies().length) ? "<p style='" + styles.warning + "'>There is at least one DL buddy left! Go to Map/DL Helper to toggle off.</p>" : "") +
            
            "<p>See <b><u><a href='https://roll20.atlassian.net/wiki/spaces/CP/pages/1408761861/Production+Wizard+Script'>How-To</a></u></b> for instructions.</p>" +

            makeButton("Autolinker Examples", "!prod autolinker", styles.bigButton)+
            makeButton("Token Helper", "!prod token", styles.bigButton) + 
            makeButton("Map/DL Helper", "!prod map", styles.bigButton) + 
            makeButton("Picture/Mention Finder", "!prod finder", styles.bigButton) + 
            makeButton("Stock Handouts", "!prod stock", styles.bigButton) + 
            makeButton("Admin Tools", "!prod admin", styles.bigButton)
            ,
            autolinker: () => "<p>Some examples of the autolinker functionality. These can be used on the notes/gmnotes of any handout or character.</p>" +
            "<p>Please note that this script works after you save changes to a handout, "+
            "but the handout often reloads before the script is finished. Closing and reopening the handout, or clicking Edit again, should give it enough time to"+
            "properly link things.</p>"+
            "<p><code>[goblin|Jimmy]</code> will make a link with the text 'Jimmy' to the 'goblin' handout.</p>"+
            "<p><code>[5e:fireball]</code> will link to the 5e compendium page for fireball.</p>"+
            "<p><code>[5e:wall of fire|the wall]</code> will make a link with the text 'the wall' to the 5e compendium page for wall of fire</p>"+
            "<p>Currently <code>5e:</code> and <code>pf2:</code> will link to their respective compendiums." + 
            makeBackButton()
            ,
            token: () => "<p style='" + styles.note + "'>Tokens must have Represented filled out manually.</p>" +
            makeH4("Show Nameplates") +
            makeButton("Show Names", "!token-mod --on showname", styles.button) +
            makeButton("Hide Names", "!token-mod --off showname", styles.button) +
            makeButton("Toggle Names", "!token-mod --flip showname", styles.button) +
            makeH4("Resize Tokens") + 
            makeButton("1x1", "!token-mod --set width|70 height|70", styles.button) +
            makeButton("2x2", "!token-mod --set width|140 height|140", styles.button) +
            makeButton("3x3", "!token-mod --set width|210 height|210", styles.button) +
            makeButton("4x4", "!token-mod --set width|280 height|280", styles.button) +
            makeH4("Setup Token by System") + 
            makeButton("D&D 5e", "!token-mod --set bar1_link|hp bar2_link|npc_ac bar3| bar3_link| &#13;!token-mod --set bar1_reset| &#13;!token-mod --set bar1_link|", styles.button) +
            makeButton("Pathfinder 2e", "!token-mod --set bar1_link|hit_points bar2_link|armor_class bar3| bar3_link| &#13;!token-mod --set bar1_link|", styles.button) +
            makeButton("Starfinder", "!token-mod --set bar1_link|hp bar2_link|eac bar3_link|kac &#13;!token-mod &#13;!token-mod --set bar1_link|", styles.button) +
            makeButton("Pathfinder 1e", "!token-mod --set bar1_link|hp bar2_link|ac bar3| bar3_link| &#13;!token-mod &#13;!token-mod --set bar1_link|", styles.button) +
            makeH4("UDL Vision") + 
            makeButton("Vision Off", "!token-mod --set bright_vision|false", styles.button) +
            makeButton("Vision On", "!token-mod --set bright_vision|true", styles.button) +
            makeH4("UDL Darkvision") + 
            makeButton("None", "!token-mod --set has_night_vision|false night_vision_distance|0", styles.button) +
            makeButton("60 ft", "!token-mod --set has_night_vision|true night_vision_distance|60", styles.button) +
            makeButton("120 ft", "!token-mod --set has_night_vision|true night_vision_distance|120", styles.button) + 
            makeButton("PF2: Get from senses", "!prod token UDLdv", styles.button) + 
            makeH4("Defaults") + 
            makeButton("Assign as Default Token", "!token-mod --set defaulttoken", styles.button) +
            makeButton("Avatar from Token (if in library)", "!prod token avatar", styles.button) +
            makeH4("<hr>Token Page Tools") +
            makeButton("Assign Category", "!prod token addToCat ?{Category Number}", styles.button) +
            makeButton("See Categories", "!prod token seeCats", styles.button) + "<br/><br/>" +
            makeButton("Run Page Sorter", "!prod token runSorter", styles.button) +
            makeButton("Reset Categories (if sure!)", "!prod token resetCats", styles.button) +
            makeH4("<del><i>LDL Darkvision") + 
            makeButton("None", "!token-mod --set light_radius| light_dimradius|0", styles.button) +
            makeButton("60 ft", "!token-mod --set light_radius|60 light_dimradius|0", styles.button) +
            makeButton("120 ft", "!token-mod --set light_radius|120 light_dimradius|0", styles.button) + "</del></i>" +
            makeBackButton()
            ,
            map: () => "<p style='" + styles.note + "'>Player bookmark must be on your active page.</p>" +
            makeH4("Resize Map and Page") + "<p>Select map graphic and enter width/height of image when prompted.</p>" +
            makeButton("Resize by pixel dimensions", "!prod map resize ?{Pixel width of image} ?{Pixel height of image}", styles.button) + 
            makeButton("Resize by 70px units", "!prod map resizeUnit ?{Unit width of image} ?{Unit height of image}", styles.button) + 
            makeH4("Change Grid Width") +
            makeButton("Width 1", "!prod map edit snapping_increment 1", styles.button) +
            makeButton("Width 0.5", "!prod map edit snapping_increment 0.5", styles.button) +
            makeButton("Width 0.25", "!prod map edit snapping_increment 0.25", styles.button) +
            makeButton("Width 0.125", "!prod map edit snapping_increment 0.125", styles.button) +
            makeH4("Change Grid Opacity") +
            makeButton("Prompt", "!prod map edit grid_opacity ?{1 to 100|100}", styles.button) +
            makeH4("Change Grid Colour") +
            makeButton("Default Grey", "!prod map edit gridcolor #C0C0C0", styles.button) +
            makeButton("High Vis Pink", "!prod map edit gridcolor #ff00ff", styles.button) +
            makeButton("High Vis Green", "!prod map edit gridcolor #00ff00", styles.button) +
            makeButton("Med Vis Green", "!prod map edit gridcolor #93c47d", styles.button) +
            makeH4("Toggle Dynamic Lighting Buddy") + "<p>Creates a buddy on the current page. If there are already any buddies created, " + 
            "this will delete it. You may copypaste buddies as long as you remove them before project completion.</p>" +
            makeButton("Toggle Buddy", "!prod map buddy", styles.button) +
            makeBackButton()
            ,
            finder: () => makeH4("NPC Handout Finder") +
            makeButton("Find for All Characters", "!prod finder art", styles.button) + 
            makeButton("Find for Selected Only", "!prod finder artSelected", styles.button) + 
            makeH4("NPC Mention Finder") +
            makeButton("Find for All Characters", "!prod finder mention", styles.button) + 
            makeButton("Find for Selected Only", "!prod finder mentionSelected", styles.button) +
            makeH4("NPC Handout Processor") +
            makeButton("Create Empty Art Handouts","!prod finder process", styles.button) + 
            makeBackButton()
            ,
            stockHandouts: () => `<p>Current Product Name: ${state.Roll20Pro.productName}</p>` +
            makeButton("Change Product Name", "!prod stock changeName ?{Product Name}", styles.button) +
            makeH4("Stock Handouts") + 
            makeButton("Battle Map Scale", "!prod stock create battleMap", styles.button) +
            //makeButton("!linking", "!prod stock linking", styles.button) + //UNDER CONSTRUCTION
            makeBackButton()
            ,
            admin: () => "Admin scripts are currently under construction.<br/>" + 
            makeH4("Handout HTML Logger") + "<p>This will prompt the name of a handout, then log the HTML of it in the API Output Console.</p>" +
            makeButton("Log HTML", "!prod admin getHTML ?{Handout Name}", styles.button) + 
            makeBackButton()
            
            /*makeH4("Reset Wizard") + 
            "<p>This resets the script in case of the state being corrupted</p>" + 
            makeButton("Reset", "!prod admin reset", styles.button) +
            makeBackButton()*/
            ,
            playerPageError: () => "<p>The Player bookmark must be on your current page!</p>" +
            makeBackButton()
            
        },
        
        handleInput = function (msg) {
            if (msg.type == "api" && msg.content.indexOf("!prod") === 0) {
                let selected = msg.selected;
                let args = msg.content.split(" ");
                let command = args[1];
                let lastPageID = getObj('player', msg.playerid).get('_lastpage');
                let who = (getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname');
                let caller = '"' + who + '"'
                let ext = args.slice(3);
                let extString = ext.join(" ");

                
                switch (command) {
                    default:
                    case "menu": makeAndSendMenu(menuText.main(), "Main Menu", caller); break;
                    case "autolinker": makeAndSendMenu(menuText.autolinker(), "Autolinker Examples", caller); break;
                    case "token": 
                        switch (args[2]) {
                            default: 
                            case "menu": makeAndSendMenu(menuText.token(), "Token Helper", caller); break;
                            case "avatar": tokenChangeAvatar(selected); break;
                            case "addToCat": if (onPlayerPage(msg)) {addToCat(args[3], selected);}
                                break;
                            case "seeCats": seeCats(); break;
                            case "runSorter": if (onPlayerPage(msg)) {runGenerateTokenPage();} 
                                break;
                            case "resetCats": resetCats(); break;
                            case "UDLdv": tokenPF2DarkvisionChecker(selected); break;
                        } 
                        break;
                    case "finder":
                        switch (args[2]) {
                            default: 
                            case "menu": makeAndSendMenu(menuText.finder(), "Mention Finder", caller); break;
                            case "art": artFinder("all"); break;
                            case "artSelected": artFinder(selected); break;
                            case "mention": mentionFinder("all"); break;
                            case "mentionSelected": mentionFinder(selected); break;
                            case "process": processImageToHandout(selected); break;
                        } 
                        break;
                    case "map": 
                        switch (args[2]) {
                            default: 
                            case "menu": makeAndSendMenu(menuText.map(), "Map Helper", caller); break;
                            case "resize": if (onPlayerPage(msg)) {resizeMap(args[3], args[4], msg)} break;
                            case "resizeUnit": if (onPlayerPage(msg)) {resizeMapUnit(args[3], args[4], msg)} break;
                            case "edit": if (onPlayerPage(msg)) {mapQuickChange(args[3], args[4], msg)} break;
                            case "buddy": toggleBuddy(msg); break;
                        }
                        break;
                    case "stock":
                        switch (args[2]) {
                            default: 
                            case "menu": makeAndSendMenu(menuText.stockHandouts(), "Stock Handouts", caller); break;
                            case "linking": createLinkingHandout(); break;
                            case "changeName": state.Roll20Pro.productName = extString; break;
                            case "create": createStockHandout(args[3], caller); break;
                            //TO DO: actual handouts :/
                        }
                        break;
                    case "admin":
                        switch (args[2]) {
                            default: 
                            case "menu": makeAndSendMenu(menuText.admin(), "Admin Tools", caller); break;
                            case "getHTML": logHandoutHTML(msg.content); break;
                            //case "linking": createLinkingHandout(); break;
                            //TO DO: admin reset
                        }
                        break;
                }
            }
        },
        
        
///===========AUTOLINKER========================
        autolink = function (str){            
            let regex = /\[(?:([^\]|]*)|([^|]*)\|([^\]|]*))\]/g;
            let newStr = "";
            if (str == null) {
                str = ""
            };
            return str.replace(regex, (all, oneWord, link, text) => {
                log("All: " + all + " oneWord: " + oneWord + " link: " + link + " text: " + text);

                //Testing if the result is a spell (has : in it)
                if (oneWord && oneWord.includes(":")) {
                    let spell = oneWord.split(":");
                    switch (spell[0]) {
                    default:
                        log("Spell not found.");
                        return all;
                        break; //This might be unnecessary?
                    case "5e":
                        return "<i><a href='https://roll20.net/compendium/dnd5e/" + spell[1] + "'>" + spell[1] + "</a></i>"
                        break;
                    case "pf2":
                        return "<i><a href='https://roll20.net/compendium/pf2/" + spell[1] + "'>" + spell[1] + "</a></i>"
                        break;
                    }
                }

                if (link && text) {
                    if (link.includes(":")) {
                        let spell = link.split(":");
                        switch (spell[0]) {
                        default:
                            log("Spell not found.");
                            return all;
                            break; //This might be unnecessary?
                        case "5e":
                            return "<i><a href='https://roll20.net/compendium/dnd5e/" + spell[1] + "'>" + text + "</a></i>"
                            break;
                        case "pf2":
                            return "<i><a href='https://roll20.net/compendium/pf2/" + spell[1] + "'>" + text + "</a></i>"
                            break;
                        }

                    }

                    let targetObj = findObjs({
                        name: link
                    }, {
                        caseInsensitive: true
                    });

                    if (targetObj[0]) {
                        let targetID = targetObj[0].get("id");
                        let targetType = targetObj[0].get("type");
                        if (targetType == "handout") {
                            return "<a href='http://journal.roll20.net/handout/" + targetID + "'>" + text + "</a>"
                        } else if (targetType == "character") {
                            return "<a href='http://journal.roll20.net/character/" + targetID + "'>" + text + "</a>"
                        }
                    }
                }
                return all;

            });

        },

        runAutolink = function(obj, field) {
            if (!eventLockout){
                eventLockout = true;
               
                let type = obj.get("_type");
                let name = obj.get("name");
                log("Auto Linker running on: " + name + " - " + field);
                obj.get(field, function(str){
                    let newText = autolink(str, name);
                    obj.set(field, newText);
                })
            } else {
                eventLockout = false;
            }
        },
        
///===============TOKEN TOOLS==================
        tokenChangeAvatar = function(selected){
            if (selected){
                _.each(selected, function(token){
                    tok = getObj("graphic", token._id)
                    img = tok.get("imgsrc");
                    parent = tok.get("represents");
                    par = getObj("character", parent)
                    par.set("avatar", img);
                })
            }            
        },
        
        tokenPF2DarkvisionChecker =function(selected){
            if (selected){
                _.each(selected, function(token){
                    if (token._type == "graphic"){
                        tok = getObj("graphic", token._id);
                        parent = tok.get("represents");
                        senses = getAttrByName(parent, "senses")
                        log(tok.get('name') + " senses= " + senses);
                        if (typeof senses !== 'undefined'){
                            if (senses.includes("darkvision")) {
                                tok.set("has_night_vision", true);
                                tok.set("night_vision_distance", 60);
                                log("got dv!")
                            }
                        }
                    }
                })
            }
        },
        

//===========TOKEN PAGE GENERATOR=============
        makeText = function (x, y, defaultText) {
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
        
        resetCats = function() {
            state.Roll20Pro.sortCats = {};
            cleanupNoCatTokens();
            makeAndSendMenu("Categories Reset","",'gm')
        }
    
        checkTokenExistsOrDelete = function (tokenID) {
            //log(tokenID);
            tokenObj = getObj("graphic", tokenID);
    
            if (!tokenObj) {
                delete state.Roll20Pro.sortCats[tokenID];
                return false;
            } else {
                return true;
            }
        },
    
        cleanupNoCatTokens = function () {
            //Put all non-categorized tokens in category[99]. 
            //We just assume there's not already 99 categories.
            let allTokens = findObjs({
                _type: "graphic",
                _pageid: Campaign().get("playerpageid")
            });
            _.each(allTokens, function (token) {
                let tokenID = token.id;
                if (!state.Roll20Pro.sortCats[tokenID]) {
                    //log(tokenID + " is added to cats")
                    state.Roll20Pro.sortCats[tokenID] = 99;
                }
            })
        },
        
        addToCat = function (arg, selected){
            if (!arg) {
                makeAndSendMenu("Category must be an integer!", "Roll20 Producer Error", 'gm');
                return;
            } else {
                tested = parseInt(arg);
                if (tested == NaN) {
                    makeAndSendMenu("Category must be an integer!", "Roll20 Producer Error", 'gm');
                    return;
                }
                text = "";
                _.each(selected, function (token) {
                    tokenID = token._id;
                    tokenObj = getObj("graphic",tokenID);
                    state.Roll20Pro.sortCats[tokenID] = arg;
                    name = tokenObj.get("name");
                    text += "<br />" + name;
                    
                })
                cleanupNoCatTokens();
                text = "**Added to category: " + arg + "**" + text
                makeAndSendMenu(text, "Add to Category", 'gm');
            }
        },
    
        //-------------------Actually run token page!
        runGenerateTokenPage = function () {
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
            _.each(text, function (star) {
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
    
            //Put all uncategorized tokens in 99.
            cleanupNoCatTokens();
    
            //Put all categorized tokens in the category array. 
            Object.keys(state.Roll20Pro.sortCats).forEach(tokenID => { //Object.keys(state.Roll20pro.sortCats)
                value = state.Roll20Pro.sortCats[tokenID];
                if (checkTokenExistsOrDelete(tokenID)) {
                    //log("This is run" + tokenID);
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
                    let sorted = category[cat].sort(function (a, b) {
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
                    _.each(sorted, function (token) {
                        if (token.get("pageid") == page.id) {
    
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
                        
                            }
                        })
    
                    //Now that each in category[i] are sorted, reset for next category. 
                    x = 70;
                    y = y + tallestHeight + 140;
                    tallestHeight = 0;
    
                }
            }
        },
    
        //------------View categories
        seeCats = function () {
            text = "";
    
            Object.keys(state.Roll20Pro.sortCats).forEach(key => {
                if (checkTokenExistsOrDelete(key)) {
                    token = getObj("graphic", key)
                    name = token.get("name");
                    category = state.Roll20Pro.sortCats[key];
                    text += name + " is in category " + category + ".<br />"
                }
            })
    
            text += "<br />" + makeButton("Back", "!prod tokenPage", styles.button);
            makeAndSendMenu(text, "Categories", 'gm');
        }
        
///========MAP TOOLS=============
        resizeMap = function (width, height, msg) {

            selected = msg.selected
            if (!width || width == "" || !height || height == "") {
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
        
        resizeMapUnit = function (width, height, msg) {

            selected = msg.selected
            if (!width || width == "" || !height || height == "") {
                makeAndSendMenu("Height or Width arguments not found!", "Roll20 Producer Error", 'gm');
            } else {
                if (!selected || !selected[0]) {
                    makeAndSendMenu("No map image selected!", "Roll20 Producer Error", 'gm');
                } else {

                    let lastPageID = getObj('player', msg.playerid).get('_lastpage');
                    let pageID = Campaign().get("playerpageid")
                    let page = getObj("page", pageID);
                    if (pageID == lastPageID) {
                        page.set("width", width);
                        page.set("height", height);
                        tokenID = selected[0]._id;
                        tokenObject = getObj("graphic", tokenID)
                        tokenObject.set({
                            width: width * 70,
                            height: height * 70,
                            left: (width*70)/2,
                            top: (height*70)/2,
                        });
                    } else {
                        makeAndSendMenu("For safety, The player bookmark must be on your page!", "Roll20 Producer Error", 'gm');
                    }

                }
            }
        },
        mapQuickChange = function (param, value, msg) {
            if (!param || !value) {
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
        
        locateBuddies = function() {
            buddies = findObjs({                              
                _type: "graphic",
                name: "Dynamic Lighting Buddy"
            });
            //log(buddies.length);
            return buddies;
            
        }
        
        toggleBuddy = function (msg) {
            buddies = locateBuddies();
            if (buddies.length > 0 ){
                _.each(buddies, function(buddy){
                    buddy.remove();
                    log("Buddy Deleted");
                })
            } else {
                let pageID = getObj('player', msg.playerid).get('_lastpage');
                newBuddy = createObj("graphic", {
                    name: "Dynamic Lighting Buddy",
                    imgsrc: 'https://s3.amazonaws.com/files.d20.io/images/140823448/E4Kn8ggLQWyRtaJHzLAPAw/thumb.png?1591297505',
                    _pageid: pageID,
                    layer: "objects",
                    has_bright_light_vision: true,
                    emits_bright_light: true,
                    bright_light_distance: "100",
                    top: 70,
                    left: 70,
                    width: 70,
                    height: 70,
                })
            }
        },

///========MENTION FINDER==============
        
        artFinder = function (selected) {
            if (selected == "all"){
                queue = findObjs({
                    type: "character"
                })
            } else {
                queue = []
                _.each(selected, function (token) {
                    let tokenID = token._id;
                    let tokenObj = getObj("graphic", tokenID);
                    let rep = tokenObj.get("represents");
                    let charObj = getObj("character", rep);
                    queue.push(charObj);
                })
            }
            let report = ""
            const burndown = () => {
                if (queue.length) {
                    let found = false;
                    let charObj = queue.shift();
                    let charName = charObj.get("name");
                    let handoutName = "Handout: " + charName;
                    let handouts = findObjs({
                        type: "handout"
                    })
                    const burndownHandouts = () => {
                        if (handouts.length) {
                            let handout = handouts.shift();
                            let hID = handout.id
                            if (handout.get("name") == handoutName) {
                                charObj.get("bio", function (bioText) {
                                    if (!bioText.includes("Picture:")) {
                                        if (bioText == null || bioText == undefined) {bioText = ""}
                                        newText = "<b>Picture: </b><a href='http://journal.roll20.net/handout/" + handout.id + "'>" + handoutName + "</a><br/><br>" + bioText;
                                        charObj.set("bio", newText);
                                        report += "Added: " + charName + "<br />";
                                    } else {
                                        report += "<i>Prev. Completed: " + charName + "<br/></i>"; 
                                    }
                                    setTimeout(burndownHandouts, 0);
                                })
                            } else {
                                setTimeout(burndownHandouts, 0);
                            }
                        } else {
                            setTimeout(burndown, 0);
                        }
                    };
                    burndownHandouts();
                } else {
                    if (report == "") {
                        setTimeout(function(){makeAndSendMenu("No characters were linked!", "Art Linker Error", 'gm');}, 500);
                        return;
                    } else {
                        setTimeout(function(){makeAndSendMenu(report, "Links Added", 'gm');}, 500);
                        return;
                    }
                }
            }
            burndown();
        },
        
        mentionFinder = function(selected) {
            
            if (selected == "all"){
                queue = findObjs({
                    type: "character"
                })
            } else {
                queue = []
                _.each(selected, function (token) {
                    let tokenID = token._id;
                    let tokenObj = getObj("graphic", tokenID);
                    let rep = tokenObj.get("represents");
                    let charObj = getObj("character", rep);
                    queue.push(charObj);
                })
            }
            let report = "";
            const burndown = () => {
                if (queue.length){
                    let mentions = [];
                    let charObj = queue.shift();
                    let charName = charObj.get("name");
                    let charID = charObj.get("id");
                    let handouts = findObjs({
                        type: "handout"
                    });
                    const burndownHandouts = () => {
                        if (handouts.length){
                            let handout = handouts.shift();
                            handout.get("gmnotes", function(gmnotes){
                                if (gmnotes.includes(charName) || gmnotes.includes(charID)){
                                    mentions.push(handout);    
                                }
                                setTimeout(burndownHandouts,0);
                            })
                        } else {
                            if (mentions.length){
                                charObj.get("gmnotes", function(charNotes){
                                    log(charNotes);
                                    if ((charNotes == null) || (charNotes == "null")){
                                        charNotes = " ";
                                        log("charNotes null" + charName)
                                    }
                                    if (mentions.length && !charNotes.includes("can be found")){
                                        let newText = "<p>" + charName + " can be found in the following locations.</p>"
                                        newText += "<ul>"
                                        _.each(mentions, function(mention){
                                            mentionName = mention.get("name")
                                            newText += "<li> <a href='http://journal.roll20.net/handout/" + mention.id + "'>" + mentionName + "</a></li>" 
                                        })
                                        
                                        newText += "</ul><br /><br />" + charNotes;
                                        charObj.set("gmnotes", newText);
                                        report += "Added: " + charName + "<br />";
                                    } else {
                                        report += "<i>Prev. Complete: " + charName + "<br /></i>";
                                    }
                                })
                            }
                            setTimeout(burndown, 0);
                            
                        }
                        
                    };
                    burndownHandouts(); 
                    
                } else {
                    if (report == "") {
                        setTimeout(function(){makeAndSendMenu("No characters were linked!", "Mention Linker Error", 'gm');}, 500);
                        return;
                    } else {
                        setTimeout(function(){makeAndSendMenu(report, "Links Added", 'gm');}, 500);
                        return;
                    }
                }
            }
            burndown();
        },
        
///===========STOCK HANDOUTS===========
        handoutHTML = {
            battleMap: () => `<h2>Battle Map Scale</h2><p>Map scale varies across the collection of battle maps within <i>${state.Roll20Pro.productName}</i>. To make movement and token placement ideal, we have adjusted the grid on some of the maps so that tokens are easier to select and manipulate. Listed below are all the maps in this module and what scale they are currently set to.</p><hr><h3 style=\"font-family: &#34;helvetica neue&#34; , &#34;helvetica&#34; , &#34;arial&#34; , sans-serif\">100 Foot Maps</h3><p style=\"font-family: &#34;helvetica neue&#34; , &#34;helvetica&#34; , &#34;arial&#34; , sans-serif\">Each grid square on the art is 100' with no Roll20 subdivisions. Medium/Small tokens are set to 1 to 1 units (technically 100' by 100') here.</p><p>If you wish to set it for scale accuracy, enable the Grid and set the Grid Size in Page Settings to 0.05 units. Token Sizing is as follows: Medium/Small/Tiny (0.05 unit by 0.05 unit), Large (0.1 unit by 0.1 unit), Huge (0.15 unit by 0.15 unit), gargantuan (0.2 unit by 0.2 unit).</p><p><b>100 Foot Maps in <i>${state.Roll20Pro.productName}</i></b></p><ul><li>Abberton</li></ul><hr><h3>20 Foot Maps</h3><p>Each grid square on the art is 20' with four subdivisions in the Roll20 grid (Grid Size set to 0.5 units). Each Roll20 grid square is 5'. Tokens are sized accordingly to Pathfinder Second Edition rules (5', 10', 15', 20'). No adjustments are needed for strategy accuracy.</p><p><b>20 Foot Maps in <i><i>${state.Roll20Pro.productName}</i></i></b></p><ul><li>Big Top</li></ul><hr><p></p><h3 style=\"font-family: &#34;helvetica neue&#34; , &#34;helvetica&#34; , &#34;arial&#34; , sans-serif\">5 Foot Maps</h3><p>Each grid square is 5' on the art as well as 5' on the Roll20 grid. No adjustments are needed.</p><p><strong>5</strong><strong>&nbsp;Foot Maps in <i><i>${state.Roll20Pro.productName}</i></i></strong><br></p><ul><li>Circus Camp (This map can also be used at a 0.5 grid size for a tactical experience.)</li><li>Abberton</li><li>Oldlin's Orchard</li><li>Hawfton Mill</li><li>Mad Mug</li><li>Goldenlaws Church</li><li>Lindell Barn</li><li>Hermitage of the Blessed Lightning</li><li>Erran Tower First Floor</li><li>Erran Tower Second Floor</li><li>Erran Tower Top</li></ul>`,
            gameSettings: () => `<h2>Game Settings</h2><p>This module has been set up with the following Game Settings. For more information on how to change these settings, please check out the <a href=\"https://roll20.zendesk.com/hc/en-us/articles/360039715753-Game-Management\">Game Management page on the Help Center</a>.<br></p><h3 style=\"font-family: &#34;helvetica neue&#34; , &#34;helvetica&#34; , &#34;arial&#34; , sans-serif\">Map Settings</h3><p><strong>Dynamic Lighting:</strong>&nbsp;Enabled<br><strong>Enforce Line of Sight:</strong>&nbsp;On</p><p><strong>Only Update on Drop:</strong>&nbsp;Off<br><strong>Restrict Movement:</strong>&nbsp;Off<br></p><h3 style=\"font-family: &#34;helvetica neue&#34; , &#34;helvetica&#34; , &#34;arial&#34; , sans-serif\">Token Settings</h3><p><strong>Bar 1:</strong>&nbsp;hit_points<br><strong>Bar 2:</strong>&nbsp;ac<br><strong>Bar 3:</strong>&nbsp;Intentionally left blank for GM use<br><strong>Show Nameplate Toggle:</strong>&nbsp;On<br><br><strong>Light Radius:</strong>&nbsp;Used for darkvision or if an NPC exudes light<br><b><i>Note:</i></b>&nbsp;On large, performance heavy maps, groups of NPC's with darkvision may be adjusted so only one will have this radius turned on. This assists with game performance.&nbsp;<br><strong>All Players See Light:</strong>&nbsp;On if NPC exudes light<br><strong>Has Sight Toggle:</strong>&nbsp;Off, for performance.</p>`,
            
        },
        
        createStockHandout = function(name, caller) {
            title = ""
            
            switch (name) {
                case "battleMap": title = "Battle Map Scale"; findAndMakeHandout(title, "", handoutHTML.battleMap()); break;
                case "gameSettings": title = "Game Settings"; findAndMakeHandout(title, "", handoutHTML.gameSettings()); break;
            }
            
            if (title != ""){
                makeAndSendMenu(title + " handout created", "Handout", caller);
                
                makeAndSendMenu(menuText.stockHandouts(), "Stock Handouts", caller)
            }
            else{
                makeAndSendMenu(title + " handout not created; no html found", "Handout Error", caller);
                
                makeAndSendMenu(menuText.stockHandouts(), "Stock Handouts", caller)
            }
            
        },
        
        
        findAndMakeHandout = function (title, text, gmtext) {
            let check = findHandout(title);
            if (check) {
                log("Handout Exists");
            }
            if (findHandout(title)) {
                makeHandout(title, text, gmtext)
            }
        },

        findHandout = function (title) {
            let handout = findObjs({
                _type: 'handout',
                name: title
            })
            return handout
        },
        
        replaceHandout = function(title, text, gmtext) {
            let handout = findObjs("handout");
        }

        makeHandout = function (title, text, gmtext) {
            let handout = createObj("handout", {
                name: title,
            });
            handout.set({
                notes: text
            });
            handout.set({
                gmnotes: gmtext
            });
        },
        
        processImageToHandout = function(selected){
            let count = 0;
            if(selected){
                _.each(selected, function (token) {
                    let tokenID = token._id;
                    let tokenObj = getObj("graphic", tokenID);
                    let img = tokenObj.get("imgsrc");
                    let handout = createObj("handout",{
                        name: "Handout: "
                    });
                    handout.set("avatar", img);
                    count++;
                })
            }
            makeAndSendMenu(count + " handouts created.", "Creator", 'gm')
            
        }

        logHandoutHTML = function(msg) {
            log(msg.replace("!prod admin getHTML ",""))
            let name = msg.replace("!prod admin getHTML ","")
            let handout = findObjs({                              
                _type: "handout",
                name: name
            });
            
            if (handout[0]){
                handout[0].get("gmnotes", function(note){
                    log(note);
                })
                handout[0].get("notes", function(note){
                    log(note);
                })
            }
            
            
            
        },
        
        createLinkingHandout = function(){
            let handout = findObjs({                              
                _type: "handout",
                name: "!linking"
            });
            if(!handout[0]){
                handout[0] = createObj('handout', {
                    name: '!linking'
                });
            }
            
            /*
            let allHandouts = findObjs({
                type: "handout"
            })
            let allChars = findObjs({
                type: "character"
            })
            
            let allLinks = allHandouts.concat(allChars);
            */
            let text = ""
            let list = JSON.parse(Campaign().get("_journalfolder"))

            
            
            _.each(list, function (link) {
                let linkObj = getObj("handout", link.id);
                let name = link.get("name");
                let url = link.id
                
                
                
                text += "<a href='http://journal.roll20.net/handout/" + url + "'>" + name + "</a><br>"
                
            })
            handout[0].set({
                notes: text
            });
        }
    
   
//=========SCRIPT FUNCTIONALITY==============

        checkInstalls = function () {
            tokenModInstall = ('undefined' !== typeof TokenMod) ? true : false;
            theAaronConfigInstall = (state.TheAaron) ? true : false;
            
            if (! _.has(state,'TheAaron')){
            	state.TheAaron = {
            		config: {
            			makeHelpHandouts: false
            		}
            	};
            }
            
            state.TheAaron.config.makeHelpHandouts = false;
            
            if (!state.Roll20Pro.productName) {state.Roll20Pro.productName = "PRODUCT NAME"}
        },
    
        registerEventHandlers = function () {
            on('chat:message', handleInput);
            on('change:handout:notes', function (obj, prev) {
                runAutolink(obj, "notes")
            });
            on('change:handout:gmnotes', function (obj, prev) {
                runAutolink(obj, "gmnotes")
            });
            on('change:character:bio', function (obj, prev) {
                runAutolink(obj, "bio")
            });
            on('change:character:gmnotes', function (obj, prev) {
                runAutolink(obj, "gmnotes")
            });
        };

    on("ready", () => {
        eventLockout = false;
        registerEventHandlers();
        checkInstalls();
        log("==== " + scriptName + " v" + version + " ====");
        startText = "<p>Production Wizard ready! <br /> v" + version + "</p><br/>" + makeButton("Main Menu", "!prod", styles.button)
        makeAndSendMenu(startText, "Production Wizard", 'gm');

    });
})();
