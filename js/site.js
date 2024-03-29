// Cookie Management
// Add value to localstorage when cookie message is dismissed
function cookie_adcknowledge() {
    "use strict";
    localStorage.setItem("cookie_acknowledge", true);
}

// SHow cookie message if localstorage value is not present
$(document).ready(function () {
    "use strict";
    if (localStorage.getItem("cookie_acknowledge")) {
        $('#cookie_alert').addClass('hidden');
    }
});


// Universal news content loader
// Tab id and api request url are passed in
function loadNews(url, tab_number) {
    $.getJSON(url, function(data) {
        $items = data['response']['results'];

        // Add first news item to Jumbrotron box
        $("#j_button_"+ tab_number).attr("onclick", "loadModal(\""+ $items[0]['id'] +"\")");
        $("#j_title_"+ tab_number).append($items[0]['webTitle']);
        $("#jumbotron_"+ tab_number).css({"background":"linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255, 0.45)),url("+ $items[0]['fields']['thumbnail'] +") no-repeat","background-size":"100%"});

        //Add News Items
        var j=0;
        for (i=1; i<$items.length; i++) {
            // Create rown to hold items - provides better layout
            if (i%3 == 1) {
                j++;
                $('#holder_'+tab_number).append('<div class="row_contain" id="row_contain_'+ tab_number +'_'+ j +'"></div>');
            }

            // Build news item html
            var news_item = "";
            news_item += "\
                <div id=\""+ $items[i]['id'] +"\" class=\"col-xs-6 col-sm-4\">\
                    <div class=\"panel panel-default\">\
                        <div class=\"panel-body\">\
                            <img class=\"news_thumb\" src=\""+ $items[i]['fields']['thumbnail'] +"\">\
                        <div>\
                        <div class=\"panel-footer\">\
                            <h3>"+ $items[i]['webTitle'] +"</h3>\
                            <p>by "+ $items[i]['fields']['byline'] +"</p>\
                            <p>"+ $items[i]['webPublicationDate'].replace(/T|Z/g, ' ') +"</p>\
                            <button type=\"button\" class=\"btn btn-info btn-lg\" data-toggle=\"modal\" data-target=\"#news_item_modal\" onclick=\"loadModal('"+ $items[i]['id'] +"')\">Open</button>\
                        <div>\
                    </div>\
                </div>";
            // Append to row div
            $("#row_contain_"+ tab_number +"_"+j).append(news_item);

            if (checkRead($items[i]['id'])) {
                fade($items[i]['id']);
            }
        }
    });
}

// Load news data into the modal
function loadModal(id) {
    var url = buildUrl(id, "");
    $.getJSON(url, function(data) {
        $item = data['response']['content'];
        $("#modal_img").attr("src", $item['fields']['thumbnail']);
        $("#modal_title").html($item['webTitle']);
        $("#modal_text").html($item['fields']['body']);
    });
    markItemRead(id);
}

// Mark an item as read by adding it to loaclstorage
function markItemRead(id)   {
    "use strict";
    localStorage.setItem(id, true);
    fade(id);
}

function fade(id)   {
    $("div[id='"+ id +"']").addClass("mark_read");
}

function checkRead(id)  {
    if (localStorage.getItem(id)) {
        return true;
    }
    return false;
}


// Tab creation
// Adds tab list items to nav bar
function addNavItem(name, id)    {
    "use strict";
    var nav_item = "<li><a href=\"#tabs_"+ id +"\">"+ name +"</a></li>";
    $("#nav_ul").append(nav_item);
}

// Adds tab items to page
function addTab(id)   {
    "use strict";
    var tab = "\
                <div id=\"tabs_"+ id +"\">\
                    <div class=\"jumbotron\" id=\"jumbotron_"+ id +"\">\
                        <h1 id=\"j_title_"+ id +"\"></h1>\
                        <p><a id=\"j_button_"+ id +"\" class=\"btn btn-primary btn-lg\" data-toggle=\"modal\" data-target=\"#news_item_modal\" onclick=\"\">View Story</a></p>\
                    </div>\
                    <div id='holder_"+ id +"'></div>\
                </div>";
    $("#tabs").append(tab);
}

// Build tabs and contents
function buildContent(array)    {
    "use strict";
    // Assuming multi-dimensional array of format: name, id, load point
    // Ignore index 0 (headers) in outer array
    for (var i=1; i<array.length; i++)  {
        var name = array[i][0];
        var id = array[i][1];
        var lp = array[i][2]; //lp = load point
        var ef = array[i][3]; //ef = extra fields

        var url = buildUrl(lp, ef);

        addNavItem(name, id);
        addTab(id);
        loadNews(url, id);
    }

    // Adds a hidden tab for search reults
    addTab("99");
    $("#nav_ul").append("<li class=\"hidden\"><a href=\"#tabs_99\">Search</a></li>");

    $( function() {
        $( "#tabs" ).tabs();
    } );
}


// Build api request url
function buildUrl(lp, ef)    {
    "use strict";
    var domain = "https://content.guardianapis.com/";
    var api_key = "api-key=8b7ca0fc-3914-4473-9c07-e9b56781ce88";
    var req_fields = "&show-fields=thumbnail%2Cbyline%2Cbody";

    if (ef != "")   {
        ef = ef + "&";
    }
    else {
        ef = "?";
    }

    var url = "" + domain + lp + ef + api_key + req_fields;
    return url;
}


// Search bar javascript
function search() {
    "use strict";
    // Pull query and build url
    var query = $("#search_text").val().replace(/ /g, '%20');
    var url = buildUrl("search", "?q=" + query);

    //recreate results tab
    $("#tabs_99").remove();
    addTab("99");

    //load results and switch tab
    loadNews(url, "99");
    $( "#tabs" ).tabs( "option", "active", content_array.length-1 );
}

//Show and hide help
function help() {
    $('#search_help').removeClass('hidden');
}

function hideHelp() {
    $('#search_help').addClass('hidden');
}
