import React, { useState } from "react";
import { Axios as axios } from "axios";

const FileUpload = () => {
  const [fileContent, setFileContent] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleFileUplaod = async (e) => {
    const timestamp = new Date().getTime();
    const file = e.target.files[0];
    const filename =
      file.name
        .split(".")[0]
        .replace(/[&\/\\#,+()$~%'":*?<>{}]/g, "")
        .toLowerCase() + `_${timestamp}`;
    const fileExtension = file.name.split(".").pop();

    await uploadImage(`${filename}.${fileExtension}`, file);
    // console.log("e.target.files[0]: " + JSON.stringify(e.target.files[0]));
    // console.log("fileContent: " + fileContent);
  };

  const uploadImage = async (filename, file) => {
    const foldersPath = "tests/test1";
    const options = { headers: { "Content-Type": file.type } };

    try {
      const s3Urls = await axios
        .get(
          `http://localhost:3001/api/v1/files?filename=${filename}&path=${foldersPath}&contentType=${file.type}`
        )
        .then((response) => response.data?.urls);

      if (!s3Urls.signedUrl) {
        throw new Error("S3 signed url is not defined");
      }

      await axios.put(s3Urls.signedUrl, file, options);

      setImageUrl(s3Urls.publicUrl);
    } catch (err) {
      console.error(`Error uploading image: ${err.message}`);
    }
  };

  return (
    <main>
      <div>FileUpload</div>
      <input type="file" id="fileUpload" onChange={handleFileUplaod} />
      {JSON.stringify(fileContent)}
    </main>
  );
};

export default FileUpload;
