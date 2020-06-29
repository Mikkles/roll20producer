# Prod Wizard
This script is a suite of tools to help with creation of modules in Roll20. A menu with all of the tools can be accessed by typing or copypasting **`!prod`** into the game's chat. Safety measures have been added to ensure these tools can't mess up the game too much!

## Installation to Game
For each game, the creator of the game (probably Ashton!) needs to install some scripts into the API. You can be in the game in another tab safely.

**1.** The_Aaron's Config (from 1-click)
**2.** Token-Mod (from 1-click)
**3.** This script! Copy the raw text of this script into a new script and click Save Script.

Once they've finished compiling, go into the game and type/copypaste `!prod` and navigate to the Ashtonmancer. 

Click the "First Time Setup" button; this will configure Token-mod to our specifications. The chat should output "The creation of Help Handouts is now OFF." If it says "ON" instead, click it once more. 

## How to Use
Once installed, simply type/copypaste `!prod` into chat!

## Features

### Autolinker
This function is always on while the script is installed. It enhances the `"[link]"` style links in bio/gmnotes of characters, and notes/gmnotes of handouts.
* `[something]` will link to a character/handout named Something, as normal functionality.
* `[something|words]` will display "words" on the handout, and link to the character/handout Something.
* `[5e:fireball]` will link to the 5e spell compendium for Fireball.
* `[5e:glyph of warding|glyph]` will display "glyph" and link to the 5e spell compendium for Glyph of Warding.

This allows us to skip our usual !handouts page. For the `[something|words]` style, if the script doesn't find a character/handout with the exact name, it will fail. However, for `[5e:...]` styles, it will always link, as there's no way to make sure the compendium actually has a spell. We must double check all these links to make sure they go to the correct spell.

For spells, we can use `5e:` or `PF2:` for their respective spell compendiums. More compendiums can be added into the script.

---
### Token Page Creator
This script will organize all the tokens on the Token Page, based on whatever categories we'd like. After dragging all of the tokens in the game onto the page, tagging them into categories (like Named NPCs, Mythic Monsters, NPC Spaceships, etc), you can click the button and the tokens will space themselves out, sorted alphabetically in each category, and arrange themself based on the width of the page. The script will automatically increase the height of the page to accomidate tokens, and will automatically add an asterisk next to any rollable tokens. If you make changes to the page (adding/removing/renaming tokens), you can run this script again to resort them. **Note!** This script will not create the titles of the categories, so you will need to go in and add/rearrange a text label for each category on the objects layer! 

To begin, all tokens in the game should be dragged onto a page titled "Token Page." They can be in any order, but you might want to roughly group them in piles based on categories so you can select each group easily.

**Categorizing Tokens**

1. Decide the order of each category and assign it a number. For example, you might decide Named NPCs are category 1, NPC Spaceships are category 3, and so on. Lower numbered categories will be sorted on top, and uncategorized tokens will be sorted at the bottom (as if in category 99).
2. Select all of the tokens you'd like to be put in a particular category, then click "Change Token Category." In the following prompt, enter the number of the category you'd like to tag them. Repeat this for each category.

If you want to change a token's category, simply select it and click the Change button again. If you'd like to see a list of each token that has been tagged and what category they're in, click "See Categories." 
If you'd like to remove ALL tokens from ALL categories, click "Reset Categories." Make sure this is what you want before doing this, as it can't be undone! 

**Running the Script**

Once you have finished categorizing the tokens, you can click "Run Token Page Creator." This should sort all of the tokens into the appropriate categories! If you change anything, you can click Run again to re-sort. 

When the script has moved everything, make sure to scroll through the page and double check everything for doubles, miscategorization, tokens that should be rollable but aren't, etc. If it looks good, then you can create text objects using Roll20's drawing tools to label the categories as normal, and add the typical "* means rollable" text.

---
### Token Tools
These are a suite of tools to help with token placement and setting up new tokens (such as for monsters that are custom to this game).

#### Toggle Show Names
This button will take all selected tokens and turn on/off 'Show nameplate,' for use when we have 4+ of the same creature on the field.  

#### Setup New Tokens
These buttons will help set tokens to our usual specifications, and update their respective character's default token. You must fill out each token's Represents Character before beginning this.

Select any new tokens you'd like to setup and click the button for the game's system. This will link their bars according to our specifications, including removing linking of bar1. **Note!** If you're making PC tokens, you'll have to manually turn bar1 BACK to HP!

Once this is done, with the tokens still selected, click 'Reassign' to have the characters update their default tokens. **Note!** If you change other aspects of the token, like its name, auras, light radius, etc, the 'Reassign' button will include those to the default token too!

---
### Map / Dynamic Lighting Tools
A suite of tools to help with setting up maps, and creating/testing Dynamic Lighting.
**For safety, with all of these tools, you must place the Player Bookmark on the page you're working on.**

#### Resize Map and Page
This tool allows you to quickly resize both the map image and the page size, based on the pixel dimensions of the map jpg. Primarily used right after uploading the map to Roll20. 

Upload the map jpg to the map layer, then select the map 'token' and hit Resize Map and Page.
You will be prompted to enter the pixel dimensions of the width and height of the page. Enter these, and the map should resize and center itself automatically.

#### Quick Change Page Settings
These are simple quick buttons to be used while setting up pages. Each button will change an element of the page or grid.

#### Create DL Buddy
This will create or delete a token for testing Dynamic Lighting. The token has a light radius of 100'. The script will remember if any buddies are active, and will output "Buddy still in game" on the main menu if any are still on, so we can check that we've deleted all of them.

---
### Art Handout Linker
This tool will go through all selected tokens and attempt to add a "Picture: Handout: (Name)" link to their bio page. 

When you run the tool, it will search for a handout titled exactly like the character that the token represents. It will check if the character's bio has the text "Picture:" in it. If the bio does not, then it will check if there is a handout titled "Handout: " plus the character's name. If it finds a handout, it will add "Picture: Handout: (name)" to the top of the bio.

Note that this searches for exact title matches, so creatures named something different will not automatically link. For example, Elite Cauthooj will not find Handout: Cauthooj. These will still need to be added manually.

---
### Ashtonmancer
A suite of tools to help the creator of the game get some basic tasks out of the way.

#### First Time Setup
When first installing this script, as well as Token-Mod and The Aaron Config, you will need to click this button once. An output saying "(From TheAaron): The creation of Help Handouts is now OFF." should appear. If it says "ON," simply click it again.

#### Handout Creation
These buttons will automatically create basic handout templates, typically for "Roll20 Information." Please note that the API has no access to the journal's folder structure, so the handouts will be created at base level, requiring you to drag them into a Roll20 Information folder.

Each handout is named based on what it contains. References to products or titles are replaced with "PRODUCT NAME" or similar.
* Thank You For Purchasing (Paizo) and (WoTC) will create a handout titled "Thank you for purchasing", requiring you to enter the product name automatically. These include the links to our Paizo and WotC marketplaces respectively.
* Buttons labeled (PF2) or (5e) have the variations based on those settings. 
* Credits will place the Roll20 Credits, with slots for copying in the product's official credits.
Unfortunately, these handout templates will need to manually updated in the script code when they change. Mik can handle that!
