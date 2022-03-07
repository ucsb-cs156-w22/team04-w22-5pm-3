<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";

import AdminUsersPage from "main/pages/AdminUsersPage";
import AdminCreateCommonsPage from "main/pages/AdminCreateCommonsPage";
import AdminEditCommonsPage from "main/pages/AdminEditCommonsPage";
import { hasRole, useCurrentUser } from "main/utils/currentUser";
import PlayPage from "main/pages/PlayPage"; 


function App() {

  const { data: currentUser } = useCurrentUser();

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {
            hasRole(currentUser, "ROLE_ADMIN") && <Route path="/admin/users" element={<AdminUsersPage />} />
          }
          {
            hasRole(currentUser, "ROLE_ADMIN") && <Route path="/admin/createcommons" element={<AdminCreateCommonsPage />} />
          }
          {
            hasRole(currentUser, "ROLE_ADMIN") && <Route path="/admin/editcommons" element={<AdminEditCommonsPage />} />
          }
          <Route path="/play/:commonsId" element={<PlayPage />} /> 
        </Routes>
      </BrowserRouter>
  );
}

export default App;
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";

import AdminUsersPage from "main/pages/AdminUsersPage";
import AdminCreateCommonsPage from "main/pages/AdminCreateCommonsPage";
import AdminDisplayTablePage from "main/pages/AdminDisplayTablePage";
import { hasRole, useCurrentUser } from "main/utils/currentUser";
import PlayPage from "main/pages/PlayPage";


function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route path="/admin/createcommons" element={<AdminCreateCommonsPage />} />
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route path="/admin/displaytable" element={<AdminDisplayTablePage />} />
        }
        <Route path="/play/:commonsId" element={<PlayPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
>>>>>>> 0d96688b9e178aa0c6edba3d84c05e30eaaca4ac
