import React, { useContext, useEffect, useState } from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import { Links } from '../common/links.enum';
import { Button } from 'react-bootstrap';
import AuthContext, { getToken } from '../providers/AuthContext';


export default function Users({ match }) {
    const [rowData, setRowData] = useState([]);
    const { isAdmin } = useContext(AuthContext);

    function renderAggridData(r) {
        let date = new Date();
        if(match.path.includes('later')) date = nextDay(date, 0);
        date.setHours(0, 0, 0, 0);
        const agridData = r.map(u => {
            const currSchedule = u.deskSchedule.find(e => new Date(e.dateStart) <= date && new Date(e.dateEnd) >= date);
            const officed = u.isInVacation ? 'In Vacation' : ( !!currSchedule ? "Office" : 'Home');
            const start = u.isInVacation ? formatDate(new Date(u.vacationStart)) : ( officed === 'Office' ? formatDate(new Date(currSchedule.dateStart))  : 'None' );
            const end = u.isInVacation ? formatDate(new Date(u.vacationEnd)) : ( officed === 'Office' ? formatDate(new Date(currSchedule.dateEnd)) : 'None' );
            return {
                id: u.id,
                username: u.username,
                email: u.email,
                fullname: u.fullname,
                country: u.country,
                officed,
                start,
                end,
                project: !!u.project ? u.project.title : 'None',
                deleteUser: u.id
            }
        });
        setRowData(agridData);
    }

    useEffect(() => {
        fetch(`${Links.API}users`)
            .then(r => r.json())
            .then(r => {
                if(!Array.isArray(r)) {
                    throw new Error(r);
                }
                renderAggridData(r);
            }).catch(console.warn)
    }, [renderAggridData, setRowData])

    function nextDay(d, dow){
        //dow - day of week - [0, 6]
        const newDate = new Date(d);
        newDate.setDate(d.getDate() + (dow+(7-d.getDay())) % 7);
        return newDate;
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

    const deleteUser = (id) => {
        fetch(`${Links.API}users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            }
        })
        .then(r => r.json())
        .then(result => {
            if (!result.id || !result.username) {
                return;
            }else{
                fetch(`${Links.API}users`)
                .then(r => r.json())
                .then(r => {
                    if(!Array.isArray(r)) {
                        throw new Error(r);
                    }
                    renderAggridData(r);
                }).catch(console.warn)
            }
        })
    }

    return (
        <div className="ag-theme-alpine" style={ {height: '500px', width: '95vw', textAlign:'left'} }>
            <AgGridReact rowData={rowData}>
                <AgGridColumn field="id" sortable={true} filter={true} ></AgGridColumn>
                <AgGridColumn field="username" sortable={true} filter={true} ></AgGridColumn>
                <AgGridColumn field="email" sortable={true} filter={true} ></AgGridColumn>
                <AgGridColumn field="fullname" sortable={true} filter={true} ></AgGridColumn>
                <AgGridColumn field="country" sortable={true} filter={true} ></AgGridColumn>
                <AgGridColumn field="project" sortable={true} filter={true} ></AgGridColumn>
                <AgGridColumn field="officed" sortable={true} filter={true} ></AgGridColumn>
                <AgGridColumn field="start"></AgGridColumn>
                <AgGridColumn field="end"></AgGridColumn>
                <AgGridColumn field="deleteUser" hide={!isAdmin} cellRendererFramework={(deleteUserId) => <Button className="main-button" onClick={() => deleteUser(parseInt(deleteUserId.value))}>Delete User</Button>}></AgGridColumn>
            </AgGridReact>
        </div>
    );
}