import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { useNavigate } from "react-router-dom";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/commonsUtils"

export default function DisplayTable({ commons }) {
    // Stryker disable ArrayDeclaration : [columns] and [students] are performance optimization; mutation preserves correctness

    // Edit:
    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/admin/editcommons/${cell.row.values.id}`)
    }

    // Delete: 
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        // Stryker disable next-line all: not need to test mutation for the next line
        ["/api/commons/all"],
    );
    const deleteCallback = async (cell) => {
        deleteMutation.mutate(cell);
    }

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
        }
    ];

    columns.push(ButtonColumn("Delete", "danger", deleteCallback, "DisplayTable")); //3rd param deleteCallback
    columns.push(ButtonColumn("Edit", "primary", editCallback, "DisplayTable"));
    // Stryker disable next-line ArrayDeclaration : [] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, []);
    const memoizedDates = React.useMemo(() => commons, [commons]);
    // Stryker enable ArrayDeclaration

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"DisplayTable"}
    />;
};