import React from 'react';

function Card(props){
    const {xplaura, user, filtre, setSelectIndex} = props;

    // const ParseGps = (UserLat, UserLng, MarkerLat, MarkerLng) =>{
    //     return Math.round(MainMap.distance([UserLat,UserLng],[MarkerLat,MarkerLng])/1000);
    // }

    function distance(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;      
        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
      }

    const ClickCard = (e) =>{
        const Id = parseInt(e.currentTarget.getAttribute('data-id'))
        setSelectIndex(Id)
    }

    const CardItem = Object.keys(xplaura).map((item, index)=>{
        const Coord = xplaura[item].Coord;
        const Type = xplaura[item].Type;
        const UserPos = (user.lat) ? Math.round(distance(user.lat,user.lng,Coord.lat, Coord.lng))+"km" : "";
        const NewCard = (filtre === Type ||filtre === null) && (
            <div key={index} id={index} className={`CardBox`} data-id={index} data-lat={Coord.lat} data-lng={Coord.lng} onClick={ClickCard}>
                <div className="Card" style={{backgroundImage : `url("image/img/${item}/1.jpg")`}}>
                </div>
                <div className="CardInfo">
                    <h2>{item}</h2>
                    <h3 className={`${Type}`}>{Type}</h3>
                </div>
                <span className='DistanceCard'>{UserPos}</span>
            </div>
        )

        return NewCard;
    })

    return(
        <div className="CardContainer">
            {CardItem}
        </div>
    )
}

export default React.memo(Card);