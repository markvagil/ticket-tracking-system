import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { getUserData } from "../api/api_service";
import Navbar from "../components/Navbar";
import CreateTicketButton from "./CreateTicketButton";
import NewTicketModal from "./NewTicketModal";
import ExistingTicketModal from "./ExistingTicketModal";
import { FileAttachment } from "./FileAttachments";
import {
  addNewTicket,
  updateTicket,
  deleteTicket,
  getTicketFiles,
  assignUser,
  unassignUser,
} from "../api/api_service";
import "./MyTickets.css";
import { Grid, List } from "react-bootstrap-icons";

interface UserData {
  userId: string;
  userName: string;
  tickets: Ticket[];
  assignedTickets: Ticket[];
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface Ticket {
  ticket_status: {
    status_title: string;
    color: string;
  };
  internal_id: string;
  title: string;
  description: string;
  uuid: boolean;
  id: string;
  category: string;
  users: { userId: string; userName: string }[];
  attachments: FileAttachment[];
  _id: string;
}

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [isNewModalOpen, setNewModalOpen] = useState(false);
  const [isExistingModalOpen, setExistingModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [existingTicketToPass, setExistingTicketToPass] = useState<Ticket>();
  const [isGridView, setIsGridView] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        let userName = "";
        if (user.username) {
          userName = user.username;
        }
        const data = await getUserData(user.id, userName);
        console.log("user data", data);
        setUserData(data.user);
      }
    };

    fetchData();
  }, [user]);

  const openNewModal = () => {
    setNewModalOpen(true);
  };

  const closeNewModal = () => {
    setNewModalOpen(false);
  };

  const saveNewTicket = async (userId: string, ticket: Ticket) => {
    console.log("Saving new ticket for user: ", userId);
    const data = await addNewTicket(userId, ticket);

    if (ticket.users.length > 0) {
      const latestTicket = data.user.tickets[data.user.tickets.length - 1];
      console.log("latestTicket", latestTicket);

      if (latestTicket) {
        const ticketId = latestTicket.internal_id;
        await Promise.all(
          ticket.users.map((user) => assignUser(user.userId, ticketId))
        );
      }
    }

    console.log(data);
    setUserData(data.user);
    closeNewModal();
  };

  const openExistingModal = () => {
    setExistingModalOpen(true);
  };

  const closeExistingModal = () => {
    setExistingModalOpen(false);
  };

  const saveExistingTicket = async (
    userId: string,
    ticket: Ticket,
    originallyAssignedUsers: { userId: string; userName: string }[]
  ) => {
    console.log("Updating existing ticket for user: ", userId);
    const data = await updateTicket(userId, ticket.internal_id, ticket);

    // Assign users to the ticket
    if (ticket.users.length > 0) {
      const latestTicket = data.user.tickets[data.user.tickets.length - 1];
      console.log("latestTicket", latestTicket);

      if (latestTicket) {
        const ticketId = latestTicket.internal_id;
        await Promise.all(
          ticket.users.map((user) => assignUser(user.userId, ticketId))
        );
      }
    }

    // Unassign users from the ticket (if any)
    if (originallyAssignedUsers.length > 0) {
      // Get the list of user IDs in the updated ticket
      const updatedUserIds = ticket.users.map((user) => user.userId);

      // Filter originally assigned users who are not present in the updated ticket
      const usersToUnassign = originallyAssignedUsers.filter(
        (user) => !updatedUserIds.includes(user.userId)
      );
      console.log("usersToUnassign", usersToUnassign);

      // Unassign users who are not present in the updated ticket
      const ticketId = ticket.internal_id;
      await Promise.all(
        usersToUnassign.map((user) => unassignUser(user.userId, ticketId))
      );
    }

    console.log(data);
    setUserData(data.user);
    closeExistingModal();
  };

  const deleteExistingTicket = async (userId: string, ticket: Ticket) => {
    console.log("Deleting ticket for user: ", userId);
    const data = await deleteTicket(userId, ticket.internal_id);

    // unassign users from the ticket (if any)
    if (ticket.users.length > 0) {
      await Promise.all(
        ticket.users.map((user) =>
          unassignUser(user.userId, ticket.internal_id)
        )
      );
    }

    console.log(data);
    setUserData(data.user);
    closeExistingModal();
  };

  const handleTicketClick = async (userId: string, ticket: Ticket) => {
    console.log("Ticket clicked: ", ticket);

    try {
      const filesData = await getTicketFiles(userId, ticket.internal_id);
      console.log(filesData); // Log the retrieved data

      // Transform FileData[] to FileAttachment[]
      const files: FileAttachment[] = filesData.map((fileData, index) => {
        // Decode base64-encoded data
        const decodedData = atob(String.fromCharCode(...fileData.data.data));

        // Convert decoded data to Uint8Array
        const dataArray = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; i++) {
          dataArray[i] = decodedData.charCodeAt(i);
        }

        // Create a Blob with the data
        const blob = new Blob([dataArray], { type: fileData.contentType });

        return {
          id: index, // or any logic to generate a unique id
          file: new File([blob], fileData.filename), // Using the Blob directly
        };
      });

      ticket.attachments = files;
      setExistingTicketToPass(ticket);
      openExistingModal();
    } catch (error) {
      console.error("Error fetching ticket files:", error);
      // Handle the error as needed
    }
  };

  return (
    <>
      <div className="Dashboard">
        <Navbar />
        <div>
          {/* Use userData instead of user */}
          <div className="page-header">
            <h1>My Tickets</h1>
            <div className="page-header-buttons">
              <CreateTicketButton onClick={openNewModal} />
              <button
                className="grid-view-button"
                onClick={() => setIsGridView((prev) => !prev)}
              >
                {isGridView ? <List /> : <Grid />}
              </button>
            </div>
          </div>
          <NewTicketModal
            isOpen={isNewModalOpen}
            onCancel={closeNewModal}
            onSave={saveNewTicket}
            userId={userData?.userId || ""}
          />
          <ExistingTicketModal
            isOpen={isExistingModalOpen}
            onCancel={closeExistingModal}
            onSave={saveExistingTicket}
            onDelete={deleteExistingTicket}
            userId={userData?.userId || ""}
            existingTicket={existingTicketToPass as Ticket}
          />
          {/* Display Personally Created Tickets */}
          <div className="TicketList">
            {userData && userData.tickets && userData.tickets.length > 0 ? (
              <div
                className={`TicketContainer ${isGridView ? "grid-view" : ""}`}
              >
                {userData.tickets.map((ticket: Ticket) => (
                  <div
                    key={ticket.internal_id}
                    className={`TicketCard ${isGridView ? "grid-card" : ""}`}
                    onClick={() => handleTicketClick(userData.userId, ticket)}
                  >
                    {/* <div className="TicketFields"> */}
                    <div className="TicketHeader">
                      <div className="title">
                        <strong></strong> {ticket.title}{" "}
                      </div>
                      <div className="id">
                        <strong></strong> {ticket.id}{" "}
                      </div>
                    </div>
                    <div className="category">
                      <strong>Category:</strong> {ticket.category}{" "}
                    </div>
                    <div className="users">
                      <strong>Users:</strong>{" "}
                      {ticket.users.map((user, index) => (
                        <span key={index}>
                          {user.userName}
                          {index !== ticket.users.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                    <div
                      className="status"
                      style={{ backgroundColor: ticket.ticket_status.color }}
                    >
                      <strong></strong> {ticket.ticket_status.status_title}{" "}
                    </div>
                    {/* </div> */}
                  </div>
                ))}
              </div>
            ) : (
              <h2 className="no-tickets">
                No personally created tickets available.
              </h2>
            )}
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Dashboard;
