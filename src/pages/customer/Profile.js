import Logo from '../../assets/logo.svg'
import QR from '../../assets/qrcode.svg'

import '../../styles/pages/customer/Profile.css'

export default function Profile({ user }) {
    return (
        <div className="row">
            <div className="col user-detail">
                <h2>My Profile</h2>
                <div className="row">
                    <img className="user-image" src={user?.image} alt="user_image" />
                    <div className="col">
                        <h4>Full Name</h4>
                        <h4>{user ? user.fullName : '-'}</h4>
                        <br />
                        <h4>Email</h4>
                        <h4>{user ? user.email : '-'}</h4>
                    </div>
                </div>
            </div>
            <div className="col transactions">
                <h2>My Transactions</h2>
                <div className="hidden">
                    <div>
                        <div className="row transaction-card">
                            <div className="col">Item List</div>
                            <div className="status">
                                <img className="logo" src={Logo} alt="logo" />
                                <img className="qr" src={QR} alt="barcode" />
                                <p>On The Way</p>
                                <h5>Sub Total: 69.000</h5>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row transaction-card">
                            <div className="col">Item List</div>
                            <div className="status">
                                <img className="logo" src={Logo} alt="logo" />
                                <img className="qr" src={QR} alt="barcode" />
                                <p>On The Way</p>
                                <h5>Sub Total: 69.000</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
