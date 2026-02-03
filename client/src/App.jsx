import { Routes, Route } from "react-router-dom";
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import VerifyEmail from './Pages/VerifyEmail';
import SellerDashboard from './Pages/SellerDashboard';
import HostDashboard from './Pages/HostDashboard';
import BidderDashboard from './Pages/BidderDashboard';
import Home from './Pages/Home';
import HostLiveAuction from './Pages/HostLiveAuction';
import BidderLiveAuction from './Pages/BidderLiveAuction';

function App(){
  return(
    <Routes>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/verify-email' element={<VerifyEmail/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/seller' element={<SellerDashboard/>}/>
      <Route path='/host' element={<HostDashboard/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/bidder' element={<BidderDashboard/>}/>
      <Route path='/hostlive/:auctionkey' element={<HostLiveAuction/>}/>
      <Route path='/bidlive/:auctionkey' element={<BidderLiveAuction/>}/>
    </Routes>
  )
}

export default App;