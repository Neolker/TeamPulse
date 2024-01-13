"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "tasks.json");

class TaskDao {
  constructor(storagePath) {
    this.taskStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }
  
  async _createLog(cmd,event){
		const currentY = new Date().getFullYear();
		const currentM = new Date().getMonth()+1;
		const currentTs = new Date().toUTCString();				
		await fs.appendFileSync( 
			path.join(__dirname, "..", "log", "auditLog-"+currentY+"-"+currentM+".txt") , 
			cmd+" at "+currentTs+"\n"+event+"\n"+"-------"+"\n");		
	}	

  async createTask(task) {
    let taskslist = await this._loadAllTasks();
    let taskPrototype = {
      "id": "T-" + crypto.randomBytes(4).toString("hex"),
      "workspace_id": "W-0000",
		  "name": "Task",
		  "description": "Lorem ipsum",
		  "solver_id": "U-0000",
			"status": "0",
			"deadline": "1.1.1970"     
    };
    if(task.name.length<1){throw new Error("Name is required, task has not been created. Minimal lenght: 1 character in the name.");}
    if(task.workspace_id.length<6){throw new Error("Workspace_id is required, task has not been created. Minimal lenght: 6 characters.");}
    if(task.description.length<1){throw new Error("Description is required, task has not been created. Minimal lenght: 1 character in the description.");}
    if(task.solver_id.length<6){throw new Error("Solver_id is required, task has not been created. Minimal lenght: 6 characters.");}
    if(task.deadline.length<8){throw new Error("Date of deadline is required, task has not been created. Minimal lenght: 8 character in the description.");}    
    taskPrototype.workspace_id = task.workspace_id;
    taskPrototype.name = task.name;
    taskPrototype.description = task.description;
    taskPrototype.solver_id = task.solver_id;
    taskPrototype.status = task.status;
    taskPrototype.deadline = task.deadline;    
    taskslist.push(taskPrototype);
    await wf(this._getStorageLocation(), JSON.stringify(taskslist, null, 2));
    this._createLog("task/create",JSON.stringify(taskPrototype) );
    return taskPrototype;
  }
  
  async getTask(id) {
   	let taskslist = await this._loadAllTasks();
    const result = taskslist.find((b) => b.id === id);
    this._createLog("task/get",JSON.stringify(result) );
    return result;
  }

  async viewTasks() {
    let taskslist = await this._loadAllTasks();
    this._createLog("task/view",JSON.stringify(taskslist) );
    return taskslist;
  }
  
  async updateTask(task) {
    let taskslist = await this._loadAllTasks();
    const taskIndex = taskslist.findIndex((b) => b.id === task.id);
    if (taskIndex < 0) {
      throw new Error("Task with given id " + task.id + " does not exists.");
    } else {
      if(task.name.length<1){throw new Error("Name is required, task has not been saved. Minimal lenght: 1 character in the name.");}
		  if(task.workspace_id.length<6){throw new Error("Workspace_id is required, task has not been saved. Minimal lenght: 6 characters.");}
		  if(task.description.length<1){throw new Error("Description is required, task has not been saved. Minimal lenght: 1 character in the description.");}
		  if(task.solver_id.length<6){throw new Error("Solver_id is required, task has not been saved. Minimal lenght: 6 characters.");}
		  if(task.deadline.length<8){throw new Error("Date of deadline is required, task has not been saved. Minimal lenght: 8 character in the description.");}  
		  let taskPrototype = {
		    "id": task.id,
		    "workspace_id": task.workspace_id,
				"name": task.name,
				"description": task.description,
				"solver_id": task.solver_id,
				"status": task.status,
				"deadline": task.deadline     
		  };
		  		                  
      taskslist[taskIndex] = {
        ...taskslist[taskIndex],
        ...taskPrototype,
      };
    }
    await wf(this._getStorageLocation(), JSON.stringify(taskslist, null, 2));
    this._createLog("task/update",JSON.stringify(taskslist[taskIndex]) );
    return taskslist[taskIndex];
  }

	async deleteTask(id) {
    let taskslist = await this._loadAllTasks();
    const taskIndex = taskslist.findIndex((b) => b.id === id);
    if (taskIndex >= 0) {    
      taskslist.splice(taskIndex, 1);
      await wf(this._getStorageLocation(), JSON.stringify(taskslist, null, 2));   
      this._createLog("task/delete",JSON.stringify(id) );  
    } else {
      throw new Error("Task id " + id + " is not found.");
    }
    return {"deleted":true};
  }

  async _loadAllTasks() {
    let taskslist;
    try {
      taskslist = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (typeof e.code === 'undefined') {
        throw new Error("Unable to read from storage - wrong data format in " + this._getStorageLocation());
      } else if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one in " + this._getStorageLocation());
        taskslist = [];
      } else {
        throw new Error("Unable to read from storage - wrong data format in " + this._getStorageLocation());
      }
    }
    return taskslist;
  }
	
  _getStorageLocation() {
    return this.taskStoragePath;
  }
}

module.exports = TaskDao;
