import React, { ForwardRefRenderFunction, useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader/src/quill.imageUploader";
Quill.register("modules/imageUploader", ImageUploader);
import axios from 'axios'
import Quill from "quill";

interface GlobalEditorProps {
  value?: string;
  onChange?: (e: string) => void;
}

const GlobalEditor: ForwardRefRenderFunction<unknown, GlobalEditorProps> = props => {

  const { value, onChange } = props;
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [
        { list: "ordered" },
        { list: "bullet" },
      ],
      ['bold'], // toggled buttons
      ['link', 'image'],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],

      ['clean'], // remove formatting button
    ],
    imageUploader: {
      upload: async (file: any) => {
        let param = new FormData();
        param.append("file", file);
        param.append("userName", 'yunjin_file_upload');
        param.append("password", 'yunjin_upload_password');
        param.append("domain", 'editor');
        param.append("secret", 'Y');
        let config = {
          headers: { "Content-Type": "multipart/form-data" },
        };
        return await new Promise(pr => {
          axios.post("/file/upload", param, config).then((res) => {
            setTimeout(() => { pr(process.env.BASE_FILE_SERVER + res?.data?.result?.fileList[0]?.url) }, 1000)
          });
        })

      },
    },
  };

  const handleChange = (e) => {
    // onChange && onChange(e);
    sessionStorage.setItem('editor', e)
  }

  return (
    <ReactQuill theme="snow" placeholder="请输入使用须知" className="ql-editor" value={sessionStorage.getItem('editor') || ''} modules={modules} style={{ lineHeight: 0 }} onChange={(e) => { handleChange(e) }} />
  );
};

export default GlobalEditor;
