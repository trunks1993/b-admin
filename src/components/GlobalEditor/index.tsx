import React, { ForwardRefRenderFunction, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface GlobalEditorProps {
  value?: string;
  onChange?: (e: string) => void;
}

const GlobalEditor: ForwardRefRenderFunction<unknown, GlobalEditorProps> = props => {
  const { value, onChange } = props;

  // const [value, setValue] = useState('');

  // const modules = {
  //   toolbar: [
  //     ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  //     ['blockquote', 'code-block'],
  //     ['link', 'image'],

  //     [{ header: 1 }, { header: 2 }], // custom button values
  //     [{ list: 'ordered' }, { list: 'bullet' }],
  //     [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  //     [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  //     [{ direction: 'rtl' }], // text direction

  //     // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  //     // [{ header: [1, 2, 3, 4, 5, 6, false] }],

  //     [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  //     [{ font: [] }],
  //     [{ align: [] }],

  //     ['clean'], // remove formatting button
  //   ],
  // };
  const handleOnChange = (e: string) => {
    onChange && onChange(e);
  };

  return <ReactQuill theme="snow" value={value || ''} onChange={handleOnChange} />;
};

export default React.forwardRef(GlobalEditor);
