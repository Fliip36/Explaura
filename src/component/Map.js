import { MapContainer, TileLayer } from 'react-leaflet';
import Gpx from './Gpx';
import Markers from './Markers';
import Position from './Position';
import React from 'react';
import * as L from "leaflet";

function Map(props) {

  const  {mobile, setUser, filtre, mapLayer, AllIcons, move, customLayer, xplaura, selectIndex, setSelectIndex, setSelectInfo, selectInfo, setGpxData, prevGpx, setPrevGpx} = props;
  const bounds = [[46.785829, 0.796244],[44.049197, 6.198830]];
  return (
        <MapContainer preferCanvas={true} renderer={L.canvas()} minZoom={7} maxZoom={18} maxBounds={bounds} maxBoundsViscosity={0.8} center={{lat:45.592104,lng:2.844146}} zoom={10} scrollWheelZoom={true}>
          
          <TileLayer maxNativeZoom={mapLayer.Options.maxNativeZoom} key={mapLayer.Url} url={mapLayer.Url}/>
          {
            customLayer && 
            <TileLayer opacity={0.5} zIndex={100} key={customLayer._url} url={customLayer._url} maxNativeZoom={customLayer.options.maxNativeZoom}/>
          }      
          <Markers 
            xplaura={xplaura}
            selectIndex={selectIndex} 
            setSelectIndex={setSelectIndex}
            setSelectInfo={setSelectInfo}
            filtre={filtre}
            mobile={mobile}
          />
                  
            <Gpx 
              selectInfo={selectInfo} 
              setGpxData={setGpxData} 
              prevGpx={prevGpx}
              setPrevGpx={setPrevGpx}
              setSelectInfo={setSelectInfo}
              AllIcons={AllIcons}
              move={move}
              setSelectIndex={setSelectIndex}
              mobile={mobile}
            />

            <Position setUser={setUser}/>
          
        </MapContainer>
  );
}

export default Map;
