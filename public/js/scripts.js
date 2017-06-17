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
        maxZoom: 14,
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
    var long = parseFloat(place.longitude);
    var lat = parseFloat(place.latitude);
    var marker = new google.maps.Marker({
        position: { lat: lat, lng: long },
        map: map,
        title: place.place_name
    });
    
    var contentString = "<p style='background-color: #f0ffff'>" +
                        "<span style='color: rgba(255, 153, 51)'>" + place.place_name + ",</span> " +
                        "<span style='color: rgba(0, 0, 128)'>" + place.admin_name1 + "</span>  " + 
                        "<span style='color: rgba(19, 136, 8)'>" + place.postal_code + "</span></p>" + 
                        "<ul>";
    var query = place.place_name + ", " + place.admin_name1;
    var content = "";
    var parameters = {
         geo: query
     };
     $.getJSON("articles.php", parameters)
     .done(function(data, textStatus, jqXHR) {
  
         // add new markers to map
         for (var i = 0; i < data.length; i++)
         {
             contentString = contentString +  "<li><a href='" + data[i].link + "'>" + data[i].title + "</a></li>";
         }
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
 
          // log error to browser's console
          console.log(errorThrown.toString());
      });
      console.log(contentString);
/*      if (content == "")
      {
          query = place.admin_name1;
          parameters.geo = query;
          $.getJSON("articles.php", parameters)
          .done(function(data, textStatus, jqXHR) {
  
            // add new markers to map
            for (var i = 0; i < data.length; i++)
            {
                content += "<li><a href='" + data[i].link + "'>" + data[i].title + "</a></li>";
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
 
            // log error to browser's console
            console.log(errorThrown.toString());
        });
      }*/
     
   // contentString += content;
    contentString += "</ul>";
    // remove previous info window if any
    info.close();
 
    // listen for click to open the info window
    marker.addListener('click', function() {
        showInfo(marker, contentString);
    });
  
    // push the marker to the global array
    markers.push(marker);
}

function getNews(parameters)
{
    alert(parameters.geo);
 /*   var parameters = {
        geo: 110001
    };*/
  //  alert(parameters.geo);
    var string = "";
    // search for corresponding news items
    $.getJSON("articles.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        for (var i = 0; i < data.length; i++)
        {
            string += "<li><a href='" + data[i].link + "'>" + data[i].title + "</a></li>";
        }
     })
     .fail(function(jqXHR, textStatus, errorThrown) {

         // log error to browser's console
         console.log(errorThrown.toString());
     });
     
   //  alert(string);
     return string;
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