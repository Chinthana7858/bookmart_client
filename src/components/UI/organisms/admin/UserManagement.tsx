import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import PaginationControls from "../../atoms/PaginationControls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useGetUsersPaginatedQuery } from "../../../../services/bookmartApi";
import { ADMIN_PAGE_SIZE } from "../../../../features/admin/adminConstants";

type UserRoleTab = "user" | "admin";

const roleTabs: Array<{ label: string; value: UserRoleTab; description: string }> = [
  {
    label: "Customers",
    value: "user",
    description: "Registered buyer accounts and profile details.",
  },
  {
    label: "Admins",
    value: "admin",
    description: "Administrative accounts with console access.",
  },
];

function formatGender(value?: string | null) {
  return value ? value.split("_").join(" ") : "Not provided";
}

export default function UserManagement() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRole, setActiveRole] = useState<UserRoleTab>("user");
  const activeTab = roleTabs.find((tab) => tab.value === activeRole) ?? roleTabs[0];
  const { data, isLoading: loading } = useGetUsersPaginatedQuery({
    skip: (currentPage - 1) * ADMIN_PAGE_SIZE,
    limit: ADMIN_PAGE_SIZE,
    role: activeRole,
  });
  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [activeRole]);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-stone-950">User List</h1>
        <p className="mt-1 text-sm text-stone-500">
          Review customer and administrator accounts separately.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2 border-b border-stone-200">
        {roleTabs.map((tab) => {
          const isActive = activeRole === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              className={`cursor-pointer border-b-2 px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-stone-500 hover:text-stone-950"
              }`}
              onClick={() => setActiveRole(tab.value)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mb-4 rounded-md border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-stone-600">
        {activeTab.description}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : users.length === 0 ? (
        <div className="surface py-12 text-center text-stone-500">
          No {activeTab.label.toLowerCase()} found.
        </div>
      ) : (
        <>
          <div className="bookmart-table overflow-x-auto sm:rounded-lg">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Name</TableHeadCell>
                  <TableHeadCell>Email</TableHeadCell>
                  <TableHeadCell>Phone</TableHeadCell>
                  <TableHeadCell>Gender</TableHeadCell>
                  <TableHeadCell>Action</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer bg-white"
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    <TableCell className="font-medium text-gray-900">
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {[user.phone_country_code, user.phone_number]
                        .filter(Boolean)
                        .join(" ") || "Not provided"}
                    </TableCell>
                    <TableCell>{formatGender(user.gender)}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="cursor-pointer font-semibold text-primary transition hover:text-primarydark hover:underline"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/admin/users/${user.id}`);
                        }}
                      >
                        View details
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
