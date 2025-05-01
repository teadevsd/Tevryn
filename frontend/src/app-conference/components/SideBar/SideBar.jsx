import { Link, useLocation } from "react-router-dom";
import { sideBarLinks } from "../../constants/sidebarLinks";
import './SideBar.css';
import cn from "classnames";

const SideBar = () => {
    const { pathname } = useLocation();

    return (
        <div className="sideBarWrapper">
            <section className="sideCont">
                <div className="sideLayers">
                    {sideBarLinks.map((link) => {
                        const isActive = pathname === link.route; // ✅ FIXED HERE
                        return (
                            <Link 
                                to={link.route}
                                key={link.label}
                                className={cn("sideLink", { "active": isActive })}
                            >
                                <img 
                                    src={link.imgUrl}
                                    alt={link.label}
                                    width={20} 
                                    height={20}
                                />
                                <p>{link.label}</p>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default SideBar;
