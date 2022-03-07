import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import EditCommonsForm from "main/components/Commons/EditCommonsForm";
import { Navigate } from 'react-router-dom'
import { toast } from "react-toastify"

import { useBackendMutation } from "main/utils/useBackend";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";


const AdminEditCommonsPage = () => {

    // const objectToAxiosParams = (newCommons) => ({
    //     url: "/api/commons/edit",
    //     method: "POST",
    //     data: newCommons
    // });

    // const onSuccess = (commons) => {
    //     toast(`Commons successfully edited! - id: ${commons.id} name: ${commons.name}`);
    // }

    // const mutation = useBackendMutation(
    //     objectToAxiosParams,
    //     { onSuccess },
    //     // Stryker disable next-line all : hard to set up test for caching
    //     ["/api/commons/all"]
    // );

    // const onSubmit = async (data) => {
    //     mutation.mutate(data);
    // }


    // if (mutation.isSuccess) {
    //     return <Navigate to="/" />
    // }

    return (
        <BasicLayout>
            <h2>Edit Commons</h2>
            <EditCommonsForm
                // onSubmit={onSubmit}
            />
        </BasicLayout>
    );
};

export default AdminEditCommonsPage;
