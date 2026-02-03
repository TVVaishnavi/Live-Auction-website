import { useState } from "react";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import "../styles/CreateItem.css";

function CreateItemModal({ onClose, onCreate }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        startingPrice: "",
    });

    const [images, setImages] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImages = (files) => {
        const selected = Array.from(files).slice(0, 5);
        setImages(selected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const imageUrls = await uploadToCloudinary(images);

        console.log("SENDING TO BACKEND:", {
            ...form,
            images: imageUrls,
        });

        onCreate({
            ...form,
            images: imageUrls,
        });
    };


    return (
        <div className="create-item-overlay" onClick={onClose}>
            <div
                className="create-item-card"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Create Item</h2>
                <p>Add a new item for auction</p>

                <div className="image-upload">
                    <label className="upload-box">
                        Upload Images (max 5)
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            hidden
                            onChange={(e) => handleImages(e.target.files)}
                        />
                    </label>

                    <div className="image-preview">
                        {images.map((img, i) => (
                            <img
                                key={i}
                                src={URL.createObjectURL(img)}
                                alt="preview"
                            />
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="create-item-form">
                    <label>ITEM NAME</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    <label>DESCRIPTION</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />

                    <label>STARTING PRICE</label>
                    <input
                        type="number"
                        name="startingPrice"
                        value={form.startingPrice}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-actions">
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="primary-btn">
                            Sell
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateItemModal;
