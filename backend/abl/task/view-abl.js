const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const TaskDao = require("../../dao/task-dao");
let dao = new TaskDao(path.join(__dirname, "..", "..", "storage", "tasks.json"));
const UserDao = require("../../dao/user-dao");
let daoUser = new UserDao(path.join(__dirname, "..", "..", "storage", "users.json"));
const WorkspaceDao = require("../../dao/workspace-dao");
let daoWorkspace = new WorkspaceDao(path.join(__dirname, "..", "..", "storage", "workspaces.json"));

let schema = {
  type: "object",
  properties: {  
  	session: { type: "string" }    
  },
  required: ["session"]
};

async function ViewAbl(req, res) {
  try {
  	const ajv = new Ajv();
    const body = req.query.session ? req.query : req.body;
    const valid = ajv.validate(schema, body);
    if (valid) {
    	//check logged user via session:
		  let loggedUser=await daoUser.userBySession(body.session);
		  if(loggedUser===false){throw new Error("You are not logged into a system. Please log-in before.");}
		  //get tasks:
		  let tasks = await dao.viewTasks();
		  let tasksPermissioned=Array(); //helper							
		  if(parseInt(loggedUser.superadmin)===1){
		  	// do nothing, all is ok, return full list of all tasks
		  }else{
		  	// we must return only tasks, which can logged user rich
		  	// rich all workspaces of logged user permission:
		  	let accessibleWorkspaces=Array(); 
		  	const allWorkspaces=await daoWorkspace.viewWorkspaces();		  	
		  	if(allWorkspaces && Array.isArray(allWorkspaces) ){		  		
					for (let j = 0, lem = allWorkspaces.length; j < lem; j++) {						
						if((allWorkspaces[j].owner_id) === (loggedUser.id)){								
							accessibleWorkspaces.push(allWorkspaces[j].id);
						}else{  
							if(allWorkspaces[j].members && Array.isArray(allWorkspaces[j].members) ){
								for (let k = 0, lem = allWorkspaces[j].members.length; k < lem; k++) {						
									if((allWorkspaces[j].members[k]) === (loggedUser.id)){								
										accessibleWorkspaces.push(allWorkspaces[j].id);
										break;
									}    		
								}
							}
						}															  		
					}
				}
				//test every task of list at permission logged user and skip tasks with no permision:
				if(tasks && Array.isArray(tasks) ){		 
					
					for (let l = 0, lem = tasks.length; l < lem; l++) {								
						if( tasks[l].solver_id && tasks[l].solver_id === loggedUser.id ){														
							tasksPermissioned.push(tasks[l]);
							continue;
							}							
						if( tasks[l].workspace_id && accessibleWorkspaces.includes(tasks[l].workspace_id) ){							
							tasksPermissioned.push(tasks[l]);
							continue;
							}								
					}
				}		
				tasks=tasksPermissioned;				
		  }
		  //create log:
      const currentY = new Date().getFullYear();
			const currentM = new Date().getMonth()+1;
			const currentTs = new Date().toUTCString();				
			await fs.appendFileSync( 
				path.join(__dirname, "..", "..", "log", "auditLog-"+currentY+"-"+currentM+".txt") , 
				"task/view at "+currentTs+"\n"+JSON.stringify(tasks)+"\n"+"-------"+"\n"
				);	
			//return	
		  res.json(tasks);
		} else {
      res.status(400).send({ "error": "Validation of the input failed: session required." });
    }  
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = ViewAbl;
