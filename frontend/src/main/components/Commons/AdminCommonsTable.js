import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { useNavigate } from "react-router-dom";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/commonsUtils"

export default function AdminCommonsTable({ commons }) {
    // Stryker disable ArrayDeclaration : [columns] and [students] are performance optimization; mutation preserves correctness

    const columns = [
        {
            Header: "ID#",
            accessor: "id",
        },
        {
            Header: "Name",
            accessor: "name",
        },
        {
            Header: "Starting Balance",
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
            accessor: "startingDate",
        },

    ];

    const memoizedColumns = React.useMemo(() => columns, []);
    const memoizedDates = React.useMemo(() => commons, [commons]);
    // Stryker enable ArrayDeclaration

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"AdminCommonsTable"}
    />;
};
