const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const TaskDao = require("../../dao/task-dao");
let dao = new TaskDao(path.join(__dirname, "..", "..", "storage", "tasks.json"));
const UserDao = require("../../dao/user-dao");
let daoUser = new UserDao(path.join(__dirname, "..", "..", "storage", "users.json"));

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
		  const tasks = await dao.viewTasks();
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
