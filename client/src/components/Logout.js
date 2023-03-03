import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { Links } from '../common/links.enum';
import AuthContext, { getToken } from '../providers/AuthContext';

export default function Logout({ history }){
    const { isLoggedIn, setLoginState } = useContext(AuthContext);
    const [error, setError] = useState();

    useEffect(() => {
        if (isLoggedIn) {
            fetch(`${Links.API}session`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                })
                .then(r => r.json())
                .then(result => {
                    if (result.statusCode % 100 !== 2 && result.message !== "You have been logged out!" ) {
                        throw result;
                    }

                    localStorage.clear('token');
                    setLoginState({
                        isLoggedIn: false,
                        isAdmin: false,
                        user: null
                      });
                })
                .catch((e) => setError(e.error));
        } else {
            history.push('/home')
        }
      }, [history, isLoggedIn, setLoginState, setError]);


      if(error) {
        return (
          <div className="alert alert-danger" onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
              <strong>{error}</strong>
          </div>
        )
      }


      return <Redirect to='/home' push={true}></Redirect>
}