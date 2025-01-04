import React, { useEffect, useState } from "react";
import axios from "axios";
import AddSubscription from "./AddSubscription";  // Import AddSubscription component

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [statistics, setStatistics] = useState({
        totalMonthlyCost: 0,
        totalAnnualCost: 0,
        activeSubscriptions: 0,
    });

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get("https://localhost:7270/api/Subscriptions");
            setSubscriptions(response.data.subscriptions || []);
            setStatistics(response.data.statistics || {
                totalMonthlyCost: 0,
                totalAnnualCost: 0,
                activeSubscriptions: 0,
            });
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
        }
    };

    const handleExportToExcel = async () => {
        try {
            const response = await axios.get("https://localhost:7270/api/Subscriptions/ExportToExcel", {
                responseType: "blob", // Important for downloading files
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Subscriptions.xlsx");
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error exporting to Excel:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this subscription?")) return;
        try {
            await axios.delete(`https://localhost:7270/api/Subscriptions/${id}`);
            alert("Subscription deleted successfully!");
            fetchSubscriptions(); // Refresh data
        } catch (error) {
            console.error("Error deleting subscription:", error);
        }
    };

    const handleAddSubscription = () => {
        setShowModal(true); // Open the modal when the button is clicked
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
    };

    return (
        <div className="container">
            <h1>Subscription Manager</h1>

            <div className="statistics">
                <h3>Statistics</h3>
                <p><strong>Total Monthly Cost:</strong> ${statistics.totalMonthlyCost.toFixed(2)}</p>
                <p><strong>Total Annual Cost:</strong> ${statistics.totalAnnualCost.toFixed(2)}</p>
                <p><strong>Active Subscriptions:</strong> {statistics.activeSubscriptions}</p>
            </div>

            <div>
                <button className="btn btn-primary" onClick={handleAddSubscription}>
                    Add Subscription
                </button>

                {/* Modal Structure */}
                {showModal && (
                    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Add Subscription</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <AddSubscription onClose={handleCloseModal} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Cost</th>
                        <th>Renewal Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.length > 0 ? (
                        subscriptions.map((subscription) => (
                            <tr key={subscription.id}>
                                <td>{subscription.id}</td>
                                <td>{subscription.name}</td>
                                <td>{subscription.category}</td>
                                <td>${subscription.cost.toFixed(2)}</td>
                                <td>{new Date(subscription.renewalDate).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleDelete(subscription.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No subscriptions available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Export to Excel Button outside of the table */}
            <button className="btn btn-primary" onClick={handleExportToExcel}>
                Export to Excel
            </button>
        </div>
    );
};

export default Subscriptions;
