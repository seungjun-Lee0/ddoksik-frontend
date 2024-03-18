import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from "../../Context/Account";
import { Modal } from "../shared/ErrorModal";

function ChangeName({ name: initialName }) {
    const [name, setName] = useState(initialName); // 초기 이름을 props에서 받아옵니다.
    const { getSession } = useContext(AccountContext);

    useEffect(() => {
        setName(initialName); // props에서 받은 초기 이름으로 상태를 업데이트합니다.
    }, [initialName]);

    const onSubmit = (event) => {
        event.preventDefault();

        // 사용자가 이름 변경을 확인합니다.
        const isConfirmed = window.confirm("이름을 바꾸시겠습니까?");
        if (!isConfirmed) {
            return; // 사용자가 취소하면 여기서 중단합니다.
        }

        getSession().then(({ user }) => {
            const attributes = [{
                Name: 'name',
                Value: name
            }];

            user.updateAttributes(attributes, (err, result) => {
                if (err) {
                    console.error("Error updating name:", err);
                    return;
                }
                console.log("Name updated successfully:", result);
                alert("이름이 성공적으로 업데이트되었습니다.");
            });
        }).catch(err => {
            console.error("Error fetching session:", err);
        });
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <label htmlFor="name">이름 변경하기:</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">수정</button>
            </form>
        </div>
    );
}

export default ChangeName;
