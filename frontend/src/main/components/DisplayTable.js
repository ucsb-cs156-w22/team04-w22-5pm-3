import React from "react";
import OurTable from "main/components/OurTable";

export default function DisplayTable({ commons }) {
    // Stryker disable ArrayDeclaration : [columns] and [students] are performance optimization; mutation preserves correctness
    const memoizedColumns = React.useMemo(() =>
        [
            {
                Header: "ID",
                accessor: "id",
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Starting balance",
                accessor: "startingBalance",
            },
            {
                Header: "Cow Price",
                accessor: "cowPrice",
            },
            {
                Header: "Milk Price",
                accessor: "milkPrice",
            },
            {
                Header: "Start Date",
                accessor: "startDate",
            },
            // {
            //     Header: "End Date",
            //     accessor: "endDate",
            // }
        ],
        []);
    const memoizedDates = React.useMemo(() => commons, [commons]);
    // Stryker enable ArrayDeclaration

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"DisplayTable"}
    />;
};