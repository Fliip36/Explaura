import React, { useContext, useEffect, useRef, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer} from 'react-leaflet';

import {FaHeartbeat as Heart} from "react-icons/fa";
import {FaHiking as Hiking} from "react-icons/fa";
import {AiFillClockCircle as Clock} from "react-icons/ai";
import {IoIosSpeedometer as Speed} from "react-icons/io";
import {TbWaveSine as Rythme} from "react-icons/tb";
import {TbChartLine as Elevation} from "react-icons/tb";

import {AiOutlineDoubleRight as Right} from "react-icons/ai";
import {AiOutlineDoubleLeft as Left} from "react-icons/ai";

import Gpx from './Gpx';
import { ExplauraContext } from '../App';

function Info(props){

    const {selectInfo, customLayer, setSelectIndex, setGpxData, gpxData, AllIcons, prevGpx, setPrevGpx, setMove, move, Init, setSelectInfo, mapLayer} = useContext(ExplauraContext);
    const RateEmoji = ["😭","😞","😟","😐","🙂","😊","😃","😁","🤩","😍"]; 
    const SlideShowRef = useRef(); // Create A Ref for Marker
    const [allowScroll, setAllowScroll] = useState(false);
    // Check if GPX is Selected and Generate Array [Altitude, Distance]
    const Data = (gpxData) && gpxData.ElevationArray.map((item, index) => {
        const Data = {
                Distance : parseFloat(gpxData.ElevationLabel[index]),
                Altitude : parseInt(item)
            }        
        return Data
    })
    const ShowChart = (Data) ? "ShowChart" : "HideChart";
    
    // HoverChart to get Lat and Lng for Move Marker
    var NoSpam;
    const HoverChart = (e) =>{
        clearTimeout(NoSpam);
        NoSpam = setTimeout(()=>{
            (e.activeTooltipIndex) && setMove(gpxData.GpxData.LatLngSvg[e.activeTooltipIndex]);
        },10);
        
    }

    // Generate Stat (x3) DIV
    const InfoStat = (selectInfo) && Object.keys(selectInfo.Infos.Infos).map((stat, index)=>{
        return(
            <div key={index} className='Info-stat'>
                <h3>{stat}</h3>
                <span>{selectInfo.Infos.Infos[stat]}</span>
            </div>
        )
    });

    // Block Scroll LEFT in Slideshow
    useEffect(()=>{
        const Slide = SlideShowRef.current;
        const ScrollHandler = (e) => { e.currentTarget.scrollLeft < 200 ? setAllowScroll(false) : setAllowScroll(true) }
        Slide.addEventListener('scroll', ScrollHandler);
        return () => Slide.removeEventListener('scroll', ScrollHandler);
    },[])

    // Slideshow
    const Slideshow = (selectInfo) ? selectInfo.Infos.Photos.map((stat, index)=>{
        return(
            <div key={index} className='Slideshow-img' style={{backgroundImage : `url("image/img/${selectInfo.Name}/${stat}")`}}> </div>
        )
    }) : <div className='Slideshow-img' style={{backgroundImage : `url("image/img/Explaura/1.jpg")`}}> </div>;

    // Avis / Note
    const Rating = (selectInfo) && RateEmoji.map((item, index) => {
        const Focus = (selectInfo.Infos.Note === index) ? "FocusEmoji" : ""
        return <span className={`Info-Emoji ${Focus}`} key={index}>{item}</span>
    })

    // Custom ToolTip Data
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className="custom-tooltip">
              <p className="label">{`Distance : ${label}km`}</p>
              <p className="intro">{`Altitude : ${payload[0].value}m`}</p>
            </div>
          );
        }
    }

    // Hour to Second && Second to Hours
    //function hmsToSeconds(s) { return s.split(':')[0]*3600 + s.split(':')[1]*60 + (+s.split(':')[2] || 0)}
    // function secondsToHMS(secs) { function z(n){return (n<10?'':'') + n}; var sign = secs < 0? '-':''; return sign + z(Math.abs(secs)/3600 |0) + ':' + z((Math.abs(secs)%3600) / 60 |0) + ':' + z(Math.abs(secs)%60); }
      
    // La Météo
    // const WeatherData = (selectInfo) && window.WeatherArray.map((item) => {
    //     const WeatherLat = parseFloat(item.Coord.lat);
    //     const WeatherLng = parseFloat(item.Coord.lng);
    //     const SelectInfoLat = parseFloat(selectInfo.Infos.Coord.lat.toFixed(1));
    //     const SelectInfoLng = parseFloat(selectInfo.Infos.Coord.lng.toFixed(1));
    //     const ToReturn = (WeatherLat === SelectInfoLat && SelectInfoLng === WeatherLng ) && 
    //         (<div className='Info-weather' key="Item">
    //             <div className='Info-Weather-Status'>
    //                 <span className='Info-Weather-Desc'>{item.Desc}</span>
    //                 <span className='Info-Weather-Update'>il y a {secondsToHMS(hmsToSeconds(new Date().toLocaleTimeString()) - (hmsToSeconds(item.Updated))).split(':')[1]} minutes.</span>
    //             </div>
    //             <div key="Item" className='Info-Weather-Numbers'>
    //                 <span className='Info-Weather-Temp'>{parseInt(item.Temp)}°C</span>
    //                 <img src={`image/weather/google/${item.Icone}.png`} />
    //             </div>
    //         </div>)
    //     return ToReturn;
    // });

    const SmallWeatherData = (selectInfo) && window.WeatherArray.map((item) => {
        const WeatherLat = parseFloat(item.Coord.lat);
        const WeatherLng = parseFloat(item.Coord.lng);
        const SelectInfoLat = parseFloat(selectInfo.Infos.Coord.lat.toFixed(1));
        const SelectInfoLng = parseFloat(selectInfo.Infos.Coord.lng.toFixed(1));
        const ToReturn = (WeatherLat === SelectInfoLat && SelectInfoLng === WeatherLng ) && 
            (<div className='Info-weather-small' key="Item">
                <div key="Item" className='Info-Weather-Numbers-small'>
                    <span className='Info-Weather-Temp-small'>{parseInt(item.Temp)}°C</span>
                    <img alt="Weather Icon" src={`image/weather/google/${item.Icone}.png`} />
                </div>
            </div>)
        return ToReturn;
    })


    
    // Gpx data Binding
    const BindGpxData = (gpxData) && ['Heart','Distance','TotalTime','MinutePerKm','GainElevation','MovingSpeedUpdated'].map((item, index)=>{
        const Assoc = ['BPM','KM','DURÉE','MIN/KM','METRES','KM/H']
        const Icons = [<Heart className='fa-beat'/>,<Hiking className='fa-bounce'/>, <Clock className='fa-spin'/>,<Rythme className='fa-beat'/>, <Elevation className='fa-bounce'/>, <Speed className='fa-shake'/>]
        return(
            <div key={index} className='data-gpx'>
                <span className='Icons'>{Icons[index]}</span>
                <h4>{gpxData.GpxData[item]}</h4>
                <span className='name'>{Assoc[index]}</span>
            </div>
        )
    })

    const DesktopScroll = (e) =>{
        (e.target.classList.contains('Right')) && (SlideShowRef.current.scrollLeft += e.currentTarget.offsetWidth); 
        (e.target.classList.contains('Left')) &&  (SlideShowRef.current.scrollLeft -= e.currentTarget.offsetWidth);
    }

    return(
        <div className="Info-scroller">
            {/* SlideShow */}
            <div className='Slideshow-container'>
                {SmallWeatherData}
                <div className='Desktop-Scroll' onClick={DesktopScroll}>
                    <div className='Left'>
                        <Left></Left>
                    </div>
                    <div className='Right'>
                        <Right></Right>
                    </div>
                </div>
                    <div className={`Slideshow-element ${allowScroll}`} ref={SlideShowRef} style={{backgroundImage : `url(image/img/Explaura.jpg)`}}>
                        {Slideshow}
                    </div>
                <img alt="Smoke" className='Slideshow-smoke' src='image/theme/smoke/smoke.png'></img>
            </div>
            {/* Header */}
            <div className='Info-container'>
                <div className='Info-Header'>                
                    <div className='Info-type'>
                        <img alt={selectInfo?.Infos.Type} src={`image/theme/type/${selectInfo?.Infos.Type || Init.Type}.png`}></img>
                    </div>

                    <div className='Info-data'>
                        <h1>{selectInfo?.Name || Init.Name}</h1>
                        <p>{selectInfo?.Infos.Description || Init.Description}</p>
                        <div className='Info-stats'>
                            {InfoStat}
                        </div>
                    </div>
                </div>
                 {/* Map */}
                <div className='Info-map' id='Info-map'>

                    <MapContainer center={{lat:45.592104,lng:2.844146}} zoom={13} scrollWheelZoom={true}>
                        <TileLayer maxNativeZoom={mapLayer.Options.maxNativeZoom} key={mapLayer.Url} url={mapLayer.Url}/>
                        { 
                            customLayer && 
                            <TileLayer zIndex={100} opacity={0.5} key={customLayer._url} url={customLayer._url} maxNativeZoom={customLayer.options.maxNativeZoom}/>
                        }      
                            <Gpx 
                                selectInfo={selectInfo} 
                                setGpxData={setGpxData}
                                setPrevGpx={setPrevGpx}
                                prevGpx={prevGpx}
                                AllIcons={AllIcons}
                                move={move}
                                setSelectInfo={setSelectInfo}
                                setSelectIndex={setSelectIndex}
                            />    
                                    
                    </MapContainer>

                </div>
                 {/* Data GPX */}
                <div className='Info-gpx'>
                    {BindGpxData}
                </div>

                {/* {WeatherData} */}

                <div className='Info-button'></div>

                <div className={`Info-chart ${ShowChart}`}>
                    {Data && <ResponsiveContainer>
                    <AreaChart onMouseMove={HoverChart} data={Data} margin={{top: 10,right: 30,left: 0,bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis scale="auto" dataKey="Distance" type="number" axisLine={false} unit="km" tickLine={false}  domain={['dataMin', 'dataMax']}/>
                        <YAxis dataKey="Altitude" type="number" axisLine={false} unit="m"  tickLine={false} domain={['dataMin', 'dataMax']}/>
                        <Tooltip content={<CustomTooltip />} formatter={(value, name, props) => [value+"m", name]}/>
                        <Area type="monotone" dataKey="Altitude" stroke="#2b2b2b" fill="#2b2b2b" />
                    </AreaChart>
                    </ResponsiveContainer>
                    }
                </div>                    

                {/* Note & Review  */}
                {selectInfo && <div className='Info-note'>
                    <div className='Info-Review'>
                        <div className='Info-Review-User'>
                            <img alt="User" src='https://theme.lucasarts.fr/user.jpg'/> 
                        </div>
                        <div className='Info-Review-Text'>
                            {selectInfo?.Infos.Review || Init.Review}
                        </div>                        
                    </div>                    
                    <div className='Info-Smiley'>{Rating}</div>
                </div> 
                }    

            </div>
         </div> 
    )
}

export default React.memo(Info);