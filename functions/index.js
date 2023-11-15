const functions = require("firebase-functions")
// eslint-disable-next-line no-unused-vars
const admin = require("firebase-admin")
admin.initializeApp()

// eslint-disable-next-line max-len
exports.CreateCustomToken = functions.region("asia-northeast1").https.onCall(async (data, context) => {
  const uid = data.uid
  if (!uid) {
    return null
  }
  console.log(uid)
  const customToken = await admin.auth().createCustomToken(uid)
  return customToken
})

exports.createUser = functions.https.onCall(async (data) => {
  const email = data.email
  const password = data.password
  const name = data.name
  await admin.auth().createUser({
    email,
    emailVerified: true,
    password,
    displayName: name,
    disabled: false
  })
    .then(async (user) => {
      console.log("Successfully created new user:", user.uid)
      await admin.firestore()
        .collection("adminUser")
        .doc(user.uid)
        .set({
          color: "#696969",
          created: new Date(),
          id: user.uid,
          mail: email,
          name,
          uid: user.uid,
          disabled: false
        })
        .then(async () => {
          console.log("Successfully created admin:", user.uid)
          await admin.firestore()
            .collection("users")
            .doc(user.uid)
            .set({
              admin: true,
              age: "",
              color: "#696969",
              joinDate: new Date(),
              location: { lat: 0, lng: 0 },
              name,
              ownedStamps: [],
              provider: "password",
              region: "",
              stamprally: {},
              uid: user.uid
            })
            .then(() => {
              console.log("Successfully created all:", user.uid)
            })
            .catch((error) => {
              console.log("Error creating all:", error)
            })
        })
        .catch((error) => {
          console.log("Error creating admin:", error)
        })
    })
    .catch((error) => {
      console.log("Error creating new user:", error)
    })
})

exports.resetPassword = functions.https.onCall(async (data) => {
  const uid = data.uid
  const newPassword = data.password
  await admin.auth()
    .updateUser(uid, {
      password: newPassword
    })
    .then((user) => {
      console.log("success to update password", user.toJSON())
    })
    .catch((error) => {
      console.log("failed to update passeord", error)
    })
})

exports.deactivateUser = functions.https.onCall(async (uid) => {
  await admin.auth()
    .updateUser(uid, {
      disabled: true
    })
    .then(async (user) => {
      console.log("success to deactivate user from auth", user.toJSON())
      await admin.firestore()
        .collection("adminUser")
        .doc(uid)
        .update({
          disabled: true
        })
        .then(() => {
          console.log("success to deactivate user from firestore")
        })
        .catch((error) => {
          console.log("failed to deactivate user from firestore", error)
        })
    })
    .catch((error) => {
      console.log("failed to deactivate user from auth", error)
    })
})

exports.activateUser = functions.https.onCall(async (uid) => {
  await admin.auth()
    .updateUser(uid, {
      disabled: false
    })
    .then(async (user) => {
      console.log("success to activate user from auth", user.toJSON())
      await admin.firestore()
        .collection("adminUser")
        .doc(uid)
        .update({
          disabled: false
        })
        .then(() => {
          console.log("success to activate user from firestore")
        })
        .catch((error) => {
          console.log("failed to activate user from firestore", error)
        })
    })
    .catch((error) => {
      console.log("failed to activate user from auth", error)
    })
})

exports.deleteUser = functions.https.onCall(async (uid) => {
  await admin.auth().deleteUser(uid)
    .then(async () => {
      console.log("success to delete user from auth")
      await admin.firestore()
        .collection("adminUser")
        .doc(uid)
        .delete()
        .then(async () => {
          console.log("success to delete user from admin")
          await admin.firestore()
            .collection("users")
            .doc(uid)
            .delete()
            .then(() => {
              console.log("success to delete user from all")
            })
            .catch((error) => {
              console.log("failed to delete user from all", error)
            })
        })
        .catch((error) => {
          console.log("failed to delete user from admin", error)
        })
    })
    .catch((error) => {
      console.log("failed to delete user from auth", error)
    })
})
