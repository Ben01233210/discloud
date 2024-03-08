export let dummyData: Folder = {
  name: "Root",
  path: "/",
  parent: null,
  child: [
    {
      name: "Folder1",
      path: "/Folder1",
      parent: null, // This should be a reference to the parent folder
      child: [
        {
          name: "SubFolder1",
          path: "/Folder1/SubFolder1",
          parent: null, // This should be a reference to the parent folder
          child: null,
        },
        {
          name: "File1",
          path: "/Folder1/File1",
          parent: null, // This should be a reference to the parent folder
        },
      ],
    },
    {
      name: "File2",
      path: "/File2",
      parent: null, // This should be a reference to the parent folder
    },
  ],
};
