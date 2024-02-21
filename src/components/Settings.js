import React, { useEffect, useContext, useState } from "react";
import { AccountContext } from "../Context/Account";
import ChangePassword from "./ChangePassword"; 
import ChangeName from "./ChangeName";

export default () => {
    const { getSession } = useContext(AccountContext);
    const [name, setName] = useState("");

    useEffect(() => {
        getSession().then((session) => {
            setName(session.name);
        });
    }, []);

    return (
        <div className="settings">
            <h2>Settings</h2>
            <ChangeName name={name} />
            <ChangePassword/>
        </div>
    );
};