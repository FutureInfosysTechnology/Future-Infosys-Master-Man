import React, { useState, Suspense } from "react";
import Header from "../../../Components-2/Header/Header";
import Sidebar1 from "../../../Components-2/Sidebar1";
import Footer from "../../../Components-2/Footer";

const VehicleEntry = React.lazy(() => import('./VehicleEntry'));
const TransportEntry = React.lazy(() => import('./TransportEntry'));
const DriverEntry = React.lazy(() => import('./DriverEntry'));
const FlightEntry = React.lazy(() => import('./FlightEntry'));
const TrainEntry = React.lazy(() => import('./TrainEntry'));
const ProductEntry = React.lazy(() => import('./ProductEntry'));

function VehicleMaster() {
    const [activeTab, setActiveTab] = useState('vehicle');

    // order of tabs for slider movement
    const tabs = ['vehicle', 'transport', 'driver', 'flight', 'train', 'product'];

    return (
        <>
            <Header />
            <Sidebar1 />

            <div className="main-body" id="main-body">
                <div className="container">

                    {/* Navigation */}
                    <nav className="nav">
                        <label onClick={() => setActiveTab('vehicle')}>Vehicle Details</label>
                        <label onClick={() => setActiveTab('transport')}>Transport Details</label>
                        <label onClick={() => setActiveTab('driver')}>Driver Details</label>
                        <label onClick={() => setActiveTab('flight')}>Flight Details</label>
                        <label onClick={() => setActiveTab('train')}>Train Details</label>
                        <label onClick={() => setActiveTab('product')}>Product Details</label>

                        {/* Slider */}
                        <div
                            className="slider"
                            style={{
                                left: `${tabs.indexOf(activeTab) * (100 / tabs.length)}%`,
                                width: `${100 / tabs.length}%`
                            }}
                        ></div>
                    </nav>

                    {/* Tab Content */}
                    <section>
                        <Suspense fallback={<div>Loading...</div>}>
                            {activeTab === 'vehicle' && <VehicleEntry />}
                            {activeTab === 'transport' && <TransportEntry />}
                            {activeTab === 'driver' && <DriverEntry />}
                            {activeTab === 'flight' && <FlightEntry />}
                            {activeTab === 'train' && <TrainEntry />}
                            {activeTab === 'product' && <ProductEntry />}
                        </Suspense>
                    </section>

                </div>

                <Footer />
            </div>
        </>
    );
}

export default VehicleMaster;
