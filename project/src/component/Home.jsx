import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import Nav_Bar from './Nav_Bar';
import { Link } from 'react-router-dom';
import { Container, Card, Image, Button, Form } from 'react-bootstrap';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import { storageRef, db } from '../firebase';
import './style/Home.css';
function Home() {
  const { user, logOut } = useUserAuth(); // Include logOut from useUserAuth
  const [username, setUsername] = useState([]);
  const [products, setProducts] = useState([]);
  const imageListRef = ref(storageRef, 'products/');
  const [imageList, setImageList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  }
  useEffect(() => {
    listAll(imageListRef)
      .then((response) => Promise.all(response.items.map((item) => getDownloadURL(item))))
      .then((urls) => setImageList(urls))
      .catch((error) => console.error('Error listing images:', error));
  }, []);

  const fetchusername = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "User"), where("email", "==", user.email))
      ); 
      console.log(querySnapshot)
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsername(newData);
      console.log("username",username)
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const q = query(
        collection(db, 'products'),
        where('name', '>=', searchTerm),
        orderBy('name')
      );

      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setProducts(newData);
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  useEffect(() => {
    fetchusername();
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Nav_Bar />
      <Container>
        {username.map((todo) => (
          <div key={todo.id}>{todo.username}</div>
        ))}
      </Container>

      <Container>
        <Form.Group className='search_group'>
          <Form.Control
            className='search_bar'
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button className='search_btn' onClick={fetchProducts}>search</Button>
        </Form.Group>
        <hr />
        {products.map((product, index) => (
          <Link
            to={`/product_detail?id=${encodeURIComponent(product.id)}&name=${encodeURIComponent(
              product.name
            )}&quantity=${encodeURIComponent(product.quantity)}&description=${encodeURIComponent(
              product.description
            )}&image=${encodeURIComponent(product.img)}&price=${encodeURIComponent(
              product.price
            )}`}
            target="_blank"
            key={index}
          >
            <Card className="card">
              <Image
                className='img'
                src={imageList.find((url) => url.includes(product.img))}
                style={{ width: '290px', height: '300px' }}
              />
              <Card.Body>
                <div className='product_name'>{product.name}</div>
                <div className='product_description'>{product.description}</div>
                <div>
                  <span className='product_price'>{product.price.toLocaleString()}</span>
                  <b className='bath'>บาท</b>
                </div>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </Container>
    </>
  )
}

export default Home;
