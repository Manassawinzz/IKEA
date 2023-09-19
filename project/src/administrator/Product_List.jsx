import React, { useState, useEffect } from 'react'
import Nav from './Nav'
import { Container, Table, Button, Form } from 'react-bootstrap'
import { db } from '../firebase';
import { query, collection, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function Product_List() {

    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const q = query(
                collection(db, 'products')
            );

            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setProducts(newData);
        } catch (error) {
            console.error('Error fetching account data:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const productDocRef = doc(db, 'products', id);
            await deleteDoc(productDocRef);
            console.log("Document successfully deleted!");
            alert("Document successfully deleted!");
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert("Error deleting document: " + error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    return (
        <>
            <Nav />
            <Container>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>

                                <td><Link
                                    to={`/edit_products?id=${encodeURIComponent(product.id)}&name=${encodeURIComponent(
                                        product.name
                                    )}&quantity=${encodeURIComponent(product.quantity)}&description=${encodeURIComponent(
                                        product.description
                                    )}&image=${encodeURIComponent(product.img)}&price=${encodeURIComponent(
                                        product.price
                                    )}`}
                                    target="_blank"
                                    key={index}
                                >Edi</Link></td>
                                <td><Button onClick={() => handleDelete(product.id)}>Del</Button></td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container >

        </>
    )
}

export default Product_List