import React, { useContext, useEffect, useState } from 'react';
import { Links } from '../common/links.enum';
import SingleOffice from './SingeOffice';
import AuthContext, { getToken } from '../providers/AuthContext';
import { Alert, CardColumns, Fade } from 'react-bootstrap';

export default function Offices({ history }) {
    const [offices, setOffices] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const {isLoggedIn, isAdmin} = useContext(AuthContext)

    useEffect(() => {
        fetch(`${Links.API}offices`, {
            method: 'GET',

        })
        .then(r => r.json())
        .then(result => {
            if (!Array.isArray(result)) {
                setError("Couldn't load offices");
            }else{
                setOffices(result);
            }
        })
    }, [setError, setOffices])

    const updateSchedule = (officeId) => {
        fetch(`${Links.API}offices/${officeId}/schedule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            }
        }).then(r => r.json())
        .then(r => {
            if(r.statusCode || r.error) {
                setError(r.message);
                throw new Error(r);
            }else {
                setSuccess('Planning updated successfully')
            }
        }).catch(console.log);
    }
    
    const officesComponent = !(offices.length) ? 
    <div className='home'>
        <h1 className={"title"}>There are currently no offices</h1>
    </div> :
    offices.map(u => <SingleOffice office={u} key={u.id} authenticated={isLoggedIn && isAdmin} updateSchedule={updateSchedule} />)

    return (<CardColumns style={{position:"relative", gridColumn:"-moz-initial"}}>
    {officesComponent}
    {error &&
    <Alert variant='danger' onClick={() => setError(null)} >
        {error}
    </Alert>
    }
    {success &&
        <Fade>
            <Alert variant='success' onClick={() => setSuccess(null)}>
                {success}
            </Alert>
        </Fade>
    }
  </CardColumns>)
}