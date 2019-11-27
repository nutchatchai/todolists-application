import * as firebase from 'firebase';
import '@firebase/firestore';

const config = {
  apiKey: "AIzaSyDPveUbv_oBXPyLs4BOzekDnJBBKbDYvYc",
  authDomain: "my-project-ab23c.firebaseapp.com",
  databaseURL: "https://my-project-ab23c.firebaseio.com",
  projectId: "my-project-ab23c",
  storageBucket: "my-project-ab23c.appspot.com",
  messagingSenderId: "242044460918",
  appId: "1:242044460918:web:6b4bd07da3e8999c1e6457",
  measurementId: "G-13BE5EX2SE"
};

class Database{

  constructor() {
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
          console.log("firebase apps initializeApp");
    } else {
        console.log("firebase apps already running...");
    }
  }

  getAccount=async()=>{
    firebase.firestore().collection('Account').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
        });
      }).catch(err => {
        console.log('Error getting documents', err);
      });
  }


  async readOnce(id,read_Account_success,read_Account_fail)
  {
    let getDoc = firebase.firestore().collection("Account").doc(id).get().then(doc=>{
      if(doc.exists)
      {
        read_Account_success(doc.data());
      }else {
        read_Account_fail();
      }
    }).catch(read_Account_fail());
  }

  async readAll(read_Account_success,read_Account_fail)
  {
    let getDoc = firebase.firestore().collection("Account").get().then(
      snapshot => {
        if (snapshot.empty) {
          read_Account_fail();
          return;
        }

        snapshot.forEach(doc => {
          read_Account_success(doc.data());
        })

      }).catch(read_Account_fail());
  }

  async readListening(read_Account_success,read_Account_fail)
  {
    let getDoc = firebase.firestore().collection("Account").onSnapshot(
      snapshot => {
        if (snapshot.empty) {
          read_Account_fail();
          return;
        }

        snapshot.forEach(doc => {
          read_Account_success(doc.data());
        })

      }).catch(read_Account_fail());
  }

  async deleteAccount(id,delete_Account_success,delete_Account_fail)
  {
    try {
        firebase.firestore().collection('Account').doc(id).delete();
        delete_Account_success();
    } catch (e) {
        delete_Account_fail();
    }
  }

  async updateAccount(account,update_Account_success,update_Account_fail)
  {
    try {
        firebase.firestore().collection('Account').doc(id).update(account);
        update_Account_success();
    } catch (e) {
        update_Account_fail();
    }
  }



  async createAccount(Account,add_Account_success,add_Account_fail)
  {
    firebase.firestore().collection("Account").add(Account).then(ref=>{add_Account_success(ref.id)},add_Account_fail);
  }

  async createAccount2(Account,add_Account_success,add_Account_fail)
  {
    //set ชื่อ doc
    try {
      firebase.firestore().collection("Account").doc(Account.email).set(Account)
      add_Account_success();
    } catch (e) {
      add_Account_fail();
    } finally {

    }

  }


///////////
  async addMessage(message,add_Message_success,add_Message_fail)
  {
    firebase.firestore().collection("Message").add(message).then(ref=>{add_Message_success(ref.id)},add_Message_fail);
  }

  async readMessageListening(read_Message_success,read_Message_fail)
  {
    let getDoc = firebase.firestore().collection("Message").orderBy("time").onSnapshot(
      snapshot => {
        if (snapshot.empty) {
          read_Message_fail();
          return;
        }

        snapshot.forEach(doc => {
          read_Message_success(doc.data());
        })

      }).catch(read_Message_fail());
  }

  ///////////////////////////

  async createAut(account,createAut_success,createAut_fail)
  {
    firebase.auth().createUserWithEmailAndPassword(account.email,account.password)
    .then(()=>{
      createAut_success();

    })
    .catch(function(error){
      createAut_fail(error.message);
    });

  }

  login = async(account, success_callback, failed_callback) => {
    firebase.auth().signInWithEmailAndPassword(account.email,account.password)
    .then(()=>{
      success_callback();
    })
    .catch(function (error) {
      failed_callback(error.message);

    });
  }

  async uploadImage(id,uri, success_callback, fail_callback,uploading_callback)
  {
    const response =await fetch(uri);
    const blob =await response.blob();

    var uploadTask=firebase.storage().ref('avatar').child(id).put(blob);

        uploadTask.on('state_changed', function(snapshot){

      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      uploading_callback(progress)

    }, function(error) {
      fail_callback(error.message);
    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      success_callback(downloadURL);
        //console.log('File available at', downloadURL);
      });
    });
  }

}

////////////////

const database = new Database();
export default database;
