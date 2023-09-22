import React, { useState } from "react";
import { Container, Button, Form, Row, Col, Image } from "react-bootstrap";
import { db } from "../firebase"; // database
import { collection, addDoc } from "firebase/firestore"; // firestore
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storageRef } from "../firebase";
import Nav from "./Nav";
import img1 from "./image/add.jpg";

import style from "./style/style.css";

function Add_Products() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");

  const [selectedFile, setSelectedFile] = useState(null); // Store the selected file
  const [fileName, setFileName] = useState(""); // Store the file name

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

    const createProduct = await addDoc(collection(db, "products"), {
      name: name,
      description: description,
      quantity: quantity,
      price: price,
      type: type,
      img: fileName,
    });

    if (imageUpload) {
      const imageRef = ref(storageRef, `products/${imageUpload.name}`);
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);
      setImageList((prev) => [...prev, url]);
    }

    // Clear form fields after submission
    setName("");
    setDescription("");
    setQuantity("");
    setPrice("");
    setSelectedFile(null);
    setFileName("");
    setType("");
  };

  return (
    <>
      <Nav />

      <hr />

      <Container>
        <Row>
          <Col md={10} className="sizecon">
            <div className="contact_inner">
              <Row>
                <Col md={10}>
                  <div className="contact_form_inner">
                    <div className="contact_field">
                      <h3>เพิ่มผลิตภัณฑ์</h3>
                      <p>ทำการเพิ่มสินค้า</p>
                      <Form onSubmit={handleSubmit}>
                        <Form.Group>
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            className="input-small"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            type="text"
                            className="input-small"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control
                            className="input-small"
                            placeholder="Quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Price</Form.Label>
                          <Form.Control
                            className="input-small"
                            placeholder="Price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Type</Form.Label>
                          <Form.Control
                            className="input-small"
                            placeholder="Type"
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Image</Form.Label>
                          <Form.Control
                            lassName="input-small"
                            type="file"
                            onChange={handleFileChange}
                          />
                        </Form.Group>

                        <Button className="contact_form_submit" type="submit">
                          Send
                        </Button>
                      </Form>
                    </div>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="right_conatct_social_icon d-flex align-items-end"></div>
                </Col>
              </Row>
              <div>
                <Image src={img1} alt="Image 1" className="resize4" />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Add_Products;
