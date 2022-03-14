import React from "react";
import { Card } from "react-bootstrap";
import Cash from "./../../../assets/Cash.png";
import Health from "./../../../assets/Health.png";

const FarmStats = ({ userCommons }) => {
  let cowHealth = "Loading...";
  let totalWealth = "Loading...";
  try {
    cowHealth = parseFloat(userCommons.cowHealth.toFixed(2));
  } catch (error) {
    console.error(error);
    console.error(userCommons);
  }
  try {
    totalWealth = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(userCommons.totalWealth);
  } catch (error) {
    console.error(error);
    console.error(userCommons);
  }
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
          Total Wealth: {totalWealth}
        </Card.Text>
        <Card.Text>
          <img class="icon" src={Health} alt="Health"></img>
        </Card.Text>
        <Card.Text>
          Cow Health: {cowHealth}%
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
