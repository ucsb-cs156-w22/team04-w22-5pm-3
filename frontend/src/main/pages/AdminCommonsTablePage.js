import React from 'react'
import { useBackend } from 'main/utils/useBackend';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CreateCommonsForm from "main/components/Commons/CreateCommonsForm";
import { Navigate } from 'react-router-dom'
import { toast } from "react-toastify"

import { useBackendMutation } from "main/utils/useBackend";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import DisplayTable from "main/components/Commons/DisplayTable";
import commonsFixtures from "fixtures/commonsFixtures";

const AdminCommonsTablePage = () => {

    const { data: commons, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/commons/all"],
            { method: "GET", url: "/api/commons/all" },
            []
        );

    return (
        <BasicLayout>
            <header>Commons Table</header>
            <DisplayTable commons={commons} />
        </BasicLayout>
    )
}

export default AdminCommonsTablePage;