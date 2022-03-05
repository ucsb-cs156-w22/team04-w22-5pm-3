import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import EditCommonsForm from "main/components/Commons/EditCommonsForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";


import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";


const AdminEditCommonsPage = () => {
    let { id } = useParams();

    const { data: commons, error: error, status: status } =
    useBackend(
        // Stryker disable next-line all : don't test internal caching of React Query
        [`/api/commons?id=${id}`],
        {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
            method: "GET",
            url: `/api/commons`,
            params: {
                id
            }
        }
    );

    const objectToAxiosPutParams = (commons) => ({
        url: "/api/commons/put",
        method: "PUT",
        params: {
            id: commons.id,
        },
        data: {
            name: commons.name,
            // data2: collegeSubreddit.data2
        }
    });

    const onSuccess = (commons) => {
        toast(`Commons Updated - id: ${commons.id} data1: ${commons.data1}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/commons?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess) {
        return <Navigate to="/commons/list" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Common</h1>
                {commons &&
                    <AdminCommonsEditForm initialCollegeSubreddit={collegeSubreddit} submitAction={onSubmit} />
                }
            </div>
        </BasicLayout>
    )
};

export default AdminEditCommonsPage;
