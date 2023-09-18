import React, { useState, useEffect } from 'react';
import { Container, Card, Image, Button, Form } from 'react-bootstrap';
import Nav from './Nav';
import { Link } from 'react-router-dom';

import { storageRef, db } from '../firebase';
import { ref, getDownloadURL, listAll } from 'firebase/storage';

import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';

import './style/AdminHomePage.css';

function Home() {
    const [imageList, setImageList] = useState([]);
    const imageListRef = ref(storageRef, 'products/');

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const findImage = (imgName) => {
        return imageList.find((url) => url.includes(imgName));
    };

    useEffect(() => {
        listAll(imageListRef)
            .then((response) => {
                const urlPromises = response.items.map((item) => getDownloadURL(item));
                return Promise.all(urlPromises);
            })
            .then((urls) => {
                setImageList(urls);
            })
            .catch((error) => {
                console.error('Error listing images:', error);
            });
    }, []);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const q = query(
                collection(db, 'products'),
                where('name', '>=', searchTerm),
                orderBy('name')
            );

            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setProducts(newData); // Set products as an array of filtered products
        } catch (error) {
            console.error('Error fetching account data: ', error);
        }
    };

    const handleSearch = () => {
        fetchProducts();
    };

    return (
        <>
            <Nav />
            <Container>
                <Form.Group className='search_group' >
                    <Form.Control className='search_bar'
                        type="text"
                        placeholder="Search by product name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button className='search_btn' onClick={handleSearch}>Search</Button>
                </Form.Group>
                <hr />
                {products.map((product, index) => (
                    <Card className="card" key={index}>
                        <Image src={findImage(product.img)} style={{ width: '200px', height: '230px' }} />
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>จำนวน: {product.quantity}</Card.Text>
                            <Link
                                to={`/edit_products?id=${encodeURIComponent(product.id)}&name=${encodeURIComponent(
                                    product.name
                                )}&quantity=${encodeURIComponent(product.quantity)}&description=${encodeURIComponent(
                                    product.description
                                )}&image=${encodeURIComponent(product.image)}&price=${encodeURIComponent(
                                    product.price
                                )}`}
                                target="_blank"
                            >
                                แก้ไข
                            </Link>
                        </Card.Body>
                    </Card>
                ))}
            </Container>
        </>
    );
}

export default Home;