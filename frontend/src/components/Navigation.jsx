import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import Cookie from "js-cookie";

const Navigation = () => {
  const handleLogout = () => {
    Cookie.remove("token");
    localStorage.removeItem("token");

    window.location.href = "/";
  };
  return (
    <div className="h-80">
      <ul className="flex justify-between item-center h-100 list-type-none">
        <li className="">
          <Link to={"/"} className="text-decoration-none">
            Todo
          </Link>
        </li>
        <li className="">
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
