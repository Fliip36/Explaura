import './App.css';
import React, {useEffect, useState}  from 'react';
import Map from './component/Map.js'
import Card from './component/Card.js'
import Info from './component/Info';
import * as L from "leaflet";
import Settings from './component/Settings';

function App() {
  // Init for State
  const Init = {
    "Name" : "Explaura",
    "Type" : "user",
    "Coord" : {
        "lat" : 45.77246462548193,
        "lng" : 2.9625362995532574
    },        
    "Parking" : {
        "lat" :45.76422760935789, 
        "lng" : 2.956646164618501
    },        
    "Description" : ("Explaura a été Développé avec ♥ par un passionné de Randonnée et de Photographie. Cliquez sur un point d'intérêt pour en apprendre plus sur un lieu ou une randonnée ! Les filtres vous permettent de voir la pollution lumineuse, mais aussi les lieux ou le vol en drone est autorisé."),
    "Infos" : {            
        "Difficulté" : "Moyen",
        "Virages" : "15",
        "Fréquentation" : "Forte"
    },    
    "Note" : 6,
    "Review" : "Passionné de randonnée et de photographie, je donne mon avis sur les meilleures randonnées d'Auvergne Rhones Alpes !",
    "Photos" : [
        "1.jpg"
    ],
    "Gpx" : "PuyDeDome"
  } 
   
  const [xplaura, setXplaura] = useState({}) // Explaura JSON Data
  const [selectIndex, setSelectIndex] = useState(null); // Select Index for item = 1, 3, 9
  const [selectInfo, setSelectInfo] = useState(null); // Selected Item Informations base on Index 
  const [gpxData, setGpxData] = useState(); // Save GPX Data To a State
  const [prevGpx, setPrevGpx] = useState({}); // Save Previous GPX 2:null,25:null
  const [move, setMove] = useState({lat:0,lng:0}) // Save Move Icon Position
  const [mobile, setMobile] = useState(true) // Check if user is mobile device or not
  const [mapLayer, setMapLayer] = useState({Url : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", Options : { maxNativeZoom : 18}}); // Default Map Layer
  const [customLayer, setCustomLayer] = useState(null); // Drone or Light Polution Layer
  const [filtre, setFiltre] = useState(null); // Show only Volcan, Montagne...
  const [user, setUser] = useState({}); // User position

    // Icons Settings
    const IconSettings = {
      iconSize: [50, 50],
      iconAnchor: [50/2, 50],    
      shadowUrl : require("./images/marker-shadow.png"),
      shadowAnchor: [50/2, 50], 
      shadowSize:   [50, 50],
      popupAnchor: [0, -50],
    }  
    // Default Icon
    const AllIcons = {
      ParkingIcon : L.icon({...IconSettings,iconUrl: require("./images/markers/parking.png") }),
      InterestIcon: L.icon({...IconSettings,iconUrl: require("./images/markers/interest.png") }),
      StartIcon : L.icon({...IconSettings, iconUrl: require("./images/markers/start.png") }),
      EndIcon : L.icon({...IconSettings, iconUrl: require("./images/markers/stop.png") }),
      MoveIcon : L.icon({...IconSettings, className:"MoveIcon", shadowUrl:null ,iconUrl: require("./images/markers/move.png") })
    }
    // Layers  
    const CommonLayer = {
      minZoom : 6,
      maxZoom: 18,   
      tileSize: 256,
      zoomOffset: 0, //-1
      opacity: 0.5,
    }
    const AllLayer = {
      Drone : L.tileLayer.wms("https://explaura.app/assets/maps/drone/{z}/{x}/{y}.png", {...CommonLayer, Name: "Drone", maxNativeZoom : 10}),
      Light : L.tileLayer.wms("https://explaura.app/assets/maps/light/{z}/{x}_{y}.png", {...CommonLayer, Name: "Light", maxNativeZoom : 6}),
    }
    // All Map Layers & Common Settings
    const Common = {
      attribution: 'Xplaura Project',
      minZoom : 6,
      maxZoom: 18,      
      maxNativeZoom : 16,              
      format: 'jpg',
      time: '',
      noWrap : true,
      tilematrixset: 'GoogleMapsCompatible_Level',
      tileSize: 256,
      zoomOffset: 0,      
      accessToken: 'pk.eyJ1Ijoic3dlZWZ0aCIsImEiOiJja3ptZ2IzN2g0M2hrMnVvMWttdWt6cnptIn0.ExNhsIX2PX-DXGjmQVVgsw',
      keepBuffer: 10,
    }
    const AllMap = {
      Terrain : L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", Common), //https://explaura.app/assets/maps/terrain/{z}/{x}/{y}.png
      Grey : L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {...Common, maxNativeZoom : 20}),
      Satelite : L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {...Common, maxNativeZoom : 20}),
      GoogleTerrain : L.tileLayer("https://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {...Common, maxNativeZoom : 20}),
      Trails : L.tileLayer("https://topo.wanderreitkarte.de/topo/{z}/{x}/{y}.png", {...Common, maxNativeZoom : 20}),
    }
    
    // Show or Hide
    const Show = (selectInfo) ? "ShowInfo" : "HideInfo"

    // Update Path Length
    useEffect(() => {
      function isMobile(){ (window.innerWidth < 800) ? setMobile(true) : setMobile(false); };    
      window.addEventListener('resize', isMobile);
      isMobile()
      return () => window.removeEventListener('resize', isMobile);
    }, []);

    // Load Json Data
    useEffect(() => {
      // Load Leaflet GPX
      var script = document.createElement('script')
      script.src = process.env.PUBLIC_URL+"/js/leaflet-gpx.min.js" // Public URL is DOMAIN NAME
      document.body.appendChild(script);    
      // Load Xplaura Data
      Promise.all([fetch(process.env.PUBLIC_URL+'/js/ExplauraData.json')]).then(([Xplaura]) => Promise.all([Xplaura.json()])).then(([XplauraData]) => {
        setXplaura(XplauraData)      
      })
    }, [])

  // Check if user is on Mobile
  const isMobile = (mobile) ? "isMobile" : "NotMobile";

  return (
    <div className={`App Horizontal ${isMobile}`}>
      <div id='MapContainer'>

        <Settings setFiltre={setFiltre} filtre={filtre} xplaura={xplaura} customLayer={customLayer} AllLayer={AllLayer} AllMap={AllMap} setMapLayer={setMapLayer} setCustomLayer={setCustomLayer}/>

        <Map 
          xplaura={xplaura} 
          setGpxData={setGpxData}
          selectInfo={selectInfo}
          setSelectInfo={setSelectInfo}
          selectIndex={selectIndex}
          setSelectIndex={setSelectIndex}
          mapLayer={mapLayer}
          filtre={filtre}
          mobile={mobile}
          setUser={setUser}

          AllIcons={AllIcons}
          prevGpx={prevGpx}
          setPrevGpx={setPrevGpx}
          move={move}
          customLayer={customLayer}
        />

        <Card
          xplaura={xplaura}
          filtre={filtre}
          setSelectIndex={setSelectIndex}          
          user={user}
        />
      </div>


      <div id='InfoContainer' className={Show}>
        <Info 
          gpxData={gpxData} 
          selectIndex={selectIndex} 
          selectInfo={selectInfo}
          setGpxData={setGpxData} 
          AllIcons={AllIcons}
          prevGpx={prevGpx}
          setPrevGpx={setPrevGpx}
          setMove={setMove}
          setSelectInfo={setSelectInfo}
          setSelectIndex={setSelectIndex}
          move={move}
          Init={Init}
          mapLayer={mapLayer}
          customLayer={customLayer}
        />
      </div>
      
    </div>
  );
}

export default App;
