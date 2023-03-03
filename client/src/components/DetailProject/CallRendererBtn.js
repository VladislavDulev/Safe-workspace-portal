import React, { useState } from 'react';
import { Button } from 'react-bootstrap';


export default function CallRendererBtn({ value, assignUser }) {
    const [userAssigned, setUserAssigned] = useState(false);
    
    return <Button className= "main-button" disabled={userAssigned} onClick={(e) => assignUser(e, value, setUserAssigned)}>{userAssigned ? 'Assigned' : 'Assign User'}</Button>
}