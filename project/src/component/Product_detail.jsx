import React, { useState, useEffect } from 'react'
import Nav_Bar from './Nav_Bar';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { storageRef, db } from '../firebase';
function Product_detail() {
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get("id");

    const [productData, setProductData] = useState({
        id: searchParams.get("id") || "",
        name: searchParams.get("name") || "",
        description: searchParams.get("description") || "",
        quantity: searchParams.get("quantity") || "",
        price: searchParams.get("price") || "",
        image: searchParams.get("image") || "",
    });
    const [imageUpload, setImageUpload] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageUpload(file);
        }
    };
    const updateUserField = async (property, value) => {
        const querySnapshot = await getDocs(
            query(collection(db, "products"), where("name", "==", productData.name))
        );

        if (!querySnapshot.empty) {
            const productRef = querySnapshot.docs[0].ref;
            await updateDoc(productRef, { [property]: value });
        }

        if (imageUpload) {
            const imageRef = ref(storageRef, `products/${imageUpload.name}`);
            const snapshot = await uploadBytes(imageRef, imageUpload);
            const url = await getDownloadURL(snapshot.ref);
            setProductData((prevData) => ({ ...prevData, img: url }));
        }
    };
    const handleDelete = async () => {
        try {
            const productDocRef = doc(db, "products", productData.id);
            await deleteDoc(productDocRef);
            console.log("Document successfully deleted!");
            alert("Document successfully deleted!");
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert("Error deleting document: " + error.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateUserField("name", productData.name);
        await updateUserField("description", productData.description);
        await updateUserField("quantity", productData.quantity);
        await updateUserField("price", productData.price);
        alert("Updated");
    };

    const [imageList, setImageList] = useState([]);

    useEffect(() => {
        const imageListRef = ref(storageRef, "products/");
        listAll(imageListRef)
            .then((response) =>
                Promise.all(response.items.map((item) => getDownloadURL(item)))
            )
            .then((urls) => setImageList(urls))
            .catch((error) => console.error("Error listing images:", error));
    }, []);
    return (
        <>
            <Nav_Bar />
            <div>Product_detail</div>
        </>
    )
}

export default Product_detail