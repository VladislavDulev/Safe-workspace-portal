import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import React, { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import AuthContext from '../providers/AuthContext';

export default function CovidData({ history }) {
    const { isAdmin } = useContext(AuthContext)
    const [covidData, setCovidData] = useState([]);
    const [currCountry, setCountry] = useState({});

    const returnFormated = num => ' ' + num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    useEffect(() => {
        if(!isAdmin){ 
            history.push('home');
        }
        fetch('https://coronavirus-19-api.herokuapp.com/countries')
            .then(r => r.json())
            .then(r => {
                if(r.error) {
                    throw new Error(r.message);
                }
                setCovidData(r);
                setCountry(r.find(e => e.country == 'World'))
            }).catch(console.warn);
    }, [setCountry, setCovidData])


    return (
        <div style={{width: '30vw', margin:'auto'}}>
            <Form>
            <Form.Group controlId="formCountry" style={{color: "white"}} >
              <Form.Label>Country</Form.Label>
              <Form.Control as="select" required value={currCountry?.country} onChange={(e) => setCountry({...(covidData.find(o => o.country === e.target.value))})}>
                {covidData.sort((a, b) => {
                    return a.country.localeCompare(b.country);
                }).map((e, i) => <option key={`country-${i}`} value={e.country}>{e.country}</option>)}
              </Form.Control>
            </Form.Group>
            </Form>
            <div>
                <div className="covid-data">
                    <h1>
                        Today
                    </h1>
                    <h3 className="data-title">
                        Today Cases: 
                        {returnFormated(currCountry?.todayCases)}
                    </h3>
                    <h3 className="data-title">
                        Today Deaths: 
                        {returnFormated(currCountry?.todayDeaths)}
                    </h3>
                </div>
                <div style={{marginTop: '20px'}}>
                    <h1>
                        Overall
                    </h1>
                    <h3 className="data-title">
                        Deaths:
                        {returnFormated(currCountry?.deaths)}
                    </h3>
                    <h3 className="data-title">
                        Cases:
                        {returnFormated(currCountry?.cases)}
                    </h3>
                    <h3 className="data-title">
                        Recovered:
                        {returnFormated(currCountry?.recovered)}
                    </h3>
                    <h3 className="data-title">
                        Active:
                        {returnFormated(currCountry?.active)}
                    </h3>
                    <h3 className="data-title">
                        Critical:
                        {returnFormated(currCountry?.critical)}
                    </h3>
                </div>
            </div>
        </div>
    )
}