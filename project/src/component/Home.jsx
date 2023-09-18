import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import Nav_Bar from './Nav_Bar';
import { Container, Button } from 'react-bootstrap';
import { db } from '../firebase'; // Make sure to import db
import { query, collection, where, getDocs } from 'firebase/firestore'; // Make sure to import necessary firestore functions
function Home() {
  const { user, logOut } = useUserAuth(); // Include logOut from useUserAuth
  const [username, setUsername] = useState([]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  }

  const fetchusername = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "User"), where("email", "==", user.email))
      );
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsername(newData);
      console.log(newData);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  useEffect(() => {
    fetchusername();
  }, [user]);

  return (
    <>
      <Nav_Bar />
      <Container>
        {username.map((todo) => (
          <div key={todo.id}>{todo.username}</div>
        ))}
        <Button onClick={handleLogout} variant='danger'>Logout</Button>
      </Container>
    </>
  )
}

export default Home;
