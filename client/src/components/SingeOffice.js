import React from "react";
import { Card, Button } from "react-bootstrap";
import { useHistory } from "react-router";

export default function SingleOffice({ office, authenticated, updateSchedule }) {
    const history = useHistory()
    const redirectToCreateProject = () => {
        history.push(`/offices/${office.id}/project/create`)
    }

    const redirectToPlanningPage = (later) => {
      history.push(`/offices/${office.id}/planning/${later}`)
    }

    return (
      <Card className='single-book mb-4'>
      <Card.Body>
      <Card.Title>{office.name}</Card.Title>
      <Card.Subtitle>{office.country}</Card.Subtitle>
      <Button variant="dark" className='office-button' onClick={() => redirectToPlanningPage('')}>See Current Planning </Button>
      <br></br>
      <Button variant="dark" className='office-button' onClick={() => redirectToPlanningPage('later')}>See Next Week Planning </Button>
      <br></br>
      {authenticated && <Button variant="dark" className='office-button' onClick={redirectToCreateProject}>Add project </Button>}
      <br></br>
      {authenticated && <Button variant="dark" className='office-button' onClick={() => updateSchedule(office.id)}>Update Schedule </Button>}
      </Card.Body>
    </Card>
  )
}