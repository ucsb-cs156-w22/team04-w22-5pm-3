import React from "react";
import { Card } from "react-bootstrap";
import Cash from "./../../../assets/Cash.png";
import Health from "./../../../assets/Health.png";

const FarmStats = ({ userCommons }) => {
  return (
    <Card>
      <Card.Header as="h5">Your Farm Stats</Card.Header>
      <Card.Body>
        {/* update total wealth and cow health with data from fixture */}
        <Card.Text>
          You own {userCommons?.numCows} cows
        </Card.Text>
        <Card.Text>
          <img class="icon" src={Cash} alt="Cash"></img>
        </Card.Text>
        <Card.Text>
          Total Wealth: ${userCommons?.totalWealth?.toFixed(2)}
        </Card.Text>
        <Card.Text>
          <img class="icon" src={Health} alt="Health"></img>
        </Card.Text>
        <Card.Text>
          Cow Health: {parseFloat(userCommons?.cowHealth?.toFixed(2))}%
        </Card.Text>
        <Card.Text>
          <progress id="health" value={userCommons?.cowHealth}
                    max="100"></progress>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default FarmStats;
