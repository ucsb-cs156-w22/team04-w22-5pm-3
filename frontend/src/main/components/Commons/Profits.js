import React from "react";
import { Card } from "react-bootstrap";
import ProfitsTable from "main/components/Commons/ProfitsTable"

// Helper function that accepts a timestamp and returns date as string
function format_date(s) {
    function pad(n) { return n < 10 ? '0' + n : n; }
    
    let d = new Date(s);
    
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;
}


const Profits = ({ userCommons, profits }) => {

    // Add "date" key to profits (derived from timestamp) to be displayed in table
    const formatted_profits = profits && profits.map(profit => ({
        date: format_date(profit.timestamp),
        ...profit
    }));

    return (
        <Card>
            <Card.Header as="h5">Profits</Card.Header>
            <Card.Body>
                {/* change 4am to admin-appointed time? And consider adding milk bottle as decoration */}
                <Card.Title>You will earn profits from milking your cows everyday at 4am.</Card.Title>
                {formatted_profits && <ProfitsTable profits={formatted_profits} />}
            </Card.Body>
        </Card>
    );
};

export default Profits;