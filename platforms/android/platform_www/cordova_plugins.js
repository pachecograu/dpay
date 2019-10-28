cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-firebase-authentication.FirebaseAuthentication",
      "file": "plugins/cordova-plugin-firebase-authentication/www/FirebaseAuthentication.js",
      "pluginId": "cordova-plugin-firebase-authentication",
      "merges": [
        "cordova.plugins.firebase.auth"
      ]
    },
    {
      "id": "cordova-plugin-firebasex.FirebasePlugin",
      "file": "plugins/cordova-plugin-firebasex/www/firebase.js",
      "pluginId": "cordova-plugin-firebasex",
      "clobbers": [
        "FirebasePlugin"
      ]
    },
    {
      "id": "cordova-plugin-firestore.Firestore",
      "file": "plugins/cordova-plugin-firestore/www/android_ios/firestore.js",
      "pluginId": "cordova-plugin-firestore",
      "clobbers": [
        "Firestore"
      ]
    },
    {
      "id": "cordova-plugin-firestore.collection_reference",
      "file": "plugins/cordova-plugin-firestore/www/android_ios/collection_reference.js",
      "pluginId": "cordova-plugin-firestore"
    },
    {
      "id": "cordova-plugin-firestore.query",
      "file": "plugins/cordova-plugin-firestore/www/android_ios/query.js",
      "pluginId": "cordova-plugin-firestore"
    },
    {
      "id": "cordova-plugin-firestore.document_reference",
      "file": "plugins/cordova-plugin-firestore/www/android_ios/document_reference.js",
      "pluginId": "cordova-plugin-firestore"
    },
    {
      "id": "cordova-plugin-firestore.document_snapshot",
      "file": "plugins/cordova-plugin-firestore/www/android_ios/document_snapshot.js",
      "pluginId": "cordova-plugin-firestore"
    },
    {
      "id": "cordova-plugin-firestore.query_snapshot",
      "file": "plugins/cordova-plugin-firestore/www/android_ios/query_snapshot.js",
      "pluginId": "cordova-plugin-firestore"
    },
    {
      "id": "cordova-plugin-firestore.query_document_snapshot",
      "file": "plugins/cordova-plugin-firestore/www/android_ios/query_document_snapshot.js",
      "pluginId": "cordova-plugin-firestore"
    },
    {
      "id": "cordova-plugin-firestore.firestore_timestamp",
      "file": "plugins/cordova-plugin-firestore/www/android_ios/firestore_timestamp.js",
      "pluginId": "cordova-plugin-firestore"
    },
    {
      "id": "cordova-plugin-firestore.transaction",
      "file": "plugins/cordova-plugin-firestore/www/android_ios/transaction.js",
      "pluginId": "cordova-plugin-firestore"
    },
    {
      "id": "cordova-plugin-firestore.utilities",
      "file": "plugins/cordova-plugin-firestore/www/android_ios/utilities.js",
      "pluginId": "cordova-plugin-firestore"
    },
    {
      "id": "cordova-plugin-firestore.geo_point",
      "file": "plugins/cordova-plugin-firestore/www/android_ios/geo_point.js",
      "pluginId": "cordova-plugin-firestore"
    },
    {
      "id": "cordova-plugin-firestore.path",
      "file": "plugins/cordova-plugin-firestore/www/android_ios/path.js",
      "pluginId": "cordova-plugin-firestore"
    },
    {
      "id": "cordova-plugin-firestore.utils",
      "file": "plugins/cordova-plugin-firestore/www/android_ios/utils.js",
      "pluginId": "cordova-plugin-firestore"
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-androidx": "1.0.2",
    "cordova-plugin-androidx-adapter": "1.1.0",
    "cordova-support-android-plugin": "1.0.1",
    "cordova-support-google-services": "1.3.1",
    "cordova-plugin-firebase-authentication": "3.0.0",
    "cordova-plugin-firebasex": "6.1.0",
    "cordova-plugin-firestore": "3.0.0"
  };
});