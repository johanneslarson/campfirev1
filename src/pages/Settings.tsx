import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

function Settings() {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isArtist, setIsArtist] = useState(user.isArtist);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Update global user profile
    setUser({ ...user, name, email, isArtist });
    // (Optional: you could show a success message or toast here)
  };

  return (
    <div className="p-4 max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">Name:</label>
          <input 
            id="name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="border w-full px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-medium">Email:</label>
          <input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="border w-full px-2 py-1"
          />
        </div>
        <div className="flex items-center">
          <input 
            id="artistMode" 
            type="checkbox" 
            checked={isArtist} 
            onChange={(e) => setIsArtist(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="artistMode">Enable Artist Mode</label>
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default Settings; 