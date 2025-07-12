//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//       PRODWIZ 0.9.13
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Changelog
// 0.9.13
// Added full help system
// Added light sensor to Dynamic Lighting Buddy
// 0.9.12
// Minor Correction on Accessing Demiplane Content handout
// 0.9.11
// Debugged new behavior of handout reversion and overwriting. Requires server fix. Warnings added until then.
// 0.9.10
// Minor change in wording to "Accessing Demiplane Content" Handout from Ceru
// Added button and menu to reduce page to 50% size to facilitate working with 140px/cell maps
// Added Scale button to size by pixel or unit
// Added another preset grid setting: Medium transparency black

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
        version = "0.9.11",
        
        styles = {
            reset: 'padding: 0; margin: 0;',
            menu: 'background-color: #999; color:#111 !important; border: 1px solid #000;border-radius: 10px; padding: 5px; font-family: &quot;Good Pro Condensed&quot;, &quot;Roboto&quot;, &quot;Verdana&quot;,sans-serif;, ',
            bigButton: 'font-size: 1.2em; background-color: pink; border: 1px solid black; border-radius: 3px; padding: 4px; margin: 2px; color: #000; text-align: center; ',
            button: 'background-color: pink; border: 1px solid black; border-radius: 3px; padding: 0px, 2px; margin: 2px; color: #000; text-align: center; ',
            smallButton: 'font-size: 0.8em; background-color: pink; border: 1px solid black; border-radius: 3px; padding: 1px, 2px; margin: 2px; color: #000; text-align: center; ',
            textButton: 'background-color: transparent; border: none; padding: 0; color: #000; text-decoration: underline',
            list: 'list-style: none;',
            float: {
                right: 'float: right;',
                left: 'float: left;'
            },
            overflow: 'overflow: hidden;',
            fullWidth: 'width: 100%;',
            title: 'margin-bottom: 10px; text-transform: capitalize; border-bottom: 2px solid; color:#111;',
            warning: 'background-color:salmon; color:#111; ',
            note: 'background-color:powderblue; color:#111; padding:3px; border-radius:4px; text-align:center;',
            sot: {
                quote: 'border-style: solid none; border-width:1px; border-color:brown; color:brown' 
            }
        },
        
        infoButton = function (linkText) {
            if (undefined !== linkText){
                if (linkText.includes("http") || linkText.includes("!prod ") ){
                    return '<a style = "text-decoration: none" href = "' + linkText + '"><span style = "font-family:pictos; color:#666; text-transform: lowercase; float:right;">j</span> </a>';
                } else
                    return '<a style = "text-decoration: none" title = "' + linkText + '"><span style = "font-family:pictos; color:#444; margin-left:5px;">?</span></a>';
            } else {
            return '';
            }
        },
        
        toolButton =  function(linkText){
             return '<a style = "font-size: 1.0em; line-height:0.8em; text-decoration: none; background-color:transparent; margin:0px 0px 0px 2px; padding:0px; border:none;font-family:pictos; color:#666; text-transform: lowercase;" href = "' + linkText + '">y</a>';
        }
        
        

        makeTitle = function (title, linkText) {
            //link = ((undefined !== linkText) ? '<a href = "' + linkText + '">' + linkButton + '</a>' : '' );
            return '<h2 style="' + styles.title + '">' + title + infoButton(linkText) + '</h2>';
        },

        makeButton = function (title, href, style, linkText) {
            return '<a style="' + style + '" href="' + href + '" title = "' + linkText + '">' + title + '</a>';

        },
        
        makeBackButton = function () {
            return '<br /><a style="' + styles.button + '" href="' + '!prod' + '">' + 'Back' + '</a>';
        },
        
        makeH4 = function(text,linkText){
            return '<h4 style = "color:#111 !important">' + text +
            infoButton(linkText) +
            //((undefined !== link) ? '<a style = "text-decoration:none" href = "' + link + '">' + linkButton + '</a>': '') +
            '</h4>'
            ;  
        },

        makeAndSendMenu = function (contents, title, whisper, callback,linkText) {
            title = (title && title != '') ? makeTitle(title,linkText) : '';
            whisper = (whisper && whisper !== '') ? '/w ' + whisper + ' ' : '';
            sendChat(scriptName, whisper + '<div style="' + styles.menu + styles.overflow + '">' + title + contents +'</div>', null, {
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
        
        updateBuddyLight = function(token) {
            if (token.get("name") === "Dynamic Lighting Buddy" && typeof checkLightLevel !== "undefined") {
                if (!token.get("emits_bright_light")) {
                    let lightData = (checkLightLevel.isLitBy(token.get("id")).total * 100).toFixed();
                    token.set("isdrawing",true);
                    token.set("bar1_value", lightData);
                    token.set("bar1_max", "100");
                } else {
                    token.set("isdrawing",true);
                    token.set("bar1_value", "");
                    token.set("bar1_max", "");

                }
            }
        },

        
        menuText = {
            main: () => "<p>v" + version + " ready.</p>" +
            ((!tokenModInstall) ? "<p style='" + styles.warning + "'> TOKEN MOD is not installed!</p>" : "") +
            //((!theAaronConfigInstall) ? "<p style='" + styles.warning + "'> AARON CONFIG is not installed!</p>" : "") +
            ((locateBuddies().length) ? "<p style='" + styles.warning + "'>There is at least one DL buddy left! Press this button to remove:<br>" + makeButton("Toggle Buddy", "!prod map buddy&#13;!prod", styles.button) + "</p>" : "") +
            ((state.Roll20Pro.productName==="PRODUCT NAME") ? "<p style='" + styles.warning + "'>Product name for this project has not been set! Setting the product name will make certain handout creation tasks easier. Press this button to give it a name:<br>" + makeButton("Change Product Name", "!prod stock changeName ?{Product Name}", styles.button) + "</p>" : "") +

            "<p>See <b><u><a href='https://roll20.atlassian.net/wiki/spaces/CP/pages/1408761861/Production+Wizard+Script' style='color:#c5006c'>How-To</a></u></b> for instructions.</p>" +

            makeButton("Autolinker Examples", "!prod autolinker", styles.bigButton, "Some examples of the autolinker functionality. Load menu for more information.")+
            makeButton("Token Helper", "!prod token", styles.bigButton, "The Token Tools page can help you set up tokens and update to UDL! Each button will do something to all selected tokens, allowing you to change options of a selection or even all of the tokens on the page! Load menu for more information.") + 
            makeButton("Map/DL Helper", "!prod map", styles.bigButton, "These tools will help you set up maps and dynamic lighting. For safety, you must place the Player Bookmark on the page you’re working on! Load menu for more information.") + 
            makeButton("Picture/Mention Finder", "!prod finder", styles.bigButton, "These tools will automatically add links to certain characters, based on other handouts! Load menu for more information.") + 
            makeButton("Stock Handouts", "!prod stock", styles.bigButton, "These tools will create stock handouts, using the copies in the Contractor module as a guide. Load menu for more information.") + 
            makeButton("Tables and Macros", "!prod tablesAndMacros", styles.bigButton, "This contains links and instructions for automating the creation of macros and tables. Load menu for more information.") + 
            makeButton("Confluence How-to articles", "!prod confluence", styles.bigButton, "These links will take you to the confluence dosumentation for common Jira tasks. Load menu for more information.") +
            makeButton("Admin Tools", "!prod admin", styles.bigButton, "Under consttruction. Load menu for more information.") +
	        makeH4("Mod Server: " + (typeof $20!=="undefined"?"EXPERIMENTAL":"DEFAULT"), "Experimental Server is now preferred. This can be set on the Mods page.")
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
            tablesAndMacros: () => "<p>Typing in all table entries and formulating their macros is tedious to do within the Roll20 VTT. The TableExport script has been added to Prod Wiz in its entirety from the Roll20 script repository. The script turns formatted API commands into rollable tables. A Google Sheet helper doc is highly recommended for formatting the commands. You can open it up and make a copy for this project by clicking the link button below. Complete instructions for using it to create tables and macros are included with the google sheet.<p>"+
    		'<p>It is not necessary to read the instructions linked below, unless you wish to understand or modify the commands being created by the spreadsheet.<p>'+
	    	'<p><hr><p>'+
    		makeButton("Link to Google Sheet Helper", "https://docs.google.com/spreadsheets/d/1KSaEV4jR3tn508G4N59uJFA2hJzktqd_VlEtSgXCSpo/edit?usp=sharing", styles.button) +
	    	makeButton("Export Table script Instructions", "!import-table", styles.button) +
            makeBackButton()
            ,
            token: () => "<p style='" + styles.note + "'>Tokens must have their 'Represented'</BR>property filled out manually.</p>" +
	        makeH4("Token Lock Selected", "These buttons will Show, Hide, or Toggle the nameplates of all selected tokens.") + 
		    makeButton("Lock", "!token-mod --on lockMovement", styles.button,"Locks all selected objects") +
		    makeButton("Unlock", "!token-mod --off lockMovement", styles.button,"Unlocks all selected objects") +
            makeH4("Show Nameplates") +
            makeButton("Show Names", "!token-mod --on showname", styles.button, "All players will be able to see the nameplates of all selected tokens") +
            makeButton("Hide Names", "!token-mod --off showname", styles.button, "No players, (not even the GM) will be able to see the nameplates of all selected tokens") +
            makeButton("Toggle Names", "!token-mod --flip showname", styles.button, "Flips the visibility of selected token nameplates. All those visible will become invisible and vice versa") +
            makeH4("Resize Tokens", "These will change all selected tokensa to their indicated size. Typically, this means medium, large, huge, and gargantuan, but check the specifications on the system’s how-to!") + 
            makeButton("1x1", "!token-mod --set width|70 height|70", styles.button) +
            makeButton("2x2", "!token-mod --set width|140 height|140", styles.button) +
            makeButton("3x3", "!token-mod --set width|210 height|210", styles.button) +
            makeButton("4x4", "!token-mod --set width|280 height|280", styles.button) +
            makeH4("Setup Token by System","https://roll20.atlassian.net/wiki/spaces/CP/pages/838860818/M4b+Set+Up+Tokens#Token-Settings") + 
            makeButton("D&D 5e", "!token-mod --set bar1_link|hp bar2_link|npc_ac bar3| bar3_link| &#13;!token-mod --set bar1_reset| &#13;!token-mod --set bar1_link|", styles.button, "bar 1: hp (enter and then set to none) NOTE: Pregens should remain linked -- bar 2: npc_ac") +
            makeButton("Pathfinder 2e", "!token-mod --set bar1_link|hit_points bar2_link|armor_class bar3| bar3_link| &#13;!token-mod --set bar1_link|", styles.button, "bar 1: hit_points (enter and then set to none) NOTE: Pregens should remain linked -- bar 2: armor_class -- Note: There is a known bug where creatures dragged in from the compendium have their token’s bars filled erroneously. Check that each attribute and their numbers are correct.") +
            makeButton("Starfinder", "!token-mod --set bar1_link|hp bar2_link|eac bar3_link|kac &#13;!token-mod &#13;!token-mod --set bar1_link|", styles.button, "bar 1: hit_points (enter and then set to none) NOTE: Pregens should remain linked -- bar 2: armor_class") +
            makeButton("Pathfinder 1e", "!token-mod --set bar1_link|hp bar2_link|ac bar3| bar3_link| &#13;!token-mod &#13;!token-mod --set bar1_link|", styles.button, "bar 1: hp (enter and then set to none) NOTE: Pregens should remain linked -- bar 2: ac") +
            makeH4("Vision","https://roll20.atlassian.net/wiki/spaces/CP/pages/838860818/M4b+Set+Up+Tokens#Updated-Dynamic-Lighting") + 
            makeButton("Vision Off", "!token-mod --set bright_vision|false", styles.button, "This should be the default for all but PC Pregens") +
            makeButton("Vision On", "!token-mod --set bright_vision|true", styles.button, "This should be left off for all but PC Pregens") +
            makeButton("Campaign-wide Vis/NV Off", "!prod token ?{This affects every placed token! Type 'off' to confirm.}", styles.button,"This affects every placed token! Use with caution") +
            makeH4("Night Vision (darkvision)") + 
            makeButton("None", "!token-mod --set has_night_vision|false night_vision_distance|0", styles.button) +
            makeButton("60 ft", "!token-mod --set has_night_vision|true night_vision_distance|60", styles.button, "60 feet of night vision, no modes") +
            makeButton("120 ft", "!token-mod --set has_night_vision|true night_vision_distance|120", styles.button, "1200 feet of night vision, no modes") + 
            makeButton("PF2: Get from senses", "!prod token UDLdv", styles.button, "For Pathfinder 2e only, you can use Get From Senses. This will look at the Senses attribute on their character sheet to see if it includes the word “Darkvision”. Keep in mind, many creatures have crazy special kinds of vision, and sometimes their senses will not exactly list Darkvision, so you’ll want to double check these.") + 
            makeH4("Token Actions", "https://roll20.atlassian.net/wiki/spaces/CP/pages/1408761861/Production+Wizard+Script#Token-Actions") + 
            makeButton("5e", "!ta", styles.button, "(D&D 2014 by Roll20, only) This command will create a full suite of token action buttons for all selected character tokens. Actions for NPCs and Attacks for PCs. Token Action Maker will put a response in chat for each character processed in this way") + 
            makeButton("5e 2024", "!ta2024", styles.button, "(D&D 2024 by Roll20, only) This command will create a token actions for Checks, saves and initiative only. We are waiting for progress from SD to be able to generate a full suite. REQUIRES EXPERIMENTAL SERVER") + 
            makeButton("5e PreGen", "!ta pc", styles.button, "This will create token actions that are appropriate for characters built as PCs, do not use on creatures that use NPC statblocks.") + 
            makeButton("For PF2", "!ta pf2", styles.button," This command will create a full suite of token action buttons for all selected character tokens using the Pathfinder 2 by Roll20 Sheet. Token Action Maker will put a response in chat for each character processed in this way.") + 
            makeButton("Delete All", "!deleteta", styles.button, "Deletes ALL token actions for selected characters, whether they were created by this script or not. Use this if you are going to re-generate token actions. Since Token Action Maker abbreviates the names of some actions (“1-H” for “One Handed” for example), deleting existing token actions before generating new ones will help prevent generating duplicate buttons. !deleteta will work on any sheet.") + 
            makeH4("Defaults", "Use these commands ONLY on a page that is for grids with no Subdivisions. Otherwise tokens will drop at the wrong size on other pages. Like normal, if you change a token’s settings, you’ll need to reassign the default token to reflect those changes!") + 
            makeButton("Assign as Default Token", "!token-mod --set defaulttoken", styles.button, "REQUIRES DEFAULT MOD SERVER. Assigns all selected tokens to their characters as their respective default tokens (just like clicking Use Selected Token on a character’s edit page).") +
            makeButton("Avatar from Token (if in library)", "!prod token avatar", styles.button, "Sets the Avatar of the character as the token image as standard") +
            makeH4("<hr>Token Page Tools", "https://roll20.atlassian.net/wiki/spaces/CP/pages/1408761861/Production+Wizard+Script#Token-Page-Creator") +
            makeButton("Assign Category", "!prod token addToCat ?{Category Number}", styles.button, "See Confluence link next to 'Token Page Tools'. Assigns a caegtory number to selected tokens. Good practices is to assign by 10s.") +
            makeButton("See Categories", "!prod token seeCats", styles.button, "See Confluence link next to 'Token Page Tools'. Sends a list to chat of which tokens are in which category.") + "<br/><br/>" +
            makeButton("Run Page Sorter", "!prod token runSorter", styles.button, "Click this button to move categorized tokens into place, and asterisks will be created next to rollable tokens. Make sure to double-check for things like accidental miscategorization, double entries, tokens that should be rollable, etc. If it looks good, finish it up by using the drawing text tool to label the categories as normal!") +
            makeButton("Reset Categories (if sure!)", "!prod token resetCats", styles.button,"Use this button to start over. This will clear all categories." ) +
            //DEPRECATED
            //makeH4("<del><i>LDL Darkvision") + 
            //makeButton("None", "!token-mod --set light_radius| light_dimradius|0", styles.button) +
            //makeButton("60 ft", "!token-mod --set light_radius|60 light_dimradius|0", styles.button) +
            //makeButton("120 ft", "!token-mod --set light_radius|120 light_dimradius|0", styles.button) + "</del></i>" +
            makeBackButton()
            ,
            map: () => "<p style='" + styles.note + "'>Player bookmark must be<BR>on your active page.</p>" +
            makeH4("Resize Map and Page","These buttons quickly resizes both the map image and the page size! Upload the map image to the map layer, then select that image.") + "<p>Select map graphic and enter width/height of image when prompted.</p>" +
            makeButton("Resize by pixel dimensions", "!prod map resize ?{Pixel width of image} ?{Pixel height of image}", styles.button, "Click to enter the width, then the height of the map image, using pixels. Automatically resizes page to fit.") + "<br/>" +
            makeButton("Resize by units", "!prod map resizeUnit ?{Unit width of image} ?{Unit height of image}", styles.button, "Click to enter the width, then the height of the image, using grid units. Automatically resizes page to fit.") + 
		        makeButton("Resize by scale", "!token-mod --set scale|*?{Input decimal value for scaling. Example 50% = 0.5|0.5}", styles.button, "Click to enter a scale percentage, expressed as a decimal. Useful for make a map half or double size. Automatically resizes page to fit.") +"<br/>" +
            makeButton("Fit Image to page", "!prod map fittopage", styles.button, "Resizes selected image to fit the current page dimensions.") + 
            makeButton("Fit Page to image", "!prod map fittoimage", styles.button, "Resizes the current page dimensions to fit the selected map dimensions.") + 
            makeButton("Reduce Page to 50%", "!prod map halfpage", styles.button, "Quickly resize a map to half its current size. Useful for maps that are intended to display at 140 pixels per unit.") + 
            makeH4("Token Lock Selected", "Locks or unlocks multiple selected tokens. This will be deprecated in Jumpgate, which can do this natively.") + 
		        makeButton("Lock", "!token-mod --on lockMovement", styles.button, "Locks all selected tokens. Locked tokens cannot be moved, resized or rotated.") +
		        makeButton("Unlock", "!token-mod --off lockMovement", styles.button, "Unlock all selected tokens. To unlock all tokens on page, select all and then push this button.") +
		        makeButton("Make Drawing", "!token-mod --set isdrawing|true", styles.button, "Use this button to make all selected images ignore grid snap and to not display token bars.") +
            makeH4("Change Grid Width","These buttons allow you to quickly change elements of the grid. This is primarily to help you quickly switch map settings when doing Dynamic Lighting tasks! These features are also available through the Dynamic Lighting Tool.") +
            makeButton("Width 1", "!prod map edit snapping_increment 1", styles.button) +
            makeButton("Width 0.5", "!prod map edit snapping_increment 0.5", styles.button) +
            makeButton("Width 0.25", "!prod map edit snapping_increment 0.25", styles.button) +
            makeButton("Width 0.125", "!prod map edit snapping_increment 0.125", styles.button, "Useful setting for dynamic lighting task.") +
            makeH4("Change Grid Opacity") +
            makeButton("Prompt", "!prod map edit grid_opacity ?{0 to 1|1}", styles.button, "Sets grid opacity from 0 (transparent) to 1 (opaque).") +
            makeH4("Change Grid Colour", "These are some default settings, but in any case, try to duplicate the look and fel of the print product, if possible.") +
            makeButton("Default Grey", "!prod map edit gridcolor #C0C0C0", styles.button, "If this looks odd or is hard to see, try black at reduced opacity.") +
            makeButton("High Vis Pink", "!prod map edit gridcolor #ff00ff", styles.button, "Useful for dynamic lighting tasks, as it stands out against most map images.") +
            makeButton("High Vis Green", "!prod map edit gridcolor #00ff00", styles.button, "Useful for dynamic lighting tasks, as it stands out against most map images.") +
            makeButton("Med Vis Green", "!prod map edit gridcolor #93c47d", styles.button, "Useful for dynamic lighting tasks, as it stands out against most map images.") +
            makeH4("Toggle Dynamic Lighting Buddy", "This will create or delete a token for testing Dynamic Lighting. The token has a light radius of 100'. The script will remember if any buddies are active, and will output 'Buddy still in game' on the main menu if any are still on, so we can check that we've deleted all of them! ") + 
            makeButton("Toggle Buddy", "!prod map buddy", styles.button, "Creates a Dyanmic Lighting Buddy, or deletes all if any are already existing.") +
            makeButton("Buddy Menu", "!prod buddy", styles.button, "Calls up a menu for controlling properties of Dynamic Lighting Buddy.") +
            makeButton("Check Light Level", "!checkLightLevel", styles.button, "Reports the amount of light that hits the selected token.") +
            makeH4("Path Splitter-Use Black for Splitter", "https://roll20.atlassian.net/wiki/spaces/CP/pages/1580269644/M2+Apply+Dynamic+Lighting?force_transition=49083de2-88a6-4450-af97-e11a959e2b20#Path-Splitter") +
            makeButton("Split Path", "!pathSplit", styles.button, "Splits a path based upon it's intersections with an overlapping black path.") +
            makeButton("Join Path", "!pathJoin", styles.button, "Joins the closest end points of two separate paths.") +
            makeButton("Close Path", "!pathClose", styles.button, "Closes a single selected path that has two open end points. Useful for constructing complex shapes.") +
            makeH4("Import Generic Battle Map", "These buttons import the generic battle map we include with most conversion products. The Jira task or the Progress Sheet will tell you which one to use. You must be on a blank page, and the player flag must be on this page.") +
            makeButton("Parchment", "!prod battlemap parchment", styles.button, "You must be on a blank page, and the player flag must be on this page.") + 
            makeButton("Modern/SF", "!prod battlemap modern", styles.button, "You must be on a blank page, and the player flag must be on this page.") + 
            makeH4("Dynamic Lighting Tool","This calls up a tool that will change virtually every setting regarding dynamic lighting in real time. There are preset buttons for common grid settings and Daylight Levels, and controls for  most everythign else. There are also a couple of Dynamic Lighting related tasks (Buddy and Split Path) repeated here for convenience. The DL Tool has full help links built in.") +
            makeButton("Full Report", "!dltool", styles.button, "This is the full menu for Dynamic Lighting Tool.") +
            makeButton("Page Tools", "!dltool --report|extra", styles.button,"This contains most of the commands you might need while dynamically lighting a page.") +
            makeBackButton()
            ,

            buddy: () => 
            makeButton("Toggle Buddy", "!prod map buddy", styles.button, "This will create a Dynamic Lighting buddy if none exists, and remove all Buddies if one does exist.") + 
            makeH4("Nightvision", "Dynamic Lighting Buddy Night vision controls. Use to check if light sources are behaving as expected.") +
            makeButton("On", "!prod buddy nightvision_on", styles.button, "This will show what a character withNight vision would see.") + 
            makeButton("Off", "!prod buddy nightvision_off", styles.button, "This will show what a character without night vision would see. Useful for checking illumination levels provided by palced light sources.") + 
            makeH4("Light", "This will toggle light being emitted by the Buddy. Default is 100 feet of bright light.") +
            makeButton("On", "!prod buddy brightlight_on", styles.button, "Useful for quickly checking for light leaks.") + 
            makeButton("Off", "!prod buddy brightlight_off", styles.button) +
            makeH4("Layer", "These buttons move the Dynamic Lighting Buddy between layers") +
            makeButton("Dynamic Lighting", "!prod buddy dl_layer", styles.button, "Moves buddy to Dynamic Lighting layer. This is the default.") + 
            makeButton("Token", "!prod buddy token_layer", styles.button, "Moves buddy to Token layer. Useful if dynamic lighting lines are distracting.") + 
            "<p>If the Vision token is on the token layer and not shining any light, a bar will appear above the buddy, showing the amount of light shining on it." + 
            makeBackButton()
            ,

            
            finder: () => 
            makeH4("NPC Handout Finder", "https://roll20.atlassian.net/wiki/spaces/CP/pages/1408761861/Production+Wizard+Script#Art-Handout-Linker") +
            makeButton("Find for All Characters", "!prod finder art", styles.button, "As below, but for all characters in the game.") + 
            makeButton("Find for Selected Only", "!prod finder artSelected", styles.button, "This button will search for a handout titled exactly like the character that the selected token represents. If one is found, it will check to make sure the Bio doesn’t already contain the word 'Picture:' in it. If that word isn’t found in the Bio, it will add 'Picture: Handout (Name)' to the top of the Bio.") + 
            makeH4("NPC Mention Finder","This tool will go through all characters, or characters of selected tokens, and attempt to add '(s) may be found in the following location(s):' to selected characters' gmnotes. --NOTE: Since this script doesn't understand context, it may gather irrelevant mentions, or pick up completely incorrect ones (the word 'shaggy' will count as a mention for 'hag'). In addition, it won't add things like room numbers or areas. This tool is meant largely as a starting point for us to carefully edit.") +
            makeButton("Find for All Characters", "!prod finder mention", styles.button, "As below, but for all characters in the game.") + 
            makeButton("Find for Selected Only", "!prod finder mentionSelected", styles.button, "search all handouts for any mention of the character's name, or any links to that character. If any are found, it will check to make sure that the GM Notes section doesn’t already contain the words “may be found”. If that phrase isn’t found in the GM Notes, it will add all links to all mentions of that character in a bullet list.") +
            makeH4("Make Blank Handouts", "Useful for creating a large number of handouts at once.") +
            makeButton("Blank Player Art Handouts", "!prod stock create artHandout ?{How many blank Player Art Handouts do you wish to create?|1}", styles.button, "This button creates empty art handouts, titled 'Player Art Handout: '. This may save you some time if you are making al ot of them manually.") +
            makeButton("Blank Handouts", "!prod stock create blankHandout ?{How many blank Handouts do you wish to create?|1}", styles.button, "This button creates empty blank handouts, titled 'Handout: . This may save you some time if you are making al ot of them manually.") +
            makeBackButton()
            ,
            stockHandouts: () =>
            `<p>Current Product Name: ${state.Roll20Pro.productName}</p>` +
            makeButton("Change Product Name", "!prod stock changeName ?{Product Name}", styles.button) +
            makeH4("Roll20 Handouts", "All of these handouts are based on Templates found in the Production game. The names should be self-explanatory.") + 
            makeButton("Map Scale", "!prod stock create battleMap", styles.button) +
            makeButton("Macros and Tables", "!prod stock create macroHandout", styles.button) +
            makeButton("Blank Player Art Handouts", "!prod stock create artHandout ?{How many blank Player Art Handouts do you wish to create?|1}", styles.button) +
            makeButton("Blank Handouts", "!prod stock create blankHandout ?{How many blank Handouts do you wish to create?|1}", styles.button) +
            makeButton("Game Settings", "!prod stock create gameSettings", styles.button) +
            makeButton("Module Shortcuts", "!prod stock create moduleShortcutHandout", styles.button) +
            makeButton("Accessing Compendium Content", "!prod stock create accessingCompendiumContentHandout", styles.button) +
            makeButton("Accessing Demiplane Content", "!prod stock create accessingDemiplaneContentHandout", styles.button) +
            makeButton("NPC Initiative", "!prod stock create npcInitiativeHandout", styles.button) +
            makeButton("Rollable Tokens", "!prod stock create rollableTokensHandout", styles.button) +
            makeButton("Navigation Links", "!prod stock create navigationLinksExampleHandout", styles.button) +
            makeButton("Patch Notes", "!prod stock create patchNotesExampleHandout", styles.button) +
            makeH4("DnD5e Spellbook Templates Handouts") + 
            makeButton("Drow Mage Spell", "!prod stock create drowMageBaseSpellHandout", styles.button) +
            makeH4("Pathfinder 1 Templates") + 
            makeButton("Wand, Level 1", "!prod stock create wandHandout", styles.button) +
            makeButton("Potion, Level 1", "!prod stock create potionHandout", styles.button) +
            makeButton("Spell Scroll, Level 1", "!prod stock create spellScrollHandout", styles.button) +
            makeButton("Using Roll20 Card Decks", "!prod stock create cardDecksHandout", styles.button) +
            makeH4("Credits") + 
            makeButton("Roll20", "!prod stock create creditsRoll20Handout", styles.button) +
            makeButton("No Compendium", "!prod stock create creditsPublisherHandout", styles.button) +
            makeH4("Thank You for Purchasing Handouts") + 
            makeButton("Roll20", "!prod stock create thankyouRoll20Handout", styles.button) +
            makeButton("DMsGuild", "!prod stock create thankyouDMsGuildHandout", styles.button) +
            makeButton("Pathfinder Infinite", "!prod stock create thankyouPFIHandout", styles.button) +
            makeButton("Miskatonic", "!prod stock create thankyouMiskatonicHandout", styles.button) +
            makeH4("Import Generic Battle Map", "These buttons import the generic battle map we include with most conversion products. The Jira task or the Progress Sheet will tell you which one to use. You must be on a blank page, and the player flag must be on this page.") +
            makeButton("Parchment", "!prod battlemap parchment", styles.button, "You must be on a blank page, and the player flag must be on this page.") + 
            makeButton("Modern/SF", "!prod battlemap modern", styles.button, "You must be on a blank page, and the player flag must be on this page.") + 
            makeH4("Contractor Module","This game contains all the originals of these handouts and is considered the official source. When making changes to the originals, plase inform Keith or Mik, so that they can ensure that all handouts created match our templates.") + 
            makeButton("Go to Contractor Module", "https://app.roll20.net/campaigns/details/16657049/contractor-module", styles.button) +
            //makeButton("!linking", "!prod stock linking", styles.button) + //UNDER CONSTRUCTION
            makeBackButton()
,
            confluence: () =>
    makeH4("Phase 1 Tasks") +
    makeButton("A1 Create Tokens", "https://roll20.atlassian.net/wiki/spaces/CP/pages/266311/A1+Create+Tokens", styles.smallButton) + "<br>" +
    makeButton("A1 Create Art Portraits", "https://roll20.atlassian.net/wiki/spaces/CP/pages/3257466911/A1+Create+Art+Portraits", styles.smallButton) + "<br>" +
    makeButton("C1 Structured Data", "https://roll20.atlassian.net/wiki/spaces/CP/pages/826933843/C1+Structured+Data", styles.smallButton) + "<br>" +
    makeButton("C1 Format Compendium Text", "https://roll20.atlassian.net/wiki/spaces/CP/pages/847250081/C1+Format+Compendium+Text", styles.smallButton) + "<br>" +
    makeButton("M1 Edit Upload & Set Up Maps", "https://roll20.atlassian.net/wiki/spaces/CP/pages/847283041/M1+Edit+Upload+and+Set+Up+Maps", styles.smallButton) + toolButton("!prod map") + "<br>" +
    makeH4("Phase 2 Tasks") +
    makeButton("A2 Organize Art Pack", "https://roll20.atlassian.net/wiki/spaces/CP/pages/837681451/A2+Organize+Art+Pack", styles.smallButton) + "<br>" +
    makeButton("C2 Upload Tokens to Compendium", "https://roll20.atlassian.net/wiki/spaces/CP/pages/3257434272/C2+Upload+Tokens+to+Compendium", styles.smallButton) + "<br>" +
    makeButton("C2 Upload Compendium Images", "https://roll20.atlassian.net/wiki/spaces/CP/pages/2970124323/C2+Upload+Compendium+Images", styles.smallButton) + "<br>" +
    makeButton("M2 Format Module Text", "https://roll20.atlassian.net/wiki/spaces/CP/pages/842039944/M2+Format+Module+Text", styles.smallButton) + "<br>" +
    makeButton("M2 Upload Advent. Images to Handouts", "https://roll20.atlassian.net/wiki/spaces/CP/pages/2325184938/M2+Upload+Adventure+Images+to+Handouts", styles.smallButton) + toolButton("!prod finder") + "<br>" +
    makeButton("M2 Drag & Adjust Item Text Handouts", "https://roll20.atlassian.net/wiki/spaces/CP/pages/2317289449/M2+Drag+and+Adjust+Item+Text+Handouts", styles.smallButton) + "<br>" +
    makeButton("M2 Apply Dynamic Lighting", "https://roll20.atlassian.net/wiki/spaces/CP/pages/1580269644/M2+Apply+Dynamic+Lighting", styles.smallButton) + toolButton("!prod map") + "<br>" +
    makeButton("C2 Create Table of Contents & Page Order", "https://roll20.atlassian.net/wiki/spaces/CP/pages/842236319/C2+Create+Table+of+Contents+and+Page+Order", styles.smallButton) + "<br>" +
    makeH4("Phase 3 Tasks") +
    makeButton("M3 Create Rollable Tables & Macros", "https://roll20.atlassian.net/wiki/spaces/CP/pages/47186055/M3+Create+Rollable+Tables+and+Macros", styles.smallButton) + toolButton("!prod tablesAndMacros") + "<br>" +
    makeButton("M3 Drag & Adjust Supplemental Handouts", "https://roll20.atlassian.net/wiki/spaces/CP/pages/2970550420/M3+Drag+and+Adjust+Supplemental+Handouts", styles.smallButton) + "<br>" +
    makeButton("M3 Upload Item Portraits", "https://roll20.atlassian.net/wiki/spaces/CP/pages/3256975522/M3+Upload+Item+Portraits", styles.smallButton) + toolButton("!prod finder") + "<br>" +
    makeButton("C3b Link Other Options & Features Blobs", "https://roll20.atlassian.net/wiki/spaces/CP/pages/2976776287/C3b+Link+Other+Options+and+Features+Blobs", styles.smallButton) + "<br>" +
    makeButton("M3b Drag & Adjust Stat Blocks", "https://roll20.atlassian.net/wiki/spaces/CP/pages/2359263347/M3b+Drag+and+Adjust+Stat+Blocks", styles.smallButton) + "<br>" +
    makeH4("Phase 4 Tasks") +
    makeButton("M4a Upload & Link NPC Art Portraits", "https://roll20.atlassian.net/wiki/spaces/CP/pages/838795266/M4a+Upload+and+Link+NPC+Art+Portraits", styles.smallButton) + toolButton("!prod finder") + "<br>" +
    makeButton("M4a Upload Tokens to Module", "https://roll20.atlassian.net/wiki/spaces/CP/pages/3257598083/M4a+Upload+Tokens+to+Module", styles.smallButton) + "<br>" +
    makeButton("M4a Link Text", "https://roll20.atlassian.net/wiki/spaces/CP/pages/2969927681/M4a+Link+Text", styles.smallButton) + toolButton("!prod autolinker") + "<br>" +
    makeButton("M4b Set Up Tokens", "https://roll20.atlassian.net/wiki/spaces/CP/pages/838860818/M4b+Set+Up+Tokens", styles.smallButton) + toolButton("!prod finder") + toolButton("!prod token") + "<br>" +
    makeButton("M4b Add Location Info", "https://roll20.atlassian.net/wiki/spaces/CP/pages/2317289721/M4b+Add+Location+Info", styles.smallButton) + toolButton("!prod finder") + "<br>" +
    makeButton("M4c Place Tokens on Maps", "https://roll20.atlassian.net/wiki/spaces/CP/pages/2124808454/M4c+Place+Tokens+on+Maps", styles.smallButton) + "<br>" +
    makeButton("M4c Create Roll20 Handouts", "https://roll20.atlassian.net/wiki/spaces/CP/pages/627220/M4c+Create+Roll20+Handouts", styles.smallButton) + toolButton("!prod stock") + "<br>" +
    makeButton("M4c Create Roll20 Tips Page", "https://roll20.atlassian.net/wiki/spaces/CP/pages/2982707217/M4c+Create+Roll20+Tips+Page", styles.smallButton) + "<br>" +
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
                //log(msg);
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
                    case "autolinker": makeAndSendMenu(menuText.autolinker(), "Autolinker Examples", caller, undefined, "https://roll20.atlassian.net/wiki/spaces/CP/pages/1408761861/Production+Wizard+Script#Autolinker"); break;
                    case "token": 
                        switch (args[2]) {
                            default: 
                            case "menu": makeAndSendMenu(menuText.token(), "Token Helper", caller,undefined,"https://roll20.atlassian.net/wiki/spaces/CP/pages/1408761861/Production+Wizard+Script#Token-Helper"); break;
                            case "avatar": tokenChangeAvatar(selected); break;
                            case "addToCat": if (onPlayerPage(msg)) {addToCat(args[3], selected);}
                                break;
                            case "seeCats": seeCats(); break;
                            case "runSorter": if (onPlayerPage(msg)) {runGenerateTokenPage();} 
                                break;
                            case "resetCats": resetCats(); break;
                            case "UDLdv": tokenPF2DarkvisionChecker(selected); break;
                            case "off": turnOffAllTokenVision(); break;
                        } 
                        break;
                    case "buddy": 
                        switch (args[2]) {
                            default: 
                            case "menu": makeAndSendMenu(menuText.buddy(), "DL Buddy", caller, undefined, "https://roll20.atlassian.net/wiki/spaces/CP/pages/1408761861/Production+Wizard+Script#Dynamic-Lighting-Buddy"); break;
                            case "nightvision_on": buddyActions("nightvision_on"); break;
                            case "nightvision_off": buddyActions("nightvision_off"); break;
                            case "brightlight_on": buddyActions("brightlight_on"); break;
                            case "brightlight_off": buddyActions("brightlight_off"); break;
                            case "token_layer": buddyActions("token_layer"); break;
                            case "dl_layer": buddyActions("dl_layer"); break;
                            case "toggle": buddyActions("toggle"); break;
                        } 
                        break;
                    case "finder":
                        switch (args[2]) {
                            default: 
                            case "menu": makeAndSendMenu(menuText.finder(), "Mention Finder", caller, undefined, "https://roll20.atlassian.net/wiki/spaces/CP/pages/1408761861/Production+Wizard+Script#Mention-Finders"); break;
                            case "art": artFinder("all"); break;
                            case "artSelected": artFinder(selected); break;
                            case "mention": mentionFinder("all"); break;
                            case "mentionSelected": mentionFinder(selected); break;
                            case "emptyHandouts": createEmptyHandouts(); break;
                            case "process": processImageToHandout(selected); break;
                        } 
                        break;
                    case "battlemap":
                        switch (args[2]) {
                            default: 
                            case "parchment": battlemapMaker("parchment", msg); break;
                            case "modern": battlemapMaker("modern", msg); break;
                        } 
                        break;
                    case "map": 
                        switch (args[2]) {
                            default: 
                            case "menu": makeAndSendMenu(menuText.map(), "Map Helper", caller, "https://roll20.atlassian.net/wiki/spaces/CP/pages/1408761861/Production+Wizard+Script#Map-/-Dynamic-Lighting-Tools"); break;
                            case "resize": if (onPlayerPage(msg)) {resizeMap(args[3], args[4], msg)} break;
                            case "resizeUnit": if (onPlayerPage(msg)) {resizeMapUnit(args[3], args[4], msg)} break;
                            case "fittopage": if (onPlayerPage(msg)) {fitToPage(msg)} break;
                            case "fittoimage": if (onPlayerPage(msg)) {fitToImage(msg)} break;
                            case "halfpage": if (onPlayerPage(msg)) {halfPage(msg)} break;
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
                            case "create": createStockHandout(args[3], caller, args[4]); break;
                            //TO DO: actual handouts :/
                        }
                        break;
                    case "page":
                        switch (args[2]) {
                            default: 
                            case "parchment": createPage("Generic Battle Mat","https://s3.amazonaws.com/files.d20.io/images/402650450/HfnSkKN2C6P0akykDKV9SA/thumb.jpg?17221262475"); break;
                            case "modern": createPage("Generic Battle Mat","https://s3.amazonaws.com/files.d20.io/images/396503153/gHUo59MwLQrQXMcM0Adpbw/thumb.jpg?17180502475"); break;
                            //TO DO: actual handouts :/
                        }
                        break;
                    case "deck":
                        switch (args[2]) {
                            default: 
                            case "create": createDeck(extString); break;
                            case "createCard": createCard(extString); break;
                            case "linking": createLinkingHandout(); break;
                            case "changeName": state.Roll20Pro.productName = extString; break;
                            case "gcreate": createStockHandout(args[3], caller); break;
                            //TO DO: actual handouts :/
                        }
                        break;
                    
                    case "tablesAndMacros": makeAndSendMenu(menuText.tablesAndMacros(), "Tables and Macros", caller); break;
                        
                    case "admin":
                        switch (args[2]) {
                            default: 
                            case "menu": makeAndSendMenu(menuText.admin(), "Admin Tools", caller); break;
                            case "getHTML": logHandoutHTML(msg.content); break;
                            case "autoNav": autoNav(extString); break;
                            case "deleteAllHandouts": deleteHandouts(); break;
                            case "insertFulltext": insertFulltext(msg.content);
                            //case "linking": createLinkingHandout(); break;
                            //TO DO: admin reset
                        }
                        break;                        

                    case "confluence":
                        switch (args[2]) {
                            default: 
                            case "menu": makeAndSendMenu(menuText.confluence(), "Confluence Articles", caller); break;
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
                    case "gr": 
                        return '<a href="`/gmroll ' + spell[1] + '">' + spell[1] + "</a>";
                        break;
                    case "r": 
                        return '<a href="`/roll ' + spell[1] + '">' + spell[1] + "</a>";
                        break;
                    case "sot-quote":
                        return `<div style="` + styles.sot.quote + `">` + spell[1] + `</div>`
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

        report = function(selected){
            let idList = [];
            let nameList = [];
            
            _.each(selected, function(tok){
                token = getObj("graphic", tok._id);

            })
        }
        
        tokenChangeAvatar = function(selected){
            if (selected){
                _.each(selected, function(token){
                    tok = getObj("graphic", token._id)
                    img = tok.get("imgsrc");
                    log(tok.get("represents"));
                    if (tok.get("represents") == ""){
                        makeAndSendMenu("There is no Represented field for one or more tokens", "Admin Tools", 'gm');
                        return;
                    }
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
        
        turnOffAllTokenVision = function(){
            log("running turn off all vision")
            var tokens = findObjs({                              
              _type: "graphic"           
            });
            _.each(tokens, function(token) {
                log(token.get("name"));
                //token.set("has_night_vision", false);
                token.set("has_bright_light_vision", false);
                
            });
        }
        
//==========CARD STUFF==============

        createDeck = function(deckName){
            let newDeck = createObj('deck', {
                name: deckName
            })
        makeAndSendMenu("Deck ID is: <br />" + newDeck.id, "Roll20 Producer", 'gm');

        }
        
        createCard = function(cardJSON){
            let obj = JSON.parse(cardJSON); 
            //obj._deckid = deckID;
            let newCard = createObj('card', obj);
        }

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
                    log(tokenObj);
                    if (tokenObj == undefined) {return;}
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
        
        fitToPage = function (msg) {

            let selected = msg.selected;

                if (undefined === selected || undefined === selected[0]) {
                    makeAndSendMenu("No map image selected!", "Roll20 Producer Error", 'gm');
                } else {

                    let lastPageID = getObj('player', msg.playerid).get('_lastpage');
                    let pageID = Campaign().get("playerpageid")
                    let page = getObj("page", pageID);
                    if (pageID == lastPageID) {

                        tokenID = selected[0]._id;
                        tokenObject = getObj("graphic", tokenID)
                        let width = page.get("width")*70;
                        let height = page.get("height")*70;
                        
                        //page.set("width", width / 70);
                        //page.set("height", height / 70);
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
            
        },
        
        fitToImage = function(msg) {

            selected = msg.selected
            log("selected = " + selected);
            if (undefined === selected || !selected) {
                makeAndSendMenu("No reference graphic selected!", "Roll20 Producer Error", 'gm');
            } else {

                width = getObj("graphic", selected[0]._id).get("width");
                height = getObj("graphic", selected[0]._id).get("height");

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
                        }

                    }
                }
            }
        },
        
      halfPage = function(msg) {
            let lastPageID = getObj('player', msg.playerid).get('_lastpage');
            let pageID = Campaign().get("playerpageid")
            let page = getObj("page", pageID);
            let width = page.get("width");
            let height = page.get("height");
            if (pageID == lastPageID) {
                page.set("width", width / 2);
                page.set("height", height / 2);
            makeAndSendMenu("Select any map images and fit them to the new page size. <BR>"  + makeButton("Fit to Page", "!prod map fittopage", styles.button), "Page Resized to 50%", 'gm');
                };
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

        battlemapMaker = function(maptype, msg) {
            let lastPageID = getObj('player', msg.playerid).get('_lastpage');
            let pageID = Campaign().get("playerpageid")
            let page = getObj("page", pageID);
            let allObjects = findObjs
            let currentPageGraphics = findObjs({
                _pageid: Campaign().get("playerpageid"),
                _type: "graphic",
            });
            let imageSource = maptype === "parchment" ? "https://s3.amazonaws.com/files.d20.io/images/396503153/gHUo59MwLQrQXMcM0Adpbw/thumb.jpg?17180502475" : "https://s3.amazonaws.com/files.d20.io/images/402650450/HfnSkKN2C6P0akykDKV9SA/thumb.jpg?17221262475";

            if (pageID == lastPageID && currentPageGraphics.length === 0) {
                page.set("width", 20);
                page.set("height", 20);
                page.set("name", "Generic Battle Map");
                let battlemap = createObj('graphic', {
                    pageid: pageID,
                    left: 700,
                    top: 700,
                    height: 1400,
                    width: 1400,
                    imgsrc: imageSource,
                    layer: "map"
                });

            } else {
                makeAndSendMenu("For safety, The player bookmark must be on your page, and the page must contain no existing graphics!", "Roll20 Producer Error", 'gm');
            }
        },
        
        
        locateBuddies = function() {
            buddies = findObjs({                              
                _type: "graphic",
                name: "Dynamic Lighting Buddy"
            });
            //log(buddies.length);
            return buddies;
            
        },

        buddyActions = function (msg) {
            buddies = locateBuddies();
            if (buddies.length > 0 ){
                _.each(buddies, function(buddy){
                    
            switch (msg) {
                case "nightvision_on":
                    buddy.set("has_night_vision",true);
                    buddy.set("night_vision_distance",60);
                    buddy.set("imgsrc","https://s3.amazonaws.com/files.d20.io/images/402350944/GVueKntkrrg3t2AEbKbupQ/thumb.png?172193992955");
                break;
                case "nightvision_off":
                    buddy.set("has_night_vision",false);
                    buddy.set("imgsrc","https://s3.amazonaws.com/files.d20.io/images/402350946/2efm18DOG7dZ4kXUoZxJlw/thumb.png?172193992955");
                break;
                case "brightlight_on":
                    buddy.set("emits_bright_light",true);
                    buddy.set("bright_light_distance",100);
                    buddy.set("imgsrc","https://s3.amazonaws.com/files.d20.io/images/402350945/M5oGrWornuvvyq3ynnM09Q/thumb.png?172193993055");
                break;
                case "brightlight_off":
                    buddy.set("emits_bright_light",false);
                    buddy.set("has_night_vision",false);
                    buddy.set("imgsrc","https://s3.amazonaws.com/files.d20.io/images/402350946/2efm18DOG7dZ4kXUoZxJlw/thumb.png?172193992955");
                break;
                case "token_layer":
                    buddy.set("layer","objects");
                break;
                case "dl_layer":
                    buddy.set("layer","walls");
                break;
                case "toggle":
                sendChat ("ProdWiz","/w gm All buddies deleted");
                toggleBuddy();
                return;
                break;  
                }
                })
            } else {
                sendChat ("ProdWiz","/w gm No buddies exist in the game. Create a buddy before using this command")
        }
        },
        
        toggleBuddy = function (msg) {
            buddies = locateBuddies();
            if (buddies.length > 0 ){
                _.each(buddies, function(buddy){
                    buddy.remove();
                    log("Buddy Deleted");
                })
            } else {
                let who = (getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname');
                let caller = '"' + who + '"'
                makeAndSendMenu(menuText.buddy(), "DL Buddy",caller,undefined,"https://roll20.atlassian.net/wiki/spaces/CP/pages/1408761861/Production+Wizard+Script#Dynamic-Lighting-Buddy");
                let pageID = getObj('player', msg.playerid).get('_lastpage');
                newBuddy = createObj("graphic", {
                    name: "Dynamic Lighting Buddy",
                    //imgsrc: 'https://s3.amazonaws.com/files.d20.io/images/140823448/E4Kn8ggLQWyRtaJHzLAPAw/thumb.png?1591297505',
                    imgsrc: 'https://s3.amazonaws.com/files.d20.io/images/402350945/M5oGrWornuvvyq3ynnM09Q/thumb.png?172193993055',
                    _pageid: pageID,
                    layer: "walls",
                    has_bright_light_vision: true,
                    emits_bright_light: true,
                    bright_light_distance: "100",
                    isdrawing: true,
                    controlledby: "all",
                    top: 70,
                    left: 70,
                    width: 70,
                    height: 70
                });
                //sendChat ("ProdWiz", "!prod buddy");

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
                                        let newText = "<h3>Location(s):</h3>";
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
    battleMap: () => `<h2>Map Handout</h2><p>Map scale varies across the collection of maps within <i>${state.Roll20Pro.productName}</i>. To make movement and token placement ideal, we have adjusted the grid on some of the maps so that tokens are easier to select and manipulate. Listed below are all the maps in this module and what scale they are currently set to.</p><hr><h3>5 Foot Maps</h3><p>Each grid square is 5' on the art as well as 5' on the Roll20 grid. No adjustments are needed.</p><p><strong>5 Foot Maps in <i>${state.Roll20Pro.productName}</i></strong><br></p><ul><li>Map1</li><li>Map2</li></ul><hr><h3>10 Foot Maps</h3><p>Each grid square on the art is 10' with a single subdivision in the Roll20 grid (<strong>Grid Size</strong> set to <strong>0.5</strong> units). Each Roll20 grid square is 5'. Tokens are sized accordingly to [Game_System] Rules (5', 10', 15', 20'). No adjustments are needed for strategy accuracy.</p><p><strong>10 Foot Maps in <i>${state.Roll20Pro.productName}</i></strong><br></p><ul><li>Map1</li><li>Map2</li></ul><hr><h3>20 Foot Maps</h3><p>Each grid square on the art is 20' with a four subdivisions in the Roll20 grid (<strong>Grid Size</strong> set to <strong>0.25</strong> units). Each Roll20 grid square is 5'. Tokens are sized accordingly to [Game_System] Rules (5', 10', 15', 20'). No adjustments are needed for strategy accuracy.</p><p><strong>20 Foot Maps in <i>${state.Roll20Pro.productName}</i></strong><br></p><ul><li>Map1</li><li>Map2</li></ul><hr><h3>40 Foot Maps</h3><p>Each grid square on the art is 40' with a single subdivision in the Roll20 grid (<strong>Grid Size</strong> set to <strong>0.5</strong>). Each Roll20 grid square is 20'. Medium/Small tokens are set to .5 by .5 units (technically 20' by 20') here.</p><p>If you wish to set it for scale accuracy, set the <strong>Grid Size</strong> in Page Settings to <strong>0.125</strong> units. Token size is as follows: Medium/Small/Tiny (0.125 unit by 0.125 unit), Large (0.25 unit by 0.25 unit), Huge (0.375 unit by 0.375 unit), gargantuan (0.5 unit by 0.5 unit)</p><p><strong>40 Foot Maps in <i>${state.Roll20Pro.productName}</i></strong><br></p><ul><li>Map1</li><li>Map2</li></ul><hr><h3>50 Foot Maps</h3><p>Each grid square on the art is 50' with a single subdivision in the Roll20 grid (<strong>Grid Size</strong> set to <strong>0.5</strong>). Each Roll20 grid square is 25'. Medium/Small tokens are set to .5 by .5 units (technically 25' by 25') here.</p><p>If you wish to set it for scale accuracy, set the <strong>Grid Size</strong> in Page Settings to <strong>0.1</strong> units. Token size is as follows: Medium/Small/Tiny (0.1 unit by 0.1 unit), Large (0.2 unit by 0.2 unit), Huge (0.3 unit by 0.3 unit), gargantuan (0.4 unit by 0.4 unit)</p><p><strong>50 Foot Maps in <i>${state.Roll20Pro.productName}</i></strong><br></p><ul><li>Map1</li><li>Map2</li></ul><hr><h3>100 Foot Maps</h3><p>Each grid square on the art is 100' with no subdivisions in the Roll20 grid (<strong>Grid Size</strong> set to <strong>1</strong>). Each Roll20 grid square is 100'. Medium/Small tokens are set to 1 by 1 units (technically 100' by 100') here.</p><p>If you wish to set it for scale accuracy, set the <strong>Grid Size</strong> in Page Settings to <strong>0.05</strong> units. Token size is as follows: Medium/Small/Tiny (0.05 unit by 0.05 unit), Large (0.1 unit by 0.1 unit), Huge (0.15 unit by 0.15 unit), gargantuan (0.2 unit by 0.2 unit)</p><p><strong>100 Foot Maps in <i>${state.Roll20Pro.productName}</i></strong><br></p><ul><li>Map1</li><li>Map2</li></ul><hr><h3>Large Area Maps</h3><p>These maps may or may not have a visible grid, but are sized so that if you use the Measurement Tool, it will count the correct distance length. If you wish to set it for scale accuracy, enable the <strong>Grid</strong>, set the <strong>Cell Width</strong> in <strong>Page Settings</strong> to the number in parenthesis after the map name, and the <strong>Grid Cell Distance</strong> to <strong>5 ft.</strong> The interface may become difficult at extremely low cell widths, and maps without a conversion number are unsuitable for a tactical scale. Once the grid is adjusted, tokens dropped onto the map will scale appropriately. See <a href = "https://help.roll20.net/hc/en-us/articles/360039675373-Page-Settings#PageSettings-PageScale">Adjusting the Grid Settings</a> in the <a href = "https://help.roll20.net/hc/en-us">Help Center</a>.</p><p><strong>Large Area Maps in <i>${state.Roll20Pro.productName}</i></strong><br></p><ul><li>Map1</li><li>Map2</li></ul><hr><h3>Extra Large 5 Foot Maps</h3><p>Each grid square is 5' on the map, but <strong>Grid Size</strong> is set to <strong>0.5</strong> units to minimize game load. Tokens are sized appropriately and no adjustments are needed.</p><p><strong>Extra Large 5 Foot Maps in <i>${state.Roll20Pro.productName}</i></strong><br></p><ul><li>Map1</li><li>Map2</li></ul><hr><h3>Isometric/Dimetric Maps</h3><p>Isometric and Dimetric maps have been set to the grid measurements listed below.</p><p><strong>Isometric/Dimetric Maps in <i>${state.Roll20Pro.productName}</i></strong><br></p><ul><li>Map1 (1 unit = 5 ft.)</li><li>Map2 (1 unit = 5 ft.)</li></ul><hr><h3>Maps with Multiple Scales</h3><p>These maps have more than one scale due to sub-maps. If you wish to set the grid for scale accuracy, set the <strong>Grid Cell Distance</strong> in <strong>Page Settings</strong> to the corresponding values shown below.</p><p><strong>Maps with Multiple Scales in <i>${state.Roll20Pro.productName}</i></strong><br></p><ul><li>Map1<ul><li>x ft. map: Set grid cell distance = <strong>x</strong> ft. (Default)</li><li>x ft. map: Set grid cell distance = x ft.</li></ul><li>Map2<ul><li><strong>x</strong<strong>x</strong> ft. map: Set grid cell distance = <strong>x</strong> ft. (Default)</li><li><strong>x</strong> ft. map: Set grid cell distance = <strong>x</strong> ft.</li></ul></li></ul><hr><h3>Illustrative Maps</h3><p>Illustrative maps are intended for reference only. Their grids do not line up with the Roll20 grid and do not make for a satisfying tactical experience for most groups. The Roll20 grids have been disabled on these maps.</p><p><strong>Illustrative Maps in <i>${state.Roll20Pro.productName}</i></strong><br></p><ul><li>Map1</li><li>Map2</li></ul>`,
    macroHandout: () => `With&nbsp;<i>${state.Roll20Pro.productName}</i>, Roll20 has provided Macros and Rollable Tables for quick GM use in certain situations, such as rollable tables or traps/situations with multiple rolls. These appear in the “Collections” tab for the game creator. In addition, this handout lists all of the Macros for GMs who aren’t the game creator. Each Rollable Table has an associated macro. For faster access to macros, check “Show macro quick bar” in the options tab, and check “In Bar” next to each macro to display them in a box at the bottom of your screen. Learn more about macros on the&nbsp;<a href=\"https://roll20.zendesk.com/hc/en-us/articles/360037256794-Macros\">Roll20 Help Center page</a>.</p><h3>How To Use</h3><p>There are two ways that Rollable Tables and Macros can be used.</p><ul><li>Rolling from the Rollable Tables in “Collections” will always display this roll to players.</li><li>Rolling from a Macro will display their rolls only to a GM.</li></ul><hr><h2>Chapter #: (Chapter Title)</h2><h3>Name of Adventure Handout Where Macro is Located (Linked)</h3><h4 style=\"margin-left: 25px\">Name of Macro</h4><pre style=\"line-height: 1.42857\">/w GM macro code here</pre><h4 style=\"margin-left: 25px\">Name of Macro</h4><pre style=\"line-height: 1.42857\">/w GM macro code here</pre><hr><h2>Chapter #: (Chapter Title)</h2><h3>Name of Adventure Handout Where Macro is Located (Linked)</h3><h4 style=\"margin-left: 25px\">Name of Macro</h4><pre style=\"line-height: 1.42857\">/w GM macro code here</pre><h4 style=\"margin-left: 25px\">Name of Macro</h4><pre style=\"line-height: 1.42857\">/w GM macro code here</pre>`,
    artHandout: () => ``,
    blankHandout: () => ``,
    gameSettings: () => `Game Settings: <p>${state.Roll20Pro.productName} has been set up with the following Game Settings. For more information on how to change these settings, please check out the&nbsp;<a href=\"https://roll20.zendesk.com/hc/en-us/articles/360039715753-Game-Management\">Game Management page on the Help Center</a>.</p><h3>Map Settings</h3><p><i>For pages which benefit from Dynamic Lighting</i></p><p><b>Dynamic Lighting:&nbsp;</b>On<br><b>Explorer Mode:</b>&nbsp;Off, for performance<br><b>Restrict Movement:&nbsp;</b>Off</p><h3>Token Settings</h3><p><b>Bar 1:</b> hp (link set to None to aid placement of multiple monsters using the same stat block) (5e, Starfinder, PF1, BurnBryte, Fallout RPG - NPC), pc_hp (Fallout RPG - PC), hit_points (PF2) Vitality (Haunted West), damage_threshold (Zweihänder), health (Marvel), Hit points (vida) (Tormenta), might (cypher systems - PC), health (link set to None) (cypher systems - NPC, Cosmere), hitpoints (Cyberpunk Red, CoC)<br><span style=\"background-color: rgba( 0 , 0 , 0 , 0 )\"><b>Bar 2:</b> npc_ac (5e), armor_class (pf2), eac (starfinder), ac (PF1 or starfinder ships), movement (BurnBryte), Lucidity (Haunted West), movement (Zweihänder), agility_defense (Marvel), Defense (defesatotal) (Tormenta), speed (cypher systems - PC), armor (cypher systems - NPC), luck-points (Fallout RPG), focus (link set to None) (Cosmere), Intentionally left blank for GM use (Cyberpunk RED, CoC)<br></span><b style=\"background-color: rgba( 0 , 0 , 0 , 0 )\">Bar 3:</b><span style=\"background-color: rgba( 0 , 0 , 0 , 0 )\"> Intentionally left blank for GM use (5e, pf2, Zweihänder, cypher systems - NPC, Cyberpunk Red, CoC, Fallout RPG), kac (starfinder), tl (starfinder ships), shield (BurnBryte- set to none. if no shields, delete 0/0 to remove bar), Stamina (Haunted West), might_defense (Marvel), Mana (mana) (Tormenta), intellect (cypher systems - PC), investiture (link set to None) (Cosmere)<br></span><b style=\"background-color: rgba( 0 , 0 , 0 , 0 )\">Show Nameplate Toggle:</b><span style=\"background-color: rgba( 0 , 0 , 0 , 0 )\">&nbsp;</span><span style=\"background-color: rgba( 0 , 0 , 0 , 0 )\">On, not visible to players</span></p><p><b>Bright/Low Light Distance:&nbsp;</b>Used if an NPC exudes light.<br><b>Vision Toggle:</b>&nbsp;Off, for performance<br><b>Night Vision Toggle:</b> Off. Night vision distance is set if NPC can see in dark or has special senses, such that they are already built into the module if a GM toggles Night Vision back on.</p><p style=\"margin-left: 25px\"><b>Roll20 Note:&nbsp;</b>&nbsp;This module uses Updated Dynamic Lighting.&nbsp; For your convenience, we have entered the night vision radius in the token settings for all tokens that can see in the dark, but we have toggled off Vision and Night Vision for ease of user experience.&nbsp; To display the limits of a token’s night vision, simply turn on Vision and Night Vision in the token’s Updated Dynamic Lighting settings tab. For more information on Updated Dynamic Lighting, see the&nbsp;<a href=\"https://help.roll20.net/hc/en-us/articles/360053106074-Default-Settings-for-Lighting-and-Vision\">Help Center</a>.</p><h3>Sheet Settings</h3><p><b>Roll Queries:&nbsp;</b>Always Roll Advantage<br><b>Whisper Rolls to GM:</b>&nbsp;Always Whisper Rolls<br><b>Auto Roll Damage:</b>&nbsp;Auto Roll Damage and Crit</p>`,
    thankyouRoll20Handout: () => `Thank You For Purchasing ${state.Roll20Pro.productName}!: <p>Thank you for your purchase! To see more of our ***Publisher*** modules and content, please visit our ***Text: Marketplace; Link Url: Link to Publisher's Page on our Marketplace***.</p><p>For any issues with <i>${state.Roll20Pro.productName}</i>, please visit our <a href=\"https://roll20.zendesk.com/hc/en-us\">Help Center</a>.</p><p>Happy Gaming!</p><p>-Roll20 Production Team</p>`,
    thankyouDMsGuildHandout: () => `<p>Thank you for your purchase! Find other great DMs Guild products converted digitally for Roll20 <a href=\"https://www.dmsguild.com/browse.php?filters=0_0_0_0_0_0_1000063_0\">on the DMs Guild Marketplace</a>!</p><p>For any issues with <i>${state.Roll20Pro.productName}</i>, please visit our <a href=\"https://roll20.zendesk.com/hc/en-us\">Help Center</a>.</p><p>Happy Gaming!</p><p>-Roll20 Production Team</p>`,
    thankyouPFIHandout: () => `<p>Thank you for your purchase! Find other great Pathfinder Infinite products converted digitally for Roll20 on <a href=\"https://www.pathfinderinfinite.com/browse.php?filters=0_0_0_0_0_1000073_0&amp;src=fid1000073\">the Pathfinder Infinite Marketplace</a>!</p><p>For any issues with <i>${state.Roll20Pro.productName}</i>, please visit our <a href=\"https://roll20.zendesk.com/hc/en-us\">Help Center</a>.</p><p>Happy Gaming!</p><p>-Roll20 Production Team</p>`,
    thankyouMiskatonicHandout: () => `<p>Thank you for your purchase! Find other great Miskatonic Repository products converted digitally for Roll20 on the <a href=\"https://www.drivethrurpg.com/cc/16/Miskatonic\">Drive Thru RPG Marketplace</a>!</p><p>For any issues with <i>${state.Roll20Pro.productName}</i>, please visit our <a href=\"https://roll20.zendesk.com/hc/en-us\">Help Center</a>.</p><p>Happy Gaming!</p><p>-Roll20 Production Team</p>`,
    patchNotesHandout: () => `<p>This space is reserved for future patch notes.<br></p>`,
    gameSetttingsHandout: () => `<p>This module has been set up with the following Game Settings. For more information on how to change these settings, please check out the&nbsp;<a href=\"https://roll20.zendesk.com/hc/en-us/articles/360039715753-Game-Management\">Game Management page on the Help Center</a>.</p><h3>Map Settings</h3><p><i>For pages which benefit from Dynamic Lighting</i></p><p><b>Dynamic Lighting:&nbsp;</b>On<br><b>Explorer Mode:</b>&nbsp;Off, for performance<br><b>Restrict Movement:&nbsp;</b>Off</p><h3>Token Settings</h3><p><b>Bar 1:</b>&nbsp;hp (link set to None to aid placement of multiple monsters using the same stat block) (5e, Starfinder, PF1, BurnBryte, Fallout RPG - NPC), pc_hp (Fallout RPG - PC), hit_points (PF2) Vitality (Haunted West), damage_threshold (Zweihänder), health (Marvel), Hit points (vida) (Tormenta), might (cypher systems - PC), health (link set to None) (cypher systems - NPC), hitpoints (Cyberpunk Red, CoC)<br><b style=\"background-color: \">Bar 2:</b><span style=\"background-color: \">&nbsp;</span><span style=\"background-color: \">npc_ac (5e), armor_class (pf2), eac (starfinder), ac (PF1 or starfinder ships), movement (BurnBryte), Lucidity (Haunted West), movement (Zweihänder), agility_defense (Marvel), Defense (defesatotal) (Tormenta), speed (cypher systems - PC), armor (cypher systems - NPC), luck-points (Fallout RPG), Intentionally left blank for GM use (Cyberpunk RED, CoC)<br></span><b style=\"background-color: \">Bar 3:</b><span style=\"background-color: \">&nbsp;</span><span style=\"background-color: \">Intentionally left blank for GM use (5e, pf2, Zweihänder, cypher systems - NPC, Cyberpunk Red, CoC, Fallout RPG), kac (starfinder), tl (starfinder ships), shield (BurnBryte- set to none. if no shields, delete 0/0 to remove bar), Stamina (Haunted West), might_defense (Marvel), Mana (mana) (Tormenta), intellect (cypher systems - PC)<br></span><b style=\"background-color: \">Show Nameplate Toggle:</b><span style=\"background-color: \">&nbsp;</span><span style=\"background-color: \">On, not visible to players</span></p><p><b>Bright/Low Light Distance:&nbsp;</b>Used if an NPC exudes light.<br><b>Vision Toggle:</b>&nbsp;Off, for performance<br><b>Night Vision Toggle:</b>&nbsp;Off. Night vision distance is set if NPC can see in dark or has special senses, such that they are already built into the module if a GM toggles Night Vision back on.</p><p style=\"margin-left: 25px\"><b>Roll20 Note:&nbsp;</b>&nbsp;This module uses Updated Dynamic Lighting.&nbsp; For your convenience, we have entered the night vision radius in the token settings for all tokens that can see in the dark, but we have toggled off Vision and Night Vision for ease of user experience.&nbsp; To display the limits of a token’s night vision, simply turn on Vision and Night Vision in the token’s Updated Dynamic Lighting settings tab. For more information on Updated Dynamic Lighting, see the&nbsp;<a href=\"https://help.roll20.net/hc/en-us/articles/360053106074-Default-Settings-for-Lighting-and-Vision\">Help Center</a>.</p><h3>Sheet Settings</h3><p><b>Roll Queries:&nbsp;</b>Always Roll Advantage<br><b>Whisper Rolls to GM:</b>&nbsp;Always Whisper Rolls<br><b>Auto Roll Damage:</b>&nbsp;Auto Roll Damage and Crit</p>`,
    moduleShortcutHandout: () => `<p>The Roll20 Tabletop is equipped with keyboard shortcuts. Some of the most popular are listed below. <a href=\"https://roll20.zendesk.com/hc/en-us/articles/360039675393-Default-Shortcuts\">A full list of shortcuts can be found on the Help Center</a>.</p><p><b>Double click:</b> Opens Token options, including light radius and \"Has Sight\" options.<br><b>Shift+ Double click:</b><span> Opens up token's character sheet</span></p><p><b>Ctrl/Cmd+Shift+O:</b> Move selected object to the Objects &amp; Tokens Layer<br><b>Ctrl/Cmd+Shift+K: </b><span>Move selected object to GM Info Overlay Layer</span></p><p><b>Pressing \"Z\" with an object selected</b> shows a larger version of that object in a modal popup<br><b>Pressing Shift+Z as the GM</b><span> shows all players the larger version of that object</span></p><p><b>Press Ctrl/Cmd+L with a token selected as the GM</b> to view the the basic Dynamic Lighting as experienced by that token. Tokens and areas that are invisible to the token will not display.<br><i>Additional Note: </i><span>The token retains GM powers: The GM will be able to move it across Dynamic Lighting barriers, see objects on the GM Info Overlay Layer, and continue to see all areas of Explored Darkness exposed by all tokens on the page.</span></p>`,
    accessingCompendiumContentHandout: () => `<p>This module comes with content that has been stored in the Compendium so you can use it in any of your games that use this system. To access your Compendium content, simply click on the Compendium button in the top right corner above the chat sidebar. It looks like three books next to each other.</p><p>You can search for a term or scroll through the categories of content available, then drag anything out to the VTT to create a handout.</p><p>Dragging out particular content like monsters, NPCs, and ships may create a character sheet instead of a handout.</p><p>For systems with drag and drop functionality, you can drag content like items or even classes and races to your character sheet to see them automatically update. (This functionality is on a system-by-system basis.)</p><p>To find all the content for any particular book, search the title of the book to find the Compendium's table of contents.</p>`,
    accessingDemiplaneContentHandout: () => ` <h3>A <i><i>${state.Roll20Pro.productName}</i> Companion</h3><p>This Roll20 Playset is a companion to the complete ***adventure/sourcebook*** on Demiplane. It includes ready-to-play maps and tokens to enhance your digital and in-person gaming experience.</p><p><b>Note: <i>This playset does not include ***Name of System*** rules or adventure text, which are available on the </i><i>${state.Roll20Pro.productName}<i> Demiplane Nexus. For the full experience, you’ll require the following products:</i></b></p><ul><li><i>${state.Roll20Pro.productName}</i> adventure on Demiplane</li><li>***Name of System***  Rules and Character Sheet on Demiplane</li></ul>`,
    npcInitiativeHandout: () => `<p>Like PCs, the ***Game System*** by Roll20 character sheet allows you to roll NPC Initiative directly from it. For NPCs, just press \"Initiative\" near the top of the NPC's stat block on the sheet and it will roll for initiative.</p><p>If you have the <a href=\"https://roll20.zendesk.com/hc/en-us/articles/360039178634-Turn-Tracker\">Turn Tracker</a> tool open, having the NPC token selected while rolling Initiative will automatically add the NPC and its initiative roll to the tracker. Creatures on the GM layer that are added to the tracker in this fashion will have their entries hidden from the players.</p><p>You can also create a global <a href=\"https://roll20.zendesk.com/hc/en-us/articles/360037256794-Macros\">Macro</a> that will pop up as a Token Action button in the upper left-hand corner of the tabletop every time a token is selected. This will allow you to roll without looking at the NPC sheet at all. The macro formula should look just like this:</p><pre>%{selected|INITIATIVE}</pre>`,
    rollableTokensHandout: () => `<p>The tokens for the following creatures are multi-sided Rollable Table Tokens. Each side of one of these tokens is a different form for the creature. To swap between the different sides, right click on one of these tokens and choose <b>Multi-Sided</b> -&gt; <b>Choose Side</b>.</p><ul><li>***Insert link to statblock***</li><li>***Insert link to statblock***</li><li>***Insert link to statblock***</li></ul>"`,
    creditsPublisherHandout: () => `<p>Check out the <i>${state.Roll20Pro.productName}</i> Compendium for the full ***Text: ***Publisher*** Credits; Link Url: Link to the Credits page for this product***!</p><hr><p><span style=\"background-color: \">***Copy and Paste <a href=\"https://roll20.atlassian.net/wiki/spaces/CP/pages/804159653/Roll20+Credits+List\">Roll20 Credits List</a>***</span><br></p>`,
    creditsRoll20Handout: () => `<p>***Full Product Credits formatted in handout***</p><hr><p><span style=\"background-color: \">***Copy and Paste <a href=\"https://roll20.atlassian.net/wiki/spaces/CP/pages/804159653/Roll20+Credits+List\">Roll20 Credits List</a>***</span><br></p>`,
    drowMageBaseSpellHandout: () => `<p>&lt;Spellbook Name&gt; contains the following spells:</p><h4>Cantrips</h4><ul><li><i>mage hand</i></li><li><i>minor illusion</i></li><li><i>poison spray</i></li><li><i>ray of frost</i><br></li></ul><h4>1st</h4><ul><li><i>mage armor</i></li><li><i>magic missile</i></li><li><i>shield</i></li><li><i>witch bolt</i><br></li></ul><h4>2nd</h4><ul><li><i>alter self</i></li><li><i>misty step</i></li><li><i>web</i><br></li></ul><h4>3rd</h4><ul><li><i>fly</i></li><li><i>lightning bolt</i><br></li></ul><h4>4th</h4><ul><li><i>Evard's black tentacles</i></li><li><i>greater invisibility</i><br></li></ul><h4>5th</h4><ul><li>cloudkill</li><li><br></li></ul>`,
    cardDecksHandout: () => `<p>With&nbsp;<span style=\"font-size: 13px\"><i>**PRODUCT**</i></span>, Roll20 has provided digital card decks for GM and Player use. These appear in the Collection tab for the game creator and users with game master privileges. Below are instructions for using card decks on the Roll20 virtual tabletop. For more information on using card decks and the Safety Deck, visit the<span style=\"font-family: &#34;helvetica neue&#34; , &#34;helvetica&#34; , &#34;arial&#34; , sans-serif ; font-size: 13px ; color: rgb( 64 , 64 , 64 )\">&nbsp;</span><a href=\"https://help.roll20.net/hc/en-us/articles/360039178754-Collections#Collections-CardDecks\" style=\"font-family: &#34;helvetica neue&#34; , &#34;helvetica&#34; , &#34;arial&#34; , sans-serif ; font-size: 13px\">Roll20 Help Center</a><span style=\"font-family: &#34;helvetica neue&#34; , &#34;helvetica&#34; , &#34;arial&#34; , sans-serif ; font-size: 13px ; color: rgb( 64 , 64 , 64 )\">.</span></p><p><b>To show or hide a deck:</b></p><ul><li>With Game Master privileges: Click on the Collection tab in the top-right of the screen.</li><li>Next to the deck name, click the button that says \"Show\" or \"Hide\" to toggle the deck.</li></ul><p><b>To look through the cards in a deck:</b><br></p><ul><li>With the deck visible, hover over it and select \"Choose.\"</li></ul><p><b>To remove a card from the game:</b><br></p><ul><li>With the deck visible, hover over it and select \"Choose.\"</li><li>Drag the card out of the deck and onto the virtual tabletop.</li><li>Right-click the card and choose \"Remove Card.\" This will prevent the card from being shuffled with the deck during play.</li></ul><p><b>To return a removed card back into play:</b><br></p><ul><li>With the deck visible, hover over it and select \"Removed.\"</li><li>Drag the card onto the virtual tabletop.</li><li>Deleting the card on the tabletop will return it to the deck.</li></ul><p><b>To draw the top card and place it on the virtual tabletop:</b><br></p><ul><li>The deck must be shuffled first.</li><li>With the deck visible, hover over it, and click &amp; drag a card from the top onto the tabletop.</li></ul><p><b>To flip a card over:</b><br></p><ul><li>Right-click a card on the virtual tabletop and select “Flip Card.”</li></ul>`,
    navigationLinksExampleHandout: () => `<p>Example Text</p><hr><p style=\"text-align: center\"><span style=\"font-family: &#34;pictos&#34;\">8&nbsp;</span><span><a href=\"http://journal.roll20.net/handout/-NpRDbk1OpPZJ7v3hRRR\">Placeholder 1</a> | <a href=\"http://journal.roll20.net/handout/-NpRDf73LBgd3wtOPTEQ\">Placeholder 2</a>&nbsp;</span><span style=\"font-family: &#34;pictos&#34;\">7</span></p>`,
    patchNotesExampleHandout: () => `<p>This space is reserved for future patch notes.<br></p>`,
    wandHandout: () => `<p><b>Wands</b></p><p>A wand is a thin baton that contains a single spell of 4th level or lower. A wand has 50 charges when created—each charge allows the use of the wand’s spell one time. A wand that runs out of charges is just a stick. The price of a wand is equal to the level of the spell × the creator’s caster level × 750 gp. If the wand has a material component cost, it is added to the base price and cost to create once for each charge (50 × material component cost).&nbsp;<b>Table: Wands</b>&nbsp;gives sample prices for wands created at the lowest possible caster level for each spellcasting class. Note that some spells appear at different levels for different casters. The level of such spells depends on the caster crafting the wand.</p><p><b>Physical Description:&nbsp;</b>A wand is 6 to 12 inches long, 1/4 inch thick, and weighs no more than 1 ounce. Most wands are wood, but some are bone, metal, or even crystal. A typical wand has Armor Class 7, 5 hit points, hardness 5, and a break DC of 16.</p><p><b>Activation:&nbsp;</b>Wands use the spell trigger activation method, so casting a spell from a wand is usually a standard action that doesn’t provoke attacks of opportunity. (If the spell being cast has a longer casting time than 1 action, however, it takes that long to cast the spell from a wand.) To activate a wand, a character must hold it in hand (or whatever passes for a hand, for non-humanoid creatures) and point it in the general direction of the target or area. A wand may be used while grappling or while swallowed whole.</p><p>Special Qualities: Roll&nbsp;d%. A 01–30 result indicates that something (a design, inscription, or the like) provides some clue to the wand’s function, and 31–100 indicates no special qualities.</p><h5>Table: Wands</h5><table class=\"userscript-table userscript-table-bordered\"><thead><tr><th>Minor<br></th><th>Medium<br></th><th>Major<br></th><th>Spell Level<br></th><th>Caster Level<br></th></tr></thead><tbody><tr><td>01-05<br></td><td>-<br></td><td>-<br></td><td>0<br></td><td>1st<br></td></tr><tr><td>06-60<br></td><td>-<br></td><td>-<br></td><td>1st<br></td><td>1st<br></td></tr><tr><td>61-100<br></td><td>01-60<br></td><td>-<br></td><td>2nd<br></td><td>3rd<br></td></tr><tr><td>-<br></td><td>61-100<br></td><td>01-60<br></td><td>3rd<br></td><td>5th<br></td></tr><tr><td>-<br></td><td>-<br></td><td>61-100<br></td><td>4th<br></td><td>7th<br></td></tr></tbody></table><h5><b>Table: Wand Costs</b></h5><table class=\"userscript-table userscript-table-bordered\"><thead><tr><th>Spell Level<br></th><th>Cleric, Druid, Wizard<br></th><th>Sorcerer<br></th><th>Bard<br></th><th>Paladin, Ranger<br></th></tr></thead><tbody><tr><td>0<br></td><td>375 gp<br></td><td>375 gp<br></td><td>375 gp<br></td><td>-<br></td></tr><tr><td>1st<br></td><td>750 gp<br></td><td>750 gp<br></td><td>750 gp<br></td><td>750 gp<br></td></tr><tr><td>2nd<br></td><td>4,500 gp<br></td><td>6,000 gp<br></td><td>6,000 gp<br></td><td>6,000 gp<br></td></tr><tr><td>3rd<br></td><td>11,250 gp<br></td><td>13,500 gp<br></td><td>15,750 gp<br></td><td>15,750 gp<br></td></tr><tr><td>4th<br></td><td>21,000 gp<br></td><td>24,000 gp<br></td><td>30,000 gp<br></td><td>30,000gp<br></td></tr></tbody></table><p></p>`,
    potionHandout: () => `<div class=\"userscript-row-fluid\"><div class=\"userscript-span12\" style=\"width: 479px\"><div class=\"userscript-content userscript-note-editor userscript-notes\" style=\"margin-bottom: 20px\"><p><b>Potions</b></p><p>A potion is a magic liquid that produces its effect when imbibed. Potions vary incredibly in appearance. Magic oils are similar to potions, except that oils are applied externally rather than imbibed. A potion or oil can be used only once. It can duplicate the effect of a spell of up to 3rd level that has a casting time of less than 1 minute and targets one or more creatures or objects.</p><p>The price of a potion is equal to the level of the spell × the creator’s caster level × 50 gp. If the potion has a material component cost, it is added to the base price and cost to create. Table: Potions gives sample prices for potions created at the lowest possible caster level for each spellcasting class. Note that some spells appear at different levels for different casters. The level of such spells depends on the caster brewing the potion.</p><p>Potions are like spells cast upon the imbiber. The character taking the potion doesn’t get to make any decisions about the effect—the caster who brewed the potion has already done so. The drinker of a potion is both the effective target and the caster of the effect (though the potion indicates the caster level, the drinker still controls the effect).</p><p>The person applying an oil is the effective caster, but the object is the target.</p><p><b>Physical Description</b>: A typical potion or oil consists of 1 ounce of liquid held in a ceramic or glass vial fitted with a tight stopper. The stoppered container is usually no more than 1 inch wide and 2 inches high. The vial has Armor Class 13, 1 hit point, hardness 1, and a break DC of 12.</p><p><b>Identifying Potions</b>: In addition to the standard methods of identification, PCs can sample from each container they find to attempt to determine the nature of the liquid inside with a Perception check. The DC of this check is equal to 15 + the spell level of the potion (although this DC might be higher for rare or unusual potions).</p><p><b>Activation</b>: Drinking a potion or applying an oil requires no special skill. The user merely removes the stopper and swallows the potion or smears on the oil. The following rules govern potion and oil use.</p><p>Drinking a potion or using an oil is a standard action. The potion or oil takes effect immediately. Using a potion or oil provokes attacks of opportunity. An enemy may direct an attack of opportunity against the potion or oil container rather than against the character. A successful attack of this sort can destroy the container, preventing the character from drinking the potion or applying the oil.</p><p>A creature must be able to swallow a potion or smear on an oil. Because of this, incorporeal creatures cannot use potions or oils. Any corporeal creature can imbibe a potion or use an oil.</p><p>A character can carefully administer a potion to an unconscious creature as a full-round action, trickling the liquid down the creature’s throat. Likewise, it takes a full-round action to apply an oil to an unconscious creature.</p><h5>Table: Potions</h5><table class=\"userscript-table userscript-table-bordered\" style=\"width: 479px\"><thead><tr><th style=\"line-height: 1.42857\">Minor&nbsp;&nbsp;</th><th style=\"line-height: 1.42857\">Medium&nbsp;&nbsp;</th><th style=\"line-height: 1.42857\">Major&nbsp;&nbsp;</th><th style=\"line-height: 1.42857\">Spell level&nbsp;&nbsp;</th><th style=\"line-height: 1.42857\">Caster Level</th></tr></thead><tbody><tr><td style=\"line-height: 1.42857\">01-20</td><td style=\"line-height: 1.42857\">-</td><td style=\"line-height: 1.42857\">-</td><td style=\"line-height: 1.42857\">0</td><td style=\"line-height: 1.42857\">1st</td></tr><tr><td style=\"line-height: 1.42857\">21-60<br></td><td style=\"line-height: 1.42857\">01-20<br></td><td style=\"line-height: 1.42857\">-</td><td style=\"line-height: 1.42857\">1st</td><td style=\"line-height: 1.42857\">1st</td></tr><tr><td style=\"line-height: 1.42857\">61-100</td><td style=\"line-height: 1.42857\">21-60<br></td><td style=\"line-height: 1.42857\">01-20<br></td><td style=\"line-height: 1.42857\">2nd</td><td style=\"line-height: 1.42857\">3rd</td></tr><tr><td style=\"line-height: 1.42857\">-</td><td style=\"line-height: 1.42857\">61-100</td><td style=\"line-height: 1.42857\">21-100<br></td><td style=\"line-height: 1.42857\">3rd</td><td style=\"line-height: 1.42857\">5th</td></tr></tbody></table><h5><b>Table: Potion Costs</b></h5><table class=\"userscript-table userscript-table-bordered\" style=\"width: 479px\"><thead><tr><th style=\"line-height: 1.42857\">Spell Level&nbsp;&nbsp;</th><th style=\"line-height: 1.42857\">Cleric, Druid, Wizard&nbsp;&nbsp;</th><th style=\"line-height: 1.42857\">Sorcerer&nbsp;&nbsp;</th><th style=\"line-height: 1.42857\">Bard&nbsp;&nbsp;</th><th style=\"line-height: 1.42857\">Paladin, Ranger</th></tr></thead><tbody><tr><td style=\"line-height: 1.42857\">0</td><td style=\"line-height: 1.42857\">25 gp</td><td style=\"line-height: 1.42857\"><p>25 gp<br></p></td><td style=\"line-height: 1.42857\">25 gp<br></td><td style=\"line-height: 1.42857\">-</td></tr><tr><td style=\"line-height: 1.42857\">1st</td><td style=\"line-height: 1.42857\">50 gp</td><td style=\"line-height: 1.42857\">50 gp</td><td style=\"line-height: 1.42857\">50 gp</td><td style=\"line-height: 1.42857\">50 gp</td></tr><tr><td style=\"line-height: 1.42857\">2nd</td><td style=\"line-height: 1.42857\">300 gp</td><td style=\"line-height: 1.42857\">400 gp</td><td style=\"line-height: 1.42857\">400 gp</td><td style=\"line-height: 1.42857\">400 gp</td></tr><tr><td style=\"line-height: 1.42857\">3rd</td><td style=\"line-height: 1.42857\">750 gp</td><td style=\"line-height: 1.42857\">900 gp</td><td style=\"line-height: 1.42857\">1,050 gp</td><td style=\"line-height: 1.42857\">1,050 gp</td></tr></tbody></table></div></div></div><div class=\"userscript-row-fluid\"><br></div><p></p>"`,
    spellScrollHandout: () => `<h4>Spell Scroll</h4><p><span style=\"font-family: &#34;proxima nova&#34; , , , &#34;system-ui&#34; , &#34;segoe ui&#34; , &#34;roboto&#34; , , &#34;ubuntu&#34; , &#34;cantarell&#34; , &#34;helvetica neue&#34; , sans-serif\">A scroll is a spell (or collection of spells) that has been stored in written form. A spell on a scroll can be used only once. The writing vanishes from the scroll when the spell is activated. Using a scroll is basically like casting a spell. The price of a scroll is equal to the level of the spell × the creator's caster level × 25 gp. If the scroll has a material component cost, it is added to the base price and cost to create.</span></p><p></p><p><strong>Physical Description</strong>: A scroll is a heavy sheet of fine vellum or high-quality paper. An area about 8-1/2 inches wide and 11 inches long is sufficient to hold one spell. The sheet is reinforced at the top and bottom with strips of leather slightly longer than the sheet is wide. A scroll holding more than one spell has the same width (about 8-1/2 inches) but is an extra foot or so long for each additional spell. Scrolls that hold three or more spells are usually fitted with reinforcing rods at each end rather than simple strips of leather. A scroll has AC 9, 1 hit point, hardness 0, and a break DC of 8.</p><p>To protect it from wrinkling or tearing, a scroll is rolled up from both ends to form a double cylinder. (This also helps the user unroll the scroll quickly.) The scroll is placed in a tube of ivory, jade, leather, metal, or wood. Most scroll cases are inscribed with magic symbols which often identify the owner or the spells stored on the scrolls inside. The symbols sometimes hide magic traps.</p><p><strong>Activation</strong>: To activate a scroll, a spellcaster must read the spell written on it. This involves several steps and conditions.</p><p><em>Decipher the Writing</em>: The writing on a scroll must be deciphered before a character can use it or know exactly what spell it contains. This requires a&nbsp;<i>read magic</i><em>&nbsp;</em>spell or a successful Spellcraft check (DC 20 + spell level). Deciphering a scroll is a full-round action.</p><p>Deciphering a scroll to determine its contents does not activate its magic unless it is a specially prepared cursed scroll. A character can decipher the writing on a scroll in advance so that she can proceed directly to the next step when the time comes to use the scroll.</p><p><em>Activate the Spell</em>: Activating a scroll requires reading the spell from the scroll. The character must be able to see and read the writing on the scroll. Activating a scroll spell requires no material components or focus. (The creator of the scroll provided these when scribing the scroll.) Note that some spells are effective only when cast on an item or items. In such a case, the scroll user must provide the item when activating the spell. Activating a scroll spell is subject to disruption just as casting a normally prepared spell would be. Using a scroll is like casting a spell for purposes of arcane spell failure chance.</p><p>To have any chance of activating a scroll spell, the scroll user must meet the following requirements.</p><ul><li>The spell must be of the correct type (arcane or divine). Arcane spellcasters (wizards, sorcerers, and bards) can only use scrolls containing arcane spells, and divine spellcasters (clerics, druids, paladins, and rangers) can only use scrolls containing divine spells. (The type of scroll a character creates is also determined by his class.)</li><li>The user must have the spell on her class list.</li><li>The user must have the requisite ability score.</li></ul><p>If the user meets all the requirements noted above, and her caster level is at least equal to the spell's caster level, she can automatically activate the spell without a check. If she meets all three requirements but her own caster level is lower than the scroll spell's caster level, then she has to make a caster level check (DC = scroll's caster level + 1) to cast the spell successfully. If she fails, she must make a DC 5 Wisdom check to avoid a mishap (see Scroll Mishaps). A natural roll of 1 always fails, whatever the modifiers. Activating a scroll is a standard action (or the spell's casting time, whichever is longer) and it provokes attacks of opportunity exactly as casting a spell does.</p><p><em>Determine Effect</em>: A spell successfully activated from a scroll works exactly like a spell prepared and cast the normal way. Assume the scroll spell's caster level is always the minimum level required to cast the spell for the character who scribed the scroll, unless the scriber specifically desired otherwise.</p><p>The writing for an activated spell disappears from the scroll as the spell is cast.</p><p><em>Scroll Mishaps</em>: When a mishap occurs, the spell on the scroll has a reversed or harmful effect. Possible mishaps are given below.<br></p><ul><li>A surge of uncontrolled magical energy deals&nbsp;1d6 points&nbsp;of damage per spell level to the scroll user.</li><li>Spell strikes the scroll user or an ally instead of the intended target, or a random target nearby if the scroll user was the intended recipient.</li><li>Spell takes effect at some random location within spell range.</li><li>Spell's effect on the target is contrary to the spell's normal effect.</li><li>The scroll user suffers some minor but bizarre effect related to the spell in some way. Most such effects should last only as long as the original spell's duration, or&nbsp;2d10 minutes&nbsp;for instantaneous spells.</li><li>Some innocuous item or items appear in the spell's area.</li><li>Spell has delayed effect. Sometime within the next&nbsp;1d12 hours, the spell activates. If the scroll user was the intended recipient, the spell takes effect normally. If the user was not the intended recipient, the spell goes off in the general direction of the original recipient or target, up to the spell's maximum range, if the target has moved away.</li></ul><h5><span style=\"background-color: inherit\">Table: Scrolls</span></h5><table class=\"userscript-table userscript-table-bordered\"><thead><tr><th>Minor<br></th><th>Medium<br></th><th>Major<br></th><th>Spell Level<br></th><th>Caster Level<br></th></tr></thead><tbody><tr><td>01-05<br></td><td>-<br></td><td>-<br></td><td>0<br></td><td>1st<br></td></tr><tr><td>06-50<br></td><td>-<br></td><td>-<br></td><td>1st<br></td><td>1st<br></td></tr><tr><td>51-95<br></td><td>01-05<br></td><td>-<br></td><td>2nd<br></td><td>3rd<br></td></tr><tr><td>96-100<br></td><td>06-65<br></td><td>-<br></td><td>3rd<br></td><td>5th<br></td></tr><tr><td>-<br></td><td>66-95<br></td><td>01-05<br></td><td>4th<br></td><td>7th<br></td></tr><tr><td>-<br></td><td>96-100<br></td><td>06-50<br></td><td>5th<br></td><td>9th<br></td></tr><tr><td>-<br></td><td>-<br></td><td>51-70<br></td><td>6th<br></td><td>11th<br></td></tr><tr><td>-<br></td><td>-<br></td><td>71-85<br></td><td>7th<br></td><td>13th<br></td></tr><tr><td>-<br></td><td>-<br></td><td>86-95<br></td><td>8th<br></td><td>15th<br></td></tr><tr><td>-<br></td><td>-<br></td><td>96-100<br></td><td>9th<br></td><td><p>17th</p></td></tr></tbody></table><p></p><h5><span style=\"background-color: inherit\">Table: Scroll Costs</span></h5><table class=\"userscript-table userscript-table-bordered\"><thead><tr><th>Spell Level<br></th><th>Cleric, Druid, Wizard<br></th><th>Sorcerer<br></th><th>Bard<br></th><th>Paladin, Ranger<br></th></tr></thead><tbody><tr><td>0<br></td><td>12.5 gp<br></td><td>12.5 gp<br></td><td>12.5 gp<br></td><td>-<br></td></tr><tr><td>1st<br></td><td>25 gp<br></td><td>25 gp<br></td><td>25 gp<br></td><td>25 gp<br></td></tr><tr><td>2nd<br></td><td>150 gp<br></td><td>200 gp<br></td><td>200 gp<br></td><td>200 gp<br></td></tr><tr><td>3rd<br></td><td>375 gp<br></td><td>450 gp<br></td><td>525 gp<br></td><td>525 gp<br></td></tr><tr><td>4th<br></td><td>700 gp<br></td><td>800 gp<br></td><td>1,000 gp<br></td><td>1,000 gp<br></td></tr><tr><td>5th<br></td><td>1,125 gp<br></td><td>1,250 gp<br></td><td>1,625 gp<br></td><td>-<br></td></tr><tr><td>6th<br></td><td>1,650 gp<br></td><td>1,800 gp<br></td><td>2,400 gp<br></td><td>-<br></td></tr><tr><td>7th<br></td><td>2,275<br></td><td>2,450 gp<br></td><td>-<br></td><td>-<br></td></tr><tr><td>8th<br></td><td>3,000 gp<br></td><td>3,200 gp<br></td><td>-<br></td><td>-<br></td></tr><tr><td>9th<br></td><td>3,825 gp<br></td><td>4,050 gp<br></td><td>-<br></td><td>-<br></td></tr></tbody></table><p></p>`,
},
      
        
        createEmptyHandouts = function(name, caller, copies) {
            title = name
            
            
            for (let i = 0; i < copies; i++) {

            handout = createObj("handout", {
                name: title,
            });
            handout.set({
                notes: ""
            });
            handout.set({
                gmnotes: ""
            });
        };
                makeAndSendMenu(copies + " handout(s) created", "Handout", caller);
                
                makeAndSendMenu(menuText.stockHandouts(), "Stock Handouts", caller)

        };


    createPage = function(name, url) {
        log("IF CREATING A PAGE FAILED TO WORK - PLEASE SWITCH API SANDBOX TO 'EXPERIMENTAL'");
        createObj('page', {
            name: name,
            width: 20,
            height: 20
        });
/*
        createObj('graphic', {
            width: 20*70,
            height: 20*70,
            top: 10*70,
            width: 10*70,
            imgsrc: url,
            layer: "map",
            //pageid: ___________________,
        });
*/
    }


        
        createStockHandout = function(name, caller, copies) {
            title = "";
                                if (undefined === copies){copies = 1}
                                
                                
                                

            switch (name) {
                case "battleMap": title = "Map Handout"; findAndMakeHandout(title, "", handoutHTML.battleMap()); break;
                case "macroHandout": title = "Macros and Tables"; findAndMakeHandout(title,  handoutHTML.macroHandout(),""); break;
                case "artHandout":
                    title = "Player Art Handout: ";
                    if (undefined !== copies){
                        for (let i = 0; i < copies; i++) {
                    findAndMakeHandout(title, "", handoutHTML.artHandout());
                        }
                    }
                    break;
                case "blankHandout":
                    title = "Handout: ";
                    log ("copies = " + copies);
                    //if (undefined !== copies){
                        for (let i = 0; i < copies; i++) {
                    findAndMakeHandout(title, "", handoutHTML.blankHandout());
                        }
                    //}
                    break;
                case "gameSettings": title = "Game Settings"; findAndMakeHandout(title, "", handoutHTML.gameSettings()); break;
                case "thankyouRoll20Handout": title = `Thank You For Purchasing ${state.Roll20Pro.productName}!`; findAndMakeHandout(title,  handoutHTML.thankyouRoll20Handout(),""); break;
                case "thankyouDMsGuildHandout": title = `Thank You For Purchasing ${state.Roll20Pro.productName}!`; findAndMakeHandout(title,  handoutHTML.thankyouDMsGuildHandout(),""); break;
                case "thankyouPFIHandout Product": title = `Thank You For Purchasing ${state.Roll20Pro.productName}!`; findAndMakeHandout(title,  handoutHTML.thankyouPFIHandout(),""); break;
                case "thankyouMiskatonicHandout": title = `Thank You For Purchasing ${state.Roll20Pro.productName}!`; findAndMakeHandout(title,  handoutHTML.thankyouMiskatonicHandout(),""); break;
                case "patchNotesHandout": title = "Patch Notes"; findAndMakeHandout(title,  handoutHTML.PatchNotesHandout(),""); break;
                case "gameSetttingsHandout": title = "Game Settings"; findAndMakeHandout(title,  handoutHTML.gameSetttingsHandout(),""); break;
                case "moduleShortcutHandout": title = "Module Shortcuts"; findAndMakeHandout(title,  handoutHTML.moduleShortcutHandout(),""); break;
                case "accessingCompendiumContentHandout": title = "Accessing Compendium Content"; findAndMakeHandout(title,  handoutHTML.accessingCompendiumContentHandout(),""); break;
                case "accessingDemiplaneContentHandout": title = "Accessing Demiplane Content"; findAndMakeHandout(title,  handoutHTML.accessingDemiplaneContentHandout(),""); break;
                case "npcInitiativeHandout": title = "NPC Initiative"; findAndMakeHandout(title,  handoutHTML.npcInitiativeHandout(),""); break;
                case "rollableTokensHandout": title = "Rollable Tokens"; findAndMakeHandout(title,  handoutHTML.rollableTokensHandout(),""); break;
                case "creditsPublisherHandout": title = "Credits"; findAndMakeHandout(title,  handoutHTML.creditsPublisherHandout(),""); break;
                case "creditsRoll20Handout": title = "Credits"; findAndMakeHandout(title,  handoutHTML.creditsRoll20Handout(),""); break;
                case "cardDecksHandout": title = "Using Roll20 Card Decks"; findAndMakeHandout(title,  handoutHTML.cardDecksHandout(),""); break;
                case "navigationLinksExampleHandout": title = "Navigation Links Example"; findAndMakeHandout(title,  handoutHTML.navigationLinksExampleHandout(),""); break;
                case "patchNotesExampleHandout": title = "Patch Notes"; findAndMakeHandout(title,  handoutHTML.patchNotesExampleHandout(),""); break;
                case "drowMageBaseSpellHandout": title = "Drow Mage Base Spellbook"; findAndMakeHandout(title,  handoutHTML.drowMageBaseSpellHandout(),""); break;
                case "wandHandout": title = "Wand, Level 1"; findAndMakeHandout(title,  handoutHTML.wandHandout(),""); break;
                case "potionHandout": title = "Potion, Level 1"; findAndMakeHandout(title,  handoutHTML.potionHandout(),""); break;
                case "spellScrollHandout": title = "Spell Scroll, Level 1"; findAndMakeHandout(title,  handoutHTML.spellScrollHandout(),""); break;
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
            if (title === "Player Art Handout: " || title === "Handout: "){handout === false};
            
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
        },
        
//========HANDOUT AND NAVIGATION CREATOR==============
        
        autoNav = function (csv) {
            log("CSV IS " + csv);
            ///let handouts = new Array();
            handouts = csv.split(",");
            let contents = ""
            log("Handouts is " + handouts[0])
            for (let i = 0; i < handouts.length; i++){
                //log ("name should be " + handouts[i])
                
                let newHandout = createObj('handout', {
                    name: handouts[i]
                });
                
                let content = ""
                content += addFooter(handouts[i - 1], handouts, handouts[i + 1])
                newHandout.set('gmnotes',content)
                
            }
            
            /*let contentsHandout = createObj('handout', {
                name: "Contents"
            })
            contentsHandout.set('gmnotes',contents);
            */
        },
        
        addFooter = function (prev, curr, next) {
            let footer = `<hr><p style="text-align:center">`;
            if (prev) {
              //let prev_name = prev.match(/<h1.*?>(.*?)<\/h1>/g) || [""];
              //prev_name = prev_name[0].replace(/(<h1.*?>|<\/h1>)/g, "").trim();
              //footer += `<span style="font-family:pictos">[</span> <a href="${prev}">${prev}</a> <b>|</b> `;
              footer += `<span style="font-family:pictos">8</span> [${prev}] <b>|</b> `;
            }
        
            //footer += `<span style="font-family:pictos">l</span> [Contents]`;
        
            if (next) {
              //let next_name = next.match(/<h1.*?>(.*?)<\/h1>/g) || [""];
              //next_name = next_name[0].replace(/(<h1.*?>|<\/h1>)/g, "").trim();
              footer += `[${next}] <span style="font-family:pictos">7</span>`;
            }
        
            footer += `</p>`;
        
            return footer;
        },
        
        insertFulltext = function(msg){
            //log(msg)
            let regex = new RegExp("`.*?`","g");
            let matches = [...msg.matchAll(regex)];
            //log(matches + ", 0= " + matches[0] + ", 1= " + matches[1])
            let name = matches[0][0].replace(/`/g,"");
            let text = matches[1][0].replace(/`/g,"");
            text = text.replace(/~/g,"</p><p>");
            log(name)
            
            
            var handout = findObjs({                              
                _name: name,
                _type: "handout",
            });
            log(handout.length);
            
            if (handout.length != 1) {
                log("No handout with that name, or too many handouts with the same name")
            } else if (handout[0]) {
                thisHandout = getObj("handout", handout[0].id)
                thisHandout.get("gmnotes", function(notes) {
                    if (notes==null){notes = ""}
                    newNotes = "<p>" + text + "</p>" + notes;
                    setTimeout(function(){thisHandout.set("gmnotes", newNotes);}, 0);
                });
                
            } 
           
        }
        
        deleteHandouts = function () {
            let handouts = findObjs({                              
                _type: "handout",
            });
            
            _.each(handouts, function (handout) {
                handout.remove()
                
            })
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
            
            on("change:graphic", updateBuddyLight);

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



//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//       TEMPORARY TOKEN ACTION MAKER FOR 2024
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
on("chat:message", function(msg) {
    if (msg.type !== "api" || msg.content !== "!ta2024") return;

    if (!msg.selected || msg.selected.length === 0) {
        sendChat("TA2024", "/w gm ⚠️ No tokens selected.");
        return;
    }

    const affectedCharacters = [];

    msg.selected.forEach(sel => {
        let token = getObj("graphic", sel._id);
        if (!token) return;

        let charId = token.get("represents");
        if (!charId) return;

        let character = getObj("character", charId);
        if (!character) return;

        const charName = character.get("name");
        affectedCharacters.push(charName);

        const actions = [
            {
                name: "Init",
                action: "%{selected|initiative}"
            },
            {
                name: "Save",
                action: "?{Saving Throw?\n| Strength, %{selected&#124;npc_strength_save&#125;\n| Dexterity, %{selected&#124;npc_dexterity_save&#125;\n| Constitution, %{selected&#124;npc_constitution_save&#125;\n| Intelligence, %{selected&#124;npc_intelligence_save&#125;\n| Wisdom, %{selected&#124;npc_wisdom_save&#125;\n| Charisma, %{selected&#124;npc_charisma_save&#125;\n}"
            },
            {
                name: "Check",
                action: "?{Check?\n| Strength,%{selected&#124;strength&#125;\n| Dexterity,%{selected&#124;dexterity&#125;\n| Constitution,%{selected&#124;constitution&#125;\n| Intelligence,%{selected&#124;intelligence&#125;\n| Wisdom,%{selected&#124;wisdom&#125;\n| Charisma,%{selected&#124;charisma&#125;\n| Acrobatics,%{selected&#124;acrobatics&#125;\n| Animal Handling,%{selected&#124;animal_handling&#125;\n| Arcana,%{selected&#124;arcana&#125;\n| Athletics,%{selected&#124;athletics&#125;\n| Deception,%{selected&#124;deception&#125;\n| History,%{selected&#124;history&#125;\n| Insight,%{selected&#124;insight&#125;\n| Intimidation,%{selected&#124;intimidation&#125;\n| Investigation,%{selected&#124;investigation&#125;\n| Medicine,%{selected&#124;medicine&#125;\n| Nature,%{selected&#124;nature&#125;\n| Perception,%{selected&#124;perception&#125;\n| Performance,%{selected&#124;performance&#125;\n| Persuasion,%{selected&#124;persuasion&#125;\n| Religion,%{selected&#124;religion&#125;\n| Sleight of Hand,%{selected&#124;sleight_of_hand&#125;\n| Stealth,%{selected&#124;stealth&#125;\n| Survival,%{selected&#124;survival&#125;\n}"
            }
        ];

        actions.forEach(({ name, action }) => {
            // Remove existing ability with same name
            const existing = findObjs({
                _type: "ability",
                _characterid: charId,
                name: name
            });
            existing.forEach(a => a.remove());

            // Create new token action
            createObj("ability", {
                name,
                action,
                istokenaction: true,
                characterid: charId
            });
        });
    });

    // Send roll template report if any characters were affected
    if (affectedCharacters.length > 0) {
        const characterList = affectedCharacters.join("<br>");
        const rollTemplateMsg = `&{template:default} {{name=Token Actions Created for:}} {{=${characterList}}}`;
        sendChat("TA2024", rollTemplateMsg);
    }
});






//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//       TOKEN-MOD
//@@@@@@@@@@@@@@@@@@@@@@@@@@@

// Github:   https://github.com/shdwjk/Roll20API/blob/master/TokenMod/TokenMod.js
// By:       The Aaron, Arcane Scriptomancer
// Contact:  https://app.roll20.net/users/104025/the-aaron
var API_Meta = API_Meta||{}; // eslint-disable-line no-var
API_Meta.TokenMod={offset:Number.MAX_SAFE_INTEGER,lineCount:-1};
{try{throw new Error('');}catch(e){API_Meta.TokenMod.offset=(parseInt(e.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/,'$1'),10)-6);}}

const TokenMod = (() => { // eslint-disable-line no-unused-vars

    const scriptName = "TokenMod";
    const version = '0.8.84';
    API_Meta.TokenMod.version = version;
    const lastUpdate = 1745072349;
    const schemaVersion = 0.4;

    const fields = {
            // booleans
            showname: {type: 'boolean'},
            show_tooltip: {type: 'boolean'},
            showplayers_name: {type: 'boolean'},
            showplayers_bar1: {type: 'boolean'},
            showplayers_bar2: {type: 'boolean'},
            showplayers_bar3: {type: 'boolean'},
            showplayers_aura1: {type: 'boolean'},
            showplayers_aura2: {type: 'boolean'},
            playersedit_name: {type: 'boolean'},
            playersedit_bar1: {type: 'boolean'},
            playersedit_bar2: {type: 'boolean'},
            playersedit_bar3: {type: 'boolean'},
            playersedit_aura1: {type: 'boolean'},
            playersedit_aura2: {type: 'boolean'},
            light_otherplayers: {type: 'boolean'},
            light_hassight: {type: 'boolean'},
            isdrawing: {type: 'boolean'},
            disableSnapping: {type: 'boolean'},
            disableTokenMenu: {type: 'boolean'},
            flipv: {type: 'boolean'},
            fliph: {type: 'boolean'},
            aura1_square: {type: 'boolean'},
            aura2_square: {type: 'boolean'},
            lockMovement: {type: 'boolean'},
            fadeOnOverlap: {type: 'boolean'},
            renderAsScenery: {type: 'boolean'},
            fadeOpacity: {type: 'percentage'},
            baseOpacity: {type: 'percentage'},


            // UDL settings
            has_bright_light_vision: {type: 'boolean'},
            has_night_vision: {type: 'boolean'},
            emits_bright_light: {type: 'boolean'},
            emits_low_light: {type: 'boolean'},
            has_limit_field_of_vision: {type: 'boolean'},
            has_limit_field_of_night_vision: {type: 'boolean'},
            has_directional_bright_light: {type: 'boolean'},
            has_directional_dim_light: {type: 'boolean'},
            light_sensitivity_multiplier: {type: 'number'},
            night_vision_effect: {type: 'option'},
            

            // bounded by screen size
            left: {type: 'number', transform: 'screen'},
            top: {type: 'number', transform: 'screen'},
            width: {type: 'number', transform: 'screen'},
            height: {type: 'number', transform: 'screen'},
            scale: {type: 'number', transform: 'screen'},

            // 360 degrees
            rotation: {type: 'degrees'},
            light_angle: {type: 'circleSegment'},
            light_losangle: {type: 'circleSegment'},

            limit_field_of_vision_center: {type: 'degrees'},
            limit_field_of_night_vision_center: {type: 'degrees'},
            directional_bright_light_center: {type: 'degrees'},
            directional_dim_light_center: {type: 'degrees'},

            limit_field_of_vision_total: {type: 'circleSegment'},
            limit_field_of_night_vision_total: {type: 'circleSegment'},
            directional_bright_light_total: {type: 'circleSegment'},
            directional_dim_light_total: {type: 'circleSegment'},



            // distance
            light_radius: {type: 'numberBlank'},
            light_dimradius: {type: 'numberBlank'},
            light_multiplier: {type: 'numberBlank'},
            adv_fow_view_distance: {type: 'numberBlank'},
            aura1_radius: {type: 'numberBlank'},
            aura2_radius: {type: 'numberBlank'},

                //UDL settings
            night_vision_distance: {type: 'numberBlank'},
            bright_light_distance: {type: 'numberBlank'},
            low_light_distance: {type: 'numberBlank'},
            dim_light_opacity: {type: 'percentage'},

            // text or numbers
            bar1_value: {type: 'text'},
            bar2_value: {type: 'text'},
            bar3_value: {type: 'text'},
            bar1_max: {type: 'text'},
            bar2_max: {type: 'text'},
            bar3_max: {type: 'text'},
            bar1: {type: 'text'},
            bar2: {type: 'text'},
            bar3: {type: 'text'},
            bar1_reset: {type: 'text'},
            bar2_reset: {type: 'text'},
            bar3_reset: {type: 'text'},

            bar_location: {type: 'option'},
            compact_bar: {type: 'option'},


            // colors
            aura1_color: {type: 'color'},
            aura2_color: {type: 'color'},
            tint_color: {type: 'color'},
            night_vision_tint: {type: 'color'},
            lightColor: {type: 'color'},

            // Text : special
            name: {type: 'text'},
            tooltip: {type: 'text'},

            statusmarkers: {type: 'status'},
            layer: {type: 'layer'},
            represents: {type: 'character_id'},
            bar1_link: {type: 'attribute'},
            bar2_link: {type: 'attribute'},
            bar3_link: {type: 'attribute'},
            bar1_num_permission: {type: 'option'},
            bar2_num_permission: {type: 'option'},
            bar3_num_permission: {type: 'option'},
            currentSide: {type: 'sideNumber'},
            imgsrc: {type: 'image'},
            sides: {type: 'image' },

            controlledby: {type: 'player'},

            // <Blank> : special
            defaulttoken: {type: 'defaulttoken'}
        };

    const fieldAliases = {
      bar1_current: "bar1_value",
      bar2_current: "bar2_value",
      bar3_current: "bar3_value",
      bright_vision: "has_bright_light_vision",
      night_vision: "has_night_vision",
      emits_bright: "emits_bright_light",
      emits_low: "emits_low_light",
      night_distance: "night_vision_distance",   
      bright_distance: "bright_light_distance",    
      low_distance: "low_light_distance",
      low_light_opacity: "dim_light_opacity",
      has_directional_low_light: "has_directional_dim_light",
      directional_low_light_total: "directional_dim_light_total",
      directional_low_light_center: "directional_dim_light_center",
      currentside: "currentSide",   // fix for case issue
      lightcolor: "lightColor", // fix for case issue
      light_color: "lightColor", // fix for case issue
      lockmovement: "lockMovement", // fix for case issue
      lock_movement: "lockMovement", // fix for case issue
      disablesnapping: "disableSnapping", 
      disabletokenmenu: "disableTokenMenu",
      disable_snapping: "disableSnapping", 
      disable_token_menu: "disableTokenMenu",
      fadeonoverlap: "fadeOnOverlap",
      renderasscenery: "renderAsScenery",
      fadeopacity: "fadeOpacity",
      baseopacity: "baseOpacity"
    };

    const reportTypes = [
            'gm', 'player', 'all', 'control', 'token', 'character'
        ];

    const probBool = {
      couldbe:   ()=>(randomInteger(8)<=1),
      sometimes: ()=>(randomInteger(8)<=2),
      maybe:     ()=>(randomInteger(8)<=4),
      probably:  ()=>(randomInteger(8)<=6),
      likely:    ()=>(randomInteger(8)<=7)
    };

    const unalias = (name) => fieldAliases.hasOwnProperty(name) ? fieldAliases[name] : name;

    const filters = {
            hasArgument: (a) => a.match(/.+[|#]/) || 'defaulttoken'===a,
            isBoolean: (a) => 'boolean' === (fields[a]||{type:'UNKNOWN'}).type,
            isTruthyArgument: (a) => [1,'1','on','yes','true','sure','yup'].includes(a)
        };

    const getCleanImgsrc = (imgsrc) => {
      let parts = (imgsrc||'').match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/);
      if(parts) {
        let leader = parts[1].replace(/^https:\/\/s3.amazonaws.com\/files.d20.io\//,'https://files.d20.io/');
          return `${leader}thumb${parts[3]}${parts[4] ? parts[4] : `?${Math.round(Math.random()*9999999)}`}`;
        }
    };

    const forceLightUpdateOnPage = (()=>{
        const forPage = (pid) => (getObj('page',pid)||{set:()=>{}}).set('force_lighting_refresh',true);
        let pids = new Set();
        let t;

        return (pid) => {
          pids.add(pid);
          clearTimeout(t);
          t = setTimeout(() => {
            let activePages = getActivePages();
            [...pids].filter(p=>activePages.includes(p)).forEach(forPage);
            pids.clear();
          },100);
        };
    })();

    const option_fields = {
      night_vision_effect: {
        __default__: ()=>()=>'None',
        off: ()=>()=>'None',
        ['none']: ()=>()=>'None',
        ['dimming']: (amount='5ft')=>(token,mods)=>{
          const regexp = /^([=+\-/*])?(-?\d+\.?|\d*\.\d+)(u|g|s|ft|m|km|mi|in|cm|un|hex|sq|%)?$/i; // */
          let match = `${amount}`.match(regexp);
          let factor;
          let pnv;
          if(mods.hasOwnProperty('night_vision_distance')){
            pnv = mods.night_vision_distance;
          } else {
            pnv = token.get('night_vision_distance');
          }

          let dp;
          if(mods.hasOwnProperty('night_vision_effect') && /^Dimming_/.test(mods.night_vision_effect)){
            dp = (parseFloat(mods.night_vision_effect.replace(/^Dimming_/,''))||0)*pnv;
          } else if(/^Dimming_/.test(token.get('night_vision_effect'))){
            dp = (parseFloat(token.get('night_vision_effect').replace(/^Dimming_/,''))||0)*pnv;
          }

          if(match){
            let dist;
            switch(match[3]){

              // handle percentage
              case '%': {
                  let p = parseFloat(match[2])||0;
                  if(p>1){
                    p*=.01;
                  }
                  p = Math.min(1,p);
                
                  dist = p*pnv;
                }
                break;

              // handle units
              default: {
                  let page=getObj('page',token.get('pageid'));
                  if(page){
                    dist = numberOp.ConvertUnitsRoll20(match[2],match[3],page);
                  }
                  else {
                    dist=5;
                  }
                }
                break;
            }
            switch(match[1]){
              default:
              case '=':
                factor=(dist/pnv);
                break;

              case '+':
                factor=((dist+dp)/pnv);
                break;
              case '-':
                factor=((dp-dist)/pnv);
                break;
              case '*':
                factor=((dist*dp)/pnv);
                break;
              case '/':
                factor=((dp/dist)/pnv);
                break;
            }
          } else {
            factor=(5/pnv);
          }

          return `Dimming_${Math.min(1,Math.max(0,factor))}`;
        },
        ['nocturnal']: ()=>()=>'Nocturnal'
      },
      bar_location: {
        __default__        : ()=>null,
        off                : ()=>null,
        none               : ()=>null,
        ['above']          : ()=>null,
        ['overlap_top']    : ()=>'overlap_top',
        ['overlap_bottom'] : ()=>'overlap_bottom',
        ['below']          : ()=>'below'
      },
      compact_bar: {
        __default__ : ()=>null,
        off         : ()=>null,
        none        : ()=>null,
        ['compact'] : ()=>'compact',
        ['on']      : ()=>'compact'
      },
      bar1_num_permission: {
        __default__  : ()=>'',
        ['editor']   : ()=>'',
        ['']         : ()=>'',
        ['none']     : ()=>'hidden',
        ['hidden']   : ()=>'hidden',
        ['everyone'] : ()=>'everyone',
        ['all']      : ()=>'everyone'
      }
    };
    option_fields.bar2_num_permission = option_fields.bar1_num_permission;
    option_fields.bar3_num_permission = option_fields.bar1_num_permission;

    const regex = {
      moveAngle: /^(=)?([+-]?(?:0|[1-9][0-9]*))(!)?$/,
      moveDistance: /^([+-]?\d+\.?|\d*\.\d+)(u|g|s|ft|m|km|mi|in|cm|un|hex|sq)?$/i,
      numberString: /^[-+*/=]?[-+]?(0|[1-9][0-9]*)([.]+[0-9]*)?([eE][-+]?[0-9]+)?(!)?$/,
      stripSingleQuotes: /'([^']+(?='))'/g,
      stripDoubleQuotes: /"([^"]+(?="))"/g,
      layers: /^(?:gmlayer|objects|map|walls|foreground)$/,
      imgsrc: /(.*\/images\/.*)(thumb|med|original|max)(.*)$/,
      imageOp: /^(?:(-(?:\d*(?:\s*,\s*\d+)*|\*)$)|(\/(?:\d+@\d+(?:\s*,\s*\d+@\d+)*|\*)$)|([+^]))?(=?)(?:(https?:\/\/.*$)|([-\d\w]*))(?::(.*))?$/,
      sideNumber: /^(\?)?([-+=*])?(\d*)$/,
      color : {
        ops: '([*=+\\-!])?',
        transparent: '(transparent)',
        html: '#?((?:[0-9a-f]{6})|(?:[0-9a-f]{3}))',
        rgb: '(rgb\\(\\s*(?:(?:\\d*\\.\\d+)\\s*,\\s*(?:\\d*\\.\\d+)\\s*,\\s*(?:\\d*\\.\\d+)|(?:\\d+)\\s*,\\s*(?:\\d+)\\s*,\\s*(?:\\d+))\\s*\\))',
        hsv: '(hsv\\(\\s*(?:(?:\\d*\\.\\d+)\\s*,\\s*(?:\\d*\\.\\d+)\\s*,\\s*(?:\\d*\\.\\d+)|(?:\\d+)\\s*,\\s*(?:\\d+)\\s*,\\s*(?:\\d+))\\s*\\))'
      }
    };

    const colorOpReg = new RegExp(`^${regex.color.ops}(?:${regex.color.transparent}|${regex.color.html}|${regex.color.rgb}|${regex.color.hsv})$`,'i');
    const colorReg = new RegExp(`^(?:${regex.color.transparent}|${regex.color.html}|${regex.color.rgb}|${regex.color.hsv})$`,'i');
    const colorParams = /\(\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\s*\)/;



        ////////////////////////////////////////////////////////////
        // Number Operations
        ////////////////////////////////////////////////////////////

        class numberOp {
            static parse(field, str, permitBlank=true) {
                const regexp = /^([=+\-/*!])?(-?\d+\.?|-?\d*\.\d+)(u|g|s|ft|m|km|mi|in|cm|un|hex|sq)?(!)?$/i; // */

                if(!str.length && permitBlank){
                    return new numberOp(field, '','','' );
                }

                let m = `${str}`.match(regexp);

                if(m){
                    let oper = m[1]||'';
                    let num = parseFloat(m[2]);
                    let scale = m[3]||'';
                    let enforceBounds = '!'===m[4];

                    return new numberOp(field, oper, num, scale.toLowerCase(),enforceBounds);
                }
                return {getMods:()=>({})};
            }

            constructor(field,op,num,units,enforce){
                this.field=field;
                this.operation = op;
                this.num = num;
                this.units = units;
                this.enforce = enforce;
            }

            static ConvertUnitsPixel(num,unit,page){
              const unitSize = 70;
                switch(unit){
                    case 'u':
                        return num*unitSize;

                    case 'g':
                        return num*(parseFloat(page.get('snapping_increment'))*unitSize);

                    case 'ft':
                    case 'm':
                    case 'km':
                    case 'mi':
                    case 'in':
                    case 'cm':
                    case 'un':
                    case 'hex':
                    case 'sq':
                    case 's':
                        return (num/(parseFloat(page.get('scale_number'))||1))*unitSize;
                    default:
                      return num;
                }
            }

            static ConvertUnitsRoll20(num,unit,page){
                switch(unit){
                    case 'u':
                        return num*(parseFloat(page.get('scale_number'))*(1/parseFloat(page.get('snapping_increment'))||1));

                    case 'g':
                        return num*parseFloat(page.get('scale_number'));

                    default:
                    case 'ft':
                    case 'm':
                    case 'km':
                    case 'mi':
                    case 'in':
                    case 'cm':
                    case 'un':
                    case 'hex':
                    case 'sq':
                    case 's':
                         return num;
                }
            }

            getMods(token,mods){
                let num = this.num;
                let page = getObj('page',token.get('pageid'));
                switch(this.field){

                    case 'light_radius':
                    case 'light_dimradius':
                    case 'aura2_radius':
                    case 'aura1_radius':
                    case 'adv_fow_view_distance':
                    case 'night_vision_distance':
                    case 'bright_light_distance':
                    case 'low_light_distance':
                    case 'night_distance':
                    case 'bright_distance':
                    case 'low_distance':
                        num = numberOp.ConvertUnitsRoll20(num,this.units,page);
                        break;

                    default:
                    case 'left':
                    case 'top':
                    case 'width':
                    case 'height':
                        num = numberOp.ConvertUnitsPixel(num,this.units,page);
                        break;

                    case 'light_multiplier':
                    case 'light_sensitivity_multiplier':
                        break;

                }

                let current = parseFloat(token.get(this.field))||0;
                const getValue = (k,m,t) => m.hasOwnProperty(k) ? m[k] : t.get(k);

                let adjuster = (a)=>a;

                switch(this.field){
                    case 'bar1_value':
                    case 'bar2_value':
                    case 'bar3_value':
                        if(this.enforce){
                            adjuster = (a,t)=>Math.max(0,Math.min(a,t.get(this.field.replace(/_value/,'_max'))));
                        }
                        break;

                    case 'night_vision_distance':
                        adjuster = (a,token,mods) => { 
                            let pnv;
                            if(mods.hasOwnProperty('night_vision_distance')){
                              pnv = mods.night_vision_distance;
                            } else {
                              pnv = token.get('night_vision_distance');
                            }

                            let dp;
                            if(mods.hasOwnProperty('night_vision_effect') && /^Dimming_/.test(mods.night_vision_effect)){
                              dp = parseFloat(mods.night_vision_effect.replace(/^Dimming_/,''))||undefined;
                            } else if(/^Dimming_/.test(token.get('night_vision_effect'))){
                              dp = parseFloat(token.get('night_vision_effect').replace(/^Dimming_/,''))||undefined;
                            }

                            if(undefined !== dp) {
                              let dd = 0;
                              if(dp>0){
                                  dd = parseFloat(pnv)*dp;
                                  dp=Math.min(1,parseFloat(dd.toFixed(2))/a);
                              }

                              mods.night_vision_effect=`Dimming_${dp}`;
                            }
                            return a; 
                        };
                        break;
                }

                switch(this.operation){
                    default:
                    case '=': {
                        switch(this.field){
                            case 'bright_light_distance':
                                num=num||0;
                                return {
                                    bright_light_distance: num,
                                    low_light_distance: (parseFloat(getValue('low_light_distance',mods,token)||0)-(parseFloat(getValue('bright_light_distance',mods,token))||0)+num)
                                };
                            case 'low_light_distance':
                                num=num||0;
                                return {
                                    low_light_distance: ((parseFloat(getValue('bright_light_distance',mods,token))||0)+num)
                                };

                            default:
                                return {[this.field]:adjuster(num,token,mods)};
                        }
                    }
                    case '!': return {[this.field]:adjuster((current===0 ? num : ''),token,mods)};
                    case '+': return {[this.field]:adjuster((current+num),token,mods)};
                    case '-': return {[this.field]:adjuster((current-num),token,mods)};
                    case '/': return {[this.field]:adjuster((current/(num||1)),0,mods)};
                    case '*': return {[this.field]:adjuster((current*num),0,mods)};
                }
            }

        }

        ////////////////////////////////////////////////////////////
        // Image Operations
        ////////////////////////////////////////////////////////////


        class imageOp {
          static parseImage(input){
            const OP_REMOVE_BY_INDEX = 1;
            const OP_REORDER = 2;
            const OP_OPERATION = 3;
            const OP_EXPLICIT_SET = 4;
            const OP_IMAGE_URL = 5;
            const OP_TOKEN_ID = 6;
            const OP_TOKEN_SIDE_INDEX = 7;

            let parsed = input.match(regex.imageOp);

            if(parsed && parsed.length){
              if(parsed[ OP_REMOVE_BY_INDEX ]){
                let idxs=parsed[ OP_REMOVE_BY_INDEX ].slice(1);
                return new imageOp('-',false,
                  '*'===idxs
                  ? ['*']
                  : idxs.split(/\s*,\s*/).filter(s=>s.length).map((idx)=>parseInt(idx,10)-1)
                );
              } else if(parsed[ OP_REORDER ]){
                let idxs=parsed[ OP_REORDER ].slice(1);

                return new imageOp('/',false,
                  idxs.split(/\s*,\s*/)
                    .filter(s=>s.length)
                    .map((idx)=>{
                      let parts = idx.split(/@/);
                      return {
                        idx: (parseInt(parts[0])-1),
                        pos: (parseInt(parts[1]))
                      };
                    })
                );
              } else {
                let op = parsed[ OP_OPERATION ]||'_';
                let set = '='===parsed[ OP_EXPLICIT_SET ];
                if(parsed[ OP_IMAGE_URL ]){

                  let parts = parsed[ OP_IMAGE_URL ].split(/:@/);
                  let url=getCleanImgsrc(parts[0]);
                  if(url){
                    return new imageOp(op,set,[],[{url,index:parseInt(parts[1])||undefined}]);
                  }
                } else {
                  let id = parsed[ OP_TOKEN_ID ];
                  let t = getObj('graphic',id);

                  if(t){
                    if(parsed[ OP_TOKEN_SIDE_INDEX ]){
                      let sides = t.get('sides');
                      if(sides.length){
                        sides = sides.split(/\|/).map(decodeURIComponent).map(getCleanImgsrc);
                      } else {
                        sides = [getCleanImgsrc(t.get('imgsrc'))];
                      }
                      let urls=[];
                      let idxs;
                      if('*'===parsed[ OP_TOKEN_SIDE_INDEX ]){
                        idxs=sides.reduce((m,v)=> ({ c:m.c+1, i:(v?[...m.i,m.c]:m.i) }), {c:0,i:[]}).i.map(id=>({idx:id}));
                      } else {
                        idxs=parsed[ OP_TOKEN_SIDE_INDEX ]
                          .split(/\s*,\s*/)
                          .filter(s=>s.length)
                          .map((idx)=>({
                            idx: (parseInt(idx,10)||1)-1,
                            insert: parseInt(idx.split(/@/)[1])||undefined
                          }));
                      }
                      idxs.forEach((i)=>{
                        if(sides[i.idx]){
                          urls.push({url:sides[i.idx], index: i.insert });
                        }
                      });

                      if(urls.length){
                        return new imageOp(op,set,[],urls);
                      }
                    } else {
                      let url=getCleanImgsrc(t.get('imgsrc'));
                      if(url){
                        return new imageOp(op,set,[],[{url}]);
                      }
                    }
                  }
                }
              }
            }
            return new imageOp();
          }

          constructor(op,set,indicies,urls){
            this.op = op||'/';
            this.set = set || false;
            this.indicies=indicies||[];
            this.urls=urls||[];
          }

          getMods(token /* ,mods */){
            let sideText = token.get('sides');
            let sides;


            if( sideText.length ){
              sides = sideText.split(/\|/).map(decodeURIComponent).map(getCleanImgsrc);
            } else {
              sides = [getCleanImgsrc(token.get('imgsrc'))];
              if('^' === this.op){
                this.op = '_';
              }
            }

            switch(this.op) {
              case '-': {
                if('*'===this.indicies[0]){
                  return {
                    currentSide: 0,
                    sides: ''
                  };
                }
                let currentSide=token.get('currentSide');
                if(this.indicies.length){
                  this.indicies.forEach((i)=>{
                    if(currentSide===i){
                      currentSide=0;
                    }
                    delete sides[i];
                  });
                } else {
                  delete sides[currentSide];
                  currentSide=0;
                }
                let idxs=sides.reduce((m,v)=> ({ c:m.c+1, i:(v?[...m.i,m.c]:m.i) }), {c:0,i:[]}).i;
                sides=sides.reduce((m,s)=>m.concat( s ? [s] : []),[]);
                currentSide=Math.max(_.indexOf(idxs,currentSide),0);
                if(sides.length){
                  return {
                    imgsrc: sides[currentSide],
                    currentSide: currentSide,
                    sides: sides.reduce((m,s)=>m.concat(s),[]).map(encodeURIComponent).join('|')
                  };
                }
                return {
                  currentSide: 0,
                  sides: ''
                };
              }

              case '/': {
                let currentSide=token.get('currentSide');
                let imgsrc=token.get('imgsrc');
                let sidesOld=token.get('sides');

                sides = this.indicies.reduce( (s,o) => {
                  let url = s[o.idx];
                  s.splice(o.idx,1);
                  return [...s.slice(0,(o.pos||Number.MAX_SAFE_INTEGER)-1), url, ...s.slice((o.pos||Number.MAX_SAFE_INTEGER)-1)];
                },sides);


                let retr = {
                  sides: sides.map(encodeURIComponent).join('|')
                };
                if(retr.sides===sidesOld){
                  delete retr.sides;
                }

                if(imgsrc !== sides[currentSide]){
                  retr.imgsrc=sides[currentSide];
                }
                return retr;
              }

              case '_': 
                return {
                  imgsrc: this.urls[0].url
                };

              case '^': {
                // replacing
                let currentSide=token.get('currentSide');
                let imgsrc=token.get('imgsrc');

                sides = this.urls.reduce((s,u) => {
                  let replaceIdx =(u.index||Number.MAX_SAFE_INTEGER)-1;
                  if(sides.hasOwnProperty(replaceIdx)){
                    sides[replaceIdx] = u.url;
                  } else {
                    sides.push(u.url);
                  }
                  return sides;
                },sides);

                let retr = {
                  sides: sides.map(encodeURIComponent).join('|')
                };
                if(this.set){
                  retr.imgsrc=sides.slice(-1)[0];
                  retr.currentSide=sides.length-1;
                }
                if(imgsrc !== sides[currentSide]){
                  retr.imgsrc=sides[currentSide];
                }
                return retr;
              }

              case '+': {

                // appending
                let currentSide=token.get('currentSide');
                let imgsrc=token.get('imgsrc');
                sides = this.urls.reduce((s,u) =>
                [...s.slice(0,(u.index||Number.MAX_SAFE_INTEGER)-1), u.url, ...s.slice((u.index||Number.MAX_SAFE_INTEGER)-1)]
                ,sides);
                let retr = {
                  sides: sides.map(encodeURIComponent).join('|')
                };
                if(this.set){
                  retr.imgsrc=sides.slice(-1)[0];
                  retr.currentSide=sides.length-1;
                }
                if(imgsrc !== sides[currentSide]){
                  retr.imgsrc=sides[currentSide];
                }
                return retr;
              }
            }
            return {};
          }
        }

        ////////////////////////////////////////////////////////////
        // Side Numbers
        ////////////////////////////////////////////////////////////

        class sideNumberOp {

          static parseSideNumber(input){
            const OP_FLAG = 1;
            const OP_OPERATION = 2;
            const OP_COUNT = 3;
            let parsed = input.toLowerCase().match(regex.sideNumber);
            if(parsed && parsed.length){
              return new sideNumberOp( parsed[ OP_FLAG ], parsed[ OP_OPERATION ], parsed[ OP_COUNT ] );
            }
            return new sideNumberOp(false,'/');
          }

          constructor(flag,op,count){
            this.flag=flag||false;
            this.operation=op||'=';
            this.count=(parseInt(`${count}`)||1);
          }


          getMods(token /*,mods */){
            // get sides
            let sides = token.get('sides').split(/\|/).map(decodeURIComponent).map(getCleanImgsrc);
            switch(this.operation){
              case '/':
                return {};
              case '=':
                if(sides[this.count-1]){
                  return {
                    currentSide: this.count-1,
                    imgsrc: sides[this.count-1]
                  };
                }
                return {};
              case '*': {
                // get indexes that are valid
                let idxs=sides.reduce((m,v)=> ({ c:m.c+1, i:(v?[...m.i,m.c]:m.i) }), {c:0,i:[]}).i;
                if(idxs.length){
                  let idx=_.sample(idxs);
                  return {
                    currentSide: idx,
                    imgsrc: sides[idx]
                  };
                }
                return {};
              }
            case '+':
            case '-': {
              let idx = token.get('currentSide')||0;
              idx += ('-'===this.operation ? -1 : 1)*this.count;
              if(this.flag){
                idx=Math.max(Math.min(idx,sides.length-1),0);
              } else {
                idx=(idx%sides.length)+(idx<0 ? sides.length : 0);
              }
              if(sides[idx]){
                return {
                  currentSide: idx,
                  imgsrc: sides[idx]
                };
              }
              return {};
            }

            }

          }
        }


        ////////////////////////////////////////////////////////////
        // Colors
        ////////////////////////////////////////////////////////////

        class Color {
          static hsv2rgb(h, s, v) {
            let r, g, b;

            let i = Math.floor(h * 6);
            let f = h * 6 - i;
            let p = v * (1 - s);
            let q = v * (1 - f * s);
            let t = v * (1 - (1 - f) * s);

            switch (i % 6) {
              case 0: r = v, g = t, b = p; break;
              case 1: r = q, g = v, b = p; break;
              case 2: r = p, g = v, b = t; break;
              case 3: r = p, g = q, b = v; break;
              case 4: r = t, g = p, b = v; break;
              case 5: r = v, g = p, b = q; break;
            }

            return { r , g , b };
          }

          static rgb2hsv(r,g,b) {
            let max = Math.max(r, g, b),
            min = Math.min(r, g, b);
            let h, s, v = max;

            let d = max - min;
            s = max == 0 ? 0 : d / max;

            if (max == min) {
              h = 0; // achromatic
            } else {
              switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
              }

              h /= 6;
            }

            return { h, s, v };
          }

          static dec2hex (n){
            n = (Math.max(Math.min(Math.round(n*255),255), 0)||0);
            return `${n<16?'0':''}${n.toString(16)}`;
          }

          static hex2dec (n){
            return Math.max(Math.min(parseInt(n,16),255), 0)/255;
          }

          static html2rgb(htmlstring){
            let s=htmlstring.toLowerCase().replace(/[^0-9a-f]/,'');
            if(3===s.length){
              s=`${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`;
            }
            return {
              r: this.hex2dec(s.substr(0,2)),
              g: this.hex2dec(s.substr(2,2)),
              b: this.hex2dec(s.substr(4,2))
            };
          }

          static parseRGBParam(p){
            if(/\./.test(p)){
              return parseFloat(p);
            }
            return parseInt(p,10)/255;
          }
          static parseHSVParam(p,f){
            if(/\./.test(p)){
              return parseFloat(p);
            }
            switch(f){
              case 'h':
                return parseInt(p,10)/360;
              case 's':
              case 'v':
                return parseInt(p,10)/100;
            }
          }

          static parseColor(input){
            return Color.buildColor(`${input}`.toLowerCase().match(colorReg));
          }
          static buildColor(parsed){
            const idx = {
              transparent: 1,
              html: 2,
              rgb: 3,
              hsv: 4
            };

            if(parsed){
              let c = new Color();
              if(parsed[idx.transparent]){
                c.type = 'transparent';
              } else if(parsed[idx.html]){
                c.type = 'rgb';
                _.each(Color.html2rgb(parsed[idx.html]),(v,k)=>{
                  c[k]=v;
                });
              } else if(parsed[idx.rgb]){
                c.type = 'rgb';
                let params = parsed[idx.rgb].match(colorParams);
                c.r= Color.parseRGBParam(params[1]);
                c.g= Color.parseRGBParam(params[2]);
                c.b= Color.parseRGBParam(params[3]);
              } else if(parsed[idx.hsv]){
                c.type = 'hsv';
                let params = parsed[idx.hsv].match(colorParams);
                c.h= Color.parseHSVParam(params[1],'h');
                c.s= Color.parseHSVParam(params[2],'s');
                c.v= Color.parseHSVParam(params[3],'v');
              } 
              return c;
            }
            return new Color();
          }

          constructor(){
            this.type='transparent';
          }

          clone(){
            return Object.assign(new Color(), this);
          }

          toRGB(){
            if('hsv'===this.type){
              _.each(Color.hsv2rgb(this.h,this.s,this.v),(v,k)=>{
                this[k]=v;
              });
              this.type='rgb';
            } else if ('transparent' === this.type){
              this.type='rgb';
              this.r=0.0;
              this.g=0.0;
              this.b=0.0;
            }
            delete this.h;
            delete this.s;
            delete this.v;
            return this;
          }

          toHSV(){
            if('rgb'===this.type){
              _.each(Color.rgb2hsv(this.r,this.g,this.b),(v,k)=>{
                this[k]=v;
              });
              this.type='hsv';
            } else if('transparent' === this.type){
              this.type='hsv';
              this.h=0.0;
              this.s=0.0;
              this.v=0.0;
            }

            delete this.r;
            delete this.g;
            delete this.b;

            return this;
          }

          toHTML(){
            switch(this.type){
              case 'transparent':
                return 'transparent';
              case 'hsv': {
                return this.clone().toRGB().toHTML();
              }
            case 'rgb':
              return `#${Color.dec2hex(this.r)}${Color.dec2hex(this.g)}${Color.dec2hex(this.b)}`;
            }
          }
        }

        class ColorOp extends Color {

          constructor( op ) {
            super();
            this.operation = op;
          }

          static parseColor(input){
            const idx = {
              ops: 1,
              transparent: 2,
              html: 3,
              rgb: 4,
              hsv: 5
            };

            let parsed = `${input}`.toLowerCase().match(colorOpReg)||[];

            if(parsed.length) {
              return Object.assign(new ColorOp(parsed[idx.ops]||'='), Color.buildColor(parsed.slice(1)));
            } else {
              return Object.assign(new ColorOp(parsed[idx.ops]||(input.length ? '*':'=')), Color.parseColor('transparent'));
            }
          }

          applyTo(c){
            if( !(c instanceof Color) ){
              c = Color.parseColor(c);
            }
            switch(this.operation){
              case '=':
                return this;
              case '!':
                return ('transparent'===c.type ? this : Color.parseColor('transparent'));
            }
            switch(this.type){
              case 'transparent':
                return c;
              case 'hsv':
                c.toHSV();
                switch(this.operation){
                  case '*':
                    c.h*=this.h;
                    c.s*=this.s;
                    c.v*=this.v;
                    c.toRGB();
                    return c;
                  case '+':
                    c.h+=this.h;
                    c.s+=this.s;
                    c.v+=this.v;
                    c.toRGB();
                    return c;
                  case '-':
                    c.h-=this.h;
                    c.s-=this.s;
                    c.v-=this.v;
                    c.toRGB();
                    return c;
                }
                break;
              case 'rgb':
                c.toRGB();
                switch(this.operation){
                  case '*':
                    c.r*=this.r;
                    c.g*=this.g;
                    c.b*=this.b;
                    return c;
                  case '+':
                    c.r+=this.r;
                    c.g+=this.g;
                    c.b+=this.b;
                    return c;
                  case '-':
                    c.r-=this.r;
                    c.g-=this.g;
                    c.b-=this.b;
                    return c;
                }
            }

            return c;
          }


          toString(){
            let extra ='';
            switch (this.type){
              case 'transparent':
                extra='(0.0, 0.0, 0.0, 1.0)';
                break;
              case 'rgb':
                extra=`(${this.r},${this.g},${this.b})`;
                break;
              case 'hsv':
                extra=`(${this.h},${this.s},${this.v})`;
                break;
            }
            return `${this.operation} ${this.type}${extra} ${this.toHTML()}`;
          }

        }

        ////////////////////////////////////////////////////////////
        // StatusMarkers
        ////////////////////////////////////////////////////////////

        class TokenMarker {
            constructor( name, tag, url ) {
                this.name = name;
                this.tag = tag;
                this.url = url;
            }

            getName() {
                return this.name;
            }
            getTag() {
                return this.tag;
            }

            getHTML(scale = 1.4){
                return `<div style="width: ${scale}em; vertical-align: middle; height: ${scale}em; display:inline-block; margin: 0 3px 0 0; border:0; padding:0;background-image: url('${this.url}');background-repeat:no-repeat; background-size: auto ${scale}em;"></div>`;
            }
        }

        class ColorDotTokenMarker extends TokenMarker {
            constructor( name, color ) {
                super(name,name);
                this.color = color;
            }

            getHTML(scale = 1.4){
                return `<div style="width: ${scale*.9}em; height: 1em; border-radius:${scale}em; display:inline-block; margin: 0 3px 0 0; border:0; background-color: ${this.color}; text-align: center; line-height: 1em;"></div>`;
            }
        }

        class ColorTextTokenMarker extends TokenMarker {
            constructor( name, letter, color ) {
                super(name,name);
                this.color = color;
                this.letter = letter;
            }

            getHTML(scale = 1.4){
                return `<div style="width: 1em; height: ${scale}em; font-size: ${scale}em; display:inline-block; margin: 0; border:0; font-weight: bold; color: ${this.color}">${this.letter}</div>`;
            }
        }

        // legacy
        class ImageStripTokenMarker extends TokenMarker {
            constructor( name, offset){
                super(name, name);
                this.offset = offset;
            }

            getHTML(scale = 1.4){
                const ratio = 2.173913;
                const statusSheet = 'https://app.roll20.net/images/statussheet.png';

                return `<div style="width: ${scale}em; height: ${scale}em; display:inline-block; margin: 0 3px 0 0; border:0; padding:0;background-image: url('${statusSheet}');background-repeat:no-repeat;background-position: ${(ratio*(this.offset))}% 0; background-size: auto ${scale}em;"></div>`;
            }
        }

        class StatusMarkers {

            static init(){
                let tokenMarkers = {};
                let orderedLookup = new Set();
                let reverseLookup = {};

                const insertTokenMarker = (tm) => {
                    tokenMarkers[tm.getTag()] = tm;
                    orderedLookup.add(tm.getTag());

                    reverseLookup[tm.getName()] = reverseLookup[tm.getName()]||[];
                    reverseLookup[tm.getName()].push(tm.getTag()); 
                };

                const buildStaticMarkers = () => {
                    insertTokenMarker(new ColorDotTokenMarker('red', '#C91010'));
                    insertTokenMarker(new ColorDotTokenMarker(`blue`, '#1076c9'));
                    insertTokenMarker(new ColorDotTokenMarker(`green`, '#2fc910'));
                    insertTokenMarker(new ColorDotTokenMarker(`brown`, '#c97310'));
                    insertTokenMarker(new ColorDotTokenMarker(`purple`, '#9510c9'));
                    insertTokenMarker(new ColorDotTokenMarker(`pink`, '#eb75e1'));
                    insertTokenMarker(new ColorDotTokenMarker(`yellow`, '#e5eb75'));

                    insertTokenMarker(new ColorTextTokenMarker('dead', 'X', '#cc1010'));
                };

                const buildLegacyMarkers = () => {
                    const legacyNames = [
                        'skull', 'sleepy', 'half-heart', 'half-haze', 'interdiction',
                        'snail', 'lightning-helix', 'spanner', 'chained-heart',
                        'chemical-bolt', 'death-zone', 'drink-me', 'edge-crack',
                        'ninja-mask', 'stopwatch', 'fishing-net', 'overdrive', 'strong',
                        'fist', 'padlock', 'three-leaves', 'fluffy-wing', 'pummeled',
                        'tread', 'arrowed', 'aura', 'back-pain', 'black-flag',
                        'bleeding-eye', 'bolt-shield', 'broken-heart', 'cobweb',
                        'broken-shield', 'flying-flag', 'radioactive', 'trophy',
                        'broken-skull', 'frozen-orb', 'rolling-bomb', 'white-tower',
                        'grab', 'screaming', 'grenade', 'sentry-gun', 'all-for-one',
                        'angel-outfit', 'archery-target'
                    ];
                    legacyNames.forEach( (n,i)=>insertTokenMarker(new ImageStripTokenMarker(n,i)));
                };

                const readTokenMarkers = () => {
                    JSON.parse(Campaign().get('_token_markers')||'[]').forEach( tm => insertTokenMarker(new TokenMarker(tm.name, tm.tag, tm.url)));
                };

                StatusMarkers.getStatus = (keyOrName) => {
                    if(tokenMarkers.hasOwnProperty(keyOrName)){
                        return tokenMarkers[keyOrName];
                    }
                    if(reverseLookup.hasOwnProperty(keyOrName)){
                        return tokenMarkers[reverseLookup[keyOrName][0]]; // returning first one...
                    }
                    // maybe return a null status marker object?
                };

                StatusMarkers.getOrderedList = () => {
                    return [...orderedLookup].map( key => tokenMarkers[key]);
                };

                const simpleObj = o => JSON.parse(JSON.stringify(o||'{}'));


                buildStaticMarkers();
                if(simpleObj(Campaign()).hasOwnProperty('_token_markers')){
                    readTokenMarkers();
                } else {
                    buildLegacyMarkers();
                }
            }
        }

        class statusOp {

            static decomposeStatuses(statuses){
                return _.reduce(statuses.split(/,/),function(memo,st,idx){
                    let parts=st.split(/@/),
                    entry = {
                        mark: parts[0],
                        num: parseInt(parts[1],10),
                        idx: idx
                    };
                    if(isNaN(entry.num)){
                        entry.num='';
                    }
                    if(parts[0].length) {
                        memo[parts[0]] = ( memo[parts[0]] && memo[parts[0]].push(entry) && memo[parts[0]]) || [entry] ;
                    }
                    return memo;
                },{});
            }

            static composeStatuses(statuses){
                return _.chain(statuses)
                .reduce(function(m,s){
                    _.each(s,function(sd){
                        m.push(sd);
                    });
                    return m;
                },[])
                .sortBy(function(s){
                    return s.idx;
                })
                .map( (s) => ('dead'===s.mark ? 'dead' : ( s.mark+(s.num!=='' ? '@'+s.num : ''))) )
                .value()
                .join(',');
            }

            static parse(status) {
                let s = status.split(/[:;]/);
                if(s.hasOwnProperty(1) && 0 === s[1].length){
                    s = [`${s[0]}::${s[2]}`,...s.slice(3)];
                }
                let statparts = s.shift().match(/^(\S+?)(\[(\d*)\]|)$/)||[];
                let index = ( '[]' === statparts[2] ? statparts[2] : ( undefined !== statparts[3] ? Math.max(parseInt(statparts[3],10)-1,0) : 0 ) );

                let stat=statparts[1]||'';
                let op = (_.contains(['*','/','-','+','=','!','?'], stat[0]) ? stat[0] : false);
                let numraw = s.shift() || '';
                let min = Math.min(Math.max(parseInt(s.shift(),10)||0, 0),9);
                let max = Math.max(Math.min(parseInt(s.shift(),10)||9,9),0);
                let numop = (_.contains(['*','/','-','+'],numraw[0]) ? numraw[0] : false);
                let num = Math.max(0,Math.min(9,Math.abs(parseInt(numraw,10))));

                if(isNaN(num)){
                    num = '';
                }

                stat = ( op ? stat.substring(1) : stat);

                let tokenMarker = StatusMarkers.getStatus(stat);

                if(tokenMarker) {
                    return new statusOp(
                        tokenMarker,
                        {
                            status: tokenMarker.getTag(),
                            number: num,
                            index: index,
                            sign: numop,
                            min: (min<max?min:max),
                            max: (max>min?max:min),
                            operation: op || '+'
                        });
                }
                if('=' === op && stat.length===0){
                  return {getMods:(/*c*/)=>({statusmarkers:''})};
                }

                return {getMods:(c)=>({statusmarkers:c})};
            }

            constructor(tm, ops) {
                this.tokenMarker = tm;
                this.ops = ops;
            }

            getMods(statuses='') {
                let current = statusOp.decomposeStatuses(statuses);
                let statusCount=(statuses).split(/,/).length;
                let sm = this.ops;

                switch(sm.operation){
                    case '!':
                        if('[]' !== sm.index && _.has(current,sm.status) ){
                            if( _.has(current[sm.status],sm.index) ) {
                                current[sm.status]= _.filter(current[sm.status],function(e,idx){
                                    return idx !== sm.index;
                                });
                            } else {
                                current[sm.status] = current[sm.status] || [];
                                current[sm.status].push({
                                    mark: sm.status,
                                    num: (sm.number !=='' ? Math.max(sm.min,Math.min(sm.max,getRelativeChange(0, sm.sign+sm.number))):''),
                                    index: statusCount++
                                });
                            }
                        } else {
                            current[sm.status] = current[sm.status] || [];
                            current[sm.status].push({
                                mark: sm.status,
                                num: (sm.number!=='' ? Math.max(sm.min,Math.min(sm.max,getRelativeChange(0, sm.sign+sm.number))):''),
                                index: statusCount++
                            });
                        }
                        break;
                    case '?':
                        if('[]' !== sm.index && _.has(current,sm.status) && _.has(current[sm.status],sm.index)){
                            current[sm.status][sm.index].num = (sm.number !== '') ? (Math.max(sm.min,Math.min(sm.max,getRelativeChange(current[sm.status][sm.index].num, sm.sign+sm.number)))) : '';

                            if([0,''].includes(current[sm.status][sm.index].num)) {
                                current[sm.status]= _.filter(current[sm.status],function(e,idx){
                                    return idx !== sm.index;
                                });
                            }
                        }
                        break;
                    case '+':
                        if('[]' !== sm.index && _.has(current,sm.status) && _.has(current[sm.status],sm.index)){
                            current[sm.status][sm.index].num = (sm.number !== '') ? (Math.max(sm.min,Math.min(sm.max,getRelativeChange(current[sm.status][sm.index].num, sm.sign+sm.number)))) : '';
                        } else {
                            current[sm.status] = current[sm.status] || [];
                            current[sm.status].push({
                                mark: sm.status,
                                num: (sm.number!=='' ? Math.max(sm.min,Math.min(sm.max,getRelativeChange(0, sm.sign+sm.number))):''),
                                index: statusCount++
                            });
                        }
                        break;
                    case '-':
                        if('[]' !== sm.index && _.has(current,sm.status)){
                            if( _.has(current[sm.status],sm.index )) {
                                current[sm.status]= _.filter(current[sm.status],function(e,idx){
                                    return idx !== sm.index;
                                });
                            }
                        } else {
                            current[sm.status] = current[sm.status] || [];
                            current[sm.status].pop();
                        }
                        break;
                    case '=':
                        current = {};
                        current[sm.status] = [];
                        current[sm.status].push({
                            mark: sm.status,
                            num: (sm.number!=='' ? Math.max(sm.min,Math.min(sm.max,getRelativeChange(0, sm.sign+sm.number))):''),
                            index: statusCount++
                        });
                    break;
                }
                return {
                    statusmarkers: statusOp.composeStatuses(current)
                };
            }
        }


        ////////////////////////////////////////////////////////////
        // moveOp //////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////

        class moveOp {
          static parse(args){
            const identity = {getMods:() => ({})};
            let angle = 0;
            let relativeAngle = true;
            let updateAngle = false;
            let distance = 0;
            let units = '';

            if(args.length>1){
              let match = args.shift().match(regex.moveAngle);
              if(match) {
                angle = transforms.degrees(match[2]);
                relativeAngle = '='!==match[1];
                updateAngle = '!'===match[3];
              } else {
                return identity;
              }
            }

            {
              let match = args.shift().match(regex.moveDistance);
              if(match){
                distance = match[1];
                units = match[2];
              } else {
                return identity;
              }
            }
            return new moveOp(
              angle,
              relativeAngle,
              updateAngle,
              distance,
              units
            );

          }

          constructor(angle,relativeAngle,updateAngle,distance,units){
            this.angle = angle;
            this.relativeAngle = relativeAngle;
            this.updateAngle = updateAngle;
            this.distance = distance;
            this.units = units;
          }

          getMods(token,mods){
            const getValue = (k) => mods.hasOwnProperty(k) ? mods[k] : token.get(k);
            // find angle
            // find postion from current by distance over angle.
            // if current last move start with the token current position, update.
            let angle = 0;
            if(this.relativeAngle){
              angle = parseFloat(getValue('rotation'));
            }
            angle = (transforms.degrees(angle+this.angle)||0);
            let radAngle = (angle-90) * (Math.PI/180);

            let page = getObj('page',token.get('pageid'));
            if(page){
              let distance = numberOp.ConvertUnitsPixel(this.distance,this.units,page);
              let cx = getValue('left');
              let cy = getValue('top');
              let lm = getValue('lastmove');
              if(mods.hasOwnProperty('lastmove')){
                lm +=`,${cx},${cy}`;
              } else {
                lm = `${cx},${cy}`;
              }

              let x = cx+(distance*Math.cos(radAngle));
              let y = cy+(distance*Math.sin(radAngle));
              let props = {
                lastmove: lm,
                top: y,
                left: x
              };
              if(this.updateAngle){
                props.rotation = angle;
              }
              return props;
            }
            return {};
          }
        }

        ////////////////////////////////////////////////////////////
        // IsComputedAttr //////////////////////////////////////////
        ////////////////////////////////////////////////////////////
        const getComputedProxy = ("undefined" !== typeof getComputed)
            ? async (...a) => await getComputed(...a)
            : async ()=>{}
          ;

        class IsComputedAttr {
          static #computedMap = new Map();
          static #sheetMap = new Map();

          static async DoReady() {
            let c = Campaign();
            Object.keys(c?.computedSummary||{}).forEach(k=>{
              IsComputedAttr.#computedMap.set(k,c.computedSummary[k]);
            });

            let cMap = findObjs({type:"character"}).reduce((m,c)=>({...m,[c.get('charactersheetname')]:c.id}),{});
            let promises = Object.keys(cMap).map(async c => {
              let k = IsComputedAttr.#computedMap.keys().next().value;
              if(k) {
                let v = await getComputedProxy({characterId:cMap[c],property:k});
                IsComputedAttr.#sheetMap.set(c, undefined !== v);
              }
            });
            await Promise.all(promises);
          }

          static Check(attrName) {
            return IsComputedAttr.#computedMap.has(attrName);
          }

          static Assignable(attrName) {
            return IsComputedAttr.#computedMap.get(attrName)?.tokenBarValue ?? false;
          }

          static Readonly(attrName) {
            return IsComputedAttr.#computedMap.get(attrName)?.readonly ?? true;
          }

          static IsComputed(sheet,attrName) {
            let sheetName = sheet.get('charactersheetname');

            if(IsComputedAttr.Check(attrName) && IsComputedAttr.#sheetMap.has(sheetName)){
              return IsComputedAttr.#sheetMap.get(sheetName);
            }
            return false;
          }

        }
        on('ready',IsComputedAttr.DoReady);

        ////////////////////////////////////////////////////////////




        let observers = {
                tokenChange: []
        };

        const getActivePages = () => [...new Set([
            Campaign().get('playerpageid'),
            ...Object.values(Campaign().get('playerspecificpages')),
            ...findObjs({
                type: 'player',
                online: true
            })
            .filter((p)=>playerIsGM(p.id))
            .map((p)=>p.get('lastpage'))
          ])
        ];

        const getPageForPlayer = (playerid) => {
            let player = getObj('player',playerid);
            if(playerIsGM(playerid)){
                return player.get('lastpage') || Campaign().get('playerpageid');
            }

            let psp = Campaign().get('playerspecificpages');
            if(psp[playerid]){
                return psp[playerid];
            }

            return Campaign().get('playerpageid');
        };


        const transforms = {
            percentage: (p)=>{
                  let n = parseFloat(p);
                  if(!_.isNaN(n)){
                    if(n > 1){
                      n = Math.min(1,Math.max(n/100,0));
                    } else {
                      n = Math.min(1,Math.max(n,0));
                    }
                  }
                  return n;
                },
            degrees: function(t){
                    let n = parseFloat(t);
                    if(!_.isNaN(n)) {
                        n %= 360;
                    }
                    return n;
                },
            circleSegment: function(t){
                    let n = Math.abs(parseFloat(t));
                    if(!_.isNaN(n)) {
                        n = Math.min(360,Math.max(0,n));
                    }
                    return n;
                },
            orderType: function(t){
                    switch(t){
                        case 'tofront':
                        case 'front':
                        case 'f':
                        case 'top':
                            return 'tofront';

                        case 'toback':
                        case 'back':
                        case 'b':
                        case 'bottom':
                            return 'toback';
                        default:
                            return;
                    }
                },
            keyHash: function(t){
                    return (t && t.toLowerCase().replace(/\s+/,'_')) || undefined;
                }
        };

    const checkGlobalConfig = function(){
        let s=state.TokenMod,
            g=globalconfig && globalconfig.tokenmod;

        if(g && g.lastsaved && g.lastsaved > s.globalconfigCache.lastsaved){
          log('  > Updating from Global Config <  ['+(new Date(g.lastsaved*1000))+']');

          s.playersCanUse_ids = 'playersCanIDs' === g['Players can use --ids'];
          state.TokenMod.globalconfigCache=globalconfig.tokenmod;
        }
    };

  const assureHelpHandout = (create = false) => {
    if(state.TheAaron && state.TheAaron.config && (false === state.TheAaron.config.makeHelpHandouts) ){
      return;
    }
    const helpIcon = "https://s3.amazonaws.com/files.d20.io/images/295769190/Abc99DVcre9JA2tKrVDCvA/thumb.png?1658515304";

    // find handout
    let props = {type:'handout', name:`Help: ${scriptName}`};
    let hh = findObjs(props)[0];
    if(!hh) {
      hh = createObj('handout',Object.assign(props, {inplayerjournals: "all", avatar: helpIcon}));
      create = true;
    }
    if(create || version !== state[scriptName].lastHelpVersion){
      hh.set({
        notes: helpParts.helpDoc({who:'handout',playerid:'handout'})
      });
      state[scriptName].lastHelpVersion = version;
      log('  > Updating Help Handout to v'+version+' <');
    }
  };

    const checkInstall = function() {
        log('-=> TokenMod v'+version+' <=-  ['+(new Date(lastUpdate*1000))+']');

        if( ! _.has(state,'TokenMod') || state.TokenMod.version !== schemaVersion) {
            log('  > Updating Schema to v'+schemaVersion+' <');
            switch(state.TokenMod && state.TokenMod.version) {

                case 0.1:
                case 0.2:
                  delete state.TokenMod.globalConfigCache;
                  state.TokenMod.globalconfigCache = {lastsaved:0};
                  /* falls through */

                case 0.3:
                  state.TokenMod.lastHelpVersion = version;
                  /* falls through */

                case 'UpdateSchemaVersion':
                    state.TokenMod.version = schemaVersion;
                    break;

                default:
                    state.TokenMod = {
                        version: schemaVersion,
                        globalconfigCache: {lastsaved:0},
                        playersCanUse_ids: false,
                        lastHelpVersion: version
                    };
                    break;
            }
        }
        checkGlobalConfig();
        StatusMarkers.init();
        assureHelpHandout();
    };

    const observeTokenChange = function(handler){
        if(handler && _.isFunction(handler)){
            observers.tokenChange.push(handler);
        }
    };

    const notifyObservers = function(event,obj,prev){
        _.each(observers[event],function(handler){
          try {
            handler(obj,prev);
          } catch(e) {
            log(`TokenMod: An observer threw and exception in handler: ${handler}`);
          }
        });
    };

    const getPlayerIDs = (function(){
        let age=0,
            cache=[],
        checkCache=function(){
            if(_.now()-60000>age){
                cache=_.chain(findObjs({type:'player'}))
                    .map((p)=>({
                        id: p.id,
                        userid: p.get('d20userid'),
                        keyHash: transforms.keyHash(p.get('displayname'))
                    }))
                    .value();
            }
        },
        findPlayer = function(data){
            checkCache();
            let pids=_.reduce(cache,(m,p)=>{
                if(p.id===data || p.userid===data || (-1 !== p.keyHash.indexOf(transforms.keyHash(data)))){
                    m.push(p.id);
                }
                return m;
            },[]);
            if(!pids.length){
                let obj=filterObjs((o)=>(o.id===data && _.contains(['character','graphic'],o.get('type'))))[0];
                if(obj){
                    let charObj = ('graphic'===obj.get('type') && getObj('character',obj.get('represents'))),
                        cb = (charObj ? charObj : obj).get('controlledby');
                    pids = (cb.length ? cb.split(/,/) : []);
                }
            }
            return pids;
        };

        return function(datum){
            return 'all'===datum ? ['all'] : findPlayer(datum);
        };
    }());

    const HE = (() => {
        const esRE = (s) => s.replace(/(\\|\/|\[|\]|\(|\)|\{|\}|\?|\+|\*|\||\.|\^|\$)/g,'\\$1');
        const e = (s) => `&${s};`;
        const entities = {
            '<' : e('lt'),
            '>' : e('gt'),
            "'" : e('#39'),
            '@' : e('#64'),
            '{' : e('#123'),
            '|' : e('#124'),
            '}' : e('#125'),
            '[' : e('#91'),
            ']' : e('#93'),
            '"' : e('quot')
        };
        const re = new RegExp(`(${Object.keys(entities).map(esRE).join('|')})`,'g');
        return (s) => s.replace(re, (c) => (entities[c] || c) );
    })();

    const ch = function (c) {
        let entities = {
            '<' : 'lt',
            '>' : 'gt',
            "'" : '#39',
            '@' : '#64',
            '{' : '#123',
            '|' : '#124',
            '}' : '#125',
            '[' : '#91',
            ']' : '#93',
            '"' : 'quot',
            '*' : 'ast',
            '/' : 'sol',
            ' ' : 'nbsp'
        };

        if(_.has(entities,c) ){
            return ('&'+entities[c]+';');
        }
        return '';
    };

    const getConfigOption_PlayersCanIDs = function() {
        let text = ( state.TokenMod.playersCanUse_ids ?
                '<span style="color: red; font-weight:bold; padding: 0px 4px;">ON</span>' :
                '<span style="color: #999999; font-weight:bold; padding: 0px 4px;">OFF</span>'
            );
        return '<div>'+
            'Players can IDs is currently '+
                text+
            '<a href="!token-mod --config players-can-ids">'+
                'Toggle'+
            '</a>'+
        '</div>';

    };

    const _h = {
        outer: (...o) => `<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">${o.join(' ')}</div>`,
        title: (t,v) => `<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">${t} v${v}</div>`,
        subhead: (...o) => `<b>${o.join(' ')}</b>`,
        minorhead: (...o) => `<u>${o.join(' ')}</u>`,
        optional: (...o) => `${ch('[')}${o.join(` ${ch('|')} `)}${ch(']')}`,
        required: (...o) => `${ch('<')}${o.join(` ${ch('|')} `)}${ch('>')}`,
        header: (...o) => `<div style="padding-left:10px;margin-bottom:3px;">${o.join(' ')}</div>`,
        section: (s,...o) => `${_h.subhead(s)}${_h.inset(...o)}`,
        paragraph: (...o) => `<p>${o.join(' ')}</p>`,
        experimental: () => `<div style="display:inline-block;padding: .1em 1em; border: 1px solid #993333; border-radius:.5em;background-color:#cccccc;color:#ff0000;">Experimental</div>`,
        items: (o) => o.map(t=>`<li>${t}</li>`).join(''),
        ol: (...o) => `<ol>${_h.items(o)}</ol>`,
        ul: (...o) => `<ul>${_h.items(o)}</ul>`,
        grid: (...o) => `<div style="padding: 12px 0;">${o.join('')}<div style="clear:both;"></div></div>`, 
        cell: (o) =>  `<div style="width: 200px; padding: 0 3px; float: left;">${o}</div>`,
        statusCell: (o) =>  {
            let text = `${o.getName()}${o.getName()!==o.getTag()?` [${_h.code(o.getTag())}]`:''}`;
            return `<div style="width: auto; padding: .2em; margin: .1em .25em; border: 1px solid #ccc; border-radius: .25em; background-color: #eee; line-height:1.5em; height: auto;float:left;">${o.getHTML()}${text}</div>`;
        },
        helpHandoutLink: ()=>{
          let props = {type:'handout', name:`Help: ${scriptName}`};
          let hh = findObjs(props)[0];
          return `<a style="color: #07c; text-decoration: underline;" href="http://journal.roll20.net/handout/${hh.id}">Help: ${scriptName}</a>`;
        },
        inset: (...o) => `<div style="padding-left: 10px;padding-right:20px">${o.join(' ')}</div>`,
        join: (...o) => o.join(' '),
        pre: (...o) =>`<div style="border:1px solid #e1e1e8;border-radius:4px;padding:8.5px;margin-bottom:9px;font-size:12px;white-space:normal;word-break:normal;word-wrap:normal;background-color:#f7f7f9;font-family:monospace;overflow:auto;">${o.join(' ')}</div>`,
        preformatted: (...o) =>_h.pre(o.join('<br>').replace(/\s/g,ch(' '))),
        code: (...o) => `<code>${o.join(' ')}</code>`,
        attr: {
            bare: (o)=>`${ch('@')}${ch('{')}${o}${ch('}')}`,
            selected: (o)=>`${ch('@')}${ch('{')}selected${ch('|')}${o}${ch('}')}`,
            target: (o)=>`${ch('@')}${ch('{')}target${ch('|')}${o}${ch('}')}`,
            char: (o,c)=>`${ch('@')}${ch('{')}${c||'CHARACTER NAME'}${ch('|')}${o}${ch('}')}`
        },
        bold: (...o) => `<b>${o.join(' ')}</b>`,
        italic: (...o) => `<i>${o.join(' ')}</i>`,
        font: {
            command: (...o)=>`<b><span style="font-family:serif;">${o.join(' ')}</span></b>`
        }
    };


    const helpParts = {
        commands: (/* context */) => _h.join(
                    _h.subhead('Commands'),
                    _h.inset(
                        _h.font.command(
                            `!token-mod `,
                            _h.required(
                                `--help`,
                                `--rebuild-help`,
                                `--help-statusmarkers`,
                                `--ignore-selected`,
                                `--current-page`,
                                `--active-pages`,
                                `--api-as`,
                                `--config`,
                                `--on`,
                                `--off`,
                                `--flip`,
                                `--set`,
                                `--move`,
                                `--report`,
                                `--order`
                            ),
                            _h.required(`parameter`),
                            _h.optional(`${_h.required(`parameter`)} ...`),
                            `...`,
                            _h.optional(
                                `--ids`,
                                _h.required(`token_id`),
                                _h.optional(`${_h.required(`token_id`)} ...`)
                            )
                        ),
                        _h.paragraph('This command takes a list of modifications and applies them to the selected tokens (or tokens specified with --ids by a GM or Player depending on configuration).'),
                        _h.paragraph(`${_h.bold('Note:')} Each --option can be specified multiple times and in any order.`),
                        _h.paragraph(`${_h.bold('Note:')} If you are using multiple ${_h.attr.target('token_id')} calls in a macro, and need to adjust fewer than the supplied number of token ids, simply select the same token several times.  The duplicates will be removed.`),
                        _h.paragraph(`${_h.bold('Note:')} Anywhere you use ${_h.code('|')}, you can use ${_h.code('#')} instead.  Sometimes this makes macros easier.`),
                        _h.paragraph(`${_h.bold('Note:')} You can use the ${_h.code('{{')} and ${_h.code('}}')} to span multiple lines with your command for easier clarity and editing:`),
                        _h.inset(
                            _h.preformatted(
                                '!token-mod {{',
                                '  --on',
                                '    flipv',
                                '    fliph',
                                '  --set',
                                '    rotation|180',
                                `    bar1|${ch('[')+ch('[')}8d8+8${ch(']')+ch(']')}`,
                                '    light_radius|60',
                                '    light_dimradius|30',
                                '    name|"My bright token"',
                                '}}'
                            )
                        ),
                        _h.ul(
                            `${_h.bold('--help')} -- Displays this help`,
                            `${_h.bold('--rebuild-help')} -- Recreated the help handout in the journal.  Useful for showing updated custom status markers.`,
                            `${_h.bold('--help-statusmarkers')} -- Output just the list of known status markers into the chat.`,
                            `${_h.bold('--ignore-selected')} -- Prevents modifications to the selected tokens (only modifies tokens passed with --ids).`,
                            `${_h.bold('--current-page')} -- Only modifies tokens on the calling player${ch("'")}s current page.  This is particularly useful when passing character_ids to ${_h.italic('--ids')}.`,
                            `${_h.bold('--active-pages')} -- Only modifies tokens on pages where there is a player or the GM.  This is particularly useful when passing character_ids to ${_h.italic('--ids')}.`,
                            `${_h.bold('--api-as')} ${_h.required('playerid')} -- Sets the player id to use as the player when the API is calling the script.`,
                            `${_h.bold('--config')} -- Sets Config options. `,
                            `${_h.bold('--on')} -- Turns on any of the specified parameters (See ${_h.bold('Boolean Arguments')} below).`,
                            `${_h.bold('--off')} -- Turns off any of the specified parameters (See ${_h.bold('Boolean Arguments')} below).`,
                            `${_h.bold('--flip')} -- Flips the value of any of the specified parameters (See ${_h.bold('Boolean Arguments')} below).`,
                            `${_h.bold('--set')} -- Each parameter is treated as a key and value, divided by a ${_h.code('|')} character.  Sets the key to the value.  If the value has spaces, you must enclose it ${_h.code(ch("'"))} or ${_h.code(ch('"'))}. See below for specific value handling logic.`,
                            `${_h.bold('--move')} -- Moves each token in a direction and distance based on its facing.`,
                            `${_h.bold('--order')} -- Changes the ordering of tokens.  Specify one of ${_h.code('tofront')}, ${_h.code('front')}, ${_h.code('f')}, ${_h.code('top')} to bring something to the front or ${_h.code('toback')}, ${_h.code('back')}, ${_h.code('b')}, ${_h.code('bottom')} to push it to the back.`,
                            `${_h.bold('--report')} -- Displays a report of what changed for each token. ${_h.experimental()}`,
                            `${_h.bold('--ids')} -- Each parameter is a Token ID, usually supplied with something like ${_h.attr.target(`Target 1${ch('|')}token_id`)}. By default, only a GM can use this argument.  You can enable players to use it as well with ${_h.bold('--config players-can-ids|on')}.`
                        )
                    ),
                    // SECTION: --ids, --ignore-selected, etc...
                    _h.section('Token Specification',
                        _h.paragraph(`By default, any selected token is adjusted when the command is executed.  Note that there is a bug where using ${_h.attr.target('')} commands, they may cause them to get skipped.`),
                        _h.paragraph(`${_h.italic('--ids')} takes token ids to operate on, separated by spaces.`),
                        _h.inset(_h.pre( `!token-mod --ids -Jbz-mlHr1UXlfWnGaLh -JbjeTZycgyo0JqtFj-r -JbjYq5lqfXyPE89CJVs --on showname showplayers_name`)),
                        _h.paragraph(`Usually, you will want to specify these with the ${_h.attr.target('')} syntax:`),
                        _h.inset(_h.pre( `!token-mod --ids ${_h.attr.target('1|token_id')} ${_h.attr.target('2|token_id')} ${_h.attr.target('3|token_id')} --on showname showplayers_name`)),
                        _h.paragraph(`${_h.italic('--ignore-selected')} can be used when you want to be sure selected tokens are not affected.  This is particularly useful when specifying the id of a known token, such as moving a graphic from the gm layer to the objects layer, or coloring an object on the map.`)
                    )
                ),
        move: (/* context */) => _h.join(
                _h.section('Move',
                  _h.paragraph(`Use ${_h.code('--move')} to supply a sequence of move operations to apply to a token.  By default, moves are relative to the current facing of the token as defined by the rotation handle (generally, the "up" direction when the token is unrotated).  Each operation can be either a distance, or a rotation followed by a distance, separated by a pipe ${_h.code('|')}.  Distances can use the unit specifiers (${_h.code('g')},${_h.code('u')},${_h.code('ft')},etc -- see the ${_h.bold('Numbers')} section for more) and may be positive or negative.  Rotations can be positive or negative.  They can be prefaced by a ${_h.code('=')} to ignore the current rotation of the character and instead move based on up being 0.  They can further be followed by a ${_h.code('!')} to also rotate the token to the new direction.`),
                  _h.paragraph(`Moving 3 grid spaces in the current facing.`),
                  _h.inset(
                    _h.preformatted(
                      '!token-mod --move 3g'
                    )
                  ),
                  _h.paragraph(`Moving 3 grid spaces at 45 degrees to the current facing.`),
                  _h.inset(
                    _h.preformatted(
                      '!token-mod --move 45|3g'
                    )
                  ),
                  _h.paragraph(`Moving 2 units to the right, ignoring the current facing.`),
                  _h.inset(
                    _h.preformatted(
                      '!token-mod --move =90|2u'
                    )
                  ),
                  _h.paragraph(`Moving 10ft in the direction 90 degrees to the left of the current facing, and updating the facing to that new direction.`),
                  _h.inset(
                    _h.preformatted(
                      '!token-mod --move -90!|10ft'
                    )
                  ),
                  _h.paragraph(`Moving forward 2 grid spaces, then right 10ft, then 3 units at 45 degrees to the current facing and updating to that face that direction. `),
                  _h.inset(
                    _h.preformatted(
                      '!token-mod --move 2g 90|10ft =45!|3u'
                    )
                  )
                )
              ),

        booleans: (/* context */) => _h.join(
                // SECTION: --on, --off, --flip, etc...
                _h.section('Boolean Arguments',
                    _h.paragraph(`${_h.italic('--on')}, ${_h.italic('--off')} and ${_h.italic('--flip')} options only work on properties of a token that are either ${_h.code('true')} or ${_h.code('false')}, usually represented as checkboxes in the User Interface.  Specified properties will only be changed once, priority is given to arguments to ${_h.italic('--on')} first, then ${_h.italic('--off')} and finally to ${_h.italic('--flip')}.`),
                    _h.inset(
                        _h.pre(`!token-mod --on showname light_hassight --off isdrawing --flip flipv fliph`)
                    ),
                    _h.minorhead('Available Boolean Properties:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('showname'),
                            _h.cell('show_tooltip'),
                            _h.cell('showplayers_name'),
                            _h.cell('showplayers_bar1'),
                            _h.cell('showplayers_bar2'),
                            _h.cell('showplayers_bar3'),
                            _h.cell('showplayers_aura1'),
                            _h.cell('showplayers_aura2'),
                            _h.cell('playersedit_name'),
                            _h.cell('playersedit_bar1'),
                            _h.cell('playersedit_bar2'),
                            _h.cell('playersedit_bar3'),
                            _h.cell('playersedit_aura1'),
                            _h.cell('playersedit_aura2'),
                            _h.cell('light_otherplayers'),
                            _h.cell('light_hassight'),
                            _h.cell('isdrawing'),
                            _h.cell('disableSnapping'),
                            _h.cell('disableTokenMenu'),
                            _h.cell('flipv'),
                            _h.cell('fliph'),
                            _h.cell('aura1_square'),
                            _h.cell('aura2_square'),

                            _h.cell("has_bright_light_vision"),
                            _h.cell("has_limit_field_of_vision"),
                            _h.cell("has_limit_field_of_night_vision"),
                            _h.cell("has_directional_bright_light"),
                            _h.cell("has_directional_dim_light"),
                            _h.cell("bright_vision"),
                            _h.cell("has_night_vision"),
                            _h.cell("night_vision"),
                            _h.cell("emits_bright_light"),
                            _h.cell("emits_bright"),
                            _h.cell("emits_low_light"),
                            _h.cell("emits_low"),
                            _h.cell('lockMovement')
                        )
                    ),
                    _h.paragraph( `Any of the booleans can be set with the ${_h.italic('--set')} command by passing a true or false as the value`),
                    _h.inset(
                        _h.pre('!token-mod --set showname|yes isdrawing|no')
                    ),

                    _h.paragraph(`The following are considered true values: ${_h.code('1')}, ${_h.code('on')}, ${_h.code('yes')}, ${_h.code('true')}, ${_h.code('sure')}, ${_h.code('yup')}`),

                    _h.subhead("Probabilistic Booleans"),
                    _h.paragraph(`TokenMod accepts the following probabilistic values which are true some of the time and false otherwise: ${_h.code('couldbe')} (true 1 in 8 times) , ${_h.code('sometimes')} (true 1 in 4 times) , ${_h.code('maybe')} (true 1 in 2 times), ${_h.code('probably')} (true 3 in 4 times), ${_h.code('likely')} (true 7 in 8 times)`),

                    _h.paragraph(`Anything else is considered false.`),

                    _h.subhead(`${_h.code('isdrawing')} split properties: ${_h.code('disableSnapping')} and ${_h.code('disableTokenMenu')} (Jumpgate)`),
                    _h.paragraph( `On Jumpgate, these two properties control the individual facets of what was handled by ${_h.code('isdrawing')}.  You can set ${_h.code('disableSnapping')} to true to prevent a graphic from snapping to the page's grid lines while still retaining the bubbles and token menu:`),
                    _h.inset(
                        _h.pre('!token-mod --set disableSnapping|yes')
                    ),
                    _h.paragraph( `Setting ${_h.code('disableTokenmenu')} to true will hide the token menu while still snapping the graphic to the grid:`),
                    _h.inset(
                        _h.pre('!token-mod --set disableTokenMenu|yes')
                    ),
                    _h.paragraph( `Setting ${_h.code('isdrawing')} on Jumpgate will set both ${_h.code('disableSnapping')} and ${_h.code('disableTokenMenu')}.  These two commands have the same effect:`),
                    _h.inset(
                        _h.pre('!token-mod --set isdrawing|yes'),
                        _h.pre('!token-mod --set disableSnapping|yes disableTokenMenu|yes')
                    ),
                    _h.paragraph( `If not on Jumpgate, setting either ${_h.code('disableSnapping')} or ${_h.code('disableTokenMenu')} will be the same as setting ${_h.code('isdrawing')}. These will all be the same if not on Jumpgate:`),
                    _h.inset(
                        _h.pre('!token-mod --set isdrawing|yes'),
                        _h.pre('!token-mod --set disableTokenMenu|yes'),
                        _h.pre('!token-mod --set disableSnapping|yes')
                    ),
                    _h.paragraph( `If setting both, be sure to set the one that is more important to you second as it will set ${_h.code('isdrawing')}. In this example, if not on Jumpgate, you'll end up with snapping and token menus:`),
                    _h.inset(
                        _h.pre('!token-mod --set disableSnapping|no disableTokenMenu|yes')
                    ),

                    _h.subhead("Updated Dynamic Lighting"),
                    _h.paragraph(`${_h.code("has_bright_light_vision")} is the UDL version of ${_h.bold("light_hassight")}. It controls if a token can see at all, and must be turned on for a token to use UDL.  You can also use the alias ${_h.code("bright_vision")}.`),
                    _h.paragraph(`${_h.code("has_night_vision")} controls if a token can see without emitted light around it.  This was handled with ${_h.bold("light_otherplayers")} in the old light system.  In the new light system, you don't need to be emitting light to see if you have night vision turned on.  You can also use the alias ${_h.code("night_vision")}.`),
                    _h.paragraph(`${_h.code("emits_bright_light")} determines if the configured ${_h.bold("bright_light_distance")} is active or not.  There wasn't a concept like this in the old system, it would be synonymous with setting the ${_h.bold("light_radius")} to 0, but now it's not necessary.  You can also use the alias ${_h.code("emits_bright")}.`),
                    _h.paragraph(`${_h.code("emits_low_light")} determines if the configured ${_h.bold("low_light_distance")} is active or not.  There wasn't a concept like this in the old system, it would be synonymous with setting the ${_h.bold("light_dimradius")} to 0 (kind of), but now it's not necessary.  You can also use the alias ${_h.code("emits_low")}.`)
                )
            ),

        setPercentage: (/* context*/) => _h.join(
                    _h.subhead('Percentage'),
                    _h.inset(
                        _h.paragraph(`Percentage values can be a floating point number between 0 and 1.0, such as ${_h.code('0.35')}, or an integer number between 1 and 100.`),
                        _h.minorhead('Available Percentage Properties:'),
                        _h.inset(
                            _h.grid(
                                _h.cell('dim_light_opacity')
                            )
                        ),
                        _h.paragraph(`Setting the low light opacity to 30%:`),
                        _h.inset(
                            _h.pre( '!token-mod --set dim_light_opacity|30' )
                        ),
                        _h.inset(
                            _h.pre( '!token-mod --set dim_light_opacity|0.3' )
                        )
                    )
                ),

        setNightVisionEffect: (/* context*/) => _h.join(
                    _h.subhead('Night Vision Effect'),
                    _h.inset(
                        _h.paragraph(`Night Vision Effect specifies how the region of night vision around a token looks.  There are two effects that can be turned on: ${_h.code('dimming')} and ${_h.code('nocturnal')}. You can disable Night Vision Effects using ${_h.code('off')}, ${_h.code('none')}, or leave the field blank.  Any other value is ignored.`),
                        _h.minorhead('Available Night Vision Effect Properties:'),
                        _h.inset(
                            _h.grid(
                                _h.cell('night_vision_effect')
                            )
                        ),
                        _h.paragraph(`Enable the nocturnal Night Vision Effect on a token:`),
                        _h.inset(
                            _h.pre( '!token-mod --set night_vision_effect|nocturnal' )
                        ),
                        _h.paragraph(`Enable the dimming Night Vision Effect on a token, with dimming starting at 5ft from the token:`),
                        _h.inset(
                            _h.pre( '!token-mod --set night_vision_effect|dimming' )
                        ),
                        _h.paragraph(`Dimming can take an additional argument to set the distance from the token to begin dimming.  The default is 5ft if not specified. Distances are provided by appending a another ${_h.code('|')} character and adding a number followed by either a unit or a ${_h.code('%')}:`),
                        _h.inset(
                            _h.pre( '!token-mod --set night_vision_effect|dimming|5ft' ),
                            _h.pre( '!token-mod --set night_vision_effect|dimming|1u' )
                        ),
                        _h.paragraph(`Using the ${_h.code('%')} allows you to specify the distance as a percentage of the Night Vision Distance.  Numbers less than 1 are treated as a decimal percentage.  Both of the following are the same:`),
                        _h.inset(
                            _h.pre( '!token-mod --set night_vision_effect|dimming|20%' ),
                            _h.pre( '!token-mod --set night_vision_effect|dimming|0.2%' )
                        ),
                        _h.paragraph(`You can also use operators to make relative changes.  Operators are ${_h.code('+')}, ${_h.code('-')}, ${_h.code('*')}, and ${_h.code('/')}`),
                        _h.inset(
                            _h.pre( '!token-mod --set night_vision_effect|dimming|+10%' ),
                            _h.pre( '!token-mod --set night_vision_effect|dimming|-5ft' ),
                            _h.pre( '!token-mod --set night_vision_effect|dimming|/2' ),
                            _h.pre( '!token-mod --set night_vision_effect|dimming|*10' )
                        ),
                        _h.paragraph(`Disable any Night Vision Effects on a token:`),
                        _h.inset(
                            _h.pre( '!token-mod --set night_vision_effect|off' )
                        ),
                        _h.inset(
                            _h.pre( '!token-mod --set night_vision_effect|none' )
                        ),
                        _h.inset(
                            _h.pre( '!token-mod --set night_vision_effect|' )
                        )
                      )
                    ),

        setCompactBar: (/* context*/) => _h.join(
                    _h.subhead('Compact Bar'),
                    _h.inset(
                        _h.paragraph(`Compact Bar specifes how the bar looks.  A compact bar is much smaller than the normal presentation and does not have numbers overlaying it.  To enable Compact Bar for a token, use ${_h.code('compact')} or ${_h.code('on')}. You can disable Compact Bar using ${_h.code('off')}, ${_h.code('none')}, or leave the field blank.  Any other value is ignored.`),
                        _h.minorhead('Available Compact Bar Properties:'),
                        _h.inset(
                            _h.grid(
                                _h.cell('compact_bar')
                            )
                        ),
                        _h.paragraph(`Enable Compact Bar on a token:`),
                        _h.inset(
                            _h.pre( '!token-mod --set compact_bar|compact' )
                        ),
                        _h.inset(
                            _h.pre( '!token-mod --set compact_bar|on' )
                        ),
                        _h.paragraph(`Disable Compact Bar on a token:`),
                        _h.inset(
                            _h.pre( '!token-mod --set compact_bar|off' )
                        ),
                        _h.inset(
                            _h.pre( '!token-mod --set compact_bar|none' )
                        ),
                        _h.inset(
                            _h.pre( '!token-mod --set compact_bar|' )
                        )
                      )
                    ),
        setBarPermission: (/* context*/) => _h.join(
                    _h.subhead('Bar Permission'),
                    _h.inset(
                        _h.paragraph(`Bar Permission specifies who sees numbers overlaid on the bar.  To not show any numbers, you can set it to ${_h.code('hidden')} or ${_h.code('none')}.  To only show it to editors (the default), you can set it to ${_h.code('editor')} or leave the field blank.  To make the numbers visible to everyone, you can set it to ${_h.code('everyone')} or ${_h.code('all')}.  Any other value is ignored.`),
                        _h.minorhead('Available Bar Permission Properties:'),
                        _h.inset(
                            _h.grid(
                                _h.cell('bar1_num_permission'),
                                _h.cell('bar2_num_permission'),
                                _h.cell('bar3_num_permission')
                            )
                        ),
                        _h.paragraph(`Hide the numbers from everyone:`),
                        _h.inset(
                            _h.pre( '!token-mod --set bar1_num_permission|hidden' )
                        ),
                        _h.inset(
                            _h.pre( '!token-mod --set bar2_num_permission|none' )
                        ),
                        _h.paragraph(`Showing only the editors the numbers:`),
                        _h.inset(
                            _h.pre( '!token-mod --set bar3_num_permission|editor' )
                        ),
                        _h.inset(
                            _h.pre( '!token-mod --set bar2_num_permission|' )
                        ),
                        _h.paragraph(`Making the numbers visible to everyone:`),
                        _h.inset(
                            _h.pre( '!token-mod --set bar1_num_permission|everyone' )
                        ),
                        _h.inset(
                            _h.pre( '!token-mod --set bar3_num_permission|all' )
                        )
                      )
                    ),

        setBarLocation: (/* context*/) => _h.join(
                    _h.subhead('Bar Location'),
                    _h.inset(
                        _h.paragraph(`Bar Location specifes where the bar on a token appears.  There are 4 options: ${_h.code('above')}, ${_h.code('overlap_top')}, ${_h.code('overlap_bottom')}, and ${_h.code('below')}. You can also use ${_h.code('off')}, ${_h.code('none')}, or leave the field blank as an alias for ${_h.code('above')}.  Any other value is ignored.`),
                        _h.minorhead('Available Bar Location Properties:'),
                        _h.inset(
                            _h.grid(
                                _h.cell('bar_location')
                            )
                        ),
                        _h.paragraph(`Setting the bar location to below the token:`),
                        _h.inset(
                            _h.pre( '!token-mod --set bar_location|below' )
                        ),
                        _h.paragraph(`Setting the bar location to overlap the top of the token:`),
                        _h.inset(
                            _h.pre( '!token-mod --set bar_location|overlap_top' )
                        ),
                        _h.paragraph(`Setting the bar location to overlap the bottom of the token:`),
                        _h.inset(
                            _h.pre( '!token-mod --set bar_location|overlap_bottom' )
                        ),
                        _h.paragraph(`Setting the bar location to above the token:`),
                        _h.inset(
                            _h.pre( '!token-mod --set bar_location|above' )
                        ),
                        _h.inset(
                            _h.pre( '!token-mod --set dim_light_opacity|none' )
                        ),
                        _h.inset(
                            _h.pre( '!token-mod --set dim_light_opacity|off' )
                        ),
                        _h.inset(
                            _h.pre( '!token-mod --set dim_light_opacity|' )
                        )
                    )
                ),

        setNumbers: (/* context*/) => _h.join(
                    _h.subhead('Numbers'),
                    _h.inset(
                        _h.paragraph('Number values can be any floating point number (though most fields will drop the fractional part). Numbers must be given a numeric value.  They cannot be blank or a non-numeric string.'),
                        _h.minorhead('Available Numbers Properties:'),
                        _h.inset(
                            _h.grid(
                                _h.cell('left'),
                                _h.cell('top'),
                                _h.cell('width'),
                                _h.cell('height'),
                                _h.cell('scale'),
                                _h.cell('light_sensitivity_multiplier')
                            )
                        ),
                        _h.paragraph( `It${ch("'")}s probably a good idea not to set the location of a token off screen, or the width or height to 0.`),
                        _h.paragraph( `Placing a token in the top left corner of the map and making it take up a 2x2 grid section:`),
                        _h.inset(
                            _h.pre( '!token-mod --set top|0 left|0 width|140 height|140' )
                        ),
                        _h.paragraph(`You can also apply relative change using ${_h.code('+')}, ${_h.code('-')}, ${_h.code(ch('*'))}, and ${_h.code(ch('/'))}. This will move each token one unit down, 2 units left, then make it 5 times as wide and half as tall.`),
                        _h.inset(
                            _h.pre( `!token-mod --set top|+70 left|-140 width|${ch('*')}5 height|/2` )
                        ),
                        _h.paragraph(`You can use ${_h.code('=')} to explicity set a value.  This is the default behavior, but you might need to use it to move something to a location off the edge using a negative number but not a relative number:`),
                        _h.inset(
                            _h.pre( '!token-mod --set top|=-140' )
                        ),
                        _h.paragraph( `${_h.code('scale')} is a pseudo field which adjusts both ${_h.code('width')} and ${_h.code('height')} with the same operation.  This will scale a token to twice it's current size.`),
                        _h.inset(
                            _h.pre( '!token-mod --set scale|*2' )
                        ),
                        _h.paragraph(`You can follow a number by one of ${_h.code('u')}, ${_h.code('g')}, or ${_h.code('s')} to adjust the scale that the number is applied in.`),
                        _h.paragraph(`Use ${_h.code('u')} to use a number based on Roll20 Units, which are 70 pixels at 100% zoom.  This will set a graphic to 280x140.`),
                        _h.inset(
                            _h.pre( '!token-mod --set width|4u height|2u' )
                        ),
                        _h.paragraph(`Use ${_h.code('g')} to use a number based on the current grid size.  This will set a token to the middle of the 8th column, 4rd row grid. (.5 offset for half the center)`),
                        _h.inset(
                            _h.pre( '!token-mod --set left|7.5g top|3.5g' )
                        ),
                        _h.paragraph(`Use ${_h.code('s')} to use a number based on the current unit if measure. (ft, m, mi, etc)  This will set a token to be 25ft by 35ft (assuming ft are the unit of measure)`),
                        _h.inset(
                            _h.pre( '!token-mod --set width|25s height|35s' )
                        ),
                        _h.paragraph(`Currently, you can also use any of the default units of measure as alternatives to ${_h.code('s')}: ${_h.code('ft')}, ${_h.code('m')}, ${_h.code('km')}, ${_h.code('mi')}, ${_h.code('in')}, ${_h.code('cm')}, ${_h.code('un')}, ${_h.code('hex')}, ${_h.code('sq')}`),
                        _h.inset(
                            _h.pre( '!token-mod --set width|25ft height|35ft' )
                        )
                    )
                ),

        setNumbersOrBlank: ( /* context */) => _h.join(
                _h.subhead('Numbers or Blank'),
                _h.inset(
                    _h.paragraph('Just like the Numbers fields, except you can set them to blank as well.'),
                    _h.minorhead('Available Numbers or Blank Properties:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('light_radius'),
                            _h.cell('light_dimradius'),
                            _h.cell('light_multiplier'),
                            _h.cell('aura1_radius'),
                            _h.cell('aura2_radius'),
                            _h.cell('adv_fow_view_distance'),
                            _h.cell("night_vision_distance"),
                            _h.cell("night_distance"),
                            _h.cell("bright_light_distance"),
                            _h.cell("bright_distance"),
                            _h.cell("low_light_distance"),
                            _h.cell("low_distance")
                        )
                    ),
                    _h.paragraph(`Here is setting a standard DnD 5e torch, turning off aura1 and setting aura2 to 30. Note that the ${_h.code('|')} is still required for setting a blank value, such as aura1_radius below.`),
                    _h.inset(
                        _h.pre('!token-mod --set light_radius|40 light_dimradius|20 aura1_radius| aura2_radius|30')
                    ),
                    _h.paragraph(`Just as above, you can use ${_h.code('=')}, ${_h.code('+')}, ${_h.code('-')}, ${_h.code(ch('*'))}, and ${_h.code(ch('/'))} when setting these values.`),
                    _h.paragraph(`Here is setting a standard DnD 5e torch, with advanced fog of war revealed for 30.`),
                    _h.inset(
                        _h.pre('!token-mod --set light_radius|40 light_dimradius|20 adv_fow_view_distance|30')
                    ),
                    _h.paragraph(`Sometimes it is convenient to have a way to set a radius if there is none, but remove it if it is set.  This allows toggling a known radius on and off, or setting a multiplier if there isn't one, but clearing it if there is.  You can preface a number with ${_h.code('!')} to toggle it${ch("'")}s value on and off.  Here is an example that will add or remove a 20${ch("'")} radius aura 1 from a token:`),
                    _h.inset(
                        _h.pre('!token-mod --set aura1_radius|!20')
                    ),
                    _h.paragraph(`These also support the relative scale operations that ${_h.bold('Numbers')} support: ${_h.code('u')}, ${_h.code('g')}, ${_h.code('s')}`),
                    _h.inset(
                        _h.pre('!token-mod --set aura1_radius|3g aura2_radius|10u light_radius|25s')
                    ),
                    _h.paragraph(`${_h.bold('Note:')} ${_h.code('light_multiplier')} ignores these modifiers.  Additionally, the rest are already in the scale of measuring distance (${_h.code('s')}) so there is no difference between ${_h.code('25s')}, ${_h.code('25ft')}, and ${_h.code('25')}.`),
                    _h.subhead(`Updated Dynamic Lighting`),
                    _h.paragraph(`${_h.code("night_vision_distance")} lets you set how far away a token can see with no light.  You need to have ${_h.bold("has_night_vision")} turned on for this to take effect.  You can also use the alias ${_h.code("night_distance")}.`),
                    _h.paragraph(`${_h.code("bright_light_distance")} lets you set how far bright light is emitted from the token.  You need to have ${_h.bold("has_bright_light_vision")} turned on for this to take effect.  You can also use the alias ${_h.code("bright_distance")}.`),
                    _h.paragraph(`${_h.code("low_light_distance")} lets you set how far low light is emitted from the token.  You need to have ${_h.bold("has_bright_light_vision")} turned on for this to take effect.  You can also use the alias ${_h.code("low_distance")}.`)
                )
            ),

        setDegrees: ( /* context */) => _h.join(
                _h.subhead('Degrees'),
                _h.inset(
                    _h.paragraph('Any positive or negative number.  Values will be automatically adjusted to be in the 0-360 range, so if you add 120 to 270, it will wrap around to 90.'),
                    _h.minorhead('Available Degrees Properties:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('rotation'),
                            _h.cell("limit_field_of_vision_center"),
                            _h.cell("limit_field_of_night_vision_center"),
                            _h.cell("directional_bright_light_center"),
                            _h.cell("directional_dim_light_center")
                        )
                    ),
                    _h.paragraph('Rotating a token by 180 degrees.'),
                    _h.inset(
                        _h.pre('!token-mod --set rotation|+180')
                    )
                )
            ),

        setCircleSegment: ( /* context */) => _h.join(
                _h.subhead('Circle Segment (Arc)'),
                _h.inset(
                    _h.paragraph('Any Positive or negative number, with the final result being clamped to from 0-360.  This is different from a degrees setting, where 0 and 360 are the same thing and subtracting 1 from 0 takes you to 359.  Anything lower than 0 will become 0 and anything higher than 360 will become 360.'),
                    _h.minorhead('Available Circle Segment (Arc) Properties:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('light_angle'),
                            _h.cell('light_losangle'),
                            _h.cell("limit_field_of_vision_total"),
                            _h.cell("limit_field_of_night_vision_total"),
                            _h.cell("directional_bright_light_total"),
                            _h.cell("directional_dim_light_total")
                        )
                    ),
                    _h.paragraph('Setting line of sight angle to 90 degrees.'),
                    _h.inset(
                        _h.pre('!token-mod --set light_losangle|90')
                    )
                )
            ),

        setColors: ( /* context */) => _h.join(
                _h.subhead('Colors'),
                _h.inset(
                    _h.paragraph(`Colors can be specified in multiple formats:`),
                    _h.inset(
                        _h.ul(
                            `${_h.bold('Transparent')} -- This is the special literal ${_h.code('transparent')} and represents no color at all.`,
                            `${_h.bold('HTML Color')} -- This is 6 or 3 hexidecimal digits, optionally prefaced by ${_h.code('#')}.  Digits in a 3 digit hexidecimal color are doubled.  All of the following are the same: ${_h.code('#ff00aa')}, ${_h.code('#f0a')}, ${_h.code('ff00aa')}, ${_h.code('f0a')}`,
                            `${_h.bold('RGB Color')} -- This is an RGB color in the format ${_h.code('rgb(1.0,1.0,1.0)')} or ${_h.code('rgb(256,256,256)')}.  Decimal numbers are in the scale of 0.0 to 1.0, integer numbers are scaled 0 to 256.  Note that numbers can be outside this range for the purpose of doing math.`,
                            `${_h.bold('HSV Color')} -- This is an HSV color in the format ${_h.code('hsv(1.0,1.0,1.0)')} or ${_h.code('hsv(360,100,100)')}.  Decimal numbers are in the scale of 0.0 to 1.0, integer numbers are scaled 0 to 360 for the hue and 0 to 100 for saturation and value.  Note that numbers can be outside this range for the purpose of doing math.`
                        )
                    ),
                    _h.minorhead('Available Colors Properties:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('tint_color'),
                            _h.cell('aura1_color'),
                            _h.cell('aura2_color'),
                            _h.cell('night_vision_tint'),
                            _h.cell('lightColor'),
                            _h.cell('lightcolor')
                        )
                    ),
                    _h.paragraph('Turning off the tint and setting aura1 to a reddish color.  All of the following are the same:'),
                    _h.inset(
                        _h.pre('!token-mod --set tint_color|transparent aura1_color|ff3366'),
                        _h.pre('!token-mod --set tint_color| aura1_color|f36'),
                        _h.pre('!token-mod --set tint_color|transparent aura1_color|#f36'),
                        _h.pre('!token-mod --set tint_color| aura1_color|#ff3366')
                    ),
                    _h.paragraph('Setting the tint_color using an RGB Color using Integer and Decimal notations:'),
                    _h.inset(
                        _h.pre('!token-mod --set tint_color|rgb(127,0,256)'),
                        _h.pre('!token-mod --set tint_color|rgb(.5,0.0,1.0)')
                    ),
                    _h.paragraph('Setting the tint_color using an HSV Color using Integer and Decimal notations:'),
                    _h.inset(
                        _h.pre('!token-mod --set tint_color|hsv(0,50,100)'),
                        _h.pre('!token-mod --set tint_color|hsv(0.0,.5,1.0)')
                    ),

                    _h.paragraph(`You can toggle a color on and off by prefacing it with ${_h.code('!')}.  If the color is currently transparent, it will be set to the specified color, otherwise it will be set to transparent:`),
                    _h.inset(
                        _h.pre('!token-mod --set tint_color|!rgb(1.0,.0,.2)')
                    ),

                    _h.minorhead('Color Math'),

                    _h.paragraph(`You can perform math on colors using ${_h.code('+')}, ${_h.code('-')}, and ${_h.code(ch('*'))}.`),
                    _h.paragraph(`Making the aura just a little more red:`),
                    _h.inset(
                        _h.pre('!token-mod --set aura1_color|+#330000')
                    ),
                    _h.paragraph(`Making the aura just a little less blue:`),
                    _h.inset(
                        _h.pre('!token-mod --set aura1_color|-rgb(0.0,0.0,0.1)')
                    ),
                    _h.paragraph(`HSV colors are especially good for color math.  Making the aura twice as bright:`),
                    _h.inset(
                        _h.pre(`!token-mod --set aura1_color|${ch('*')}hsv(1.0,1.0,2.0)`)
                    ),

                    _h.paragraph(`Performing math operations with a transparent color as the command argument does nothing:`),
                    _h.inset(
                        _h.pre(`!token-mod --set aura1_color|${ch('*')}transparent`)
                    ),

                    _h.paragraph(`Performing math operations on a transparent color on a token treats the color as black.  Assuming a token had a transparent aura1, this would set it to #330000.`),
                    _h.inset(
                        _h.pre('!token-mod --set aura1_color|+300')
                    )
                )
            ),

        setText: ( /* context */) => _h.join(
                _h.subhead('Text'),
                _h.inset(
                    _h.paragraph(`These can be pretty much anything.  If your value has spaces in it, you need to enclose it in ${ch("'")} or ${ch('"')}.`),
                    _h.minorhead('Available Text Properties:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('name'),
                            _h.cell('tooltip'),
                            _h.cell('bar1_value'),
                            _h.cell('bar2_value'),
                            _h.cell('bar3_value'),
                            _h.cell('bar1_current'),
                            _h.cell('bar2_current'),
                            _h.cell('bar3_current'),
                            _h.cell('bar1_max'),
                            _h.cell('bar2_max'),
                            _h.cell('bar3_max'),
                            _h.cell('bar1'),
                            _h.cell('bar2'),
                            _h.cell('bar3'),
                            _h.cell('bar1_reset'),
                            _h.cell('bar2_reset'),
                            _h.cell('bar3_reset')
                        )
                    ),
                    _h.paragraph(`Setting a token${ch("'")}s name to ${ch('"')}Sir Thomas${ch('"')} and bar1 value to 23.`),
                    _h.inset(
                        _h.pre(`!token-mod --set name|${ch('"')}Sir Thomas${ch('"')} bar1_value|23`)
                    ),
                    _h.paragraph(`Setting a bar to a numeric value will be treated as a relative change if prefaced by ${_h.code('+')}, ${_h.code('-')}, ${_h.code(ch('*'))}, or ${_h.code('/')}, or will be explicitly set when prefaced with a ${_h.code('=')}.  If you are setting a bar value, you can append a ${_h.code('!')} to the value to force it to be bounded between ${_h.code('0')} and ${_h.code('max')} for the bar.`),
                    _h.paragraph(`${_h.italic('bar1')}, ${_h.italic('bar2')} and ${_h.italic('bar3')} are special.  Any value set on them will be set in both the ${_h.italic('_value')} and ${_h.italic('_max')} fields for that bar.  This is most useful for setting hit points, particularly if the value comes from an inline roll.`),
                    _h.inset(
                        _h.pre(`!token-mod --set bar1|${ch('[')}${ch('[')}3d6+8${ch(']')}${ch(']')}`)
                    ),
                    _h.paragraph(`${_h.italic('bar1_reset')}, ${_h.italic('bar2_reset')} and ${_h.italic('bar3_reset')} are special.  Any value set on them will be ignored, instead they will set the ${_h.italic('_value')} field for that bar to whatever the matching ${_h.italic('_max')} field is set to.  This is most useful for resetting hit points or resource counts like spells. (The ${_h.code('|')} is currently still required.)`),
                    _h.inset(
                        _h.pre(`!token-mod --set bar1_reset| bar3_reset|`)
                    )
                )
            ),

        setLayer: ( /* context */) => _h.join(
                _h.subhead('Layer'),
                _h.inset(
                    _h.paragraph(`There is only one Layer property.  It can be one of 4 values, listed below.`),
                    _h.minorhead('Available Layer Values:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('gmlayer'),
                            _h.cell('objects'),
                            _h.cell('map'),
                            _h.cell('walls'),
                            _h.cell('foreground')
                        )
                    ),
                    _h.paragraph('Moving something to the gmlayer.'),
                    _h.inset(
                        _h.pre('!token-mod --set layer|gmlayer')
                    )
                )
            ),
        availableStatusMarkers: (/* context */) => _h.join(
                    _h.minorhead('Available Status Markers:'),
                    _h.inset(
                        _h.grid(
                            ...StatusMarkers.getOrderedList().map(tm=>_h.statusCell(tm))
                        )
                    )
            ),
        setStatus: ( context ) => _h.join(
                _h.subhead('Status'),
                _h.inset(
                    _h.paragraph(`There is only one Status property.  Status has a somewhat complicated syntax to support the greatest possible flexibility.`),
                    _h.minorhead('Available Status Property:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('statusmarkers')
                        )
                    ),

                    _h.paragraph(`Status is the only property that supports multiple values, all separated by ${_h.code('|')} as seen below. This command adds the blue, red, green, padlock and broken-sheilds to a token, on top of any other status markers it already has:`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|blue|red|green|padlock|broken-shield')
                    ),

                    _h.paragraph(`You can optionally preface each status with a ${_h.code('+')} to remind you it is being added.  This command is identical:`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|+blue|+red|+green|+padlock|+broken-shield')
                    ),

                    _h.paragraph(`Each value can be followed by a ${_h.code(':')} and a number between 0 and 9.  (The number following the ${_h.italic('dead')} status is ignored as that status is special.)  This will set the blue status with no number overlay, red with a 3 overlay, green with no overlay, padlock with a 2 overlay, and broken-shield with a 7 overlay:`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|blue:0|red:3|green|padlock:2|broken-shield:7')
                    ),
                    _h.paragraph(`${_h.bold('Note:')} TokenMod will now show 0 on status markers everywhere that makes sense to do.`),

                    _h.paragraph(`You can use a semicolon (${_h.code(';')}) in place of a colon (${_h.code(':')}) to allow setting statuses with numbers from API Buttons.`),
                    _h.inset(
                        _h.pre(`${ch('[')}[Set some statuses](!token-mod --set statusmarkers|blue;0|red;3|green|padlock;2|broken-shield;7)`)
                    ),

                    _h.paragraph(`The numbers following a status can be prefaced with a ${_h.code('+')} or ${_h.code('-')}, which causes their value to be applied to the current value. Here${ch("'")}s an example showing blue getting incremented by 2, and padlock getting decremented by 1.  Values will be bounded between 0 and 9.`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|blue:+2|padlock:-1')
                    ),

                    _h.paragraph(`You can append two additional numbers separated by ${_h.code(':')}.  These numbers will be used as the minimum and maximum value when setting or adjusting the number on a status marker.  Specified minimum and maximum values will be kept between 0 and 9.`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|blue:+1:2:5')
                    ),

                    _h.paragraph(`Omitting either of the numbers will cause them to use their default value.  Here is an example limiting the max to 5:`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|blue:+1::5')
                    ),

                    _h.paragraph(`You can optionally preface each status with a ${_h.code('?')} to modify the way ${_h.code('+')} and ${_h.code('-')} on status numbers work.  With ${_h.code('?')} on the front of the status, only selected tokens that have that status will be modified.  Additionally, if the status reaches 0, it will be removed.  Here${ch("'")}s an example showing blue getting decremented by 1.  If it reaches 0, it will be removed and no status will be added if it is missing.`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|?blue:-1')
                    ),

                    _h.paragraph(`By default, status markers will be added, retaining whichever status markers are already present.  You can override this behavior by prefacing a status with a ${_h.code('-')} to cause the status to be removed.  This will remove the blue and padlock status:`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|-blue|-padlock')
                    ),

                    _h.paragraph(`Sometimes it is convenient to have a way to add a status if it is not there, but remove it if it is.  This allows marking tokens with markers and clearing them with the same command.  You can preface a status with ${_h.code('!')} to toggle it${ch("'")}s state on and off.  Here is an example that will add or remove the Rook piece from a token:`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|!white-tower')
                    ),

                    _h.paragraph(`Sometimes, you might want to clear all status marker as part of setting a new status marker.  You can do this by prefacing a status marker with an ${_h.code('=')}.  Note that this affects all status markers before as well, so you will want to do this only on the first status marker.  This will remove all status markers and set only the dead marker:`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|=dead')
                    ),

                    _h.paragraph(`If you want to remove all status markers, just set an empty status marker with ${_h.code('=')}. This will clear all the status markers:`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|=')
                    ),

                    _h.paragraph(`You can also do this by setting a single status marker, then removing it:`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|=blue|-blue')
                    ),

                    _h.paragraph(`You can set multiple of the same status marker with a bracket syntax. Copies of a status are indexed starting at 1 from left to right. Leaving brackets off will be the same as specifying index 1. Using empty brackets is the same as specifying an index 1 greater than the highest index in use. When setting a status at an index that doesn${ch("'")}t exist (say, 8 when you only have 2 of that status) it will be appended to the right as the next index. When removing a status that doesn${ch("'")}t exist, it will be ignored. Removing the empty bracket status will remove all statues of that type.`),
                    _h.paragraph(`Adding 2 blue status markers with the numbers 7 and 5 in a few different ways:`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|blue:7|blue[]:5'),
                        _h.pre('!token-mod --set statusmarkers|blue[]:7|blue[]:5'),
                        _h.pre('!token-mod --set statusmarkers|blue[1]:7|blue[2]:5')
                    ),
                    _h.paragraph('Removing the second blue status marker:'),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|-blue[2]')
                    ),
                    _h.paragraph('Removing all blue status markers:'),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|-blue[]')
                    ),

                    _h.paragraph('All of these operations can be combine in a single statusmarkers command.'),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|blue:3|-dead|red:3')
                    ),
                    helpParts.availableStatusMarkers(context),
                    _h.paragraph(`Status Markers with a space in the name must be specified using the tag name, which appears in ${_h.code('[')}${_h.code(']')} above.`),
                    _h.inset(
                        _h.pre('!token-mod --set statusmarkers|Mountain_Pass::1234568')
                    ),
                    _h.paragraph(`You can use a semicolon (${_h.code(';')}) in place of a colon (${_h.code(':')}) to allow setting statuses with numbers from API Buttons.`),
                    _h.inset(
                        _h.pre(`${ch('[')}3 Mountain Pass](!token-mod --set statusmarkers|Mountain_Pass;;1234568;3)`)
                    )

                )
            ),

        setImage: ( /* context */) => _h.join(
                _h.subhead('Image'),
                _h.inset(
                    _h.paragraph(`The Image type lets you manage the image a token uses, as well as the available images for Multi-Sided tokens.  Images must be in a user library or will be ignored. The full path must be provided.`),
                    _h.minorhead('Available Image Properties:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('imgsrc')
                        )
                    ),
                    _h.paragraph(`Setting the token image to a library image using a url (in this case, the orange ring I use for ${_h.italic('TurnMarker1')}):`),
                    _h.inset(
                        _h.pre('!token-mod --set imgsrc|https://s3.amazonaws.com/files.d20.io/images/4095816/086YSl3v0Kz3SlDAu245Vg/max.png?1400535580')
                    ),
                    _h.paragraph(`Setting the token image from another token by specifying it${ch("'")}s token_id:`),
                    _h.inset(
                        _h.pre(`!token-mod --set imgsrc|${_h.attr.target('token_id')} --ids ${_h.attr.selected('token_id')}`)
                    ),
                    _h.paragraph(`${_h.bold('WARNING:')} Because of a Roll20 bug with ${_h.attr.target('')} and the API, you must specify the tokens you want to change using ${_h.code('--ids')} when using ${_h.attr.target('')}.`),

                    _h.minorhead('Multi-Sided Token Options'),
                    _h.inset(
                        _h.subhead('Appending (+)'),
                        _h.inset(
                            _h.paragraph(`You can append additional images to the list of sides by prefacing the source of an image with ${_h.code('+')}:`),
                            _h.inset(
                                _h.pre('!token-mod --set imgsrc|+https://s3.amazonaws.com/files.d20.io/images/4095816/086YSl3v0Kz3SlDAu245Vg/max.png?1400535580'),
                                _h.pre(`!token-mod --set imgsrc|+${_h.attr.target('token_id')} --ids ${_h.attr.selected('token_id')}`)
                            ),
                            _h.paragraph(`If you follow the ${_h.code('+')} with a ${_h.code('=')}, it will update the current side to the freshly added image:`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|+=${_h.attr.target('token_id')} --ids ${_h.attr.selected('token_id')}`)
                            ),
                            _h.paragraph(`When getting the image from a token, you can append a ${_h.code(':')} and follow it with an index to copy.  Indicies start at 1, if you specify an index that doesn${ch("'")}t exist, nothing will happen:`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|+${_h.attr.target('token_id')}:3 --ids ${_h.attr.selected('token_id')}`)
                            ),
                            _h.paragraph(`You can specify the ${_h.code('=')} with this syntax:`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|+=${_h.attr.target('token_id')}:3 --ids ${_h.attr.selected('token_id')}`)
                            ),
                            _h.paragraph(`You can specify multiple indices to copy by using a ${_h.code(',')} separated list:`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|+${_h.attr.target('token_id')}:3,4,5,9 --ids ${_h.attr.selected('token_id')}`)
                            ),
                            _h.paragraph(`Using ${_h.code('=')} with this syntax will set the current side to the last added image:`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|+=${_h.attr.target('token_id')}:3,4,5,9 --ids ${_h.attr.selected('token_id')}`)
                            ),
                            _h.paragraph(`Images are copied in the order specified.  You can even copy images from a token you${ch("'")}re setting.`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|+${_h.attr.target('token_id')}:3,2,1 --ids ${_h.attr.selected('token_id')}`)
                            ),
                            _h.paragraph(`You can use an ${_h.code(ch('*'))} after the ${_h.code(':')} to copy all the images from a token.  The order will be from 1 to the maximum image.`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|+${_h.attr.target('token_id')}:${ch('*')} --ids ${_h.attr.selected('token_id')}`)
                            ),

                            _h.paragraph(`When appending a url, you can use a ${_h.code(ch(':@'))} followed by a number to specify where to place the new image.  Indicies start at 1.`),
                            _h.inset(
                                _h.pre('!token-mod --set imgsrc|+https://s3.amazonaws.com/files.d20.io/images/4095816/086YSl3v0Kz3SlDAu245Vg/max.png?1400535580:@1')
                            ),

                            _h.paragraph(`When appending from a token, you can use an ${_h.code(ch('@'))} followed by a number to specify where each copied image is inserted.  Indicies start at 1.`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|+${_h.attr.target('token_id')}:3@1,4@2,5@4,9@5 --ids ${_h.attr.selected('token_id')}`)
                            ),
                            _h.paragraph(`Note that inserts are performed in order, so continuously inserting at a position will insert in reverse order.`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|+${_h.attr.target('token_id')}:3@1,4@1,5@1,9@1 --ids ${_h.attr.selected('token_id')}`)
                            )
                        ),

                        _h.subhead('Replacing (^)'),
                        _h.inset(
                            _h.paragraph(`You can replace images in the list of sides by prefacing the source of an image with ${_h.code('^')} and append ${_h.code(ch(':@'))} followed by a number to specify which images to replace.  Indicies start at 1.`),
                            _h.inset(
                                _h.pre('!token-mod --set imgsrc|^https://s3.amazonaws.com/files.d20.io/images/4095816/086YSl3v0Kz3SlDAu245Vg/max.png?1400535580:@2'),
                                _h.pre(`!token-mod --set imgsrc|^${_h.attr.target('token_id')}:@2 --ids ${_h.attr.selected('token_id')}`)
                            ),
                            _h.paragraph(`When replacing from a token, you can specify multiple replacements from a source token to the destination token:`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|^${_h.attr.target('token_id')}:3@1,4@2,5@4,9@5 --ids ${_h.attr.selected('token_id')}`)
                            )
                        ),

                        _h.subhead('Reordering (/)'),
                        _h.inset(
                            _h.paragraph(`You can use a ${_h.code(ch('/'))} followed by a pair of numbers separated by ${_h.code('@')} to move an image on the token from one postion to another.  Indicies start at 1.`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|/3@1 --ids ${_h.attr.selected('token_id')}`)
                            ),
                            _h.paragraph(`You can string these together with commas.  Note that operationes are performed in order and may displace prior moved images.`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|/3@1,4@2,5@3,9@4 --ids ${_h.attr.selected('token_id')}`)
                            )
                        ),

                        _h.subhead('Removing (-)'),
                        _h.inset(
                            _h.paragraph(`You can remove images from the image list using ${_h.code('-')} followed by the index to remove.  If you remove the currently used image, the side will be set to 1.`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|-3`)
                            ),
                            _h.paragraph(`If you omit the number, it will remove the current side:`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|-`)
                            ),

                            _h.paragraph(`You can follow the ${_h.code('-')} with a ${_h.code(',')} separated list of indicies to remove.  If any of the indicies don${ch("'")}t exist, they will be ignored:`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|-3,4,7`)
                            ),

                            _h.paragraph(`You can follow the ${_h.code('-')} with an ${_h.code(ch('*'))} to remove all the images, turning the Multi-Sided token back into a regular token. (This also happens if you remove the last image by index.):`),
                            _h.inset(
                                _h.pre(`!token-mod --set imgsrc|-${ch('*')}`)
                            )
                        ),

                        _h.paragraph(`${_h.bold('WARNING:')} If you attempt to change the image list for a token with images in the Marketplace Library, it will remove all of them from that token.`)
                    )
                )
            ),

        setSideNumber: ( /* context */) => _h.join(
                _h.subhead('SideNumber'),
                _h.inset(
                    _h.paragraph(`This is the index of the side to show for Multi-Sided tokens.  Indicies start at 1.  If you have a 6-sided token, it will have indicies 1, 2, 3, 4, 5 and 6.  An empty index is considered to be 1.  If a token doesn't have the index specified, it isn't changed.`),
                    _h.paragraph(`${_h.bold('NOTICE:')} This only works for images in the User Image library.  If your token has images that are stored in the Marketplace Library, they will not be selectable with this command.  You can download those images and upload them to your User Image Library to use them with this.`),
                    _h.minorhead('Available SideNumber Properties:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('currentside')
                        )
                    ),
                    _h.paragraph(`Setting a token to index 2:`),
                    _h.inset(
                        _h.pre('!token-mod --set currentside|2')
                    ),
                    _h.paragraph(`Not specifying an index will set the index to 1, the first image:`),
                    _h.inset(
                        _h.pre('!token-mod --set currentside|')
                    ),

                    _h.paragraph(`You can shift the image by some amount by using ${_h.code('+')} or ${_h.code('-')} followed by an optional number.`),
                    _h.paragraph(`Moving all tokens to the next image:`),
                    _h.inset(
                        _h.pre('!token-mod --set currentside|+')
                    ),
                    _h.paragraph(`Moving all tokens back 2 images:`),
                    _h.inset(
                        _h.pre('!token-mod --set currentside|-2')
                    ),
                    _h.paragraph(`By default, if you go off either end of the list of images, you will wrap back around to the opposite side.  If this token is showing image 3 out of 4 and this command is run, it will be on image 2:`),
                    _h.inset(
                        _h.pre('!token-mod --set currentside|+3')
                    ),
                    _h.paragraph(`If you preface the command with a ${_h.code('?')}, the index will be bounded to the number of images and not wrap.  In the same scenario, this would leave the above token at image 4:`),
                    _h.inset(
                        _h.pre('!token-mod --set currentside|?+3')
                    ),
                    _h.paragraph(`In the same scenario, this would leave the above token at image 1:`),
                    _h.inset(
                        _h.pre('!token-mod --set currentside|?-30')
                    ),

                    _h.paragraph(`If you want to choose a random image, you can use ${_h.code(ch('*'))}.  This will choose one of the valid images at random (all equally weighted):`),
                    _h.inset(
                        _h.pre(`!token-mod --set currentside|${ch('*')}`)
                    )
                )
            ),

        setCharacterID: ( /*context*/ ) => _h.join(
                _h.subhead('Character ID'),
                _h.inset(
                    _h.paragraph(`You can use the ${_h.attr.char('character_id')} syntax to specify a character_id directly or use the name of a character (quoted if it contains spaces) or just the shortest part of the name that is unique (${ch("'")}Sir Maximus Strongbow${ch("'")} could just be ${ch("'")}max${ch("'")}.).  Not case sensitive: Max = max = MaX = MAX`),
                    _h.minorhead('Available Character ID Properties:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('represents')
                        )
                    ),
                    _h.paragraph('Here is setting the represents to the character Bob.'),
                    _h.inset(
                        _h.pre(`!token-mod --set represents|${_h.attr.char('character_id','Bob')}`)
                    ),
                    _h.paragraph('Note that setting the represents will clear the links for the bars, so you will probably want to set those again.')
                )
            ),

        setAttributeName: ( /*context*/ ) => _h.join(
                _h.subhead('Attribute Name'),
                _h.inset(
                    _h.paragraph(`These are resolved from the represented character id.  If the token doesn${ch("'")}t represent a character, these will be ignored.  If the Attribute Name specified doesn${ch("'")}t exist for the represented character, the link is unchanged. You can clear a link by passing a blank Attribute Name.`),
                    _h.minorhead('Available Attribute Name Properties:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('bar1_link'),
                            _h.cell('bar2_link'),
                            _h.cell('bar3_link')
                        )
                    ),
                    _h.paragraph('Here is setting the represents to the character Bob and setting bar1 to be the npc hit points attribute.'),
                    _h.inset(
                        _h.pre(`!token-mod --set represents|${_h.attr.char('character_id','Bob')} bar1_link|npc_HP`)
                    ),
                    _h.paragraph('Here is clearing the link for bar3:'),
                    _h.inset(
                        _h.pre('!token-mod --set bar3_link|')
                    )
                )
            ),


        setPlayer: ( /*context*/ ) => _h.join(
                _h.subhead('Player'),
                _h.inset(
                    _h.paragraph('You can specify Players using one of five methods: Player ID, Roll20 ID Number, Player Name Matching, Token ID, Character ID'),
                    _h.inset(
                        _h.ul(
                            'Player ID is a unique identifier assigned that player in a specific game.  You can only find this id from the API, so this is likely the least useful method.',
                            'Roll20 ID Number is a unique identifier assigned to a specific player.  You can find it in the URL of their profile page as the number preceeding their name.  This is really useful if you play with the same people all the time, or are cloning the same game with the same players, etc.',
                            'Player Name Matching is a string that will be matched to the current name of the player in game.  Just like with Characters above, it can be quoted if it has spaces and is case insensitive.  All players that match a given string will be used.',
                            'Token ID will be used to collect the controlledby entries for a token or the associated character if the token represetns one.',
                            'Character ID will be used to collect the controlledby entries for a character.'
                        )
                    ),
                    _h.paragraph(`Note that you can use the special string ${_h.italic('all')} to denote the All Players special player.`),
                    _h.minorhead('Available Player Properties:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('controlledby')
                        )
                    ),

                    _h.paragraph(`Controlled by supports multiple values, all separated by ${_h.code('|')} as seen below.`),
                    _h.inset(
                        _h.pre('!token-mod --set controlledby|aaron|+stephen|+russ')
                    ),

                    _h.paragraph(`There are 3 operations that can be specified with leading characters: ${_h.code('+')}, ${_h.code('-')}, ${_h.code('=')} (default)`),
                    _h.inset(
                        _h.ul(
                            `${_h.code('+')} will add the player(s) to the controlledby list.`,
                            `${_h.code('-')} will remove the player(s) from the controlledby list.`,
                            `${_h.code('=')} will set the controlledby list to only the player(s).  (Default)`
                        )
                    ),

                    _h.paragraph('Adding control for roll20 player number 123456:'),
                    _h.inset(
                        _h.pre('!token-mod --set controlledby|+123456')
                    ),

                    _h.paragraph('Setting control for all players:'),
                    _h.inset(
                        _h.pre('!token-mod --set controlledby|all')
                    ),
                    
                    _h.paragraph('Adding all the players with k in their name but removing karen:'),
                    _h.inset(
                        _h.pre('!token-mod --set controlledby|+k|-karen')
                    ),

                    _h.paragraph( 'Adding the player with player id -JsABCabc123-12:' ),
                    _h.inset(
                        _h.pre( '!token-mod --set controlledby|+-JsABCabc123-12' )
                    ),

                    _h.paragraph( 'In the case of a leading character on the name that would be interpreted as an operation, you can use quotes:' ),
                    _h.inset(
                        _h.pre('!token-mod --set controlledby|"-JsABCabc123-12"')
                    ),

                    _h.paragraph( `When using Token ID or Character ID methods, it${ch("'")}s a good idea to use an explicit operation:` ),
                    _h.inset(
                        _h.pre( `!token-mod --set controlledby|=${_h.attr.target('token_id')}`)
                    ),

                    _h.paragraph( 'Quotes will also help with names that have spaces, or with nested other quotes:' ),
                    _h.inset(
                        _h.pre( `!token-mod --set controlledby|+${ch("'")}Bob "tiny" Slayer${ch("'")}`)
                    ),

                    _h.paragraph( 'You can remove all controlling players by using a blank list or explicitly setting equal to nothing:'),
                    _h.inset(
                        _h.pre('!token-mod --set controlledby|'),
                        _h.pre('!token-mod --set controlledby|=')
                    ),

                    _h.paragraph( `A specified action that doesn${ch("'")}t match any player(s) will be ignored.  If there are no players named Tim, this won${ch("'")}t change the list:`),
                    _h.inset(
                        _h.pre('!token-mod --set controlledby|tim')
                    ),

                    _h.paragraph( 'If you wanted to force an empty list and set tim if tim is available, you can chain this with blanking the list:'),
                    _h.inset(
                        _h.pre('!token-mod --set controlledby||tim')
                    ),

                    _h.minorhead( 'Using controlledby with represents'),
                    _h.paragraph( 'When a token represents a character, the controlledby property that is adjusted is the one on the character. This works as you would want it to, so if you are changing the represents as part of the same command, it will adjust the location that will be correct after all commands are run.'),

                    _h.paragraph( 'Set the token to represent the character with rook in the name and assign control to players matching bob:'),
                    _h.inset(
                        _h.pre('!token-mod --set represents|rook controlledby|bob')
                    ),

                    _h.paragraph( 'Remove the represent setting for the token and then give bob control of that token (useful for one-offs from npcs or monsters):'),
                    _h.inset(
                        _h.pre('!token-mod --set represents| controlledby|bob')
                    )
                )
            ),

        setDefaultToken: ( /*context*/ ) => _h.join(
                _h.subhead('DefaultToken'),
                _h.inset(
                    _h.paragraph(`You can set the default token by specifying defaulttoken in your set list.`),
                    _h.minorhead('Available DefaultToken Properties:'),
                    _h.inset(
                        _h.grid(
                            _h.cell('defaulttoken')
                        )
                    ),
                    _h.paragraph('There is no argument for defaulttoken, and this relies on the token representing a character.'),
                    _h.inset(
                        _h.pre('!token-mod --set defaulttoken')
                    ),
                    _h.paragraph('Setting defaulttoken along with represents works as expected:'),
                    _h.inset(
                        _h.pre(`!token-mod --set represents|${_h.attr.char('character_id','Bob')} defaulttoken`)
                    ),
                    _h.paragraph(`Be sure that defaulttoken is after all changes to the token you want to store are made.  For example, if you set the defaulttoken, then set the bar links, the bars won${ch("'")}t be linked when you pull out the token.`)
                )
            ),

        sets: ( context ) => _h.join(
                // SECTION: --set, etc
                _h.section('Set Arguments',
                    _h.paragraph(`${_h.italic('--set')} takes key-value pairs, separated by ${_h.code('|')} characters (or ${_h.code('#')} characters).`),
                    _h.inset(
                        _h.pre('!token-mod --set key|value key|value key|value')
                    ),
                    _h.paragraph(`You can use inline rolls wherever you like, including rollable tables:`),
                    _h.inset(
                        _h.pre(`!token-mod --set bar${ch('[')}${ch('[')}1d3${ch(']')}${ch(']')}_value|X statusmarkers|blue:${ch('[')}${ch('[')}1d9${ch(']')}${ch(']')}|green:${ch('[')}${ch('[')}1d9${ch(']')}${ch(']')} name:${ch('"')}${ch('[')}${ch('[')}1t${ch('[')}randomName${ch(']')}${ch(']')}${ch(']')}"`)
                    ),

                    _h.paragraph(`You can use ${_h.code('+')} or ${_h.code('-')} before any number to make an adjustment to the current value:`),
                    _h.inset(
                        _h.pre('!token-mod --set bar1_value|-3 statusmarkers|blue:+1|green:-1')
                    ),

                    _h.paragraph(`You can preface a ${_h.code('+')} or ${_h.code('-')} with an ${_h.code('=')} to explicitly set the number to a negative or positive value:`),
                    _h.inset(
                        _h.pre('!token-mod --set bar1_value|=+3 light_radius|=-10')
                    ),

                    _h.paragraph('There are several types of keys with special value formats:'),
                    _h.inset(
                        helpParts.setNumbers(context),
                        helpParts.setPercentage(context),
                        helpParts.setNumbersOrBlank(context),
                        helpParts.setDegrees(context),
                        helpParts.setCircleSegment(context),
                        helpParts.setColors(context),
                        helpParts.setText(context),
                        helpParts.setNightVisionEffect(context),
                        helpParts.setBarLocation(context),
                        helpParts.setCompactBar(context),
                        helpParts.setBarPermission(context),
                        helpParts.setLayer(context),
                        helpParts.setStatus(context),
                        helpParts.setImage(context),
                        helpParts.setSideNumber(context),
                        helpParts.setCharacterID(context),
                        helpParts.setAttributeName(context),
                        helpParts.setDefaultToken(context),
                        helpParts.setPlayer(context)
                    ) 
                )
            ),

        reports: (/* context */) => _h.join(
                // SECTION: --report
                    _h.section('Report',
                        _h.paragraph(`${_h.experimental()} ${_h.italic('--report')} provides feedback about the changes that were made to each token that a command affects.  Arguments to the ${_h.italic('--report')} command are ${_h.code('|')} separated pairs of Who to tell, and what to tell them, with the following format:`),
                        _h.inset(
                            _h.pre(`!token-mod --report Who[:Who ...]|Message`)
                        ),
                        _h.paragraph(`You can specify multiple different Who arguments by separating them with a ${_h.code(':')}.  Be sure you have no spaces.`),
                        _h.minorhead('Available options for Who'),
                        _h.inset(
                            _h.ul(
                                `${_h.code('player')} will whisper the report to the player who issued the command.`,
                                `${_h.code('gm')} will whisper the report to the gm.`,
                                `${_h.code('all')} will send the report publicly to chat for everyone to see.`,
                                `${_h.code('token')} will whisper to whomever controls the token.`,
                                `${_h.code('character')} will whisper to whomever controls the character the token represents.`,
                                `${_h.code('control')} will whisper to whomever can control the token from either the token or character controlledby list.  This is equivalent to specifying ${_h.code('token:character')}.`
                            )
                        ),
                        _h.paragraph(`The Message must be enclosed in quotes if it has spaces in it. The Message can contain any of the properties of the of the token, enclosed in ${_h.code('{ }')}, and they will be replaced with the final value of that property.  Additionally, each property may have a modifier to select slightly different information:`),
                        _h.minorhead('Available options for Property Modifiers'),
                        _h.inset(
                            _h.ul(
                                `${_h.code('before')} -- Show the value of the property before a change was applied.`,
                                `${_h.code('change')} -- Show the change that was applied to the property. (Only works on numeric fields, will result in 0 on things like name or imagsrc.)`,
                                `${_h.code('abschange')} -- Show the absolute value of the change that was applied to the property. (Only works on numeric fields, will result in 0 on things like name or imagsrc.)`
                            )
                        ),
                        _h.paragraph(`Showing the amount of damage done to a token.`),
                        _h.inset(
                            _h.preformatted(
                                '!token-mod {{',
                                '  --set',
                                `    bar1_value|-${ch('[')}${ch('[')}2d6+8${ch(']')}${ch(']')}`,
                                '  --report',
                                '    all|"{name} takes {bar1_value:abschange} points of damage."',
                                '}}'
                            )
                        ),
                        _h.paragraph(`Showing everyone the results of the hit, but only the gm and the controlling players the actual damage and original hit point value.`),
                        _h.inset(
                            _h.preformatted(
                                '!token-mod {{',
                                '  --set',
                                `    bar1_value|-${ch('[')}${ch('[')}2d6+8${ch(']')}${ch(']')}`,
                                '  --report',
                                '    all|"{name} takes a vicious wound leaving them at {bar1_value}hp out of {bar1_max}hp."',
                                '    gm:control|"{name} damage: {bar1_value:change}hp, was at {bar1_value:before}hp"',
                                '}}'
                            )
                        )
                    )
                ),
        config: (context) => _h.join(
                    // SECTION: --config, etc
                    _h.section('Configuration',
                        _h.paragraph(`${_h.italic('--config')} takes option value pairs, separated by | characters.`),
                        _h.inset(
                            _h.pre( '!token-mod --config option|value option|value')
                        ),
                        _h.minorhead('Available Configuration Properties:'),
                        _h.ul(
                            `${_h.bold('players-can-ids')} -- Determines if players can use <i>--ids</i>.  Specifying a value which is true allows players to use --ids.  Omitting a value flips the current setting. `
                        ),
                        ( playerIsGM(context.playerid)
                            ?  _h.paragraph(getConfigOption_PlayersCanIDs())
                            : ''
                        )
                    )
                ),

        apiInterface: (/* context */) => _h.join(
                // SECTION: .ObserveTokenChange(), etc
                _h.section('API Notifications',
                    _h.paragraph( 'API Scripts can register for the following notifications:'),
                    _h.inset(
                        _h.paragraph( `${_h.bold('Token Changes')} -- Register your function by passing it to ${_h.code('TokenMod.ObserveTokenChange(yourFuncObject);')}.  When TokenMod changes a token, it will call your function with the Token as the first argument and the previous properties as the second argument, identical to an ${_h.code("on('change:graphic',yourFuncObject);")} call.`),
                        _h.paragraph( `Example script that notifies when a token${ch("'")}s status markers are changed by TokenMod:`),
                        _h.inset(
                            _h.preformatted(
                                `on('ready',function(){`,
                                `  if('undefined' !== typeof TokenMod && TokenMod.ObserveTokenChange){`,
                                `    TokenMod.ObserveTokenChange(function(obj,prev){`,
                                `      if(obj.get('statusmarkers') !== prev.statusmarkers){`,
                                `        sendChat('Observer Token Change','Token: '+obj.get('name')+' has changed status markers!');`,
                                `      }`,
                                `    });`,
                                `  }`,
                                `});`
                            )
                        )
                    )
                )
            ),

        helpBody: (context) => _h.join(
                _h.header(
                    _h.paragraph( 'TokenMod provides an interface to setting almost all settable properties of a token.')
                ),
                helpParts.commands(context),
                helpParts.booleans(context),
                helpParts.sets(context),
                helpParts.move(context),
                helpParts.reports(context),
                helpParts.config(context),
                helpParts.apiInterface(context)
            ),

        helpDoc: (context) => _h.join(
                _h.title('TokenMod',version),
                helpParts.helpBody(context)
            ),

        helpChat: (context) => _h.outer(
                _h.title('TokenMod',version),
                helpParts.helpBody(context)
            ),

        helpStatusMarkers: (context) => _h.outer(
                _h.title('TokenMod',version),
                helpParts.availableStatusMarkers(context)
            ),

        rebuiltHelp: (/*context*/) => _h.outer(
                _h.title('TokenMod',version),
                _h.header(
                    _h.paragraph( `${_h.helpHandoutLink()} regenerated.`)
                )
            )
    };


    const showHelp = function(playerid) {
        let who=(getObj('player',playerid)||{get:()=>'API'}).get('_displayname');
        let context = {
            who,
            playerid
        };
        sendChat('', '/w "'+who+'" '+ helpParts.helpChat(context));
    };


    const getRelativeChange = function(current,update) {
        let cnum,unum,op='=';
        if(_.isString(update)){
            if( _.has(update,0) && ('=' === update[0]) ){
                return parseFloat(_.rest(update).join(''));
            }
            if( _.has(update,0) && ('!' === update[0]) ){
                if(''===current || 0===parseInt(current) ){
                    return parseFloat(_.rest(update).join(''));
                } else {
                    return '';
                }
            }

            if(update.match(/^[+\-/*]/)){ // */
                op=update[0];
                update=_.rest(update).join('');
            }
        }

        cnum = parseFloat(current);
        unum = parseFloat(update);

        if(!_.isNaN(unum) && !_.isUndefined(unum) ) {
            if(!_.isNaN(cnum) && !_.isUndefined(cnum) ) {
                switch(op) {
                    case '+':
                        return cnum+unum;
                    case '-':
                        return cnum-unum;
                    case '*':
                        return cnum*unum;
                    case '/':
                        return cnum/(unum||1);

                    default:
                        return unum;
                }
            } else {
                return unum;
            }
        }
        return update;
    };

    const parseArguments = function(a) {
        let args = a.replace(/(\|#|##)/g,'|%%HASHMARK%%').split(/[|#]/).map((v)=>v.replace('%%HASHMARK%%','#'));
        let cmd = unalias(args.shift().toLowerCase());
        let retr={};
        let t;
        let t2;

        if(_.has(fields,cmd)) {
            retr[cmd]=[];
            switch(fields[cmd].type) {
                case 'boolean': {
                      let v = args.shift().toLowerCase();
                      if(filters.isTruthyArgument(v)){
                        retr[cmd].push(true);
                      } else if (probBool.hasOwnProperty(v)){
                        retr[cmd].push(probBool[v]());
                      } else {
                        retr[cmd].push(false);
                      }
                    }
                    break;

                case 'text':
                    retr[cmd].push(args.shift().replace(regex.stripSingleQuotes,'$1').replace(regex.stripDoubleQuotes,'$1'));
                    break;

                case 'option': {
                      let o = option_fields[cmd];
                      let ks = Object.keys(o);
                      let arg = args.shift().toLowerCase();
                      if(0 === arg.length || !ks.includes(arg)) {
                        arg='__default__';
                      }
                      retr[cmd].push(o[arg](args.shift()));
                    }
                    break;


                case 'numberBlank':
                    retr[cmd].push(numberOp.parse(cmd,args.shift()));
                    break;

                case 'number':
                    retr[cmd].push(numberOp.parse(cmd,args.shift(),false));
                    break;

                case 'percentage':
                    retr[cmd].push(numberOp.parse(cmd,transforms.percentage(args.shift()),false));
                    break;

                case 'degrees':
                    if( '=' === args[0][0] ) {
                        t='=';
                        args[0]=args[0].slice(1);
                    } else {
                        t='';
                    }
                    retr[cmd].push(t+(['-','+'].includes(args[0][0]) ? args[0][0] : '') + Math.abs(transforms.degrees(args.shift())));
                    break;

                case 'circleSegment':
                    if( '=' === args[0][0] ) {
                        t='=';
                        args[0]=_.rest(args[0]);
                    } else {
                        t='';
                    }
                    retr[cmd].push(t+(_.contains(['-','+'],args[0][0]) ? args[0][0] : '') + transforms.circleSegment(args.shift()));
                    break;

                case 'layer':
                    retr[cmd].push((args.shift().match(regex.layers)||[]).shift());
                    if(0 === (retr[cmd][0]||'').length) {
                        retr = undefined;
                    }
                    break;

                case 'defaulttoken': // blank
                    retr[cmd].push('');
                    break;

                  case 'sideNumber': {
                      let c = sideNumberOp.parseSideNumber(args.shift());
                      if(c){
                        retr[cmd].push(c);
                      } else {
                        retr = undefined;
                      }
                    }
                    break;

                  case 'image': {
                      let c = imageOp.parseImage(args.shift());
                      if(c){
                        retr[cmd].push(c);
                      } else {
                        retr = undefined;
                      }
                    }
                    break;

                  case 'color': {
                      let c = ColorOp.parseColor(args.shift());
                      if(c){
                        retr[cmd].push(c);
                      } else {
                        retr = undefined;
                      }
                    }
                    break;

                case 'character_id':
                    if('' === args[0]){
                        retr[cmd].push('');
                    } else {
                        t=getObj('character', args[0]);
                        if(t) {
                            retr[cmd].push(args[0]);
                        } else {
                            // try to find a character with this name
                            t2=findObjs({type: 'character',archived: false});
                            t=_.chain([ args[0].replace(regex.stripSingleQuotes,'$1').replace(regex.stripDoubleQuotes,'$1') ])
                                .map(function(n){
                                    let l=_.filter(t2,function(c){
                                        return c.get('name').toLowerCase() === n.toLowerCase();
                                    });
                                    return ( 1 === l.length ? l : _.filter(t2,function(c){
                                        return -1 !== c.get('name').toLowerCase().indexOf(n.toLowerCase());
                                    }));
                                })
                                .flatten()
                                .value();
                            if(1 === t.length) {
                                retr[cmd].push(t[0].id);
                            } else {
                                retr=undefined;
                            }
                        }
                    }
                    break;

                case 'attribute':
                    retr[cmd].push(args.shift().replace(regex.stripSingleQuotes,'$1').replace(regex.stripDoubleQuotes,'$1'));
                    break;

                case 'player':
                    _.each(args, function(p){
                        let parts = p.match(/^([+-=]?)(.*)$/),
                            pids = (parts ? getPlayerIDs(parts[2].replace(regex.stripSingleQuotes,'$1').replace(regex.stripDoubleQuotes,'$1')):[]);
                        if(pids.length){
                            _.each(pids,(pid)=>{
                                retr[cmd].push({
                                    pid: pid,
                                    operation: parts[1] || '='
                                });
                                parts[1]='+';
                            });
                        } else if(_.contains(['','='],p)){
                            retr[cmd].push({
                                pid:'',
                                operation:'='
                            });
                        }
                    });
                    break;

                case 'status':
                    _.each(args, function(a) {
                        retr[cmd].push(statusOp.parse(a));
                    });
                    break;

                default:
                    retr=undefined;
                    break;
            }
        }

        return retr;
    };

    const expandMetaArguments = function(memo,a) {
        let args=a.split(/[|#]/),
            cmd=args.shift();
        switch(cmd) {
            case 'bar1':
            case 'bar2':
            case 'bar3':
                args=args.join('|');
                memo.push(cmd+'_value|'+args);
                memo.push(cmd+'_max|'+args);
                break;
            case 'scale':
                args.join('|');
                memo.push(`width|${args}`);
                memo.push(`height|${args}`);
                break;
            default:
                memo.push(a);
                break;
        }
        return memo;
    };

    const parseOrderArguments = function(list,base) {
        return _.chain(list)
            .map(transforms.orderType)
            .reject(_.isUndefined)
            .union(base)
            .value();
    };

    const parseSetArguments = function(list,base) {
        return _.chain(list)
            .filter(filters.hasArgument)
            .reduce(expandMetaArguments,[])
            .map(parseArguments)
            .reject(_.isUndefined)
            .reduce(function(memo,i){
                _.each(i,function(v,k){
                   switch(k){
                    case 'statusmarkers':
                        if(_.has(memo,k)) {
                            memo[k]=_.union(v,memo[k]);
                        } else {
                            memo[k]=v;
                        }
                        break;
                    default:
                        memo[k]=v;
                        break;
                   }
                });
                return memo;
            },base)
            .value();
    };

    const parseMoveArguments = (list,base) =>
        list
            .reduce((m,a)=>{
                let args=a.replace(/(\|#|##)/g,'|%%HASHMARK%%').split(/[|#]/).map((v)=>v.replace('%%HASHMARK%%','#'));
                m.push(moveOp.parse(args));
                return m;
            },base)
            ;

    const parseReportArguments = (list,base) =>
        list
            .filter(filters.hasArgument)
            .reduce((m,a)=>{
                let args=a.replace(/(\|#|##)/g,'|%%HASHMARK%%').split(/[|#]/).map((v)=>v.replace('%%HASHMARK%%','#'));
                let whose=args.shift().toLowerCase().split(/[:;]/);
                let msg = args.shift();
                if(/^(".*")|('.*')$/.test(msg)){
                    msg=msg.slice(1,-1);
                }
                whose = whose.filter((w)=>reportTypes.includes(w));
                if(whose.length){
                    m.push({who:whose,msg});
                }
                return m;
            },base)
            ;

    const doSetWithWorkerOnLinkedBars = (token, mods) => {
      [1,2,3].forEach(n=>{
        if(mods.hasOwnProperty(`bar${n}_value`) || mods.hasOwnProperty(`bar${n}_max`)){
          let a = getObj('attribute',token.get(`bar${n}_link`));
          if(a) {
            let ops = {};
            if(mods.hasOwnProperty(`bar${n}_value`)){
              ops[`current`]=mods[`bar${n}_value`];
              delete mods[`bar${n}_value`];
            }
            if(mods.hasOwnProperty(`bar${n}_max`)){
              ops[`max`]=mods[`bar${n}_max`];
              delete mods[`bar${n}_max`];
            }
            if(Object.keys(ops).length){
              a.setWithWorker(ops);
            }
          }
        }
      });

      return mods;
    };

    const applyModListToToken = function(modlist, token) {
        let ctx={
              token: token,
              prev: JSON.parse(JSON.stringify(token))
            },
            mods={
              statusmarkers: token.get('statusmarkers')
            },
            delta,
            cid,
            repChar,
            controlList = (modlist.set && (modlist.set.controlledby || modlist.set.defaulttoken)) ? (function(){
                let list;
                repChar = getObj('character', modlist.set.represents || token.get('represents'));

                list = (repChar ? repChar.get('controlledby') : token.get('controlledby'));
                return (list ? list.split(/,/) : []);
            }()) : [];

        _.each(modlist.order,function(f){
            switch(f){
                case 'tofront':
                    toFront(token);
                    break;

                case 'toback':
                    toBack(token);
                    break;
            }
        });
        _.each(modlist.on,function(f){
            mods[f]=true;
        });
        _.each(modlist.off,function(f){
            mods[f]=false;
        });
        _.each(modlist.flip,function(f){
            mods[f]=!token.get(f);
        });
        _.each(modlist.set,function(f,k){
            switch(k) {
                case 'controlledby':
                    _.each(f, function(cb){
                        switch(cb.operation){
                            case '=': controlList=[cb.pid]; break;
                            case '+': controlList=_.union(controlList,[cb.pid]); break;
                            case '-': controlList=_.without(controlList,cb.pid); break;
                        }
                    });
                    if(repChar){
                        repChar.set('controlledby',controlList.join(','));
                    } else {
                        mods[k]=controlList.join(',');
                    }
                    forceLightUpdateOnPage(token.get('pageid'));
                    break;

                case 'defaulttoken':
                    if(repChar){
                        token.set(mods);
                        setDefaultTokenForCharacter(repChar,token);
                    }
                    break;

                case 'statusmarkers':
                    _.each(f, function (sm){
                        mods.statusmarkers = sm.getMods(mods.statusmarkers).statusmarkers;
                    });
                    break;

                case 'represents':
                    mods[k]=f[0];
                    mods.bar1_link='';
                    mods.bar2_link='';
                    mods.bar3_link='';
                    break;

                case 'bar1_link':
                case 'bar2_link':
                case 'bar3_link':
                    if( '' === f[0] ) {
                        mods[k]='';
                    } else {
                        cid=mods.represents || token.get('represents') || '';
                        if('' !== cid) {
                            delta=findObjs({type: 'attribute', characterid: cid, name: f[0]}, {caseInsensitive: true})[0];
                            if(delta) {
                                mods[k]=delta.id;
                                mods[k.split(/_/)[0]+'_value']=delta.get('current');
                                mods[k.split(/_/)[0]+'_max']=delta.get('max');
                            } else {
                              let c = getObj('character',cid);
                              if(c) {
                                if(IsComputedAttr.IsComputed(c,f[0])){
                                  if(IsComputedAttr.Assignable(f[0])){
                                    mods[k]=f[0];
                                  }
                                } else {
                                  mods[k]=`sheetattr_${f[0]}`;
                                }
                              }
                            }
                        }
                    }
                    break;


                case 'baseOpacity':
                case 'fadeOpacity':
                case 'dim_light_opacity':
                    mods = Object.assign( mods, f[0].getMods(token,mods));
                    break;

                case 'left':
                case 'top':
                case 'width':
                case 'height':
                    mods = Object.assign( mods, f[0].getMods(token,mods));
                    break;

                case 'rotation':
                case 'limit_field_of_vision_center':
                case 'limit_field_of_night_vision_center':
                case 'directional_bright_light_center':
                case 'directional_dim_light_center':
                    delta=getRelativeChange(token.get(k),f[0]);
                    if(_.isNumber(delta)) {
                        mods[k]=(((delta%360)+360)%360);
                    }
                    break;

                case 'light_angle':
                case 'light_losangle':
                case 'limit_field_of_vision_total':
                case 'limit_field_of_night_vision_total':
                case 'directional_bright_light_total':
                case 'directional_dim_light_total':
                    delta=getRelativeChange(token.get(k),f[0]);
                    if(_.isNumber(delta)) {
                        mods[k] = Math.min(360,Math.max(0,delta));
                    }
                    break;

                case 'light_radius':
                case 'light_dimradius':
                case 'light_multiplier':
                case 'light_sensitivity_multiplier':
                case 'aura2_radius':
                case 'aura1_radius':
                case 'adv_fow_view_distance':
                case 'night_vision_distance':
                case 'bright_light_distance':
                case 'low_light_distance':
                case 'night_distance':
                case 'bright_distance':
                case 'low_distance':
                    mods = Object.assign( mods, f[0].getMods(token,mods));
                    break;


                case 'bar1_reset':
                case 'bar2_reset':
                case 'bar3_reset': {
                    let field = k.replace(/_reset$/,'_max');
                    delta = mods[field] || token.get(field);
                    if(!_.isUndefined(delta)) {
                      mods[k.replace(/_reset$/,'_value')]=delta;
                    }
                  }
                  break;


                case 'bar1_value':
                case 'bar2_value':
                case 'bar3_value':
                    if(regex.numberString.test(f[0])){
                        delta=getRelativeChange(token.get(k),f[0]);
                        if(_.isNumber(delta) || _.isString(delta)) {
                          if(/!$/.test(f[0])) {
                            delta = Math.max(0,Math.min(delta,token.get(k.replace(/_value$/,'_max'))));
                          }
                          let link = token.get(k.replace(/_value$/,'_link'));
                          if(IsComputedAttr.Check(link)) {
                            if(!IsComputedAttr.Readonly(link)){
                              setComputed({characterId:token.get('represents'),property:link,args:[delta]});
                              mods[k]=delta;
                            }
                          } else {
                            mods[k]=delta;
                          }
                        }
                      } else {
                          mods[k]=f[0];
                      }
                    break;

                case 'bar1_max':
                case 'bar2_max':
                case 'bar3_max':
                    if(regex.numberString.test(f[0])){
                        delta=getRelativeChange(token.get(k),f[0]);
                        if(_.isNumber(delta) || _.isString(delta)) {
                          let link = `${token.get(k.replace(/_max$/,'_link'))}_max`;
                          if(IsComputedAttr.Check(link)) {
                            if(!IsComputedAttr.Readonly(link)){
                              setComputed({characterId:token.get('represents'),property:link,args:[delta]});
                              mods[k]=delta;
                            }
                          } else {
                            mods[k]=delta;
                          }
                        }
                      } else {
                          mods[k]=f[0];
                      }
                    break;
                case 'name':
                    if(regex.numberString.test(f[0])){
                        delta=getRelativeChange(token.get(k),f[0]);
                        if(_.isNumber(delta) || _.isString(delta)) {
                            mods[k]=delta;
                        }
                      } else {
                          mods[k]=f[0];
                      }
                    break;

                  case 'currentSide':
                  case 'currentside':
                    mods = Object.assign( mods, f[0].getMods(token,mods));
                    break;
                  case 'imgsrc':
                    mods = Object.assign( mods, f[0].getMods(token,mods));
                    break;

                  case 'aura1_color':
                  case 'aura2_color':
                  case 'tint_color':
                  case 'night_vision_tint':
                  case 'lightColor':
                    mods[k]=f[0].applyTo(token.get(k)).toHTML();
                    break;

                case 'night_vision_effect':
                  mods[k]=f[0](token,mods);
                  break;

/*
                case 'light_sensitivity_multiplier':
                    // {type: 'number'},
                    break;

                    // 'None', 'Dimming', 'Nocturnal'
                    break;
                case 'bar_location':
                  // null, 'overlap_top', 'overlap_bottom', 'below'
                  break;

                case 'compact_bar':
                  // null, 'compact'
                  break;
*/

                default:
                    mods[k]=f[0];
                    break;
            }
        });

      // move ops
        _.each(modlist.move,function(f){
          mods = Object.assign(mods, f.getMods(token,mods));
        });

        mods = doSetWithWorkerOnLinkedBars(token,mods);

        token.set(mods);
        notifyObservers('tokenChange',token,ctx.prev);
        return ctx;
    };

    const getWho = (()=> {
        let cache={};
        return (ids) => {
            let names = [];
            ids.forEach(id=>{
                if(cache.hasOwnProperty(id)){
                    names.push(cache[id]);
                } else {
                    if('all'===id){
                        cache.all = 'all';
                        names.push('all');
                    } else {
                        let p = findObjs({ type: 'player', id})[0];
                        if(p){
                            cache[id]=p.get('displayname');
                            names.push(cache[id]);
                        }
                    }
                }
            });
            if(names.includes('all')){
                return ['all'];
            }
            if(0===names.length){
                return ['gm'];
            }
            return names;
        };
    })();

    const doReports = (ctx,reports,callerWho) => {
        const transforms = {
            identity: a=>a,
            addOne: a=>a+1
        };

        const getTransform = (p) => {
            switch(p){
                case 'currentSide': return transforms.addOne;
                default: return transforms.identity;
            }
        };


        const getChange = (()=> {
          const charName = (cid) => (getObj('character',cid)||{get:()=>'[Missing]'}).get('name');
          const attrName = (aid) => (/^sheetattr_/.test(aid) ? aid.replace(/^sheetattr_/,'') : (getObj('attribute',aid)||{get:()=>'[Missing]'}).get('name'));
          const playerName = (pid) => (getObj('player',pid)||{get:()=>pid}).get('_displayname');
          const nameList = (pl) => pl.split(/\s*,\s*/).filter(s=>s.length).map(playerName).join(', ');
          const boolName = (b) => (b ? 'true' : 'false');
          
          const diffNum = (was,is) => is-was;
          const showDiff = (was,is) => `${was} -> ${is}`;
          const funcs = {
            boolean:  (was,is) => showDiff(boolName(was),boolName(is)), 
            number: diffNum,
            degrees: diffNum,
            circleSegment: diffNum,
            numberBlank: diffNum,
            sideNumber: diffNum,
            text: (was,is) => showDiff(was,is),
            status: (was,is) => showDiff(was,is),
            layer: (was,is) => showDiff(was,is),
            character_id: (was,is) => showDiff(charName(was),charName(is)),
            attribute: (was,is) => showDiff(attrName(was),attrName(is)),
            player: (was,is) => showDiff(nameList(was),nameList(is)),
            defaulttoken: (was,is) => showDiff(HE(was),HE(is))
          };

          return (type,was,is) => (funcs.hasOwnProperty(type) ? funcs[type] : ()=>'[not supported]')(was,is);

        })();

        reports.forEach( r =>{
            let pmsg = r.msg.replace(/\{(.+?)\}/g, (m,n)=>{
                let parts=n.toLowerCase().split(/[:;]/);
                let prop=unalias(parts[0]);
                let t = getTransform(prop);
    
                let mod=parts[1];

                switch(mod){
                    case 'before':
                        return t(ctx.prev[prop]);

                    case 'abschange':
                        return t(Math.abs((parseFloat(ctx.token.get(prop))||0) - (parseFloat(ctx.prev[prop]||0))));

                    case 'change':
                        return t(getChange((fields[prop]||{type:'unknown'}).type,ctx.prev[prop],ctx.token.get(prop)));

                    default:
                        return t(ctx.token.get(prop));
                }
            });

            let whoList = r.who.reduce((m, w)=>{
                switch(w){
                    case 'gm':
                        return [...new Set([...m,'gm'])];

                    case 'player':
                        return [...new Set([...m,callerWho])];

                    case 'all':
                        return [...new Set([...m,'all'])];

                    case 'token':
                        return [...new Set([...m, ...getWho(ctx.token.get('controlledby').split(/,/))])];

                    case 'character': {
                            let c = getObj('character',ctx.token.get('represents')) || {get:()=>''};
                            return [...new Set([...m, ...getWho(c.get('controlledby').split(/,/))])];
                        }

                    case 'control': {
                            let c = getObj('character',ctx.token.get('represents')) || {get:()=>''};
                            return [...new Set([
                                ...m,
                                ...getWho(ctx.token.get('controlledby').split(/,/)),
                                ...getWho(c.get('controlledby').split(/,/))
                            ])];
                        }
                }
            }, []);

            if(whoList.includes('all')){
                sendChat('',`${pmsg}`);
            } else {
                whoList.forEach(w=>sendChat('',`/w "${w}" ${pmsg}`));
            }
        });
    };

    const handleConfig = function(config, id) {
        let args, cmd, who=(getObj('player',id)||{get:()=>'API'}).get('_displayname');

        if(config.length) {
            while(config.length) {
                args=config.shift().split(/[|#]/);
                cmd=args.shift();
                switch(cmd) {
                    case 'players-can-ids':
                        if(args.length) {
                            state.TokenMod.playersCanUse_ids = filters.isTruthyArgument(args.shift());
                        } else {
                            state.TokenMod.playersCanUse_ids = !state.TokenMod.playersCanUse_ids;
                        }
                        sendChat('','/w "'+who+'" '+
                            '<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">'+
                                getConfigOption_PlayersCanIDs()+
                            '</div>'
                        );
                        break;
                    default:
                        sendChat('', '/w "'+who+'" '+
                            '<div style="padding:1px 3px;border: 1px solid #8B4513;background: #eeffee; color: #8B4513; font-size: 80%;">'+
                                '<span style="font-weight:bold;color:#990000;">Error:</span> '+
                                'No configuration setting for ['+cmd+']'+
                            '</div>'
                        );
                        break;
                }
            }
        } else {
            sendChat('','/w "'+who+'" '+
                '<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">'+
                    '<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">'+
                        'TokenMod v'+version+
                    '</div>'+
                    getConfigOption_PlayersCanIDs()+
                '</div>'
            );
        }
    };


    

const OutputDebugInfo = (msg,ids /*, modlist, badCmds */) => {
      let selMap = (msg.selected||[]).map(o=>o._id);
      let who=(getObj('player',msg.playerid)||{get:()=>'API'}).get('_displayname');
      let fMsg = HE(msg.content.replace(/<br\/>/g,'')).replace(/ /g,'&nbsp;').replace(/\$/g,'&#36;');
      let fIds = ids.map((o)=>{
        if(undefined !== o.token){
          return `${_h.bold('Token:')} ${o.token.get('name')} [${_h.code(o.token.id)}]${selMap.includes(o.token.id)?` ${_h.bold('Selected')}`:''}`;
        } else if(undefined !== o.character){
          return `${_h.bold('Character:')} ${o.character.get('name')} [${_h.code(o.character.id)}]`;
        } 
        return `${_h.bold('Unknown:')} [${_h.code(o.id)}]`;
      });

      sendChat('TokenMod: Debug',`/w "${who}" &{template:default}{{Command=${_h.pre(fMsg)}}}{{Targets=${_h.ul(...fIds)}}}`);
      
      //$d({msg:msg.content,fMsg,modlist,badCmds});
    };


  const processInlinerolls = (msg) => {
    if(msg.hasOwnProperty('inlinerolls')){
      return msg.inlinerolls
        .reduce((m,v,k) => {
          let ti=v.results.rolls.reduce((m2,v2) => {
            if(v2.hasOwnProperty('table')){
              m2.push(v2.results.reduce((m3,v3) => [...m3,(v3.tableItem||{}).name],[]).join(", "));
            }
            return m2;
          },[]).join(', ');
          return [...m,{k:`$[[${k}]]`, v:(ti.length && ti) || v.results.total || 0}];
        },[])
        .reduce((m,o) => m.replaceAll(o.k,o.v), msg.content);
    } else {
      return msg.content;
    }
  };

// */
     const handleInput = function(msg_orig) {
        try {
            if (msg_orig.type !== "api" || !/^!token-mod(\b\s|$)/.test(msg_orig.content)) {
                return;
            }

            let msg = _.clone(msg_orig);
            let who=(getObj('player',msg_orig.playerid)||{get:()=>'API'}).get('_displayname');
            let playerid = msg.playerid;
            let args;
            let cmds;
            let ids=[];
            let ignoreSelected = false;
            let pageRestriction=[];
            let modlist={
                    flip: [],
                    on: [],
                    off: [],
                    set: {},
                    move: [],
                    order: []
                };
            let reports=[];

			msg.content = processInlinerolls(msg);

            args = msg.content
                .replace(/<br\/>\n/g, ' ')
                .replace(/(\{\{(.*?)\}\})/g," $2 ")
                .split(/\s+--/);

            let IsDebugRequest = false;
            let Debug_UnrecognizedCommands = [];


			while(args.length) {
				cmds=args.shift().match(/([^\s]+[|#]'[^']+'|[^\s]+[|#]"[^"]+"|[^\s]+)/g);
				let cmd = cmds.shift();
				switch(cmd) {
					case 'help-statusmarkers': {
              let context = {
                who,
                playerid:msg.playerid
              };
              sendChat('', '/w "'+who+'" '+ helpParts.helpStatusMarkers(context));
            }
            return;

					case 'rebuild-help': {
              assureHelpHandout(true);
              let context = {
                who,
                playerid:msg.playerid
              };

              sendChat('', `/w "${who}" ${helpParts.rebuiltHelp(context)}`);

            }
            return;

					case 'help':

// !tokenmod --help [all]
// just the top part and ToC

// !tokenmod --help
// just the top part and ToC

// !tokenmod --help[-only] [set|on|off|flip|config]
// top part, plus the command parts
// -only leaves off top part

// !tokenmod --help[-only] <property> [<properties...]
// top part, command part, property part
// -only leaves off top and command 

// !tokenmod --help <full command>
// explains the parts command


						showHelp(playerid);
						return;

					case 'api-as':
						if('API' === playerid){
							let player = getObj('player',cmds[0]);
							if(player){
								playerid = player.id;
								who = player.get('_displayname');
							}
						}
						break;

					case 'debug': {
						IsDebugRequest = true;
          }
          break;

					case 'config':
						if(playerIsGM(playerid)) {
							handleConfig(cmds,playerid);
						}
						return;


					case 'flip':
						modlist.flip=_.union(_.filter(cmds.map(unalias),filters.isBoolean),modlist.flip);
						break;

					case 'on':
						modlist.on=_.union(_.filter(cmds.map(unalias),filters.isBoolean),modlist.on);
						break;

					case 'off':
						modlist.off=_.union(_.filter(cmds.map(unalias),filters.isBoolean),modlist.off);
						break;

					case 'set':
						modlist.set=parseSetArguments(cmds,modlist.set);
						break;

					case 'order':
						modlist.order=parseOrderArguments(cmds,modlist.order);
						break;

					case 'report':
						reports= parseReportArguments(cmds,reports);
						break;

					case 'move':
						modlist.move = parseMoveArguments(cmds,modlist.move);
						break;

					case 'ignore-selected':
						ignoreSelected=true;
						break;

					case 'active-pages':
						pageRestriction=getActivePages();
						break;

					case 'current-page':
						pageRestriction=[getPageForPlayer(playerid)];
						break;

					case 'ids':
						ids=_.union(cmds,ids);
						break;

					default:
            Debug_UnrecognizedCommands.push({cmd,args:cmds});
            break;
				}
			}
			modlist.off=_.difference(modlist.off,modlist.on);
			modlist.flip=_.difference(modlist.flip,modlist.on,modlist.off);
			if( !playerIsGM(playerid) && !state.TokenMod.playersCanUse_ids ) {
				ids=[];
			}

			if(!ignoreSelected) {
				ids=_.union(ids,_.pluck(msg.selected,'_id'));
			}

			let pageFilter = pageRestriction.length
				? (o) => pageRestriction.includes(o.get('pageid'))
				: () => true;

			ids = [...new Set([...ids])]
				.map(function(t){
					return {
						id: t,
						token: getObj('graphic',t),
						character: getObj('character',t)
					};
				});

			if(IsDebugRequest){
        OutputDebugInfo(msg_orig,ids,modlist,Debug_UnrecognizedCommands);
			}

			if(ids.length){
				[...new Set(ids.reduce(function(m,o){
					if(o.token){
						m.push(o.token);
					} else if(o.character){
						m=_.union(m,findObjs({type:'graphic',represents:o.character.id}));
					}
					return m;
				},[]))]
          .filter(o=>undefined !== o)
          .filter(pageFilter)
          .forEach((t) => {
            let ctx = applyModListToToken(modlist,t);
            doReports(ctx,reports,who);
          });
			}
        } catch (e) {
            let who=(getObj('player',msg_orig.playerid)||{get:()=>'API'}).get('_displayname');
            sendChat('TokenMod',`/w "${who}" `+
                `<div style="border:1px solid black; background-color: #ffeeee; padding: .2em; border-radius:.4em;" >`+
                    `<div>There was an error while trying to run your command:</div>`+
                    `<div style="margin: .1em 1em 1em 1em;"><code>${msg_orig.content}</code></div>`+
                    `<div>Please <a class="showtip tipsy" title="The Aaron's profile on Roll20." style="color:blue; text-decoration: underline;" href="https://app.roll20.net/users/104025/the-aaron">send me this information</a> so I can make sure this doesn't happen again (triple click for easy select in most browsers.):</div>`+
                    `<div style="font-size: .6em; line-height: 1em;margin:.1em .1em .1em 1em; padding: .1em .3em; color: #666666; border: 1px solid #999999; border-radius: .2em; background-color: white;">`+
                        JSON.stringify({msg: msg_orig, version:version, stack: e.stack, API_Meta})+
                    `</div>`+
                `</div>`
            );
        }

    };

    const registerEventHandlers = function() {
        on('chat:message', handleInput);
        on('change:campaign:_token_markers',()=>StatusMarkers.init());
    };

    on("ready",() => {
        checkInstall();
        registerEventHandlers();
    });

    return {
        ObserveTokenChange: observeTokenChange
    };
})();

{try{throw new Error('');}catch(e){API_Meta.TokenMod.lineCount=(parseInt(e.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/,'$1'),10)-API_Meta.TokenMod.offset);}}


//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//   TOKEN ACTION MAKER
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
var tokenAction = tokenAction || (function () {
    'use strict';
    // Create dropdown Query menu
    // checkType is 'save' or 'check'
    // npc flag is boolean
    // selectedMacro will output a @{selected|} macro if set to true
    const createDropDown = (checkType, npc = false, selectedMacro = false) => {
        const skillLabels = ['Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 'Sleight Of Hand', 'Stealth', 'Survival'];
        const skillArray = skillLabels.map(a => a.replace(/\s/g, '_'))
        const abilityArray = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
        const npcSaveArray = abilityArray.map((ab) => ab.slice(0, 3).toUpperCase());
        let template = (npc) ? 'npc' : 'simple', // NPC alternates
            npcPrefix = (npc) ? 'npc_' : '',
            pcSuffix = (npc) ? '' : '_bonus',
            npcName = (npc) ? '@{npc_name_flag}' : '',
            saveArray = (npc) ? npcSaveArray : abilityArray;

        if (checkType === 'check') { // Skills & Ability Checks
            let skillMacroArray = skillArray.map((sk, i) => `|${skillLabels[i]},+@{${npcPrefix}${sk}${pcSuffix}}@{pbd_safe}[${(skillLabels[i] + ' ').slice(0, skillLabels[i].indexOf(' '))}]]]&#125;&#125; {{rname=${skillLabels[i]}&#125;&#125; {{mod=@{${npcPrefix}${sk}${pcSuffix}}&#125;&#125; {{r1=[[@{d20} + @{${npcPrefix}${sk}${pcSuffix}}@{pbd_safe}[${(skillLabels[i] + ' ').slice(0, skillLabels[i].indexOf(' '))}]]]`),
                abilityMacroArray = abilityArray.map((ab, i) => `|${ab},+@{${ab}_mod}@{jack_attr}[${npcSaveArray[i]}]]]&#125;&#125; {{rname=${ab}&#125;&#125; {{mod=@{${ab}_mod}@{jack_bonus}&#125;&#125; {{r1=[[ @{d20} + @{${ab}_mod}@{jack_attr}[${npcSaveArray[i]}]]]`),
                abilityMacro = `@{wtype}&{template:${template}} ${npcName} @{rtype}?{Ability${skillMacroArray.join('')}${abilityMacroArray.join('')}}}} {{global=@{global_skill_mod}}} {{type=Check}} {{typec=Check}} @{charname_output}`;
            return (selectedMacro) ? abilityMacro.replace(/@{/g, '@{selected|') : abilityMacro;
        }

        if (checkType === 'save') { // Saves
            let saveMacroArray = abilityArray.map((ab, i) => `|${ab}, +@{${npcPrefix}${saveArray[i]}_save${pcSuffix}}@{pbd_safe}[${npcSaveArray[i]} SAVE]]]&#125;&#125; {{rname=${ab} Save&#125;&#125 {{mod=@{${ab}_save_bonus}&#125;&#125; {{r1=[[@{d20}+@{${npcPrefix}${saveArray[i]}_save${pcSuffix}}@{pbd_safe}[${npcSaveArray[i]} SAVE]]]`),
                saveMacro = `@{wtype}&{template:${template}} ${npcName} @{rtype}?{Saving Throw${saveMacroArray.join('')}}}} {{global=@{global_save_mod}}} {{type=Save}} {{typec=Save}} @{charname_output}`;
            return (selectedMacro) ? saveMacro.replace(/@{/g, '@{selected|') : saveMacro;
        }
    }
    //end Oosh function

    var version = '0.3.7',
        sheetVersion = 'D&D 5th Edition by Roll20',
        sheet = '5e',
        checkInstall = function () {
            log('TokenAction v' + version + ' is ready!  Designed for use with the ' + sheetVersion + ' character sheet!');
        },

        getRepeatingAction = (id, action, usename) => {
            const name = usename ? getObj('character', id).get('name') : id;
            return `%{${name}|${action}}`;
        },

        abbreviateName = (name) => {
            name = name.replace(" (One-Handed)", "-1H");
            name = name.replace(" (Two-Handed)", "-2H");
            name = name.replace(" (Melee; One-Handed)", "-1Hm");
            name = name.replace(" (Melee; Two-Handed)", "-2Hm");
            name = name.replace(" (Psionics)", "(Psi)");
            name = name.replace(" (Melee)", "-m");
            name = name.replace(" (Ranged)", "-r");
            name = name.replace("swarm has more than half HP", "HP>Half");
            name = name.replace("swarm has half HP or less", "HP<=Half");
            name = name.replace(/\s\(Recharge(.*)Short or Long Rest\)/, "-(R Short/Long)");
            name = name.replace(/\s\(Recharge(.*)Short Rest\)/, "-(R Short)");
            name = name.replace(/\s\(Recharge(?=.*Long Rest)(?:(?!Short).)*\)/, "-(R Long)");
            name = name.replace(/\sVariant\)/, '\)');
            name = name.replace(/\s\(Recharge\s(.*)\)/, '-\(R$1\)');
            name = name.replace(/\s\(Costs\s(.*)\sActions\)/, '-\($1a\)');
            name = name.replace(/\s\(Costs\s(.*)\sActions\)/, '-\($1a\)');
            //                  PF2
            name = name.replace(/<One Action>/i, '<1>');
            name = name.replace(/<Two Actions>/i, '<2>');
            name = name.replace(/<Three Actions>/i, '<3>');
            return name;
        },


        getRepeatingTrait = (id, trait, usename) => {
            const name = usename ? getObj('character', id).get('name') : id;
            return `%{${name}|${trait}}`;
        },

        getRepeatingReaction = (id, reaction, usename) => {
            const name = usename ? getObj('character', id).get('name') : id;
            return `%{${name}|${reaction}}`;
        },

        titleCase = function (str) {
            str = str.toLowerCase();
            str = str.split(' ');
            for (var i = 0; i < str.length; i++) {
                str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);

            }
            return str.join(' ');
        },


        getFirstCharacters = function (str) {
            let result = [];

            str.split(' ').map(word => word.charAt(0) != '' ? result.push(word.charAt(0)) + result.push(word.charAt(1)) : '');
            let abbreviation = result.join('');
            //if (str.includes('+1')){abbreviation = abbreviation.replace('+','+1')};
            return abbreviation;
        },

        getSelectedCharacters = function (selected) {
            return _.chain(selected)
                .map(function (s) {
                    return getObj(s._type, s._id);
                })
                .reject(_.isUndefined)
                .map(function (c) {
                    return getObj('character', c.get('represents'));
                })
                .filter(_.identity)
                .value();
        },

        createAbility = function (name, pattern, id) {
            var checkAbility = findObjs({
                _type: 'ability',
                _characterid: id,
                name: name
            });

            if (checkAbility[0]) {
                checkAbility[0].set({
                    action: pattern
                });
            } else {
                name = titleCase(name);
                createObj('ability', {
                    name: name,
                    action: pattern,
                    characterid: id,
                    istokenaction: true
                });
            }
        },

        createRepeating = function (name, pattern, id, usename) {
            var repeatingAttrs = filterObjs(function (o) {
                return o.get('type') === 'attribute' && o.get('characterid') === id && o.get('name').match(name);
            });

            _.each(repeatingAttrs, function (attr) {
                var repeatingId = attr.get('name').split('_')[2],
                    //PF2 actionCost is for PF2
                    actionCost = ((attr.get('name').includes('repeating_actions-activities')) ? ' <' + getAttrByName(id, 'repeating_actions-activities_' + repeatingId + '_actions') + '>' : ''),
                    actionCost = actionCost.replace(' <>', ''),
                    repeatingName = abbreviateName((attr.get('current').replace(/\.\s*$/, "")) + actionCost),
                    repeatingName = ((pattern.includes('npcaction-l')) ? 'l-' + repeatingName : repeatingName),
                    repeatingName = ((pattern.includes('npcaction-m')) ? 'm-' + repeatingName : repeatingName),
                    repeatingName = titleCase(repeatingName),
                    //repeatingName = (sheet === 'pf2' && pattern.includes('repeating_melee-strikes')) ?repeatingName + '-m': repeatingName,
                    repeatingName = (sheet === 'pf2' && pattern.includes('repeating_ranged-strikes')) ? repeatingName + '-R' : repeatingName,

                    repeatingAction = getRepeatingAction(id, pattern.replace(/%%RID%%/g, repeatingId), usename),


                    checkAbility = findObjs({
                        _type: 'ability',
                        _characterid: id,
                        name: repeatingName
                    });

                if (checkAbility[0]) {
                    checkAbility[0].set({
                        action: repeatingAction
                    });
                } else {
                    createObj("ability", {
                        name: repeatingName,
                        action: repeatingAction,
                        characterid: id,
                        istokenaction: true
                    });

                    if (sheet === 'pf2' && repeatingAction.includes('ATTACK-DAMAGE-NPC')) {
                        createObj("ability", {
                            name: getFirstCharacters(repeatingName) + ((repeatingName.includes('-R')) ? '-R2' : '2'),
                            action: repeatingAction.replace('ATTACK-DAMAGE-NPC', 'ATTACK-DAMAGE-NPC2'),
                            characterid: id,
                            istokenaction: true
                        });
                        createObj("ability", {
                            name: getFirstCharacters(repeatingName) + ((repeatingName.includes('-R')) ? '-R3' : '3'),
                            action: repeatingAction.replace('ATTACK-DAMAGE-NPC', 'ATTACK-DAMAGE-NPC3'),
                            characterid: id,
                            istokenaction: true
                        });
}
                    if (sheet === 'pf2' && repeatingAction.includes('ATTACK-DAMAGE') && !repeatingAction.includes('ATTACK-DAMAGE-NPC')) {
                        createObj("ability", {
                            name: getFirstCharacters(repeatingName) + ((repeatingName.includes('-R')) ? '-R2' : '2'),
                            action: repeatingAction.replace('ATTACK-DAMAGE', 'ATTACK-DAMAGE2'),
                            characterid: id,
                            istokenaction: true
                        });
                        createObj("ability", {
                            name: getFirstCharacters(repeatingName) + ((repeatingName.includes('-R')) ? '-R3' : '3'),
                            action: repeatingAction.replace('ATTACK-DAMAGE', 'ATTACK-DAMAGE3'),
                            characterid: id,
                            istokenaction: true
                        });

                    }


                }
            });
        },





        isNpc = function (id) {

            if (sheet === '5e') {
                var checkNpc = findObjs({
                    _type: 'attribute',
                    _characterid: id,
                    name: 'npc'
                });
                if (_.isUndefined(checkNpc[0])) {
                    return false;
                } else {
                    return checkNpc[0].get('current');
                }
            } else {
                //pf2
                var checkNpc = findObjs({
                    _type: 'attribute',
                    _characterid: id,
                    name: 'sheet_type'
                });
                if (_.isUndefined(checkNpc[0]) || checkNpc[0].get('current') === 'character') {
                    return "0";
                } else {
                    return "1";
                }
            }
        },

        deleteAbilities = function (id) {
            var abilities = findObjs({
                _type: 'ability',
                _characterid: id
            });
            _.each(abilities, function (r) {
                let abilityName = r.get('name');
                if (abilityName.includes(".", -1)) {
                } else {
                    r.remove();
                };
            });
        },

        deleteAllAbilities = function (id) {
            var abilities = findObjs({
                _type: 'ability',
                _characterid: id
            });
            _.each(abilities, function (r) {
                let abilityName = r.get('name');
                r.remove();
            });
        },


        createPF2Spell = function (id) {
            var checkAbility = findObjs({
                _type: 'ability',
                _characterid: id,
                name: 'Spells'
            }),
                repeatingAttrs = filterObjs(function (o) {//Gets all repeating attributes belonging to character
                    return o.get('type') === 'attribute' && o.get('characterid') === id; //&& o.get('name').match(/repeating_normalaspells-[^_]+_name\b/);
                });



            //###spellinate
            var allSpellInnate = repeatingAttrs.filter(name => {
                return name.get('name').includes('repeating_spellinnate');
            });
            let allSpellInnateText = "";
            allSpellInnate.forEach(a => {
                if (a.get('name').includes('_name')) {
                    allSpellInnateText = allSpellInnateText + '[' + a.get('current') + '](~selected|' + a.get('name').replace('_name', '_spellroll') + ')\n';
                }
            }
            )
            if (allSpellInnateText) { allSpellInnateText = '**Innate Spells**\n' + allSpellInnateText };

            //###SpellFocus
            var allSpellFocus = repeatingAttrs.filter(name => {
                return name.get('name').includes('repeating_spellfocus');
            });
            let allSpellFocusText = "";
            allSpellFocus.forEach(a => {
                if (a.get('name').includes('_name')) {

                    allSpellFocusText = allSpellFocusText + '[' + a.get('current') + '](~selected|' + a.get('name').replace('_name', '_spellroll') + ')\n';
                }
            }
            )
            if (allSpellFocusText) { allSpellFocusText = '**Focus Spells**\n' + allSpellFocusText };


            //###Cantrips
            var allCantrips = repeatingAttrs.filter(name => {
                return name.get('name').includes('repeating_cantrip');
            });
            let allCantripsText = "";
            allCantrips.forEach(a => {
                if (a.get('name').includes('_name')) {

                    allCantripsText = allCantripsText + '[' + a.get('current') + '](~selected|' + a.get('name').replace('_name', '_spellroll') + ') ';
                }
            }
            )
            if (allCantripsText) { allCantripsText = '**Cantrips**\n' + allCantripsText + '\n' };

            //###Normal Spells
            var allNormalSpells = repeatingAttrs.filter(name => {
                return name.get('name').includes('repeating_normalspells');
            });
            let allNormalSpellsText = "";
            let allLevelledSpellsText = "";
            let combinedLevelledSpellsText = "";

            let spellLevel = 1;
            let levelCounter = 1;
            let level = "1";

            while (levelCounter < 10) {
                level = levelCounter.toString();
                allNormalSpells.forEach(a => {
                    if (a.get('name').includes('_name')) {
                        spellLevel = getAttrByName(id, a.get('name').replace('name', 'current_level'));//gets level of current spell
                        if (spellLevel === level) {
                            allLevelledSpellsText = allLevelledSpellsText + '[' + a.get('current') + '](~selected|' + a.get('name').replace('_name', '_spellroll') + ') ';
                        }
                    }
                }
                )

                if (allLevelledSpellsText) { combinedLevelledSpellsText = combinedLevelledSpellsText + '\nLevel ' + level + '\n' + allLevelledSpellsText };
                allLevelledSpellsText = '';
                levelCounter++;
            }
            if (combinedLevelledSpellsText) { allNormalSpellsText = '**Normal Spells**' + combinedLevelledSpellsText };


            let spellChatMenu = `/w "@{selected|character_name}" &{template:rolls} {{charactername=@{selected|character_name}}} {{header=Spells}} {{desc=${allSpellInnateText}${allSpellFocusText}${allCantripsText}${allNormalSpellsText}}}`

            if (allSpellInnateText || allSpellFocusText || allCantripsText || allNormalSpellsText) {
                if (checkAbility[0]) {
                    checkAbility[0].set({
                        action: spellChatMenu
                    });
                } else {
                    createObj("ability", {
                        name: 'Spells',
                        action: spellChatMenu,
                        characterid: id,
                        istokenaction: true
                    });
                }
            }


        },


        createSpell = function (id) {
            var checkAbility = findObjs({
                _type: 'ability',
                _characterid: id,
                name: 'Spells'
            }),
                repeatingAttrs = filterObjs(function (o) {
                    return o.get('type') === 'attribute' && o.get('characterid') === id && o.get('name').match(/repeating_spell-[^{(np)][\S+_[^_]+_spellname\b/);
                }),
                spellText = "",
                sk = [],
                sb = {
                    'Cantrips': [],
                    '1st': [],
                    '2nd': [],
                    '3rd': [],
                    '4th': [],
                    '5th': [],
                    '6th': [],
                    '7th': [],
                    '8th': [],
                    '9th': []
                };

            if (!repeatingAttrs[0]) {
                return;
            }

            _.each(repeatingAttrs, function (s) {
                var level = s.get('name').split('_')[1].replace('spell-', ''),
                    apiButton = "[" + s.get('current') + "](~repeating_spell-" + level + "_" + s.get('name').split('_')[2] + "_spell)";

                if (level === "1") {
                    level = "1st";
                } else if (level === "2") {
                    level = "2nd";
                } else if (level === "3") {
                    level = "3rd";
                } else if (level === "4") {
                    level = "4th";
                } else if (level === "5") {
                    level = "5th";
                } else if (level === "6") {
                    level = "6th";
                } else if (level === "7") {
                    level = "7th";
                } else if (level === "8") {
                    level = "8th";
                } else if (level === "9") {
                    level = "9th";
                } else {
                    level = "Cantrips";
                }

                sb[level].push(apiButton);
                sb[level].sort();
            });

            sk = _.keys(sb);

            _.each(sk, function (e) {
                if (_.isEmpty(sb[e])) {
                    sb = _.omit(sb, e);
                }
            });

            sk = _.keys(sb);

            _.each(sk, function (e) {
                spellText += "**" + e + ":**" + "\n" + sb[e].join(' | ') + "\n\n";
            });

            if (checkAbility[0]) {
                checkAbility[0].set({
                    action: "/w @{character_name} &{template:atk} {{desc=" + spellText + "}}"
                });
            } else {
                createObj("ability", {
                    name: 'Spells',
                    action: "/w @{character_name} &{template:atk} {{desc=" + spellText + "}}",
                    characterid: id,
                    istokenaction: true
                });
            }
        },

        sortRepeating = function (name, pattern, id, usename) {
            var repeatingAttrs = filterObjs(function (o) {
                return o.get('type') === 'attribute' && o.get('characterid') === id && o.get('name').match(name);
            }),
                sorted = _.sortBy(repeatingAttrs, (o) => o.get('current'));

            _.each(sorted, function (attr) {
                var repeatingId = attr.get('name').split('_')[2],
                    //repeatingName = "a-" + attr.get('current'),
                    repeatingName = "a-" + abbreviateName(attr.get('current').replace(/\.\s*$/, "")),

                    repeatingAction = repeatingAction = getRepeatingAction(id, pattern.replace(/%%RID%%/g, repeatingId), usename);

                //5e Replacements
                if (pattern.match('npcaction-l')) {
                    repeatingName = "al-" + abbreviateName(attr.get('current').replace(/\.\s*$/, ""));
                }
                if (pattern.match('bonusaction')) {
                    repeatingName = "b-" + abbreviateName(attr.get('current').replace(/\.\s*$/, ""));
                }



                //PF2 replacements
                if (pattern.match('free-actions-reactions_')) {
                    repeatingName = "r-" + abbreviateName(attr.get('current').replace(/\.\s*$/, ""));
                }
                if (pattern.match('ATTACK-DAMAGE-NPC')) {
                    repeatingName = "a-" + abbreviateName(attr.get('current').replace(/\.\s*$/, ""));
                }




                var checkAbility = findObjs({
                    _type: 'ability',
                    _characterid: id,
                    name: repeatingName
                });
                if (checkAbility[0]) {
                    checkAbility[0].set({
                        action: repeatingAction
                    });
                } else {
                    createObj("ability", {
                        name: repeatingName,
                        action: repeatingAction,
                        characterid: id,
                        istokenaction: true
                    });




                    if (sheet === 'pf2' && repeatingAction.includes('ATTACK-DAMAGE-NPC')) {
                        createObj("ability", {
                            name: getFirstCharacters(repeatingName) + ((repeatingName.includes('-R')) ? '-R2' : '2'),
                            action: repeatingAction.replace('ATTACK-DAMAGE-NPC', 'ATTACK-DAMAGE-NPC2'),
                            characterid: id,
                            istokenaction: true
                        });
                        createObj("ability", {
                            name: getFirstCharacters(repeatingName) + ((repeatingName.includes('-R')) ? '-R3' : '3'),
                            action: repeatingAction.replace('ATTACK-DAMAGE-NPC', 'ATTACK-DAMAGE-NPC3'),
                            characterid: id,
                            istokenaction: true
                        });

                    }


                }
            });
        },

        handleInput = function (msg) {
            var char;
            var keywords = ['attacks', 'bonusactions', 'spells', 'abilities', 'saves', 'checks', 'traits', 'reactions', 'init', 'pf2', 'offensive'];
            if (!(msg.type === 'api' && msg.selected && (msg.content.search(/^!ta\b/) || msg.content.search(/^!deleteta\b/) || msg.content.search(/^!deleteallta\b/) || msg.content.search(/^!sortta\b/)))) return;
            let whom = `"${msg.who.replace(' (GM)', '')}"`;
            var args = msg.content.split(" ");
            const usename = args.includes('name') ? true : false;
            sheet = ((args.includes('pf2')) ? 'pf2' : '5e');
            //log('sheet is ' + sheet);

            if (msg.content.search(/^(!ta|!sortta)\b/) !== -1) {
                let baseCommand = args[0];

                if (sheet === '5e') {
                    if (args.includes('pc')) {
                        args = [baseCommand, 'attacks', 'spells', 'checks', 'saves', 'reactions', 'init'];
                    }
                    if (args.includes('pc') && args.includes('name')) {
                        args = [baseCommand, 'name', 'attacks', 'spells', 'checks', 'saves', 'reactions', 'init'];
                    }
                    if (args.length === 1) {
                        args = [baseCommand, 'attacks', 'bonusactions', 'spells', 'checks', 'saves', 'traits', 'reactions', 'init'];
                    }
                    if (args.length === 2 && args.includes('name')) {
                        args = [baseCommand, 'name', 'attacks', 'bonusactions', 'spells', 'checks', 'saves', 'traits', 'reactions', 'init'];
                    }
                } else {//pf2
                    if (args.includes('pc')) {
                        args = [baseCommand, 'pf2', 'attacks', 'automatic', 'reactive', 'innate', 'offensive', 'spells', 'actions', 'focus', 'ritual', 'checks', 'saves', 'init'];
                    }
                    if (args.includes('pc') && args.includes('name')) {
                        args = [baseCommand, 'pf2', 'name', 'attacks', 'automatic', 'reactive', 'innate', 'offensive', 'spells', 'actions', 'focus', 'ritual', 'checks', 'saves', 'init'];
                    }
                    if (args.length === 2) {
                        args = [baseCommand, 'pf2', 'attacks', 'automatic', 'reactive', 'interaction', 'innate', 'offensive', 'spells', 'actions', 'focus', 'ritual', 'checks', 'saves', 'init'];
                    }
                    if (args.length === 3 && args.includes('name')) {
                        args = [baseCommand, 'pf2', 'name', 'attacks', 'automatic', 'reactive', 'interaction', 'innate', 'offensive', 'spells', 'actions', 'focus', 'ritual', 'checks', 'saves', 'init'];
                    }
                    //log('args = ' + args);
                }



                if (args.includes("help")) {
                    let header = "<div style='width: 100%; color: #000; border: 1px solid #000; background-color: #fff; box-shadow: 0 0 3px #000; width: 90%; display: block; text-align: left; font-size: 13px; padding: 5px; margin-bottom: 0.25em; font-family: sans-serif; white-space: pre-wrap;'>";
                    let helpText = `<b>Token Action Creator</b> <i>v. ${version} </i><p><em>By keithcurtis, based on original code by kevin, with assitance and additions by Oosh, GiGs, and bretmckee</em></p><p>This script creates token actions on selected tokens for the D&amp;D 5e by Roll20 sheet. Tokens must represent character sheets, either PC or NPC.</p><blockquote><p><em>0.2.9, the script will also abbreviate common phrases like &quot;(One Handed)&quot; to &quot;-1H&quot;.</em></p><p><em>0.3.3, the ability to protect specific token actions was added (put a period after the name).</em></p><p><em>0.3.4, added support for the new npc bonus action repeating field.</em></p><p><em>0.3.5, numerous fixes</em></p><p><em>0.3.6, Added support for Pathfinder 2 by Roll20 Sheet</em></p></blockquote><p><strong>!ta</strong> This command will create a full suite of token action buttons for a selected character. Actions for NPCs and Attacks for PCs.</p><p><strong>!sortta</strong> This command functions identically to !ta, but will prepend &quot;a-&quot; to NPC actions, and &quot;la-&quot; to NPC Legendary Actions. This is for users who like to alphebetize Token Actions. This is not recommended for the PF2 sheet, as it breaks the logical progression of Attack-Attack2-Attack3.</p><p><strong>!deleteta</strong> will delete unprotected token actions for the selected character. To protect a token action, end its name with a period. &quot;longsword&quot; will be deleted. &quot;longsword.&quot; will not. This allows you to keep any custom token actions from being affected by the script.</p><p><strong>!deleteallta</strong> will delete ALL token actions for the selected character, whether they were created by this script or not. Use with caution.</p><h2 id="d-d-5th-edition-by-roll20-sheet">D&amp;D 5th Edition by Roll20 Sheet</h2><p>You can create specific classes of abilities by using the following arguments separated by spaces:</p><ul><li><strong>attacks</strong> Creates a button for each attack. In the case of NPCs, this includes all Actions. (PC/NPC)</li><li><strong>trait</strong>s Creates a button for each trait. PCs can have quite a number of these, so it is not recommended to run this command on PCs. (PC*/NPC)</li><li><strong>pc</strong> creates full suite of buttons for everything but traits. Although this will also work on npcs, the intent is to not include trait buttons for pcs, which can get rather numerous. </li><li><strong>bonusactions</strong> Creates a button for each bonus action. This will be ignored on PCs since only NPC sheets have a repeating attribute for bonus actions. (NPC)</li><li><strong>reactions</strong> Creates a button for each reaction. This will be ignored on PCs since only NPC sheets have a repeating attribute for reactions. (PC)</li><li><strong>spells</strong> Creates a button that calls up a chat menu of all spells the character can cast. (PC/NPC)</li><li><strong>checks</strong> Creates a drop down menu of all Ability and Skill (Ability) checks. Recommended for NPCs, as PC checks and Saves can be affected by many different abilities as levels progress, that this script cannot account for. (PC*/NPC)</li><li><strong>saves</strong> Creates a dropdown menu of all saving throws. Recommended for NPCs, as PC checks and Saves can be affected by many different abilities as levels progress, that this script cannot account for. (PC*/NPC)</li><li><strong>init</strong> Creates a button that rolls initiative for the selected token (PC/NPC)</li><li><strong>name</strong> Normally, Token Actions are created using the character_id. They will still function even if the character is renamed. However this is not always desireable. If a character is moved to a new game via the Character Vault, it will receive a new character_id, and the token actions will not function. If you intend to move the character, use the &quot;name&quot; argument in the string and it will call the token actions by name.</li><li><strong>help</strong> Calls up this help documentation</li></ul><p>Examples:</p><p><strong>!ta saves checks</strong> will create token ability buttons for Ability Checks and Saving Throws.</p><p><strong>!ta name</strong> will create alltoken ability buttons and identify them by name, rather than character_id.</p><h2 id="pathfinder-second-edition-by-roll20-sheet">Pathfinder Second Edition by Roll20 Sheet</h2><p>All PF2 use requires adding the argument &quot;pf2&quot; to the argument list. Otherwise the script will try to create Token Actions for the 5e sheet. Until all sheets have a uniform sheet identifier attribute, this is necessary. In cases where there is an action cost, it will be indicated in the button name as <code>Action&lt;#&gt;</code>.You can create specific classes of abilities by using the following arguments separated by spaces:</p><ul><li><strong>pf2</strong> <em>Required on all PF2 commands</em></li><li><strong>attacks</strong> Creates a button for each attack. TAM will append a &#39;-M&#39; or &#39;-R&#39; after the name to distinguish melee from ranged. Each Attack will have a two buttons immediately following for Attack 2 and Attack 3. These will be abbreviated using the first two characters from each word in the Attack. Example <code>Silver Dagger</code> <code>SiDa-2</code> <code>SiDa-3</code> (PC/NPC)</li><li><strong>reactive</strong>  Creates a button for each reaction (NPC)</li><li><strong>offensive</strong>  Creates a button for each offensive ability (PC/NPC)</li><li><strong>spells</strong> Creates a button that calls up a chat menu of all spells the character can cast. These are separated by innate, focus, cantrips and normal spells. Normal Spells are separated by level. (PC/NPC)</li><li><strong>actions</strong> Creates a button for each normal action (NPC)</li><li><strong>checks</strong> Creates a drop down menu of all Skill check (PC/NPC)</li><li><strong>saves</strong> Creates a dropdown menu of all saving throws (PC/NPC)</li><li><strong>init</strong> Creates a button that rolls initiative for the selected token, obeying the skill chosen on the character sheet. The skill cannot be chosen without API interaction, so it will need to be manually chosen. (PC/NPC)</li><li><strong>name</strong> Normally, Token Actions are created using the character_id. They will still function even if the character is renamed. However this is not always desireable. If a character is moved to a new game via the Character Vault, it will receive a new character_id, and the token actions will not function. If you intend to move the character, use the &quot;name&quot; argument in the string and it will call the token actions by name.</li></ul><p>Examples:</p><p><strong>!ta pf2</strong> will generate a full suite of token actions For PCs, this would be the same as typing <code>!ta pf2 checks saves attacks offensive reactive interaction spells</code>. For PCs, this would be the same as typing <code>!ta pf2 checks saves attacks offensive spells</code>.</p><p><strong>!ta pf2 saves checks</strong> will create token ability buttons for Skill Checks and Saving Throws.</p><p><strong>!ta pf2 name</strong> will create all token ability buttons and identify them by name, rather than character_id.</p>`;
                    let footer = '</div>';
                    sendChat("TokenAction", `/w ${whom} ${header}${helpText}${footer}`);
                    return;
                }
            }




            if (msg.content.search(/^!ta\b/) !== -1) {
                char = _.uniq(getSelectedCharacters(msg.selected));

                if (args.includes("help")) {
                    let header = "<div style='width: 100%; color: #000; border: 1px solid #000; background-color: #fff; box-shadow: 0 0 3px #000; width: 90%; display: block; text-align: left; font-size: 13px; padding: 5px; margin-bottom: 0.25em; font-family: sans-serif; white-space: pre-wrap;'>";
                    let helpText = "<b>Token Action Creator</b> <i>v." + version + "</i><br><i>Created by Kevin,<br>Modified by keithcurtis</i><br>This script creates token actions on selected tokens for the D&D 5e by Roll20 sheet. Tokens must represent character sheets, either PC or NPC.<br><br><b>!ta</b> This command will create a full suite of token abilities.<br><b>!deleteta</b> will delete ALL token actions for the selected character, whether they were created by this script or not. Use with caution.<br><br>You can create specific classes of abilities by using the following arguments separated by spaces:<ul><li><b>attacks</b> Creates a button for each attack. In the case of NPCs, this includes all Actions.<br><li><b>traits</b> Creates a button for each trait. PCs can have quite a number of these, so it is not recommended to run this command on PCs.<br><li><b>reactions</b> Creates a button for each reaction. This will be ignored on PCs since only NPC sheets have a repeating attribute for reactions.<br><li><b>spells</b>Creates a button that calls up a chat menu of all spells the character can cast.<br><li><b>checks</b> Creates a drop down menu of all Ability and Skill (Ability) checks<br><li><b>saves</b> Creates a dropdown menu of all saving throws<br><li><b>init</b> Creates a button that rolls initiative for the selected token<br><li><b>help</b> Calls up this help documentation</ul><br>Example:<br><b>!ta saves checks</b> will create token ability buttons for Ability Checks and Saving Throws.";
                    let footer = '</div>';
                    sendChat("TokenAction", "/w " + msg.who + header + helpText + footer);
                    return;
                }
                // ############PUT Switch for 5e here
                if (sheet === "5e") {
                    _.each(char, function (a) {
                        if (parseInt(isNpc(a.id)) === 1) {//5e NPC
                            if (args.includes("init")) {
                                createAbility('Init', "%{" + a.id + "|npc_init}", a.id);
                            }
                            if (args.includes("checks")) {
                                let macroContent = createDropDown('check', true);
                                createAbility('check', macroContent, a.id);

                                //                                createAbility('Check', "@{selected|wtype}&{template:npc} @{selected|npc_name_flag} @{selected|rtype}+?{Ability|Acrobatics,[[@{selected|npc_acrobatics}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_acrobatics}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_acrobatics}]]]]&" + "#125;&" + "#125; {{rname=Acrobatics&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Animal Handling,[[@{selected|npc_animal_handling}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_animal_handling}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_animal_handling}]]]]&" + "#125;&" + "#125; {{rname=Animal Handling&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Arcana,[[@{selected|npc_arcana}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_arcana}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_arcana}]]]]&" + "#125;&" + "#125; {{rname=Arcana&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Athletics,[[@{selected|npc_athletics}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_athletics}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_athletics}]]]]&" + "#125;&" + "#125; {{rname=Athletics&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Deception,[[@{selected|npc_deception}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_deception}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_deception}]]]]&" + "#125;&" + "#125; {{rname=Deception&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |History,[[@{selected|npc_history}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_history}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_history}]]]]&" + "#125;&" + "#125; {{rname=History&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Insight,[[@{selected|npc_insight}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_insight}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_insight}]]]]&" + "#125;&" + "#125; {{rname=Insight&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Intimidation,[[@{selected|npc_intimidation}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_intimidation}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_intimidation}]]]]&" + "#125;&" + "#125; {{rname=Intimidation&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Investigation,[[@{selected|npc_investigation}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_investigation}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_investigation}]]]]&" + "#125;&" + "#125; {{rname=Investigation&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Medicine,[[@{selected|npc_medicine}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_medicine}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_medicine}]]]]&" + "#125;&" + "#125; {{rname=Medicine&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Nature,[[@{selected|npc_nature}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_nature}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_nature}]]]]&" + "#125;&" + "#125; {{rname=Nature&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Perception,[[@{selected|npc_perception}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_perception}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_perception}]]]]&" + "#125;&" + "#125; {{rname=Perception&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Performance,[[@{selected|npc_performance}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_performance}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_performance}]]]]&" + "#125;&" + "#125; {{rname=Performance&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Persuasion,[[@{selected|npc_persuasion}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_persuasion}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_persuasion}]]]]&" + "#125;&" + "#125; {{rname=Persuasion&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Religion,[[@{selected|npc_religion}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_religion}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_religion}]]]]&" + "#125;&" + "#125; {{rname=Religion&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Sleight of Hand,[[@{selected|npc_sleight_of_hand}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_sleight_of_hand}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_sleight_of_hand}]]]]&" + "#125;&" + "#125; {{rname=Sleight of Hand&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Stealth,[[@{selected|npc_stealth}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_stealth}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_stealth}]]]]&" + "#125;&" + "#125; {{rname=Stealth&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Survival,[[@{selected|npc_survival}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_survival}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_survival}]]]]&" + "#125;&" + "#125; {{rname=Survival&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Strength,[[@{selected|strength_mod}]][STR]]]&" + "#125;&" + "#125; {{rname=Strength&" + "#125;&" + "#125; {{mod=[[[[@{selected|strength_mod}]][STR]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|strength_mod}]][STR]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Dexterity,[[@{selected|dexterity_mod}]][DEX]]]&" + "#125;&" + "#125; {{rname=Dexterity&" + "#125;&" + "#125; {{mod=[[[[@{selected|dexterity_mod}]][DEX]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|dexterity_mod}]][DEX]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Constitution,[[@{selected|constitution_mod}]][CON]]]&" + "#125;&" + "#125; {{rname=Constitution&" + "#125;&" + "#125; {{mod=[[[[@{selected|constitution_mod}]][CON]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|constitution_mod}]][CON]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Intelligence,[[@{selected|intelligence_mod}]][INT]]]&" + "#125;&" + "#125; {{rname=Intelligence&" + "#125;&" + "#125; {{mod=[[[[@{selected|intelligence_mod}]][INT]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|intelligence_mod}]][INT]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Wisdom,[[@{selected|wisdom_mod}]][WIS]]]&" + "#125;&" + "#125; {{rname=Wisdom&" + "#125;&" + "#125; {{mod=[[[[@{selected|wisdom_mod}]][WIS]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|wisdom_mod}]][WIS]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Charisma,[[@{selected|charisma_mod}]][CHA]]]&" + "#125;&" + "#125; {{rname=Charisma&" + "#125;&" + "#125; {{mod=[[[[@{selected|charisma_mod}]][CHA]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|charisma_mod}]][CHA]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125;}", a.id);
                            }
                            if (args.includes("saves")) {
                                let macroContent = createDropDown('save', true);
                                createAbility('save', macroContent, a.id);

                                //                                createAbility('Save', "@{selected|wtype}&{template:npc} @{selected|npc_name_flag} @{selected|rtype}+?{Save|Strength,[[@{selected|npc_str_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_str_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_str_save}]]&" + "#125;&" + "#125;{{rname=Strength Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Dexterity,[[@{selected|npc_dex_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_dex_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_dex_save}]]&" + "#125;&" + "#125;{{rname=Dexterity Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Constitution,[[@{selected|npc_con_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_con_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_con_save}]]&" + "#125;&" + "#125;{{rname=Constitution Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Intelligence,[[@{selected|npc_int_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_int_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_int_save}]]&" + "#125;&" + "#125;{{rname=Intelligence Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Wisdom,[[@{selected|npc_wis_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_wis_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_wis_save}]]&" + "#125;&" + "#125;{{rname=Wisdom Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Charisma,[[@{selected|npc_cha_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_cha_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_cha_save}]]&" + "#125;&" + "#125;{{rname=Charisma Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125;}", a.id);
                            }
                            if (args.includes("attacks")) {
                                createRepeating(/repeating_npcaction_[^_]+_name\b/, 'repeating_npcaction_%%RID%%_npc_action', a.id, usename);
                            }
                            if (args.includes("attacks")) {
                                createRepeating(/repeating_npcaction-l_[^_]+_name\b/, 'repeating_npcaction-l_%%RID%%_npc_action', a.id, usename);
                            }
                            if (args.includes("attacks")) {
                                createRepeating(/repeating_npcaction-m_[^_]+_name\b/, 'repeating_npcaction-m_%%RID%%_npc_action', a.id, usename);
                            }
                            if (args.includes("bonusactions")) {
                                createRepeating(/repeating_npcbonusaction_[^_]+_name\b/, 'repeating_npcbonusaction_%%RID%%_npc_action', a.id, usename);
                            }
                            if (args.includes("traits")) {
                                createRepeating(/repeating_npctrait_[^_]+_name\b/, 'repeating_npctrait_%%RID%%_npc_roll_output', a.id, usename);
                            }
                            if (args.includes("reactions")) {
                                createRepeating(/repeating_npcreaction_[^_]+_name\b/, 'repeating_npcreaction_%%RID%%_npc_roll_output', a.id, usename);
                            }
                            if (args.includes("spells")) {
                                createSpell(a.id);
                            }
                        } else {
                            if (args.includes("init")) {//5e PC
                                const name = usename ? getObj('character', a.id).get('name') : a.id;
                                createAbility('Init', "%{" + name + "|initiative}", a.id);
                            }
                            if (args.includes("checks")) {
                                let macroContent = createDropDown('check', false);
                                createAbility('check', macroContent, a.id);
                                //                                createAbility('Check', "@{selected|wtype}&{template:simple} @{selected|rtype}?{Ability|Acrobatics, +@{selected|acrobatics_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Acrobatics&" + "#125;&" + "#125; {{mod=@{selected|acrobatics_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|acrobatics_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Animal Handling, +@{selected|animal_handling_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Animal Handling&" + "#125;&" + "#125; {{mod=@{selected|animal_handling_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|animal_handling_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Arcana, +@{selected|arcana_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Arcana&" + "#125;&" + "#125; {{mod=@{selected|arcana_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|arcana_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Athletics, +@{selected|athletics_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Athletics&" + "#125;&" + "#125; {{mod=@{selected|athletics_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|athletics_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Deception, +@{selected|deception_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Deception&" + "#125;&" + "#125; {{mod=@{selected|deception_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|deception_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |History, +@{selected|history_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=History&" + "#125;&" + "#125; {{mod=@{selected|history_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|history_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Insight, +@{selected|insight_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Insight&" + "#125;&" + "#125; {{mod=@{selected|insight_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|insight_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Intimidation, +@{selected|intimidation_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Intimidation&" + "#125;&" + "#125; {{mod=@{selected|intimidation_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|intimidation_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Investigation, +@{selected|investigation_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Investigation&" + "#125;&" + "#125; {{mod=@{selected|investigation_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|investigation_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Medicine, +@{selected|medicine_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Medicine&" + "#125;&" + "#125; {{mod=@{selected|medicine_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|medicine_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Nature, +@{selected|nature_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Nature&" + "#125;&" + "#125; {{mod=@{selected|nature_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|nature_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Perception, +@{selected|perception_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Perception&" + "#125;&" + "#125; {{mod=@{selected|perception_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|perception_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Performance, +@{selected|performance_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Performance&" + "#125;&" + "#125; {{mod=@{selected|performance_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|performance_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Persuasion, +@{selected|persuasion_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Persuasion&" + "#125;&" + "#125; {{mod=@{selected|persuasion_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|persuasion_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Religion, +@{selected|religion_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Religion&" + "#125;&" + "#125; {{mod=@{selected|religion_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|religion_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Sleight of Hand, +@{selected|sleight_of_hand_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Sleight of Hand&" + "#125;&" + "#125; {{mod=@{selected|sleight_of_hand_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|sleight_of_hand_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Stealth, +@{selected|stealth_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Stealth&" + "#125;&" + "#125; {{mod=@{selected|stealth_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|stealth_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Survival, +@{selected|survival_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; {{rname=Survival&" + "#125;&" + "#125; {{mod=@{selected|survival_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|survival_bonus}@{selected|pbd_safe} ]]&" + "#125;&" + "#125; |Strength, +@{selected|strength_mod}@{selected|jack_attr}[STR]]]&" + "#125;&" + "#125; {{rname=Strength&" + "#125;&" + "#125; {{mod=@{selected|strength_mod}@{selected|jack_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|strength_mod}@{selected|jack_attr}[STR]]]&" + "#125;&" + "#125; |Dexterity, +@{selected|dexterity_mod}@{selected|jack_attr}[DEX]]]&" + "#125;&" + "#125; {{rname=Dexterity&" + "#125;&" + "#125; {{mod=@{selected|dexterity_mod}@{selected|jack_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|dexterity_mod}@{selected|jack_attr}[DEX]]]&" + "#125;&" + "#125; |Constitution, +@{selected|constitution_mod}@{selected|jack_attr}[CON]]]&" + "#125;&" + "#125; {{rname=Constitution&" + "#125;&" + "#125; {{mod=@{selected|constitution_mod}@{selected|jack_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|constitution_mod}@{selected|jack_attr}[CON]]]&" + "#125;&" + "#125; |Intelligence, +@{selected|intelligence_mod}@{selected|jack_attr}[INT]]]&" + "#125;&" + "#125; {{rname=Intelligence&" + "#125;&" + "#125; {{mod=@{selected|intelligence_mod}@{selected|jack_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|intelligence_mod}@{selected|jack_attr}[INT]]]&" + "#125;&" + "#125; |Wisdom, +@{selected|wisdom_mod}@{selected|jack_attr}[WIS]]]&" + "#125;&" + "#125; {{rname=Wisdom&" + "#125;&" + "#125; {{mod=@{selected|wisdom_mod}@{selected|jack_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|wisdom_mod}@{selected|jack_attr}[WIS]]]&" + "#125;&" + "#125; |Charisma, +@{selected|charisma_mod}@{selected|jack_attr}[CHA]]]&" + "#125;&" + "#125; {{rname=Charisma&" + "#125;&" + "#125; {{mod=@{selected|charisma_mod}@{selected|jack_bonus}&" + "#125;&" + "#125; {{r1=[[ @{selected|d20} + @{selected|charisma_mod}@{selected|jack_attr}[CHA]]]&" + "#125;&" + "#125; } @{selected|global_skill_mod} @{selected|charname_output}", a.id);
                            }

                            if (args.includes("saves")) {
                                let macroContent = createDropDown('save', false);
                                createAbility('save', macroContent, a.id);

                                //                                createAbility('Save', "@{selected|wtype}&{template:simple} @{selected|rtype}?{Save|Strength, +@{selected|strength_save_bonus}@{selected|pbd_safe}]]&" + "#125;&" + "#125; {{rname=Strength Save&" + "#125;&" + "#125 {{mod=@{selected|strength_save_bonus}&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+@{selected|strength_save_bonus}@{selected|pbd_safe}]]&" + "#125;&" + "#125; |Dexterity, +@{selected|dexterity_save_bonus}@{selected|pbd_safe}]]&" + "#125;&" + "#125; {{rname=Dexterity Save&" + "#125;&" + "#125 {{mod=@{selected|dexterity_save_bonus}&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+@{selected|dexterity_save_bonus}@{selected|pbd_safe}]]&" + "#125;&" + "#125; |Constitution, +@{selected|constitution_save_bonus}@{selected|pbd_safe}]]&" + "#125;&" + "#125; {{rname=Constitution Save&" + "#125;&" + "#125 {{mod=@{selected|constitution_save_bonus}&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+@{selected|constitution_save_bonus}@{selected|pbd_safe}]]&" + "#125;&" + "#125; |Intelligence, +@{selected|intelligence_save_bonus}@{selected|pbd_safe}]]&" + "#125;&" + "#125; {{rname=Intelligence Save&" + "#125;&" + "#125 {{mod=@{selected|intelligence_save_bonus}&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+@{selected|intelligence_save_bonus}@{selected|pbd_safe}]]&" + "#125;&" + "#125; |Wisdom, +@{selected|wisdom_save_bonus}@{selected|pbd_safe}]]&" + "#125;&" + "#125; {{rname=Wisdom Save&" + "#125;&" + "#125 {{mod=@{selected|wisdom_save_bonus}&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+@{selected|wisdom_save_bonus}@{selected|pbd_safe}]]&" + "#125;&" + "#125; |Charisma, +@{selected|charisma_save_bonus}@{selected|pbd_safe}]]&" + "#125;&" + "#125; {{rname=Charisma Save&" + "#125;&" + "#125 {{mod=@{selected|charisma_save_bonus}&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+@{selected|charisma_save_bonus}@{selected|pbd_safe}]]&" + "#125;&" + "#125;}@{selected|global_save_mod}@{selected|charname_output}", a.id);
                            }
                            if (args.includes("attacks")) {
                                createRepeating(/repeating_attack_[^_]+_atkname\b/, 'repeating_attack_%%RID%%_attack', a.id, usename);
                            }
                            if (args.includes("traits")) {
                                createRepeating(/repeating_traits_[^_]+_name\b/, 'repeating_traits_%%RID%%_output', a.id, usename);
                            }
                            if (args.includes("spells")) {
                                createSpell(a.id);
                            }
                        }
                        sendChat("TokenAction", `/w ${whom} Created 5e Token Actions for ${a.get('name')}.`);
                    });


                } else {


                    _.each(char, function (a) {//PF2 NPC
                        if (parseInt(isNpc(a.id)) === 1) {//PF2 NPC
                            //                            log('These are the commands that are being read : PF2 NPC');

                            if (args.includes("init")) {
                                createAbility('Init', "%{" + a.id + "|NPC_INITIATIVE}", a.id);
                            }
                            if (args.includes("checks")) {//PF2 version
                                createAbility('Check', "@{selected|whispertype} &{template:rolls} {{limit_height=@{selected|roll_limit_height}}} {{charactername=@{selected|character_name}}} {{roll01_type=skill}} {{notes_show=@{selected|roll_show_notes}}}  {{subheader=^{skill}}} ?{Skill|Acrobatics,{{roll01=[[1d20cs20cf1 + (@{selected|acrobatics})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|acrobatics_notes}&#125;&#125;{{header=Acrobatics&#125;&#125;|Arcana,{{roll01=[[1d20cs20cf1 + (@{selected|arcana})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|arcana_notes}&#125;&#125;{{header=Arcana&#125;&#125; |Athletics,{{roll01=[[1d20cs20cf1 + (@{selected|athletics})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|athletics_notes}&#125;&#125;{{header=athletics&#125;&#125; |Crafting,{{roll01=[[1d20cs20cf1 + (@{selected|crafting})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|crafting_notes}&#125;&#125;{{header=crafting&#125;&#125; |Deception,{{roll01=[[1d20cs20cf1 + (@{selected|deception})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|deception_notes}&#125;&#125;{{header=deception&#125;&#125; |Diplomacy,{{roll01=[[1d20cs20cf1 + (@{selected|diplomacy})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|diplomacy_notes}&#125;&#125;{{header=diplomacy&#125;&#125; |Intimidation,{{roll01=[[1d20cs20cf1 + (@{selected|intimidation})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|intimidation_notes}&#125;&#125;{{header=intimidation&#125;&#125; |Medicine,{{roll01=[[1d20cs20cf1 + (@{selected|medicine})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|medicine_notes}&#125;&#125;{{header=medicine&#125;&#125; |Nature,{{roll01=[[1d20cs20cf1 + (@{selected|nature})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|nature_notes}&#125;&#125;{{header=nature&#125;&#125; |Occultism,{{roll01=[[1d20cs20cf1 + (@{selected|occultism})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|occultism_notes}&#125;&#125;{{header=occultism&#125;&#125; |Performance,{{roll01=[[1d20cs20cf1 + (@{selected|performance})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|performance_notes}&#125;&#125;{{header=performance&#125;&#125; |Religion,{{roll01=[[1d20cs20cf1 + (@{selected|religion})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|religion_notes}&#125;&#125;{{header=religion&#125;&#125; |Society,{{roll01=[[1d20cs20cf1 + (@{selected|society})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|society_notes}&#125;&#125;{{header=society&#125;&#125; |Stealth,{{roll01=[[1d20cs20cf1 + (@{selected|stealth})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|stealth_notes}&#125;&#125;{{header=stealth&#125;&#125; |Survival,{{roll01=[[1d20cs20cf1 + (@{selected|survival})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|survival_notes}&#125;&#125;{{header=survival&#125;&#125; |Thievery,{{roll01=[[1d20cs20cf1 + (@{selected|thievery})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|thievery_notes}&#125;&#125;{{header=thievery&#125;&#125; }", a.id);
                            }
                            if (args.includes("saves")) {//PF2 version
                                createAbility('Save', "@{selected|whispertype} &{template:rolls} {{limit_height=@{selected|roll_limit_height}}} {{charactername=@{selected|character_name}}} {{subheader=^{saving_throw}}} {{roll01_type=saving-throw}} {{notes_show=@{selected|roll_show_notes}}} {{notes=@{selected|saving_throws_notes}}} ?{Save|Fortitude,{{roll01=[[1d20cs20cf1 + (@{selected|saving_throws_fortitude})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{header=fortitude&#125;&#125;|Reflex,{{roll01=[[1d20cs20cf1 + (@{selected|saving_throws_reflex})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125;{{header=reflex&#125;&#125;|Will,{{roll01=[[1d20cs20cf1 + (@{selected|saving_throws_will})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{header=will&#125;&#125;}", a.id);
                            }
                            if (args.includes("attacks")) {//PF2
                                createRepeating(/repeating_melee-strikes_[^_]+_weapon\b/, 'repeating_melee-strikes_%%RID%%_ATTACK-DAMAGE-NPC', a.id, usename);
                                createRepeating(/repeating_ranged-strikes_[^_]+_weapon\b/, 'repeating_ranged-strikes_%%RID%%_ATTACK-DAMAGE-NPC', a.id, usename);
                            }
                            if (args.includes("offensive")) {//PF2 version
                                createRepeating(/repeating_actions-activities_[^_]+_name\b/, 'repeating_actions-activities_%%RID%%_action-npc', a.id, usename);
                            }
                            if (args.includes("reactive")) {
                                createRepeating(/repeating_free-actions-reactions_[^_]+_name\b/, 'repeating_free-actions-reactions_%%RID%%_action-npc', a.id, usename);
                            }
                            if (args.includes("interaction")) {
                                createRepeating(/repeating_interaction-abilities_[^_]+_name\b/, 'repeating_interaction-abilities_%%RID%%_action-npc', a.id, usename);
                            }
                            if (args.includes("spells")) {
                                createPF2Spell(a.id);
                            }
                        } else {
                            //                            log('These are the commands that are being read :PF2 PC');
                            if (args.includes("init")) {//PF2 PC
                                const name = usename ? getObj('character', a.id).get('name') : a.id;
                                createAbility('Init', "%{" + name + "|initiative}", a.id);
                            }
                            if (args.includes("checks")) {//PF2 PC
                                createAbility('Check', "@{selected|whispertype} &{template:rolls} {{limit_height=@{selected|roll_limit_height}}} {{charactername=@{selected|character_name}}} {{roll01_type=skill}} {{notes_show=@{selected|roll_show_notes}}}  {{subheader=^{skill}}} ?{Skill|Acrobatics,{{roll01=[[1d20cs20cf1 + (@{selected|acrobatics})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|acrobatics_notes}&#125;&#125;{{header=Acrobatics&#125;&#125;|Arcana,{{roll01=[[1d20cs20cf1 + (@{selected|arcana})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|arcana_notes}&#125;&#125;{{header=Arcana&#125;&#125; |Athletics,{{roll01=[[1d20cs20cf1 + (@{selected|athletics})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|athletics_notes}&#125;&#125;{{header=athletics&#125;&#125; |Crafting,{{roll01=[[1d20cs20cf1 + (@{selected|crafting})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|crafting_notes}&#125;&#125;{{header=crafting&#125;&#125; |Deception,{{roll01=[[1d20cs20cf1 + (@{selected|deception})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|deception_notes}&#125;&#125;{{header=deception&#125;&#125; |Diplomacy,{{roll01=[[1d20cs20cf1 + (@{selected|diplomacy})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|diplomacy_notes}&#125;&#125;{{header=diplomacy&#125;&#125; |Intimidation,{{roll01=[[1d20cs20cf1 + (@{selected|intimidation})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|intimidation_notes}&#125;&#125;{{header=intimidation&#125;&#125; |Medicine,{{roll01=[[1d20cs20cf1 + (@{selected|medicine})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|medicine_notes}&#125;&#125;{{header=medicine&#125;&#125; |Nature,{{roll01=[[1d20cs20cf1 + (@{selected|nature})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|nature_notes}&#125;&#125;{{header=nature&#125;&#125; |Occultism,{{roll01=[[1d20cs20cf1 + (@{selected|occultism})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|occultism_notes}&#125;&#125;{{header=occultism&#125;&#125; |Performance,{{roll01=[[1d20cs20cf1 + (@{selected|performance})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|performance_notes}&#125;&#125;{{header=performance&#125;&#125; |Religion,{{roll01=[[1d20cs20cf1 + (@{selected|religion})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|religion_notes}&#125;&#125;{{header=religion&#125;&#125; |Society,{{roll01=[[1d20cs20cf1 + (@{selected|society})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|society_notes}&#125;&#125;{{header=society&#125;&#125; |Stealth,{{roll01=[[1d20cs20cf1 + (@{selected|stealth})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|stealth_notes}&#125;&#125;{{header=stealth&#125;&#125; |Survival,{{roll01=[[1d20cs20cf1 + (@{selected|survival})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|survival_notes}&#125;&#125;{{header=survival&#125;&#125; |Thievery,{{roll01=[[1d20cs20cf1 + (@{selected|thievery})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{notes=@{selected|thievery_notes}&#125;&#125;{{header=thievery&#125;&#125; }", a.id);
                            }
                            if (args.includes("saves")) {//PF2 PC
                                createAbility('Save', "@{selected|whispertype} &{template:rolls} {{limit_height=@{selected|roll_limit_height}}} {{charactername=@{selected|character_name}}} {{subheader=^{saving_throw}}} {{roll01_type=saving-throw}} {{notes_show=@{selected|roll_show_notes}}} {{notes=@{selected|saving_throws_notes}}} ?{Save|Fortitude,{{roll01=[[1d20cs20cf1 + (@{selected|saving_throws_fortitude})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{header=fortitude&#125;&#125;|Reflex,{{roll01=[[1d20cs20cf1 + (@{selected|saving_throws_reflex})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125;{{header=reflex&#125;&#125;|Will,{{roll01=[[1d20cs20cf1 + (@{selected|saving_throws_will})[@{selected|text_modifier}] + (@{selected|query_roll_bonus})[@{selected|text_bonus}]]]&#125;&#125; {{header=will&#125;&#125;}", a.id);
                            }
                            if (args.includes("attacks")) {//PF2
                                createRepeating(/repeating_melee-strikes_[^_]+_weapon\b/, 'repeating_melee-strikes_%%RID%%_ATTACK-DAMAGE', a.id, usename);
                                createRepeating(/repeating_ranged-strikes_[^_]+_weapon\b/, 'repeating_ranged-strikes_%%RID%%_ATTACK-DAMAGE', a.id, usename);
                            }
                            if (args.includes("offensive")) {//PF2
                            }
                            if (args.includes("actions")) {
                                createRepeating(/repeating_actions_[^_]+_name\b/, 'repeating_actions_%%RID%%_action', a.id, usename);
                            }
                            if (args.includes("spells")) {
                                createPF2Spell(a.id);
                            }
                        }
                        sendChat("TokenAction", `/w ${whom} Created PF2 Token Actions for ${a.get('name')}.`);
                    });
                }
            } else if (msg.content.search(/^!deleteta\b/) !== -1) {
                char = _.uniq(getSelectedCharacters(msg.selected));

                _.each(char, function (d) {
                    deleteAbilities(d.id);
                    sendChat("TokenAction", `/w ${whom} Deleted all unprotected Token Actions for ${d.get('name')}.`);
                });
            } else if (msg.content.search(/^!deleteallta\b/) !== -1) {
                char = _.uniq(getSelectedCharacters(msg.selected));

                _.each(char, function (d) {
                    deleteAllAbilities(d.id);
                    sendChat("TokenAction", `/w ${whom} Deleted all Token Actions for ${d.get('name')}.`);
                });
            } else if (msg.content.search(/^!sortta\b/) !== -1) {

                char = _.uniq(getSelectedCharacters(msg.selected));





                if (sheet === "5e") {
                    // ############PUT Switch for 5e here


                    _.each(char, function (a) {
                        if (parseInt(isNpc(a.id)) === 1) {//5e PC Sorted
                            if (args.includes("init")) {
                                createAbility('Init', "%{" + a.id + "|npc_init}", a.id);
                            }
                            if (args.includes("checks")) {
                                let macroContent = createDropDown('check', true);
                                createAbility('Check', macroContent, a.id);

                                //                                createAbility('Check', "@{selected|wtype}&{template:npc} @{selected|npc_name_flag} @{selected|rtype}+?{Ability|Acrobatics,[[@{selected|npc_acrobatics}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_acrobatics}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_acrobatics}]]]]&" + "#125;&" + "#125; {{rname=Acrobatics&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Animal Handling,[[@{selected|npc_animal_handling}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_animal_handling}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_animal_handling}]]]]&" + "#125;&" + "#125; {{rname=Animal Handling&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Arcana,[[@{selected|npc_arcana}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_arcana}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_arcana}]]]]&" + "#125;&" + "#125; {{rname=Arcana&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Athletics,[[@{selected|npc_athletics}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_athletics}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_athletics}]]]]&" + "#125;&" + "#125; {{rname=Athletics&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Deception,[[@{selected|npc_deception}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_deception}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_deception}]]]]&" + "#125;&" + "#125; {{rname=Deception&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |History,[[@{selected|npc_history}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_history}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_history}]]]]&" + "#125;&" + "#125; {{rname=History&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Insight,[[@{selected|npc_insight}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_insight}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_insight}]]]]&" + "#125;&" + "#125; {{rname=Insight&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Intimidation,[[@{selected|npc_intimidation}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_intimidation}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_intimidation}]]]]&" + "#125;&" + "#125; {{rname=Intimidation&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Investigation,[[@{selected|npc_investigation}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_investigation}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_investigation}]]]]&" + "#125;&" + "#125; {{rname=Investigation&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Medicine,[[@{selected|npc_medicine}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_medicine}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_medicine}]]]]&" + "#125;&" + "#125; {{rname=Medicine&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Nature,[[@{selected|npc_nature}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_nature}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_nature}]]]]&" + "#125;&" + "#125; {{rname=Nature&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Perception,[[@{selected|npc_perception}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_perception}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_perception}]]]]&" + "#125;&" + "#125; {{rname=Perception&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Performance,[[@{selected|npc_performance}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_performance}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_performance}]]]]&" + "#125;&" + "#125; {{rname=Performance&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Persuasion,[[@{selected|npc_persuasion}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_persuasion}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_persuasion}]]]]&" + "#125;&" + "#125; {{rname=Persuasion&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Religion,[[@{selected|npc_religion}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_religion}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_religion}]]]]&" + "#125;&" + "#125; {{rname=Religion&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Sleight of Hand,[[@{selected|npc_sleight_of_hand}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_sleight_of_hand}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_sleight_of_hand}]]]]&" + "#125;&" + "#125; {{rname=Sleight of Hand&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Stealth,[[@{selected|npc_stealth}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_stealth}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_stealth}]]]]&" + "#125;&" + "#125; {{rname=Stealth&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Survival,[[@{selected|npc_survival}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_survival}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_survival}]]]]&" + "#125;&" + "#125; {{rname=Survival&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Strength,[[@{selected|strength_mod}]][STR]]]&" + "#125;&" + "#125; {{rname=Strength&" + "#125;&" + "#125; {{mod=[[[[@{selected|strength_mod}]][STR]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|strength_mod}]][STR]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Dexterity,[[@{selected|dexterity_mod}]][DEX]]]&" + "#125;&" + "#125; {{rname=Dexterity&" + "#125;&" + "#125; {{mod=[[[[@{selected|dexterity_mod}]][DEX]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|dexterity_mod}]][DEX]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Constitution,[[@{selected|constitution_mod}]][CON]]]&" + "#125;&" + "#125; {{rname=Constitution&" + "#125;&" + "#125; {{mod=[[[[@{selected|constitution_mod}]][CON]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|constitution_mod}]][CON]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Intelligence,[[@{selected|intelligence_mod}]][INT]]]&" + "#125;&" + "#125; {{rname=Intelligence&" + "#125;&" + "#125; {{mod=[[[[@{selected|intelligence_mod}]][INT]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|intelligence_mod}]][INT]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Wisdom,[[@{selected|wisdom_mod}]][WIS]]]&" + "#125;&" + "#125; {{rname=Wisdom&" + "#125;&" + "#125; {{mod=[[[[@{selected|wisdom_mod}]][WIS]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|wisdom_mod}]][WIS]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Charisma,[[@{selected|charisma_mod}]][CHA]]]&" + "#125;&" + "#125; {{rname=Charisma&" + "#125;&" + "#125; {{mod=[[[[@{selected|charisma_mod}]][CHA]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|charisma_mod}]][CHA]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125;}", a.id);
                            }
                            if (args.includes("saves")) {
                                createAbility('Save', "@{selected|wtype}&{template:npc} @{selected|npc_name_flag} @{selected|rtype}+?{Save|Strength,[[@{selected|npc_str_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_str_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_str_save}]]&" + "#125;&" + "#125;{{rname=Strength Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Dexterity,[[@{selected|npc_dex_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_dex_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_dex_save}]]&" + "#125;&" + "#125;{{rname=Dexterity Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Constitution,[[@{selected|npc_con_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_con_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_con_save}]]&" + "#125;&" + "#125;{{rname=Constitution Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Intelligence,[[@{selected|npc_int_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_int_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_int_save}]]&" + "#125;&" + "#125;{{rname=Intelligence Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Wisdom,[[@{selected|npc_wis_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_wis_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_wis_save}]]&" + "#125;&" + "#125;{{rname=Wisdom Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Charisma,[[@{selected|npc_cha_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_cha_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_cha_save}]]&" + "#125;&" + "#125;{{rname=Charisma Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125;}", a.id);
                            }
                            if (args.includes("traits")) {
                                createRepeating(/repeating_npctrait_[^_]+_name\b/, 'repeating_npctrait_%%RID%%_npc_roll_output', a.id, usename);
                            }
                            if (args.includes("reactions")) {
                                createRepeating(/repeating_npcreaction_[^_]+_name\b/, 'repeating_npcreaction_%%RID%%_npc_roll_output', a.id, usename);
                            }
                            if (args.includes("spells")) {
                                createSpell(a.id);
                            }
                            if (args.includes("attacks")) {
                                sortRepeating(/repeating_npcaction_[^_]+_name\b/, 'repeating_npcaction_%%RID%%_npc_action', a.id, usename);
                            }
                            if (args.includes("attacks")) {
                                sortRepeating(/repeating_npcaction-l_[^_]+_name\b/, 'repeating_npcaction-l_%%RID%%_npc_action', a.id, usename);
                            }
                            if (args.includes("bonusactions")) {
                                sortRepeating(/repeating_npcbonusaction_[^_]+_name\b/, 'repeating_npcbonusaction_%%RID%%_npc_roll_output', a.id, usename);
                            }
                        }
                        sendChat("TokenAction", `/w ${whom} Created Sorted 5e Token Actions for ${a.get('name')}.`);
                    });


                } else {
                    _.each(char, function (a) {
                        sendChat("TokenAction", `/w ${whom} **Using !sortta for Pathfinder characters is not recommended. Alphabetization destroys the logical order of the *Attack-Attack2-Attack3* progression.**`);

                        if (parseInt(isNpc(a.id)) === 1) {//PF2 Sorted
                            if (args.includes("init")) {
                                createAbility('Init', "%{" + a.id + "|npc_init}", a.id);
                            }
                            if (args.includes("checks")) {
                                createAbility('Check', "@{selected|wtype}&{template:npc} @{selected|npc_name_flag} @{selected|rtype}+?{Ability|Acrobatics,[[@{selected|npc_acrobatics}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_acrobatics}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_acrobatics}]]]]&" + "#125;&" + "#125; {{rname=Acrobatics&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Animal Handling,[[@{selected|npc_animal_handling}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_animal_handling}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_animal_handling}]]]]&" + "#125;&" + "#125; {{rname=Animal Handling&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Arcana,[[@{selected|npc_arcana}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_arcana}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_arcana}]]]]&" + "#125;&" + "#125; {{rname=Arcana&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Athletics,[[@{selected|npc_athletics}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_athletics}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_athletics}]]]]&" + "#125;&" + "#125; {{rname=Athletics&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Deception,[[@{selected|npc_deception}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_deception}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_deception}]]]]&" + "#125;&" + "#125; {{rname=Deception&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |History,[[@{selected|npc_history}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_history}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_history}]]]]&" + "#125;&" + "#125; {{rname=History&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Insight,[[@{selected|npc_insight}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_insight}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_insight}]]]]&" + "#125;&" + "#125; {{rname=Insight&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Intimidation,[[@{selected|npc_intimidation}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_intimidation}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_intimidation}]]]]&" + "#125;&" + "#125; {{rname=Intimidation&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Investigation,[[@{selected|npc_investigation}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_investigation}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_investigation}]]]]&" + "#125;&" + "#125; {{rname=Investigation&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Medicine,[[@{selected|npc_medicine}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_medicine}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_medicine}]]]]&" + "#125;&" + "#125; {{rname=Medicine&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Nature,[[@{selected|npc_nature}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_nature}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_nature}]]]]&" + "#125;&" + "#125; {{rname=Nature&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Perception,[[@{selected|npc_perception}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_perception}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_perception}]]]]&" + "#125;&" + "#125; {{rname=Perception&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Performance,[[@{selected|npc_performance}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_performance}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_performance}]]]]&" + "#125;&" + "#125; {{rname=Performance&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Persuasion,[[@{selected|npc_persuasion}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_persuasion}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_persuasion}]]]]&" + "#125;&" + "#125; {{rname=Persuasion&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Religion,[[@{selected|npc_religion}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_religion}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_religion}]]]]&" + "#125;&" + "#125; {{rname=Religion&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Sleight of Hand,[[@{selected|npc_sleight_of_hand}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_sleight_of_hand}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_sleight_of_hand}]]]]&" + "#125;&" + "#125; {{rname=Sleight of Hand&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Stealth,[[@{selected|npc_stealth}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_stealth}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_stealth}]]]]&" + "#125;&" + "#125; {{rname=Stealth&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Survival,[[@{selected|npc_survival}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_survival}]]]]&" + "#125;&" + "#125; {{mod=[[[[@{selected|npc_survival}]]]]&" + "#125;&" + "#125; {{rname=Survival&" + "#125;&" + "#125; {{type=Skill&" + "#125;&" + "#125; |Strength,[[@{selected|strength_mod}]][STR]]]&" + "#125;&" + "#125; {{rname=Strength&" + "#125;&" + "#125; {{mod=[[[[@{selected|strength_mod}]][STR]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|strength_mod}]][STR]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Dexterity,[[@{selected|dexterity_mod}]][DEX]]]&" + "#125;&" + "#125; {{rname=Dexterity&" + "#125;&" + "#125; {{mod=[[[[@{selected|dexterity_mod}]][DEX]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|dexterity_mod}]][DEX]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Constitution,[[@{selected|constitution_mod}]][CON]]]&" + "#125;&" + "#125; {{rname=Constitution&" + "#125;&" + "#125; {{mod=[[[[@{selected|constitution_mod}]][CON]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|constitution_mod}]][CON]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Intelligence,[[@{selected|intelligence_mod}]][INT]]]&" + "#125;&" + "#125; {{rname=Intelligence&" + "#125;&" + "#125; {{mod=[[[[@{selected|intelligence_mod}]][INT]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|intelligence_mod}]][INT]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Wisdom,[[@{selected|wisdom_mod}]][WIS]]]&" + "#125;&" + "#125; {{rname=Wisdom&" + "#125;&" + "#125; {{mod=[[[[@{selected|wisdom_mod}]][WIS]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|wisdom_mod}]][WIS]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125; |Charisma,[[@{selected|charisma_mod}]][CHA]]]&" + "#125;&" + "#125; {{rname=Charisma&" + "#125;&" + "#125; {{mod=[[[[@{selected|charisma_mod}]][CHA]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|charisma_mod}]][CHA]]]&" + "#125;&" + "#125; {{type=Ability&" + "#125;&" + "#125;}", a.id);
                            }
                            if (args.includes("saves")) {
                                createAbility('Save', "@{selected|wtype}&{template:npc} @{selected|npc_name_flag} @{selected|rtype}+?{Save|Strength,[[@{selected|npc_str_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_str_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_str_save}]]&" + "#125;&" + "#125;{{rname=Strength Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Dexterity,[[@{selected|npc_dex_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_dex_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_dex_save}]]&" + "#125;&" + "#125;{{rname=Dexterity Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Constitution,[[@{selected|npc_con_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_con_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_con_save}]]&" + "#125;&" + "#125;{{rname=Constitution Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Intelligence,[[@{selected|npc_int_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_int_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_int_save}]]&" + "#125;&" + "#125;{{rname=Intelligence Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Wisdom,[[@{selected|npc_wis_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_wis_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_wis_save}]]&" + "#125;&" + "#125;{{rname=Wisdom Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125; |Charisma,[[@{selected|npc_cha_save}]]]]&" + "#125;&" + "#125; {{r1=[[@{selected|d20}+[[@{selected|npc_cha_save}]]]]&" + "#125;&" + "#125; {{mod=[[@{selected|npc_cha_save}]]&" + "#125;&" + "#125;{{rname=Charisma Save&" + "#125;&" + "#125; {{type=Save&" + "#125;&" + "#125;}", a.id);
                            }
                            if (args.includes("traits")) {
                                createRepeating(/repeating_npctrait_[^_]+_name\b/, 'repeating_npctrait_%%RID%%_npc_roll_output', a.id, usename);
                            }
                            if (args.includes("reactions")) {
                                createRepeating(/repeating_actions-activities_[^_]+_name\b/, 'repeating_actions-activities_%%RID%%_action-npc', a.id, usename);
                            }
                            if (args.includes("spells")) {//PF2
                                createPF2Spell(a.id);
                            }
                            if (args.includes("attacks")) {//PF2
                                sortRepeating(/repeating_melee-strikes_[^_]+_weapon\b/, 'repeating_melee-strikes_%%RID%%_ATTACK-DAMAGE-NPC', a.id, usename);
                                sortRepeating(/repeating_ranged-strikes_[^_]+_weapon\b/, 'repeating_ranged-strikes_%%RID%%_ATTACK-DAMAGE-NPC', a.id, usename);
                            }
                            if (args.includes("offensive")) {//PF2
                                createRepeating(/repeating_actions-activities_[^_]+_name\b/, 'repeating_actions-activities_%%RID%%_action-npc', a.id, usename);
                            }
                            if (args.includes("reactive")) {
                                sortRepeating(/repeating_free-actions-reactions_[^_]+_name\b/, 'repeating_free-actions-reactions_%%RID%%_action-npc', a.id, usename);
                            }
                            if (args.includes("interaction")) {
                                createRepeating(/repeating_interaction-abilities_[^_]+_name\b/, 'repeating_interaction-abilities_%%RID%%_action-npc', a.id, usename);
                            }
                            sendChat("TokenAction", `/w ${whom} Created Sorted PF2 Token Actions for ${a.get('name')}.`);

                        }
                    });

                }

            }
            return;
        },

        registerEventHandlers = function () {
            on('chat:message', handleInput);
        };

    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers
    };
}());

on('ready', function () {
    'use strict';

    tokenAction.CheckInstall();
    tokenAction.RegisterEventHandlers();
});




//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//      CHECKLIGHTLEVEL
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Contact:  https://app.roll20.net/users/104025/the-aaron/* globals on findObjs getObj playerIsGM log sendChat PathMath Plugger */
var API_Meta = API_Meta || {};
API_Meta.checkLightLevel = { offset: Number.MAX_SAFE_INTEGER, lineCount: -1 };
{ try { throw new Error(''); } catch (e) { API_Meta.checkLightLevel.offset = (parseInt(e.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, '$1'), 10) - (13)); } }

const checkLightLevel = (() => { //eslint-disable-line no-unused-vars

  const scriptName = 'checkLightLevel',
    scriptVersion = '0.5.0',
    debugLogging = false,
    consolePassthrough = true;  // set to false if you want debug logs sent to the Roll20 API console (yuck)

  const debug = (() => {
    const send = (logLevel, ...msgs) => {
      if (!debugLogging) return;
      if (consolePassthrough) {
        console[logLevel](...msgs);
      }
      else {
        msgs.forEach(msg => log(msg));
      }
    }
    return {
      log: (...msgs) => send('log', ...msgs),
      info: (...msgs) => send('info', ...msgs),
      warn: (...msgs) => send('warn', ...msgs),
      error: (...msgs) => send('error', ...msgs)
    }
  })();

  /**
   * @param {object[]} selected array of simple token objects
   * @returns {object[] | null} array of actual token objects
   */
  const getSelectedTokens = (selected) => {
    const selectedIds = selected && selected.length ? selected.map(sel => sel._id) : null
    return selectedIds ? selectedIds.map(id => getObj('graphic', id)) : null;
  }

  /**
   * @param {object} token token object
   * @returns {object|null} page object
   */
  const getPageOfToken = (token) => token && token.id ? getObj('page', token.get('_pageid')) : null;

  /**
   * @param {object} point1 { x: number, y: number }
   * @param {object} point2 { x: number, y: number }
   * @returns 
   */
  const getSeparation = (point1, point2) => {
    const delta = { x: point1.x - point2.x, y: point1.y - point2.y },
    distance = Math.sqrt(delta.x**2 + delta.y**2);
    return distance;
  }

  /**
   * @param {object} token1 token object
   * @param {object} token2 token object
   * @returns {number} separation in pixels
   */
  const getTokenSeparation = (token1, token2) => {
    if (!token1 || !token2) return;
    const pos1 = { x: parseInt(token1.get('left')), y: parseInt(token1.get('top')) },
      pos2 = { x: parseInt(token2.get('left')), y: parseInt(token2.get('top')) };
    if (![pos1.x, pos1.y, pos2.x, pos2.y].reduce((valid, val) => (valid === true && Number.isSafeInteger(val)) ? true : false, true)) return null;
    return getSeparation(pos1, pos2);
  }

  /**
   * @param {number} feetValue distance in feet
   * @param {object} page map page object
   * @returns {number|null} pixel distance
   */
  const feetToPixels = (feetValue, page) => {
    if (!page) return null;
    const gridPixelMultiplier = page.get('snapping_increment'),
      gridUnitScale = page.get('scale_number');
    const pixelValue = feetValue/gridUnitScale*(gridPixelMultiplier*70);
    debug.info(`Pixel distance: ${pixelValue}`);
    return pixelValue;
  }

  /**
   * @param {object} page map page object
   * @returns {boolean}
   */
  const checkGlobalIllumination = (page) => {
    if (!page || !page.id) return false;
    return page.get('daylight_mode_enabled') ? parseFloat(page.get('daylightModeOpacity')) : false;
  }

  /**
   * Check if a one way wall is allowing light through in the correct direction
   * @param {object} segment path segment
   * @param {number} lightFlowAngle 
   * @param {boolean} oneWayReversed 
   * @returns {boolean}
   */
  const isOneWayAndTransparent = (segment, lightFlowAngle, oneWayReversed) => {
    if (!segment || segment.length < 2) return;
    const delta = { x: segment[1][0] - segment[0][0], y: segment[0][1] - segment[1][1] }
    const segmentAngle = getAngleFromX(delta.x, delta.y);
    debug.info(`Segment angle is ${segmentAngle}`);
    const transparencyAngle = oneWayReversed
      ? segmentAngle - 90
      : segmentAngle + 90;
    const angleDifference = Math.abs(transparencyAngle - lightFlowAngle);
    debug.warn(`Transparency diff ${angleDifference}`);
    return angleDifference < 90 ? true : false;
  }

  /**
   * @param {number} rads radians
   * @returns {number} degrees
   */
  const toDegrees = (rads) => rads*180/Math.PI;

  /**
   * Get the angle from the x axis to the line drawn to (x,y) from origin
   * @param {number} x 
   * @param {number} y 
   * @returns {number} radians
   */
  const getAngleFromX = (x, y) => toDegrees(Math.atan2(y, x));

  /**
   * Check for LOS blocking walls between token and light source
   * @param {object} token1 token object
   * @param {object} token2 token object
   * @param {number} range pixel range
   * @param {object} page map page object
   * @returns {null|object} returns null if no LOS block, or first path object which blocks the light source
   */
  const checkLineOfSight = (token1, token2, range, page) => {
    const pos1 = { x: parseInt(token1.get('left')), y: parseInt(token1.get('top')) },
      pos2 = { x: parseInt(token2.get('left')), y: parseInt(token2.get('top')) },
      blockingPaths = findObjs({ type: 'path', pageid: page.id, layer: 'walls' }).filter(path => path.get('barrierType') !== 'transparent');
    const losPath = new PathMath.Path([[pos1.x, pos1.y, 0], [pos2.x, pos2.y, 0]]);
    let losBlocked = null;
    for (let i=0; i<blockingPaths.length; i++) {
      let pathData;
      const isOneWayWall = blockingPaths[i].get('barrierType') === 'oneWay',
        oneWayReversed = isOneWayWall ? blockingPaths[i].get('oneWayReversed') : null,
        lightFlowAngle = isOneWayWall ? getAngleFromX(pos1.x - pos2.x, pos2.y - pos1.y) : null;
      try { pathData = JSON.parse(blockingPaths[i].get('path')); } catch(e) { debug.error(e) }
      if (!pathData) continue;
      const pathTop = blockingPaths[i].get('top') - (blockingPaths[i].get('height')/2),
        pathLeft = blockingPaths[i].get('left') - (blockingPaths[i].get('width')/2);
      const pathVertices = pathData.map(vertex => [ vertex[1] + pathLeft, vertex[2] + pathTop, 0 ]);
      const wallPath = new PathMath.Path(pathVertices);
      const wallSegments = wallPath.toSegments(),
        losSegments = losPath.toSegments();
      for (let w=0; w<wallSegments.length; w++) {
        if (losBlocked) break;
        const skipOneWaySegment = isOneWayWall ? isOneWayAndTransparent(wallSegments[w], lightFlowAngle, oneWayReversed) : false;
        if (skipOneWaySegment) {
          debug.info('Skipping segment due to one-way transparency');
          continue;
        }
        for (let l=0; l<losSegments.length; l++) {
          const intersect = PathMath.segmentIntersection(wallSegments[w], losSegments[l]);//wallPath.intersects(losPath);
          if (intersect) {
            debug.info(`Found intersect, skipping light source`, blockingPaths[i]);
            losBlocked = blockingPaths[i];
            break;
          }
        }
      }
      if (losBlocked) break;
    }
    return losBlocked;
  }

  /**
   * Use cubic fade out to approximate the light level in dim light at different ranges
   * @param {number} tokenSeparation - pixel distance, center to center
   * @param {number} dimLightRadius - pixel radius of dim light from the emitter
   * @param {number} brightLightRadius - pixel radius of bright light from the emitter
   * @returns {number} - light level multiplier, 0 - 1
   */
  const getDimLightFalloff = (tokenSeparation, dimLightRadius, brightLightRadius, gridPixelSize) => {
    const dimLightOnlyRadius = (dimLightRadius - brightLightRadius) + gridPixelSize/2,
      tokenDimLightDistance = tokenSeparation - brightLightRadius;
    const lightLevelWithFalloff = (1-(tokenDimLightDistance/dimLightOnlyRadius)**3) * 0.5;
    return lightLevelWithFalloff;
  }

  /**
   * @param {object} token token object
   * @returns {number} average radius in pixels
   */
  const getTokenAverageRadius = (token) => {
    return (parseInt(token.get('height'))||0 + parseInt(token.get('width'))||0)*0.66;
  }

  /**
   * @param {object} token token object
   * @returns {LitBy}
   */
  const checkLightLevelOfToken = (token) => {
    if (typeof(PathMath) !== 'object') return { err: `Aborted - This script requires PathMath.` };
    const tokenPage = getPageOfToken(token),
      litBy = { bright: false, dim: [], daylight: false, total: 0, partial: true };
    const gridPixelSize = tokenPage.get('snapping_increment') * 70;
    const tokenAverageRadius = getTokenAverageRadius(token);
    if (!tokenPage || !tokenPage.id) return { err: `Couldn't find token or token page.` };
    litBy.daylight = checkGlobalIllumination(tokenPage);
    if (litBy.daylight) litBy.total += litBy.daylight;
    const allTokens = findObjs({ type: 'graphic', _pageid: tokenPage.id }),
      allLightTokens = allTokens.filter(token => (token.get('emits_bright_light') || token.get('emits_low_light')) && token.get('layer') !== 'gmlayer');
    for (let i=0; i<allLightTokens.length; i++) {
      if (litBy.bright || litBy.total >= 1) break;
      const tokenSeparation = getTokenSeparation(token, allLightTokens[i]),
        losBlocked = checkLineOfSight(token, allLightTokens[i], tokenSeparation, tokenPage);
      if (losBlocked) {
        continue;
      }
      const brightRangeFeet = allLightTokens[i].get('emits_bright_light')
        ? allLightTokens[i].get('bright_light_distance')
        : 0;
      const dimRangeFeet = allLightTokens[i].get('emits_low_light')
          ? allLightTokens[i].get('low_light_distance')
          : 0;
      const brightRange = feetToPixels(brightRangeFeet, tokenPage),
        dimRange = feetToPixels(dimRangeFeet, tokenPage),
        brightRangePartial = brightRange + tokenAverageRadius,
        dimRangePartial = dimRange + tokenAverageRadius;
      if (brightRange == null && dimRange == null) continue;
      if (brightRange && tokenSeparation <= brightRangePartial) {
        litBy.bright = true;
        litBy.total = 1;
        if (tokenSeparation <= brightRange) litBy.partial = false;
        break;
      }
      else if (dimRange && tokenSeparation <= dimRangePartial) {
        litBy.dim.push(allLightTokens[i]);
        litBy.total += getDimLightFalloff(tokenSeparation, dimRangePartial, brightRangePartial, gridPixelSize);
        if (tokenSeparation <= dimRange) litBy.partial = false;
      }
    }
    litBy.total = Math.min(litBy.total, 1);
    return { litBy };
  }
    
  const handleInput = (msg) => {
    if (msg.type === 'api' && /!checklight/i.test(msg.content) && playerIsGM(msg.playerid)) {
      const tokens = getSelectedTokens(msg.selected || []);
      if (!tokens || !tokens.length) return postChat(`Nothing selected.`);
      if (!tokenPageHasDynamicLighting) return postChat(`Token's page does not have dynamic lighting.`);
      tokens.forEach(token => {
        const { litBy, err } = checkLightLevelOfToken(token),
          tokenName = token.get('name') || 'Nameless Token';
        if (err) {
          postChat(err);
          return;
        }
        let messages = [];
        const partialString = litBy.daylight || !litBy.partial
          ? ''
          : 'partially ';
        if (litBy.daylight) messages.push(`${tokenName} is in ${(litBy.daylight*100).toFixed(0)}% global light.`);
        if (litBy.bright) messages.push(`${tokenName} is ${partialString}in direct bright light.`);
        else if (litBy.dim.length) messages.push(`${tokenName} is ${partialString}in ${litBy.total >= 1 ? `at least ` : ''}${litBy.dim.length} sources of dim light.`);
        else if (!litBy.daylight) messages.push(`${tokenName} is in darkness.`);
        if (!litBy.bright && litBy.total > 0) messages.push(`${tokenName} is ${partialString}in ${parseInt(litBy.total*100)}% total light level.`)
        if (messages.length) {
          let opacity = litBy.bright ? 1
            : litBy.total > 0.2 ? litBy.total
            : 0.2;
          if (typeof(litBy.daylight) === 'number') opacity = Math.max(litBy.daylight.toFixed(2), opacity);
          const chatMessage = createChatTemplate(token, messages, opacity);
          postChat(chatMessage);
        }
      });
    }
  }

  /**
   * @param {object[]} tokens array of token objects
   * @returns {boolean}
   */
  const tokenPageHasDynamicLighting = (tokens) => {
    const page = getPageOfToken(tokens[0]);
    return page.get('dynamic_lighting_enabled');
  }

  const createChatTemplate = (token, messages, opacity) => {
    return `
      <div class="light-outer" style="background: black; border-radius: 1rem; border: 2px solid #4c4c4c; white-space: nowrap; padding: 0.5rem 0.2rem">
        <div class="light-avatar" style="	display: inline-block!important; width: 20%; padding: 0.5rem;">
          <img src="${token.get('imgsrc')}" style="opacity: ${opacity};"/>
        </div>
        <div class="light-text" style="display: inline-block; color: whitesmoke; vertical-align: middle; width: 75%; white-space: normal;">
          ${messages.reduce((out, msg) => out += `<p>${msg}</p>`, '')}
        </div>
      </div>
      `.replace(/\n/g, '');
  }

  const postChat = (chatText, whisper = 'gm') => {
    const whisperText = whisper ? `/w "${whisper}" ` : '';
    sendChat(scriptName, `${whisperText}${chatText}`, null, { noarchive: true });
  }

  /**
   * @typedef {object} LitBy
   * @property {?boolean} bright - token is lit by bright light, null on error
   * @property {?array} dim - dim light emitters found to be illuminating selected token, null on error
   * @property {?float} daylight - token is in <float between 0 and 1> daylight, false on no daylight, null on error
   * @property {?float} total - total light multiplier from adding all sources, max 1, null on error
   * @property {boolean} partial - token's grid square is not fully lit by any light source
   * @property {?string} err - error message, only on error
   * 
   * @param {string | object} tokenOrTokenId - Roll20 Token object, or token UID string
   * @returns {LitBy}
   */
  const isLitBy = (tokenOrTokenId) => {
    const output = { bright: null, dim: null, daylight: null, total: null }
    const token = tokenOrTokenId && typeof(tokenOrTokenId) === 'object' && tokenOrTokenId.id ? tokenOrTokenId
      : typeof(tokenOrTokenId) === 'string' ? getObj('graphic', tokenOrTokenId)
      : null;
    const { litBy, err } = token && token.id
      ? checkLightLevelOfToken(token)
      : { err: `Could not find token from supplied ID.` };
    Object.assign(output,
      litBy || err
    );
    return output;
  }

  // Meta toolbox plugin
  const checklight = (msg) => {
    const errors = [];
    const tokens = getSelectedTokens(msg.selected),
      token = tokens ? tokens[0] : null;
    if (!token || !token.id) errors.push(`Checklight plugin: No selected token`);
    else {
      const { litBy, err } = checkLightLevelOfToken(token);
      if (litBy) {
        return typeof(litBy.total) === 'number'
          ? parseFloat(litBy.total).toFixed(4)
          : 0;
      }
      else errors.push(err);
    }
    if (errors.length) errors.forEach(e => log(e));
    return '';
  }
  const registerWithMetaToolbox = () => {
    try {
      Plugger.RegisterRule(checklight);
      debug.info(`Registered with Plugger`);
    }
    catch (e) { log(`ERROR Registering ${scriptName} with PlugEval: ${e.message}`); }
  }

  on('ready', () => {
    if (typeof(Plugger) === 'object') registerWithMetaToolbox();
    on('chat:message', handleInput);
    log(`${scriptName} v${scriptVersion}`);
  });

  return { isLitBy }

})();
{ try { throw new Error(''); } catch (e) { API_Meta.checkLightLevel.lineCount = (parseInt(e.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, '$1'), 10) - API_Meta.checkLightLevel.offset); } }
/* */







//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//       MATRIXMATH
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Github:   https://github.com/shdwjk/Roll20API/blob/master/TableExport/TableExport.js
// By:       The Aaron, Arcane Scriptomancer
// Contact:  https://app.roll20.net/users/104025/the-aaron

var TableExport = TableExport || (function() {
	'use strict';

	var version  = '0.2.4',
        lastUpdate = 1576529132,
        tableCache = {},
        escapes = {
            '['   : '<%%91%%>',
            ']'   : '<%%93%%>',
            '--' : '<%%-%%>',
            ' --' : '[TABLEEXPORT:ESCAPE]'
        },
    
    esRE = function (s) {
        var escapeForRegexp = /(\\|\/|\[|\]|\(|\)|\{|\}|\?|\+|\*|\||\.|\^|\$)/g;
        return s.replace(escapeForRegexp,"\\$1");
    },

	ch = function (c) {
		var entities = {
			'<' : 'lt',
			'>' : 'gt',
			"'" : '#39',
			'@' : '#64',
            '*' : 'ast',
            '`' : '#96',
			'{' : '#123',
			'|' : '#124',
			'}' : '#125',
			'[' : '#91',
			']' : '#93',
			'"' : 'quot',
			'-' : 'mdash',
			' ' : 'nbsp'
		};

		if(_.has(entities,c) ){
			return ('&'+entities[c]+';');
		}
		return '';
	},

	checkInstall = function() {
        log('-=> TableExport v'+version+' <=-  ['+(new Date(lastUpdate*1000))+']');
	},

	showHelp = function() {
		sendChat('',
            '/w gm '
+'<div style="border: 1px solid black; background-color: #ddd; padding: 3px 3px; color:#111">'
	+'<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">'
		+'TableExport v'+version
	+'</div>'
	+'<div style="padding-left:10px;margin-bottom:3px;">'
		+'<p>This script dumps commands to the chat for reconstructing a rollable table on another campaign.  While this can be done on your own campaigns via the transmogrifier, this script allows you to pass those commands to a friend and thus share your own creative works with others.<p>'
		+'<p><b>Caveat:</b> Avatar images that are not in your own library will be ignored by the API on import, but will not prevent creation of the table and table items.</p>'
	+'</div>'
	+'<b>Commands</b>'
	+'<div style="padding-left:10px;">'
		+'<b><span style="font-family: serif;">!export-table --'+ch('<')+'Table Name'+ch('>')+' [ --'+ch('<')+'Table Name'+ch('>')+' ...]</span></b>'
		+'<div style="padding-left: 10px;padding-right:20px">'
			+'<p>For all table names, case is ignored and you may use partial names so long as they are unique.  For example, '+ch('"')+'King Maximillian'+ch('"')+' could be called '+ch('"')+'max'+ch('"')+' as long as '+ch('"')+'max'+ch('"')+' does not appear in any other table names.  Exception:  An exact match will trump a partial match.  In the previous example, if a table named '+ch('"')+'Max'+ch('"')+' existed, it would be the only table matched for <b>--max</b>.</p>'
			+'<ul>'
				+'<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'
					+'<b><span style="font-family: serif;">--'+ch('<')+'Table Name'+ch('>')+'</span></b> '+ch('-')+' This is the name of a table to export.  You can specify as many tables as you like in a single command.'
				+'</li> '
			+'</ul>'
		+'</div>'
	+'</div>'
    +'<div style="padding-left:10px;">'
		+'<b><span style="font-family: serif;">!import-table --'+ch('<')+'Table Name'+ch('>')+' --'+ch('<')+'[ show | hide ]'+ch('>')+'</span></b>'
		+'<div style="padding-left: 10px;padding-right:20px">'
			+'<p>This is the command output by <b>!export-table</b> to create the new table.  You likely will not need issue these commands directly.</p>'
			+'<ul>'
				+'<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'
					+'<b><span style="font-family: serif;">--'+ch('<')+'Table Name'+ch('>')+'</span></b> '+ch('-')+' This is the name of the table to be create.'
				+'</li> '
    			+'<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'
					+'<b><span style="font-family: serif;">--'+ch('<')+'[ show | hide ]'+ch('>')+'</span></b> '+ch('-')+' This whether to show the table to players or hide it.'
				+'</li> '
			+'</ul>'
		+'</div>'
	+'</div>'
    +'<div style="padding-left:10px;">'
    	+'<b><span style="font-family: serif;">!import-table-item --'+ch('<')+'Table Name'+ch('>')+' --'+ch('<')+'Table Item Name'+ch('>')+' --'+ch('<')+'Weight'+ch('>')+' --'+ch('<')+'Avatar URL'+ch('>')+'</span></b>'
		+'<div style="padding-left: 10px;padding-right:20px">'
			+'<p>This is the command output by <b>!export-table</b> to create the new table.  You likely will not need issue these commands directly.</p>'
			+'<ul>'
				+'<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'
					+'<b><span style="font-family: serif;">--'+ch('<')+'Table Name'+ch('>')+'</span></b> '+ch('-')+' This is the name of the table to add items to.  <b>Note:</b> unlike for <b>!export-table</b>, this must be an exact name match to the created table.'
				+'</li> '
    			+'<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'
					+'<b><span style="font-family: serif;">--'+ch('<')+'Table Item Name'+ch('>')+'</span></b> '+ch('-')+' This is the name of the table item to create.  <b>Note:</b> Because the string '+ch('"')+' --'+ch('"')+' may occur in a table item name, you may see '+ch('"')+'[TABLEEXPORT:ESCAPE]'+ch('"')+' show up as a replacement in these commands.  This value is corrected internally to the correct '+ch('"')+' --'+ch('"')+' sequence on import.'
				+'</li> '
    			+'<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'
					+'<b><span style="font-family: serif;">--'+ch('<')+'Weight'+ch('>')+'</span></b> '+ch('-')+' This is the weight for this table item and should be an integer value.'
				+'</li> '
    			+'<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'
					+'<b><span style="font-family: serif;">--'+ch('<')+'Avatar URL'+ch('>')+'</span></b> '+ch('-')+' This is the URL for the avatar image of the table item.'
				+'</li> '
			+'</ul>'
		+'</div>'
	+'</div>'
+'</div>'
		);
	},
    nameEscape = (function(){
        var re=new RegExp('('+_.map(_.keys(escapes),esRE).join('|')+')','g');
        return function(s){
            return s.replace(re, function(c){ return escapes[c] || c; });
        };
    }()),
    nameUnescape = (function(){
        var sepacse = _.invert(escapes),
        re=new RegExp('('+_.map(_.keys(sepacse),esRE).join('|')+')','g');
        return function(s){
            return s.replace(re, function(c){ return sepacse[c] || c; });
        };
    }()),

	handleInput = function(msg) {
		var args, matches, tables, tableIDs=[], errors=[], items, itemMatches, accum='';

		if (msg.type !== "api" || !playerIsGM(msg.playerid)) {
			return;
		}

		args = msg.content.split(/\s+/);
		switch(args[0]) {
			case '!import-table':
				args = msg.content.split(/\s+--/);
				if(args.length === 1) {
					showHelp();
					break;
				}
				if(_.has(tableCache,args[1])) {
					sendChat('','/w gm '
						+'<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">'
							+'<span style="font-weight:bold;color:#990000;">Warning:</span> '
							+'Table ['+args[1]+'] already exists, skipping create.'
						+'</div>'
					);
				} else {
					tableIDs=findObjs({type: 'rollabletable', name: args[1]});
					if(tableIDs.length) {
						sendChat('','/w gm '
        					+'<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">'
    							+'<span style="font-weight:bold;color:#990000;">Warning:</span> '
    							+'Table ['+args[1]+'] already exists, skipping create.'
    						+'</div>'
						);
					} else {
						tableIDs=createObj('rollabletable',{ 
							name: args[1], 
							showplayers: ('show'===args[2])
						});
						tableCache[args[1]]=tableIDs.id;
					}
				}
				break;

			case '!import-table-item':
				args = msg.content.split(/\s+--/);
				if(args.length === 1) {
					showHelp();
					break;
				}
				args[2] = nameUnescape(args[2]);
				if(!_.has(tableCache,args[1])) {
					tableIDs=findObjs({type: 'rollabletable', name: args[1]});
					if(!tableIDs.length) {
						sendChat('','/w gm '
        					+'<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">'
    							+'<span style="font-weight:bold;color:#990000;">Error:</span> '
    							+'Table ['+args[1]+'] doesn not exist.  Cannot create table item.'
    						+'</div>'
    					);
                        break;
                    } else {
                        tableCache[args[1]]=tableIDs[0].id;
                    }
                }
                createObj('tableitem',{
                    name: args[2],
                    rollabletableid: tableCache[args[1]],
                    weight: parseInt(args[3],10)||1,
                    avatar: args[4]||''
                });
                break;
                
			case '!export-table':
                args = msg.content.split(/\s+--/);
                if(args.length === 1) {
                    showHelp();
                    break;
                }
				tables=findObjs({type: 'rollabletable'});
				matches=_.chain(args)
					.rest()
					.map(function(n){
						var l=_.filter(tables,function(t){
							return t.get('name').toLowerCase() === n.toLowerCase();
						});
						return ( 1 === l.length ? l : _.filter(tables,function(t){
							return -1 !== t.get('name').toLowerCase().indexOf(n.toLowerCase());
						}));
					})
					.value();

				_.each(matches,function(o,idx){
					if(1 !== o.length) {
						if(o.length) {
							errors.push('Rollable Table [<b>'+args[idx+1]+'</b>] is ambiguous and matches '+o.length+' names: <b><i> '+_.map(o,function(e){
								return e.get('name');
								}).join(', ')+'</i></b>');
						} else {
							errors.push('Rollable Table [<b>'+args[idx+1]+'</b>] does not match any names.');
						}
					}
				},errors);

				if(errors.length) {
					sendChat('','/w gm '
						+'<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">'
							+'<div><span style="font-weight:bold;color:#990000;">Error:</span> '
							+errors.join('</div><div><span style="font-weight:bold;color:#990000;">Error:</span> ')
							+'</div>'
						+'</div>'
					);
					break;
				}

				if( ! errors.length) {
					matches=_.chain(matches)
						.flatten(true)
						.map(function(t){
							tableIDs.push(t.id);
                            return t;
						})
						.value();

					items=findObjs({type: 'tableitem'});
					itemMatches=_.chain(items)
						.filter(function(i){
							return _.contains(tableIDs,i.get('rollabletableid'));
						})
                        .reduce(function(memo,e){
                            if(!_.has(memo,e.get('rollabletableid'))) {
                                memo[e.get('rollabletableid')]=[e];
                            } else {
                                memo[e.get('rollabletableid')].push(e);
                            }
                            return memo;
                        },{})
						.value();
                    _.each(matches, function(t){
                        accum+='!import-table --'+nameEscape(t.get('name'))+' --'+(t.get('showplayers') ? 'show' : 'hide')+'<br>';
                        _.each(itemMatches[t.id], function(i){
                            accum+='!import-table-item --'+nameEscape(t.get('name'))+' --'+nameEscape(i.get('name'))+' --'+i.get('weight')+' --'+i.get('avatar')+'<br>';
                        });
                    });
                    sendChat('', '/w gm '+accum);

				}
				break;
				
				
		}

	},
    handleRemoveTable = function(obj){
        tableCache = _.without(tableCache,obj.id);
    },

	registerEventHandlers = function() {
		on('chat:message', handleInput);
        on('destroy:rollabletable', handleRemoveTable);
	};

	return {
		CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};
}());


on("ready",function(){
	'use strict';

	TableExport.CheckInstall();
	TableExport.RegisterEventHandlers();
});


//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//   DYNAMIC LIGHTING TOOL
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//####################################
// Dynamic Lighting Tool
// Also available through one-click
// https://app.roll20.net/forum/post/11316788/script-dltool-a-dynamic-lighting-control-panel-and-troubleshooter
// Video https://youtu.be/hANQr07uhFM?si=RBdG1kaXJygZiUeV&t=228
//author: KeithCurtis
//####################################

var API_Meta = API_Meta || {};
API_Meta.dltool = {
    offset: Number.MAX_SAFE_INTEGER,
    lineCount: -1
}; {
    try {
        throw new Error('');
    } catch (e) {
        API_Meta.dltool.offset = (parseInt(e.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, '$1'), 10) - (7));
    }
}
/* globals checkLightLevel */
on('ready', () => {
    const version = '1.0.9';
    log('-=> Dynamic Lighting Tool v' + version + ' is loaded. Base command is !dltool');


  const processInlinerolls = (msg) => {
    if(msg.hasOwnProperty('inlinerolls')){
      return msg.inlinerolls
        .reduce((m,v,k) => {
          let ti=v.results.rolls.reduce((m2,v2) => {
            if(v2.hasOwnProperty('table')){
              m2.push(v2.results.reduce((m3,v3) => [...m3,(v3.tableItem||{}).name],[]).join(", "));
            }
            return m2;
          },[]).join(', ');
          return [...m,{k:`$[[${k}]]`, v:(ti.length && ti) || v.results.total || 0}];
        },[])
        .reduce((m,o) => m.replace(o.k,o.v), msg.content);
    } else {
      return msg.content;
    }
  };

    const getPageForPlayer = (playerid) => {
        let player = getObj('player', playerid);
        if (playerIsGM(playerid)) {
            return player.get('lastpage') || Campaign().get('playerpageid');
        }

        let psp = Campaign().get('playerspecificpages');
        if (psp[playerid]) {
            return psp[playerid];
        }

        return Campaign().get('playerpageid');
    };



    const L = (o) => Object.keys(o).forEach(k => log(`${k} is ${o[k]}`));
    const decodeUnicode = (str) => str.replace(/%u[0-9a-fA-F]{2,4}/g, (m) => String.fromCharCode(parseInt(m.slice(2), 16)));
    //tests for existence of ProdWiz in the sandbox
    const isProd = state.hasOwnProperty('Roll20Pro');
    


    let cmdName = "!dltool";
    let theCommand = '';
    let theOption = '';
    let lines = '';
    let pageInfo = '';
    let tokenInfo = '';
    let lightInfo = '';
    let tokenData = '';
    let repeatCommand = `&#10;!dltool`;

    const onButtonSmall = `<div style = 'background-color:#3b0; height:14px; width:25px; position: relative; top:2px; display: inline-block; border-radius:10px;'><div style = 'background-color:white; height:10px; width:10px; margin:2px 2px 2px 13px;display: inline-block;border-radius:10px'></div></div>`;
    const offButtonSmall = `<div style = 'background-color:#888; height:14px; width:25px; position: relative; top:2px; display: inline-block; border-radius:10px;'><div style = 'background-color:white; height:10px; width:10px; margin:2px 12px 2px 2px;display: inline-block;border-radius:10px'></div></div>`;
    const onButtonLarge = `<div style = 'background-color:#3b0; height:18px; width:30px; position: relative; top:2px; display: inline-block; border-radius:10px'><div style = 'background-color:white; height:14px; width:14px; margin:2px 2px 2px 14px;display: inline-block;border-radius:10px'></div></div>`;
    const offButtonLarge = `<div style = 'background-color:#888; height:18px; width:30px; position: relative; top:2px; display: inline-block; border-radius:10px'><div style = 'background-color:white; height:14px; width:14px; margin:2px 16px 2px 2px;display: inline-block;border-radius:10px'></div></div>`;
    let offStyle = `'background-color:#333; color:#ccc; text-decoration: none; text-transform: uppercase; font-weight:bold; font-size: 10px; border:0px solid transparent; border-radius:3px; margin: 2px 2px; padding:1px 6px; display:inline-block'`;
    let onStyle =  `'background-color:#3b0; color:#fff; text-decoration: none; text-transform: uppercase; font-weight:bold; font-size: 10px; border:0px solid transparent; border-radius:3px; margin: 2px 2px; padding:1px 6px; display:inline-block'`;
    let disableStyle = `'background-color:#888; color:#fff; text-decoration: none; text-transform: uppercase; font-weight:bold; font-size: 10px; border:0px solid transparent; border-radius:3px; margin: 2px 3px; padding:1px 6px; display:inline-block'`;
    const openSection = `<div style = 'background-color:#ccc; border: 1px solid black; padding:3px; border-radius:15px;margin-top:10px;'>`;
    const openHeader = `<div style = 'display: block; background-color:#333; color: #3b0; font-weight: bold; padding:2px; border-radius:20px; text-align:center;'>`;
    const openSubhead = `<div style = 'background-color:#333; color: #ccc; font-weight: bold; padding:2px; border-radius:20px; text-align:center;'>`;
    const openPageHead = `<div style = 'background-color:#aaa; color: #111; font-weight: bold; padding:2px; margin-bottom:6px; border-radius:20px; text-align:center;'>`;
    const openRolll20Subhead = `<div style = 'background-color:#e10085; color: #eee; font-weight: bold; padding:2px; border-radius:20px; text-align:center;margin-bottom: 2px;'>`;
    const openReport = `<div style = 'display: block; position:relative;left: -5px; top: -30px; margin-bottom: -34px; background-color:#888; border-radius:18px; text-decoration:none;color:#000; font-family:Arial; font-size:13px; padding: 8px;'>`;
    const closeReport = `</div>`;
    const manualWarning = `<a style='background-color:transparent; border:0px solid transparent; font-size:11px; position:relative;top:-5px;padding:0px;color:#289500; font-family:pictos; text-decoration:none;' title='Due to a bug in the Roll20 Mod Script system, you may need to open and close the settings manually for the changes to take effect.' href = '!dltool --message -- Due to a bug in the Roll20 Mod Script system, you may need to open and close the settings manually for the changes to take effect.'>S</a>`;


    const spacer = `<div style="width:100%; height:1px; background-color:transparent; margin:5px 0px;"></div>`;
    const stop = `<div title="This is an issue that will prevent this token from being able to utilize dynamic lighting." style = "background-color: red;    display:inline-block; height:8px; width:8px; margin: 8px 4px 0px 0px; border: 1px solid #111 "></div>`;
    const caution = `<div title="This may or may not be an issue. It means that the token will be able to use dynamic lighting but only under certain conditons. A light source token on the map layer for instance will work as intended, but a player token will be blind and inaccessible to players." style = "background-color:#ffbf00; display:inline-block; height:8px; width:8px; margin: 8px 4px 0px 0px; border: 1px solid #111 "></div>`;
    const go = `<div title="The token has passed this particular test for dynamic lighting. There is no issue here." style = "background-color: #3b0;   display:inline-block; height:8px; width:8px; margin: 8px 4px 0px 0px; border: 1px solid #111 "></div>`;
    const HR = `<div style="width:100%; height:1px; background-color:#fff; margin:5px 0px;"></div>`;


    //BUTTON: TOGGLE FOR PAGE PROPERTIES
    const toggle = (size, value, pageProperty) => {
//if (pageProperty === "daylight_mode_enabled"){log ("daylight_mode_enabled = " + value)};
        let toggleButton = '';
        if (size === "large" && (value === true || value === "true" || value === "basic")) {
            toggleButton = onButtonLarge
        }
        if (size === "large" && value === false) {
            toggleButton = offButtonLarge
        }
        if (size === "small" && (value === true || value === "true" || value === "basic")) {
            toggleButton = onButtonSmall
        }
        if (size === "small" && value === false) {
            toggleButton = offButtonSmall
        }

        if (undefined === pageProperty) {
            pageProperty = '';
        }
        let finalButton = `<a style='background-color:transparent; border:0px solid transparent; padding:0px;' href = '!dltool --${pageProperty}|${((value === "true" || value === true) ? "false" : "true")}${repeatCommand} --report'>${toggleButton}</a>`;
        if (pageProperty === "explorer_mode") {
            finalButton = `<a style='background-color:transparent; border:0px solid transparent; padding:0px;' href = '!dltool --${pageProperty}|${((value === "basic") ? "off" : "basic")}${repeatCommand} --report'>${((value === "basic") ? onButtonSmall : offButtonSmall)}</a>`;
        }
        return finalButton;
    };

    //BUTTON: COLOR PICKETR CALLING BUTTON
    const colorButton = (pageOrToken, property, value) => {
        if (null === value) value = "transparent";
        if (property === "gridcolor" && !value.includes("#")) value =  "#"+value;
        let finalButton = `<a href = "!dltool --colorpicker|${pageOrToken}%%${property}" style ="display:inline-block; width: 18px; height:14px; position:relative; top:1px; border: 1px solid #111; border-radius:3px; padding:0px; margin-top:1px; margin-left: -2px; color:transparent; background-color:${value}">&nbsp;</a>`;
        return finalButton;

    };

    //BUTTON: TOGGLE FOR TOKEN PROPERTIES
    const toggleToken = (value, tokenProperty, offCode, onCode) => {
        let toggleButton = '';
        let buttonCode;
        if (value === true || value === "true" || value === "on") {
            toggleButton = onButtonSmall;
            buttonCode = offCode;
        } else {
            toggleButton = offButtonSmall;
            buttonCode = onCode;
        }

        if (undefined === tokenProperty) {
            tokenProperty = '';
        }
        let finalButton = `<a style='background-color:transparent; border:0px solid transparent; padding:0px;' href = '${buttonCode}${repeatCommand} --report'>${toggleButton}</a>`;
        return finalButton;
    };


    //BUTTON: GENERIC FOR DLTOOL
    const dlButton = (label, link) => {
        let finalButton = `<a style='background-color:#333; color:#eee; text-decoration: none; border:1px solid #3b0; border-radius:15px;padding:0px 3px 0px 3px;display:inline-block' href = '${link}'>${label}</a>`;
        return finalButton;
    };

    //BUTTON: SMALL INLINE BUTTON -- dropped, but keep if needed in future
/*      const dlSmallButton = (label, link) => {
        let finalButton = `<a style='background-color:#333; color:#eee; text-decoration: none; border:1px solid #3b0; border-radius:15px;padding:0px 3px 0px 3px;display:inline-block; font-size:9px' href = '${link}'>${label}</a>`;
        return finalButton;
    };
*/

    //BUTTON: TOKEN LIGHT PRESETS
    const lightButton = (label, dimLight, brightLight, arc, onCode) => {
        let totalLight = dimLight + brightLight;
        let cautionText = ((label.includes("Bullseye")) ? " Due to a bug in the Roll20 Mod Script system, you may need to open and close the token settings manually for the changes to take effect." : "");
        let finalButton = ``;
        let conditionalStyle = onStyle;
        let conditonalLink = `!token-mod --set emits_bright_light|off emits_low_light|off light_angle|360${repeatCommand} --report`;
        if (tokenData.get("low_light_distance") === totalLight && tokenData.get("bright_light_distance") === brightLight && tokenData.get("directional_bright_light_total") === arc) {
            if (tokenData.get("emits_bright_light") === false) {
                conditionalStyle = disableStyle;
                conditonalLink = "!token-mod --set emits_bright_light|on emits_low_light|on light_angle|360" + repeatCommand + " --report";
            }
            finalButton = `<a style=${conditionalStyle} href = '${conditonalLink}'><span title = "dim light ${dimLight}ft. bright light ${brightLight} ft.${cautionText}">${label}</span></a>`;
        } else {
            finalButton = `<a style=${offStyle} href = '${onCode}${repeatCommand} --report'><span title = "dim light ${dimLight}ft. bright light ${brightLight} ft.${cautionText}">${label}</span></a>`;
        }
        return finalButton;
    };

    const visionButton = (label, has_bright_light_vision, has_night_vision, night_vision_distance, hoverText) => {
        let finalButton = ``;
        let conditonalLink = `!token-mod --set emits_bright_light|off emits_low_light|off light_angle|360${repeatCommand} --report`;


        if (tokenData.get("has_bright_light_vision") === has_bright_light_vision && tokenData.get("has_night_vision") === has_night_vision && tokenData.get("night_vision_distance") === night_vision_distance) {
            conditonalLink = "!token-mod --set has_bright_light_vision|false has_night_vision|false " + repeatCommand;
            finalButton = `<a style=${onStyle} href = '${conditonalLink}'><span title = "${hoverText}">${label}</span></a>`;
        } else {
            conditonalLink = "!token-mod --set has_bright_light_vision|" + has_bright_light_vision + " has_night_vision|" + has_night_vision + " night_vision_distance|" + night_vision_distance + ((night_vision_distance === 60) ? " night_vision_effect|nocturnal" : " ") + repeatCommand;
            finalButton = `<a style=${offStyle} href = '${conditonalLink}'><span title = "${hoverText}">${label}</span></a>`;

        }



        return finalButton;
    };



    //SET VALUE BUTTON FOR ANY
    const setValue = (value, property, setCode) => {

        //Edge cases and Roll20 bug correctors
        if (value === '') {
            value = "0";
        }
        if (value === null) {
            value = "None";
        }
        if (value === undefined) {
            value = "&nbsp;-&nbsp;";
        }

        let openTitle = "";
        let closeTitle = "";
        if (property === "night_vision_effect") {

            switch (value) {
                case "None":
                    openTitle = `<span title = "The token sees everything within the night vision range as bright light.">`;
                    closeTitle = `</span>`;
                    break;
                case "Nocturnal":
                    openTitle = `<span title = "Nocturnal Vision is a mode that mimics DnD5e and PF2e rules for Darkvision. When enabled, tokens will have Low Light in No Light areas, and Low Light areas will appear Brightly Lit.">`;
                    closeTitle = `</span>`;
                    break;
                default: {
                    let dimmingDistance = parseFloat(tokenData.get('night_vision_effect').replace(/^Dimming_/, '')) || 0;
                    dimmingDistance = Math.round(dimmingDistance * tokenData.get('night_vision_distance'));
                    openTitle = `<span title = "Dimming causes the vision area of the selected token to become dim Night Vision. ${dimmingDistance} feet of Dimming will have the inner ${dimmingDistance} feet of Night Vision appear bright while any amount left over will appear dim from that distance onward to the end of the night vision area.">`;
                    closeTitle = `</span><BR>` +
                        `<span style="margin-left:28px;">Dimming Distance starts at: ${openTitle}<a style='background-color:#333; min-width: 15px; text-align:right; color:#eee; border:1px solid #3b0; border-radius:3px;padding:0px 3px 0px 3px;display:inline-block' href = '!token-mod --set night_vision_effect|dimming|?{Set dimming dropoff distance in feet|${dimmingDistance}} ${repeatCommand} --report'>${dimmingDistance}</a>${closeTitle}</span>`;
                    value = "Dimming";
                }
            }
        }

        if (property === "fog_opacity" || property === "daylightModeOpacity" || property === "dim_light_opacity") {
            value = value * 100; //for display. We want the user to see percentages, not decimals
        }



        let finalButton = `${openTitle}<a style='background-color:#333; min-width: 15px; text-align:right; color:#eee; border:1px solid #3b0; border-radius:3px;padding:0px 3px 0px 3px;display:inline-block' href = '${setCode} ${repeatCommand} --report'>${value}</a>${closeTitle}`;
        return finalButton;
    };

    //GENERATES A LABEL WITH HOVERTEXT
    const label = (phrase, helptext) => {
        let finalLabel = `<span title = "${helptext}">${phrase}</span>`;
        return finalLabel;
    };


    //GENERATES PICTOS CHARACTER
    const pictos = (character, color) => {
        let pictosChar = `<span style = "font-family:pictos; ${((undefined !== color) ? 'color:' + color : '')}">${character}</span>`;
        return pictosChar;
    };

    //GENERATES Arc of Light
    const lightArc = (degrees) => {
        let imgPosition = `style= "position:relative; top:-2px;" `;
        let finalButton = "";
        if (degrees < 361) {
            finalButton = `<img ${imgPosition} src = "https://s3.amazonaws.com/files.d20.io/images/327269160/8sw7NxlV05adop79r5f2qQ/original.png?1676017045">`;
        }
        if (degrees < 290) {
 
            finalButton = `<img ${imgPosition} src = "https://s3.amazonaws.com/files.d20.io/images/327269162/d4MO9b-lpqOgNJvpxGsavQ/original.png?1676017045">`;
        }
        if (degrees < 220) {
            finalButton = `<img ${imgPosition} src = "https://s3.amazonaws.com/files.d20.io/images/327269161/qM3QHPQRvXsIQadDpqTo4Q/original.png?1676017045">`;
        }
        if (degrees < 150) {
            finalButton = `<img ${imgPosition} src = "https://s3.amazonaws.com/files.d20.io/images/327269163/zfqabEQXAHPqV9wPCfuK6g/original.png?1676017045">`;
        }
        if (degrees === 0) {
            finalButton = `<img ${imgPosition} src = "https://s3.amazonaws.com/files.d20.io/images/327269159/ieyV_MAZgBQfRS4e4PhjAw/original.png?1676017044">`;
        }


        return finalButton;
    };


    const getGMPlayers = (pageid) => findObjs({
            type: 'player'
        })
        .filter((p) => playerIsGM(p.id))
        .filter((p) => undefined === pageid || p.get('lastpage') === pageid)
        .map(p => p.id);




    //BECAUSE ROLL20
    const stringToBoolean = function(string) {
        switch (string.toLowerCase().trim()) {
            case "true":
            case "yes":
            case "1":
                return true;
            case "false":
            case "no":
            case "0":
            case null:
                return false;
            default:
                return Boolean(string);
        }
    };

    //UTILITY INFO BLOCK
    const utilityInfo = openSection +
        ((tokenData !== '') ? dlButton("Why can't this token see?", "!dltool --report|checklist") : dlButton("Why can't this token see?", "!dltool --report|checklist")) +
        dlButton("Other things to check for", "!dltool --checklist") +
        dlButton("Help Center", "https&#58;//help.roll20.net/hc/en-us/articles/360045793374-Dynamic-Lighting-Requirements-Best-Practices") + `&nbsp;&nbsp;` +
        dlButton("DL Report ", "!dltool --report") + `&nbsp;|&nbsp;` + dlButton("Vision", "!dltool --report|vision") + dlButton("Light", "!dltool --report|light") + dlButton("Page", "!dltool --report|page") + dlButton(" + ", "!dltool --report|extra") +
  (isProd? "<BR><b>Prod Wiz: </b>"+dlButton("Main Menu ", "!prod") + " " +dlButton("Map Menu ", "!prod map") : "")+


        `</div>`;



    on('chat:message', (msg) => {
        if ('api' !== msg.type) {
            return;
        }
        
        msg.content = processInlinerolls(msg);

        let msgTxt = msg.content;
        repeatCommand = `&#10;!dltool`;
        let pageData = getObj('page', getPageForPlayer(msg.playerid));
        if (msg.content.match(/report\|extra/m)) {
            repeatCommand = `&#10;!dltool --report|extra`;
        }
        if (msg.content.match(/report\|setscale/m)) {
            repeatCommand = `&#10;!dltool --report|setscale`;
        }
        if (msg.content.match(/report\|light/m)) {
            repeatCommand = `&#10;!dltool --report|light`;
        }
        if (msg.content.match(/report\|vision/m)) {
            repeatCommand = `&#10;!dltool --report|vision`;
        }
        if (msg.content.match(/report\|page/m)) {
            repeatCommand = `&#10;!dltool --report|page`;
        }
        //let repeatCommandChecklist = `&#10;!dltool --report|checklist`;


        //BUTTON: DAYLIGHT PRESETS
        const daylightButton = (label, value, code) => {
            let finalButton = "";
            let conditionalStyle = onStyle;

            if (pageData.get("daylightModeOpacity") * 100 === value) {
                if (pageData.get("daylight_mode_enabled") === false) {
                    conditionalStyle = disableStyle;
                }

                finalButton = `<a style=${conditionalStyle} href = '${code}${repeatCommand} --report'>${label}</a>`;
            } else {
                finalButton = `<a style=${offStyle} href = '${code}${repeatCommand} --report'>${label}</a>`;
            }
            return finalButton;
        };


        //BUTTON: GRID PRESETS
        const gridButton = (label, cellwidth, color, transparency, code) => {
            let finalButton = "";
            let conditionalStyle = onStyle;

            if (pageData.get("grid_opacity")  === transparency && pageData.get("gridcolor")  === color) {
                    conditionalStyle = onStyle;
            

                finalButton = `<a style=${conditionalStyle} href = '${code}${repeatCommand} --report'>${label}</a>`;
            } else {
                finalButton = `<a style=${offStyle} href = '${code}${repeatCommand} --report'>${label}</a>`;
            }
           // log('finalButton: ' + finalButton);
            return finalButton;
        };



        const cellWidthButton = (label, value, code) => {
            let finalButton = "";
            let conditionalStyle = onStyle;

            if (pageData.get("snapping_increment") === value) {
                if (pageData.get("snapping_increment") !== value) {
                    conditionalStyle = disableStyle;
                }
                finalButton = `<a style=${conditionalStyle} href = '${code}${repeatCommand} --report'>${label}</a>`;
            } else {
                finalButton = `<a style=${offStyle} href = '${code}${repeatCommand} --report'>${label}</a>`;
            }
            return finalButton;
        };




        //MESSAGE HANDLING
        //        if ((msg.type == "api" && msgTxt.indexOf(cmdName) !== -1 && playerIsGM(msg.playerid)) || (msgTxt === "!dltool --pcchecklist")) {
        if (msg.type == "api" && msgTxt.indexOf(cmdName) !== -1) {
            let APIMessage = msg.content;
            if (APIMessage === "!dltool" || APIMessage === "!dltools") {
                APIMessage = "!dltool --report";
            }
            let args = APIMessage.split(/\s--/);

            //            let commands = args[1].split(/\s+/);

            let commands = args[1].match(/(?:[^\s"]+|"[^"]*")+/g);



            let theMessage = args[2];
            let checkLightButton = "";
            tokenData = '';
            if (msg.selected) {
                tokenData = getObj('graphic', msg.selected[0]._id);
              if(!tokenData) {
                tokenData ='';
              }
            }
            pageData.set('force_lighting_refresh', true);


            commands.forEach(c => {
                theCommand = c.split(/\|/)[0];
                theOption = c.split(/\|/)[1];
 
                let checklistTokenInfo;
                let pagePlusInfo;
                let scaleInfo;

                //CASES FOR COMMANDS

                switch (theCommand) {

                    //CASE - REPORT
                    case 'report': {

                        //FULL REPORT

                        //VISION SECTON
                        if (tokenData !== '') {
                            let lightData = '';
                            if (typeof checkLightLevel !== "undefined") {
                                lightData = checkLightLevel.isLitBy(tokenData.get("id"));
                                checkLightButton = HR +
                                    "<b>" + `<span title="This is the amount of light currently falling on the token. Without night vision, a token needs to have a light source in order to be able to see. A zero value means the token is in darkness.">` + "Token is in " + (lightData.total * 100).toFixed() + "% total light</span></b>&nbsp;" +
                                    dlButton("Report", "!checklight");

                            } else {
                                checkLightButton = '<br>' + dlButton("Check Amount of Light on the Token", "!dltool --message --If you want this functionality, you will need to install checkLightLevel, an external script by Oosh. You can find it in One Click install on your Mod page.");
                            }
                            let controllerNames = "";
                            let controllers = '';
                            let char = false;
                            if (tokenData.get("represents")) {
                                char = ((tokenData.get("represents")) ? getObj("character", tokenData.get("represents")) : false);
                            } else {
                                char = false;
                            }
                            if (char) {
                                controllers = char.get("controlledby").split(",");
                                if (char.get("controlledby")) {
                                    controllers.forEach(c => {
                                        controllerNames = controllerNames + ((c === "all") ? "All players" : getObj("player", c).get("_displayname")) + " • ";
                                    });
                                }
                            } else {
                                controllers = tokenData.get("controlledby").split(",");
                                if (tokenData.get("controlledby")) {
                                    controllers.forEach(c => {
                                        controllerNames = controllerNames + ((c === "all") ? "All players" : getObj("player", c).get("_displayname")) + " • ";
                                    });

                                }
                            }


                            controllerNames = controllerNames + "•";
                            controllerNames = controllerNames.split(" • •")[0].replace(/\s•\s/g, ", ").replace(/•/, "");
                            if (controllerNames === '')(controllerNames = "None (GM only by default)");
                            let tokenName = (tokenData.get("name") || "unnamed");

                            //REGULAR REPORT
                            tokenInfo =
                                openSection +
                                openSubhead + 'Token Vision</div>' +
                                openPageHead + '&quot;' + tokenName + '&quot; <span style ="font-size:12px; font-weight:normal;">' + ((char) ? ' (' + char.get("name") + ')' : '<span title = "This token does not represent a character">(generic)</span>') + '</span><BR><span style = "font-size=10px; font-weight:normal;" title="This is a list of people who control this token. If a name is not here, no player but the GM can use this token\'s vision settings.">Controllers: ' + controllerNames + '</span></div>' +
                                toggleToken(tokenData.get("has_bright_light_vision"), "has_bright_light_vision", "!token-mod --set has_bright_light_vision|off has_night_vision|off", "!token-mod --set has_bright_light_vision|on has_limit_field_of_vision|false") + ' <span title = "If this is on, the token has vision enabled. It will still need either Night Vision, or a nearby lightsource, otherwise it will see only blackness. A GM can test this by selecting the token and pressing Cntrl/Cmd-L. This is only an approximation. For true testing, it is recommended to use a Dummy Account. You can find out more about this in the Roll20 wiki. NOTE: Sometimes default values in token light can cause a token to see nothing regardless. Try toggling a light preset for this token on and off."> <b>Vision</b></span> &nbsp;' + '<BR>' +
                                toggleToken(tokenData.get("has_night_vision"), "has_night_vision", "!token-mod --set has_bright_light_vision|on has_night_vision|off", "!token-mod --set has_bright_light_vision|on has_night_vision|on  night_vision_effect|nocturnal") + ' <span title = "This defaults to night vision with the Nocturnal settin. No distance is set. Choose that in the fields to the right.">Night Vision</span> ' +
                                setValue(tokenData.get("night_vision_distance"), "night_vision_distance", "!token-mod --set has_bright_light_vision|on has_night_vision|on night_vision_effect|nocturnal night_vision_distance|?{Input new Night Vision distance in feet}") + "ft " +
                                ((tokenData.get("has_night_vision") && tokenData.get("night_vision_distance") < 1) ? `<span style='font-size:11px; position:relative;top:-5px;padding:0px;color:#ff0000; font-family:pictos;' title='This token has night vision, but the distance is set to zero, and it will not be able to see anything. You can set a deistance, or use one of the Vision Preset buttons below.'>*</span>` : "") +
                                '<BR>' +


                                '<span title="Use sparingly. Too many tokens with tinted light can lead to a confusing view for the GM, and may give unexpected results where they overlap." >&nbsp;Tint:' + setValue(tokenData.get("night_vision_tint"), "night_vision_tint", "!token-mod --set night_vision_tint|?{Use sparingly. May interact poorly with colored light. Input in hex, rgb or hsv format.|transparent}") + "</span> " +
                                colorButton("token", "night_vision_tint", tokenData.get('night_vision_tint')) +

                                //`<div style ="display:inline-block; width: 18px; height:14px; position:relative; top:1px; border: 1px solid #111; border-radius:3px; margin-top:1px; margin-left: -2px; background-color:${tokenData.get('night_vision_tint')}">&nbsp;</div>` +


                                `<span title="The mode provides alternative functionality to the Night Vision effect.Dimming causes the vision area of the selected token to become dim Night Vision. Nocturnal mimics DnD5e and PF2e rules for Darkvision.">&nbsp;Mode: ` + setValue(tokenData.get("night_vision_effect"), "night_vision_effect", "!token-mod --set night_vision_effect|?{Choose Mode|None,None|Nocturnal,Nocturnal|Dimming,Dimming } ") + `<BR>` +


                                toggleToken(tokenData.get("has_limit_field_of_vision"), "has_limit_field_of_vision", "!token-mod --set has_limit_field_of_vision|off", "!token-mod --set has_limit_field_of_vision|on") + ' <span title = "This toggles the field of view for a token, and is mostlly useful for systems which have a facing rule. For directional lighting, like a flashlight beam, use Directional Light in the lighting section. Due to a bug in the Roll20 Mod Script system, you may need to open and close the token settings manually for the changes to take effect.">Field of Vision</span> &nbsp;' +
                                `&nbsp;<span title="Arc of Light.">` + setValue(tokenData.get("limit_field_of_vision_total"), "limit_field_of_vision_total", "!token-mod --set limit_field_of_vision_total|?{Input arc of light in degrees}") + "</span>° Arc " +
                                lightArc(tokenData.get("limit_field_of_vision_total")) + `&nbsp;${manualWarning}` + '<BR>' +
                                checkLightButton + HR +
                                `<b>${label("Vision Presets:", "These buttons will handle the most common vision cases for DnD 5e.")} <b><br>` +
                                visionButton("normal", true, false, tokenData.get("night_vision_distance"), "Standard vision for humans and other characters without darkvision") + " | " + visionButton("Darkvision 60ft", true, true, 60, "Standard darkvision for most characters with this trait") + visionButton("90", true, true, 90, "Many monsters have 90ft of darkvision. Example: Trolls or Night Hags") + visionButton("120", true, true, 120, "Enhanced darkvision used by races such as Drow or Duergar") +
                                `</div>`;


                            //CHECKLIST REPORT

                            let lightOnTOken = ((lightData) ? lightData.total : -1);

                            checklistTokenInfo =
                                openSection +
                                openSubhead + 'Token Vision Checklist</div>' +

                                ((tokenData.get("has_bright_light_vision")) ? label(`${go}<b>${tokenName}</b> has vision, but may require a light source. ` + ((lightData) ? `${tokenName} is in ${(lightData.total * 100).toFixed()}% total light` : ''), `Although this token has sight, it still may require a light source from itself or an outside source, or for page settings to grant daylight.`) : label(`<b>${stop}${tokenName}</b> has its vision turned off. It cannot see.` + `<div style = "display:inline-block">` + ((playerIsGM(msg.playerid)) ? toggleToken(tokenData.get("has_bright_light_vision"), "has_bright_light_vision", "!token-mod --set has_bright_light_vision|off has_night_vision|off", "!token-mod --set has_bright_light_vision|on has_limit_field_of_vision|false") + ' <span title = "If this is on, the token has vision enabled. It will still need either Night Vision, or a nearby lightsource, otherwise it will see only blackness. A GM can test this by selecting the token and pressing Cntrl/Cmd-L. This is only an approximation. For true testing, it is recommended to use a Dummy Account. You can find out more about this in the Roll20 wiki. NOTE: Sometimes default values in token light can cause a token to see nothing regardless. Try toggling a light preset for this token on and off.">Vision</span>' : '') + '</div>', `Without sight turned on, a token cannot utilize dynamic lighting. This is the recommended setting for most NPCs. Too many tokens with sight on the VTT can lead to confusing areas of apparent brightness for the GM`)) + `<BR>` +


                                ((tokenData.get("night_vision_distance") !== 0) ?
                                    ((tokenData.get("has_night_vision")) ? label(`<b>${go}${tokenName}</b> has ${tokenData.get("night_vision_distance")}ft of Night Vision, and does not require a light source`, `You may still need to check if it has a non-zero distance on its night vision. Certain modes may affect how it interacts with existing light. For instance, Nocturnal mode can change dim light to bright within the token's Night Vision range.`) : label(`<b>${caution}${tokenName}</b> has Night Vision turned off. It cannot see without a light source.`, `Night Vision allows a token to see without a light source.`) + `<div style = "display:inline-block">` + ((playerIsGM(msg.playerid)) ? toggleToken(tokenData.get("has_night_vision"), "has_night_vision", "!token-mod --set has_bright_light_vision|on has_night_vision|off", "!token-mod --set has_bright_light_vision|on has_night_vision|on  night_vision_effect|nocturnal") + ' <span title = "This defaults to night vision with the Nocturnal settin.">Night Vision</span>' : '') + '</div> ') :
                                    ((tokenData.get("has_night_vision")) ? label(`${stop}<b>${tokenName}</b> has Night Vision, but the distance is set for ${tokenData.get("night_vision_distance")}ft. It can see light sources, but if you wish it to see in the dark, you must specify a distance.`, `Certain modes may affect how it interacts with existing light. For instance, Nocturnal mode can change dim light to bright within the token's Night Vision range.`) : label(`<b>${caution}${tokenName}</b> has Night Vision turned off. It cannot see without a light source.`, `Night Vision allows a token to see without a light source.`))
                                ) + `<BR>` +


                                ((tokenData.get("represents") && typeof getObj('character', tokenData.get("represents")) !== "undefined") ?
                                    ((controllerNames !== "None (GM only by default)") ?
                                        `${go}This token represents the character <b>${char.get("name")}</b>, and is under the control of the following players: <b>${controllerNames}</b>. They are the only ones who can use this token for dynamic lighting.` :
                                        label(`${caution}This token represents the character <b>${char.get("name")}</b>, but has no specified controller. Only the GM can use it for dynamic lighting vision, by pressing Cmd/Ctrl-L.`, `It does not represent a character sheet. If you are setting up a PC, be sure to assign the sheet to the token before saving this as the default token for the sheet. Saving as default should always be the last step. If this is meant to be an NPC it is fine as-is, but you may want to consider assigning control to the GM to avoid some transparency issues when using Exploration Mode.`)) :
                                    ((controllerNames !== "None (GM only by default)") ?
                                        `${caution}This generic token is under the control of the following players: <b>${controllerNames}</b>. They are the only ones who can use this token for dynamic lighting. It does not represent a character sheet. If you are setting up a PC, be sure to make all settings and assign the sheet to the token <i>before</i> saving this as the default token for the sheet. Saving as default should always be the last step.` :
                                        `${caution}This token has no specified controller. Only the GM can use it for dynamic lighting vision, by pressing Cmd/Ctrl-L.`)
                                ) + `<BR>` +
                                ((tokenData.get("lightColor") !== "transparent" && tokenData.get("has_night_vision")) ? label(`${caution}<b>${tokenName}</b> is emitting tinted light, but also has Night Vision. Night Vision trumps tinted light, and the color will not appear within its limits.`, `Colored light should be used sparingly. It interacts in unexpected ways with other light sources and with night vision. Colored vision is not recommended.`) + `<BR>` : ``) +
                                ((tokenData.get("limit_field_of_vision_total") < 360 && tokenData.get("has_limit_field_of_vision")) ? label(`${caution}<b>${tokenName}</b>  has a limited field of vision. It is directional and may not show entire area around token. If the directional value is set to 0, the token will not be able to see anything. ` + ((playerIsGM(msg.playerid)) ? `You can turn OFF limited field of view with this switch, but due to a Roll20 bug, you will need to open and close the token settings manually for it to take effect.<BR>` + toggleToken(tokenData.get("has_limit_field_of_vision"), "has_limit_field_of_vision", "!token-mod --set has_limit_field_of_vision|off", "!token-mod --set has_limit_field_of_vision|on") + '&nbsp;<span title = "Turn this off to restore a full field of view to the token.">Turn off Limited Field of View</span> &nbsp;' : ``), `Turn this off to restore a full field of view to the token.`) + `<BR>` : ``) +


                                ((tokenData.get("layer") === "walls") ? `${caution}This token is on the Dynamic Lighting layer.<BR>Dynamic Lighting will only work for the GM, by using Cmd/Ctrl-L, but players are only able to access tokens on the Token layer.<BR>Light emitted by tokens on the Dynamic Lighting Layer can be seen by tokens on the Token layer. ${dlButton("Move token to Token Layer", "!token-mod --set layer|objects")}<BR>` : '') +
                                ((tokenData.get("layer") === "gmlayer") ? `${stop}This token is on the GM layer.<BR>Dynamic Lighting will not function on the GM layer, nor will any light sources provide light.<BR>Players are only able to access tokens on the Token layer. ${dlButton("Move token to Token Layer", "!token-mod --set layer|objects")}<BR>` : '') +
                                ((tokenData.get("layer") === "map") ? `${caution}This token is on the Map layer.<BR>Dynamic Lighting will only work for the GM, by using Cmd/Ctrl-L.<BR>Light emitted by tokens on the Dynamic Lighting Layer can be seen by tokens on the Token layer.<BR>Players are only able to access tokens on the Token layer. ${dlButton("Move token to Token Layer", "!token-mod --set layer|objects")}<BR>` : '') +
                                ((pageData.get("dynamic_lighting_enabled")) ? `${go}Dynamic Lighting is on. All Dynamic Lighting features should be available.` : `${stop}Dynamic Lighting is <b>OFF</b> for this page. No Dynamic Lighting features will function until this is turned on.` + ((playerIsGM(msg.playerid)) ? `<div style = "display:inline-block">` + toggle("small", pageData.get("dynamic_lighting_enabled"), "dynamic_lighting_enabled") + '<span title = "Toggling this setting to off will toggle off all settings below, but they will return to their previous state when you turn Dynamic Lighting back on."> Dynamic Lighting</span> (May require game refresh)</div>' : ``)) + `<br>` +

                                ((playerIsGM(msg.playerid)) ?
                                    ((pageData.get("dynamic_lighting_enabled") && pageData.get("daylight_mode_enabled")) ? `${go}Daylight Mode is on. No tokens need a specific light source. Daylight Opacity level has been set for ${Math.round(pageData.get("daylightModeOpacity") * 100)}%. Low levels indicate a darker overall light.` : ((lightOnTOken === 0 && !tokenData.get("has_night_vision")) ? stop : caution) + `Daylight Mode is off. Any token without Night Vision will need to have line of sight to a specific light source. ` + ((lightData) ? `<b>${tokenName}</b> is in ${(lightData.total * 100).toFixed()}% total light${((tokenData.get("has_night_vision")) ? ", but has Night Vision." : ", and has no Night Vision. " + `<div style = "display:inline-block">` + toggleToken(tokenData.get("has_night_vision"), "has_night_vision", "!token-mod --set has_bright_light_vision|on has_night_vision|off", "!token-mod --set has_bright_light_vision|on has_night_vision|on  night_vision_effect|nocturnal") + ` <span title = "This defaults to night vision with the Nocturnal settin.">Night Vision</span></div> `)} ` : '') + `<div style = "display:inline-block">` + toggle("small", pageData.get("daylight_mode_enabled"), "daylight_mode_enabled") + ' <span title = "When Daylight Mode is on, tokens with Vision do not need specific light sources in able to see. You can adjust the amount of daylight to simulate fog, twilight, a moonlit night or a shadowiy interior. Higher values are brighter.">Day Mode</span></div>') + `<br>` :
                                    ((pageData.get("dynamic_lighting_enabled") && pageData.get("daylight_mode_enabled")) ? `${go}Daylight Mode is on. No tokens need a specific light source. Daylight Opacity level has been set for ${Math.round(pageData.get("daylightModeOpacity") * 100)}%. Low levels indicate a darker overall light.` : ((lightOnTOken === 0 && !tokenData.get("has_night_vision")) ? stop : caution) + `Daylight Mode is off. Any token without Night Vision will need to have line of sight to a specific light source. ` + ((lightData) ? `<b>${tokenName}</b> is in ${(lightData.total * 100).toFixed()}% total light${((tokenData.get("has_night_vision")) ? ", but has Night Vision." : ", and has no Night Vision. " )} ` : '')) + `<br>`
                                ) +

                                //  ID of page the sender is on : ID of GMPlayers on this page
                                ((getPageForPlayer(msg.playerid) === getPageForPlayer(getGMPlayers(getPageForPlayer(msg.playerid)))) ? `` : `${caution} GM is either not logged in, or is not on the same page this token is on. If testing vision or light for token against the GM's report, please make sure that both GM and player are on the same page, and that the token has not been <a style = "color:##7e2d40; background-color:transparent; padding:0px;" href="https&#58;//help.roll20.net/hc/en-us/articles/360039675413-Page-Toolbar#PageToolbar-SplittheParty">split from the party</a>.<BR>`) +


                                ((playerIsGM(msg.playerid)) ? dlButton("Token settings don't stick?", "!dltool --default") : '') +


                                `${HR}<b>Key:</b><br>` +
                                `${go} No problem.<BR>` +
                                `${caution} Caution. This may give problems in some circumstances.<BR>` +
                                `${stop} Problem that will likely prevent this token from using Dynamic Lighting.<BR>` +
                                `</div>`;

                            checklistTokenInfo = checklistTokenInfo.replace(/&#10;!dltool/g, "&#10;!dltool --report|checklist");

                        } else {
                            tokenInfo = `<div style="text-align:center; font-style: italic;">No token is selected.</div>`;
                            checklistTokenInfo = `<div style="text-align:center; font-style: italic;">No token is selected.<br>Please select a token and try again.</div>`;
                        }


                        //LIGHT SECTON
                        if (tokenData !== '') {

                            lightInfo = openSection +
                                openSubhead + 'Token Light</div>' +
                                spacer.replace(`margin:5px`, `margin:2px`) +
                                toggleToken(tokenData.get("emits_bright_light"), "emits_bright_light", "!token-mod --set emits_bright_light|off emits_low_light|off light_angle|360", "!token-mod --set emits_bright_light|on emits_low_light|on light_angle|360") + ' <span title = "This toggles whether or not the selected token emits light. You can set those values below, and they will persist and be restored if lighting is turned off and back on."><b>Light</b></span> &nbsp;' +
                                `<div style= "float:right; margin: 2px 5px 0px 0px; "><div title="This is a graph which shows the proportion of bright to dim light" style = "width: 60px; height:12px; background-image: linear-gradient(to right, #aaa, #999, #444); display:inline-block; border: 1px solid #111"><div style = "width:${(Number(tokenData.get("bright_light_distance")) / Number(tokenData.get("low_light_distance"))) * 100}%; height:12px; background-image: linear-gradient(to right, #eee, #ccc);"></div></div></div>` + '<BR>' +
                                spacer.replace(`margin:5px`, `margin:1px`) +
                                'Bright: <span title="The amount of bright light emitted by this token. Bright light is generated from the center of the token.">' + setValue(tokenData.get("bright_light_distance"), "bright_light_distance", "!token-mod --set emits_bright_light|on bright_light_distance|?{Input Bright light in feet}") + "</span>ft " +
                                '&nbsp;|&nbsp;Dim: <span title="The amount of dim light emitted by this token. Dim light begins at the end of the brght light range.">' + setValue(tokenData.get("low_light_distance") - tokenData.get("bright_light_distance"), "low_light_distance", "!token-mod --set emits_low_light|on low_light_distance|?{Input Bright light in feet}") + "</span>ft " +
                                `<span title="this is the brightness of the dim light emitted by the token. 75% is the default.">Intensity: </span>${setValue(tokenData.get("dim_light_opacity"), "dim_light_opacity", "!token-mod --set dim_light_opacity|?{Set Brightness of Dim light|75}")}%` +


                                `<br>` + HR +

                                //############ Use this section when Roll20 ads directional dim and bright light to the GUI
                                /*
                                `<b>${label("Directional Light: ", "This section limits the arc of emited light, like a flashlight beam. You can set different values for bright and dim light. Due to a Roll20 bug, you may need to open an close the settings for the token for the change to take effect.")}</b><br>` + 
                                toggleToken(tokenData.get("has_directional_bright_light"), "has_directional_bright_light", "!token-mod --set has_directional_bright_light|off", "!token-mod --set has_directional_bright_light|on") + ' <span title = "This toggles whether or not the selected token emits directional light, like a flashlight. You can set those values below, and they will persist and be restored if lighting is turned off and back on.">Bright</span>&nbsp;' +
                                `&nbsp;<span title="Arc of Light.">` + setValue(tokenData.get("directional_bright_light_total"), "directional_bright_light_total", "!token-mod --set directional_bright_light_total|?{Input arc of light in degrees}") + "</span>°" +
                                lightArc(tokenData.get("directional_bright_light_total")) + "&nbsp;&nbsp;&nbsp;" +
                                                                toggleToken(tokenData.get("has_directional_dim_light"), "has_directional_dim_light", "!token-mod --set has_directional_dim_light|off", "!token-mod --set has_directional_dim_light|on") + ' <span title = "This toggles whether or not the selected token emits directional light, like a flashlight. You can set those values below, and they will persist and be restored if lighting is turned off and back on."> Dim</span>&nbsp;' +
                                `&nbsp;<span title="Arc of Light.">` + setValue(tokenData.get("directional_dim_light_total"), "directional_dim_light_total", "!token-mod --set directional_dim_light_total|?{Input arc of light in degrees}") + "</span>°" +
                                lightArc(tokenData.get("directional_dim_light_total")) +
                                */
                                //############ Use this section when Roll20 ads directional dima and bright light to the GUI

                                //############ Remove this section when Roll20 ads directional dima and bright light to the GUI
                                toggleToken(tokenData.get("has_directional_bright_light"), "has_directional_bright_light", "!token-mod --set has_directional_bright_light|off", "!token-mod --set has_directional_bright_light|on") + ' <span title = "This toggles whether or not the selected token emits directional light, like a flashlight. You can set those values below, and they will persist and be restored if lighting is turned off and back on.">Directional Light</span>&nbsp;' +
                                `&nbsp;<span title="Arc of Light.">` + setValue(tokenData.get("directional_bright_light_total"), "directional_bright_light_total", "!token-mod --set directional_bright_light_total|?{Input arc of light in degrees}") + "</span>° Arc " +
                                lightArc(tokenData.get("directional_bright_light_total")) + ' <span title = "Due to a bug in the Roll20 Mod system, you must open and close page settings for this to take effect.">' + manualWarning + '</span>' +
                                //############ Use this section when Roll20 ads directional dima and bright light to the GUI



                                '<BR>' +

                                `<div style="margin-top:0px; display:inline-block">` +
                                '<span title="Use this sparingly, as light colors can interact in unpredicatble ways. Tinting vision is not always optimal, since the interaction is problematic.">&nbsp;Color:' + setValue(tokenData.get("lightColor"), "lightColor", "!token-mod --set lightColor|?{Use sparingly. Input in hex, rgb or hsv format.|transparent}") + "</span> " +
                                colorButton("token", "lightColor", tokenData.get('lightColor')) +

                                '&nbsp;&nbsp;<span title="This should be at 100% in most cases. Some systems, like Pathfinder, and D&D 4e have Low Light Vision, which can increase the effective light of a light source for that token. For example, a token with a light multiplier of 200 would see the light from a campfire as twice as big than a token with the default 100 would.">Multiplier:' + setValue(tokenData.get("light_sensitivity_multiplier"), "light_sensitivity_multiplier", "!token-mod --set light_sensitivity_multiplier|?{Sometimes called Low Light Vision. 100% is recommended for most RPG systems|100}") + "%</span> " +
                                `</div>` + `<br>` +

                                HR +
                                `<b>${label("Light Presets: ", "Presets for most common cases. These are geared toward 5e definitions, but are simple to redefine in the code. Clicking a preset name will also toggle the state of light being on or off. The preset will restored if you toggle the master token light switch off and on.")}</b><br>` +
                                lightButton("Spotlight", 0, 5, 360, "!token-mod --set emits_bright_light|on bright_light_distance|5 low_light_distance|0 has_directional_bright_light|off directional_bright_light_total|360 dim_light_opacity|" + tokenData.get("dim_light_opacity")) +
                                lightButton("Candle", 5, 2, 360, "!token-mod --set emits_bright_light|on emits_low_light|on bright_light_distance|2 low_light_distance|5 has_directional_bright_light|off directional_bright_light_total|360 dim_light_opacity|" + tokenData.get("dim_light_opacity")) +
                                lightButton("Lamp", 15, 15, 360, "!token-mod --set emits_bright_light|on emits_low_light|on bright_light_distance|15 low_light_distance|15 has_directional_bright_light|off directional_bright_light_total|360 dim_light_opacity|" + tokenData.get("dim_light_opacity")) +
                                lightButton("Torch", 20, 20, 360, "!token-mod --set emits_bright_light|on emits_low_light|on bright_light_distance|20 low_light_distance|20 has_directional_bright_light|off directional_bright_light_total|360 dim_light_opacity|" + tokenData.get("dim_light_opacity")) +
                                lightButton("Hooded Lantern", 30, 30, 360, "!token-mod --set emits_bright_light|on emits_low_light|on bright_light_distance|30 low_light_distance|30 has_directional_bright_light|off directional_bright_light_total|360 dim_light_opacity|" + tokenData.get("dim_light_opacity")) +
                                "<div style = 'display: inline-block;'>" + lightButton("Bullseye Lantern " + pictos("!"), 60, 60, 90, "!token-mod --set emits_bright_light|on emits_low_light|on bright_light_distance|60 low_light_distance|60 has_directional_bright_light|on directional_bright_light_total|90 dim_light_opacity|" + tokenData.get("dim_light_opacity")) + "</div>" +
                                lightButton("<i>Light<i>", 20, 20, 360, "!token-mod --set emits_bright_light|on emits_low_light|on bright_light_distance|20 low_light_distance|20 has_directional_bright_light|off directional_bright_light_total|360 dim_light_opacity|" + tokenData.get("dim_light_opacity")) +
                                lightButton("<i>Daylight<i>", 60, 60, 360, "!token-mod --set emits_bright_light|on emits_low_light|on bright_light_distance|60 low_light_distance|60 has_directional_bright_light|off directional_bright_light_total|360 dim_light_opacity|" + tokenData.get("dim_light_opacity")) +
                                lightButton("<i>Dancing Light<i>", 10, 0, 360, "!token-mod --set emits_bright_light|on emits_low_light|on bright_light_distance|0 low_light_distance|10 has_directional_bright_light|off directional_bright_light_total|360 dim_light_opacity|" + tokenData.get("dim_light_opacity")) +
                                lightButton("<i>Faerie Fire<i>", 10, 0, 360, "!token-mod --set emits_bright_light|on emits_low_light|on bright_light_distance|0 low_light_distance|10 has_directional_bright_light|off directional_bright_light_total|360 dim_light_opacity|" + tokenData.get("dim_light_opacity")) +
                                lightButton("<i>Flametongue<i>", 40, 40, 360, "!token-mod --set emits_bright_light|on emits_low_light|on bright_light_distance|40 low_light_distance|40 has_directional_bright_light|off directional_bright_light_total|360 dim_light_opacity|" + tokenData.get("dim_light_opacity")) +
                                //                                lightButton("<i>Gem of Brightness<i>", 30, 30, 360, "!token-mod --set emits_bright_light|on emits_low_light|on bright_light_distance|30 low_light_distance|30 has_limit_field_of_vision|off limit_field_of_vision_total|360 dim_light_opacity|" + tokenData.get("dim_light_opacity")) +
                                `</div>`;



                        } else {
                            tokenInfo = `<div style="text-align:center; font-style: italic;">No token is selected.</div>`;
                        }


                        //PAGE SECTON
                        pageInfo =
                            openSection +
                            openSubhead + 'Dynamic Lighting for Page</div>' +
                            openPageHead + '&quot;' + pageData.get("name") + '&quot;</div>' +
                            toggle("small", pageData.get("dynamic_lighting_enabled"), "dynamic_lighting_enabled") + '<span title = "Toggling this setting to off will toggle off all settings below, but they will return to their previous state when you turn Dynamic Lighting back on. NOTE: Due to a bug in the Roll20 system, toggling Dynamic Lighting on and off while using Ctrl/Cmd-L to check a token\'s line of site can cause Dynamic Lighting to seem unresponsive. The fix is to deselect all tokens and toggle Dynamic Lighting off and then back on. If this fails, just open the dynamic lighting settings for the page and do it manually."> <b>Dynamic Lighting</b></span>' +
                            '&nbsp;&nbsp;' + toggle("small", pageData.get("showdarkness"), "showdarkness") + '<span title = "This will toggle manual fog of war. Fog of War and Dynamic Lighting are mutially exlusive. To permanently hide or reveal areas where sight is manually restricted, use the Darkness Tool in the toolbar to the left."> Fog of War</span>' +

                            '<BR>' +
                            '<span title = "This is how dark unlit areas appear to the GM. Keeping this value very low will lead to less confusion. Many Night Vision using tokens in one area can make that area look brightly lit.">&nbsp;GM Dark Opacity: </span>' +
                            setValue(pageData.get("fog_opacity"), "fog_opacity", "!dltool-mod --fog_opacity|?&#123;Input value between 0 and 100?|35}") + "% <BR>" +

                            toggle("small", pageData.get("daylight_mode_enabled"), "daylight_mode_enabled") + ' <span title = "When Daylight Mode is on, tokens with Vision do not need specific light sources in able to see. You can adjust the amount of daylight to simulate fog, twilight, a moonlit night or a shadowiy interior. Higher values are brighter.">Day Mode</span> &nbsp;' +
                            setValue(pageData.get("daylightModeOpacity"), "daylightModeOpacity", "!dltool-mod --daylightModeOpacity|?&#123;Input value between 0 and 100?|100}") + "%<BR>" +

                            toggle("small", pageData.get("lightrestrictmove"), "lightrestrictmove") + ' <span title = "Due to a bug in the Roll20 Mod system, you must open and close page settings for this to take effect. NOTE: Since this setting also affects the legacy lighting system, it is on the first tab of the Page Settings panel.">Barriers Restrict Movement</span>' + manualWarning + '<BR>' +
                            toggle("small", pageData.get("lightupdatedrop"), "lightupdatedrop") + ' <span title = "When Update on Drop is turned on, a token\'s view does not change while it is being moved, but only when that move is completed. This can keep players from scouting a map surreptitiously. Turning this on can also help performance, as the system does not need to continuously update.">Update on Drop</span>' + '&nbsp;' +
                            toggle("small", pageData.get("explorer_mode"), "explorer_mode") + ' <span title = "Explorer Mode will keep previously seen areas visible in a darkened gray style. It will not display tokens that cannot currently be seen. Commonly called Fog of War in video games. Turning this off can improve performance if lag is noticed.">Explorer Mode</span>' + '<BR>' +
                            HR + `<b>${label("Daylight Presets:", "When Daylight Mode is on, tokens with Vision do not need specific light sources in able to see. These presets simulate regular daylight, a moonlit night, and a starlit night. Can also be used for buildings or dungeons with dim interiors.")} <b>` +
                            `<span style = "Full brightness over entire map. Simulates a normal day.">` + daylightButton("Day", 100, "!dltool --daylight_mode_enabled|true" +  "&#10;!dltool --daylightModeOpacity|100") + `</span>` +
                            `<span style = "Half brightness over entire map. Simulates a bright moonlit night.">` + daylightButton("Moon", 50, "!dltool --daylight_mode_enabled|true"  + "&#10;!dltool --daylightModeOpacity|50") + `</span>` +
                            `<span style = "20% brightness over entire map. Simulates a clear, moonless night.">` + daylightButton("Star", 20, "!dltool --daylight_mode_enabled|true"  + "&#10;!dltool --daylightModeOpacity|20") + `</span>` +
                            `</div>`;


                        //PAGEPLUS SECTON
                        let diagonalType = pageData.get("diagonaltype");
                        switch (pageData.get("diagonaltype")) {
                            case "foure":
                                diagonalType = "DnD 5e-4e";
                                break;
                            case "pythagorean":
                                diagonalType = "Euclidean";
                                break;
                            case "threefive":
                                diagonalType = "PF 1&2-Dnd3.5";
                                break;
                            case "manhattan":
                                diagonalType = "Manhattan";
                                break;
                            default:
                                diagonalType = pageData.get("diagonaltype");
                        }



                        pagePlusInfo =
                            openSection +
                            openSubhead + 'Additional Page Settings</div>' +



                            toggle("small", pageData.get("showgrid"), "showgrid") + '<span title = "This control toggles the grid on and off. While the grid is on, tokens will snap to the intersections."> <b>Show Grid</b></span>' + '<BR>' +
                            '<span title = "this is a scale of how opaque the grid is. 0 = Transparent. 1 = Opaque.">Grid Opacity: </span>' +
                            setValue(pageData.get("grid_opacity"), "grid_opacity", "!dltool-mod --grid_opacity|?&#123;Input value between 0 and 1?|1}") +
                            '<span title = "The color of the grid lines, in hexadecimal format">&nbsp;Color:' + setValue(pageData.get("gridcolor"), "gridcolor", `!dltool-mod --gridcolor|?{Input value in Hex format|}`) + '</span> ' +
                            colorButton("page", "gridcolor", pageData.get('gridcolor')) + '<BR>' +

                            '<span title = "Choose between various grid types">Grid Type: </span>' +
                            setValue(pageData.get("grid_type"), "grid_type", "!dltool-mod --grid_type|?&#123;Choose grid type|Square,square|Hex(V),hex|Hex(H),hexr|Dimetric,dimetric|Isometric,isometric}") +
                            (((pageData.get("grid_type") === "hex" || pageData.get("grid_type") === "hexr")) ? "&nbsp;" + toggle("small", pageData.get("gridlabels"), "gridlabels") + '<span title = "Display numbers the hex grid">&nbsp;Show Labels</span>' : "") +
                            (((pageData.get("grid_type") === "square")) ? "&nbsp;<span title = 'Choose how diagonal movment is measured'>&nbsp;Diag.:&nbsp;</span>" + setValue(diagonalType, "diagonaltype", "!dltool-mod --diagonaltype|?&#123;Choose diagonal measurement method type|Dnd5e-4e,foure |Pathfinder-DnD3.5,threefive|Euclidean,pythagorean|Manhattan,manhattan}") : "") +
                            '<BR>' +

                            '<span title = "Set scale and unit. Typical for 5e or PF2 battlemat is \'5\' and \'ft\'.">Page scale: </span>' +
                            setValue(pageData.get("scale_number"), "scale_number", "!dltool-mod --scale_number|?&#123;Input numerical measurement for one grid unit|5}") + '&nbsp;' +
                            setValue(pageData.get("scale_units"), "scale_units", "!dltool-mod --scale_units|?&#123;Input type of unit, example: ft. for feet|ft.}") + '&nbsp;' +
                            dlButton("Get from map", "!dltool --report|setscale") + '<BR>' +

                            HR +
                            '<span title = "The color of the background, in hexadecimal format">Background Color: ' + setValue(pageData.get("background_color"), "background_color", `!dltool-mod --background_color|?{Input value in Hex format|}`) + '</span> ' +
                            colorButton("page", "background_color", pageData.get("background_color")) + '<BR>' +

                            '<span title = "You can re-name the page here. This function is not santized for problemtic characters, so it\'s best to keep it to simple alphanumeric characters. If you need accents or parentheses, use the regular Roll20 interface.">Change Name: </span>' +
                            setValue(pageData.get("name"), "name", "!dltool-mod --name|&quot;?&#123;Input new name for page|" + pageData.get("name") + "}&quot;") + '<BR>' +


                            HR + `<b>${label("Cell Width Divisions:", "How many times is one cell divided. This is the same as setting the Cell Width in the Page Settings, but is perhaps more intuitive. 2 divisions is the same as setting the cell width to 0.5. 8 divisions corresonds to 0.125.")} <b><BR>` +
                            `<span title = "Cell Width = 1">` + cellWidthButton("1", "1", "!dltool --snapping_increment|1") + `</span>` +
                            `<span title = "Cell Width = 0.5">` + cellWidthButton("2", "0.5", "!dltool --snapping_increment|0.5") + `</span>` +
                            `<span title = "Cell Width = 0.33333">` + cellWidthButton("3", "0.33333", "!dltool --snapping_increment|0.33333") + `</span>` +
                            `<span title = "Cell Width = 0.25">` + cellWidthButton("4", "0.25", "!dltool --snapping_increment|0.25") + `</span>` +
                            `<span title = "Cell Width = 0.2">` + cellWidthButton("5", "0.2", "!dltool --snapping_increment|0.2") + `</span>` +
                            `<span title = "Cell Width = 0.16666">` + cellWidthButton("6", "0.16666", "!dltool --snapping_increment|0.16666") + `</span>` +
                            `<span title = "Cell Width = 0.142857">` + cellWidthButton("7", "0.142857", "!dltool --snapping_increment|0.142857") + `</span>` +
                            `<span title = "Cell Width = 0.125">` + cellWidthButton("8", "0.125", "!dltool --snapping_increment|0.125") + `</span>` +
                            '<BR><span title = "Size of a grid space. Must be non-zero. Default is 1 (no divisions).">Cell Width: </span>' +
                            setValue(pageData.get("snapping_increment"), "snapping_increment", "!dltool-mod --snapping_increment|?&#123;Input positive number?|1}") +
                            (isProd ?
                            HR + 
                            openRolll20Subhead + `Roll 20 CNV</div>`+ 
                            dlButton("Toggle Buddy", "!prod map buddy") + dlButton(`&nbsp;<span style="font-family:Pictos;">(</span>&nbsp;`, "!token-mod --on lockMovement") + dlButton(" "+`&nbsp;<span style="font-family:Pictos;">)</span>&nbsp;`+" ", "!token-mod --off lockMovement") + '<br>' + dlButton("Split Path", "!pathSplit") + dlButton("Join Path", "!pathJoin") + dlButton("Close Path", "!pathClose") + '<br>' +
                            `<b>${label("Grid Presets:", "Grid Presets.")} <b><BR>` + 
                            gridButton("standard","1", "#COCOCO", "0.5", "!dltool-mod --snapping_increment|1" +  "&#10;!dltool-mod --gridcolor|C0C0C0" + "&#10;!dltool-mod --grid_opacity|0.5") + gridButton("weak","1", "#000000", "0.1", "!dltool-mod --snapping_increment|1" +  "&#10;!dltool-mod --gridcolor|000000" + "&#10;!dltool-mod --grid_opacity|0.1") + gridButton("medium","1", "#000000", "0.1", "!dltool-mod --snapping_increment|1" +  "&#10;!dltool-mod --gridcolor|000000" + "&#10;!dltool-mod --grid_opacity|0.3") + gridButton("Strong","1", "#000000", "0.5", "!dltool-mod --snapping_increment|1" +  "&#10;!dltool-mod --gridcolor|000000" +  "&#10;!dltool-mod --grid_opacity|0.5") + `<BR>` + gridButton("Invisible","1", "#000000", "0", "!dltool-mod --snapping_increment|1" +  "&#10;!dltool-mod --gridcolor|000000" +  "&#10;!dltool-mod --grid_opacity|0") + gridButton("Template","0.125", "000000", "0.25", "!dltool --snapping_increment|0.125" +  "&#10;!dltool --gridcolor|FF00FF" +  "&#10;!dltool --grid_opacity|0.25")
                            : "")+
                            `</div>`;


                        //Set Map from scale
                        scaleInfo =
                            openSection +
                            openSubhead + 'Set Scale from Printed Measurement</div>' +
                            'Often a map will have a printed scale that does not correspond to a grid setting. This is typically true of city and overland maps. To set the page scale to correspond to the printed scale, first use the Measurement Tool to measure the printed scale. You may need to hold down the alt/opt key to avoid snapping and get a precise measurement. Remember this number, then press the button below and enter that number into the dialog box.  <BR>' +
                            dlButton("set scale", "!dltool-mod --scale_number|&#91;&#91;(round((" + pageData.get("scale_number") + "/?{Input value measured from printed scale})&#42;?{Input value as displayed on printed scale}&#42;100))/100&#93;&#93;") + "&nbsp;" + setValue(pageData.get("scale_units"), "scale_units", "!dltool-mod --scale_units|?&#123;Input type of unit, example: mi for miles|mi}") + '&nbsp;' +
                            `</div>`;



                        //Determines which report to send
                        if (undefined === theOption) {
                            lines = openHeader + 'Dynamic Lighting Tool' + `</div>` +
                                tokenInfo + lightInfo + pageInfo + utilityInfo +
                                '</div>';
                        } else {

                            switch (theOption) {
                                case "vision":
                                    lines = openHeader + 'Dynamic Lighting Tool' + `</div>` +
                                        tokenInfo + utilityInfo +
                                        '</div>';
                                    break;
                                case "light":
                                    lines = openHeader + 'Dynamic Lighting Tool' + `</div>` +
                                        lightInfo + utilityInfo +
                                        '</div>';
                                    break;
                                case "page":
                                    lines = openHeader + 'Dynamic Lighting Tool' + `</div>` +
                                        pageInfo + utilityInfo +
                                        '</div>';
                                    break;
                                case "extra":
                                    lines = openHeader + 'Dynamic Lighting Tool' + `</div>` +
                                        pageInfo + pagePlusInfo + utilityInfo +
                                        '</div>';
                                    break;
                                case "setscale":
                                    lines = openHeader + 'Dynamic Lighting Tool' + `</div>` +
                                        scaleInfo + utilityInfo +
                                        '</div>';
                                    break;
                                default:
                                    lines = openHeader + 'Dynamic Lighting Tool' + `</div>` +
                                        checklistTokenInfo + utilityInfo +
                                        '</div>';
                            }
                        }


                        let toWhom = '/w gm ';

                        if (!playerIsGM(msg.playerid)) {

                            lines = openHeader + 'Dynamic Lighting Tool' + `</div>` +
                                checklistTokenInfo +
                                '</div>';
                            toWhom = '/w ' + getObj("player", msg.playerid).get("_displayname") + ' ';

                        }

                        sendChat('DL Tool', toWhom + openReport + lines + closeReport, null, {
                            noarchive: true
                        });
                      }
                        break;


                        //GENERIC MESSSAGE
                    case 'message':
                        if (undefined !== theMessage) {
                            theMessage = '<span style ="margin: 2px 10px 2px 10px; color:#111">' + theMessage + '</span>';
                            sendChat('DLTool', '/w gm ' + openSection + theMessage + closeReport, null, {
                                noarchive: true
                            });

                        }
                        break;


                    case 'default':

                        theMessage = `${openHeader}Dynamic Lighting Tool</div>${openSection}${openSubhead}Saving a Default Token</div>${spacer}Users can become frustrated when they set up a token perfectly, but the next time they pull it from the Journal Tab, none of the settings seem to have saved.<br>Setting a default token is like taking a snapshot of a token exactly as it is, and saving it to the character journal. Any changes you make to a token on the VTT will not affect the default token at all.<br><span style ="font-size:16px; font-weight:bold">Therefore, setting the journal's default token must always be done as the <i>last</i> step.</span></div>` +
                            `${openSection}${openSubhead}Three Ways to Set a Default Token</div>${spacer}<b>1) From the Token Settings</b><br>Open the token's Token Settings panel. Click the "Update Default Token" button.<br>${HR}<b>2) From the Journal</b><br>Open the journal for the character the token represents. Click the "Edit" button in the upper right corner. On the edit screen, there are three buttons.<br><b>${pictos('L')} Edit Token Properties: </b>Calls up the Token Settings panel for making other changes you wish to become new defaults.</b><br><b>${pictos('L')} Use Selected Token: </b>Sets the selected token as the new default token for that journal.<br><b>${pictos('L')} Apply Token Defaults: </b>Overwrites all tokens in play that represent this character to the new defaults. <i>Caution:</i> if you have edited tokens on the board (say, by numbering them), this can overwrite those changes.${HR}<b>3) </b>${dlButton("Save Token as Default", "!token-mod  --set defaulttoken")}</div>`;

                        //theMessage = '' + theMessage + '</span>';
                        sendChat('DLTool', '/w gm ' + openReport + theMessage + utilityInfo + closeReport, null, {
                            noarchive: true
                        });


                        break;




                        //CHECKLIST REPORT


                    case 'checklist': {
                        let VS = `<div style="height:8px">&nbsp;</div>`; //Vertical spacer
                        theMessage = `<BR>Check that token is not blocked off by DL lines from seeing the immediate surroundings.${VS}If testing with the player present, make sure the player is looking at their token's immediate area. Shift-Click and hold on the token to pull the player's view to that area. Check the permission settings manually or with with the report to ensure they have control over the token.${VS}Check that the player has not been <i>Split from the Party</i> (Check the Help Center if this is unfamiliar)${VS}If Fog of War or Explorable Darkness (Dynamic Lighting feature that lets the token retain a memory of map areas it has seen) is being used, check that the area the token is in has been cleared. Both of these can be cleared using the darkness tool on the control palette to the left.${VS}Try toggling a light source preset on and off. Sometimes unset default values can cause a DL glitch.${VS}Can you see a rotating cube in <a style = "color:##7e2d40; background-color:transparent; padding:0px;" href="https&#58;//get.webgl.org">this URL</a>? If not, the browser needs to be WebGL compatible (99%+ are).<br><br>${HR}<b>Golden Rule: If things don't seem to be working or responding properly,<br>1) Open and close the token settings manually, and/or 2) Reload the game.</b> `;

                        theMessage = `${openSubhead}Other things to check for</div><span style ="margin: 2px 10px 2px 10px; color:#111">` + theMessage + '</span>';

                        if (msg.selected) {
                            tokenData = getObj('graphic', msg.selected[0]._id);
                        }



                        sendChat('DLTool', '/w gm ' + openReport + openHeader + 'Dynamic Lighting Tool</div>' + openSection + theMessage + closeReport + utilityInfo + closeReport, null, {
                            noarchive: true
                        });
                    }
                        break;


                    case 'fog_opacity':
                        if (theOption >= 1 && theOption <= 100) {
                            theOption = theOption / 100;
                        } else {
                            if (theOption === "0") {
                                theOption = 0;
                            } else {
                                theOption = 1.0;
                            }
                        }
                        break;

                    case 'daylightModeOpacity':
                        if (theOption >= 1 && theOption <= 100) {
                            theOption = theOption / 100;
                        } else {
                            if (theOption === "0") {
                                theOption = 0;
                            } else {
                                theOption = 1.0;
                            }
                        }
                        pageData.set('force_lighting_refresh', true);

                        break;

                    case 'showdarkness':
                        if (theOption === "false" || theOption === "true") {
                            stringToBoolean(theOption);
                        } else {
                            sendChat('DLTool', '/w gm ' + openReport + theOption + ' is not a valid value for ' + theCommand + ' It has been set to false.' + closeReport, null, {
                                noarchive: true
                            });
                            theOption = false;
                        }
                        if (pageData.get("dynamic_lighting_enabled") && theOption === "true") {
                            pageData.set('dynamic_lighting_enabled', false);
                        }
                        break;

                    case 'dynamic_lighting_enabled':
                        if (theOption === "false" || theOption === "true") {
                            stringToBoolean(theOption);
                        } else {
                            sendChat('DLTool', '/w gm ' + openReport + theOption + ' is not a valid value for ' + theCommand + ' It has been set to false.' + closeReport, null, {
                                noarchive: true
                            });
                            theOption = false;
                        }
                        if (pageData.get("showdarkness") && theOption === "true") {
                            pageData.set('showdarkness', false);
                        }


                        pageData.set('force_lighting_refresh', true);
                        break;

                    case 'daylight_mode_enabled':
                        if (theOption === "false" || theOption === "true") {
                            theOption = ((theOption === 'true') ? true : false);
                        } else {
                            theOption = false;
                            sendChat('DLTool', '/w gm ' + openReport + theOption + ' is not a valid value for ' + theCommand + ' It has been set to false.' + closeReport, null, {
                                noarchive: true
                            });
                            pageData.set('force_lighting_refresh', true);
                        }
                        break;

                    case 'lightrestrictmove':
                        if (theOption === "false" || theOption === "true") {
                            theOption = ((theOption === 'true') ? true : false);
                        } else {
                            theOption = false;
                            sendChat('DLTool', '/w gm ' + openReport + theOption + ' is not a valid value for ' + theCommand + ' It has been set to false.' + closeReport, null, {
                                noarchive: true
                            });
                        }
                        pageData.set('force_lighting_refresh', true);

                        break;

                    case 'lightupdatedrop':
                        if (theOption === "false" || theOption === "true") {
                            theOption = ((theOption === 'true') ? true : false);
                        } else {
                            theOption = false;
                            sendChat('DLTool', '/w gm ' + openReport + theOption + ' is not a valid value for ' + theCommand + ' It has been set to false.' + closeReport, null, {
                                noarchive: true
                            });
                        }
                        break;

                    case 'explorer_mode':
                        if (theOption === "off" || theOption === "basic") {
                            theOption = (theOption === 'basic') ? 'basic' : 'off';
                        } else {
                            theOption = 'off';
                            sendChat('DLTool', '/w gm ' + openReport + theOption + ' is not a valid value for ' + theCommand + ' It has been set to false.' + closeReport, null, {
                                noarchive: true
                            });
                        }
                        break;

                    case 'colorpicker': {

                        let dataSet = theOption.split("%%")[0];
                        let theProperty = theOption.split("%%")[1];
                        let opacityButton = "";
                        let colorList = ["#000000", "#434343", "#666666", "#C0C0C0", "#D9D9D9", "#FFFFFF", "#980000", "#FF0000", "#FF9900", "#FFFF00", "#00FF00", "#00FFFF", "#4A86E8", "#0000FF", "#9900FF", "#FF00FF", "#E6B8AF", "#F4CCCC", "#FCE5CD", "#FFF2CC", "#D9EAD3", "#D0E0E3", "#C9DAF8", "#CFE2F3", "#D9D2E9", "#EAD1DC", "#DD7E6B", "#EA9999", "#F9CB9C", "#FFE599", "#B6D7A8", "#A2C4C9", "#A4C2F4", "#9FC5E8", "#B4A7D6", "#D5A6BD", "#CC4125", "#E06666", "#F6B26B", "#FFD966", "#93C47D", "#76A5AF", "#6D9EEB", "#6FA8DC", "#8E7CC3", "#C27BA0", "#A61C00", "#CC0000", "#E69138", "#F1C232", "#6AA84F", "#45818E", "#3C78D8", "#3D85C6", "#674EA7", "#A64D79", "#5B0F00", "#660000", "#783F04", "#7F6000", "#274E13", "#0C343D", "#1C4587", "#073763", "#20124D", "#20124E"];
                        let colorTable = openHeader + "Pick a color for this property:</div>" +
                            openPageHead + theProperty + `</div>`;

                        colorList.forEach(c => {

                            colorTable = colorTable +
                                ((dataSet === "page") ? `<a href ="!dltool-mod --${theProperty}|${c}"` : `<a href ="!token-mod --set ${theProperty}|${c}"`) + ` style = "display:inline-block; height:18px; padding:0px; width:18px; margin:0px 1px; border-radius:5px; background-color:#${c}; border:1px solid #111;"> </a>`;
                        });

                        colorTable = colorTable + `<BR>`;

                        let TransparencyButton = `<a style = "display:inline-block; height:18px;padding:0px;  margin:0px 1px; border-radius:5px; color:#eee; background-color:#111; border:1px solid #111;"` + ((dataSet === "page") ? ` href ="!dltool-mod --${theProperty}|transparent">` : ` href ="!token-mod --set ${theProperty}|transparent">`) + `&nbsp;Transparent&nbsp;</a>`;

                        switch (theProperty) {

                            case 'gridcolor':
                                opacityButton = '<span title = "this is a scale of how opaque the grid is. 0 = Transparent. 1 = Opaque.">&nbsp;Grid Opacity: </span>' +
                                    setValue(pageData.get("grid_opacity"), "grid_opacity", "!dltool-mod --grid_opacity|?&#123;Input value between 0 and 1?|1}");

                                break;

                            case 'night_vision_tint':
                                opacityButton = "";
                                //TransparencyButton = `<a style = "display:inline-block; height:18px;padding:0px;  margin:0px 1px; border-radius:5px; color:#eee; background-color:#111; border:1px solid #111;"` + ((dataSet === "page") ? ` href ="!dltool-mod --${theProperty}\|none">` : ` href ="!token-mod --set ${theProperty}\|none">`) + `&nbsp;None&nbsp;</a>`

                                break;

                            case 'lightColor':
                                opacityButton = '';
                                // opacityButton = '<span title="Use this sparingly, as light colors can interact in unpredicatble ways. Tinting vision is not recommended, since the interaction is problematic.">Color:' + setValue(tokenData.get("lightColor"), "lightColor", "!token-mod --set lightColor|?{Use sparingly. Input in hex, rgb or hsv format.|transparent}") + "</span> " +
                                //`<div style ="display:inline-block; width: 18px; height:14px; position:relative; top:1px; border: 1px solid #111; border-radius:3px; margin-top:1px; margin-left: -2px; background-color:${tokenData.get('lightColor')}">&nbsp;</div>`;
                                break;


                            default:
                                // Nothing here. :)
                        }



                        opacityButton = opacityButton.replace(" &#10;!dltool --report", " &#10;" + msg.content);

                        colorTable = colorTable + TransparencyButton;
                        //TransparencyButton = `<a style = "display:inline-block; height:18px;padding:0px;  margin:0px 1px; border-radius:5px; color:#eee; background-color:#111; border:1px solid #111;"` + ((dataSet === "page") ? ` href ="!dltool-mod --${theProperty}\|transparent">` : ` href ="!token-mod --set ${theProperty}\|transparent">`) + `&nbsp;Transparent&nbsp;</a>`


                        colorTable = colorTable + opacityButton;

                        sendChat('DLTool', '/w gm ' + openReport + colorTable + utilityInfo + closeReport, null, {
                            noarchive: true
                        });

                        //pageData.set('force_lighting_refresh', true);
                    }
                        break;

                    default:
                        // Nothing here. :)
                }




                if (theOption === "false") {
                    pageData.set(theCommand, false);
                    pageData.set('force_lighting_refresh', true);

                } else {
                    if (theCommand.includes("name")) {
                        theOption = theOption.toString().replace(/"/g, "");
                    }
                    pageData.set(theCommand, theOption);
                    pageData.set('force_lighting_refresh', true);
                }
            });
        }
    });
});

{
    try {
        throw new Error('');
    } catch (e) {
        API_Meta.dltool.lineCount = (parseInt(e.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/, '$1'), 10) - API_Meta.dltool.offset);
    }
};



//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//       PATH SPLITTER
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
/**
 * This script provides a way for players and GMs to split paths by their
 * intersections with another splitting path.
 * This could especially be useful for when corrections need to be made to
 * paths used for dynamic lighting.
 *
 * Simply draw a polygonal path intersecting the path you want to split up.
 * Select the main path and then the splitting path.
 * Then with the main and splitting paths selected,
 * enter the command '!pathSplit'.
 * The original path will be divided into new paths separated at the points
 * where the splitting path intersected the original path.
 *
 * This script also works with paths that have been scaled and rotated.'
 *
 * Requires:
 *   VectorMath
 *   MatrixMath
 *   PathMath
 */

var API_Meta = API_Meta||{}; //eslint-disable-line no-var
API_Meta.PathSplitter={offset:Number.MAX_SAFE_INTEGER,lineCount:-1};
{try{throw new Error('');}catch(e){API_Meta.PathSplitter.offset=(parseInt(e.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/,'$1'),10)-3);}}
API_Meta.PathSplitter.version = '1.1.2';
/* globals PathMath */
/**
 * This script provides a way for players and GMs to split paths by their
 * intersections with another splitting path.
 * This could especially be useful for when corrections need to be made to
 * paths used for dynamic lighting.
 *
 * Simply draw a polygonal path intersecting the path you want to split up.
 * Select the main path and then the splitting path.
 * Then with the main and splitting paths selected,
 * enter the command '!pathSplit'.
 * The original path will be divided into new paths separated at the points
 * where the splitting path intersected the original path.
 *
 * This script also works with paths that have been scaled and rotated.'
 *
 * Requires:
 *   VectorMath
 *   MatrixMath
 *   PathMath
 */

(() => {

  const DEFAULT_SPLIT_COLOR = '#000000';
  const MAKE_MACROS = false;

  const PATHSPLIT_CMD = '!pathSplit';
  const PATHJOIN_CMD = '!pathJoin';
  const PATHCLOSE_CMD = '!pathClose';
  const PATHSPLIT_COLOR_CMD = '!pathSplitColor';
  const EPSILON = 0.001;

  /**
   * A 3-tuple representing a point of intersection between two line segments.
   * The first element is a Vector representing the point of intersection in
   * 2D homogenous coordinates.
   * The second element is the parametric coefficient for the intersection
   * along the first segment.
   * The third element is the parametric coefficient for the intersection
   * along the second segment.
   * @typedef {Array} Intersection
   */

   /**
   * A vector used to define a homogeneous point or a direction.
   * @typedef {number[]} Vector
   */

  /**
   * A line segment defined by two homogenous 2D points.
   * @typedef {Vector[]} Segment
   */

  let isJumpgate = ()=>{
    if(['jumpgate'].includes(Campaign().get('_release'))) {
      isJumpgate = () => true;
    } else {
      isJumpgate = () => false;
    }
    return isJumpgate();
  };


  // Initialize the script's state if it hasn't already been initialized.
  state.PathSplitter = state.PathSplitter || {
    splitPathColor: DEFAULT_SPLIT_COLOR // pink
  };


  function _getSplitSegmentPaths(mainSegments, splitSegments) {
    let resultSegPaths = [];
    let curPathSegs = [];

    mainSegments.forEach( seg1 => {

      // Find the points of intersection and their parametric coefficients.
      let intersections = [];
      splitSegments.forEach(seg2 => {
        let i = PathMath.segmentIntersection(seg1, seg2);
        if(i)
          intersections.push(i);
      });

      if(intersections.length > 0) {
        // Sort the intersections in the order that they appear along seg1.
        intersections.sort((a, b) => {
          return a[1] - b[1];
        });

        let lastPt = seg1[0];
        intersections.forEach( i => {
          // Complete the current segment path.
          curPathSegs.push([lastPt, i[0]]);
          resultSegPaths.push(curPathSegs);

          // Start a new segment path.
          curPathSegs = [];
          lastPt = i[0];
        });
        curPathSegs.push([lastPt, seg1[1]]);
      }
      else {
        curPathSegs.push(seg1);
      }
    });
    resultSegPaths.push(curPathSegs);

    return resultSegPaths;
  }

  const ptDist = (p1,p2) => Math.sqrt(Math.pow(p2[0]-p1[0],2)+Math.pow(p2[1]-p1[1],2));

  const reverseSegs = (segs) => [...segs.map(seg=>seg.reverse())].reverse();

  function closePath(path1){
    let segments = PathMath.toSegments(path1);
    let len = segments.length;

    let _pageid = path1.get('_pageid');
    let controlledby = path1.get('controlledby');
    let fill = path1.get('fill');
    let layer = path1.get('layer');
    let stroke = path1.get('stroke');
    let stroke_width = path1.get('stroke_width');
    let pathExtra = {
        _pageid,
        controlledby,
        fill,
        layer,
        stroke,
        stroke_width
    };

    if(isJumpgate()){
      switch(path1.get('shape')){
        case 'free':
          pathExtra.shape='free'; // force back to freehand
          break;
        case 'pol':
        case 'eli':
        case 'rec':
          break;
      }
    }

    let p1 = [...segments[len-1][1]];
    let p2 = [...segments[0][0]];
    let mp = [(p1[0]+p2[0])/2, (p1[1]+p2[1])/2,1];

    // add closing segment
    segments.unshift(
      [mp,p2]
    );
    segments.push(
      [p1,mp]
    );

    let pathData = {
      ...PathMath.segmentsToPath(segments),
      ...pathExtra
    };
    let path = createObj(isJumpgate() ? 'pathv2' : 'path', pathData);
    if(path){
      path1.remove();
    }
  }

  function joinPaths(path1,path2){
    let p1Segments = PathMath.toSegments(path1);
    let p2Segments = PathMath.toSegments(path2);
    let p1Len = p1Segments.length;
    let p2Len = p2Segments.length;

    let _pageid = path1.get('_pageid');
    let controlledby = path1.get('controlledby');
    let fill = path1.get('fill');
    let layer = path1.get('layer');
    let stroke = path1.get('stroke');
    let stroke_width = path1.get('stroke_width');
    let pathExtra = {
        _pageid,
        controlledby,
        fill,
        layer,
        stroke,
        stroke_width
    };

//    $d({p1Segments,p1Len,p2Segments,p2Len});

    let strategy = [
      { st: 'ss', dist: ptDist(p1Segments[0][0],p2Segments[0][0]) },
      { st: 'se', dist: ptDist(p1Segments[0][0],p2Segments[p2Len-1][1]) },
      { st: 'es', dist: ptDist(p1Segments[p1Len-1][1],p2Segments[0][0]) },
      { st: 'ee', dist: ptDist(p1Segments[p1Len-1][1],p2Segments[p2Len-1][1]) }
    ].sort((a,b)=>a.dist-b.dist)[0];

    switch(strategy.st){
      case 'es':
        break;
      case 'ss':
        p1Segments = reverseSegs(p1Segments);
        break;
      case 'se':
        p1Segments = reverseSegs(p1Segments);
        p2Segments = reverseSegs(p2Segments);
        break;
      case 'ee':
        p2Segments = reverseSegs(p2Segments);
        break;
    }

    let segments;

    if(strategy.dist>0){
      segments = [
        ...p1Segments,
        [p1Segments[p1Len-1][1],p2Segments[0][0]],
        ...p2Segments
      ];
    } else {
      segments = [
        ...p1Segments,
        ...p2Segments
      ];
    }

    if(isJumpgate()){
      switch(path1.get('shape')){
        case 'free':
          pathExtra.shape='free'; // force back to freehand
          break;
        case 'pol':
        case 'eli':
        case 'rec':
          break;
      }
    }

    let pathData = {
      ...PathMath.segmentsToPath(segments),
      ...pathExtra
    };
    let path = createObj(isJumpgate() ? 'pathv2' : 'path', pathData);
    if(path){
      path1.remove();
      path2.remove();
    }
  }

  /**
   * Splits mainPath at its intersections with splitPath. The original path
   * is removed, being replaced by the new split up paths.
   * @param {Path} mainPath
   * @param {Path} splitPath
   * @return {Path[]}
   */
  function splitPathAtIntersections(mainPath, splitPath) {
    let mainSegments = PathMath.toSegments(mainPath);
    let splitSegments = PathMath.toSegments(splitPath);
    let segmentPaths = _getSplitSegmentPaths(mainSegments, splitSegments);

    // Convert the list of segment paths into paths.
    let _pageid = mainPath.get('_pageid');
    let controlledby = mainPath.get('controlledby');
    let fill = mainPath.get('fill');
    let layer = mainPath.get('layer');
    let stroke = mainPath.get('stroke');
    let stroke_width = mainPath.get('stroke_width');
    let pathExtra = {
        _pageid,
        controlledby,
        fill,
        layer,
        stroke,
        stroke_width
    };

    const ptSame = (p1,p2)=> p1[0]===p2[0] && p1[1]===p2[1] && p1[2]===p2[2] ;

    // remove zero length lines
    segmentPaths = segmentPaths
      .map(segs=> segs.filter(s => !ptSame(s[0],s[1])))
      .filter(segs => segs.length);

    if(isJumpgate()){
      switch(mainPath.get('shape')){
        case 'free':
          pathExtra.shape='free'; // force back to freehand
          break;
        case 'pol':
          break;

        case 'eli':
        case 'rec':
            // fix up endpoints 
          if(segmentPaths.length > 1){
            let distCheck = PathMath.distanceToPoint(segmentPaths[0][0][0],splitPath);
            if(distCheck > EPSILON) {
              segmentPaths[0] = [
                ...segmentPaths[segmentPaths.length-1],
                ...segmentPaths[0]
              ];
              delete segmentPaths[segmentPaths.length-1];
              segmentPaths = segmentPaths.filter(p=>null !== p && undefined !== p);
            }
          }
          break;

        default:
          // pathv1 path, do nothing
      }
    }

    let results = [];
    segmentPaths.forEach(segments => {
      let pathData = {
        ...PathMath.segmentsToPath(segments),
        ...pathExtra
      };
      let path = createObj(isJumpgate() ? 'pathv2' : 'path', pathData);
      results.push(path);
    });

    // Remove the original path and the splitPath.
    mainPath.remove();
    splitPath.remove();

    return results;
  }

  on('ready', () => {
    if(MAKE_MACROS){
      let macro = findObjs({
        _type: 'macro',
        name: 'Pathsplitter'
      })[0];

      if(!macro) {
        findObjs({
          _type: 'player'
        })
        .filter( player => playerIsGM(player.id))
        .forEach( gm => {
          createObj('macro', {
            _playerid: gm.get('_id'),
            name: 'Pathsplitter',
            action: PATHSPLIT_CMD
          });
        });
      }

      let macro2 = findObjs({
        _type: 'macro',
        name: 'Pathjoiner'
      })[0];

      if(!macro2) {
        findObjs({
          _type: 'player'
        })
        .filter( player => playerIsGM(player.id))
        .forEach( gm => {
          createObj('macro', {
            _playerid: gm.get('_id'),
            name: 'Pathjoiner',
            action: PATHJOIN_CMD
          });
        });
      }

      let macro3 = findObjs({
        _type: 'macro',
        name: 'Pathcloser'
      })[0];

      if(!macro3) {
        findObjs({
          _type: 'player'
        })
        .filter( player => playerIsGM(player.id))
        .forEach( gm => {
          createObj('macro', {
            _playerid: gm.get('_id'),
            name: 'Pathcloser',
            action: PATHCLOSE_CMD
          });
        });
      }
    }
  });

  on('chat:message', msg => {
    if(msg.type === 'api' && msg.content === PATHSPLIT_COLOR_CMD) {
      try {
        let selected = msg.selected;
        let path = findObjs({
          _type: 'path',
          _id: selected[0]._id
        })[0];

        let stroke = path.get('stroke');
        state.PathSplitter.splitPathColor = stroke;
      }
      catch(err) {
        log('!pathSplit ERROR: ' + err.message);
        log(err.stack);
      }
    }
    else if(msg.type === 'api' && msg.content === PATHSPLIT_CMD) {
      try {
        let selected = msg.selected;
        if(!selected || selected.length !== 2 || ! /^path/.test(selected[0]._type) ||  ! /^path/.test(selected[1]._type) ) {
          let num = selected?.length || 0;
          let types = (selected?.map(o=>o._type)||[]).join(", ");

          let msg = `Two paths must be selected: the one you want to split, and the splitting path (color: <span style="background: ${state.PathSplitter.splitPathColor}; width: 16px; height: 16px; padding: 0.2em; font-weight: bold;">${state.PathSplitter.splitPathColor}</span>).  Selected: (${num}): ${types}`;
          sendChat('Pathsplitter', msg);
          throw new Error(msg);
        }

        let path1 = getObj(selected[0]._type,selected[0]._id);
        let path2 = getObj(selected[1]._type,selected[1]._id);

        // Determine which path is the main path and which is the
        // splitting path.
        let mainPath, splitPath;
        if(path1.get('stroke') === state.PathSplitter.splitPathColor) {
          mainPath = path2;
          splitPath = path1;
        }
        else if(path2.get('stroke') === state.PathSplitter.splitPathColor) {
          mainPath = path1;
          splitPath = path2;
        }
        else {
          let msg = 'No splitting path selected. ';
          msg += `Current split color: <span style="background: ${state.PathSplitter.splitPathColor}; width: 16px; height: 16px; padding: 0.2em; font-weight: bold;">${state.PathSplitter.splitPathColor}</span>`;
          sendChat('Pathsplitter', msg);

          throw new Error('No splitting path selected.');
        }
        splitPathAtIntersections(mainPath, splitPath);
      }
      catch(err) {
        log('!pathSplit ERROR: ' + err.message);
        log(err.stack);
      }
    }
    else if(msg.type === 'api' && msg.content === PATHJOIN_CMD) {
      try {
        let selected = msg.selected;
        if(!selected || selected.length !== 2 || ! /^path/.test(selected[0]._type) ||  ! /^path/.test(selected[1]._type) ) {
          let num = selected?.length || 0;
          let types = (selected?.map(o=>o._type)||[]).join(", ");

          let msg = `Two paths must be selected for joining.  Selected: (${num}): ${types}`;
          sendChat('Pathsplitter', msg);
          throw new Error(msg);
        }

        let path1 = getObj(selected[0]._type,selected[0]._id);
        let path2 = getObj(selected[1]._type,selected[1]._id);

        joinPaths(path1,path2);
      }
      catch(err) {
        log('!pathSplit ERROR: ' + err.message);
        log(err.stack);
      }
    } else if(msg.type === 'api' && msg.content === PATHCLOSE_CMD) {
      try {
        let selected = msg.selected;
        if(!selected || selected.length !== 1 || ! /^path/.test(selected[0]._type) ) {
          let num = selected?.length || 0;
          let types = (selected?.map(o=>o._type)||[]).join(", ");

          let msg = `One path must be selected for closing.  Selected: (${num}): ${types}`;
          sendChat('Pathsplitter', msg);
          throw new Error(msg);
        }

        let path1 = getObj(selected[0]._type,selected[0]._id);

        closePath(path1);
      }
      catch(err) {
        log('!pathSplit ERROR: ' + err.message);
        log(err.stack);
      }
    }
  });
})();
{try{throw new Error('');}catch(e){API_Meta.PathSplitter.lineCount=(parseInt(e.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/,'$1'),10)-API_Meta.PathSplitter.offset);}}




//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//       LIBRARIES
//@@@@@@@@@@@@@@@@@@@@@@@@@@@

//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//       MATRIXMATH
//@@@@@@@@@@@@@@@@@@@@@@@@@@@

/**
 * This script provides a library for performing affine matrix operations
 * inspired by the [glMatrix library](http://glmatrix.net/) developed by
 * Toji and SinisterChipmunk.
 *
 * Unlike glMatrix, this library does not have operations for vectors.
 * However, my VectorMath script provides a library providing many kinds of
 * common vector operations.
 *
 * This project has no behavior on its own, but its functions are used by
 * other scripts to do some cool things, particular for math involving 2D and
 * 3D geometry.
 */
var MatrixMath = (function() {
  /**
   * An NxN square matrix, represented as a 2D array of numbers in column-major
   * order. For example, mat[3][2] would get the value in column 3 and row 2.
   * order.
   * @typedef {number[][]} Matrix
   */

  /**
   * An N-degree vector.
   * @typedef {number[]} Vector
   */

  /**
   * Gets the adjugate of a matrix, the tranpose of its cofactor matrix.
   * @param  {Matrix} mat
   * @return {Matrix}
   */
  function adjoint(mat) {
    var cofactorMat = MatrixMath.cofactorMatrix(mat);
    return MatrixMath.transpose(cofactorMat);
  }

   /**
    * Produces a clone of an NxN square matrix.
    * @param  {Matrix} mat
    * @return {Matrix}
    */
  function clone(mat) {
    return _.map(mat, function(column) {
      return _.map(column, function(value) {
        return value;
      });
    });
  }

  /**
   * Gets the cofactor of a matrix at a specified column and row.
   * @param  {Matrix} mat
   * @param  {uint} col
   * @param  {uint} row
   * @return {number}
   */
  function cofactor(mat, col, row) {
    return Math.pow(-1, col+row)*MatrixMath.minor(mat, col, row);
  }

  /**
   * Gets the cofactor matrix of a matrix.
   * @param  {Matrix} mat
   * @return {Matrix}
   */
  function cofactorMatrix(mat) {
    var result = [];
    var size = MatrixMath.size(mat);
    for(var col=0; col<size; col++) {
      result[col] = [];
      for(var row=0; row<size; row++) {
        result[col][row] = MatrixMath.cofactor(mat, col, row);
      }
    }
    return result;
  }

  /**
   * Gets the determinant of an NxN matrix.
   * @param  {Matrix} mat
   * @return {number}
   */
  function determinant(mat) {
    var size = MatrixMath.size(mat);

    if(size === 2)
      return mat[0][0]*mat[1][1] - mat[1][0]*mat[0][1];
    else {
      var sum = 0;
      for(var col=0; col<size; col++) {
        sum += mat[col][0] * MatrixMath.cofactor(mat, col, 0);
      }
      return sum;
    }
  }

  /**
   * Tests if two matrices are equal.
   * @param  {Matrix} a
   * @param  {Matrix} b
   * @param {number} [tolerance=0]
   *        If specified, this specifies the amount of tolerance to use for
   *        each value of the matrices when testing for equality.
   * @return {boolean}
   */
  function equal(a, b, tolerance) {
    tolerance = tolerance || 0;
    var sizeA = MatrixMath.size(a);
    var sizeB = MatrixMath.size(b);

    if(sizeA !== sizeB)
      return false;

    for(var col=0; col<sizeA; col++) {
      for(var row=0; row<sizeA; row++) {
        if(Math.abs(a[col][row] - b[col][row]) > tolerance)
          return false;
      }
    }
    return true;
  }

  /**
   * Produces an identity matrix of some size.
   * @param  {uint} size
   * @return {Matrix}
   */
  function identity(size) {
    var mat = [];
    for(var col=0; col<size; col++) {
      mat[col] = [];
      for(var row=0; row<size; row++) {
        if(row === col)
          mat[col][row] = 1;
        else
          mat[col][row] = 0;
      }
    }
    return mat;
  }

  /**
   * Gets the inverse of a matrix.
   * @param  {Matrix} mat
   * @return {Matrix}
   */
  function inverse(mat) {
    var determinant = MatrixMath.determinant(mat);
    if(determinant === 0)
      return undefined;

    var adjoint = MatrixMath.adjoint(mat);
    var result = [];
    var size = MatrixMath.size(mat);
    for(var col=0; col<size; col++) {
      result[col] = [];
      for(var row=0; row<size; row++) {
        result[col][row] = adjoint[col][row]/determinant;
      }
    }
    return result;
  }

  /**
   * Gets the determinant of a matrix omitting some column and row.
   * @param  {Matrix} mat
   * @param  {uint} col
   * @param  {uint} row
   * @return {number}
   */
  function minor(mat, col, row) {
    var reducedMat = MatrixMath.omit(mat, col, row);
    return determinant(reducedMat);
  }


  /**
   * Returns the matrix multiplication of a*b.
   * This function works for non-square matrices (and also for transforming
   * vectors by a matrix).
   * For matrix multiplication to work, the # of columns in A must be equal
   * to the # of rows in B.
   * The resulting matrix will have the same number of rows as A and the
   * same number of columns as B.
   * If b was given as a vector, then the result will also be a vector.
   * @param  {Matrix} a
   * @param  {Matrix|Vector} b
   * @return {Matrix|Vector}
   */
  function multiply(a, b) {
    // If a vector is given for b, convert it to a nx1 matrix, where n
    // is the length of b.
    var bIsVector = _.isNumber(b[0]);
    if(bIsVector)
      b = [b];

    var colsA = a.length;
    var rowsA = a[0].length;
    var colsB = b.length;
    var rowsB = b[0].length;
    if(colsA !== rowsB)
      throw new Error('MatrixMath.multiply ERROR: # columns in A must be ' +
        'the same as the # rows in B. Got A: ' + rowsA + 'x' + colsA +
        ', B: ' + rowsB + 'x' + colsB + '.');

    var result = [];
    for(var col=0; col<colsB; col++) {
      result[col] = [];
      for(var row=0; row<rowsA; row++) {
        result[col][row] = 0;
        for(var i=0; i<colsA; i++) {
          result[col][row] += a[i][row] * b[col][i];
        }
      }
    }

    if(bIsVector)
      result = result[0];
    return result;
  }

  /**
   * Returns a matrix with a column and row omitted.
   * @param  {Matrix} mat
   * @param  {uint} col
   * @param  {uint} row
   * @return {Matrix}
   */
  function omit(mat, col, row) {
    var result = [];

    var size = MatrixMath.size(mat);
    for(var i=0; i<size; i++) {
      if(i === col)
        continue;

      var column = [];
      result.push(column);
      for(var j=0; j<size; j++) {
        if(j !== row)
          column.push(mat[i][j]);
      }
    }
    return result;
  }

  /**
   * Produces a 2D rotation affine transformation. The direction of the
   * rotation depends upon the coordinate system.
   * @param  {number} angle
   *         The angle, in radians.
   * @return {Matrix}
   */
  function rotate(angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return [[cos, sin, 0], [-sin, cos, 0], [0,0,1]];
  }

  /**
   * Produces a 2D scale affine transformation matrix.
   * The matrix is used to transform homogenous coordinates, so it is
   * actually size 3 instead of size 2, despite being used for 2D geometry.
   * @param  {(number|Vector)} amount
   *         If specified as a number, then it is a uniform scale. Otherwise,
   *         it defines a scale by parts.
   * @return {Matrix}
   */
  function scale(amount) {
    if(_.isNumber(amount))
      amount = [amount, amount];
    return [[amount[0], 0, 0], [0, amount[1], 0], [0, 0, 1]];
  }

  /**
   * Gets the size N of a NxN square matrix.
   * @param  {Matrix} mat
   * @return {uint}
   */
  function size(mat) {
    return mat[0].length;
  }

  /**
   * Produces a 2D translation affine transformation matrix.
   * The matrix is used to transform homogenous coordinates, so it is
   * actually size 3 instead of size 2, despite being used for 2D geometry.
   * @param  {Vector} vec
   * @return {Matrix}
   */
  function translate(vec) {
    return [[1,0,0], [0,1,0],[vec[0], vec[1], 1]];
  }

  /**
   * Returns the transpose of a matrix.
   * @param  {Matrix} mat
   * @return {Matrix}
   */
  function transpose(mat) {
    var result = [];

    var size = MatrixMath.size(mat);
    for(var col=0; col<size; col++) {
      result[col] = [];
      for(var row=0; row<size; row++) {
        result[col][row] = mat[row][col];
      }
    }
    return result;
  }


  return {
    adjoint: adjoint,
    clone: clone,
    cofactor: cofactor,
    cofactorMatrix: cofactorMatrix,
    determinant: determinant,
    equal: equal,
    identity: identity,
    inverse: inverse,
    minor: minor,
    multiply: multiply,
    omit: omit,
    rotate: rotate,
    scale: scale,
    size: size,
    translate: translate,
    transpose: transpose
  };
})();



// Perform unit tests. Inform us in the log if any test fails. Otherwise,
// succeed silently.
(function() {
  /**
   * Asserts that some boolean expression is true. Otherwise, it throws
   * an error.
   * @param {boolean} test    Some expression to test.
   * @param {string} failMsg  A message displayed if the test fails.
   */
  function assert(test, failMsg) {
    if(!test)
      throw new Error(failMsg);
  }

  function assertEqual(actual, expected, tolerance) {
    assert(MatrixMath.equal(actual, expected, tolerance),
      'Expected: ' + JSON.stringify(expected) +
      '\nActual: ' + JSON.stringify(actual));
  }

  /**
   * Performs a unit test.
   * If it fails, then the test's name and the error is displayed.
   * It is silent if the test passes.
   * @param  {string} testName
   * @param  {function} testFn
   */
  function unitTest(testName, testFn) {
    try {
      testFn();
    }
    catch(err) {
      log('TEST ' + testName);
      log('ERROR: ');
      var messageLines = err.message.split('\n');
      _.each(messageLines, function(line) {
        log(line);
      });
    }
  }


  unitTest('MatrixMath.equal()', function() {
    var a = [[1,2,3], [4,5,6], [7,8,9]];
    var b = [[1,2,3], [4,5,6], [7,8,9]];
    var c = [[0,0,0], [1,1,1], [2,2,2]];
    assert(MatrixMath.equal(a,b));
    assert(!MatrixMath.equal(a,c));
  });

  unitTest('MatrixMath.adjoint()', function() {
    // Example taken from http://www.mathwords.com/a/adjoint.htm
    var a = [[1,0,1], [2,4,0], [3,5,6]];

    var actual = MatrixMath.adjoint(a);
    var expected = [[24, 5, -4], [-12,3,2], [-2,-5,4]];

    assertEqual(actual, expected);
  });

  unitTest('MatrixMath.clone()', function() {
    var a = [[1,2,3], [4,5,6], [7,8,9]];
    var clone = MatrixMath.clone(a);
    assertEqual(a, clone);
    assert(a !== clone, 'should not be equal by reference.');
  });

  unitTest('MatrixMath.cofactor()', function() {
    // Example taken from http://www.mathwords.com/c/cofactor_matrix.htm.
    var a = [[1,0,1], [2,4,0], [3,5,6]];

    var actual = MatrixMath.cofactor(a,0,0);
    var expected = 24;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,1,0);
    var expected = 5;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,2,0);
    var expected = -4;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,0,1);
    var expected = -12;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,1,1);
    var expected = 3;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,2,1);
    var expected = 2;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,0,2);
    var expected = -2;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,1,2);
    var expected = -5;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var actual = MatrixMath.cofactor(a,2,2);
    var expected = 4;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);
  });

  unitTest('MatrixMath.cofactorMatrix()', function() {
    // Example taken from http://www.mathwords.com/c/cofactor_matrix.htm.
    var a = [[1,0,1], [2,4,0], [3,5,6]];
    var actual = MatrixMath.cofactorMatrix(a);
    var expected = [[24, -12, -2], [5, 3, -5], [-4, 2, 4]];
    assertEqual(actual, expected);
  });

  unitTest('MatrixMath.determinant()', function() {
    var a = [[1,2], [3,4]];
    var actual = MatrixMath.determinant(a);
    var expected = -2;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    var a = [[1,5,0,2], [3,1,1,-1], [-2,0,0,0], [1,-1,-2,3]];
    var actual = MatrixMath.determinant(a);
    var expected = -6;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);
  });

  unitTest('MatrixMath.identity()', function() {
    var actual = MatrixMath.identity(3);
    var expected = [[1,0,0], [0,1,0], [0,0,1]];
    assertEqual(actual, expected);

    var actual = MatrixMath.identity(2);
    var expected = [[1,0], [0,1]];
    assertEqual(actual, expected);
  });

  unitTest('MatrixMath.inverse()', function() {
    // Example taken from http://www.mathwords.com/i/inverse_of_a_matrix.htm
    var a = [[1,0,1], [2,4,0], [3,5,6]];
    var actual = MatrixMath.inverse(a);
    var expected = [[12/11, 5/22, -2/11],
                    [-6/11, 3/22, 1/11],
                    [-1/11, -5/22, 2/11]];
    assertEqual(actual, expected);

    var inverse = MatrixMath.multiply(a, actual);
    var expected = MatrixMath.identity(3);
    assertEqual(inverse, expected, 0.001);
  });

  unitTest('MatrixMath.minor()', function() {
    var a = [[1,2,3], [4,5,6], [7,8,9]];
    var actual = MatrixMath.minor(a, 1, 1);
    var expected = -12;
    assert(actual === expected, 'Got ' + actual + '\nExpected ' + expected);
  });

  unitTest('MatrixMath.multiply()', function() {
    var a = [[1,2,3], [4,5,6], [7,8,9]];
    var b = [[9,8,7], [6,5,4], [3,2,1]];
    var actual = MatrixMath.multiply(a,b);
    var expected = [[90, 114, 138], [54,69,84], [18,24,30]];
    assertEqual(actual, expected);
  });

  unitTest('Matrix.multiply() to transform a vector', function() {
    // A 2D point in homogenous coordinates.
    var pt = [1,2,1];

    var scale = MatrixMath.scale([10,20]);
    var rotate = MatrixMath.rotate(Math.PI/2);
    var translate = MatrixMath.translate([2,-8]);

    var m = MatrixMath.multiply(scale, rotate);
    m = MatrixMath.multiply(m, translate);

    // Transform the point.
    var actual = MatrixMath.multiply(m, pt);
    var expected = [60, 60, 1];
    assertEqual(actual, expected, 0.01);
  });

  unitTest('MatrixMath.omit()', function() {
    var a = [[1,2,3], [4,5,6], [7,8,9]];
    var actual = MatrixMath.omit(a, 1, 2);
    var expected = [[1,2], [7,8]];
    assertEqual(actual, expected);
  });

  unitTest('MatrixMath.size()', function() {
    var a = [[1,2,3], [4,5,6], [7,8,9]];
    assert(MatrixMath.size(a) === 3);

    var b = [[1,2],[3,4]];
    assert(MatrixMath.size(b) === 2);
  });

  unitTest('MatrixMath.transpose()', function() {
    var a = [[1,2,3], [4,5,6], [7,8,9]];
    var expected = [[1,4,7], [2,5,8], [3,6,9]];
    var transpose = MatrixMath.transpose(a);
    assertEqual(transpose, expected);
  });



})();



//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//       PATHMATH
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
/* globals VecMath MatrixMath */
var API_Meta = API_Meta||{}; //eslint-disable-line no-var
API_Meta.PathMath={offset:Number.MAX_SAFE_INTEGER,lineCount:-1};
{try{throw new Error('');}catch(e){API_Meta.PathMath.offset=(parseInt(e.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/,'$1'),10)-4);}}
API_Meta.PathMath.version = '1.7';


/**
 * PathMath script
 *
 * This is a library that provides mathematical operations involving Paths.
 * It intended to be used by other scripts and has no stand-alone
 * functionality of its own. All the library's operations are exposed by the
 * PathMath object created by this script.
 */
const PathMath = (() => {

    /** The size of a single square on a page, in pixels. */
    const UNIT_SIZE_PX = 70;

    let isJumpgate = ()=>{
      if(['jumpgate'].includes(Campaign().get('_release'))) {
        isJumpgate = () => true;
      } else {
        isJumpgate = () => false;
      }
      return isJumpgate();
    };

    /**
     * A vector used to define a homogeneous point or a direction.
     * @typedef {number[]} Vector
     */

    /**
     * A line segment defined by two homogeneous 2D points.
     * @typedef {Vector[]} Segment
     */

    /**
     * Information about a path's 2D transform.
     * @typedef {Object} PathTransformInfo
     * @property {number} angle
     *           The path's rotation angle in radians.
     * @property {number} cx
     *           The x coordinate of the center of the path's bounding box.
     * @property {number} cy
     *           The y coordinate of the center of the path's bounding box.
     * @property {number} height
     *           The unscaled height of the path's bounding box.
     * @property {number} scaleX
     *           The path's X-scale.
     * @property {number} scaleY
     *           The path's Y-scale.
     * @property {number} width
     *           The unscaled width of the path's bounding box.
     */

    /**
     * Rendering information for shapes.
     * @typedef {Object} RenderInfo
     * @property {string} [controlledby]
     * @property {string} [fill]
     * @property {string} [stroke]
     * @property {string} [strokeWidth]
     */

    /**
     * Some shape defined by a path.
     * @abstract
     */
    class PathShape {
      constructor(vertices) {
        this.vertices = vertices || [];
      }

      /**
       * Gets the distance from this shape to some point.
       * @abstract
       * @param {vec3} pt
       * @return {number}
       */
      distanceToPoint(/* pt */) {
        throw new Error('Must be defined by subclass.');
      }

      /**
       * Gets the bounding box of this shape.
       * @return {BoundingBox}
       */
      getBoundingBox() {
        if(!this._bbox) {
          let left, right, top, bottom;
          _.each(this.vertices, (v, i) => {
            if(i === 0) {
              left = v[0];
              right = v[0];
              top = v[1];
              bottom = v[1];
            }
            else {
              left = Math.min(left, v[0]);
              right = Math.max(right, v[0]);
              top = Math.min(top, v[1]);
              bottom = Math.max(bottom, v[1]);
            }
          });
          let width = right - left;
          let height = bottom - top;
          this._bbox = new BoundingBox(left, top, width, height);
        }
        return this._bbox;
      }

      /**
       * Checks if this shape intersects another shape.
       * @abstract
       * @param {PathShape} other
       * @return {boolean}
       */
      intersects(/* other */) {
        throw new Error('Must be defined by subclass.');
      }

      /**
       * Renders this path.
       * @param {string} pageId
       * @param {string} layer
       * @param {RenderInfo} renderInfo
       * @return {Roll20.Path}
       */
      render(pageId, layer, renderInfo) {
        let segments = this.toSegments();
        let pathData = segmentsToPath(segments);
        _.extend(pathData, renderInfo, {
          _pageid: pageId,
          layer
        });
        return createObj(isJumpgate() ? 'pathv2' : 'path', pathData);
      }

      /**
       * Returns the segments that make up this shape.
       * @abstract
       * @return {Segment[]}
       */
      toSegments() {
        throw new Error('Must be defined by subclass.');
      }

      /**
       * Produces a copy of this shape, transformed by an affine
       * transformation matrix.
       * @param {MatrixMath.Matrix} matrix
       * @return {PathShape}
       */
      transform(matrix) {
        let vertices = _.map(this.vertices, v => {
          return MatrixMath.multiply(matrix, v);
        });
        let Clazz = this.constructor;
        return new Clazz(vertices);
      }
    }

    /**
     * An open shape defined by a path or list of vertices.
     */
    class Path extends PathShape {

      /**
       * @param {(Roll20Path|vec3[])} path
       */
      constructor(path) {
        super();
        if(_.isArray(path))
          this.vertices = path;
        else {
          this._segments = toSegments(path);
          _.each(this._segments, (seg, i) => {
            if(i === 0)
              this.vertices.push(seg[0]);
            this.vertices.push(seg[1]);
          });
        }

        this.numVerts = this.vertices.length;
      }

      /**
       * Gets the distance from this path to some point.
       * @param {vec3} pt
       * @return {number}
       */
      distanceToPoint(pt) {
        let dist = _.chain(this.toSegments())
        .map(seg => {
          let [ p, q ] = seg;
          return VecMath.ptSegDist(pt, p, q);
        })
        .min()
        .value();
        return dist;
      }

      /**
       * Checks if this path intersects with another path.
       * @param {Polygon} other
       * @return {boolean}
       */
      intersects(other) {
        let thisBox = this.getBoundingBox();
        let otherBox = other.getBoundingBox();

        // If the bounding boxes don't intersect, then the paths won't
        // intersect.
        if(!thisBox.intersects(otherBox))
          return false;

        // Naive approach: Since our shortcuts didn't return, check each
        // path's segments for intersections with each of the other
        // path's segments. This takes O(n^2) time.
        return !!_.find(this.toSegments(), seg1 => {
          return !!_.find(other.toSegments(), seg2 => {
            return !!segmentIntersection(seg1, seg2);
          });
        });
      }

      /**
       * Produces a list of segments defining this path.
       * @return {Segment[]}
       */
      toSegments() {
        if(!this._segments) {
          if (this.numVerts <= 1)
            return [];

          this._segments = _.map(_.range(this.numVerts - 1), i => {
            let v = this.vertices[i];
            let vNext = this.vertices[i + 1];
            return [v, vNext];
          });
        }
        return this._segments;
      }
    }

    /**
     * A closed shape defined by a path or a list of vertices.
     */
    class Polygon extends PathShape {

      /**
       * @param {(Roll20Path|vec3[])} path
       */
      constructor(path) {
        super();
        if(_.isArray(path))
          this.vertices = path;
        else {
          this._segments = toSegments(path);
          this.vertices = _.map(this._segments, seg => {
            return seg[0];
          });
        }

        this.numVerts = this.vertices.length;
        if(this.numVerts < 3)
          throw new Error('A polygon must have at least 3 vertices.');
      }

      /**
       * Determines whether a point lies inside the polygon using the
       * winding algorithm.
       * See: http://geomalgorithms.com/a03-_inclusion.html
       * @param {vec3} p
       * @return {boolean}
       */
      containsPt(p) {
        // A helper function that tests if a point is "left" of a line segment.
        let _isLeft = (p0, p1, p2) => {
          return (p1[0] - p0[0])*(p2[1] - p0[1]) - (p2[0]-p0[0])*(p1[1]-p0[1]);
        };

        let total = 0;
        _.each(this.vertices, (v1, i) => {
          let v2 = this.vertices[(i+1) % this.numVerts];

          // Check for valid up intersect.
          if(v1[1] <= p[1] && v2[1] > p[1]) {
            if(_isLeft(v1, v2, p) > 0)
              total++;
          }

          // Check for valid down intersect.
          else if(v1[1] > p[1] && v2[1] <= p[1]) {
            if(_isLeft(v1, v2, p) < 0)
              total--;
          }
        });
        return !!total; // We are inside if our total windings are non-zero.
      }

      /**
       * Gets the distance from this polygon to some point.
       * @param {vec3} pt
       * @return {number}
       */
      distanceToPoint(pt) {
        if(this.containsPt(pt))
          return 0;
        else
          return _.chain(this.toSegments())
          .map(seg => {
            let [ p, q ] = seg;
            return VecMath.ptSegDist(pt, p, q);
          })
          .min()
          .value();
      }

      /**
       * Gets the area of this polygon.
       * @return {number}
       */
      getArea() {
        let triangles = this.tessellate();
        return _.reduce(triangles, (area, tri) => {
          return area + tri.getArea();
        }, 0);
      }

      /**
       * Determines whether each vertex along the polygon is convex (1)
       * or concave (-1). A vertex lying on a straight line is assined 0.
       * @return {int[]}
       */
      getConvexness() {
        return Polygon.getConvexness(this.vertices);
      }

      /**
       * Gets the convexness information about each vertex.
       * @param {vec3[]}
       * @return {int[]}
       */
      static getConvexness(vertices) {
        let totalAngle = 0;
        let numVerts = vertices.length;
        let vertexCurves = _.map(vertices, (v, i) => {
          let vPrev = vertices[(i-1 + numVerts) % numVerts];
          let vNext = vertices[(i+1 + numVerts) % numVerts];

          let u = VecMath.sub(v, vPrev);
          let w = VecMath.sub(vNext, v);
          let uHat = VecMath.normalize(u);
          let wHat = VecMath.normalize(w);

          let cross = VecMath.cross(uHat, wHat);
          let sign = cross[2];
          if(sign)
            sign = sign/Math.abs(sign);

          let dot = VecMath.dot(uHat, wHat);
          let angle = Math.acos(dot)*sign;
          totalAngle += angle;

          return sign;
        });

        if(totalAngle < 0)
          return _.map(vertexCurves, curve => {
            return -curve;
          });
        else
          return vertexCurves;
      }

      /**
       * Checks if this polygon intersects with another polygon.
       * @param {(Polygon|Path)} other
       * @return {boolean}
       */
      intersects(other) {
        let thisBox = this.getBoundingBox();
        let otherBox = other.getBoundingBox();

        // If the bounding boxes don't intersect, then the polygons won't
        // intersect.
        if(!thisBox.intersects(otherBox))
          return false;

        // If either polygon contains the first point of the other, then
        // they intersect.
        if(this.containsPt(other.vertices[0]) ||
          (other instanceof Polygon && other.containsPt(this.vertices[0])))
          return true;

        // Naive approach: Since our shortcuts didn't return, check each
        // polygon's segments for intersections with each of the other
        // polygon's segments. This takes O(n^2) time.
        return !!_.find(this.toSegments(), seg1 => {
          return !!_.find(other.toSegments(), seg2 => {
            return !!segmentIntersection(seg1, seg2);
          });
        });
      }

      /**
       * Checks if this polygon intersects a Path.
       * @param {Path} path
       * @return {boolean}
       */
      intersectsPath(path) {
        let segments1 = this.toSegments();
        let segments2 = PathMath.toSegments(path);

        // The path intersects if any point is inside this polygon.
        if(this.containsPt(segments2[0][0]))
          return true;

        // Check if any of the segments intersect.
        return !!_.find(segments1, seg1 => {
          return _.find(segments2, seg2 => {
            return PathMath.segmentIntersection(seg1, seg2);
          });
        });
      }

      /**
       * Tessellates a closed path representing a simple polygon
       * into a bunch of triangles.
       * @return {Triangle[]}
       */
      tessellate() {
        let triangles = [];
        let vertices = _.clone(this.vertices);

        // Tessellate using ear-clipping algorithm.
        while(vertices.length > 0) {
          if(vertices.length === 3) {
            triangles.push(new Triangle(vertices[0], vertices[1], vertices[2]));
            vertices = [];
          }
          else {
            // Determine whether each vertex is convex, concave, or linear.
            let convexness = Polygon.getConvexness(vertices);
            let numVerts = vertices.length;

            // Find the next ear to clip from the polygon.
            let earIndex = _.find(_.range(numVerts), i => {
              let v = vertices[i];
              let vPrev = vertices[(numVerts + i -1) % numVerts];
              let vNext = vertices[(numVerts + i + 1) % numVerts];

              let vConvexness = convexness[i];
              if(vConvexness === 0) // The vertex lies on a straight line. Clip it.
                return true;
              else if(vConvexness < 0) // The vertex is concave.
                return false;
              else { // The vertex is convex and might be an ear.
                let triangle = new Triangle(vPrev, v, vNext);

                // The vertex is not an ear if there is at least one other
                // vertex inside its triangle.
                return !_.find(vertices, (v2) => {
                  if(v2 === v || v2 === vPrev || v2 === vNext)
                    return false;
                  else {
                    return triangle.containsPt(v2);
                  }
                });
              }
            });

            let v = vertices[earIndex];
            let vPrev = vertices[(numVerts + earIndex -1) % numVerts];
            let vNext = vertices[(numVerts + earIndex + 1) % numVerts];
            triangles.push(new Triangle(vPrev, v, vNext));
            vertices.splice(earIndex, 1);
          }
        }
        return triangles;
      }

      /**
       * Produces a list of segments defining this polygon.
       * @return {Segment[]}
       */
      toSegments() {
        if(!this._segments) {
          this._segments = _.map(this.vertices, (v, i) => {
            let vNext = this.vertices[(i + 1) % this.numVerts];
            return [v, vNext];
          });
        }
        return this._segments;
      }
    }

    /**
     * A 3-sided polygon that is great for tessellation!
     */
    class Triangle extends Polygon {
      /**
       * @param {vec3} p1
       * @param {vec3} p2
       * @param {vec3} p3
       */
      constructor(p1, p2, p3) {
        if(_.isArray(p1))
          [p1, p2, p3] = p1;
        super([p1, p2, p3]);

        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
      }

      /**
       * @inheritdoc
       */
      getArea() {
        let base = VecMath.sub(this.p2, this.p1);
        let width = VecMath.length(base);
        let height = VecMath.ptLineDist(this.p3, this.p1, this.p2);

        return width*height/2;
      }
    }

    /**
     * A circle defined by its center point and radius.
     */
    class Circle extends PathShape {

      /**
       * @param {vec3} pt
       * @param {number} r
       */
      constructor(pt, r) {
        super();
        this.center = pt;
        this.radius = r;
        this.diameter = 2*r;
      }

      /**
       * Checks if a point is contained within this circle.
       * @param {vec3} pt
       * @return {boolean}
       */
      containsPt(pt) {
        let dist = VecMath.dist(this.center, pt);
        return dist <= this.radius;
      }

      /**
       * Gets the distance from this circle to some point.
       * @param {vec3} pt
       * @return {number}
       */
      distanceToPoint(pt) {
        if(this.containsPt(pt))
          return 0;
        else {
          return VecMath.dist(this.center, pt) - this.radius;
        }
      }

      /**
       * Gets this circle's area.
       * @return {number}
       */
      getArea() {
        return Math.PI*this.radius*this.radius;
      }

      /**
       * Gets the circle's bounding box.
       * @return {BoundingBox}
       */
      getBoundingBox() {
        let left = this.center[0] - this.radius;
        let top = this.center[1] - this.radius;
        let dia = this.radius*2;
        return new BoundingBox(left, top, dia, dia);
      }

      /**
       * Gets this circle's circumference.
       * @return {number}
       */
      getCircumference() {
        return Math.PI*this.diameter;
      }

      /**
       * Checks if this circle intersects another circle.
       * @param {Circle} other
       * @return {boolean}
       */
      intersects(other) {
        let dist = VecMath.dist(this.center, other.center);
        return dist <= this.radius + other.radius;
      }

      /**
       * Checks if this circle intersects a polygon.
       * @param {Polygon} poly
       * @return {boolean}
       */
      intersectsPolygon(poly) {

        // Quit early if the bounding boxes don't overlap.
        let thisBox = this.getBoundingBox();
        let polyBox = poly.getBoundingBox();
        if(!thisBox.intersects(polyBox))
          return false;

        if(poly.containsPt(this.center))
          return true;
        return !!_.find(poly.toSegments(), seg => {
          return this.segmentIntersection(seg);
        });
      }

      /**
       * Renders this circle.
       * @param {string} pageId
       * @param {string} layer
       * @param {RenderInfo} renderInfo
       */
      render(pageId, layer, renderInfo) {
        let data;
        if(isJumpgate()){
          data = {
            shape: 'eli',
            x: this.center[0],
            y: this.center[1],
            points: `[[0,0],[${this.diameter*(renderInfo.scaleX??1)},${this.diameter*(renderInfo.scaleY??1)}]]`
          };
        } else {
          data = createCircleData(this.radius);
          data.left = this.center[0];
          data.top = this.center[1];
        }
        _.extend(data, renderInfo, {
          _pageid: pageId,
          layer,
          left: this.center[0],
          top: this.center[1]
        });
        return createObj(isJumpgate() ? 'pathv2' : 'path', data);
      }

      /**
       * Gets the intersection coefficient between this circle and a Segment,
       * if such an intersection exists. Otherwise, undefined is returned.
       * @param {Segment} segment
       * @return {Intersection}
       */
      segmentIntersection(segment) {
        if(this.containsPt(segment[0])) {
          let pt = segment[0];
          let s = 0;
          let t = VecMath.dist(this.center, segment[0])/this.radius;
          return [pt, s, t];
        }
        else {
          let u = VecMath.sub(segment[1], segment[0]);
          let uHat = VecMath.normalize(u);
          let uLen = VecMath.length(u);
          let v = VecMath.sub(this.center, segment[0]);

          let height = VecMath.ptLineDist(this.center, segment[0], segment[1]);
          let base = Math.sqrt(this.radius*this.radius - height*height);

          if(isNaN(base))
            return undefined;

          let scalar = VecMath.scalarProjection(u, v)-base;
          let s = scalar/uLen;

          if(s >= 0 && s <= 1) {
            let t = 1;
            let pt = VecMath.add(segment[0], VecMath.scale(uHat, scalar));
            return [pt, s, t];
          }
          else
            return undefined;
        }
      }
    }

    /**
     * The bounding box for a path/polygon.
     */
    class BoundingBox {
      /**
       * @param {Number} left
       * @param {Number} top
       * @param {Number} width
       * @param {Number} height
       */
      constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.right = left + width;
        this.bottom = top + height;
      }

      /**
       * Adds two bounding boxes.
       * @param  {BoundingBox} a
       * @param  {BoundingBox} b
       * @return {BoundingBox}
       */
      static add(a, b) {
        let left = Math.min(a.left, b.left);
        let top = Math.min(a.top, b.top);
        let right = Math.max(a.left + a.width, b.left + b.width);
        let bottom = Math.max(a.top + a.height, b.top + b.height);

        return new BoundingBox(left, top, right - left, bottom - top);
      }

      /**
       * Gets the area of this bounding box.
       * @return {number}
       */
      getArea() {
        return this.width * this.height;
      }

      /**
       * Checks if this bounding box intersects another bounding box.
       * @param {BoundingBox} other
       * @return {boolean}
       */
      intersects(other) {
        return !( this.left > other.right ||
                  this.right < other.left ||
                  this.top > other.bottom ||
                  this.bottom < other.top);
      }

      /**
       * Renders the bounding box.
       * @param {string} pageId
       * @param {string} layer
       * @param {RenderInfo} renderInfo
       */
      render(pageId, layer, renderInfo) {
        let verts = [
          [this.left, this.top, 1],
          [this.right, this.top, 1],
          [this.right, this.bottom, 1],
          [this.left, this.bottom, 1]
        ];
        let poly = new Polygon(verts);
        poly.render(pageId, layer, renderInfo);
      }
    }

    /**
     * Returns the partial path data for creating a circular path.
     * @param  {number} radius
     * @param {int} [sides]
     *        If specified, then a polygonal path with the specified number of
     *        sides approximating the circle will be created instead of a true
     *        circle.
     * @return {PathData}
     */
    function createCircleData(radius, sides) {
      let _path = [];
      if(sides) {
        let cx = radius;
        let cy = radius;
        let angleInc = Math.PI*2/sides;
        _path.push(['M', cx + radius, cy]);
        _.each(_.range(1, sides+1), function(i) {
          let angle = angleInc*i;
          let x = cx + radius*Math.cos(angle);
          let y = cy + radius*Math.sin(angle);
          _path.push(['L', x, y]);
        });
      }
      else {
        let r = radius;
        _path = [
          ['M', 0,      r],
          ['C', 0,      r*0.5,  r*0.5,  0,      r,      0],
          ['C', r*1.5,  0,      r*2,    r*0.5,  r*2.0,  r],
          ['C', r*2.0,  r*1.5,  r*1.5,  r*2.0,  r,      r*2.0],
          ['C', r*0.5,  r*2,    0,      r*1.5,  0,      r]
        ];
      }
      return {
        height: radius*2,
        _path: JSON.stringify(_path),
        width: radius*2
      };
    }

    /**
     * Computes the distance from a point to some path.
     * @param {vec3} pt
     * @param {(Roll20Path|PathShape)} path
     */
    function distanceToPoint(pt, path) {
      if(!(path instanceof PathShape))
        path = new Path(path);
      return path.distanceToPoint(pt);
    }

    /**
     * Gets a point along some Bezier curve of arbitrary degree.
     * @param {vec3[]} points
     *        The points of the Bezier curve. The points between the first and
     *        last point are the control points.
     * @param {number} scalar
     *        The parametric value for the point we want along the curve.
     *        This value is expected to be in the range [0, 1].
     * @return {vec3}
     */
    function getBezierPoint(points, scalar) {
      if(points.length < 2)
        throw new Error('Bezier curve cannot have less than 2 points.');
      else if(points.length === 2) {
        let u = VecMath.sub(points[1], points[0]);
        u = VecMath.scale(u, scalar);
        return VecMath.add(points[0], u);
      }
      else {
        let newPts = _.chain(points)
        .map((cur, i) => {
          if(i === 0)
            return undefined;

          let prev = points[i-1];
          return getBezierPoint([prev, cur], scalar);
        })
        .compact()
        .value();

        return getBezierPoint(newPts, scalar);
      }
    }


    /**
     * Calculates the bounding box for a list of paths.
     * @param {Roll20Path | Roll20Path[]} paths
     * @return {BoundingBox}
     */
    function getBoundingBox(paths) {
      if(!_.isArray(paths))
        paths = [paths];

      let result;
      _.each(paths, function(p) {
        let pBox = _getSingleBoundingBox(p);
        if(result)
          result = BoundingBox.add(result, pBox);
        else
          result = pBox;
      });
      return result;
    }

    /**
     * Returns the center of the bounding box countaining a path or list
     * of paths. The center is returned as a 2D homongeneous point
     * (It has a third component which is always 1 which is helpful for
     * affine transformations).
     * @param {(Roll20Path|Roll20Path[])} paths
     * @return {Vector}
     */
    function getCenter(paths) {
        if(!_.isArray(paths))
            paths = [paths];

        let bbox = getBoundingBox(paths);
        let cx = bbox.left + bbox.width/2;
        let cy = bbox.top + bbox.height/2;

        return [cx, cy, 1];
    }

    /**
     * @private
     * Calculates the bounding box for a single path.
     * @param  {Roll20Path} path
     * @return {BoundingBox}
     */
    function _getSingleBoundingBox(path) {
        let pathData = normalizePath(path);

        let width = pathData.width;
        let height = pathData.height;
        let left = pathData.left - width/2;
        let top = pathData.top - height/2;

        return new BoundingBox(left, top, width, height);
    }

    function _pathV2Bounds(path) {
      let p = JSON.parse(path.get('points'))??[];
      let {Mx,mx,My,my} = p.reduce((m,[x,y])=>({
        Mx:Math.max(m.Mx,x),
        mx:Math.min(m.mx,x),
        My:Math.max(m.My,y),
        my:Math.min(m.my,y)
      }),{Mx:-Infinity,mx:Infinity,My:-Infinity,my:Infinity});

      return [Mx-mx,My-my];
    }

    /**
     * Gets the 2D transform information about a path.
     * @param  {Roll20Path} path
     * @return {PathTransformInfo}
     */
    function getTransformInfo(path) {
      let angle = path.get('rotation')/180*Math.PI;


      if('path' === path.get('type')){
          let scaleX = path.get('scaleX');
          let scaleY = path.get('scaleY');

          // The untransformed width and height.
          let width = path.get('width');
          let height = path.get('height');
          // The transformed center of the path.
          let cx = path.get('left');
          let cy = path.get('top');

          return {
              angle: angle,
              cx: cx,
              cy: cy,
              height: height,
              scaleX: scaleX,
              scaleY: scaleY,
              width: width
          };
      } else {
        // pathv2
        let [width,height] = _pathV2Bounds(path);

        return {
          angle: angle,
          cx: path.get('x'),
          cy: path.get('y'),
          scaleX: 1,
          scaleY: 1,
          height: height, 
          width: width
        };
      }
    }

    /**
     * Checks if a path is closed, and is therefore a polygon.
     * @param {(Roll20Path|Segment[])}
     * @return {boolean}
     */
    function isClosed(path) { // eslint-disable-line no-unused-vars
      // Convert to segments.
      if(!_.isArray(path))
        path = toSegments(path);
      return (_.isEqual(path[0][0], path[path.length-1][1]));
    }


    /**
     * Produces a merged path string from a list of path objects.
     * @param {Roll20Path[]} paths
     * @return {String}
     */
    function mergePathStr(paths) {
        let merged = [];
        let bbox = getBoundingBox(paths);

        _.each(paths, function(p) {
            let pbox = getBoundingBox(p);

            // Convert the path to a normalized polygonal path.
            p = normalizePath(p);
            let parsed = JSON.parse(p._path);
            _.each(parsed, function(pathTuple) {
                let dx = pbox.left - bbox.left;
                let dy = pbox.top - bbox.top;

                // Move and Line tuples
                let x = pathTuple[1] + dx;
                let y = pathTuple[2] + dy;
                merged.push([pathTuple[0], x, y]);
            });
        });

        return JSON.stringify(merged);
    }

    /**
     * Reproduces the data for a polygonal path such that the scales are 1 and
     * its rotate is 0.
     * This can also normalize freehand paths, but they will be converted to
     * polygonal paths. The quatric Bezier curves used in freehand paths are
     * so short though, that it doesn't make much difference though.
     * @param {Roll20Path}
     * @return {PathData}
     */
    function normalizePath(path) {
        let segments = toSegments(path);
        return segmentsToPath(segments);
    }

    /**
     * Produces a UDL window from a Path.
     * This UDL window path will be created on the walls layer
     * and will have a type of transparent.
     * 
     * @param {Roll20Path} path
     * @return {Roll20Path} The Path object for the new UDL window.
     */
    function pathToUDLWindow(path) {
      let pathData = normalizePath(path);

      let curPage = path.get('_pageid');
      _.extend(pathData, {
        stroke: '#ff0000',
        barrierType: "transparent",
        _pageid: curPage,
        layer: 'walls'
      });

      return createObj(isJumpgate() ? 'pathv2' : 'path', pathData);
    }

    /**
     * Computes the intersection between the projected lines of
     * two homogenous 2D line segments.
     *
     * Explanation of the fancy mathemagics:
     * Let A be the first point in seg1 and B be the second point in seg1.
     * Let C be the first point in seg2 and D be the second point in seg2.
     * Let U be the vector from A to B.
     * Let V be the vector from C to D.
     * Let UHat be the unit vector of U.
     * Let VHat be the unit vector of V.
     *
     * Observe that if the dot product of UHat and VHat is 1 or -1, then
     * seg1 and seg2 are parallel, so they will either never intersect or they
     * will overlap. We will ignore the case where seg1 and seg2 are parallel.
     *
     * We can represent any point P along the line projected by seg1 as
     * P = A + SU, where S is some scalar value such that S = 0 yeilds A,
     * S = 1 yields B, and P is on seg1 if and only if 0 <= S <= 1.
     *
     * We can also represent any point Q along the line projected by seg2 as
     * Q = C + TV, where T is some scalar value such that T = 0 yeilds C,
     * T = 1 yields D, and Q is on seg2 if and only if 0 <= T <= 1.
     *
     * Assume that seg1 and seg2 are not parallel and that their
     * projected lines intersect at some point P.
     * Therefore, we have A + SU = C + TV.
     *
     * We can rearrange this such that we have C - A = SU - TV.
     * Let vector W = C - A, thus W = SU - TV.
     * Also, let coeffs = [S, T, 1].
     *
     * We can now represent this system of equations as the matrix
     * multiplication problem W = M * coeffs, where in column-major
     * form, M = [U, -V, [0,0,1]].
     *
     * By matrix-multiplying both sides by M^-1, we get
     * M^-1 * W = M^-1 * M * coeffs = coeffs, from which we can extract the
     * values for S and T.
     *
     * We can now get the point of intersection on the projected lines of seg1
     * and seg2 by substituting S in P = A + SU or T in Q = C + TV.
     *
     * @param {Segment} seg1
     * @param {Segment} seg2
     * @return {Intersection}
     *      The point of intersection in homogenous 2D coordiantes and its
     *      scalar coefficients along seg1 and seg2,
     *      or undefined if the segments are parallel.
     */
    function raycast(seg1, seg2) {
      let u = VecMath.sub(seg1[1], seg1[0]);
      let v = VecMath.sub(seg2[1], seg2[0]);
      let w = VecMath.sub(seg2[0], seg1[0]);

      // Can't use 0-length vectors.
      if(VecMath.length(u) === 0 || VecMath.length(v) === 0)
          return undefined;

      // If the two segments are parallel, then either they never intersect
      // or they overlap. Either way, return undefined in this case.
      let uHat = VecMath.normalize(u);
      let vHat = VecMath.normalize(v);
      let uvDot = VecMath.dot(uHat,vHat);
      if(Math.abs(uvDot) > 0.9999)
          return undefined;

      // Build the inverse matrix for getting the intersection point's
      // parametric coefficients along the projected segments.
      let m = [[u[0], u[1], 0], [-v[0], -v[1], 0], [0, 0, 1]];
      let mInv = MatrixMath.inverse(m);

      // Get the parametric coefficients for getting the point of intersection
      // on the projected semgents.
      let coeffs = MatrixMath.multiply(mInv, w);
      let s = coeffs[0];
      let t = coeffs[1];

      let uPrime = VecMath.scale(u, s);
      return [VecMath.add(seg1[0], uPrime), s, t];
    }

    /**
     * Computes the intersection between two homogenous 2D line segments,
     * if it exists. To figure out the intersection, a raycast is performed
     * between the two segments.
     * Seg1 and seg2 also intersect at that point if and only if 0 <= S, T <= 1.
     * @param {Segment} seg1
     * @param {Segment} seg2
     * @return {Intersection}
     *      The point of intersection in homogenous 2D coordiantes and its
     *      parametric coefficients along seg1 and seg2,
     *      or undefined if the segments don't intersect.
     */
    function segmentIntersection(seg1, seg2) {
      let intersection = raycast(seg1, seg2);
      if(!intersection)
        return undefined;

      // Return the intersection only if it lies on both the segments.
      let s = intersection[1];
      let t = intersection[2];
      if(s >= 0 && s <= 1 && t >= 0 && t <= 1)
        return intersection;
      else
        return undefined;
    }


    /**
     * Produces the data for creating a path from a list of segments forming a
     * continuous path.
     * @param {Segment[]}
     * @return {PathData}
     */
    function segmentsToPath(segments) {
        let left = segments[0][0][0];
        let right = segments[0][0][0];
        let top = segments[0][0][1];
        let bottom = segments[0][0][1];

        // Get the bounds of the segment.
        let pts = [];
        let isFirst = true;
        _.each(segments, function(segment) {
            let p1 = [segment[0][0],segment[0][1]];
            if(isFirst) {
                isFirst = false;
                pts.push(p1);
            }

            let p2 = [segment[1][0],segment[1][1]];

            left = Math.min(left, p1[0], p2[0]);
            right = Math.max(right, p1[0], p2[0]);
            top = Math.min(top, p1[1], p2[1]);
            bottom = Math.max(bottom, p1[1], p2[1]);

            pts.push(p2);
        });

        // Get the path's left and top coordinates.
        let width = right-left;
        let height = bottom-top;
        let cx = left + width/2;
        let cy = top + height/2;

      if(isJumpgate()){
        return {
          shape: 'pol',
          x: cx,
          y: cy,
          points: JSON.stringify(pts)
        };
      } else {
        // Convert the points to a _path.
        let _path = [];
        let firstPt = true;
        _.each(pts, function(pt) {
            let type = 'L';
            if(firstPt) {
                type = 'M';
                firstPt = false;
            }
            _path.push([type, pt[0]-left, pt[1]-top]);
        });

        return {
            _path: JSON.stringify(_path),
            left: cx,
            top: cy,
            width: width,
            height: height
        };
      }
    }

    function _circlePointsFromCorners(p1,p2) {
      const SPACING=20;

      // reorder points to get top left to bottom right.
      if(p1[0]>p2[0]){
        let x = p1[0];
        p1[0]=p2[0];
        p2[0]=x;
      }
      if(p1[1]>p2[1]){
        let y = p1[1];
        p1[1]=p2[1];
        p2[1]=y;
      }

      const cx = (p1[0]+p2[0])/2;
      const cy = (p1[1]+p2[1])/2;
      const rx = (p2[0]-p1[0])/2;
      const ry = (p2[1]-p1[1])/2;

      const cir = Math.PI * ( 3* (rx+ry) - Math.sqrt((3*rx+ry)*(3*ry+rx)))/4;
      // number of half subdivisions = circumference / (Spacing *2) or 1
      // 
//      const pn = (Math.max(Math.ceil(cir/SPACING),1)*4)-1; // guarentee odd

      let pn = Math.max(Math.ceil(cir/SPACING),1);
      pn = (1===pn%2 ? pn : pn+1); // guarentee odd

      const th = Math.PI/4/pn;

      let octs = [[],[],[],[],[],[],[],[]];

      for( let i = 1; i <= pn; ++i){
        const a = i * th;
        const ct = Math.cos(a);
        const st = Math.sin(a);

        const x1 = parseFloat((rx*ct).toFixed(1));
        const y1 = parseFloat((ry*st).toFixed(1));
        const x2 = parseFloat((rx*st).toFixed(1));
        const y2 = parseFloat((ry*ct).toFixed(1));


        // postive quad
        octs[0].push([cx+x1,cy+y1]);
        if(x1!==x2) {
          octs[1].unshift([cx+x2,cy+y2]);
        }

        octs[2].push([cx-x2,cy+y2]);
        if(x1!==x2) {
          octs[3].unshift([cx-x1,cy+y1]);
        }

        octs[4].push([cx-x1,cy-y1]);
        if(x1!==x2) {
          octs[5].unshift([cx-x2,cy-y2]);
        }

        octs[6].push([cx+x2,cy-y2]);
        if(x1!==x2) {
          octs[7].unshift([cx+x1,cy-y1]);
        }
      }
      let points = [
        [cx+rx,cy],
        ...octs[0],
        ...octs[1],
        [cx,cy+ry],
        ...octs[2],
        ...octs[3],
        [cx-rx,cy],
        ...octs[4],
        ...octs[5],
        [cx,cy-ry],
        ...octs[6],
        ...octs[7]
      ];

      return points;
    }

    function _normalizePathV2Points(points) {
      let {mX,mY} = points.reduce((m,pt)=>({
        mX: Math.min(pt[0],m.mX),
        mY: Math.min(pt[1],m.mY)
      }),{mX:Infinity,mY:Infinity});
      return points.map(pt=>[ pt[0]-mX, pt[1]-mY]);
    }

    /**
     * Converts a path into a list of line segments.
     * This supports freehand paths, but not elliptical paths.
     * @param {(Roll20Path|Roll20Path[])} path
     * @return {Segment[]}
     */
    function toSegments(path) {
        if(_.isArray(path))
            return _toSegmentsMany(path);

        let _path;
        try {
          let page = getObj('page', path.get('_pageid'));
          let pageWidth = page.get('width') * UNIT_SIZE_PX;
          let pageHeight = page.get('height') * UNIT_SIZE_PX;

          if("path" === path.get('type')){
            let rawPath = path.get('_path')
              .replace(/mapWidth/g, pageWidth)
              .replace(/mapHeight/g, pageHeight);
            _path = JSON.parse(rawPath);
          } else {
            // pathv2
            _path = JSON.parse(path.get('points'));
          }
        }
        catch (err) {
          log(`Error parsing Roll20 path JSON: ${path.get('_path')}`);
          sendChat('Path Math', '/w gm An error was encountered while trying to parse the JSON for a path. See the API Console Log for details.');
          return [];
        }

        let transformInfo = getTransformInfo(path);

        let segments = [];

        if("path" === path.get('type')){

          let prevPt;
          let prevType;

          _.each(_path, tuple => {
              let type = tuple[0];

              // Convert the previous point and tuple into segments.
              let newSegs = [];

              // Cubic Bezier
              if(type === 'C') {
                newSegs = _toSegmentsC(prevPt, tuple, transformInfo);
                if(newSegs.length > 0)
                  prevPt = newSegs[newSegs.length - 1][1];
              }

              // Line or two successive Moves. A curious quirk of the latter
              // case is that UDL treats them as segments for windows.
              // Thanks to Scott C and Aaron for letting me know about this,
              // whether it's an intended feature or not.
              if(type === 'L' || (type === 'M' && prevType === 'M')) {
                newSegs = _toSegmentsL(prevPt, tuple, transformInfo);
                if(newSegs.length > 0)
                  prevPt = newSegs[0][1];
              }

              // Move, not preceded by another move (not a UDL window)
              if(type === 'M' && prevType !== 'M') {
                prevPt = tupleToPoint(tuple, transformInfo);
              }

              // Freehand (tiny Quadratic Bezier)
              if(type === 'Q') {
                newSegs = _toSegmentsQ(prevPt, tuple, transformInfo);
                if(newSegs.length > 0)
                  prevPt = newSegs[0][1];
              }

              _.each(newSegs, s => {
                segments.push(s);
              });
              prevType = type;
          });
        } else {
          _path = _normalizePathV2Points(_path);
          // pathv2
          switch(path.get('shape')){
            case 'rec': {
                let p1 = tupleToPoint(['L',_path[0][0],_path[0][1]],transformInfo);
                let p2 = tupleToPoint(['L',_path[1][0],_path[1][1]],transformInfo);
                let x1 = Math.min(p1[0],p2[0]);
                let x2 = Math.max(p1[0],p2[0]);
                let y1 = Math.min(p1[1],p2[1]);
                let y2 = Math.max(p1[1],p2[1]);
                // for rec, there are only two points and you construct the other two.
                segments = [
                  [[x1,y1,1],[x1,y2,1]],
                  [[x1,y2,1],[x2,y2,1]],
                  [[x2,y2,1],[x2,y1,1]],
                  [[x2,y1,1],[x1,y1,1]]
                ];
              }
              break;
            case 'eli': {
                // approximate the segments of a circle
                let p1 = tupleToPoint(['L',_path[0][0],_path[0][1]],transformInfo);
                let p2 = tupleToPoint(['L',_path[1][0],_path[1][1]],transformInfo);
                let x1 = Math.min(p1[0],p2[0]);
                let x2 = Math.max(p1[0],p2[0]);
                let y1 = Math.min(p1[1],p2[1]);
                let y2 = Math.max(p1[1],p2[1]);

                let points = _circlePointsFromCorners([x1,y1],[x2,y2]);

                segments = points.reduce((m,p,i,a)=>
                  i
                  ? [...m,[ [...a[i-1],1],[...p,1]]]
                  : [...m,[ [...a[a.length-1],1],[...p,1]]]
                ,[]);
              }
              break;
            case 'pol': 
              segments = _path.reduce((m,p,i,a)=>
                i
                ? [...m,[ tupleToPoint(['L',...a[i-1]],transformInfo),tupleToPoint(['L',...p],transformInfo)]]
                : m
              ,[]);

              break;
            case 'free': 
              // fake it as a poly line for now...
              segments = _path.reduce((m,p,i,a)=>
                i
                ? [...m,[ tupleToPoint(['L',...a[i-1]],transformInfo),tupleToPoint(['L',...p],transformInfo)]]
                : m
              ,[]);

              break;
          }

        }

        return _.compact(segments);
    }

    /**
     * Converts a 'C' type path point to a list of segments approximating the
     * curve.
     * @private
     * @param {vec3} prevPt
     * @param {PathTuple} tuple
     * @param {PathTransformInfo} transformInfo
     * @return {Segment[]}
     */
    function _toSegmentsC(prevPt, tuple, transformInfo) {
      let cPt1 = tupleToPoint(['L', tuple[1], tuple[2]], transformInfo);
      let cPt2 = tupleToPoint(['L', tuple[3], tuple[4]], transformInfo);
      let pt = tupleToPoint(['L', tuple[5], tuple[6]], transformInfo);
      let points = [prevPt, cPt1, cPt2, pt];

      // Choose the number of segments based on the rough approximate arc length.
      // Each segment should be <= 10 pixels.
      let approxArcLength = VecMath.dist(prevPt, cPt1) + VecMath.dist(cPt1, cPt2) + VecMath.dist(cPt2, pt);
      let numSegs = Math.max(Math.ceil(approxArcLength/10), 1);

      let bezierPts = [prevPt];
      _.each(_.range(1, numSegs), i => {
        let scalar = i/numSegs;
        let bPt = getBezierPoint(points, scalar);
        bezierPts.push(bPt);
      });
      bezierPts.push(pt);

      return _.chain(bezierPts)
      .map((cur, i) => {
        if(i === 0)
          return undefined;

        let prev = bezierPts[i-1];
        return [prev, cur];
      })
      .compact()
      .value();
    }

    /**
     * Converts an 'L' type path point to a segment.
     * @private
     * @param {vec3} prevPt
     * @param {PathTuple} tuple
     * @param {PathTransformInfo} transformInfo
     * @return {Segment[]}
     */
    function _toSegmentsL(prevPt, tuple, transformInfo) {
      // Transform the point to 2D homogeneous map coordinates.
      let pt = tupleToPoint(tuple, transformInfo);
      let segments = [];
      if(!(prevPt[0] == pt[0] && prevPt[1] == pt[1]))
        segments.push([prevPt, pt]);
      return segments;
    }

    /**
     * Converts a 'Q' type path point to a segment approximating
     * the freehand curve.
     * @private
     * @param {vec3} prevPt
     * @param {PathTuple} tuple
     * @param {PathTransformInfo} transformInfo
     * @return {Segment[]}
     */
    function _toSegmentsQ(prevPt, tuple, transformInfo) {
      // Freehand Bezier paths are very small, so let's just
      // ignore the control point for it entirely.
      tuple[1] = tuple[3];
      tuple[2] = tuple[4];

      // Transform the point to 2D homogeneous map coordinates.
      let pt = tupleToPoint(tuple, transformInfo);

      let segments = [];
      if(!(prevPt[0] == pt[0] && prevPt[1] == pt[1]))
        segments.push([prevPt, pt]);
      return segments;
    }

    /**
     * Converts several paths into a single list of segments.
     * @private
     * @param  {Roll20Path[]} paths
     * @return {Segment[]}
     */
    function _toSegmentsMany(paths) {
      return _.chain(paths)
        .reduce(function(allSegments, path) {
            return allSegments.concat(toSegments(path));
        }, [])
        .value();
    }

    /**
     * Transforms a tuple for a point in a path into a point in
     * homogeneous 2D map coordinates.
     * @param  {PathTuple} tuple
     * @param  {PathTransformInfo} transformInfo
     * @return {Vector}
     */
    function tupleToPoint(tuple, transformInfo) {
      let width = transformInfo.width;
      let height = transformInfo.height;
      let scaleX = transformInfo.scaleX;
      let scaleY = transformInfo.scaleY;
      let angle = transformInfo.angle;
      let cx = transformInfo.cx;
      let cy = transformInfo.cy;

      // The point in path coordinates, relative to the path center.
      let x = tuple[1] - width/2;
      let y = tuple[2] - height/2;
      let pt = [x,y,1];

      // The transform of the point from path coordinates to map
      // coordinates.
      let scale = MatrixMath.scale([scaleX, scaleY]);
      let rotate = MatrixMath.rotate(angle);
      let transform = MatrixMath.translate([cx, cy]);
      transform = MatrixMath.multiply(transform, rotate);
      transform = MatrixMath.multiply(transform, scale);

      return MatrixMath.multiply(transform, pt);
    }

    on('chat:message', function(msg) {
      if(msg.type === 'api' && msg.content.indexOf('!pathInfo') === 0) {
        log('!pathInfo');

        try {
          let path = findObjs({
            _type: 'path',
            _id: msg.selected[0]._id
          })[0];
          log(path);
          log(path.get('_path'));

          let segments = toSegments(path);
          log('Segments: ');
          log(segments);

          let pathData = segmentsToPath(segments);
          log('New path data: ');
          log(pathData);

          let curPage = path.get('_pageid');
          _.extend(pathData, {
            stroke: '#ff0000',
            _pageid: curPage,
            layer: path.get('layer')
          });

          let newPath = createObj('path', pathData);
          log(newPath);
        }
        catch(err) {
          log('!pathInfo ERROR: ');
          log(err.message);
        }
      }
      if (msg.type === 'api' && msg.content.startsWith('!pathToUDLWindow')) {
        try {
          let path = findObjs({
            _type: 'path',
            _id: msg.selected[0]._id
          })[0];
          pathToUDLWindow(path);
        }
        catch(err) {
          log('!pathInfo ERROR: ');
          log(err.message);
        }
      }
    });

    return {
        BoundingBox,
        Circle,
        Path,
        Polygon,
        Triangle,

        createCircleData,
        distanceToPoint,
        getBezierPoint,
        getBoundingBox,
        getCenter,
        getTransformInfo,
        mergePathStr,
        normalizePath,
        pathToUDLWindow,
        raycast,
        segmentIntersection,
        segmentsToPath,
        toSegments,
        tupleToPoint
    };
})();

{try{throw new Error('');}catch(e){API_Meta.PathMath.lineCount=(parseInt(e.stack.split(/\n/)[1].replace(/^.*:(\d+):.*$/,'$1'),10)-API_Meta.PathMath.offset);}}




//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//       VECTORMATH
//@@@@@@@@@@@@@@@@@@@@@@@@@@@


/**
 * This is a small library for (mostly 2D) vector mathematics.
 * Internally, the vectors used by this library are simple arrays of numbers.
 * The functions provided by this library do not alter the input vectors, 
 * treating each vector as an immutable object.
 */
var VecMath = (function() {
    
    /**
     * Adds two vectors.
     * @param {vec} a
     * @param {vec} b
     * @return {vec}
     */
    var add = function(a, b) {
        var result = [];
        for(var i=0; i<a.length; i++) {
            result[i] = a[i] + b[i];
        }
        return result;
    };
    
    
    /**
     * Creates a cloned copy of a vector.
     * @param {vec} v
     * @return {vec}
     */
    var clone = function(v) {
        var result = [];
        for(var i=0; i < v.length; i++) {
            result.push(v[i]);
        }
        return result;
    };
    
    
    /** 
     * Returns an array representing the cross product of two 3D vectors. 
     * @param {vec3} a
     * @param {vec3} b
     * @return {vec3}
     */
    var cross = function(a, b) {
        var x = a[1]*b[2] - a[2]*b[1];
        var y = a[2]*b[0] - a[0]*b[2];
        var z = a[0]*b[1] - a[1]*b[0];
        return [x, y, z];
    };
    
    
    /** 
     * Returns the degree of a vector - the number of dimensions it has.
     * @param {vec} vector
     * @return {int}
     */
    var degree = function(vector) {
        return vector.length;
    };
    
    
    /**
     * Computes the distance between two points.
     * @param {vec} pt1
     * @param {vec} pt2
     * @return {number}
     */
    var dist = function(pt1, pt2) {
        var v = vec(pt1, pt2);
        return length(v);
    };
    
    
    /** 
     * Returns the dot product of two vectors. 
     * @param {vec} a
     * @param {vec} b
     * @return {number}
     */
    var dot = function(a, b) {
        var result = 0;
        for(var i = 0; i < a.length; i++) {
            result += a[i]*b[i];
        }
        return result;
    };
    
    
    /**
     * Tests if two vectors are equal.
     * @param {vec} a
     * @param {vec} b
     * @param {float} [tolerance] A tolerance threshold for comparing vector 
     *                            components.  
     * @return {boolean} true iff the each of the vectors' corresponding 
     *                  components are equal.
     */
    var equal = function(a, b, tolerance) {
        if(a.length != b.length)
            return false;
        
        for(var i=0; i<a.length; i++) {
            if(tolerance !== undefined) {
                if(Math.abs(a[i] - b[i]) > tolerance) {
                    return false;
                }
            }
            else if(a[i] != b[i])
                return false;
        }
        return true;
    };
    
    
    
    /** 
     * Returns the length of a vector. 
     * @param {vec} vector
     * @return {number}
     */
    var length = function(vector) {
        var length = 0;
        for(var i=0; i < vector.length; i++) {
            length += vector[i]*vector[i];
        }
        return Math.sqrt(length);
    };
    
    
    
    /**
     * Computes the normalization of a vector - its unit vector.
     * @param {vec} v
     * @return {vec}
     */
    var normalize = function(v) {
        var vHat = [];
        
        var vLength = length(v);
        for(var i=0; i < v.length; i++) {
            vHat[i] = v[i]/vLength;
        }
        
        return vHat;
    };
    
    
    /**
     * Computes the projection of vector b onto vector a.
     * @param {vec} a
     * @param {vec} b
     * @return {vec}
     */
    var projection = function(a, b) {
        var scalar = scalarProjection(a, b);
        var aHat = normalize(a);
        
        return scale(aHat, scalar);
    };
    
    
    /** 
     * Computes the distance from a point to an infinitely stretching line. 
     * Works for either 2D or 3D points.
     * @param {vec2 || vec3} pt
     * @param {vec2 || vec3} linePt1   A point on the line.
     * @param {vec2 || vec3} linePt2   Another point on the line.
     * @return {number}
     */
    var ptLineDist = function(pt, linePt1, linePt2) {
        var a = vec(linePt1, linePt2);
        var b = vec(linePt1, pt);
        
        // Make 2D vectors 3D to compute the cross product.
        if(!a[2])
            a[2] = 0;
        if(!b[2])
            b[2] = 0;
        
        var aHat = normalize(a);
        var aHatCrossB = cross(aHat, b);
        return length(aHatCrossB);
    };
    
    
    /** 
     * Computes the distance from a point to a line segment. 
     * Works for either 2D or 3D points.
     * @param {vec2 || vec3} pt
     * @param {vec2 || vec3} linePt1   The start point of the segment.
     * @param {vec2 || vec3} linePt2   The end point of the segment.
     * @return {number}
     */
    var ptSegDist = function(pt, linePt1, linePt2) {
        var a = vec(linePt1, linePt2);
        var b = vec(linePt1, pt);
        var aDotb = dot(a,b);
        
        // Is pt behind linePt1?
        if(aDotb < 0) {
            return length(vec(pt, linePt1));
        }
        
        // Is pt after linePt2?
        else if(aDotb > dot(a,a)) {
            return length(vec(pt, linePt2));
        }
        
        // Pt must be between linePt1 and linePt2.
        else {
            return ptLineDist(pt, linePt1, linePt2);
        }
    };
    
    
    /**
     * Computes the scalar projection of b onto a.
     * @param {vec2} a
     * @param {vec2} b
     * @return {vec2}
     */
    var scalarProjection = function(a, b) {
        var aDotB = dot(a, b);
        var aLength = length(a);
        
        return aDotB/aLength;
    };
    
    
    
    /**
     * Computes a scaled vector.
     * @param {vec2} v
     * @param {number} scalar
     * @return {vec2}
     */
    var scale = function(v, scalar) {
        var result = [];
        
        for(var i=0; i<v.length; i++) {
            result[i] = v[i]*scalar;
        }
        return result;
    };
    
    
    /** 
     * Computes the difference of two vectors.
     * @param {vec} a
     * @param {vec} b
     * @return {vec}
     */
    var sub = function(a, b) {
        var result = [];
        for(var i=0; i<a.length; i++) {
            result.push(a[i] - b[i]);
        }
        return result;
    };
    
    
    /** 
     * Returns the vector from pt1 to pt2. 
     * @param {vec} pt1
     * @param {vec} pt2
     * @return {vec}
     */
    var vec = function(pt1, pt2) {
        var result = [];
        for(var i=0; i<pt1.length; i++) {
            result.push( pt2[i] - pt1[i] );
        }
        
        return result;
    };
    
    
    // The exposed API.
    return {
        add: add,
        clone: clone,
        cross: cross,
        degree: degree,
        dist: dist,
        dot: dot,
        equal: equal,
        length: length,
        normalize: normalize,
        projection: projection,
        ptLineDist: ptLineDist,
        ptSegDist: ptSegDist,
        scalarProjection: scalarProjection,
        scale: scale,
        sub: sub,
        vec: vec
    };
})();


// Perform unit tests. Inform us in the log if any test fails. Otherwise,
// succeed silently.
(function() {
    /**
     * Does a unit test. If the test evaluates to false, then it displays with
     * a message that the unit test failed. Otherwise it passes silently.
     * @param {boolean} test    Some expression to test.
     * @param {string} failMsg  A message displayed if the test fails.
     */
    var assert = function(test, failMsg) {
        if(!test) {
            log("UNIT TEST FAILED: " + failMsg);
        }
    };
    
    
    var a = [1, 5];
    var b = [17, -8];
    
    
    // VecMath.equal
    assert(
        VecMath.equal([2, -3, 4, 8], [2, -3, 4, 8]),
        "VecMath.equal([2, -3, 4, 8], [2, -3, 4, 8])"
    );
    assert(
        !VecMath.equal([1, 3, 5], [-2, 4, -6]),
        "!VecMath.equal([1, 3, 5], [-2, 4, -6])"
    );
    assert(
        !VecMath.equal([1, 3, 5], [1, 3, 4]),
        "!VecMath.equal([1, 3, 5], [1, 3, 4])"
    );
    assert(
        !VecMath.equal([1,2,3], [1,2]),
        "!VecMath.equal([1,2,3], [1,2])"
    );
    assert(
        !VecMath.equal([1,2], [1,2,3]),
        "!VecMath.equal([1,2], [1,2,3])"
    );
    
    // VecMath.add
    assert(
        VecMath.equal(
            VecMath.add([1, 2, 3], [3, -5, 10]),
            [4, -3, 13]
        ),
        "VecMath.add([1, 2, 3], [3, -5, 10]) equals [4, -3, 13]"
    );
    assert(
        VecMath.equal(
            VecMath.add([0, 0, 0], [1, 2, 3]),
            [1, 2, 3]
        ),
        "VecMath.add([0, 0, 0], [1, 2, 3]) equals [1, 2, 3]"
    );
    
    // VecMath.clone
    assert(
        VecMath.equal( VecMath.clone(a), a),
        "VecMath.equal( VecMath.clone(a), a)"
    );
    assert(
        VecMath.clone(a) != a,
        "VecMath.clone(a) != a"
    );
    
    // VecMath.cross
    assert(
        VecMath.equal(
            VecMath.cross([1, 0, 0], [0, 1, 0]),
            [0, 0, 1]
        ),
        "VecMath.cross([1, 0, 0], [0, 1, 0]) equals [0, 0, 1]"
    );
    assert(
        VecMath.equal(
            VecMath.cross([1,2,3], [-10, 3, 5]),
            [1, -35, 23]
        ),
        "VecMath.cross([1,2,3], [-10, 3, 5]) equals [1, -35, 23]"
    );
    
    // VecMath.degree
    assert(
        VecMath.degree([1,2,3]) == 3,
        "VecMath.degree([1,2,3]) == 3"
    );
    assert(
        VecMath.degree([1]) == 1,
        "VecMath.degree([1]) == 1"
    );
    assert(
        VecMath.degree([1,1,1,1,1]) == 5,
        "VecMath.degree([1,1,1,1,1]) == 5"
    );
    
    // VecMath.dist
    assert(
        VecMath.dist([1,2], [4,6]) == 5,
        "VecMath.dist([1,2], [4,6]) == 5"
    );
    assert(
        VecMath.dist([3,4], [-3, -4]) == 10,
        "VecMath.dist([3,4], [-3, -4]) == 10"
    );
    
    // VecMath.dot
    assert(
        VecMath.dot([1, 2, 3], [-1, -2, -3]) == -14,
        "VecMath.dot([1, 2, 3], [-1, -2, -3]) == -14"
    );
    assert(
        VecMath.dot([1,0], [0,1]) == 0,
        "VecMath.dot([1,0], [0,1]) == 0"
    );
    assert(
        VecMath.dot([1,0], [0,-1]) == 0,
        "VecMath.dot([1,0], [0,-1]) == 0"
    );
    assert(
        VecMath.dot([1,0], [-1, 0]) == -1,
        "VecMath.dot([1,0], [-1, 0]) == -1"
    );
    assert(
        VecMath.dot([1,0], [1, 0]) == 1,
        "VecMath.dot([1,0], [1, 0]) == 1"
    );
    
    // VecMath.length
    assert(
        VecMath.length([1,0,0]) == 1,
        "VecMath.length([1,0,0]) == 1"
    );
    assert(
        VecMath.length([3,4]) == 5,
        "VecMath.length([3,4]) == 5"
    );
    assert(
        VecMath.length([-3, 0, 4, 0]) == 5,
        "VecMath.length([-3, 0, 4, 0]) == 5"
    );
    
    // VecMath.normalize
    assert(
        VecMath.equal(
            VecMath.normalize([3,0]),
            [1, 0]
        ),
        "VecMath.normalize([3,0]) equals [1,0]"
    );
    assert(
        VecMath.equal(
            VecMath.normalize([0,-3]),
            [0, -1]
        ),
        "VecMath.normalize([0,-3]) equals [0,-1]"
    );
    
    // VecMath.projection
    assert(
        VecMath.equal(
            VecMath.projection([5,0], [3, 4]),
            [3, 0]
        ),
        "VecMath.projection([5,0], [3, 4]) equals [3, 0]"
    );
    assert(
        VecMath.equal(
            VecMath.projection([5,5], [0, 6]),
            [3, 3],
            0.001
        ),
        "VecMath.projection([5,5], [0, 6]) equals [3, 3]"
    );
    
    // VecMath.ptLineDist
    assert(
        VecMath.ptLineDist([0,3], [-100,5], [100,5]) == 2,
        "VecMath.ptLineDist([0,3], [-100,5], [100,5]) == 2"
    );
    assert(
        VecMath.ptLineDist([3,0], [5,5], [5,10]) == 2,
        "VecMath.ptLineDist([3,0], [5,5], [5,10]) == 2"
    );
    
    // VecMath.ptSegDist
    assert(
        VecMath.ptSegDist([0,3], [-5,5], [5,5]) == 2,
        "VecMath.ptSegDist([0,3], [-5,5], [5,5]) == 2"
    );
    assert(
        VecMath.ptSegDist([3,0], [5,-5], [5,5]) == 2,
        "VecMath.ptSegDist([3,0], [5,-5], [5,5]) == 2"
    );
    assert(
        VecMath.ptSegDist([3,4], [-5,0], [0,0]) == 5,
        "VecMath.ptSegDist([3,4], [-5,0], [0,0]) == 5"
    );
    assert(
        VecMath.ptSegDist([-2,-4], [1,0], [5,0]) == 5,
        "VecMath.ptSegDist([-2,-4], [1,0], [5,0]) == 5"
    );
    
    // VecMath.scalarProjection
    assert(
        VecMath.scalarProjection([5,0], [3, 4]) == 3,
        "VecMath.scalarProjection([5,0], [3, 4]) == 3"
    );
    
    // VecMath.scale
    assert(
        VecMath.equal(
            VecMath.scale([1,-2,3], 6),
            [6, -12, 18]
        ),
        "VecMath.scale([1,-2,3], 6) equals [6, -12, 18]"
    );
    
    // VecMath.sub
    assert(
        VecMath.equal(
            VecMath.sub([10, 8, 6], [-4, 6, 1]),
            [14, 2, 5]
        ),
        "VecMath.sub([10, 8, 6], [-4, 6, 1]) equals [14, 2, 5]"
    );
    
    // VecMath.vec
    assert(
        VecMath.equal(
            VecMath.vec([1,1], [3,4]),
            [2,3]
        ),
        "VecMath.vec([1,1], [3,4]) equals [2,3]"
    );
})();
