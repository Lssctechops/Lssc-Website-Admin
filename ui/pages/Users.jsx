"use client";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import { useEffect, useState } from "react";
import OverlayModal from "../common/OverlayModal";
import AddUsers from "../molecules/AddUsers";
import { useDispatch } from "react-redux";
import {
  deleteuserbyId,
  getalladmin,
  updateuserstatus,
} from "@/redux/slice/user-slice";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import SearchBox from "../common/SearchBox";
import { useToggleQueryParam } from "@/utils/toggleQueryParam";

const Users = ({ page, role, keyword }) => {
  const [isUser, setIsUser] = useState(false);
  const [userData, setUserData] = useState([]);
  const [count, setCount] = useState(0);
  const toggleQueryParam = useToggleQueryParam();

  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    userId: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [isClient, setIsClient] = useState(false); // To fix hydration mismatch

  const dispatch = useDispatch();

  const fetchUsers = async () => {
    const res = await dispatch(
      getalladmin({
        filter: { limit: 10, page, search: keyword, role: role || null },
      })
    );
    setUserData(res?.payload?.data || []);
    setCount(res?.payload?.count);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [dispatch, page, role, keyword]);

  // Filter users client side by name or mobile
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(userData);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = userData.filter(
        (user) =>
          (user?.name && user?.name.toLowerCase().includes(lowerQuery)) ||
          (user?.mobile && user?.mobile.toLowerCase().includes(lowerQuery))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, userData]);

  const handleDeleteConfirm = (userId) => {
    setConfirmDelete({ show: true, userId });
  };

  const handleDelete = async () => {
    if (!confirmDelete.userId) return;

    let res = await dispatch(deleteuserbyId(confirmDelete.userId));
    toast.success(res.payload.message);
    setConfirmDelete({ show: false, userId: null });
    fetchUsers();
  };

  const handleToggleStatus = async (userId, currentStatus, key) => {
    const payload = {
      userId,
      [key === "verify" ? "isVerified" : "isBlocked"]: !currentStatus,
    };
    await dispatch(updateuserstatus(payload));
    fetchUsers();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row justify-between">
        <div className="w-full lg:w-[35%] grid grid-cols-3 gap-4">
          <span className="col-span-2">{isClient && <SearchBox />}</span>
        </div>
      </div>
      <Select
        label="Filter by role"
        options={["admin", "trainer", "assessor", "user"]}
        name="role"
        value={role}
        onChange={(e) => toggleQueryParam("role", e.target.value)}
      />

      <div className="rounded-2xl space-y-6 p-6 bg-white shadow">
        <div className="px-4 flex justify-between">
          <h3 className="text-secondary font-bold text-2xl">User Management</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full  text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className=" px-4 py-2 text-left">Name</th>
                <th className=" px-4 py-2">Mobile No</th>
                <th className=" px-4 py-2">Role</th>
                <th className=" px-4 py-2">Verified</th>
                <th className=" px-4 py-2">Blocked</th>
                <th className=" px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className=" px-4 py-2 text-left">
                      {user?.name || "N/A"}
                    </td>
                    <td className=" px-4 py-2">{user?.mobile || "N/A"}</td>
                    <td className=" px-4 py-2">{user?.role || "N/A"}</td>

                    {/* Verified toggle */}
                    <td className=" px-4 py-2">
                      <div
                        className={`inline-flex items-center cursor-pointer w-12 h-6 rounded-full px-1 transition-colors duration-300 ${
                          user.isVerified ? "bg-green-500" : "bg-gray-300"
                        }`}
                        onClick={() =>
                          handleToggleStatus(
                            user._id,
                            user.isVerified,
                            "verify"
                          )
                        }
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            user.isVerified ? "translate-x-6" : ""
                          }`}
                        />
                      </div>
                    </td>

                    {/* Blocked toggle */}
                    <td className=" px-4 py-2">
                      <div
                        className={`inline-flex items-center cursor-pointer w-12 h-6 rounded-full px-1 transition-colors duration-300 ${
                          user.isBlocked ? "bg-red-500" : "bg-gray-300"
                        }`}
                        onClick={() =>
                          handleToggleStatus(user._id, user.isBlocked, "block")
                        }
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            user.isBlocked ? "translate-x-6" : ""
                          }`}
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className=" px-4 py-2 flex justify-center gap-3">
                      {/* <span className="cursor-pointer text-gray-600 hover:text-blue-600">
                        <i className="ri-edit-box-line ri-xl"></i>
                      </span> */}
                      <span
                        onClick={() => handleDeleteConfirm(user._id)}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                      >
                        <i className="ri-delete-bin-6-line ri-xl"></i>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination total={count} pageSize={10} />

      {/* Add User Modal */}
      {isUser && (
        <OverlayModal
          content={
            <AddUsers
              onClose={() => setIsUser(false)}
              onUserAdded={fetchUsers}
            />
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete.show && (
        <OverlayModal
          content={
            <div className="p-6 bg-white rounded-lg max-w-sm mx-auto text-center space-y-4">
              <h2 className="text-lg font-semibold">Confirm Deletion</h2>
              <p>Are you sure you want to delete this user?</p>
              <div className="flex justify-center cursor-default gap-6">
                <Button
                  label="Cancel"
                  style="bg-gray-300"
                  onClick={() =>
                    setConfirmDelete({ show: false, userId: null })
                  }
                />
                <Button
                  label="Delete"
                  style="bg-red-500 text-white"
                  onClick={handleDelete}
                />
              </div>
            </div>
          }
          onClose={() => setConfirmDelete({ show: false, userId: null })}
        />
      )}
    </section>
  );
};

export default Users;
