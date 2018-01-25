//hide the editBar as soon as page loads so the display style in stylesheet is retained
$(document).ready(function() {
	$("#editBar").hide();
});

//define main variables that will be used
var items, images;

//finds a file in files with fileName is its name property
//called inside readFiles, returns false if not found
function findFile(files, fileName) {
	for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
		if (files[fileIndex].name == fileName) {
			return files[fileIndex];
		}
	}
	$("#response").html("Missing \"" + fileName + "\"");
	return false;
}

//reads items.txt and images.txt files as JSON to figure out the array and set them to the items and images variables
//called by file input whenever it's changed
function readFiles(files) {
	var itemsFile = findFile(files, "items.txt");
	var imagesFile = findFile(files, "images.txt");
	if (itemsFile && imagesFile) {
		var itemsReader = new FileReader();
		var imagesReader = new FileReader();
		itemsReader.onload = function(e) {
			items = JSON.parse(e.target.result);
		}
		imagesReader.onload = function(e) {
			images = JSON.parse(e.target.result);
		}
		itemsReader.readAsText(itemsFile);
		imagesReader.readAsText(imagesFile);
		$("#submit").prop("disabled", false);
	}
}





//index of which item and therefore set of image urls inside images you are on
var imageIndex = 0;

//changes ui and loads the first set of images
//called when submit button is pressed after uploading files
function submit() {
	$("#files").hide();
	$("#editBar").show();
	imageIndex = 0;
	$("#goToNumber").attr("max", images.length - 1);
	showImages();
}


//array of booleans representing which of the images is marked (true means marked)
var markedIndices = [];

//does some stuff then runs through urls creating an image for each that has appropriate eventhandlers
//called after imagesIndex is changed
function showImages() {
	//clear things
	$("#bottom").empty();
	$("#response").html("");
	
	//disabled back and next buttons when you can't go further in that direction
	if (imageIndex == 0) {
		$("#back").prop("disabled", true);
	} else {
		$("#back").prop("disabled", false);
	}
	if (imageIndex == images.length - 1) {
		$("#next").prop("disabled", true);
	} else {
		$("#next").prop("disabled", false);
	}
	
	//clear and fille markedIndices with falses
	markedIndices = new Array(images[imageIndex].length).fill(false);
	
	//list item on left
	$("#item").html(items[imageIndex]);
	
	//change goToNumber to imageIndex
	$("#goToNumber").val(imageIndex);
	
	//create all imgs in bottom
	for (var i = 0; i < images[imageIndex].length; i++) {
		$("#bottom").append("<img src=\"" + images[imageIndex][i] + "\">");
	}
	
	//attach events to every image
	$("img")
		//attach click event when loaded
		.on("load", function() {
			$(this).click(function() {
				$(this).toggleClass("marked");
				markedIndices[$(this).index()] = !markedIndices[$(this).index()];
				$("#response").html(markedIndices.reduce(function(n, v) {
					return n + v;
				}, 0) + " images marked");
				//$("#response").html("\"" + images[imageIndex][$(this).index()] + "\" (" + $(this).index() + ")");
				console.log("\"" + images[imageIndex][$(this).index()] + "\" (" + $(this).index() + ")");
			})
		})
		//mark and hide images that fail to load
		.on("error", function() {
			$(this).hide();
			markedIndices[$(this).index()] = true;
			$("#response").html(markedIndices.reduce(function(n, v) {
				return n + v;
			}, 0) + " images marked");
			//$("#response").html("Automatically marked \"" + images[imageIndex][$(this).index()] + "\" (" + $(this).index() + ")");
			console.log("Removed \"" + images[imageIndex][$(this).index()] + "\" (" + $(this).index() + ")");
		})
	;
}

//delete marked images
function deleteSelected() {
	var newImages = [];
	for (var i = 0; i < images[imageIndex].length; i++) {
		if (!markedIndices[i]) {
			newImages.push(images[imageIndex][i]);
		}
	}
	images[imageIndex] = newImages;
}

//back
function back() {
	deleteSelected();
	imageIndex -= 1;
	showImages();
}

//goTo
function goTo() {
	deleteSelected();
	imageIndex = parseInt($("#goToNumber").val());
	showImages();
}

//next
function next() {
	deleteSelected();
	imageIndex += 1;
	showImages();
}

//changeImgSize
function changeImgSize() {
	$("img").css({"height": $("#imgSize").val()});
}





//creates plaintext images array file and downloads it
//called when done button is pressed
function done() {
	deleteSelected();
	var data = "";
	data += "[%0A";
	for (var i = 0; i < images.length; i++) {
        for (var j = 0; j < images[i].length; j++) {
            images[i][j] = images[i][j].replace(/ /g, "%2520");
            images[i][j] = images[i][j].replace(/%20/g, "%2520");
        }
		data += "[%0A%09\"";
		data += images[i].join("\", %0A%09\"");
		data += "\"%0A]";
		if (i < images.length - 1) {
			data += ", %0A";
		}
	}
	data += "%0A]";
	$("#fileDL").attr("href", "data:," + data);
	$("#fileDL").get(0).click();
}