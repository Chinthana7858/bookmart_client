import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSave, FiTrash2, FiX } from "react-icons/fi";
import Navbar from "../../../templates/Navbar";
import Footer from "../../../templates/Footer";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import { DropdownSelect } from "../../atoms/FormControls";
import AlertModal from "../../molecules/modals/AlertModal";
import ConfirmModal from "../../molecules/modals/ConfirmModal";
import {
  getApiErrorMessage,
  useAddMyAddressMutation,
  useDeleteMyAddressMutation,
  useGetMyAddressesQuery,
  useGetMyProfileQuery,
  useUpdateMyAddressMutation,
  useUpdateMyProfileMutation,
} from "../../../../services/bookmartApi";
import type { Gender, UserAddress, UserAddressInput, UserProfileUpdate } from "../../../../types/user";
import { countryCodeOptions, countryOptions } from "../../../../const/countries";

const genderOptions = [
  { label: "Select gender", value: "" },
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Non-binary", value: "non_binary" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
  { label: "Other", value: "other" },
];

const addressLabelOptions = [
  { label: "Home", value: "Home" },
  { label: "Office", value: "Office" },
  { label: "Billing", value: "Billing" },
  { label: "Other", value: "Other" },
];

const emptyAddress: UserAddressInput = {
  label: "Home",
  recipient_name: "",
  phone_country_code: "+94",
  phone_number: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "Sri Lanka",
  is_default: false,
};

function formatAddress(address: UserAddress) {
  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function ProfileManagement() {
  const { data: profile, isLoading: profileLoading } = useGetMyProfileQuery();
  const { data: addresses = [], isLoading: addressesLoading } = useGetMyAddressesQuery();
  const [updateProfile, { isLoading: savingProfile }] = useUpdateMyProfileMutation();
  const [addAddress, { isLoading: addingAddress }] = useAddMyAddressMutation();
  const [updateAddress, { isLoading: updatingAddress }] = useUpdateMyAddressMutation();
  const [deleteAddress] = useDeleteMyAddressMutation();
  const [profileForm, setProfileForm] = useState<UserProfileUpdate>({
    name: "",
    phone_country_code: "+94",
    phone_number: "",
    birthday: "",
    gender: "",
    address: "",
  });
  const [addressForm, setAddressForm] = useState<UserAddressInput>(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!profile) return;
    setProfileForm({
      name: profile.name,
      phone_country_code: profile.phone_country_code || "+94",
      phone_number: profile.phone_number || "",
      birthday: profile.birthday || "",
      gender: profile.gender || "",
      address: profile.address || "",
    });
  }, [profile]);

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm({
      ...emptyAddress,
      phone_country_code: profileForm.phone_country_code || "+94",
      phone_number: profileForm.phone_number || "",
      recipient_name: profileForm.name,
    });
  };

  const startEditingAddress = (address: UserAddress) => {
    setEditingAddressId(address.id);
    setAddressForm({
      label: address.label,
      recipient_name: address.recipient_name || "",
      phone_country_code: address.phone_country_code || "+94",
      phone_number: address.phone_number || "",
      line1: address.line1,
      line2: address.line2 || "",
      city: address.city,
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country,
      is_default: address.is_default,
    });
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateProfile({
        ...profileForm,
        birthday: profileForm.birthday || undefined,
        gender: (profileForm.gender || undefined) as Gender | undefined,
      }).unwrap();
      setAlert({ type: "success", message: "Profile updated successfully." });
    } catch (error) {
      setAlert({ type: "error", message: getApiErrorMessage(error, "Profile update failed.") });
    }
  };

  const saveAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editingAddressId) {
        await updateAddress({ id: editingAddressId, body: addressForm }).unwrap();
        setAlert({ type: "success", message: "Address updated successfully." });
      } else {
        await addAddress(addressForm).unwrap();
        setAlert({ type: "success", message: "Address added successfully." });
      }
      resetAddressForm();
    } catch (error) {
      setAlert({ type: "error", message: getApiErrorMessage(error, "Address save failed.") });
    }
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      await deleteAddress(addressToDelete).unwrap();
      setAddressToDelete(null);
      setAlert({ type: "success", message: "Address deleted successfully." });
    } catch (error) {
      setAlert({ type: "error", message: getApiErrorMessage(error, "Address delete failed.") });
    }
  };

  const loading = profileLoading || addressesLoading;

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <main className="page-container py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Account</p>
          <h1 className="text-2xl font-bold text-stone-950">Profile management</h1>
          <p className="mt-1 text-sm text-stone-500">Manage your contact details and delivery addresses.</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
            <form onSubmit={saveProfile} className="surface p-5">
              <h2 className="mb-4 text-lg font-semibold text-stone-950">Personal details</h2>
              <div className="grid gap-4">
                <input
                  className="field w-full"
                  value={profileForm.name}
                  onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
                  placeholder="Full name"
                  required
                />
                <input className="field w-full bg-stone-50" value={profile?.email || ""} disabled />
                <div className="grid gap-3 sm:grid-cols-[170px_1fr]">
                  <DropdownSelect
                    label="Country code"
                    value={profileForm.phone_country_code || "+94"}
                    onChange={(value) => setProfileForm({ ...profileForm, phone_country_code: value })}
                    options={countryCodeOptions}
                  />
                  <input
                    className="field w-full"
                    type="tel"
                    value={profileForm.phone_number || ""}
                    onChange={(event) => setProfileForm({ ...profileForm, phone_number: event.target.value })}
                    placeholder="Phone number"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="field w-full"
                    type="date"
                    value={profileForm.birthday || ""}
                    onChange={(event) => setProfileForm({ ...profileForm, birthday: event.target.value })}
                    aria-label="Birthday"
                  />
                  <DropdownSelect
                    label="Gender"
                    value={profileForm.gender || ""}
                    onChange={(value) => setProfileForm({ ...profileForm, gender: value as Gender | "" })}
                    options={genderOptions}
                  />
                </div>
                <button className="btn-primary w-fit" disabled={savingProfile}>
                  <FiSave size={16} />
                  {savingProfile ? "Saving..." : "Save profile"}
                </button>
              </div>
            </form>

            <section className="surface p-5">
              <h2 className="mb-4 text-lg font-semibold text-stone-950">Address book</h2>
              <div className="space-y-3">
                {addresses.length === 0 ? (
                  <p className="rounded-md bg-stone-50 p-4 text-sm text-stone-500">No saved addresses yet.</p>
                ) : (
                  addresses.map((address) => (
                    <article key={address.id} className="rounded-lg border border-stone-200 p-4">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-stone-950">{address.label}</h3>
                            {address.is_default && (
                              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-primarydark">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-stone-600">{formatAddress(address)}</p>
                          {(address.phone_country_code || address.phone_number) && (
                            <p className="mt-1 text-xs text-stone-500">
                              {address.phone_country_code} {address.phone_number}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button type="button" className="btn-secondary h-9 px-3" onClick={() => startEditingAddress(address)}>
                            <FiEdit2 size={14} />
                          </button>
                          <button type="button" className="btn-secondary h-9 px-3" onClick={() => setAddressToDelete(address.id)}>
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <form onSubmit={saveAddress} className="surface p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-stone-950">
                  {editingAddressId ? "Edit address" : "Add address"}
                </h2>
                {editingAddressId && (
                  <button type="button" className="btn-secondary h-10" onClick={resetAddressForm}>
                    <FiX size={16} />
                    Cancel edit
                  </button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <DropdownSelect
                  label="Address type"
                  value={addressForm.label}
                  onChange={(value) => setAddressForm({ ...addressForm, label: value })}
                  options={addressLabelOptions}
                />
                <input
                  className="field w-full"
                  value={addressForm.recipient_name || ""}
                  onChange={(event) => setAddressForm({ ...addressForm, recipient_name: event.target.value })}
                  placeholder="Recipient name"
                />
                <div className="grid gap-3 sm:grid-cols-[170px_1fr]">
                  <DropdownSelect
                    label="Country code"
                    value={addressForm.phone_country_code || "+94"}
                    onChange={(value) => setAddressForm({ ...addressForm, phone_country_code: value })}
                    options={countryCodeOptions}
                  />
                  <input
                    className="field w-full"
                    type="tel"
                    value={addressForm.phone_number || ""}
                    onChange={(event) => setAddressForm({ ...addressForm, phone_number: event.target.value })}
                    placeholder="Phone number"
                  />
                </div>
                <input
                  className="field w-full"
                  value={addressForm.line1}
                  onChange={(event) => setAddressForm({ ...addressForm, line1: event.target.value })}
                  placeholder="Address line 1"
                  required
                />
                <input
                  className="field w-full"
                  value={addressForm.line2 || ""}
                  onChange={(event) => setAddressForm({ ...addressForm, line2: event.target.value })}
                  placeholder="Address line 2"
                />
                <input
                  className="field w-full"
                  value={addressForm.city}
                  onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })}
                  placeholder="City"
                  required
                />
                <input
                  className="field w-full"
                  value={addressForm.state || ""}
                  onChange={(event) => setAddressForm({ ...addressForm, state: event.target.value })}
                  placeholder="State / province"
                />
                <input
                  className="field w-full"
                  value={addressForm.postal_code || ""}
                  onChange={(event) => setAddressForm({ ...addressForm, postal_code: event.target.value })}
                  placeholder="Postal code"
                />
                <DropdownSelect
                  label="Country"
                  value={addressForm.country || "Sri Lanka"}
                  onChange={(value) => setAddressForm({ ...addressForm, country: value })}
                  options={countryOptions}
                />
                <label className="inline-flex items-center gap-2 text-sm font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={Boolean(addressForm.is_default)}
                    onChange={(event) => setAddressForm({ ...addressForm, is_default: event.target.checked })}
                    className="h-4 w-4 rounded border-stone-300 text-primary focus:ring-primary"
                  />
                  Use as default address
                </label>
              </div>
              <button className="btn-primary mt-5" disabled={addingAddress || updatingAddress}>
                <FiPlus size={16} />
                {editingAddressId ? "Save address" : "Add address"}
              </button>
            </form>
          </div>
        )}
      </main>
      <Footer />

      <AlertModal
        isOpen={alert !== null}
        title={alert?.type === "success" ? "Success" : "Error"}
        message={alert?.message || ""}
        type={alert?.type || "success"}
        onClose={() => setAlert(null)}
      />
      <ConfirmModal
        isOpen={addressToDelete !== null}
        title="Delete address?"
        message="This saved address will be removed from your address book."
        confirmText="Delete"
        onConfirm={confirmDeleteAddress}
        onCancel={() => setAddressToDelete(null)}
      />
    </div>
  );
}
