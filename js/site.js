//Cookie Management
function cookie_adcknowledge() {
    localStorage.setItem("cookie_acknowledge", true);
}

$( document ).ready(function() {
    if (localStorage.getItem("cookie_acknowledge")) {
        $('#cookie_alert').addClass('hidden');
    }
});


// Universal news content loader
// Tab id and url are passed in
function loadNews(url, tab_number) {
    $.getJSON(url, function(data) {
        $items = data['response']['results'];
        console.log(tab_number);
        console.log(url);
        console.log($items);

        //Add first news item to Jumbrotron box
        $("#j_button_"+ tab_number).attr("href", $items[0]['webUrl']);
        $("#j_title_"+ tab_number).append($items[0]['webTitle']);

        $("#jumbotron_"+ tab_number).css({"background":"linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255, 0.45)),url("+ $items[0]['fields']['thumbnail'] +") no-repeat","background-size":"100%"});

        //Add News Items
        var j=0;
        for (i=1; i<$items.length; i++) {
            if (i%3 == 1) {
                j++;
                $('#holder_'+tab_number).append('<div class="row_contain" id="row_contain_'+ tab_number +'_'+ j +'"></div>');
            }

            var news_item = "\
                <div id=\""+ $items[i]['id'] +"\" class=\"col-xs-6 col-sm-4\">\
                    <div class=\"panel panel-default\">\
                        <div class=\"panel-body\">\
                            <img class=\"news_thumb\" src=\""+ $items[i]['fields']['thumbnail'] +"\">\
                        <div>\
                        <div class=\"panel-footer\">\
                            <a href=\""+ $items[i]['webUrl'] +"\">\
                                <h3>"+ $items[i]['webTitle'] +"</h3>\
                                <br \>\
                                <p>"+ $items[i]['webPublicationDate'].replace(/T|Z/g, ' ') +"</p>\
                            </a>\
                        <div>\
                    </div>\
                </div>";
            $("#row_contain_"+ tab_number +"_"+j).append(news_item);
        }
    });
}


// Build tabs and contents
function buildContent(array)    {
    // Assuming multi-dimensional array of format: name, id, load point
    var domain = "https://content.guardianapis.com/";
    var api_key = "api-key=8b7ca0fc-3914-4473-9c07-e9b56781ce88";
    var req_fields = "&show-fields=thumbnail";

    // Adds list items to nav bar
    function addNavItem(name, id)    {
        var nav_item = "<li><a href=\"#tabs_"+ id +"\">"+ name +"</a></li>";
        $("#nav_ul").append(nav_item);
    }

    function addTab(id)   {
        var tab = "\
                    <div id=\"tabs_"+ id +"\">\
                        <div class=\"jumbotron\" id=\"jumbotron_"+ id +"\">\
                            <h1 id=\"j_title_"+ id +"\"></h1>\
                            <p><a href=\"\" id=\"j_button_"+ id +"\" class=\"btn btn-primary btn-lg\">View Story</a></p>\
                        </div>\
                        <div id='holder_"+ id +"'></div>\
                    </div>";
        $("#tabs").append(tab);
    }

    // Ignore index 0 (headers) in outer array
    for (i=1; i<array.length; i++)  {
        var name = array[i][0];
        var id = array[i][1];
        var lp = array[i][2]; //lp = load point
        var ef = array[i][3]; //ef = extra fields

        if (ef != "")   {
            ef = ef + "&";
        }
        else {
            ef = "?";
        }

        var url = "" + domain + lp + ef + api_key + req_fields;

        addNavItem(name, id);
        addTab(id);
        loadNews(url, id);
    }

    // Adds a hidden ptab for search reults
    addTab("99");
    $("#nav_ul").append("<li class=\"hidden\"><a href=\"#tabs_99\">Search</a></li>");

    $( function() {
        $( "#tabs" ).tabs();
    } );
}
