import React from 'react';

interface GlobalEditorProps {
  value?: string;
  onChange?: (e: string) => void;
}
class GlobalEditor extends React.Component<GlobalEditorProps> {
  state = {
    hasInit: false,
    hasChange: false,
  };

  handleEditorChange = (content: string) => {
    const { onChange } = this.props;
    onChange && onChange(content);
  };

  initTinymce() {
    const { tinymceId, menubar, height, toolbar, content, getContent } = this.props;
    const _this = this;
    window.tinymce.init({
      language: 'zh_CN',
      selector: `#${tinymceId}`,
      height: height,
      body_class: 'panel-body ',
      object_resizing: false,
      menubar: menubar,
      end_container_on_empty_block: true,
      powerpaste_word_import: 'clean',
      code_dialog_width: 1000,
      advlist_bullet_styles: 'square',
      advlist_number_styles: 'default',
      imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
      default_link_target: '_blank',
      link_title: false,
      nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
      init_instance_callback: editor => {
        if (content) {
          editor.setContent(content);
        }
        _this.setState({
          hasInit: true,
        });
        editor.on('NodeChange Change KeyUp SetContent', () => {
          _this.setState({
            hasChange: true,
          });
        });
      },
      setup(editor) {
        editor.on('FullscreenStateChanged', e => {
          _this.setState({
            fullscreen: e.state,
          });
        });
      },
    });
  }

  render() {
    return <div></div>;
  }
}

export default GlobalEditor;
