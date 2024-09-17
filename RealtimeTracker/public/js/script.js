const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      // Emit user's location to the server
      socket.emit("send-location", { latitude, longitude });
    },
    (err) => {
      console.log('Geolocation error:', err);
    },
    {
      enableHighAccuracy: true,  // High-accuracy tracking
      maximumAge: 0,             // No caching of locations
      timeout: 5000              // Max time to wait for location
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}

// Initialize the Leaflet map at a default location
const map = L.map("map").setView([0, 0], 15);

// Load and display a tile layer on the map (OpenStreetMap tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "made by alok"
}).addTo(map);


const markers = {};

// Listen for location updates from the server
socket.on("get-location", (data) => {
  const { id, latitude, longitude } = data;

  // Set map view to the latest location of the user
  map.setView([latitude, longitude], 16);

  // Check if the marker for the user exists, and update it
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);  // Update the marker position
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);  // Create a new marker
  }
});

// Listen for user disconnection event
socket.on("user-disconnected", (id) => {
  // Check if the marker for the disconnected user exists, and remove it
  if (markers[id]) {
    map.removeLayer(markers[id]);  // Remove marker from the map
    delete markers[id];  // Delete marker from the marker object
  }
});
