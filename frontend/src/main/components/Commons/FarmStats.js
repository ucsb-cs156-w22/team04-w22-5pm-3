import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import React from "react";
import { Card } from "react-bootstrap";
import Cash from "./../../../assets/Cash.png";
import Health from "./../../../assets/Health.png";

const FarmStats = ({userCommons}) => {
   
    return (
        <Card>
        <Card.Header as="h5"><strong>Your Farm Stats</strong></Card.Header>
        <Card.Body>
            {/* update total wealth and cow health with data from fixture */}
            <Card.Text>
                <img src={Cash} alt="Cash" width="250" height="250"></img>
            </Card.Text>
            <Card.Text>
                Total Wealth: ${userCommons?.totalWealth}
            </Card.Text>
            <Card.Text>
                <img src={Health} alt="Health" width="250" height="250"></img>
            </Card.Text>
            <Card.Text>
                Cow Health: {userCommons?.cowHealth}%
            </Card.Text>
            <Card.Text>
                <progress id="health" value={userCommons?.cowHealth} max="100"></progress>
            </Card.Text>
        </Card.Body>
        </Card>
    ); 
}; 

export default FarmStats; 