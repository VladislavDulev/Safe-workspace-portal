import { faSkull } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Links } from '../../common/links.enum';
import './Home.css'

const Home = () => {
  const [covidData, setCovidData] = useState(null);
  useEffect(() => {
    fetch(Links.COVID_URL + 'all')
      .then(r => r.json())
      .then(r => {
        if(!r?.cases || !r.recovered || !r.deaths) {
          setCovidData('Error loading data.');
        }else{
          setCovidData(r.deaths)
        }
      })
  }, [setCovidData])

  return (
    <div id="home" className={'home'}>
        <FontAwesomeIcon icon={faSkull} size={"5x"} color={"#8ECAE6"}></FontAwesomeIcon>
        <h1 className={"title"}>How bad is it?</h1>
        <h2 className={"body-text"}>Current Covid Deaths</h2>
        <h5 className={"deaths"}>{covidData?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h5>
        
    </div>
  );
}

export default Home;
