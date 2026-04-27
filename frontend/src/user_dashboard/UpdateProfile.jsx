import React, { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/getprofile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    if (formData.phone && formData.phone.trim() !== "") {
      if (!/^\d{10}$/.test(formData.phone)) {
        alert("Phone number must be exactly 10 digits");
        return;
      }
    }

    const token = sessionStorage.getItem("token");
    const data = new FormData();
    data.append("name", formData.name || "");
    data.append("email", formData.email || "");
    data.append("phone", formData.phone || "");
    data.append("address", formData.address || "");
    if (file) data.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/api/updateprofile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const responseData = await res.json();
      if (!res.ok) {
         console.error(responseData.message || "Update failed");
         alert("Failed to update profile: " + (responseData.message || "Unknown error"));
         return;
      }

      setUser(responseData);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Network error during profile update.");
    }
  };

  if (!user) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="flex justify-center mt-10">
  <div className="bg-white rounded-2xl p-6 w-full max-w-3xl ">
    {/* Top center image */}
    <div className="flex flex-col items-center mb-6">
      <img
        src={file ? URL.createObjectURL(file) : user.image || "/default-avatar.png"}
        alt="Profile"
        className="w-32 h-32 rounded-full border-4 border-[#411900]"
      />

      {editing && (
        <label className="mt-3 cursor-pointer bg-[#411900] text-white px-4 py-2 rounded-lg hover:bg-[#5a2b00]">
          Choose File
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>

    {/* Profile fields */}
    {editing ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="border rounded p-2 w-full focus:ring-2 focus:ring-[#411900]"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border rounded p-2 w-full focus:ring-2 focus:ring-[#411900]"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border rounded p-2 w-full focus:ring-2 focus:ring-[#411900]"
        />
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="border rounded p-2 w-full h-24 resize-none focus:ring-2 focus:ring-[#411900]"
        />
        <button
          onClick={handleUpdate}
          className="bg-[#411900] text-white px-4 py-2 rounded-lg col-span-full hover:bg-[#5a2b00]"
        >
          Save
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <div>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="mt-4 bg-[#411900] text-white px-4 py-2 rounded-lg col-span-full hover:bg-[#5a2b00]"
        >
          Edit Profile
        </button>
      </div>
    )}

    {success && (
      <p className="mt-4 text-green-600 text-center">Profile updated successfully!</p>
    )}
  </div>
</div>

  );
}
