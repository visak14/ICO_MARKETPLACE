import React, { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDropzone } from 'react-dropzone';

//INTERNAL IMPORT
import UploadICON from "./SVG/UploadICON";

const UploadLogo = ({
  imageURL,
  setimageURL,
  setLoader,
  PINATA_API_KEY,
  PINATA_SECRET_KEY,
}) => {
  const notifySuccess = (msg) => toast.success(msg, { duration: 200 });
  const notifyError = (msg) => toast.error(msg, { duration: 200 });

  const uploadToIPFS = async (file) => {
    if (file) {
      try {
        setLoader(true); // Start loader
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          maxBodyLength: "Infinity",
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
            "Content-Type": "multipart/form-data",
          },
        });

        const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        setimageURL(url); // Set the uploaded image URL
        notifySuccess("Logo uploaded successfully");
      } catch (error) {
        notifyError("Check your Pinata keys or file size");
        console.log(error);
      } finally {
        setLoader(false); // Stop the loader in finally block
      }
    }
  };

  const onDrop = useCallback(async (acceptedFile) => {
    try {
      await uploadToIPFS(acceptedFile[0]);
    } catch (error) {
      notifyError("File upload failed");
    }
  }, [uploadToIPFS]);

  const { getInputProps, getRootProps } = useDropzone({ onDrop, maxSize: 5000000 }); // Limit file size to 5MB

  return (
    <>
      {imageURL ? (
        <div>
          <img src={imageURL} style={{ width: '200px', height: 'auto' }} alt="Uploaded Logo" />
        </div>
      ) : (
        <div {...getRootProps()}>
          <label htmlFor="file" className="custom-file-upload">
            <div className="icon">
              <UploadICON />
            </div>
            <div className="text">
              <span>Click to upload Logo</span>
            </div>
            <input type="file" id="file" {...getInputProps()} />
          </label>
        </div>
      )}
    </>
  );
};

export default UploadLogo;
