import "./CreateTicketButton.css";

interface Props {
  onClick: () => void;
}

const CreateTicketButton = ({ onClick }: Props) => {
  return (
    <div className="create-ticket-button">
      <button onClick={onClick} className="button-link">
        Create New Ticket
      </button>
    </div>
  );
};

export default CreateTicketButton;
