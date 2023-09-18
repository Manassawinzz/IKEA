import React, { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase'; // Import your Firebase configuration and Firestore instance
import { query, collection, where, getDocs, updateDoc } from 'firebase/firestore';

function Edit_Products() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get('id');
    const productName = searchParams.get('name');
    const productDescriptions = searchParams.get('description');
    const productQuantity = searchParams.get('quantity');
    const productPrice = searchParams.get('price');

    const [name, setName] = useState(productName || '');
    const [description, setDescription] = useState(productDescriptions || '');
    const [quantity, setQuantity] = useState(productQuantity || '');
    const [price, setPrice] = useState(productPrice || '');

    const [selectedFile, setSelectedFile] = useState(null); // Store the selected file
    const [fileName, setFileName] = useState(''); // Store the file name

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the first selected file

        if (file) {
            setSelectedFile(file);
            setFileName(file.name); // Set the file name
        }
    };
    

    const updateUserField = async (collectionName, property, value) => {
        const querySnapshot = await getDocs(query(collection(db, collectionName), where('name', '==', productName)));
        if (!querySnapshot.empty) {
            await updateDoc(querySnapshot.docs[0].ref, { [property]: value });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateUserField('products', 'name', name);
        await updateUserField('products', 'description', description);
        await updateUserField('products', 'quantity', quantity);
        await updateUserField('products', 'price', price);
        await updateUserField('products', 'img', fileName);
        alert('Updated');
    };

    return (
        <Container>
            <Form onSubmit={handleUpdate}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type='text'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        type='number'
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type='number'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type='file'
                        onChange={handleFileChange}
                    />
                </Form.Group>
                <br />
                <Button type='submit'>Update</Button>
            </Form>
        </Container>
    );
}

export default Edit_Products;
