import React, { useState, useEffect } from 'react';
import { storageRef } from '../firebase';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { Container, Button, Form, Modal, Image, Row, Col } from 'react-bootstrap';

function Create() {
    const [imageUpload, setImageUpload] = useState(null);
    const [imageList, setImageList] = useState([]);

    const uploadFile = async (event) => {
        event.preventDefault();
        if (!imageUpload) return;

        try {
            const imageRef = ref(storageRef, `products/${imageUpload.name}`);
            const snapshot = await uploadBytes(imageRef, imageUpload);
            const url = await getDownloadURL(snapshot.ref);
            setImageList((prev) => [...prev, url]);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    useEffect(() => {
        const imageListRef = ref(storageRef, 'products/');
        listAll(imageListRef)
            .then((response) => Promise.all(response.items.map((item) => getDownloadURL(item))))
            .then((urls) => setImageList(urls))
            .catch((error) => console.error('Error listing images:', error));
    }, []);

    return (
        <Container>
            <form onSubmit={uploadFile}>
                <input type="file" onChange={(event) => setImageUpload(event.target.files[0])} />
                <button type="submit">Share</button>
            </form>

            <div>
                {imageList.map((url, index) => (
                    <img key={index} src={url} alt={`Image ${index}`} style={{ maxWidth: '300px', margin: '10px' }} />
                ))}
            </div>

            <Form>
                <Form.Group>
                    <Form.Label>
                        <Form.Control></Form.Control>
                    </Form.Label>
                </Form.Group>
            </Form>
        </Container>
    );
}

export default Create;