import { useEffect, useState } from 'react'

function dashBoard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('user-info');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    console.log("User object:", user);
  }, []);

  return (
    <div>      
      <h1>Dashboard</h1>
      <p>{user?.name}</p>
      <p>{user?.email}</p>
      <img src={user?.image} alt="User" /> 
    </div>
  )
}

export default dashBoard
