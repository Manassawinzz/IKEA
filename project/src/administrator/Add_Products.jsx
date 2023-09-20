import React, { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { db } from '../firebase'; // database
import { collection, addDoc } from 'firebase/firestore'; // firestore
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storageRef } from '../firebase';
import Nav from './Nav'

function Add_Products() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const [selectedFile, setSelectedFile] = useState(null); // Store the selected file
    const [fileName, setFileName] = useState(''); // Store the file name

    const [imageUpload, setImageUpload] = useState(null);
    const [imageList, setImageList] = useState([]); // Define setImageList here

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the first selected file

        if (file) {
            setSelectedFile(file);
            setFileName(file.name); // Set the file name
            setImageUpload(file); // Set the imageUpload state with the file object
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const createProduct = await addDoc(collection(db, 'products'), {
            name: name,
            description: description,
            quantity: quantity,
            price: price,
            img: fileName
        });

        if (imageUpload) {
            const imageRef = ref(storageRef, `products/${imageUpload.name}`);
            const snapshot = await uploadBytes(imageRef, imageUpload);
            const url = await getDownloadURL(snapshot.ref);
            setImageList((prev) => [...prev, url]);
        }

        // Clear form fields after submission
        setName('');
        setDescription('');
        setQuantity('');
        setPrice('');
        setSelectedFile(null);
        setFileName('');
    };

    return (
        <>
            <Nav />
            <Container>
                <Form onSubmit={handleSubmit}>
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
                    <br></br>
                    <Button type='submit'>Submit</Button>
                </Form>
            </Container>
        </>

    );
}

export default Add_Products;
