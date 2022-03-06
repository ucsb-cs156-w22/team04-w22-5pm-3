import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CreateCommonsForm from "main/components/Commons/CreateCommonsForm";
import { Navigate } from 'react-router-dom'
import { toast } from "react-toastify"

import { useBackendMutation } from "main/utils/useBackend";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import DisplayTable from "main/components/DisplayTable";
import commonsFixtures from "fixtures/commonsFixtures";
// const DisplayTable = () => {
//     return (
//         <header>Table Stub</header>
//     )
// }

// const dummyData = [
//     { name: 1, startingBalance: 1, cowPrice: "1", milkPrice: "1", startDate: "1", endDate: "1" },
//     { name: 2, startingBalance: 2, cowPrice: "2", milkPrice: "2", startDate: "2", endDate: "2" },
//     { name: 3, startingBalance: 3, cowPrice: "3", milkPrice: "3", startDate: "3", endDate: "3" },
//     { name: 4, startingBalance: 4, cowPrice: "4", milkprice: "4", startDate: "4", endDate: "4" },
// ];

const AdminDisplayTablePage = () => {
    return (
        <BasicLayout>
            <header>Admin Display Table Page</header>
            <DisplayTable commons={commonsFixtures.threeCommons} />
        </BasicLayout>
    )
}

export default AdminDisplayTablePage;