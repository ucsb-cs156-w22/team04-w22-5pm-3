import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import React from "react";
import { Card } from "react-bootstrap";
import Cash from "./../../../assets/Cash.png";

const FarmStats = ({userCommons}) => {
   
    return (
        <Card>
        <Card.Header as="h5">Your Farm Stats</Card.Header>
        <Card.Body>
            {/* update total wealth and cow health with data from fixture */}
            <Card.Text>
                {/* test */}
                <img src={Cash} alt="Cash" width="250" height="250"></img> 
            </Card.Text>
            <Card.Text>
                Total Wealth: ${userCommons?.totalWealth}
            </Card.Text>
            <Card.Text>
                [ADD PIC HERE] 
            </Card.Text>
            <Card.Text>
                Cow Health: {userCommons?.cowHealth}%
            </Card.Text>
        </Card.Body>
        </Card>
    ); 
}; 

export default FarmStats; 