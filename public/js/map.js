 // Ensure `MAP_TOKEN` is set in your environment

mapboxgl.accessToken = mapToken;


const map = new mapboxgl.Map({
    container: "map", // Container ID
    style: "mapbox://styles/mapbox/streets-v11", // Map style
    center: listing.geometry.coordinates, // Starting position [lng, lat]
    zoom: 9, // Starting zoom level
});

// Add a marker at the specified location
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates) // Coordinates for the marker [lng, lat]
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`
        )
    ) // Popup with HTML content that will appear when the marker is clicked
    .addTo(map); // Add the marker to the map

     
