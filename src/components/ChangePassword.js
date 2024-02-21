import React, {useState, useContext} from "react";
import { AccountContext } from "../Context/Account";
// import { Modal } from "./shared/ErrorModal";

export default () => {
    const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const { getSession, logout } = useContext(AccountContext);

  const onSubmit = (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setModalContent("비밀번호가 일치하지 않습니다.");
      setModalOpen(true);
      return;
    }

    getSession().then(({ user }) => {
      user.changePassword(password, newPassword, (err, result) => {
        if (err) {
            setModalContent("현재 비밀번호가 일치하지 않습니다.");
            setModalOpen(true);
          return;
        }
        console.log(result);
        logout();
      });
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button type="submit">Change Password</button>
      </form>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <p>{modalContent}</p>
      </Modal>
    </div>
  );
}