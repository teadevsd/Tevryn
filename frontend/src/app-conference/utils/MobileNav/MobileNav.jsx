import React, { useState } from "react";
import "./MobileNav.css";
import Sheet from "../Sheet/Sheet";
import { sideBarLinks } from "../../constants/sidebarLinks";
import { Link, useLocation } from "react-router-dom";
import cn from "classnames";
import { MdClose } from "react-icons/md"; // Import Close Icon

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      {/* Hide Sidebar when MobileNav is Available */}
      <style>{`
        @media (max-width: 768px) {
          .sideBarWrapper {
            display: none;
          }
        }
      `}</style>

      <div className="mobileNavWrapper">
        {/* Toggle Button */}
        <button className="menu-button" onClick={() => setOpen(!open)}>
          {open ? <MdClose size={24} /> : "☰"} {/* Show X when open, ☰ when closed */}
        </button>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <div className="mobileMenu">
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
        </Sheet>
      </div>
    </>
  );
};

export default MobileNav;
