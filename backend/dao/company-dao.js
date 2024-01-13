"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "companies.json");

class CompanyDao {
  constructor(storagePath) {
    this.companyStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

	async _createLog(cmd,event){
		const currentY = new Date().getFullYear();
		const currentM = new Date().getMonth()+1;
		const currentTs = new Date().toUTCString();				
		await fs.appendFileSync( 
			path.join(__dirname, "..", "log", "auditLog-"+currentY+"-"+currentM+".json") , 
			cmd+" at "+currentTs+"\n"+event+"\n"+"-------"+"\n");		
	}	

  async createCompany(company) {
    let companiesList = await this._loadAllCompanies();
    let companyPrototype = {
      "awid": "C-" + crypto.randomBytes(4).toString("hex"),      
		  "name": "Company",
		  "description": "",
		  "owner_id": "U-0000",			
			"users": []     
    };
    if(company.name.length<1){throw new Error("Name is required, company has not been created. Minimal lenght: 1 character in the name.");}   
    if(company.owner_id.length<6){throw new Error("Owner_id is required, company has not been created. Minimal lenght: 6 characters.");}      
   	companyPrototype.name = company.name;
    companyPrototype.description = company.description;
    companyPrototype.owner_id = company.owner_id;        
    companiesList.push(companyPrototype);
    await wf(this._getStorageLocation(), JSON.stringify(companiesList, null, 2));
    this._createLog("company/create",JSON.stringify(companyPrototype) );
    return companyPrototype;
  }
  
  async getCompany(id) {
   	let companieslist = await this._loadAllCompanies();
    const result = companieslist.find((b) => b.awid === id);
    this._createLog("company/get",JSON.stringify(result) );
    return result;
  }

	async updateCompany(company) {
    let companiesList = await this._loadAllCompanies();
    const companyIndex = companiesList.findIndex((b) => b.awid === company.awid);
    if (companyIndex < 0) {
      throw new Error("Company with given awid " + company.awid + " does not exists.");
    } else {
      if(company.name.length<1){throw new Error("Name is required, company has not been saved. Minimal lenght: 1 character in the name.");}		  		  
		  if(company.owner_id.length<6){throw new Error("Owner_id is required, company has not been saved. Minimal lenght: 6 characters.");}
		  let companyPrototype = {
		    "awid": company.awid,		   
				"name": company.name,
				"description": company.description,
				"owner_id": company.owner_id,
				"users": companiesList[companyIndex].users
		  };		  		                  
      companiesList[companyIndex] = {
        ...companiesList[companyIndex],
        ...companyPrototype,
      };
    }
    await wf(this._getStorageLocation(), JSON.stringify(companiesList, null, 2));
    this._createLog("company/update",JSON.stringify(companiesList[companyIndex]) );
    return companiesList[companyIndex];
  }
  
  async viewCompanies() {
    let companiesList = await this._loadAllCompanies();
    this._createLog("company/view",JSON.stringify(companiesList) );
    return companiesList;
  }
  
  async addCompanyUser(data){
	  let companiesList = await this._loadAllCompanies();
  	const companyIndex = companiesList.findIndex((b) => b.awid === data.awid);
    if (companyIndex < 0) {
      throw new Error("Company with given awid " + data.awid + " does not exists.");
    } else {
    	if(data.user_id.length<1){throw new Error("User_id is required, user has not been added.");}		 
    	let companyPrototype = companiesList[companyIndex];
    	let userPrototype = {
    	  "user_id": data.user_id,
    	  "roles": []
    	}
    	if(data.roles && Array.isArray(data.roles) ){
        for (let j = 0, lem = data.roles.length; j < lem; j++) {
          if(data.roles[j] !== null){
          	userPrototype.roles.push(data.roles[j]);
          }
        }
      }
     	companyPrototype.users.push(userPrototype);
     	companiesList[companyIndex] = {
        ...companiesList[companyIndex],
        ...companyPrototype,
      };    	
    }
    await wf(this._getStorageLocation(), JSON.stringify(companiesList, null, 2));
    this._createLog("company/add-user",JSON.stringify(companiesList[companyIndex]) );
    return companiesList[companyIndex];
  }

	async deleteCompanyUser(data){
	  let companiesList = await this._loadAllCompanies();
  	let found=false;
  	const companyIndex = companiesList.findIndex((b) => b.awid === data.awid);
    if (companyIndex < 0) {
      throw new Error("Company with given awid " + data.awid + " does not exists.");
    } else {
    	if(data.user_id.length<1){throw new Error("User_id is required, user has not been deleted.");}		     	
    	let companyPrototype = companiesList[companyIndex];
    	if(companyPrototype.users && Array.isArray(companyPrototype.users) ){
    		for (let j = 0, lem = companyPrototype.users.length; j < lem; j++) {
    			if(companyPrototype.users[j].user_id === data.user_id){
    				companyPrototype.users.splice(j,1);
    				found=true;
    				break;
    			}    		
    		}
    	}    	 
    	if(found===false){throw new Error("User_id "+data.user_id+" not found, user has not been deleted because user does not exist.");}		    	     	     	
     	companiesList[companyIndex] = {
        ...companiesList[companyIndex],
        ...companyPrototype,
      };    	
    }
    await wf(this._getStorageLocation(), JSON.stringify(companiesList, null, 2));
    this._createLog("company/delete-user",JSON.stringify(companiesList[companyIndex]) );
    return companiesList[companyIndex];
  }

  async _loadAllCompanies() {
    let companieslist;
    try {
      companieslist = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (typeof e.code === 'undefined') {
        throw new Error("Unable to read from storage - wrong data format in " + this._getStorageLocation());
      } else if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one in " + this._getStorageLocation());
        companieslist = [];
      } else {
        throw new Error("Unable to read from storage - wrong data format in " + this._getStorageLocation());
      }
    }
    return companieslist;
  }
	
  _getStorageLocation() {
    return this.companyStoragePath;
  }
}

module.exports = CompanyDao;
