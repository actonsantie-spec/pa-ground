import React from "react";

export default function Profile() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>My Profile</h1>
      <p>This is your profile page (demo).</p>

      <div style={{ marginTop: "20px" }}>
        <p><strong>Name:</strong> Demo User</p>
        <p><strong>Email:</strong> demo@email.com</p>
        <p><strong>Account Type:</strong> Buyer</p>
      </div>
    </div>
  );
}
