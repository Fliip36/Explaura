import {useMap} from 'react-leaflet';
import React from 'react';
import {useEffect} from 'react';

function Position(props){
    
    const map = useMap();
    const {setUser} = props;
    // Get User location on Load
    useEffect(() => { 
        map.locate().on('locationfound', function (e) { setUser(e.latlng) })          
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    return null
}

export default React.memo(Position);