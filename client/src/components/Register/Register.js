import { faIdCardAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useContext, useEffect } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { CountryEnum } from '../../common/coutries.enum';
import { Limits } from '../../common/limits.enum';
import { Links } from '../../common/links.enum';
import AuthContext from '../../providers/AuthContext';
import './Register.css'

const Register = (props) => {
    const emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;const history = props.history;
    const { isLoggedIn } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [countries, setCountries] = useState([])

    useEffect(() => {
      if (isLoggedIn) {
        history.push('/home');
      }
      fetch(`${Links.API}offices/countries`)
        .then(r => r.json())
        .then(r => {
          setCountries(r.map(c => Object.keys(CountryEnum).find(e => CountryEnum[e] === c)));
        })
  
    }, [history, isLoggedIn]);
  
    const [user, setUserObject] = useState({
      username: {
        value: '',
        touched: false,
        valid: false,
      },
      email: {
        value: '',
        touched: false,
        valid: false,
      },
      fullname: {
        value: '',
        touched: false,
        valid: false,
      },
      country:{
        value: '',
        touched: false,
        valid: false
      },
      password: {
        value: '',
        touched: false,
        valid: false,
      },
      repeatPassword: {
        value: '',
        touched: false,
        valid: false,
      }
    });

    const userValidators = {
      username: [
        value => value?.length >= Limits.MIN_USERNAME_LENGTH || `Username should be at least ${Limits.MIN_USERNAME_LENGTH} letters.`, 
        value => value?.length <= Limits.MAX_USERNAME_LENGTH || `Username should be no more than ${Limits.MAX_USERNAME_LENGTH} letters.`,
      ],
      fullname: [
        value => value?.length >= Limits.MIN_FULLNAME_LENGTH || `Fullname should be at least ${Limits.MIN_FULLNAME_LENGTH} letters.`, 
        value => value?.length <= Limits.MAX_FULLNAME_LENGTH || `Fullname should be no more than ${Limits.MAX_FULLNAME_LENGTH} letters.`,
      ],
      email: [
        value => emailRE.test(value) || `Not a valid email.`, 
      ],
      country: [
        value => Object.keys(CountryEnum).some(e => CountryEnum[e] === value) || `Not a valid country.`, 
      ],
      password: [
        value => value?.length >= Limits.MIN_PASSWORD_LENGTH || `Password should be at least ${Limits.MIN_PASSWORD_LENGTH} letters.`,
        value => value?.length <= Limits.MAX_PASSWORD_LENGTH || `Password should be no more than ${Limits.MAX_PASSWORD_LENGTH} letters.`,
      ],
      repeatPassword: [
        (value) => value === user.password.value || 'Passwords do not match', 
      ],
    };
  
    const updateUser = (prop, value) => setUserObject({
      ...user,
      [prop]: {
        value,
        touched: true,
        valid: userValidators[prop].reduce((isValid, validatorFn) => isValid && (typeof validatorFn(value) !== 'string'), true),
      }
    });
      
    const validateForm = () => !Object
      .keys(user)
      .reduce((isValid, prop) => isValid && user[prop].valid && user[prop].touched , true);
  
    const getClassNames = (prop) => {
      let classes = '';
      if (user[prop].touched) {
        classes += 'touched '
      }
      if (user[prop].valid) {
        classes += 'is-valid ';
      } else {
        classes += 'is-invalid ';
      }
    
      return classes;
    };

    const getValidationErrors = (prop) => {
      return userValidators[prop]
        .map(validatorFn => validatorFn(user[prop].value)) 
        .filter(value => typeof value === 'string');
    };

    const register = (e) => {
      e.preventDefault();
      fetch(`${Links.API}users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username.value,
          fullname: user.fullname.value,
          country: user.country.value,
          email: user.email.value,
          password: user.password.value,
          repeatpassword: user.repeatPassword.value,
        }),
      })
        .then(r => r.json())
        .then(result => {
          if (!result.username) {
            return setError(`Couldn't register. ${result.message}`);
          }else {
            history.push('/login');
          }
  
        })
      };


    return (
      <div className={"container login-container"}>
        <Form className={"col-md-6 login-form-1"}>
        <FontAwesomeIcon icon={faIdCardAlt} size={"3x"} color={"#8ECAE6"}></FontAwesomeIcon>
        <h3 className="register-user">Register</h3>
            <Form.Group className={`form-group`} style={{color: "white"}} controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control required={true} className={`form-control ${getClassNames('username')}`} placeholder="Your Username *" value={user.username.value} onChange={e => updateUser('username', e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group className={`form-group`} style={{color: "white"}} controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control required={true} className={`form-control ${getClassNames('email')}`} placeholder="Your Email *" value={user.email.value} onChange={e => updateUser('email', e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group className={`form-group`} style={{color: "white"}} controlId="formFullname">
              <Form.Label>Fullname</Form.Label>
              <Form.Control required={true} className={`form-control ${getClassNames('fullname')}`} placeholder="Your Full Name *" value={user.fullname.value} onChange={e => updateUser('fullname', e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="formCountry" style={{color: "white"}} >
              <Form.Label>Country</Form.Label>
              <Form.Control as="select" required value={user.country.value} onChange={e => updateUser('country', e.target.value)}>
                <option value={Limits.UNSELECTED}>Please choose a country</option>
                {countries.map((e, i) => <option key={`country-${i}`} value={CountryEnum[e]}>{e}</option>)}
              </Form.Control>
            </Form.Group>
    
            <Form.Group controlId="formPassword" style={{color: "white"}} >
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" required={true} className={`form-control ${getClassNames('password')}`} placeholder="Your Password *" value={user.password.value} onChange={e => updateUser('password', e.target.value)} ></Form.Control>
            </Form.Group>

            <Form.Group controlId="formRepeatPassword" style={{color: "white"}} >
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control type="password" required={true} className={`form-control ${getClassNames('repeatPassword')}`} placeholder="Repeat Password *" value={user.repeatPassword.value} onChange={e => updateUser('repeatPassword', e.target.value)} ></Form.Control>
            </Form.Group>
            <Button variant="primary" disabled={validateForm()} type="submit" className="btnSubmit" value="Register" onClick={register} >
              Submit
            </Button>
         </Form>
         {error && 
          <Alert variant='danger'>
            {error};
          </Alert>
        }
         <div className="alert alert-danger" hidden={!validateForm()} onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
              {Object.keys(user).map(key => getValidationErrors(key)).join('\n')}
            </div>
        </div>
        
    )
};

export default Register;