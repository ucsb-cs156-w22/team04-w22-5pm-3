import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CreateCommonsForm from "main/components/Commons/CreateCommonsForm";
import { Navigate } from 'react-router-dom'
import { toast } from "react-toastify"

import { useBackendMutation } from "main/utils/useBackend";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const DisplayTable = () => {
    return (
        <header>Table Stub</header>
    )
}

const AdminDisplayTablePage = () => {
    return (
        <BasicLayout>
            <header>Admin Display Table Page</header>
            <DisplayTable />
        </BasicLayout>
    )
}

export default AdminDisplayTablePage;