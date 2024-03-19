# Mapping Earth Quakes and Tectonic Plates with Leaflet
*Challenge 15 for UC Berkeley Data Analytics Bootcamp*

## Background
The United States Geological Survey, or USGS for short, is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment, and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.

The USGS is interested in building a new set of tools that will allow them to visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. 
  
In this challenge, earthquakes from USGS data were mapped alongside Earth's tectonic plates. This visualization will allow USGS to better educate the public and other government organizations (and hopefully secure more funding) on issues facing our planet.

## Part 1: Create the Earthquake Visualization  
The USGS provides earthquake data provides different formats, updated every minute. The [Past 7 days: All Earthquakes](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson) JSON file was used to create a map of the earthquake dataset with Leaflet, a JavaScript library. Visit the [USGS GeoJSON Feed Page](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) for more information.  
  
The data markers on the map reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes appear larger, and earthquakes with greater depth appear darker in color. A legend on the bottom left also provides context for the earthquake depth.  
  
Popups appear when you click on the marker that provides additional information about the earthquake.  

## Part 2: Gather and Plot Tectonic Plates
A second map is plotted using the [GeoJSON file](https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json) and illustrates the relationship between tectonic plates and seismic activity. This data was visualized alongside the original data. More data on tectonic plates can be found at https://github.com/fraxen/tectonicplates.
  
Each dataset was placed into separate overlays that can be turned on and off independently. An additional layer control was added to the map as well.
