import React, { useContext, useEffect, useState } from 'react';
import './CreateOffice.css'
import { Alert, Button, Form } from 'react-bootstrap';
import { CountryEnum } from '../../common/coutries.enum';
import { Limits } from '../../common/limits.enum';
import { Links } from '../../common/links.enum';
import AuthContext, { getToken } from '../../providers/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopHouse } from '@fortawesome/free-solid-svg-icons';

export default function CreateOffice({ history }) {
    const { isLoggedIn , isAdmin } = useContext(AuthContext);

    useEffect(() => {
        if(!isLoggedIn || !isAdmin) {
            history.pushState('/home')
        }
    }, []);

    const [error, setError] = useState(null);
  
    const [office, setOfficeObject] = useState({
      country: {
        value: '',
        touched: false,
        valid: false,
      },
      deskPerCol: {
        value: '',
        touched: false,
        valid: false,
      },
      deskPerRow: {
        value: '',
        touched: false,
        valid: false,
      },
      rows: {
        value: '',
        touched: false,
        valid: false,
      },
      columns:{
        value: '',
        touched: false,
        valid: false
      },
      distanceBetweenRows: {
        value: '',
        touched: false,
        valid: false,
      },
      distanceBetweenCols: {
        value: '',
        touched: false,
        valid: false,
      },
      name: {
          value:'',
          touched: false,
          valid: false
      }
    });

    const officeValidators = {
      name: [
        value => value?.length >= Limits.MIN_OFFICE_NAME_LENGTH || `Name should be at least ${Limits.MIN_USERNAME_LENGTH} letters.`, 
        value => value?.length <= Limits.MAX_OFFICE_NAME_LENGTH || `Name should be no more than ${Limits.MAX_USERNAME_LENGTH} letters.`,
      ],
      deskPerCol: [
        value => value >= Limits.MIN_OFFICE_DESK_PER_COL || `Desks per column should be at least ${Limits.MIN_OFFICE_DESK_PER_COL}.`, 
        value => value <= Limits.MAX_OFFICE_DESK_PER_COL || `Desks per column should be no more than ${Limits.MAX_OFFICE_DESK_PER_COL}.`,
      ],
      deskPerRow: [
        value => value >= Limits.MIN_OFFICE_DESK_PER_ROW || `Desks per row should be at least ${Limits.MIN_OFFICE_DESK_PER_ROW}.`, 
        value => value <= Limits.MAX_OFFICE_DESK_PER_ROW || `Desks per row should be no more than ${Limits.MAX_OFFICE_DESK_PER_ROW}.`,
      ],
      country: [
        value => Object.keys(CountryEnum).some(e => CountryEnum[e] === value) || `Not a valid country.`, 
      ],
      rows: [
        value => value >= Limits.MIN_OFFICE_ROWS || `Rows should be more than ${Limits.MIN_OFFICE_ROWS}.`, 
        value => value <= Limits.MAX_OFFICE_ROWS || `Rows should be less than ${Limits.MAX_OFFICE_ROWS}.`, 
      ],
      columns: [
        value => value >= Limits.MIN_OFFICE_COLS || `Columns should be more than ${Limits.MIN_OFFICE_COLS}.`, 
        value => value <= Limits.MAX_OFFICE_COLS || `Columns should be less than ${Limits.MAX_OFFICE_COLS}.`, 
      ],
      distanceBetweenRows: [
        value => value >= Limits.MIN_ROW_COL_DISTANCE || `Row distance should be at least ${Limits.MIN_ROW_COL_DISTANCE}.`,
        value => value <= Limits.MAX_ROW_COL_DISTANCE || `Row distance should be no more than ${Limits.MAX_ROW_COL_DISTANCE}.`,
      ],
      distanceBetweenCols: [
        value => value >= Limits.MIN_ROW_COL_DISTANCE || `Column distance should be at least ${Limits.MIN_ROW_COL_DISTANCE}.`,
        value => value <= Limits.MAX_ROW_COL_DISTANCE || `Column distance should be no more than ${Limits.MAX_ROW_COL_DISTANCE}.`,
      ],
    };
  
    const updateOffice = (prop, value) => setOfficeObject({
      ...office,
      [prop]: {
        value,
        touched: true,
        valid: officeValidators[prop].reduce((isValid, validatorFn) => isValid && (typeof validatorFn(value) !== 'string'), true),
      }
    });
      
    const validateForm = () => !Object
      .keys(office)
      .reduce((isValid, prop) => isValid && office[prop].valid && office[prop].touched , true);
  
    const getClassNames = (prop) => {
      let classes = '';
      if (office[prop].touched) {
        classes += 'touched '
      }
      if (office[prop].valid) {
        classes += 'is-valid ';
      } else {
        classes += 'is-invalid ';
      }
    
      return classes;
    };

    const getValidationErrors = (prop) => {
      return officeValidators[prop]
        .map(validatorFn => validatorFn(office[prop].value)) 
        .filter(value => typeof value === 'string');
    };

    const createOffice = (e) => {
      e.preventDefault();
      fetch(`${Links.API}offices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
            name: office.name.value,
            deskPerCol: office.deskPerCol.value,
            deskPerRow: office.deskPerRow.value,
            country: office.country.value,
            rows: office.rows.value,
            columns: office.columns.value,
            distanceBetweenRows: office.distanceBetweenRows.value,
            distanceBetweenCols: office.distanceBetweenCols.value,
        }),
      })
        .then(r => r.json())
        .then(result => {
          if (result.error || result.statusCode) {
            setError(`Couldn't create office. ${result.message}`);
          }else {
            history.push('/home');
          }
        }).catch(e => console.log(e));
      };

    return (
      <div className={"container create-office-container"}>
        <Form className={"col-md-6 create-office-form-1"}>
        <FontAwesomeIcon icon={faLaptopHouse} size={"5x"} color={"#8ECAE6"}></FontAwesomeIcon>
        <h3 className="create-office">Create an Office</h3>
            <Form.Group className={`form-group`} style={{color: "white"}} controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control required={true} className={`form-control ${getClassNames('name')}`} placeholder="Office Name *" value={office.name.value} onChange={e => updateOffice('name', e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="formCountry" style={{color: "white"}} >
              <Form.Label>Country</Form.Label>
              <Form.Control as="select" required value={office.country.value} onChange={e => updateOffice('country', e.target.value)}>
                <option value={Limits.UNSELECTED}>Please choose a country</option>
                {Object.keys(CountryEnum).map((e, i) => <option key={`country-${i}`} value={CountryEnum[e]}>{e}</option>)}
              </Form.Control>
            </Form.Group>

            <Form.Group className={`form-group`} style={{color: "white"}} controlId="formFullname">
              <Form.Label>Rows</Form.Label>
              <Form.Control required={true} className={`form-control ${getClassNames('rows')}`} placeholder="Office Rows *" value={office.rows.value} onChange={e => updateOffice('rows', e.target.value)}></Form.Control>
            </Form.Group>
    
            <Form.Group controlId="formPassword" style={{color: "white"}} >
              <Form.Label>Columns</Form.Label>
              <Form.Control required={true} className={`form-control ${getClassNames('columns')}`} placeholder="Office Columns *" value={office.columns.value} onChange={e => updateOffice('columns', e.target.value)} ></Form.Control>
            </Form.Group>

            <Form.Group className={`form-group`} style={{color: "white"}} controlId="formEmail">
              <Form.Label>Desks per Column</Form.Label>
              <Form.Control required={true} className={`form-control ${getClassNames('deskPerCol')}`} placeholder="Desks Per Column *" value={office.deskPerCol.value} onChange={e => updateOffice('deskPerCol', e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group className={`form-group`} style={{color: "white"}} controlId="formEmail">
              <Form.Label>Desks per Row</Form.Label>
              <Form.Control required={true} className={`form-control ${getClassNames('deskPerRow')}`} placeholder="Desks Per Row *" value={office.deskPerRow.value} onChange={e => updateOffice('deskPerRow', e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="formRepeatPassword" style={{color: "white"}} >
              <Form.Label>Distance between Rows</Form.Label>
              <Form.Control required={true} className={`form-control ${getClassNames('distanceBetweenRows')}`} placeholder="Distance *" value={office.distanceBetweenRows.value} onChange={e => updateOffice('distanceBetweenRows', e.target.value)} ></Form.Control>
            </Form.Group>

            <Form.Group controlId="formRepeatPassword" style={{color: "white"}} >
              <Form.Label>Distance between Cols</Form.Label>
              <Form.Control required={true} className={`form-control ${getClassNames('distanceBetweenCols')}`} placeholder="Distance *" value={office.distanceBetweenCols.value} onChange={e => updateOffice('distanceBetweenCols', e.target.value)} ></Form.Control>
            </Form.Group>
            <Button className="btnSubmit" variant="primary" disabled={validateForm()} type="submit" value="Register" onClick={createOffice} >
              Submit
            </Button>
         </Form>
         { error &&
            <Alert variant='danger'>
              {error}
            </Alert>
         }
         <div className="alert alert-danger" hidden={!validateForm() || error} onClick={() => setError(null)} style={{margin:'auto', maxWidth:'600px', padding: ' 20px'}}>
              {Object.keys(office).map(key => getValidationErrors(key)).join('\n')}
            </div>
        </div>  
    )
}

/**

    country:

    rows: number;

    columns: number;

    distanceBetweenRows: number;

    distanceBetweenCols: number;
 */