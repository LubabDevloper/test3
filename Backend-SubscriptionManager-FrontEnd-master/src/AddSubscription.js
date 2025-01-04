    import React, { useState } from "react";
    import axios from "axios";

    const AddSubscription = ({ onClose }) => {
        const [subscription, setSubscription] = useState({
            name: "",
            category: "",
            cost: 0,
            renewalDate: "",
        });
        const [loading, setLoading] = useState(false);
        const [errorMessage, setErrorMessage] = useState("");
    
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setSubscription({
                ...subscription,
                [name]: value,
            });
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
        
            const subscriptionData = {
                name: subscription.name,
                category: subscription.category,
                cost: subscription.cost,
                renewalDate: subscription.renewalDate,
            };
        
            setLoading(true);
            setErrorMessage(""); // Reset any previous error message
        
            try {
                const response = await axios.post(
                    "https://localhost:7270/api/Subscriptions/AddSubscription",
                    subscriptionData,  // Sending the data as JSON
                    { headers: { "Content-Type": "application/json" } }  // Use JSON content type
                );
                alert(response.data.Message);
                onClose(); // Close the form upon successful submission
            } catch (error) {
                console.error("Error adding subscription:", error);
                console.log("Error Response:", error.response); // Log the complete error response
                setErrorMessage(error.response?.data?.Message || "Error adding subscription.");
            } finally {
                setLoading(false);
            }
        };
        
        return (
            <div className="add-subscription-form">
                <h3>Add Subscription</h3>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={subscription.name}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={subscription.category}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Cost</label>
                        <input
                            type="number"
                            name="cost"
                            value={subscription.cost}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Renewal Date</label>
                        <input
                            type="date"
                            name="renewalDate"
                            value={subscription.renewalDate}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Submitting..." : "Add Subscription"}
                        </button>
                    </div>
                </form>
                <button onClick={onClose} className="btn btn-secondary">Close</button>
            </div>
        );
    };
    
    export default AddSubscription;
