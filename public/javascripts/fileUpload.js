//   registering all the plugins been used
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

// const pond = FilePond.create();
FilePond.setOptions({
stylePanelAspectRatio:150/100,
imageResizeTargetWidth:100,
imageResizeTargetHeight:150,

});

//   Turn all file input elements into file ponds input
FilePond.parse(document.body);
