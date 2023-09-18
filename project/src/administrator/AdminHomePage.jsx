import React, { useState, useEffect } from 'react'
import { Container, Card, Image, Button } from 'react-bootstrap'
import Nav from './Nav'
import { Link } from 'react-router-dom';

import { storageRef, db } from '../firebase';
import { ref, getDownloadURL, listAll } from 'firebase/storage';

import { getDocs, collection, query } from 'firebase/firestore';

import './style/AdminHomePage.css'

function Home() {
    const [imageList, setImageList] = useState([]);
    const imageListRef = ref(storageRef, 'products/');

    const [products, setProducts] = useState([]);

    const findImage = (imgName) => {
        return imageList.find(url => url.includes(imgName));

    }

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
            const querySnapshot = await getDocs(
                query(collection(db, 'products'))
            );
            const newData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setProducts(newData); // Set products as an array of all products
        } catch (error) {
            console.error('Error fetching account data: ', error);
        }
    };

    return (
        <>
            <Nav />
            <Container>
                {products.map((product, index) => (
                    <Card className='card' >
                        <Image
                            src={findImage(product.img)}
                            style={{ width: '200px', height: '230px' }}
                        />
                        <Card.Body>
                            <Card.Title>
                                {product.name}
                            </Card.Title>
                            <Card.Text>
                                จำนวน: {product.quantity}
                            </Card.Text>
                            <Link
                                to={`/edit_products?id=${encodeURIComponent(product.id)}&name=${encodeURIComponent(product.name)}&quantity=${encodeURIComponent(product.quantity)}&description=${encodeURIComponent(product.description)}&image=${encodeURIComponent(product.image)}&price=${encodeURIComponent(product.price)}`}
                                target="_blank"
                            >
                                เเก้ใข
                            </Link>
                        </Card.Body>
                    </Card>
                ))}
            </Container>
        </>
    )
}

export default Home
