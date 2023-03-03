import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Links } from '../../common/links.enum';
import AuthContext, { getToken } from '../../providers/AuthContext';
import CallRendererBtn from './CallRendererBtn';
import './DetailProject.css'

export default function DetailProject( { history, match } ) {
    const projectId = match.params.id
    const [project, setProjectState] = useState({});
    const [error, setError] = useState(null);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const { isLoggedIn, isAdmin } = useContext(AuthContext);
    
    function renderAggridData(r, setFunc) {
        const agridData = r.map(u => {
            return {
                id: u.id,
                username: u.username,
                email: u.email,
                fullname: u.fullname,
                country: u.country,
                project: !!u.project ? u.project.title : 'None',
                assignUser: u.id 
            }
        });
        setFunc(agridData);
    }
    
    useEffect(() => {
        if(!isLoggedIn) {
            history.push('/home');
        }

        fetch(`${Links.API}projects/${projectId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            }
        })
        .then(r => r.json())
        .then(r => {
            if(r.statusCode && r.error) {
                setError(r.message);
            } else {
                setProjectState(r);
                renderAggridData(r.users, setAssignedUsers);

                fetch(`${Links.API}users/country/${r.office.country}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`
                    }
                })
                .then(r => r.json())
                .then(r => {
                    if(r.statusCode && r.error) {
                        setError(r.message);
                    } else {
                        renderAggridData(r.filter(e => !e.project), setAvailableUsers);
                    }
                })
            }
        })
        
    }, [setError, setProjectState, history, isLoggedIn, projectId])

    const finishProject = (e) => {
        e.preventDefault();
        fetch(`${Links.API}projects/${projectId}/finish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            }
        }).then(r => r.json())
        .then(r => {
            if(r.statusCode || r.error) {
                setError(r.message);
            } else {
                setProjectState(r);
            }
        })
    }

    const assignUser = (e, userId, setUserAssigned) => {
        fetch(`${Links.API}projects/${projectId}/users/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            }
        }).then(r => r.json())
        .then(r => {
            if(r.statusCode || r.error) {
                setError(r.message)
            } else {
                setUserAssigned(true)
            }
        })
    }


    return (
        <div>
            <div className={"container detail-project-container"}> 
                <Form className={"col-md-6 detail-project-form-1"}>
                <FontAwesomeIcon icon={faCogs} size={"5x"} color={"#8ECAE6"}></FontAwesomeIcon>
                    <h3 className="project-title">{project?.title}</h3>
                    <Form.Group className={`form-group`} style={{color: "white"}} controlId="formEmail">
                        <Form.Label>Description</Form.Label>
                        <Form.Control value={project?.description} disabled ></Form.Control>
                    </Form.Group>
                    { isAdmin && 
                        <Button variant="primary" disabled={project?.isFinished} type="submit" onClick={finishProject} className="btnSubmit" value="Register"  >
                            {project?.isFinished ? 'Project Finished' : 'Finish Project'}
                        </Button>
                    }
                    
                </Form>
                { error && 
                <div className="alert alert-danger" onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
                    {error}
                </div>
                }
            </div>
            <div hidden={project?.isFinished}>
                <h3 className="users-availibility">Assigned Users</h3>
                <div className="ag-theme-alpine" style={ {height: '300px', width: '95vw', textAlign: 'left', paddingBottom: '40px'} }>
                    <AgGridReact rowData={assignedUsers} >
                        <AgGridColumn field="id" sortable={true} filter={true} ></AgGridColumn>
                        <AgGridColumn field="username" sortable={true} filter={true} ></AgGridColumn>
                        <AgGridColumn field="email" sortable={true} filter={true} ></AgGridColumn>
                        <AgGridColumn field="fullname" sortable={true} filter={true} ></AgGridColumn>
                        <AgGridColumn field="country" sortable={true} filter={true} ></AgGridColumn>
                        <AgGridColumn field="project" sortable={true} filter={true} ></AgGridColumn>
                    </AgGridReact>
                </div>
                <h3 hidden={!isAdmin} className="users-availibility">Available Users</h3>
                <div className="ag-theme-alpine" hidden={!isAdmin} style={ {height: '300px', width: '95vw', textAlign: 'left', paddingBottom: '40px'} }>
                    <AgGridReact rowData={availableUsers} enableCellChangeFlash={true} >
                        <AgGridColumn field="id" sortable={true} filter={true} ></AgGridColumn>
                        <AgGridColumn field="username" sortable={true} filter={true} ></AgGridColumn>
                        <AgGridColumn field="email" sortable={true} filter={true} ></AgGridColumn>
                        <AgGridColumn field="fullname" sortable={true} filter={true} ></AgGridColumn>
                        <AgGridColumn field="country" sortable={true} filter={true} ></AgGridColumn>
                        <AgGridColumn field="project" sortable={true} filter={true} ></AgGridColumn>
                        <AgGridColumn field="assignUser" hide={!isAdmin} cellRendererFramework={({ value }) => <CallRendererBtn className= "main-button" value={value} assignUser={assignUser}/>}></AgGridColumn>
                    </AgGridReact>
                </div>
            </div>
        </div>
    )    
}