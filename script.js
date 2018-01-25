/*      Retrieving urls
var urls = [], lengths = [];
var m, start, end;
document.querySelector("#dg_c > div:nth-child(1) > div:nth-child(2)").remove();
for(i = 1; i<= 2; i++) {
    for(j = 1; j <= document.querySelector("#dg_c > div:nth-child(1) > div:nth-child(" + i + ")").childElementCount; j++) {
        m = document.querySelector("#dg_c > div:nth-child(1) > div:nth-child(" + i + ") > div:nth-child(" + j + ") > div > a").getAttribute("m")
        start = m.search("imgurl:") + 8;
        end = m.search("tid:") - 2;
        urls.push(m.slice(start, end));
    };
};
urls;
*/

//Google url retrieval
/*
(function(console){

    console.save = function(data, filename){

        if(!data) {
            console.error('Console.save: No data')
            return;
        }

        if(!filename) filename = document.querySelector("#lst-ib").innerHTML + ".txt";

        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], {type: 'plain/text'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['plain/text', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
})(console)
var urls = [];
for (var i = 0; i < document.querySelectorAll(".rgsh").length; i++) {
    document.querySelector(".rgsh").remove();
}
for (var i = 1; i <= document.querySelector("#rg_s").childElementCount; i++) {
    if (document.querySelector("#rg_s > div:nth-child(" + i + ")") && document.querySelector("#rg_s > div:nth-child(" + i + ")").getAttribute("class") == "rg_di rg_bx rg_el ivg-i") {
        var text = document.querySelector("#rg_s > div:nth-child(" + i + ") > div").innerHTML;
        var start = text.search("\"ou\":") + 6;
        var end = text.search("\"ow\"") - 2;
        urls.push(text.slice(start, end));
    } else {
    }
}
console.save(urls);
*/



///////starting stuff
/////////////////////////////
$(document).ready(function() {
    $("#img").on("load", function() {
        width = $("#img").width();
        height = $("#img").height();
        $(window).trigger("resize");
        $("#loading").hide();
        $("#img").show();
    });
    input = document.getElementById("input");
    document.querySelector("body").onkeydown = function(e) {
        //e.preventDefault(); $("#response").html(e.key);
        switch (e.key) {
            case "Enter":
                e.preventDefault();
                submit();
                break;
            case "Tab":
                e.preventDefault();
                autocomplete();
                break;
            case "[":
                e.preventDefault();
                another();
                break;
            case "]":
                e.preventDefault();
                answer();
                break;
            case "{":
                e.preventDefault();
                back();
                break;
            case "}":
                e.preventDefault();
                next();
                break;
        }
    }
});



/////////read files
/////////////////////////////
//define main variables that will be used
var items = [];
var images = [];

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
    $("#response").html("");
    items = [];
    images = [];
    hist = [];
    index = 0;
    var goodItems = false;
    var goodImages = false;
	var itemsFile = findFile(files, "items.txt");
	var imagesFile = findFile(files, "images.txt");
	if (itemsFile && imagesFile) {
		var itemsReader = new FileReader();
		var imagesReader = new FileReader();
		itemsReader.onload = function(e) {
            try {
                items = JSON.parse(e.target.result);
            } catch(err) {
                $("#response").html(err);
                return;
            }
            goodItems = true;
            checkFiles(goodItems, goodImages);
		}
		imagesReader.onload = function(e) {
            try {
			images = JSON.parse(e.target.result);
            } catch(err) {
                $("#response").html(err);
                return;
            }
            goodImages = true;
            checkFiles(goodItems, goodImages);
		}
		itemsReader.readAsText(itemsFile);
		imagesReader.readAsText(imagesFile);
	}
}

function checkFiles(goodItems, goodImages) {
    var re_weburl = new RegExp(
        // from https://gist.github.com/dperini/729294
        "^" +
        // protocol identifier
        "(?:(?:https?|ftp)://)" +
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:" +
        // IP address exclusion
        // private & local networks
        "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
        "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
        "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broacast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
        // host name
        "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
        // domain name
        "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
        // TLD identifier
        "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
        // TLD may end with dot
        "\\.?" +
        ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:[/?#]\\S*)?" +
        "$", "i"
    );
    var goodFiles = true;
    if (!(goodItems && goodImages)) {
        goodFiles = false;
    } else {
        if (items.constructor !== Array) {
            console.log("\"items.txt\" isn't an array");
            goodFiles = false;
        }
        if (images.constructor !== Array) {
            console.log("\"images.txt\" isn't an array");
            goodFiles = false;
        }
        if (images.constructor && items.constructor === Array) {
            if (items.length <= 0) {
                console.log("\"items.txt\" is too short");
                goodFiles = false;
            }
            if (images.length <= 0) {
                console.log("\"images.txt\" is too short");
                goodFiles = false;
            }
            if (items.length !== images.length) {
                console.log("\"items.txt\" and \"images.txt\" are different lengths");
                goodFiles = false;
            }
            if (!(function(){
                for (var l = 0; l < items.length; l++) {
                    if (typeof items[l] !== "string"){
                        return false;
                    }
                }
                return true;
            })()) {
                console.log("\"items.txt\" contains a non-string");
                goodFiles = false;
            }
            if (!(function(){
                for (var l = 0; l < images.length; l++) {
                    if (images[l].constructor !== Array) {
                        return false;
                    }
                }
                return true;
            })()) {
                console.log("\"images.txt\" contains a non-array");
                goodFiles = false;
            } else {
                if (!(function() {
                    for (var l = 0; l < images.length; l++) {
                        if (images[l].length <= 0) {
                            return false;
                        }
                    }
                    return true;
                })()) {
                    console.log("At least one of the arrays in \"images.txt\" is too short");
                    goodFiles = false;
                }
                if (!(function(){
                    for (var l = 0; l < images.length; l++) {
                        for (var m = 0; m < images[l].length; m++) {
                            if (typeof images[l][m] !== "string") {
                                return false;
                            }
                        }
                    }
                    return true;
                })()) {
                    console.log("At least one of the arrays in \"images.txt\" contains a non-string");
                    goodFiles = false;
                } else {
                    if (!(function(){
                        for (var l = 0; l < images.length; l++) {
                            for (var m = 0; m < images[l].length; m++) {
                                if (!(images[l][m].match(re_weburl))) {
                                    console.log(images[l][m]);
                                    console.log(l + ", " + m);
                                    return false;
                                }
                            }
                        }
                        return true;
                    })()) {
                        console.log("At least one of the urls in \"images.txt\" is an invalid url");
                        goodFiles = false;
                    }
                }
            }
        }
    }
    
    if (goodFiles) {
        $("#submitFiles").prop("disabled", false);
        range = [0, items.length];
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: items.length - 1,
            values: [0, items.length],
            slide: function(event, ui) {
                $("#response").html("Indices " + ui.values[0] + " - " + ui.values[1]);
                range = ui.values;
            }
        });
    } else {
        $("#submitFiles").prop("disabled", true);
    }
}

//hides file selector, shows main bar and loads an image
//called by the first submit button in files
function submitFiles() {
	$("#files").hide();
    $("#directory").hide();
	$("#main").css({"display": "inline-block"});
    $("#container").css({"display": "block"});
    loadImage();
}



///////////buttons
/////////////////////////////

//define variables
var i = 0;                      //index of item and hence set of urls in images
var j = 0;                      //index of url in images
var width = 0;                  //width of original image loaded before scaling
var height = 0;                 //height of original image loaded before scaling
var hist = [];                  //history array with i, j, and input value for each question
var index = 0;                  //index of history that user is at
var correct = false;            //value of whether user is correct or not
var range = [];                 //range of items and corresponding images to use

//loads new random image or image from history. sameI is true when i shouldn't be changed (item stays the same)
//called every time index changes and at init. sameI is true when New Image (another()) is pressed
function loadImage(sameI) {
    $("#input").val((index >= hist.length) ? "" : hist[index][2]);
    $("#response").html("")
    value = "";
    correct = false;
    
    $("#img").hide();
    
    $("#loading").show();
    
    $("#back").prop("disabled", ((index <= 0) ? true : false));
    
    //if the range was changed causing i to be outside of it
    if (i < range[0] || i > range[1]) {
        //you move to the end of the history and therefore create a fresh image
        index = hist.length;
    }
    
    if (index >= hist.length) {
        if (!sameI) {
            i = Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]);
        }
        j = Math.floor(Math.random() * images[i].length);
        
        hist.push([i, j, ""])
    } else {
        i = hist[index][0];
        j = hist[index][1];
    }
    
    $("#another").prop("disabled", ((index == hist.length - 1) ? false : true));
    
    $("#img").css({"transform": "scale(1)"});
    
    $("#img").attr("src", images[i][j]);
}



//executed when (submit is clicked || return is pressed in textbox)
function submit() {
    if (correct) {
        next();
    } else {
        checkAnswer();
    }
}

//
function checkAnswer() {
    if ($("#input").val().toLowerCase() == items[i].toLowerCase()) {
        $("#response").html("Correct!");
        correct = true;
        return true;
    } else {
        $("input").select();
        $("#response").html("Try again");
        return false;
    }
}

function another() {
    if (index == hist.length - 1) {
        index += 1;
        loadImage(true);
    }
}

function answer() {
    $("#input").val(items[i]);
}

function back() {
    hist[index][2] = $("#input").val();
    if (index > 0) {
        index -= 1;
        loadImage();
    }
}

function next() {
    hist[index][2] = $("#input").val();
    index += 1;
    loadImage();
}

function menu() {
    $("#main").hide();
    $("#container").hide();
    $("#files").css({"display": "inline-block"});
    $("#directory").css({"display": "block"});
}


var input;
var ac = [];
var acIndex = 0;
var value = "";
function autocomplete() {
    input.value = input.value.slice(0, input.selectionStart);
    if (input.value !== value) {
        ac = [];
        acIndex = 0;
        value = input.value;
        for (var k = 0; k < items.length; k++) {
            if (items[k].match(new RegExp("^" + value, "i"))) {
                ac.push(items[k]);
            }
        }
    } else {
        acIndex = (acIndex + 1 < ac.length) ? acIndex + 1 : 0;
    }
    if (ac.length > 0) {
        input.value += ac[acIndex].slice(value.length);
        input.setSelectionRange(value.length, input.value.length);
    }
}



//image scaling
/////////////////////////////
$(window).resize(function() {
    var maxWidth = $("#container").width();
    var maxHeight = $("#container").height();
    var scale;
    
    if (width <= maxWidth && height <= maxHeight) {
        return;
    }
    
    scale = Math.min(maxWidth / width, maxHeight / height);
    $("#img").css({"transform": "scale(" + scale + ")"})
});