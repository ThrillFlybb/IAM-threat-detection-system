import { useEffect, useState } from "react";
import { getUsers, unlockUser } from "../api";

export default function Admin() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const data = await getUsers();

    console.log("ADMIN DATA:", data); // debug

    // 🔥 FIX: ensure it's always array
    if (Array.isArray(data)) {
      setUsers(data);
    } else if (data.users) {
      setUsers(data.users);
    } else {
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUnlock = async (id) => {
    await unlockUser(id);
    loadUsers();
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((u) => (
          <div key={u._id} className="threat-card">
            <div><b>{u.name}</b> ({u.email})</div>

            <div>Failed Attempts: {u.failedLoginAttempts}</div>

            <div>
              Status:{" "}
              {u.lockUntil && new Date(u.lockUntil) > Date.now()
                ? "🔒 Locked"
                : "✅ Active"}
            </div>

            <button onClick={() => handleUnlock(u._id)}>
              Unlock
            </button>
          </div>
        ))
      )}
    </div>
  );
}