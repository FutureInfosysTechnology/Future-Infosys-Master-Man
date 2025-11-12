import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tabs from './components/Tabs/Tabs';
import CityMaster from './components/Admin Master/City Master/CityMaster';
import CustomerList from './components/Admin Master/CustomerList/CustomerList';
import Sidebar1 from './Components-2/Sidebar1'
import VendorMaster from './components/Admin Master/Vendor Master/VendorMaster';
import BranchMaster from './components/Admin Master/BranchMaster/BranchMaster';
import Inventory from './components/Admin Master/Inventry/Inventory';
import NewLogin from './components/Login-pages/NewLogin'
import Dashboard from './Components-2/Dashboard/Dashboard';
import Signup from './components/Login-pages/Signup';
import PodEntry from './components/Booking/POD Update/PodEntry';
import OrderEntry from './components/Laiser/OrderEntry';
import PaymentEntry from './components/Laiser/PaymentEntry';
import ProductionEntry from './components/Laiser/ProductionEntry';
import Laiser from './components/Laiser/Laiser';
import Inscan from './components/Booking/Inscan Data/Inscan';
import DailyManifest from './components/Booking/Daily Manifest/DailyManifest';
import RunsheetEntry from './components/Booking/Run Sheet Entry/RunsheetEntry';
import StatusActivity from './components/Booking/Status Activity Entry/StatusActivity';
import CustomerCharges from './components/Admin Master/Customer Charges/CustomerCharges';
import DailyBooking from './components/Booking/Daily Booking/DailyBooking';
import ViewInvoice from './components/Invoice/ViewInvoice';
import PaymentReceived from './components/Laiser/PaymentReceived';
import SignOut from './components/Login-pages/SignOut';
import MyProfile from './Components-2/Header/MyProfile';
import VehicleMaster from './components/Admin Master/Transport Master/VehicleMaster';
import DocketPrint from './components/Docket Print/DocketPrint';
import ZoneMaster from './components/Admin Master/Area Control/Zonemaster/Zonemaster';
import Docketpdf from './components/Docket Print/Docketpdf';
import Invoice from './components/Invoice/Invoice';
import RegionMaster from './components/Admin Master/Region Master/RegionMaster';
import DrsRunsheet from './components/Docket Print/DrsRunsheet';
import Manifest from './components/Docket Print/Manifest';
import MobileReceipt from './components/Docket Print/MobileReceipt';
import CustomerQuery from './components/Booking/Customer Query/CustomerQuery';
import StatusReport from './components/Booking/Status Report/StatusReport';
import Statement from './components/Booking/Statement/Statement';
import SalesRegister from './components/Booking/Sales Register/SalesRegister';
import FirstInvoice from './components/Docket Print/FirstInvoice';
import SecondInvoice from './components/Docket Print/SecondInvoice';
import UserAdmin from './components/User Control/UserAdmin';
import BranchAdmin from './components/User Control/BranchAdmin';
import PerformanceInvoice from './components/Docket Print/PerformanceInvoice';
import DocketBill from './components/Docket Print/DocketBill';
import VendorBoxLabel from './components/Docket Print/VendorBoxLabel';
import InternationalBooking from './components/Booking/Daily Booking/InternationalBooking';
import NewDP from './components/Docket Print/NewDp1';
import CreditPrint from './components/Docket Print/CreditPrint';
import LabelPrintingPdf from './components/Docket Print/LabelPrintingPdf';
import BoxStickerPdf from './components/Docket Print/BoxStickerPdf';

export const refeshPend=createContext();
function App() {
  const [ref,setRef]=useState(false);
  const refFun=()=>setRef(!ref);
  const [hub,setHub]=useState(false);
  const hubFun=()=>setHub(!hub);
  return (
    <refeshPend.Provider value={{ref,refFun,hub,hubFun}}>
    <Router>
      <div className="main">


        <Routes>
          <Route path='/' element={<NewLogin />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/sidebar1' element={<Sidebar1 />} />
          <Route path="/login" element={<NewLogin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signout' element={<SignOut />} />
          <Route path='/profile' element={<MyProfile />} />

          <Route path='/tab' element={<Tabs />} />
          <Route path='/zonemaster' element={<ZoneMaster />} />
          <Route path='/citymaster' element={<CityMaster />} />
          <Route path='/customerlist' element={<CustomerList />} />
          <Route path='/customercharges' element={<CustomerCharges />} />
          <Route path='/vendormaster' element={<VendorMaster />} />
          <Route path='/vehiclemaster' element={<VehicleMaster />} />
          <Route path='/branchmaster' element={<BranchMaster />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/regionmaster' element={<RegionMaster />} />

          <Route path='/dailybooking' element={<DailyBooking />} />
          <Route path='/dailymanifest' element={<DailyManifest />} />
          <Route path='/inscan' element={<Inscan />} />
          <Route path='/runsheet' element={<RunsheetEntry />} />
          <Route path='/statusactivity' element={<StatusActivity />} />
          <Route path='/podentry' element={<PodEntry />} />
          <Route path='/custquery' element={<CustomerQuery />} />
          <Route path='/internationalbooking' element={<InternationalBooking/>}/>

          <Route path='/docketprint' element={<DocketPrint />} />
          <Route path='/docketpdf' element={<Docketpdf />} />
          <Route path='/drsrunsheet' element={<DrsRunsheet />} />
          <Route path='/manifest' element={<Manifest />} />
          <Route path='/mobilereceipt' element={<MobileReceipt />} />
          <Route path='/firstinvoice' element={<FirstInvoice />} />
          <Route path='/secondinvoice' element={<SecondInvoice />} />
          <Route path='/performanceinvoice' element={<PerformanceInvoice />} />
          <Route path='/boxstickerprint' element={<BoxStickerPdf/>} />
          <Route path='/docketbill' element={<DocketBill />} />
          <Route path='/vendorboxlabel' element={<VendorBoxLabel />} />
          <Route path='/newdp' element={<NewDP/>} />
          <Route path='creditprint' element={<CreditPrint/>} />
          <Route path='/labelprint' element={<LabelPrintingPdf/>} />

          <Route path='/invoice' element={<Invoice />} />
          <Route path='/viewinvoice' element={<ViewInvoice />} />

          <Route path='/laiser' element={<Laiser />} />
          <Route path='/paymentreceived' element={<PaymentReceived />} />

          <Route path='/statusreport' element={<StatusReport />} />
          <Route path='/statement' element={<Statement />} />
          <Route path='/salesregister' element={<SalesRegister />} />

          <Route path='/orderentry' element={<OrderEntry />} />
          <Route path='/paymententry' element={<PaymentEntry />} />
          <Route path='/productionentry' element={<ProductionEntry />} />

          <Route path='/useradmin' element={<UserAdmin />} />
          <Route path='/branchadmin' element={<BranchAdmin />} />
        </Routes>
      </div>
    </Router>
    </refeshPend.Provider>
  );
}

export default App;
