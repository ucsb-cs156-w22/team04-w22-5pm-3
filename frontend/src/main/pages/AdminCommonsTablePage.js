import React from 'react'
import { useBackend } from 'main/utils/useBackend';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CreateCommonsForm from "main/components/Commons/CreateCommonsForm";
import { Navigate } from 'react-router-dom'
import { toast } from "react-toastify"

import { useBackendMutation } from "main/utils/useBackend";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import AdminCommonsTable from "main/components/Commons/AdminCommonsTable";
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
            <AdminCommonsTable commons={commons} />
        </BasicLayout>
    )
}

export default AdminCommonsTablePage;