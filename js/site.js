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
                $('#holder_'+tab_number).append('<div class="row_contain" id="row_contain_'+ j +'"></div>');
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
            $("#row_contain_"+j).append(news_item);
        }
    });
}
