const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const crypto = require("crypto");
const TaskDao = require("../../dao/task-dao");
let dao = new TaskDao(path.join(__dirname, "..", "..", "storage", "tasks.json"));
const UserDao = require("../../dao/user-dao");
let daoUser = new UserDao(path.join(__dirname, "..", "..", "storage", "users.json"));

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
		  //check all we need we have:
		  if(task.name.length<1){throw new Error("Name is required, task has not been created. Minimal lenght: 1 character in the name.");}
		  if(task.workspace_id.length<6){throw new Error("Workspace_id is required, task has not been created. Minimal lenght: 6 characters.");}
		  if(task.description.length<1){throw new Error("Description is required, task has not been created. Minimal lenght: 1 character in the description.");}
		  if(task.solver_id.length<6){throw new Error("Solver_id is required, task has not been created. Minimal lenght: 6 characters.");}
		  if(task.deadline.length<8){throw new Error("Date of deadline is required, task has not been created. Minimal lenght: 8 character in the description.");}    
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
