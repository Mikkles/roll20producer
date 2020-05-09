# Prod Wizard

This script assists with some common tasks used for creating modules in Roll20! 
Many of the functions are expanded by use of the TokenMod script.

## How to Use

Go to the APIs page and copy the raw text of this script into a New Script.
Then, in the Roll20 game, type `!prod` and a command listed below.

## Commands
### Token Page Generator - `!prod tokenPage`
Using this command on a page will:
- Categorize tokens (such as Named NPCs; Creatures; Shapeshifters, etc)
- Sort tokens in categories alphabetically
- Space the tokens in a grid to the edge of the page, increasing the page's height if necessary.
- Indicate shapeshifters with asterisks
(Note, this will not title the categories; you'll have to do that yourself.)

**To use, drag all tokens onto a page titled "Token Page"**
As a safety feature, you MUST name the page Token Page, and the player flag must be on that page. 
Drag one instance of every token you'd like on the token page onto the page, placement doesn't matter.
Once all tokens are somewhere on the page, and (optionally) you've categorized them, copypaste the command `!prod tokenPage` in chat.
If you need to add/remove tokens later, simply delete them from the page and run the command again. If there are category titles, you may need to manually move those.

**To categorize tokens, add a colour status marker to each token of that category.**
Categories will sort by what colour marker is on a token, begining with tokens that have no markers, then tokens with red markers, blue markers, etc. 
- To set colors on multiple tokens at once, select all tokens you'd like to categorize and use `!token-mod --set statusmarkers|red` (or whatever colour you'd like).
- To remove a certain color from multiple tokens, select the tokens and use `token-mod --set statusmarkers|-red` (or whatever colour)
- To remove all markers from multiple tokens, select the tokens and use `token-mod --set statusmarkers|=dead|-dead`

**IMPORTANT NOTE**: This adds an additional step at the end of development. You will need to go to the token page, select all tokens (use ctrl+a), and use the remove all markers command above. It is suggested you do this near the end of development, in case last minute tokens are added/removed to the page, so as not to ruin categorization. If the script is run again without markers, they'll all be sorted into one category!
