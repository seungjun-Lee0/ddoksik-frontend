import React, { useEffect, useContext, useState } from "react";
import { AccountContext } from "../../Context/Account";
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
        <div className="profile-container">
            <div className="profile-box">
            <h1 className="title">Settings</h1>
                <div className="grid">
                    <div className="form-group">
                        <ChangeName name={name} />
                    </div>
                    <div className="form-group">
                        <ChangePassword/>
                    </div>
                </div>
            </div>
        </div>
    );
};