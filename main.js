let inputArr = process.argv.slice(2);
console.log(inputArr);
let fs = require("fs");
let path=require("path");
let command = inputArr[0];

let types = {
    media: ["mp4", "mkv"],
    archives: ['zip','7z','rar','tar','gz','ar','iso',"xz"],
    documents: ['docx','doc','pdf','xlsx','xls','odt','odp','odg','odf','txt','ps','tex'],
    app: ['exe','dmg','pkg',"deb"]
}

switch(command)
{
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organise" :
        organiseFn(inputArr[1]);
        break;
    case "help"   :
        helpFn() ;
        break;
    default:
        console.log("Please input right commands");
        break;       
}

function treeFn(dirPath){
    //let destPath;
    if(dirPath==undefined)
    {
        console.log("Kindly enter the path");
        return;
    } 
    
    else {
        let doesExist= fs.existsSync(dirPath);

        if(doesExist){
          treeHelper(dirPath, "");
        }

        else {
            console.log("Kindly enter the correct path");
            return;
        }
    }
}

function treeHelper(dirPath, indent){
   let isFile = fs.lstatSync(dirPath).isFile();
   if(isFile==true){
       let fileName = path.basename(dirPath);
       console.log(indent + "|__"+fileName);
   } else {
       let dirName=path.basename(dirPath);
       console.log(indent+"\__"+dirName);
       let children=fs.readdirSync(dirPath);
       for(let i=0;i<children.length;i++){
           let childPath=path.join(dirPath,children[i]);
           treeHelper(childPath,indent+"\t");
       }
   }
   
}

function organiseFn(dirPath){
    let destPath;
       if(dirPath==undefined)
       {
           console.log("Kindly enter the path");
           return;
       } 
       
       else {
           let doesExist= fs.existsSync(dirPath);

           if(doesExist){
              destPath=path.join(dirPath,"organised_Files");
             if(fs.existsSync(destPath)==false)
             {fs.mkdirSync(destPath);}
           }

           else {
               console.log("Kindly enter the correct path");
               return;
           }
       }
      organiseHelper(dirPath,destPath);
}

function organiseHelper(src,dest){

    let childNames = fs.readdirSync(src);
    for(let i=0;i<childNames.length;i++){
        let childAddress = path.join(src,childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            // console.log(childNames[i]);
        let category=getCategory(childNames[i]);
        console.log(childNames[i],"belongs to -->",category);
        sendFiles(childAddress,dest,category);
        }
    }
}

function sendFiles(srcFilePath,dest,category){
    let categoryPath=path.join(dest,category);
    if(fs.existsSync(categoryPath)==false){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath,fileName);
    fs.copyFileSync(srcFilePath,destFilePath);
    fs.unlinkSync(srcFilePath);
    console.log(fileName,"copied to",category);
}

function getCategory(name){
 let ext=path.extname(name);
 ext=ext.slice(1);
 for(let type in types){
     let cTypeArray=types[type];
     for(let i=0;i<cTypeArray.length;i++)
     {
         if(ext==cTypeArray[i])
         return type;
     }
 }
 return "others";
}


//help done
function helpFn(){
    console.log(`
    List of All the commands:
          node main.js tree "directoryPath"
          node main.js organise "directoryPath"
          node main.js help
              `)
}
