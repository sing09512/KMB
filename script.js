function getStopsForRouteAndDirection(route, direction) {
    return routeStopData.filter(item => item.route === route && item.bound === direction);
  }
  
  function getStopName(stopId) {
    const stop = stopData.find(item => item.stop === stopId);
    return stop ? stop.name_tc : 'Unknown';
  }
  function displayRouteStops(route, direction, stopData, routeStopData, stopContainer) {
    stopContainer.innerHTML = ""; 
    
  
    const stops = getStopsForRouteAndDirection(route, direction);
    
    let stopCount = 1;
    stops.forEach(stop => {
        const stopName = getStopName(stop.stop);
        const stopElement = document.createElement("p");
        stopElement.textContent = `${stopCount++}. ${stopName}`; 
        stopContainer.appendChild(stopElement);
    });
  }
  
  async function fetchData() {
    try {
        const res = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/");
        const routeResults = await res.json();
        siteData = routeResults.data;
  
        const stopRes = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop");
        const stopResults = await stopRes.json();
        stopData = stopResults.data;
  
        const routeStopRes = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route-stop");
        const routeStopResults = await routeStopRes.json();
        routeStopData = routeStopResults.data;
    } catch (error) {
        console.error('Error:', error);
    }
  }
  
  async function searchRoute() {
    try {
        const inputR = document.querySelector("#route-input");
        const inputValue = inputR.value.trim();
  
        const resultContainer = document.querySelector(".result-container");
        resultContainer.innerHTML = "";
  
        const stopContainer = document.querySelector(".stop-container");
        stopContainer.innerHTML = "";
        let found = false;
  
        for (let i = 0; i < siteData.length; i++) {
            let route = siteData[i];
            if (route.route === inputValue) {
                const origTc = route.orig_tc;
                const destTc = route.dest_tc;
  
                const button = document.createElement("button");
                button.textContent = `${origTc} 到 ${destTc}`;
                resultContainer.appendChild(button);
                button.addEventListener('click', function() {
                   
                    const direction = route.bound;
                    displayRouteStops(route.route, direction, stopData, routeStopData, stopContainer);
                });
  
                found = true; 
            }
        }
  
        if (!found) {
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Your bus number is incorrect, please re-enter it";
            resultContainer.appendChild(errorMessage);
        }
  
    } catch (error) {
        console.error('Error:', error);
    }
  }
  fetchData();
  
  