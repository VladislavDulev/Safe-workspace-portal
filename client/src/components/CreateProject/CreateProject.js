import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './CreateProject.css'
import { Limits } from '../../common/limits.enum';
import { Links } from '../../common/links.enum';
import AuthContext, { getToken } from '../../providers/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';

export default function CreateProject({ history, match }) {
    const { isLoggedIn , isAdmin } = useContext(AuthContext);

    useEffect(() => {
        if(!isLoggedIn || !isAdmin) {
            history.pushState('/home')
        }
    }, []);

    const [error, setError] = useState(null);
  
    const [project, setProjectObject] = useState({
      title: {
        value: '',
        touched: false,
        valid: false,
      },
      description: {
        value: '',
        touched: false,
        valid: false,
      },
      isImportant: {
        value: false,
        touched: true,
        valid: true,
      },
    });

    const projectValidators = {
      title: [
        value => value?.length >= Limits.MIN_PROJECT_NAME_LENGTH || `Name should be at least ${Limits.MIN_PROJECT_NAME_LENGTH} letters.`, 
        value => value?.length <= Limits.MAX_PROJECT_NAME_LENGTH || `Name should be no more than ${Limits.MAX_PROJECT_NAME_LENGTH} letters.`,
      ],
      description: [
        value => value?.length >= Limits.MIN_PROJECT_DESCRIPTION_LENGTH || `Description should be at least ${Limits.MIN_PROJECT_DESCRIPTION_LENGTH} letters.`, 
        value => value?.length <= Limits.MAX_PROJECT_DESCRIPTION_LENGTH || `Description should be no more than ${Limits.MAX_PROJECT_DESCRIPTION_LENGTH} letters.`,
      ],
      isImportant: [
        value => value || !value || `Is important should be bool .`, 
      ],
    };
  
    const updateProject = (prop, value) => setProjectObject({
      ...project,
      [prop]: {
        value,
        touched: true,
        valid: projectValidators[prop].reduce((isValid, validatorFn) => isValid && (typeof validatorFn(value) !== 'string'), true),
      }
    });
      
    const validateForm = () => !Object
      .keys(project)
      .reduce((isValid, prop) => isValid && project[prop].valid && project[prop].touched , true);
  
    const getClassNames = (prop) => {
      let classes = '';
      if (project[prop].touched) {
        classes += 'touched '
      }
      if (project[prop].valid) {
        classes += 'is-valid ';
      } else {
        classes += 'is-invalid ';
      }
    
      return classes;
    };

    const getValidationErrors = (prop) => {
      return projectValidators[prop]
        .map(validatorFn => validatorFn(project[prop].value)) 
        .filter(value => typeof value === 'string');
    };

    const createProject = (e) => {
      const officeId = match.params.id
      e.preventDefault();
      fetch(`${Links.API}offices/${officeId}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
            title: project.title.value,
            description: project.description.value,
            isImportant: project.isImportant.value,
        }),
      })
        .then(r => r.json())
        .then(result => {
          if (!result.title) {
            return setError(`Couldn't create office. ${result.message}`);
          }else {
            history.push('/offices');
          }
        })
      };

    return (
      <div className={"container create-project-container"}>
        <Form className={"col-md-6 create-project-form-1"}>
        <FontAwesomeIcon icon={faFolderPlus} size={"5x"} color={"#8ECAE6"}></FontAwesomeIcon>
        <h3 className="create-project">Create a Project</h3>
            <Form.Group className={`form-group`} style={{color: "white"}} controlId="formName">
              <Form.Label>Title</Form.Label>
              <Form.Control required={true} className={`form-control ${getClassNames('title')}`} placeholder="Project Title *" value={project.title.value} onChange={e => updateProject('title', e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group className={`form-group`} style={{color: "white"}} controlId="formEmail">
              <Form.Label>Description</Form.Label>
              <Form.Control required={true} className={`form-control ${getClassNames('description')}`} placeholder="Project Description *" value={project.description.value} onChange={e => updateProject('description', e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="formCountry" style={{color: "white"}} >
              <Form.Label>Is Important</Form.Label>
              <Form.Check defaultChecked={false} value={project.isImportant.value} onChange={e => updateProject('isImportant', e.target.checked)}></Form.Check>
            </Form.Group>
            <Button variant="primary" disabled={validateForm()} type="submit" className="btnSubmit" value="Register" onClick={createProject} >
              Submit
            </Button>
         </Form>
         <div className="alert alert-danger" hidden={!validateForm()} onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
              {Object.keys(project).map(key => getValidationErrors(key)).join('\n')}
              {error}
            </div>
        </div>  
    )
}