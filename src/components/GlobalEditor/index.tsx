import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface GlobalEditorProps {
  value?: string;
  onChange?: (e: string) => void;
}
class GlobalEditor extends React.Component<GlobalEditorProps> {
  handleEditorChange = (content: string) => {
    const { onChange } = this.props;
    onChange && onChange(content);
  };

  render() {
    const { value } = this.props;
    const editorObj = {
      height: '400px',
      menubar: false,
      language: 'zh_CN',
      //   language_url : '翻译中文的路径，我尝试很多种方法都不成功，最后叫后台的老哥放进项目的服务器上了，用的线上地址',
      plugins: 'table lists link image preview code',
      toolbar: `formatselect | code | preview | bold italic strikethrough forecolor backcolor | 
      link image | alignleft aligncenter alignright alignjustify  | 
      numlist bullist outdent indent`,
      relative_urls: false,
      file_picker_types: 'image',
      //   images_upload_url: {'上传图片的路径'},
      //   image_advtab: true,
      //   image_uploadtab: true,
      //   images_upload_handler:(blobInfo, success, failure)=>{
      //   		//这里写你上传图片的方法
      //   }
    };
    return (
      <Editor
        inline={false}
        selector="editorStateRef" // 选择器
        apiKey="5s3sribyo3d9ne7zviv7mz4nrcdrt4yhmt55gzcb5rb0f61g"
        initialValue={value}
        init={{ ...editorObj }}
        onEditorChange={this.handleEditorChange}
      />
    );
  }
}

export default GlobalEditor;
