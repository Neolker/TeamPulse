"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const md5 = require('md5');

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "users.json");

class UserDao {
  constructor(storagePath) {
    this.userStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async createUser(u) {
    let userslist = await this._loadAllUsers();
    let uPrototype = {
      "id": "U-" + crypto.randomBytes(4).toString("hex"),
      "firstname": "User",            
		  "lastname": "User",
		  "email": "",
		  "session": "",			
			"password": "",
			"active": "1", 
			"superadmin": "0"    
    };
    if(u.firstname.length<1){throw new Error("Firstname is required, user has not been created. Minimal lenght: 1 character in the firstname.");}
    if(u.lastname.length<1){throw new Error("Lastname is required, user has not been created. Minimal lenght: 1 character in the lastname.");}      
    if(u.email.length<5){throw new Error("E-mail is required, user has not been created. Minimal lenght: 5 character in the E-mail.");}   
    if(u.password.length<4){throw new Error("Password is required, user has not been created. Minimal lenght: 4 characters.");}      
    
   	uPrototype.firstname = u.firstname;
   	uPrototype.lastname = u.lastname;
    uPrototype.email = u.email;
    uPrototype.password = md5(u.password+" - "+uPrototype.id+" - TeamPulse"); // salted md5 hash
    uPrototype.active = parseInt(u.active);        
    uPrototype.superadmin = parseInt(u.superadmin);                
    userslist.push(uPrototype);
    await wf(this._getStorageLocation(), JSON.stringify(userslist, null, 2));
    return uPrototype;
  }
  
  async getUser(id) {
   	let userslist = await this._loadAllUsers();
    const result = userslist.find((b) => b.id === id);
    return result;
  }
  
  async viewUsers() {
    let userslist = await this._loadAllUsers();
    return userslist;
  }
  
  async updateUser(user) {
    let userslist = await this._loadAllUsers();
    const userIndex = userslist.findIndex((b) => b.id === user.id);
    if (userIndex < 0) {
      throw new Error("User with given id " + user.id + " does not exists.");
    } else {
      if(user.firstname.length<1){throw new Error("Firstname is required, user has not been created. Minimal lenght: 1 character in the firstname.");}
		  if(user.lastname.length<1){throw new Error("Lastname is required, user has not been created. Minimal lenght: 1 character in the lastname.");}      
		  if(user.email.length<5){throw new Error("E-mail is required, user has not been created. Minimal lenght: 5 character in the E-mail.");} 
		  let userPrototype = userslist[userIndex];
		  userPrototype.firstname=user.firstname;
		  userPrototype.lastname=user.lastname;
		  userPrototype.email=user.email;
		  userPrototype.active=parseInt(user.active);		  		                  
		  userPrototype.superadmin=parseInt(user.superadmin);		  		                  		  		                  
      userslist[userIndex] = {
        ...userslist[userIndex],
        ...userPrototype,
      };
    }
    await wf(this._getStorageLocation(), JSON.stringify(userslist, null, 2));
    return userslist[userIndex];
  }
  
  async updateUserPassword(user) {
    let userslist = await this._loadAllUsers();
    const userIndex = userslist.findIndex((b) => b.id === user.id);
    if (userIndex < 0) {
      throw new Error("User with given id " + user.id + " does not exists.");
    } else {
      if(user.password.length<4){throw new Error("Password is required, user has not been created. Minimal lenght: 4 characters.");}      
		  let userPrototype = userslist[userIndex];
		  userPrototype.password = md5(user.password+" - "+userPrototype.id+" - TeamPulse"); // salted md5 hash		  		   		                  		  		                  
      userslist[userIndex] = {
        ...userslist[userIndex],
        ...userPrototype,
      };
    }
    await wf(this._getStorageLocation(), JSON.stringify(userslist, null, 2));
    return userslist[userIndex];
  }
  
  async loginUser(data) {
  	let userslist = await this._loadAllUsers();
  	let session="S-" + crypto.randomBytes(8).toString("hex")+"-TS";
    const userIndex = userslist.findIndex((b) => b.email === data.email);
    if (userIndex < 0) {
      throw new Error("User with given email " + data.email + " does not exists.");
    } else {
    	let userPrototype = userslist[userIndex];	
    	let pass=md5(data.password+" - "+userPrototype.id+" - TeamPulse"); // salted md5 hash		  		   		
    	if(pass!==userPrototype.password){throw new Error("Password is incorect or user does not exists.");}    	
    	userPrototype.session=session;
    	userslist[userIndex] = {
        ...userslist[userIndex],
        ...userPrototype,
      };
    }
  	await wf(this._getStorageLocation(), JSON.stringify(userslist, null, 2));
    return userslist[userIndex];
  }
  
  async logoutUser(data) {
  	let userslist = await this._loadAllUsers();
    const userIndex = userslist.findIndex((b) => b.session === data.session);
  	if (userIndex < 0) {
      throw new Error("User with given session " + data.session + " is not logged in.");
    } else {
    	let userPrototype = userslist[userIndex];	
    	userPrototype.session="";
    	userslist[userIndex] = {
        ...userslist[userIndex],
        ...userPrototype,
      };
    }
    await wf(this._getStorageLocation(), JSON.stringify(userslist, null, 2));
    return {"logouted":true};
  }
  

  async _loadAllUsers() {
    let userslist;
    try {
      userslist = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (typeof e.code === 'undefined') {
        throw new Error("Unable to read from storage - wrong data format in " + this._getStorageLocation());
      } else if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one in " + this._getStorageLocation());
        userslist = [];
      } else {
        throw new Error("Unable to read from storage - wrong data format in " + this._getStorageLocation());
      }
    }
    return userslist;
  }
	
  _getStorageLocation() {
    return this.userStoragePath;
  }
}

module.exports = UserDao;;
