const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const crypto = require("crypto");
const WorkspaceDao = require("../../dao/workspace-dao");
let dao = new WorkspaceDao(path.join(__dirname, "..", "..", "storage", "workspaces.json"));
const UserDao = require("../../dao/user-dao");
let daoUser = new UserDao(path.join(__dirname, "..", "..", "storage", "users.json"));
const CompanyDao = require("../../dao/company-dao");
let daoCompany = new CompanyDao(path.join(__dirname, "..", "..", "storage", "companies.json"));

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
		  //check existing workspace
		  let usedCompany=await daoCompany.getCompany(workspace.awid);
		  if(usedCompany){}else{throw new Error("Entered company awid: "+workspace.awid+" does not exist.");}
		  //check existing owner_id
		  let usedUser=await daoUser.getUser(workspace.owner_id);
		  if(usedUser){}else{throw new Error("Entered owner id: "+workspace.owner_id+" does not exist.");}
		  //check all rights of logged user
		  if(parseInt(loggedUser.superadmin)===1){
		  	// do nothing, all is ok
		  }else{
		  	if((usedCompany.owner_id)===(loggedUser.id)){
		  		// do nothing, all is ok
		  	}else{
		  		let existInCompany=false;
		  		if(usedCompany.users && Array.isArray(usedCompany.users) ){
						for (let j = 0, lem = usedCompany.users.length; j < lem; j++) {						
							if((usedCompany.users[j].user_id) === (loggedUser.id)){								
								existInCompany=true;
								break;
							}    		
						}
					}
					if(existInCompany===false){throw new Error("You must be super admin or company owner or company member (user) to add workspace into this company.");}	   		  	
		  	}
		  }		  
		  //check all we need we have
		  if(workspace.name.length<1){throw new Error("Name is required, workspace has not been created. Minimal lenght: 1 character in the name.");}   
		  if(workspace.awid.length<3){throw new Error("Awid is required, workspace has not been created. Minimal lenght: 3 character in the awid.");}   
		  if(workspace.owner_id.length<6){throw new Error("Owner_id is required, workspace has not been created. Minimal lenght: 6 characters.");}     
		  if(workspace.name.length>128){throw new Error("Workspace has not been created. Maximal lenght: 128 character in the name.");}   
		  if(workspace.awid.length>64){throw new Error("Workspace has not been created. Maximal lenght: 64 character in the awid.");}   
		  if(workspace.owner_id.length>64){throw new Error("Workspace has not been created. Maximal lenght: 64 characters in the owner_id.");}     		  
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
