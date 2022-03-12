import React from "react";
import { Card } from "react-bootstrap";

function getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}

function getEndDate(timestamp) {
    function pad(n) { return n < 10 ? '0' + n : n; }
    // Convert timestamp to JavaScript Date object
    let end = new Date(timestamp);
    // Return desired formatting (YYYY-MM-DD)
    return `${end.getUTCFullYear()}-${pad(end.getUTCMonth()+1)}-${pad(end.getUTCDate())}`;
}

export default function CommonsOverview({ commons }) {
    let formattedEndDate = getEndDate(commons.endingDate);
    let now = new Date();
    let currentDay = getNumberOfDays(commons.startingDate, now);

    return (
        <Card data-testid="CommonsOverview">
            <Card.Header as="h5">Announcements</Card.Header>
            <Card.Body>
                <Card.Title data-testid="title">Today is day {currentDay}! This game will end on {formattedEndDate}.</Card.Title>
                <Card.Text>Total Players: {commons.totalPlayers}</Card.Text>
            </Card.Body>
        </Card>
    );
}; 

export { getNumberOfDays, getEndDate };