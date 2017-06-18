/* global google */
/* global _ */
/**
 * scripts.js
 *
 * Computer Science 50
 * Problem Set 8
 *
 * Global JavaScript.
 */

// Google Map
var map;

// markers for map
var markers = [];

// info window
var info = new google.maps.InfoWindow({
    content: "Coming shortly..."
  });

// execute when the DOM is fully loaded
$(function() {

    // styles for map
    // https://developers.google.com/maps/documentation/javascript/styling
    var styles = [

        // hide Google's labels
        {
            featureType: "all",
            elementType: "labels",
            stylers: [
                {visibility: "off"}
            ]
        },

        // hide roads
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [
                {visibility: "off"}
            ]
        }

    ];

    // options for map
    // https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var options = {
        center: {lat: 28.644800, lng: 77.216721}, // New Delhi
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 15,
        panControl: true,
        styles: styles,
        zoom: 13,
        zoomControl: true
    };

    // $("#map-canvas") returns a jQuery object (that has a whole bunch of functionality built-in)
    // $("#map-canvas").get(0) returns the actual, underlying DOM node that jQuery is just wrapping
    // get DOM node in which map will be instantiated
    var canvas = $("#map-canvas").get(0);

    // instantiate map
    map = new google.maps.Map(canvas, options);

    // configure UI once Google Map is idle (i.e., loaded)
    google.maps.event.addListenerOnce(map, "idle", configure);

});

/**
 * Adds marker for place to map.
 */
function addMarker(place)
{
    // get the position of the place
    var long = parseFloat(place.longitude);
    var lat = parseFloat(place.latitude);
    
    // image credit: https://mapicons.mapsmarker.com/
    var image = "img/Reading.png";
    
    
    // marker Label
    var markerLabel = "<p>" + place.place_name + ", " +
                        place.admin_name1 + "</p>  ";
    // create marker at 'place'
    var marker = new MarkerWithLabel({
        position: { lat: lat, lng: long },
        map: map,
        icon: image,
        labelContent: markerLabel,
        labelAnchor: new google.maps.Point(22, 0),
        labelClass: "label", // the CSS class for the label 
        labelStyle: {opacity: 0.75}
 //       title: place.place_name
    });
    
    var contentString;
                        
    // remove previous info window if any
    hideInfo();
    
    // listen for click elsewhere
    google.maps.event.addListener(map, 'click', function() {
        hideInfo();
    });
 
    // listen for click to open the info window
    marker.addListener('click', function() {
        // check the news only when asked for it
        var query = place.place_name + ", " + place.admin_name1;
        var parameters = {
            geo: query
        };
        
        // show the current info i.e. Loading...
        showInfo(marker, contentString);
        
        // Get the actual info
        $.getJSON("articles.php", parameters)
        .done(function(data, textStatus, jqXHR) {
            // when done update the info window
            contentString = "<div class='infoTitle'><p>" +
                        "<span style='color: rgba(255, 153, 51)'>" + place.place_name + ",</span> " +
                        "<span style='color: rgba(0, 0, 128)'>" + place.admin_name1 + "</span>  " + 
                        "<span style='color: rgba(19, 136, 8)'>" + place.postal_code + "</span></p></div>" +
                        "<ul>";
                        
    /****************************************************************************************************************************/
  
    /******************************************************************************************************************************/
                        
            // add the news items in the list            
            for (var i = 0; i < data.length; i++)
            {
                contentString +=  "<li><a href='" + data[i].link + "'>" + data[i].title + "</a></li>";
            }
            
            // if no news item found
            if (!data.length)
            {
                contentString +=  "<li>No News Today..</li>";
            }
        })
        
        .fail(function(jqXHR, textStatus, errorThrown) {
            // log error to browser's console
            console.log(errorThrown.toString());
        })
        
        .always(function() {
            // when the request is completed show the required info window
            contentString += "</ul>";
            showInfo(marker, contentString);
        });
    });
  
    // push the marker to the global array
    markers.push(marker);
}



/**
 * Configures application.
 */
function configure()
{
    // update UI after map has been dragged
    google.maps.event.addListener(map, "dragend", function() {
        update();
    });

    // update UI after zoom level changes
    google.maps.event.addListener(map, "zoom_changed", function() {
        update();
    });

    // remove markers whilst dragging
    google.maps.event.addListener(map, "dragstart", function() {
        removeMarkers();
    });

    // configure typeahead
    // https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md
    $("#q").typeahead({
        autoselect: true,
        highlight: true,
        minLength: 1
    },
    {
        source: search,
        templates: {
            empty: "no places found yet",
            suggestion: _.template("<p style='background-color: #f0ffff'>" +
                                    "<span style='color: rgba(255, 153, 51, .8)'><%- place_name %>,</span> " +
                                    "<span style='color: rgba(0, 0, 128, .5)'><%- admin_name1 %></span>  " + 
                                    "<span style='color: rgba(19, 136, 8, .34)'><%- postal_code %></span></p>")
        }
    });

    // re-center map after place is selected from drop-down
    $("#q").on("typeahead:selected", function(eventObject, suggestion, name) {

        // ensure coordinates are numbers
        var latitude = (_.isNumber(suggestion.latitude)) ? suggestion.latitude : parseFloat(suggestion.latitude);
        var longitude = (_.isNumber(suggestion.longitude)) ? suggestion.longitude : parseFloat(suggestion.longitude);

        // set map's center
        map.setCenter({lat: latitude, lng: longitude});
        map.setZoom(13);

        // update UI
        update();
    });

    // hide info window when text box has focus
    $("#q").focus(function(eventData) {
        hideInfo();
    });

    // re-enable ctrl- and right-clicking (and thus Inspect Element) on Google Map
    // https://chrome.google.com/webstore/detail/allow-right-click/hompjdfbfmmmgflfjdlnkohcplmboaeo?hl=en
    document.addEventListener("contextmenu", function(event) {
        event.returnValue = true; 
        event.stopPropagation && event.stopPropagation(); 
        event.cancelBubble && event.cancelBubble();
    }, true);

    // update UI
    update();

    // give focus to text box
    $("#q").focus();
}

/**
 * Hides info window.
 */
function hideInfo()
{
    info.close();
}

/**
 * Removes markers from map.
 */
function removeMarkers()
{
    // Get the number of markers

    while (markers.length)
    {
        // remove marker from map
        markers[markers.length - 1].setMap(null);
        
        // remove the marker itself
        markers.pop();
    }
    // for debugging
    // alert(length);
}

/**
 * Searches database for typeahead's suggestions.
 */
function search(query, cb)
{
    // get places matching query (asynchronously)
    var parameters = {
        geo: query
    };
    $.getJSON("search.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // call typeahead's callback with search results (i.e., places)
        cb(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());
    });
}

/**
 * Shows info window at marker with content.
 */
function showInfo(marker, content)
{
    // start div
    var div = "<div id='info'>";
    if (typeof(content) === "undefined")
    {
        // http://www.ajaxload.info/
        div += "<img alt='loading' src='img/ajax-loader.gif'/>";
    }
    else
    {
        div += content;
    }

    // end div
    div += "</div>";

    // set info window's content
    info.setContent(div);

    // open info window (if not already open)
    info.open(map, marker);
}

/**
 * Updates UI's markers.
 */
function update() 
{
    // get map's bounds
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    // get places within bounds (asynchronously)
    var parameters = {
        ne: ne.lat() + "," + ne.lng(),
        q: $("#q").val(),
        sw: sw.lat() + "," + sw.lng()
    };
    $.getJSON("update.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // remove old markers from map
        removeMarkers();

        // add new markers to map
        for (var i = 0; i < data.length; i++)
        {
            addMarker(data[i]);
        }
     })
     .fail(function(jqXHR, textStatus, errorThrown) {

         // log error to browser's console
         console.log(errorThrown.toString());
     });
}