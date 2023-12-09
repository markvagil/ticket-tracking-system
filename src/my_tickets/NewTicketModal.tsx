import { useState, ChangeEvent, FC, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { SketchPicker } from "react-color";
import { ColorResult } from "react-color";
import { Ticket, RGBColor } from "./MyTickets";
import FileAttachments, { FileAttachment } from "./FileAttachments"; // Import the FileAttachments component
import UserSearch from "./userSearch";
import SelectedUsersList from "./SelectedUsersList";
import "./NewTicketModal.css";

interface NewTicketModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (userId: string, ticket: Ticket) => void;
  userId: string;
}

const NewTicketModal: FC<NewTicketModalProps> = ({
  isOpen,
  onCancel,
  onSave,
  userId,
}) => {
  const defaultTicket = {
    title: "",
    description: "",
    uuid: false,
    id: "",
    category: "",
    users: [],
    ticket_status: { status_title: "", color: "" },
    attachments: [],
    internal_id: "",
    _id: "",
  };
  const [generateUUID, setGenerateUUID] = useState(false); // boolean
  const [ticket, setTicket] = useState<Ticket>(defaultTicket);
  const [selectedUsers, setSelectedUsers] = useState<
    { userId: string; userName: string }[]
  >([]);

  useEffect(() => {
    setGenerateUUID(false);
    setTicket({
      title: "",
      description: "",
      uuid: false,
      id: "",
      category: "",
      users: [],
      ticket_status: { status_title: "", color: "" },
      attachments: [],
      internal_id: "",
      _id: "",
    });
    setSelectedUsers([]);
  }, []);

  const handleStatusColorChange = (color: ColorResult) => {
    const rgbColor: RGBColor = color.rgb;
    const status = ticket.ticket_status;
    status.color = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
    setTicket((prevTicket) => ({
      ...prevTicket,
      ticket_status: status,
    }));
  };

  const handleStatusTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const status = ticket.ticket_status;
    status.status_title = e.target.value;
    setTicket((prevTicket) => ({
      ...prevTicket,
      ticket_status: status,
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGenerateUUID(e.target.checked);
    if (e.target.checked) {
      // If checkbox is checked, generate and set UUID for ID field
      setTicket((prevTicket) => ({
        ...prevTicket,
        uuid: true,
        id: uuidv4(),
      }));
    } else {
      // If checkbox is unchecked, reset ID field to user input
      setTicket((prevTicket) => ({
        ...prevTicket,
        uuid: false,
        id: "",
      }));
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTicket((prevTicket) => ({
      ...prevTicket,
      [name]: value,
    }));
  };

  const handleFilesChange = (files: FileAttachment[]) => {
    // Update the attachments in the ticket state
    setTicket((prevTicket) => ({
      ...prevTicket,
      attachments: files,
    }));
  };

  const handleSave = () => {
    console.log("Ticket to save: ", ticket);
    onSave(userId, ticket);
    setGenerateUUID(false);
    setTicket(defaultTicket);
    setSelectedUsers([]);
  };

  const handleCancel = () => {
    onCancel();
    setGenerateUUID(false);
    setTicket(defaultTicket);
    setSelectedUsers([]);
  };

  const handleUserSelect = (selectedUser: {
    userId: string;
    userName: string;
  }) => {
    // Check if the user with the same userId already exists in the list
    const userExists = selectedUsers.some(
      (user) => user.userId === selectedUser.userId
    );

    if (!userExists) {
      if (selectedUser.userId !== userId) {
        console.log("Selected userId: ", selectedUser.userId);
        console.log("Current userId: ", userId);
        // Add the selected user to the list of selected users
        setSelectedUsers((prevUsers) => [...prevUsers, selectedUser]);
        console.log("Selected users: ", selectedUsers);
        setTicket((prevTicket) => ({
          ...prevTicket,
          users: [...prevTicket.users, selectedUser],
        }));
      } else {
        console.warn("User cannot assign ticket to themselves!");
      }
    } else {
      // Handle the case where the user already exists (e.g., show a message)
      console.warn("User already selected!");
      // You can also choose to update the existing user or take other actions
    }
  };

  const handleRemoveUser = (userId: string) => {
    // Remove the user from the list of selected users
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((user) => user.userId !== userId)
    );

    // Remove the user from the users array inside the ticket state
    setTicket((prevTicket) => ({
      ...prevTicket,
      users: prevTicket.users.filter((user) => user.userId !== userId),
    }));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Your form inputs */}
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter a title"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter a description"
            onChange={handleInputChange}
          />
        </div>
        <div className="uuid-group">
          <label htmlFor="generateUUID">Generate UUID:</label>
          <input
            type="checkbox"
            id="generateUUID"
            name="generateUUID"
            checked={generateUUID}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={ticket.id}
            placeholder="Enter an ID or generate a UUID"
            onChange={handleInputChange}
            disabled={generateUUID} // Disable input field if generating UUID
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            placeholder="Enter a category"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <UserSearch
            onSelectUser={(selectedUser) => handleUserSelect(selectedUser)}
          />
          <SelectedUsersList
            selectedUsers={selectedUsers}
            onRemoveUser={handleRemoveUser}
          />
        </div>
        <div className="form-group">
          <label htmlFor="statusTitle">Status Title:</label>
          <input
            type="text"
            id="statusTitle"
            name="statusTitle"
            placeholder="Enter a status title"
            value={ticket.ticket_status.status_title}
            onChange={handleStatusTitleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="statusColor">Status Color:</label>
          <SketchPicker
            color={ticket.ticket_status.color}
            onChangeComplete={handleStatusColorChange}
            disableAlpha={true}
          />
        </div>
        <div className="form-group">
          <label>Upload Attachments (10 file limit):</label>
          <FileAttachments
            onFilesChange={handleFilesChange}
            isExistingTicket={false}
          />
        </div>
        <div className="buttons">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTicketModal;
