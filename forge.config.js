module.exports = {
//export default  {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'Dimitar Nikolov Stakov',
          categories: ['Utility'],
          description: "Monthly cost editor",
          genericName: "Monthly cost editor",
          icon: './builder/icons/1024x1024.png',
          productDescription : "Monthly cost editor",
          productName: "Monthly cost editor"
        }
      },
    },
  ],
};
