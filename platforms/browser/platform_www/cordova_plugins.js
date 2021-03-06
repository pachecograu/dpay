cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-firebase-authentication/www/FirebaseAuthentication.js",
        "id": "cordova-plugin-firebase-authentication.FirebaseAuthentication",
        "pluginId": "cordova-plugin-firebase-authentication",
        "merges": [
            "cordova.plugins.firebase.auth"
        ]
    },
    {
        "file": "plugins/cordova-plugin-firestore/www/browser/firestore.js",
        "id": "cordova-plugin-firestore.Firestore",
        "pluginId": "cordova-plugin-firestore",
        "clobbers": [
            "Firestore"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-androidx": "1.0.2",
    "cordova-plugin-androidx-adapter": "1.1.0",
    "cordova-plugin-firebase-authentication": "3.0.0",
    "cordova-plugin-firebasex": "6.1.0",
    "cordova-plugin-firestore": "3.0.0",
    "cordova-support-android-plugin": "1.0.1",
    "cordova-support-google-services": "1.3.1"
}
// BOTTOM OF METADATA
});