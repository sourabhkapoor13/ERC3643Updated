let account;
// Function for connecting to Metamask
const connectMetamask = async () => {
if (window.ethereum !== "undefined") {
const accounts = await ethereum.request({ method: "eth_requestAccounts" });
account = accounts[0];
console.log(account);

document.getElementById("userArea").innerHTML = `User Account: ${account}`;
}
}
let factoryIdentity =  Web3.utils.toChecksumAddress("0x47860908b22977af232760f6785762a6632f783F");

let factorytoken =  Web3.utils.toChecksumAddress("0x9fD3e25334950df3A275c3E177e39029e4F4c718");


// Function for connecting to the smart contract
const connectContract = async () => {
var Abi;
await fetch('./abi/abiFactory.json')
.then(response => response.json())
.then(data => {
    // Handle the retrieved JSON data
    Abi = data;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

const contractABI = Abi;
const contractAddress = factoryIdentity;
window.web3 = await new Web3(window.ethereum);
window.contract = await new window.web3.eth.Contract(contractABI, contractAddress);
document.getElementById("contractArea").innerHTML = "Connected to Contract";
}

// Function for creating an event
const createIdentity = async () => {
var add = document.getElementById("userAddressForIdentity").value;
await window.contract.methods.createidentity(add).send({ from: account, gas: "10000000" });
const data = await window.contract.methods.getidentity(add).call();
console.log(data);
document.getElementById("identityAddress").innerHTML = "identity Created with address = " + data;
}

const createClaimIssuer = async () => {
var add = document.getElementById("userAddressForClaimIssuer").value;
await window.contract.methods.createClaimIssuer(add).send({ from: account, gas: "10000000" });
const data = await window.contract.methods.getClaimIssuer(add).call();
console.log(data);
document.getElementById("ClaimIssuerAddress").innerHTML = "claim issuer Created with address = " + data;
}
const getIdentity = async () => {
var identity = document.getElementById("AddressForIdentity").value;
const data = await window.contract.methods.getidentity(identity).call();
console.log(data);
document.getElementById("gotidentityAddress").innerHTML = "identity  = " + data;
}

const getClaimIssuer = async () => {
var issuer = document.getElementById("AddressForClaimIssuer").value;
const data = await window.contract.methods.getClaimIssuer(issuer).call();
console.log(data);
document.getElementById("gotClaimIssuerAddress").innerHTML = "claim issuer = " + data;
}

const addKeyInIdentity = async () =>{
var identity = document.getElementById("addOfIdentity").value;
const data1 = await window.contract.methods.getidentity(identity).call();

var claim = document.getElementById("addofClaim").value;
const data2 = await window.contract.methods.getClaimIssuer(claim).call();



var Abi;
await fetch('./abi/abiIdentity.json')
.then(response => response.json())
.then(data => {
    // Handle the retrieved JSON data
    Abi = data;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABI = Abi;
var contractAddress = data1;
window.web3 = await new Web3(window.ethereum);
window.contractIdentity = await new window.web3.eth.Contract(ABI, contractAddress);
console.log(window.contractIdentity.methods);
var key = await window.contractIdentity.methods.bytekey(claim).call();
console.log(key);
var status = await window.contractIdentity.methods.addKey(key,3,1).send({ from: account, gas: "10000000" });

document.getElementById("addkey").innerHTML = "claim power is given to the issuer with status : " + status.status;   
}

const addClaimInIdentity = async () =>{
var identity = document.getElementById("addrOfIdentity").value;
const data1 = await window.contract.methods.getidentity(identity).call();

var claim = document.getElementById("addrofClaim").value;
const data2 = await window.contract.methods.getClaimIssuer(claim).call();



var Abi;
await fetch('./abi/abiIdentity.json')
.then(response => response.json())
.then(data => {
    // Handle the retrieved JSON data
    Abi = data;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABI = Abi;
var contractAddress = data1;
window.web3 = await new Web3(window.ethereum);
window.contractIdentity = await new window.web3.eth.Contract(ABI, contractAddress);
// console.log(window.contractIdentity.methods);
// var key = await window.contractIdentity.methods.getKeysByPurpose(3).call();
var hash = await window.contractIdentity.methods.getsig(data1, 1,"0x000").call();
const sign = await ethereum.request({
method: 'personal_sign',
params: [hash, account],
});
console.log(sign);

var claimId = await window.contractIdentity.methods.addClaim(1,1,data2,sign,"0x000","0x000").send({ from: account, gas: "10000000" });
console.log(claimId.events.ClaimAdded.returnValues.claimId);
document.getElementById("addclaim").innerHTML = "claim is added by the issuer with id : " + claimId.events.ClaimAdded.returnValues.claimId;   



}
const  makeToken= async () => {
var owner = document.getElementById("OwnerAddress").value;
var name = document.getElementById("nameEvent").value;
var tokName = document.getElementById("tokenName").value;
var tokSymbol = document.getElementById("SymbolToken").value;
var Deci = document.getElementById("DecimalToken").value;
var Abi;
await fetch('./abi/factoryToken.json')
.then(response => response.json())
.then(data => {
    // Handle the retrieved JSON data
    Abi = data;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABI = Abi;
var contractAddress = factorytoken;
window.web3 = await new Web3(window.ethereum);
window.contractFactoryToken = await new window.web3.eth.Contract(ABI, contractAddress);
var data = await window.contractFactoryToken.methods.deployall(owner,name,tokName,tokSymbol,Deci,"0x0000000000000000000000000000000000000000").send({ from: account, gas: "10000000" });
console.log(data.events.ownerInfo.returnValues);
document.getElementById("createToken").innerHTML = "token is created with id : " + data.events.ownerInfo.returnValues.IdToken;
var d1 = await window.contractFactoryToken.methods.alldata(owner,data.events.ownerInfo.returnValues.IdToken).call();
console.log(d1.ctrImplementation);
    }

const  makeAgent= async () => {
var owner = document.getElementById("ownerForAgent").value;
var id = document.getElementById("idOfEventForAgent").value;
var agent = document.getElementById("agentAddress").value;
console.log(await account);
if(owner != account)
{
document.getElementById("giveAgentPower").innerHTML = `<p style="color:red;">caller and ower are not equal</p>`;
return;
}
document.getElementById("giveAgentPower").innerHTML = `<p>agent is been by this function for token</p>`;

var Abifactory;
await fetch('./abi/factoryToken.json')
.then(response => response.json())
.then(data => {
    // Handle the retrieved JSON data
    Abifactory = data;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABIfactory = Abifactory;
var contractAddressfactory = factorytoken;
window.web3 = await new Web3(window.ethereum);
window.contractFactoryToken = await new window.web3.eth.Contract(ABIfactory, contractAddressfactory);
var d1 = await window.contractFactoryToken.methods.alldata(owner,id).call();
console.log(d1.tokenImplementation);

var Abitoken;
await fetch('./abi/token.json')
.then(response => response.json())
.then(data => {
    // Handle the retrieved JSON data
    Abitoken = data;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABItoken = Abitoken;
var contractAddresstoken = d1.tokenImplementation;
window.web3 = await new Web3(window.ethereum);
window.contractToken = await new window.web3.eth.Contract(ABItoken, contractAddresstoken);
await window.contractToken.methods.grantRole("0xcab5a0bfe0b79d2c4b1c2e02599fa044d115b7511f9659307cb4276950967709",agent).send({ from: account, gas: "10000000" });
var role2 = await window.contractToken.methods.hasRole("0xcab5a0bfe0b79d2c4b1c2e02599fa044d115b7511f9659307cb4276950967709",agent).call();

var AbiIdentityReg;
await fetch('./abi/identityregistry.json')
.then(response => response.json())
.then(data4 => {
    // Handle the retrieved JSON data
    AbiIdentityReg = data4;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABIIdentityReg = AbiIdentityReg;
var contractAddressIdentityReg = d1.irImplementation;
window.web3 = await new Web3(window.ethereum);
window.contractIdentityReg = await new window.web3.eth.Contract(ABIIdentityReg,contractAddressIdentityReg );
await window.contractIdentityReg.methods.grantRole("0xcab5a0bfe0b79d2c4b1c2e02599fa044d115b7511f9659307cb4276950967709",agent).send({ from: account, gas: "10000000" });
var role1 = await window.contractIdentityReg.methods.hasRole("0xcab5a0bfe0b79d2c4b1c2e02599fa044d115b7511f9659307cb4276950967709",agent).call();

document.getElementById("giveAgentPower").innerHTML = "status ="+ role1;

}
const registerUser =async() =>{
var owner = document.getElementById("ownerTokenforRegistry").value;
var id = document.getElementById("idTokenforRegistry").value;
var recipient = document.getElementById("recipient").value;
var country = document.getElementById("countryCode").value;
var Abifactory;
await fetch('./abi/factoryToken.json')
.then(response => response.json())
.then(data => {
    // Handle the retrieved JSON data
    Abifactory = data;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABIfactory = Abifactory;
var contractAddressfactory =factorytoken;
window.web3 = await new Web3(window.ethereum);
window.contractFactoryToken = await new window.web3.eth.Contract(ABIfactory, contractAddressfactory);
var d1 = await window.contractFactoryToken.methods.alldata(owner,id).call();
var Abitoken;
await fetch('./abi/token.json')
.then(response => response.json())
.then(data => {
    // Handle the retrieved JSON data
    Abitoken = data;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABItoken = Abitoken;
var contractAddresstoken = d1.tokenImplementation;
window.web3 = await new Web3(window.ethereum);
window.contractToken = await new window.web3.eth.Contract(ABItoken, contractAddresstoken);
var role2 = await window.contractToken.methods.hasRole("0xcab5a0bfe0b79d2c4b1c2e02599fa044d115b7511f9659307cb4276950967709",account).call();
var AbiIdentityReg;
await fetch('./abi/identityregistry.json')
.then(response => response.json())
.then(data4 => {
    // Handle the retrieved JSON data
    AbiIdentityReg = data4;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABIIdentityReg = AbiIdentityReg;
console.log(ABIIdentityReg);
var contractAddressIdentityReg = d1.irImplementation;
console.log(contractAddressIdentityReg);
window.web3 = await new Web3(window.ethereum);
window.contractIdentityReg = await new window.web3.eth.Contract(AbiIdentityReg, contractAddressIdentityReg);
var role1 = await window.contractIdentityReg.methods.hasRole("0xcab5a0bfe0b79d2c4b1c2e02599fa044d115b7511f9659307cb4276950967709",account).call();
console.log(role1);	
console.log(role2);
if(role1 == "true" && role2 == "true")
{
document.getElementById("adduser").innerHTML = `<p style="color:red;">caller is not an agent</p>`;
return;
}
document.getElementById("adduser").innerHTML = `<p>user will be registered by this function </p>`;


const data1 = await window.contract.methods.getidentity(recipient).call();
console.log(data1);
console.log(await window.contractIdentityReg.methods);
var g1 = await window.contractIdentityReg.methods.registerIdentity(recipient,data1,country).send({ from: account, gas: "10000000" });

document.getElementById("adduser").innerHTML = "user registered ";

}

const  makeClaimIssuer = async () => {
var owner = document.getElementById("ownerForclaimIssuer").value;
var id = document.getElementById("idforClaimIssuer").value;
var issuer = document.getElementById("issuerAddress").value;
// console.log(await account);
if(owner != account)
{
document.getElementById("giveIssuerPower").innerHTML = `<p style="color:red;">caller and ower are not equal</p>`;
return;
}
document.getElementById("giveIssuerPower").innerHTML = `<p>issuer will be added by this function for token</p>`;
var Abifactory;
await fetch('./abi/factoryToken.json')
.then(response => response.json())
.then(data => {
    // Handle the retrieved JSON data
    Abifactory = data;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABIfactory = Abifactory;
var contractAddressfactory = factorytoken;
window.web3 = await new Web3(window.ethereum);
window.contractFactoryToken = await new window.web3.eth.Contract(ABIfactory, contractAddressfactory);
var d1 = await window.contractFactoryToken.methods.alldata(owner,id).call();
console.log(d1.tirImplementation);
var AbiclaimTopicRegistry;
await fetch('./abi/claimTopicregistry.json')
.then(response => response.json())
.then(data1 => {
    // Handle the retrieved JSON data
    AbiclaimTopicRegistry = data1;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABIclaimTopicRegistry = AbiclaimTopicRegistry;
var contractAddressclaimTopicRegistry = d1.ctrImplementation;
window.web3 = await new Web3(window.ethereum);
window.contractclaimTopicRegistry = await new window.web3.eth.Contract(ABIclaimTopicRegistry, contractAddressclaimTopicRegistry);
var a = await window.contractclaimTopicRegistry.methods.getClaimTopics().call();
console.log(a);
if(a.length == 0 ){
await window.contractclaimTopicRegistry.methods.addClaimTopic(1).send({ from: account, gas: "10000000" });
}



var AbiclaimRegistry;
await fetch('./abi/claimIssuerregistry.json')
.then(response => response.json())
.then(data1 => {
    // Handle the retrieved JSON data
    AbiclaimRegistry = data1;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABIclaimRegistry = AbiclaimRegistry;
var contractAddressclaimRegistry = d1.tirImplementation;
window.web3 = await new Web3(window.ethereum);
window.contractclaimTopicRegistry = await new window.web3.eth.Contract(ABIclaimRegistry, contractAddressclaimRegistry);
const d = await window.contract.methods.getClaimIssuer(issuer).call();
await window.contractclaimTopicRegistry.methods.addClaimIssuer(d,[1]).send({ from: account, gas: "10000000" });

document.getElementById("giveIssuerPower").innerHTML = "issuer registered ";


}
const  IsVerified = async () => {
var owner = document.getElementById("ownerForIsVerified").value;
var id = document.getElementById("idforIsVerified").value;
var user = document.getElementById("userAdddr").value;
var Abifactory;
await fetch('./abi/factoryToken.json')
.then(response => response.json())
.then(data => {
    // Handle the retrieved JSON data
    Abifactory = data;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABIfactory = Abifactory;
var contractAddressfactory = factorytoken;
window.web3 = await new Web3(window.ethereum);
window.contractFactoryToken = await new window.web3.eth.Contract(ABIfactory, contractAddressfactory);
var d1 = await window.contractFactoryToken.methods.alldata(owner,id).call();
var AbiIdentityReg;
await fetch('./abi/identityregistry.json')
.then(response => response.json())
.then(data4 => {
    // Handle the retrieved JSON data
    AbiIdentityReg = data4;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABIIdentityReg = AbiIdentityReg;
var contractAddressIdentityReg = d1.irImplementation;
window.web3 = await new Web3(window.ethereum);
window.contractIdentityReg = await new window.web3.eth.Contract(ABIIdentityReg,contractAddressIdentityReg );
var role1 = await window.contractIdentityReg.methods.isVerified(user).call();

document.getElementById("IsVerified").innerHTML = "status ="+ role1;

}

const  mintToken= async () => {
var owner = document.getElementById("ownerTokenforMint").value;
var id = document.getElementById("idTokenforMint").value;
var recipient = document.getElementById("recipientOfToken").value;
var amt = document.getElementById("amountMint").value;
var Abi;
await fetch('./abi/factoryToken.json')
.then(response => response.json())
.then(data => {
    // Handle the retrieved JSON data
    Abi = data;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABI = Abi;
var contractAddress = factorytoken;
window.web3 = await new Web3(window.ethereum);
window.contractFactoryToken = await new window.web3.eth.Contract(ABI, contractAddress);
var d1 = await window.contractFactoryToken.methods.alldata(owner,id).call();
var Abitoken;
await fetch('./abi/token.json')
.then(response => response.json())
.then(data1 => {
    // Handle the retrieved JSON data
    Abitoken = data1;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABItoken = Abitoken;
var contractAddresstoken = d1.tokenImplementation;
window.web3 = await new Web3(window.ethereum);
window.contractToken = await new window.web3.eth.Contract(ABItoken, contractAddresstoken);
await window.contractToken.methods.mint(recipient,amt).send({ from: account, gas: "10000000" });
document.getElementById("mint").innerHTML = "token minted";
}


const  checkBalance= async () => {
var owner = document.getElementById("ownerTokenforbal").value;
var id = document.getElementById("idTokenforbal").value;
var recipient = document.getElementById("recipientOfTokenforBal").value;

var Abi;
await fetch('./abi/factoryToken.json')
.then(response => response.json())
.then(data => {
    // Handle the retrieved JSON data
    Abi = data;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABI = Abi;
var contractAddress = factorytoken;
window.web3 = await new Web3(window.ethereum);
window.contractFactoryToken = await new window.web3.eth.Contract(ABI, contractAddress);
var d1 = await window.contractFactoryToken.methods.alldata(owner,id).call();
var Abitoken;
await fetch('./abi/token.json')
.then(response => response.json())
.then(data1 => {
    // Handle the retrieved JSON data
    Abitoken = data1;
})
.catch(error => {
    console.error('Error loading JSON file:', error);
});

var ABItoken = Abitoken;
var contractAddresstoken = d1.tokenImplementation;
window.web3 = await new Web3(window.ethereum);
window.contractToken = await new window.web3.eth.Contract(ABItoken, contractAddresstoken);
var context = 	await window.contractToken.methods.balanceOf(recipient).call();
console.log(context);
document.getElementById("checkBal").innerHTML = "balance = " + context;
}