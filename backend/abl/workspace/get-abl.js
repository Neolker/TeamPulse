const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const WorkspaceDao = require("../../dao/workspace-dao");
let dao = new WorkspaceDao(path.join(__dirname, "..", "..", "storage", "workspaces.json"));
const UserDao = require("../../dao/user-dao");
let daoUser = new UserDao(path.join(__dirname, "..", "..", "storage", "users.json"));

let schema = {
  type: "object",
  properties: {
  	session: { type: "string" },
    id: { type: "string" },
  },
  required: ["session", "id"],
};

async function GetAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;
    const valid = ajv.validate(schema, body);
    if (valid) {
    	//check logged user via session:
		  let loggedUser=await daoUser.userBySession(body.session);
		  if(loggedUser===false){throw new Error("You are not logged into a system. Please log-in before.");}
		  //get:
      const id = body.id;
      const ws = await dao.getWorkspace(id);      
      if (!ws) {
        res.status(400).send({ "error": "Workspace with id " + id + " does not exist." });
      }
      //check all rights of logged user
		  if(parseInt(loggedUser.superadmin)===1){
		  	// do nothing, all is ok
		  }else{
		  	if((ws.owner_id)===(loggedUser.id)){
		  		// do nothing, all is ok
		  	}else{
		  		let existInWorkspace=false;
		  		if(ws.members && Array.isArray(ws.members) ){
						for (let j = 0, lem = ws.members.length; j < lem; j++) {						
							if((ws.members[j]) === (loggedUser.id)){								
								existInWorkspace=true;
								break;
							}    		
						}
					}
					if(existInWorkspace===false){throw new Error("You must be super admin or workspace owner or workspace member to get workspace informations.");}	   			
				}	  
		  }      
      //create log:
      const currentY = new Date().getFullYear();
			const currentM = new Date().getMonth()+1;
			const currentTs = new Date().toUTCString();				
			await fs.appendFileSync( 
				path.join(__dirname, "..", "..", "log", "auditLog-"+currentY+"-"+currentM+".txt") , 
				"workspace/get at "+currentTs+"\n"+JSON.stringify(ws)+"\n"+"-------"+"\n"
				);	
			//return	
      res.json(ws);
    } else {
      res.status(400).send({ "error": "Validation of the input failed: id and session is required." });
    }
  } catch (e) {
    res.status(500).send({ "error": e.message });
  }
}

module.exports = GetAbl;
