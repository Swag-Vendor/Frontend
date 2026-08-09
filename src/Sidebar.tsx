import React from "react";

import { useNavigate } from "react-router-dom";



interface SidebarProps {

  activeItem?: string;

}



const Sidebar = ({ activeItem = "Dashboard" }: SidebarProps) => {

  const navigate = useNavigate();



  const menuItems = [

    { label: "Dashboard", path: "/" },

    { label: "VendorQuotes", path: "/vendor-quotes" },

    { label: "Budget", path: "/budget" },

  ];

// OK I BELIEVE that once you get the other pages running the only changes needed to be made here should be the names of each thingy magigy



  return (

    <aside

      style={{

        width: "180px",

        minHeight: "100vh",

        backgroundColor: "#FFF8E6",

        borderRight: "2px solid #E8D5A3",

        display: "flex",

        flexDirection: "column",

        padding: "16px",

        fontFamily: "monospace",

        overflow: "hidden",

      }}

    >

      <div

        style={{

          fontSize: "20px",

          fontWeight: "bold",

          marginBottom: "24px",

        }}

      >

        SwagLab

      </div>



      <nav

        style={{

          display: "flex",

          flexDirection: "column",

          gap: "8px",

          flex: 1,

        }}

      >

        {menuItems.map((item) => (

          <button            key={item.label}

            onClick={() => navigate(item.path)}

            style={{

              textAlign: "left",

              padding: "8px 12px",

              borderRadius: "6px",

              border: "none",

              fontFamily: "monospace",

              fontWeight: "bold",

              cursor: "pointer",

              backgroundColor: item.label === activeItem ? "#4A9EE8" : "transparent",

              color: item.label === activeItem ? "white" : "#78350f",

            }}

          >

            {item.label}

          </button>

        ))}

      </nav>



      <div

        style={{

          width: "120px",

          height: "120px",

          borderRadius: "50%",

          backgroundColor: "#4A9EE8",

          display: "flex",

          flexDirection: "column",

          justifyContent: "center",

          color: "white",

          margin: "16px auto 0",

          textAlign: "center",

        }}

      >

        <span style={{ fontSize: "11px", fontFamily: "monospace" }}>

          Masterfund

        </span>

        <span

          style={{

            fontSize: "18px",

            fontWeight: "bold",

            fontFamily: "monospace",

          }}

        >

          $25000

        </span>

      </div>

    </aside>

  );

};



export default Sidebar;