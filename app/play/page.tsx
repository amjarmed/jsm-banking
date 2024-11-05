'use client';
import { useEffect, useState } from 'react';
import Footer from './footer';

function UsersList() {
  const [users, setUsers] = useState([]);

  // Fetch data when the component mounts
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users',
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, []); // Empty dependency array means this runs only once, when the component mounts

  return (
    <div className='main container'>
      <div className=' flex flex-col justify-center space-y-5 mt-5'>
        <h1 className='font-bold text-2xl'>User List</h1>
        <ul className='list-disc list-inside'>
          {users.map((user) => (
            <li className='mb-2 text-pretty' key={user.id}>
              {user.name} | {user.address.city}
            </li>
          ))}
        </ul>
      </div>
      {/* footer */}
      <Footer />
    </div>
  );
}

export default UsersList;
