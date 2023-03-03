import React, { useContext, useEffect, useState } from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import { Links } from '../common/links.enum';
import { Button } from 'react-bootstrap';
import AuthContext, { getToken } from '../providers/AuthContext';


export default function Projects({ history, match }) {
    const [rowData, setRowData] = useState([]);
    const {isLoggedIn} = useContext(AuthContext);
    
    function renderAggridData(r) {
        const agridData = r.map(p => {
            return {
                id: p.id,
                title: p.title,
                isImportant: p.isImportant ? 'Yes' : 'No',
                office: p.office.name,
                seeMore: p.id,
                isFinished: p.isFinished ? 'Yes' : 'No'
            }
        });
        setRowData(agridData);
    }

    useEffect(() => {
        if(!isLoggedIn) {
            history.push('/home');
        }
        fetch(`${Links.API}projects`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then(r => r.json())
            .then(r => {
                if(!Array.isArray(r)) {
                    throw new Error(r);
                }
                renderAggridData(r);
            }).catch(console.warn)
    }, [renderAggridData])

    return (
        <div className="ag-theme-alpine" style={ {height: '500px', width: '95vw', textAlign: 'left'} }>
            <AgGridReact rowData={rowData}>
                <AgGridColumn field="id" sortable={true} filter={true} ></AgGridColumn>
                <AgGridColumn field="title" sortable={true} filter={true} ></AgGridColumn>
                <AgGridColumn field="isFinished" sortable={true} filter={true} ></AgGridColumn>
                <AgGridColumn field="isImportant" sortable={true} filter={true} ></AgGridColumn>
                <AgGridColumn field="office" sortable={true} filter={true} ></AgGridColumn>
                <AgGridColumn field="seeMore" cellRendererFramework={({value}) => <Button className="main-button" onClick={() => history.push(`/projects/${value}`)}>See more</Button>}></AgGridColumn>
            </AgGridReact>
        </div>
    );
}