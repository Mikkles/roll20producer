# Prod Wizard
This script is a suite of tools to help with creation of modules in Roll20. A menu with all of the tools can be accessed by typing or copypasting `!prod menu` into the game's chat. Safety measures have been added to ensure these tools can't mess up the game too much!

- [Prod Wizard](#prod-wizard)
      - [Table of Contents](#table-of-contents)
  * [First Time Installation](#first-time-installation)
  * [How to Use](#how-to-use)
  * [Features](#features)
    + [Token Page Creator](#token-page-creator)
    + [Token Tools](#token-tools)
      - [Toggle Show Names](#toggle-show-names)
      - [Setup New Tokens](#setup-new-tokens)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


## First Time Installation
The creator of the game (probably Ashton!) needs to install some scripts into the API. You can be in the game in another tab safely.

**1.** The_Aaron's Config (from 1-click)
**2.** Token-Mod (from 1-click)
**3.** This script! Copy the raw text of this script into a new script and click Save Script.

Once they've finished compiling, go into the game and type/copypaste `!prod menu` and navigate to the Ashtonmancer. Click the "First Time Setup" button; this will configure Token-mod to our specifications.

## How to Use

Go to the APIs page and copy the raw text of this script into a New Script.
Then, in the Roll20 game, type `!prod menu` for the menu!

## Features

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
