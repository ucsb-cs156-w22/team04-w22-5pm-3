import React from "react";
import { Card } from "react-bootstrap";
import moment from "moment";

function getStartDate(timestamp) {
    return moment(timestamp).format('YYYY-MM-DD');
}

function getEndDate(timestamp, duration) {
    return moment(timestamp).add(duration+1,'days').format('MM/DD/YYYY');
}

export default function CommonsOverview({ commons }) {
    var currentDay = moment();
    var startDate = getStartDate(commons.startDate);
    var endDate = getEndDate(commons.startDate, commons.duration);
    currentDay = currentDay.diff(startDate, 'days');
    return (
        <Card data-testid="CommonsOverview">
            <Card.Header as="h5">Announcements</Card.Header>
            <Card.Body>
                <Card.Title>Today is day {currentDay}! This game will end on {endDate}.</Card.Title>
                <Card.Text>Total Players: {commons.totalPlayers}</Card.Text>
            </Card.Body>
        </Card>
    );
}; 