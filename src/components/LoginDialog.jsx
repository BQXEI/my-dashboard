export default function LoginDialog({ open, onClose, onSubmit }) {
  if (!open) return null;
  let name, email, role;

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      name: name.value,
      email: email.value,
      role: role.value,
      avatarUrl: "",
    });
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal__content">
        <h3>Login</h3>
        <form onSubmit={handleSubmit} className="col gap">
          <input placeholder="Name" ref={(r) => (name = r)} />
          <input placeholder="Email" ref={(r) => (email = r)} />
          <input placeholder="Role" ref={(r) => (role = r)} />
          <div className="row gap mt">
            <button type="submit" className="btn">Login</button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
