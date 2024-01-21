const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const crypto = require("crypto");
const TaskDao = require("../../dao/task-dao");
let dao = new TaskDao(path.join(__dirname, "..", "..", "storage", "tasks.json"));
const UserDao = require("../../dao/user-dao");
let daoUser = new UserDao(path.join(__dirname, "..", "..", "storage", "users.json"));
const WorkspaceDao = require("../../dao/workspace-dao");
let daoWorkspace = new WorkspaceDao(path.join(__dirname, "..", "..", "storage", "workspaces.json"));

let schema = {
  type: "object",
  properties: {
  	session: { type: "string" },
    workspace_id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    solver_id: { type: "string" },
    status: { type: "string" },
    deadline: { type: "string" },  
  },
  required: ["session", "workspace_id", "name", "description", "solver_id", "deadline"]
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let task = req.body;
      //prepare prototype:
      let taskPrototype = {
		    "id": "T-" + crypto.randomBytes(4).toString("hex"),
		    "workspace_id": "W-0000",
				"name": "Task",
				"description": "Lorem ipsum",
				"solver_id": "U-0000",
				"status": "0",
				"deadline": "1.1.1970"     
		  };
		  //check logged user via session:
		  let loggedUser=await daoUser.userBySession(task.session);
		  if(loggedUser===false){throw new Error("You are not logged into a system. Please log-in before.");}
		  //check existing workspace
		  let usedWorkspace=await daoWorkspace.getWorkspace(task.workspace_id);
		  if(usedWorkspace){}else{throw new Error("Entered workspace id: "+task.workspace_id+" does not exist.");}
		  //check existing solver_id
		  let usedUser=await daoUser.getUser(task.solver_id);
		  if(usedUser){}else{throw new Error("Entered solver id: "+task.solver_id+" does not exist.");}
		  //check all rights of logged user
		  if(parseInt(loggedUser.superadmin)===1){
		  	// do nothing, all is ok
		  }else{
		  	if((usedWorkspace.owner_id)===(loggedUser.id)){
		  		// do nothing, all is ok
		  	}else{
		  		let existInMember=false;
		  		if(usedWorkspace.members && Array.isArray(usedWorkspace.members) ){
						for (let j = 0, lem = usedWorkspace.members.length; j < lem; j++) {						
							if((usedWorkspace.members[j]) === (loggedUser.id)){								
								existInMember=true;
								break;
							}    		
						}
					}
					if(existInMember===false){throw new Error("You must be super admin or workspace owner or workspace member to add task into this workspace.");}	   		  	
		  	}
		  }		  
		  //check all we need we have:
		  if(task.name.length<1){throw new Error("Name is required, task has not been created. Minimal lenght: 1 character in the name.");}
		  if(task.workspace_id.length<6){throw new Error("Workspace_id is required, task has not been created. Minimal lenght: 6 characters.");}
		  if(task.description.length<1){throw new Error("Description is required, task has not been created. Minimal lenght: 1 character in the description.");}
		  if(task.solver_id.length<6){throw new Error("Solver_id is required, task has not been created. Minimal lenght: 6 characters.");}
		  if(task.deadline.length<8){throw new Error("Date of deadline is required, task has not been created. Minimal lenght: 8 character in the deadline.");}    		  
		  if(task.name.length>128){throw new Error("Task has not been created. Maximal lenght: 128 character in the name.");}
		  if(task.workspace_id.length>64){throw new Error("Task has not been created. Maximal lenght: 64 characters in the workspace_id.");}
		  if(task.description.length>65536){throw new Error("Task has not been created. Maximal lenght: 65536 character in the description.");}
		  if(task.solver_id.length>64){throw new Error("Task has not been created. Maximal lenght: 64 characters in the solver_id.");}
		  if(task.deadline.length>64){throw new Error("Task has not been created. Maximal lenght: 64 character in the deadline.");}    		  
		  //fill-in prototype:
		  taskPrototype.workspace_id = task.workspace_id;
		  taskPrototype.name = task.name;
		  taskPrototype.description = task.description;
		  taskPrototype.solver_id = task.solver_id;
		  taskPrototype.status = task.status;
		  taskPrototype.deadline = task.deadline;    		          
      //create task in database:
      let taskCreated = await dao.createTask(taskPrototype);
      //create log:
      const currentY = new Date().getFullYear();
			const currentM = new Date().getMonth()+1;
			const currentTs = new Date().toUTCString();				
			await fs.appendFileSync( 
				path.join(__dirname, "..", "..", "log", "auditLog-"+currentY+"-"+currentM+".txt") , 
				"task/create at "+currentTs+"\n"+JSON.stringify(taskCreated)+"\n"+"-------"+"\n"
				);	
      //return:
      res.json(taskCreated);
    } else {
      res.status(400).send({ "error": "Validation of the input failed." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}



module.exports = CreateAbl;
