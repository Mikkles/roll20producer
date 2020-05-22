// Generate Keys v1.1
// Script by Nic Bradley, 1.1 changes by Mik Holmes.

// This script presumes that there is a text layer called 'label'. 
// You will want to set this layer up with the style of font you want. 
// If you need extra letters, append them to the letter array. 
// Leave the empty array entry to ensure that you get one 'clean' number

// To use, change the values indicated below, then save this file and run it through Photoshop.
// It will create multiple text layers; once completed, you can use Export Layers to Files to save all layers individually.

var doc = app.activeDocument;
var letterLayer = app.activeDocument.artLayers.getByName("label");
var letterArray = ["", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];         
//==========Change these values as needed==========
var maxNumber = 100; //How many numbers you'd like to include.
var maxLetters = 27; //How many letters you'd like to include. Put 0 for only a number.

for (var i = 1; i <= maxNumber; i++) {
    for (var j = 0; j < maxLetters; j++) {
		var newLayer = letterLayer.duplicate();
		newLayer.name = i + letterArray[j]
		
		//=======Uncomment out one of these.==========
		//newLayer.textItem.contents = i + letterArray[j];       //To output numbers and (if maxLetters is larger than 1) letters
        //newLayer.textItem.contents = letterArray[j];	         //For only letters
    }
}
