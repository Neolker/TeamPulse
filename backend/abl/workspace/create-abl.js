const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const crypto = require("crypto");
const WorkspaceDao = require("../../dao/workspace-dao");
let dao = new WorkspaceDao(path.join(__dirname, "..", "..", "storage", "workspaces.json"));
const UserDao = require("../../dao/user-dao");
let daoUser = new UserDao(path.join(__dirname, "..", "..", "storage", "users.json"));

let schema = {
  type: "object",
  properties: {
  	session: { type: "string" },
    awid: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    owner_id: { type: "string" }    
  },
  required: ["session", "awid", "name", "owner_id"]
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let workspace = req.body;
      //prepare prototype
			let wsPrototype = {
		    "id": "W-" + crypto.randomBytes(4).toString("hex"),
		    "awid": "C-0000",            
				"name": "WorkSpace",
				"description": "",
				"owner_id": "U-0000",			
				"members": []     
		  };
		  //check logged user via session:
		  let loggedUser=await daoUser.userBySession(workspace.session);
		  if(loggedUser===false){throw new Error("You are not logged into a system. Please log-in before.");}
		  //check all we need we have
		  if(workspace.name.length<1){throw new Error("Name is required, workspace has not been created. Minimal lenght: 1 character in the name.");}   
		  if(workspace.awid.length<6){throw new Error("Awid is required, workspace has not been created. Minimal lenght: 6 character in the awid.");}   
		  if(workspace.owner_id.length<6){throw new Error("Owner_id is required, workspace has not been created. Minimal lenght: 6 characters.");}     
		  //fill-in prototype 
		 	wsPrototype.awid = workspace.awid;
		 	wsPrototype.name = workspace.name;
		  wsPrototype.description = workspace.description;
		  wsPrototype.owner_id = workspace.owner_id;         
		  //create workspace in database:  
      let workspaceCreated = await dao.createWorkspace(wsPrototype);
      //create log:
      const currentY = new Date().getFullYear();
			const currentM = new Date().getMonth()+1;
			const currentTs = new Date().toUTCString();				
			await fs.appendFileSync( 
				path.join(__dirname, "..", "..", "log", "auditLog-"+currentY+"-"+currentM+".txt") , 
				"workspace/create at "+currentTs+"\n"+JSON.stringify(workspaceCreated)+"\n"+"-------"+"\n"
				);	
      //return:
      res.json(workspaceCreated);
    } else {
      res.status(400).send({ "error": "Validation of the input failed." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = CreateAbl;
