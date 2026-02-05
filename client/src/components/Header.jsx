import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import  { useAuth } from '../hooks/useAuth';
import "../styles/Header.css";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { getMe } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);
    }, []);


    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await getMe();
                setUser(res.user);
            } catch {
                setUser(null);
            }
        };

        loadUser();
    }, [location.pathname]);

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/login");
    };

    const goDashboard = () => {
        if (user.role === "SELLER") navigate("/seller");
        else if (user.role === "HOST") navigate("/host");
        else if (user.role === "BIDDER") navigate("/bidder");
        else navigate("/");
    };

    return (
        <header className={`header ${scrolled ? "scrolled" : ""}`}>
            <div className="header-container">
                <h1 className="logo" onClick={() => navigate("/")}>
                    BIDDING WEBSITE
                </h1>

                <div className="header-actions">
                    {!user ? (
                        <>
                            <button className="login-btn" onClick={() => navigate("/login")}>
                                LOG IN
                            </button>
                            <button className="signup-btn" onClick={() => navigate("/signup")}>
                                SIGN UP
                            </button>
                        </>
                    ) : (
                        <div className="profile-wrapper">
                            <div
                                className="profile-avatar"
                                onClick={() => setOpen(!open)}
                            >
                                {user.name?.charAt(0).toUpperCase()}
                            </div>

                            {open && (
                                <div className="profile-dropdown">
                                    <p className="email">{user.email}</p>

                                    <button onClick={goDashboard}>
                                        Dashboard
                                    </button>

                                    <button className="logout" onClick={logout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
