// // FileAttachments.tsx

// import { ChangeEvent, FC, useState } from "react";

// export interface FileAttachment {
//   id: number;
//   file: File;
// }

// interface FileAttachmentsProps {
//   onFilesChange: (files: FileAttachment[]) => void;
// }

// const FileAttachments: FC<FileAttachmentsProps> = ({ onFilesChange }) => {
//   const [files, setFiles] = useState<FileAttachment[]>([]);

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files ? e.target.files[0] : null;
//     if (file) {
//       const newFile: FileAttachment = { id: files.length, file };
//       setFiles((prevFiles) => [...prevFiles, newFile]);
//       onFilesChange([...files, newFile]);
//     }
//   };

//   const handleRemoveFile = (id: number) => {
//     const updatedFiles = files.filter((file) => file.id !== id);
//     setFiles(updatedFiles);
//     onFilesChange(updatedFiles);
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <ul>
//         {files.map((attachment) => (
//           <li key={attachment.id}>
//             {attachment.file.name}
//             <button onClick={() => handleRemoveFile(attachment.id)}>
//               Remove
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default FileAttachments;

import { ChangeEvent, FC, useEffect, useState } from "react";

export interface FileAttachment {
  id: number;
  file: File;
}

interface FileAttachmentsProps {
  onFilesChange: (files: FileAttachment[]) => void;
  initialFiles?: FileAttachment[];
  isExistingTicket?: boolean;
}

const FileAttachments: FC<FileAttachmentsProps> = ({
  onFilesChange,
  initialFiles,
  isExistingTicket,
}) => {
  const [files, setFiles] = useState<FileAttachment[]>(initialFiles || []);

  useEffect(() => {
    if (initialFiles) {
      setFiles(initialFiles);
    }
  }, [initialFiles]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const newFile: FileAttachment = { id: files.length, file };
      setFiles((prevFiles) => [...prevFiles, newFile]);
      onFilesChange([...files, newFile]);
    }
  };

  const handleRemoveFile = (id: number) => {
    const updatedFiles = files.filter((file) => file.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDownloadFile = (file: File) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(file);
    downloadLink.download = file.name;
    downloadLink.click();
  };

  return (
    <div>
      {!isExistingTicket && <input type="file" onChange={handleFileChange} />}
      <ul>
        {files.map((attachment) => (
          <li key={attachment.id}>
            {attachment.file.name}
            {!isExistingTicket && (
              <button onClick={() => handleRemoveFile(attachment.id)}>
                Remove
              </button>
            )}
            {isExistingTicket && (
              <button onClick={() => handleDownloadFile(attachment.file)}>
                Download
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileAttachments;
