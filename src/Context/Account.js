import React, { createContext } from "react";
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from './UserPool';
import UserPool from "./UserPool";

const AccountContext = createContext();

const Account = (props) => {
    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if (user) {
                user.getSession(async (err, session) => {
                    if (err) {
                        reject(err);
                    } else {
                        const attributes = await new Promise((resolve, reject) => {
                            user.getUserAttributes((err, attributes) => {
                                if (err) {
                                    reject(err);
                                } else{
                                    const results = {};
    
                                    for (let attribute of attributes) {
                                        const {Name, Value } = attribute;
                                        results[Name] = Value;
                                    }
                                    resolve(results);             
                                }
                            });
                        });
                        resolve({ user, ...session, ...attributes });
                    }
                });
            } else{
                const error = "No current user";
                reject(error);
            }
        }
    )};

    const authenticate = async (Username, Password) => {
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({ Username, Pool });

            const authDetails = new AuthenticationDetails({ Username, Password });

            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    console.log("onSuccess: ", data);
                    resolve(data);
                },
                onFailure: (err) => {
                    console.error("onFailure :", err);
                    reject(err);
                },
                newPasswordRequired: (data) => {
                    console.log("newPasswordRequired: ", data);
                    resolve(data);
                },
            });
        });
    };

    const signUp = async(email, name, password) => {
        return await new Promise((resolve, reject) => {
            var attributeList = [];

            var userName = {
                Name: "name",
                Value: name
            }

            attributeList.push(userName);

            UserPool.signUp(email, password, attributeList, null, (err, data) => {
                if (err) {
                    console.log("Failed to register", err.message);
                    reject();
                } else {
                    console.log("Account created Successfully", data);
                    resolve();
                }
            });
        })
    };

    const logout = () => {
        const user = Pool.getCurrentUser();
        if (user) {
            user.signOut();
        }
        window.location.reload();
    };

    return (
        <AccountContext.Provider value={{ authenticate, getSession, logout, signUp}}>
            {props.children}
        </AccountContext.Provider>
    )
};
export { Account, AccountContext };