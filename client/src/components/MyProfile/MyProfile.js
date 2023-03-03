import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import { Links } from '../../common/links.enum';
import AuthContext, { getToken } from '../../providers/AuthContext';
import './MyProfile.css'

export default function MyProfile( { history } ) {
    const [userState, setUserState] = useState({});
    const [error, setError] = useState(null);
    const [rowData, setRowData] = useState([]);
    const {user, isLoggedIn} = useContext(AuthContext);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const userVacation = userState?.isInVacation ? `${formatDate(new Date(userState?.vacationStart))} to ${formatDate(new Date(userState?.vacationEnd))}` : 'None'

    function renderAggridData(user) {
        const aggridData = user.deskSchedule.map(s => {
            return {
                country: user.country,
                start: formatDate(new Date(s.dateStart)),
                end: formatDate(new Date(s.dateEnd)),
            }
        });
        setRowData(aggridData)
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    useEffect(() => {
        if(!isLoggedIn) {
            history.push('/home');
        }
        fetch(`${Links.API}users/${user.sub}`)
            .then(r => r.json())
            .then(r => {
                if(r.error || r.statusCode) {
                    setError(r);
                    throw new Error(r.message);
                }
                setUserState(r);
                renderAggridData(r);
            }).catch(console.warn)
    }, [setRowData, setUserState]);
    
    const assignVacation = (e) => {
        e.preventDefault();
        fetch(`${Links.API}users/${user.sub}/vacation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            }, 
            body: JSON.stringify({
                start: formatDate(startDate),
                end: formatDate(endDate),
            })
        }).then(r => r.json())
        .then(r => {
            if(r.statusCode || r.error) {
                setError(r.message);
                throw new Error(r.message);
            }
            setUserState({
                ...userState,
                vacationStart: startDate,
                vacationEnd: endDate,
                isInVacation: true,
            })
        }).catch(console.warn)
    }

    const deleteVacation = (e) => {
        e.preventDefault();
        fetch(`${Links.API}users/${user.sub}/vacation`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            }, 
        }).then(r => r.json())
        .then(r => {
            if(r.statusCode || r.error) {
                setError(r.message);
                throw new Error(r.message);
            }
            setUserState({
                ...userState,
                vacationStart: null,
                vacationEnd: null,
                isInVacation: false,
            })
        }).catch(console.warn)
    }

    return (
        <div>
            <div className={"container detail-user-container"}> 
                <Form className={"col-md-6 detail-user-form-1"}>
                <FontAwesomeIcon icon={faUserCircle} size={"5x"} color={"#8ECAE6"}></FontAwesomeIcon>
                    <h3 className="user-name">{userState?.fullname}</h3>
                    <Form.Group className={`form-group`} style={{color: "white"}} controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control value={userState?.username} disabled ></Form.Control>
                    </Form.Group>
                    <Form.Group  className={`form-group`} style={{color: "white"}} controlId="formVacationStart" >
                        <Form.Label>Current Vacation</Form.Label>
                        <Form.Control value={userVacation} disabled ></Form.Control>
                    </Form.Group>
                    <Form.Group  className={`form-group`} style={{color: "white"}} controlId="formVacationEnd" >
                        <Form.Label style={{paddingRight:"10px"}}>Vacation Start:</Form.Label>
                        <ReactDatePicker minDate={new Date()} selected={startDate} onChange={(date) => setStartDate(date)}></ReactDatePicker> 
                    </Form.Group>
                    <Form.Group  className={`form-group`} style={{color: "white"}} controlId="formEmail" >
                        <Form.Label style={{paddingRight:"10px"}}>Vacation End:</Form.Label>
                        <ReactDatePicker minDate={startDate}  selected={endDate} onChange={(date) => setEndDate(date)} ></ReactDatePicker> 
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={(e) => {userState?.isInVacation ? deleteVacation(e) : assignVacation(e)}} className="btnSubmit" value="Vacation"  >
                        {userState?.isInVacation ? 'Remove Vacation' :'Update Vacation'}
                    </Button>

                </Form>
                { error && 
                <Alert variant='danger' onClick={() => setError(null)} style={{margin:'auto'}}>
                    {error}
                </Alert>
                }
                <h3 className="schedules">User Schedules:</h3>
                <div className="ag-theme-alpine" style={ {height: '300px', width: '610px', margin: 'auto',paddingBottom: '40px' } }>
                    <AgGridReact rowData={rowData}>
                        <AgGridColumn field="start" sortable={true} filter={true} ></AgGridColumn>
                        <AgGridColumn field="end" sortable={true} filter={true} ></AgGridColumn>
                        <AgGridColumn field="country" sortable={true} filter={true} ></AgGridColumn>
                    </AgGridReact>
                </div>
            </div>
        </div>
    );
}