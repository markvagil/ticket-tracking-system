const API_URL = "https://ticket-tracking-system.onrender.com";
// const API_URL = "http://localhost:3000"; // for local testing

import { Ticket } from "../dashboard/Dashboard";

// Login API, user will login with their email and password
// If valid, return userId
// export function userLogin(userEmail: string, userPassword: string) {
//   return fetch(`${API_URL}/user_login`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ userEmail, userPassword }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       return data;
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       throw error; // propagate the error so that it can be caught in the calling function
//     });
// }

// (POST) get all data for a specific user based on their userId
export async function getUserData(userId: string, userName: string) {
  return fetch(`${API_URL}/get_user_data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, userName }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // propagate the error so that it can be caught in the calling function
    });
}

interface Data {
  type: string;
  data: number[];
}

interface FileData {
  filename: string;
  contentType: string;
  _id: string;
  data: Data;
}

export async function getTicketFiles(
  userId: string,
  ticketId: string
): Promise<FileData[]> {
  try {
    const response = await fetch(`${API_URL}/get_ticket_files`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, ticketId }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData: { files: FileData[] } = await response.json();
    console.log("responseData", responseData);

    return responseData.files;
  } catch (error) {
    console.error("Error:", error);
    throw error; // propagate the error so that it can be caught in the calling function
  }
}

export async function addNewTicket(userId: string, ticket: Ticket) {
  console.log("ticket", ticket);

  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("ticket", JSON.stringify(ticket));

  // Append each file attachment to the formData
  ticket.attachments.forEach((attachment) => {
    formData.append(`files`, attachment.file);
  });

  console.log("New Ticket formData", ...formData);
  return fetch(`${API_URL}/new_ticket`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // propagate the error so that it can be caught in the calling function
    });
}

// Update a ticket for a user based on their userId, ticketId, and the updated ticket object
export async function updateTicket(
  userId: string,
  ticketId: string,
  updatedTicket: object
) {
  return fetch(`${API_URL}/update_ticket`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, ticketId, updatedTicket }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // propagate the error so that it can be caught in the calling function
    });
}

// update ticket with files (broken)
// export function updateTicket(
//   userId: string,
//   ticketId: string,
//   updatedTicket: Ticket
// ) {
//   const formData = new FormData();
//   console.log("updatedTicket", updatedTicket);

//   // Append JSON data
//   formData.append("userId", userId);
//   formData.append("ticketId", ticketId);
//   formData.append("updatedTicket", JSON.stringify(updatedTicket));

//   // Append file data if available
//   // if (updatedTicket.attachments && updatedTicket.attachments.length > 0) {
//   updatedTicket.attachments.forEach((attachment) => {
//     formData.append(`files`, attachment.file);
//     console.log("attachment.file", attachment.file);
//   });
//   // }

//   console.log("Updated Ticket formData", ...formData);
//   return fetch(`${API_URL}/update_ticket`, {
//     method: "PATCH",
//     body: formData,
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       return data;
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       throw error; // propagate the error so that it can be caught in the calling function
//     });
// }

// Delete a ticket for a user based on their userId and ticketId
export async function deleteTicket(userId: string, ticketId: string) {
  return fetch(`${API_URL}/delete_ticket`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, ticketId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // propagate the error so that it can be caught in the calling function
    });
}

export async function userSearch(searchQuery: string) {
  return fetch(`${API_URL}/user_search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ searchQuery }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // propagate the error so that it can be caught in the calling function
    });
}

export async function assignUser(assignedUserId: string, ticketId: string) {
  return fetch(`${API_URL}/assign_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assignedUserId, ticketId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // propagate the error so that it can be caught in the calling function
    });
}

export async function unassignUser(assignedUserId: string, ticketId: string) {
  return fetch(`${API_URL}/unassign_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assignedUserId, ticketId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // propagate the error so that it can be caught in the calling function
    });
}

export async function getAssignedTickets(userId: string) {
  return fetch(`${API_URL}/get_assigned_tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("response", response);
      return response.json();
    })
    .then((data) => {
      console.log("data", data);
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}
