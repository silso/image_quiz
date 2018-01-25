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



/////////read files
/////////////////////////////
var itemages = {0: [], 1: []};
function readFiles(files) {
    console.log(files);
    
    var indices = [];
    for (var i = 0; i < files.length; i++) {
        if (files[i].name == "items.txt") {
            indices[0] = i;
        } else if (files[i].name == "images.txt") {
            indices[1] = i;
        }
    }
    console.log(indices);
    
    if (files.length == 2) {
        if (indices[0] !== -1 && indices[1] !== -1) {
            $("#response").html("Loading...");
            $.each(files, function(i, j) {
                var r = new FileReader();
                r.onload = function(e) {
                    itemages[i] = JSON.parse(e.target.result);
                    console.log(itemages);
                };
                r.readAsText(files[indices[i]]);
            });
            $("#response").html("Done!");
            $("#submit").prop("disabled", false);
        } else {
            $("#response").html("Need one \"items\" file and one \"images\" file.");
        }
    } else {
        $("#response").html("Two files please...");
    }
}



///////////buttons
/////////////////////////////

//define variables
var i, j, imageLoaded, correct, width, height;

//executed when (next button is pressed || textbox submitted after correct answer)
function next() {
    //make sure there isn't a textbox in the way
    $("#textArea").hide();
    
    //hide edit button
    $("#edit").hide();
    
    //hide img so you don't see the scaling
    $("#img").hide();
    
    //show the loading wheel
    $("#loading").show();
    
    //select item and image url respectively
    i = Math.floor(Math.random() * images.length);
    j = Math.floor(Math.random() * images[i].length);
    
    //start loading image into img
    $("#img").attr("src", images[i][j]);
    
    //reset things
    $("#response").html("");
    $("#input").val("");
    $("#img").css({"transform": "scale(1)"});
    
    //wait for img to load then resize it
    $("#img").one("load", function() {
        width = $("#img").width();
        height = $("#img").height();
        $(window).trigger("resize");
        $("#loading").hide();
        $("#img").show();
    });
    
    imageLoaded = true;
    correct = false;
}



//does actions when certain keys are pressed in the textbox
function searchKeyPress(e)
{
    //look for window.event in case event isn't passed in
    e = e || window.event;
    
    //uncomment if more keycode numbers are needed
    //$("#response").html(e.keyCode); return false;
    
    if (e.keyCode == 13) {                      //return: submit textbox
        submit();
        return false;
    } else if (e.keyCode == 43) {               //+: show url
        $("#response").html(images[i][j]);
        return false;
    } else if (e.keyCode == 61) {               //=: show answer
        answer();
        return false;
    } else if (e.keyCode == 45) {               //-: new image
        newImage();
        return false;
    } else if (e.keyCode == 95) {               //_: show list
        newList();
        return false;
    } else if (e.keyCode == 124) {              //|: remove url from list
        removeItem();
        return false;
    }
    return true;
}



//executed when (submit is clicked || return is pressed in textbox)
function submit() {
    if (correct) {
        next();
    } else {
        checkAnswer();
    }
    return false;
}



//
function checkAnswer() {
    if (imageLoaded) {
        if ($("#input").val().toLowerCase() == items[i].toLowerCase()) {
            $("#response").html("Correct!");
            correct = true;
        } else {
            $("input").select();
            $("#response").html("Try again");
        }
    } else {
        items = itemages[0];
        images = itemages[1];
        $("#files").hide();
        $("#inputForm").show();
        $(".myButton").prop("disabled", false);
        next();
    }
}

function newImage() {
    $("#response").html("BAM!")
    setTimeout(function() {
        $("#response").html("");
    }, 500);
    $("#img").hide();
    $("#loading").show();
    j = Math.floor(Math.random() * images[i].length);
    $("#img").attr("src", images[i][j]);
    $("#img").css({"transform": "scale(1)"});
    $("#img").one("load", function() {
        width = $("#img").width();
        height = $("#img").height();
        $(window).trigger("resize");
        $("#loading").hide();
        $("#img").show();
    });
}

function answer() {
    $("#input").val(items[i]);
}

function removeImage() {
    $("#response").html("Removed \"" + images[i][j] + "\"");
    images[i].splice(j, 1);
}

function removeItem() {
    $("#response").html("Removed \"" + items[i] + "\"")
    items.splice(i, 1);
    images.splice(i, 1);
}

function newList() {
    $("#textArea").show();
    $("#textArea").html(images);
}


//image scaling
/////////////////////////////
$(window).resize(function(evt) {
    var maxWidth = $("#container").width();
    var maxHeight = $("#container").height();
    var scale;
    
    if (width <= maxWidth && height <= maxHeight) {
        return;
    }
    
    scale = Math.min(maxWidth / width, maxHeight / height);
    $("#img").css({"transform": "scale(" + scale + ")"})
});