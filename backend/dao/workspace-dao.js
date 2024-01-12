"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "workspaces.json");

class WorkspaceDao {
  constructor(storagePath) {
    this.workspaceStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async createWorkspace(ws) {
    let workspaceslist = await this._loadAllWorkspaces();
    let wsPrototype = {
      "id": "W-" + crypto.randomBytes(4).toString("hex"),
      "awid": "C-0000",            
		  "name": "WorkSpace",
		  "description": "",
		  "owner_id": "U-0000",			
			"members": []     
    };
    if(ws.name.length<1){throw new Error("Name is required, workspace has not been created. Minimal lenght: 1 character in the name.");}   
    if(ws.awid.length<6){throw new Error("Awid is required, workspace has not been created. Minimal lenght: 6 character in the awid.");}   
    if(ws.owner_id.length<6){throw new Error("Owner_id is required, workspace has not been created. Minimal lenght: 6 characters.");}      
   	wsPrototype.awid = ws.awid;
   	wsPrototype.name = ws.name;
    wsPrototype.description = ws.description;
    wsPrototype.owner_id = ws.owner_id;        
    workspaceslist.push(wsPrototype);
    await wf(this._getStorageLocation(), JSON.stringify(workspaceslist, null, 2));
    return wsPrototype;
  }
  
  async getWorkspace(id) {
   	let workspaceslist = await this._loadAllWorkspaces();
    const result = workspaceslist.find((b) => b.id === id);
    return result;
  }
  
  async updateWorkspace(ws) {
    let workspaceslist = await this._loadAllWorkspaces();
    const wsIndex = workspaceslist.findIndex((b) => b.id === ws.id);
    if (wsIndex < 0) {
      throw new Error("Workspace with given id " + ws.id + " does not exists.");
    } else {
      if(ws.name.length<1){throw new Error("Name is required, workspace has not been saved. Minimal lenght: 1 character in the name.");}		  		  
		  if(ws.owner_id.length<6){throw new Error("Owner_id is required, workspace has not been saved. Minimal lenght: 6 characters.");}
		  let wsPrototype = workspaceslist[wsIndex];
		  wsPrototype.name=ws.name;
		  wsPrototype.description=ws.description;
		  wsPrototype.owner_id=ws.owner_id;		  		                  
      workspaceslist[wsIndex] = {
        ...workspaceslist[wsIndex],
        ...wsPrototype,
      };
    }
    await wf(this._getStorageLocation(), JSON.stringify(workspaceslist, null, 2));
    return workspaceslist[wsIndex];
  }
  
  async deleteWorkspace(id) {
    let workspaceslist = await this._loadAllWorkspaces();
    const index = workspaceslist.findIndex((b) => b.id === id);
    if (index >= 0) {    
      workspaceslist.splice(index, 1);
      await wf(this._getStorageLocation(), JSON.stringify(workspaceslist, null, 2));     
    } else {
      throw new Error("Workspace id " + id + " is not found.");
    }
    return {"deleted":true};
  }
  
  async viewWorkspaces() {
    let workspaceslist = await this._loadAllWorkspaces();
    return workspaceslist;
  }
  
  async addWorkspaceMember(data){
	  let workspaceslist = await this._loadAllWorkspaces();
  	const wsIndex = workspaceslist.findIndex((b) => b.id === data.id);
    if (wsIndex < 0) {
      throw new Error("Workspace with given id " + data.id + " does not exists.");
    } else {
    	if(data.user_id.length<1){throw new Error("User_id is required, user has not been added.");}		 
    	let workspacePrototype = workspaceslist[wsIndex];    	    	
     	workspacePrototype.members.push(data.user_id);
     	workspaceslist[wsIndex] = {
        ...workspaceslist[wsIndex],
        ...workspacePrototype,
      };    	
    }
    await wf(this._getStorageLocation(), JSON.stringify(workspaceslist, null, 2));
    return workspaceslist[wsIndex];
  }
  
  async deleteWorkspaceMember(data){
	  let workspaceslist = await this._loadAllWorkspaces();
  	let found=false;
  	const wsIndex = workspaceslist.findIndex((b) => b.id === data.id);
    if (wsIndex < 0) {
      throw new Error("Workspace with given id " + data.id + " does not exists.");
    } else {
    	if(data.user_id.length<1){throw new Error("User_id is required, user has not been deleted.");}		     	
    	let wsPrototype = workspaceslist[wsIndex];
    	if(wsPrototype.members && Array.isArray(wsPrototype.members) ){
    		for (let j = 0, lem = wsPrototype.members.length; j < lem; j++) {
    			if(wsPrototype.members[j] === data.user_id){
    				wsPrototype.members.splice(j,1);
    				found=true;
    				break;
    			}    		
    		}
    	}    	 
    	if(found===false){throw new Error("User_id "+data.user_id+" not found, user has not been deleted because user does not exist.");}		    	     	     	
     	workspaceslist[wsIndex] = {
        ...workspaceslist[wsIndex],
        ...wsPrototype,
      };    	
    }
    await wf(this._getStorageLocation(), JSON.stringify(workspaceslist, null, 2));
    return workspaceslist[wsIndex];
  }
  
  
  async _loadAllWorkspaces() {
    let workspaceslist;
    try {
      workspaceslist = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (typeof e.code === 'undefined') {
        throw new Error("Unable to read from storage - wrong data format in " + this._getStorageLocation());
      } else if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one in " + this._getStorageLocation());
        workspaceslist = [];
      } else {
        throw new Error("Unable to read from storage - wrong data format in " + this._getStorageLocation());
      }
    }
    return workspaceslist;
  }
	
  _getStorageLocation() {
    return this.workspaceStoragePath;
  }
}

module.exports = WorkspaceDao;
