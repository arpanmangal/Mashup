# Mashup
An awesome combination of Google Maps API and Google News based on cs50's pset8.
Get instant news of your current location, favourite place or hometown with our app.
Loaded with all Indian towns and cities consisting of a whoping 1,54,757 places database.

# Features
* Get instant news of any desired place found on google maps.
* Short news snippets / summary for quick update along with corresponding pictures.
* Get the full news when desired on one click.
* Provision to open the actual google news page for that place.

## Intelligent Search
![img](public/img/MashupSearch.gif)
PS: Searching for large part of database (like searching a large state) may take long time
    depending on your network due to large database of India.

## User Friendly News Display
![img](public/img/MashupNews.gif)
PS: If at any time news disappears make sure to clear cache and reload. If it doesn't come back
    try after some time as google sometimes stops the news access temporarily.
    
## Running
To run locally using cs50 ide,
      In terminal run:
```sh
  $ cd ~/path/to/mashup/public
  $ apache50 stop
  $ apache50 start .
  $ mysql50 start
  ```
 - Now head to https://ide50-username.cs50.io/ and get instant news! 
