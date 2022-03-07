import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import React from "react";
import { Card } from "react-bootstrap";
import Cash from "./../../../assets/Cash.png";
import Health from "./../../../assets/Health.png";

const FarmStats = ({userCommons}) => {
   
    return (
        <Card>
        <Card.Header as="h5"><strong><center>Your Farm Stats</center></strong></Card.Header>
        <Card.Body>
            {/* update total wealth and cow health with data from fixture */}
            <Card.Text>
                <center><img src={Cash} alt="Cash" width="250" height="250"></img></center>
            </Card.Text>
            <Card.Text>
                <center>Total Wealth: ${userCommons?.totalWealth}</center>
            </Card.Text>
            <Card.Text>
                <center><img src={Health} alt="Health" width="250" height="250"></img></center>
            </Card.Text>
            <Card.Text>
                <center>Cow Health: {userCommons?.cowHealth}%</center>
            </Card.Text>
            <Card.Text>
                <center><progress id="health" value={userCommons?.cowHealth} max="100"></progress></center>
            </Card.Text>
        </Card.Body>
        </Card>
    ); 
}; 

export default FarmStats; 