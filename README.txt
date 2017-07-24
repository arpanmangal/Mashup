                   
                   
                    Mashup (pset8)
        
    A full fleged web app ready to be deployed consisting of an
    awesome mashup of Google Maps with Google News echancing 
    user comfort and news accessibility. Get instant news of your
    current location, favourite place, work place or hometown with
    our app.
    
    Features:
      * Get instant news of any desired place found on google maps.
      * Short news snippets / summary for quick update along with corresponding pictures.
      * Get the full news when desired on one click.
      * Provision to open the actual google news page for that place.
    
    
    The app has currently database of all Indian towns and cities consisting of 1,54,757 places.
    This data has been imported with the code in /bin/import with the provision of easily adding cities of more countries.
    
    /public/search.php contains implementation of a fast search of places.
    /public/articles.php returns the google news of the desired place in json pretty print format.
    
    The app derives its various styling from /public/css/styles.css .
    Finally main javascript code is present in /public/js/scripts.js which controls the display of markers, info window,
    modal news slideshow etc. by quering from the corresponding files on its own.
    
     
     
     This app is based on cs50x2016's pset8. In addition to the problem specification it has a nice user friendly display of
     news with short news snippets of a place in slideshow format similar to actual google news as a part of personal touch.
     
     
    
    To run locally using cs50 ide
      In terminal run:
      $ cd ~/workspace/pset8_Mashup/public
      $ apache50 stop
      $ apache50 start .
      $ mysql50 start
      
    Now head to https://ide50-arpanmangal.cs50.io/ in a new tab in your favorite browser.
    And Whoa! there is the Awesome Mashup Webapp.
     *If you are unable to get the Mashup page make sure to delete your browser's history and cache and retry above steps.
     
    To see the working demo of the app head to:
      https://ide50-arpanmangal.cs50.io/img/MashupSearch.gif    (for seeing general usage and search demo)
      https://ide50-arpanmangal.cs50.io/img/MashupNews.gif      (for seeing news demo)
    