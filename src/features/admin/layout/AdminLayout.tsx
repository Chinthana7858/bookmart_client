import { useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiBarChart2,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiShoppingBag,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../../auth";
import ConfirmModal from "../../../components/UI/molecules/modals/ConfirmModal";
import logo from "../../../assets/logo.png";
import { ADMIN_TAB_IDS, type AdminTabId } from "../adminConstants";
import { adminTabs } from "../adminTabs";

type AdminLayoutProps = {
  activeTabId?: AdminTabId;
  children: ReactNode;
};

export default function AdminLayout({ activeTabId, children }: AdminLayoutProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const activeTabConfig = useMemo(
    () => adminTabs.find((tab) => tab.id === activeTabId) ?? adminTabs[0],
    [activeTabId]
  );

  const renderTabIcon = (tabId: AdminTabId, isActive: boolean) => {
    const className = `h-5 w-5 shrink-0 ${
      isActive ? "text-primarydark" : "text-stone-400 group-hover:text-primary"
    }`;

    switch (tabId) {
      case ADMIN_TAB_IDS.books:
        return <FiBookOpen className={className} />;
      case ADMIN_TAB_IDS.dashboard:
        return <FiBarChart2 className={className} />;
      case ADMIN_TAB_IDS.categories:
        return <FiGrid className={className} />;
      case ADMIN_TAB_IDS.orders:
        return <FiShoppingBag className={className} />;
      case ADMIN_TAB_IDS.users:
        return <FiUsers className={className} />;
      default:
        return null;
    }
  };

  const openNavigation = () => {
    setMobileDrawerOpen(true);
    setDesktopSidebarOpen(true);
  };

  const closeNavigation = () => {
    setMobileDrawerOpen(false);
    setDesktopSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      alert("Logout failed.");
    }
  };

  return (
    <div className="min-h-screen bg-light">
      {mobileDrawerOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-stone-950/30 backdrop-blur-[1px] lg:hidden"
          aria-label="Close drawer"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      <aside
        id="admin-navigation-drawer"
        className={`fixed left-0 top-0 z-40 h-screen w-72 overflow-y-auto border-r border-stone-200 bg-white p-4 shadow-xl transition-transform duration-300 ease-in-out lg:shadow-none ${
          mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          desktopSidebarOpen ? "lg:translate-x-0" : "lg:-translate-x-full"
        }`}
        aria-label="Admin drawer"
        tabIndex={-1}
      >
        <div className="flex h-full flex-col">
          <div className="relative flex items-center border-b border-stone-200 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="BookMart"
                className="h-9 w-9 rounded-md object-contain"
              />
              <div>
                <div className="text-lg font-semibold text-stone-950">
                  BookMart
                </div>
                <div className="text-xs font-medium text-stone-500">
                  Admin Console
                </div>
              </div>
            </div>
            <button
              type="button"
              className="absolute right-0 top-0 grid h-9 w-9 place-items-center rounded-md text-stone-500 transition hover:bg-stone-100 hover:text-stone-950"
              aria-label="Close menu"
              onClick={closeNavigation}
            >
              <FiX size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-5">
            <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
              Management
            </div>
            <ul className="space-y-1">
              {adminTabs.map((tab) => {
                const isActive = activeTabId === tab.id;

                return (
                  <li key={tab.id}>
                    <Link
                      to={tab.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`group flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${
                        isActive
                          ? "bg-secondary text-primarydark"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                      }`}
                    >
                      {renderTabIcon(tab.id, isActive)}
                      <span className="flex-1 whitespace-nowrap">{tab.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-stone-200 pt-4">
            <div className="mb-3 rounded-md border border-orange-100 bg-orange-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-primarydark">
                Current Section
              </p>
              <p className="mt-1 text-sm font-semibold text-stone-950">
                {activeTabConfig.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-stone-500">
                {activeTabConfig.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primarydark"
            >
              <FiLogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div
        className={`transition-[padding] duration-300 ease-in-out ${
          desktopSidebarOpen ? "lg:pl-72" : "lg:pl-0"
        }`}
      >
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-20 items-center justify-between gap-4 px-5 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className={`inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:text-primary ${
                  desktopSidebarOpen ? "lg:hidden" : "lg:inline-flex"
                }`}
                aria-controls="admin-navigation-drawer"
                aria-expanded={mobileDrawerOpen || desktopSidebarOpen}
                onClick={openNavigation}
              >
                <FiMenu size={20} />
                Navigation
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Admin / {activeTabConfig.label}
                </p>
                <h1 className="mt-1 text-2xl font-bold text-stone-950">
                  {activeTabConfig.label}
                </h1>
              </div>
            </div>
            <p className="hidden max-w-md text-right text-sm text-stone-500 md:block">
              {activeTabConfig.description}
            </p>
          </div>
        </header>

        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Do you want to logout?"
        message=""
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
}
