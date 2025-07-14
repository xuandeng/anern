'use client';

import { useEffect, useRef, useState } from 'react';

const Editor = ({ value = '', onChange, placeholder = '开始写作...', disabled = false }) => {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    const loadEditor = async () => {
      try {
        const { ClassicEditor } = await import('@ckeditor/ckeditor5-editor-classic/src/classiceditor');
        const { Essentials } = await import('@ckeditor/ckeditor5-essentials/src/essentials');
        const { Bold, Italic } = await import('@ckeditor/ckeditor5-basic-styles');
        const { Paragraph } = await import('@ckeditor/ckeditor5-paragraph/src/paragraph');
        const { Heading } = await import('@ckeditor/ckeditor5-heading/src/heading');
        const { List } = await import('@ckeditor/ckeditor5-list/src/list');
        const { Link } = await import('@ckeditor/ckeditor5-link/src/link');
        const { Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload } = await import('@ckeditor/ckeditor5-image');
        const { Table, TableToolbar } = await import('@ckeditor/ckeditor5-table');
        const { MediaEmbed } = await import('@ckeditor/ckeditor5-media-embed/src/mediaembed');
        const { BlockQuote } = await import('@ckeditor/ckeditor5-block-quote/src/blockquote');
        const { Alignment } = await import('@ckeditor/ckeditor5-alignment/src/alignment');

        if (editorRef.current && !editorInstance) {
          const editor = await ClassicEditor.create(editorRef.current, {
            plugins: [
              Essentials,
              Bold,
              Italic,
              Paragraph,
              Heading,
              List,
              Link,
              Image,
              ImageCaption,
              ImageStyle,
              ImageToolbar,
              ImageUpload,
              Table,
              TableToolbar,
              MediaEmbed,
              BlockQuote,
              Alignment
            ],
            toolbar: {
              items: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'alignment',
                'outdent',
                'indent',
                '|',
                'imageUpload',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                '|',
                'undo',
                'redo'
              ]
            },
            heading: {
              options: [
                { model: 'paragraph', title: '段落', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: '标题 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: '标题 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: '标题 3', class: 'ck-heading_heading3' }
              ]
            },
            image: {
              toolbar: [
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'toggleImageCaption',
                'imageTextAlternative'
              ]
            },
            table: {
              contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
              ]
            },
            // 自定义图片上传适配器
            simpleUpload: {
              uploadUrl: '/api/upload',
              withCredentials: true,
              headers: {
                'X-CSRF-TOKEN': 'CSRF-Token',
              }
            },
            placeholder
          });

          // 设置初始内容
          if (value) {
            editor.setData(value);
          }

          // 监听内容变化
          editor.model.document.on('change:data', () => {
            const data = editor.getData();
            if (onChange) {
              onChange(data);
            }
          });

          // 禁用编辑器
          if (disabled) {
            editor.enableReadOnlyMode('disabled');
          }

          setEditorInstance(editor);
        }

        setEditorLoaded(true);
      } catch (error) {
        console.error('Editor loading failed:', error);
      }
    };

    if (!editorLoaded) {
      loadEditor();
    }

    return () => {
      if (editorInstance) {
        editorInstance.destroy().catch(console.error);
      }
    };
  }, [editorLoaded, editorInstance, value, onChange, placeholder, disabled]);

  // 更新编辑器内容
  useEffect(() => {
    if (editorInstance && value !== editorInstance.getData()) {
      editorInstance.setData(value || '');
    }
  }, [value, editorInstance]);

  // 更新禁用状态
  useEffect(() => {
    if (editorInstance) {
      if (disabled) {
        editorInstance.enableReadOnlyMode('disabled');
      } else {
        editorInstance.disableReadOnlyMode('disabled');
      }
    }
  }, [disabled, editorInstance]);

  return (
    <div className="w-full">
      <div 
        ref={editorRef}
        className="min-h-[300px] prose max-w-none"
      />
      {!editorLoaded && (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
          <div className="text-gray-500">编辑器加载中...</div>
        </div>
      )}
    </div>
  );
};

export default Editor;