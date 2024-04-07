import React,{useState} from 'react'
import './FileUploader.css'
import { LiaTimesSolid } from "react-icons/lia";
import { LuFilePlus2 } from "react-icons/lu";
import { BsFileEarmark } from "react-icons/bs";

const FileUploader = () => {
  const [files,setFiles] = useState([]);

  const fileExist = (file)=>{
    if(file){
      const result = Array.from(files).filter((f)=>f.name === file.name);
      if(result?.length){
        return true;
      }
      return false;
    }
  } 


  const validExtensions = (file) =>{
    if(
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg' ||
      file.type === 'application/pdf' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'){
       return true;
     }
     return false;
   }

  const validFileSize = (file,maxSizeMb) =>{
    let maxfilesize_in_mb = maxSizeMb || 100,  // 100 Mb
    filesize    = file.size,
    filesize_in_mb = Math.round(filesize / 1048576);
    if (filesize_in_mb > maxfilesize_in_mb){
      return false;
    }
    return true;
  }



  const handleFileDrop = (event) =>{
    event.preventDefault();
    let droppedFiles = event.dataTransfer.files;
    let validFiles = []
    for(let i=0;i<droppedFiles.length;i++){
        if(!fileExist(droppedFiles[i])){
            if(validExtensions(droppedFiles[i])){
               if(validFileSize(droppedFiles[i],25)){
                 validFiles.push(droppedFiles[i])
               }else{
                alert(`${droppedFiles[i].name} has invalid file size. maximum file size is 25mb.`)
              }
            }
            else{
              alert(`${droppedFiles[i].name} does not have a valid file extension`)
            }
        }
    }
    setFiles([...files,...validFiles]);
  }


  const handleFileInput = (event)=>{
    const selectedFiles = event?.target?.files;
    let validFiles = []
    for(let i=0;i<selectedFiles.length;i++){
       if(!fileExist(selectedFiles[i])){
        if(validExtensions(selectedFiles[i])){
          if(validFileSize(selectedFiles[i],25)){
                validFiles.push(selectedFiles[i])
            }else{
              alert(`${selectedFiles[i].name} has invalid file size. maximum file size is 25mb.`)
            }
        }
        else{
          alert(`${selectedFiles[i].name} does not have a valid file extension`)
        }
      }
    }
    setFiles([...files,...validFiles]);
}


const handleFileDelete =(fileName)=>{
  const newFilesAfterDelete = Array.from(files)?.filter((file) =>  file?.name !== fileName);
  return setFiles([...newFilesAfterDelete])
}


const isImage = (file)=> {
  return file && file['type'].split('/')[0] === 'image';
}
function toBytes(sizeInBytes){
  const names = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let count = 0, size = parseInt(sizeInBytes, 10) || 0;
  while(size >= 1024 && ++count){
      size = size/1024;
  }
  return(size.toFixed(size < 10 && count > 0 ? 1 : 0) + ' ' + names[count]);
}



 console.log("Files:",files)

  return (
    <div className='file__uploader__container'>
        <div className="top">
             <h3 className="title">Upload</h3>
        </div>
        <div className="middle">
           <label className="file__drop__area" onDrop={handleFileDrop} onDragOver={handleFileDrop}>
                <LuFilePlus2 className="text__muted icon"/>
                <p className='description'>Drop your file(s) here or <span className='color__primary'>browse</span></p>
                <p className="text__muted">Max. file size 25 MB</p>
                <input type="file" onChange={handleFileInput} accept='.png,.jpeg,.jpg,.pdf,.doc,.docx' multiple/> 
           </label>
           <div className="preview__area">
              {
                Array.from(files).reverse().map((file,index)=>(
                   <div className="preview__card" key={index}>
                       <div className="column avater">
                        {
                          isImage(file) ? <img src={URL.createObjectURL(file)} /> :
                          <BsFileEarmark/>
                        }
                       </div>
                       <div className="column">
                          <p className="name">{file.name}</p>
                          <p className="text__muted size">{toBytes(file.size)}</p>
                       </div>
                       <div className="column last">
                         <LiaTimesSolid className='icon cancel__icon' onClick={()=>handleFileDelete(file.name)}/>
                       </div>
                   </div>
                ))
              }
           </div>
        </div>
        <div className="bottom">
            <button className='btn'>Cancel</button>
            <button className='btn btn__primary'>Save</button>
        </div>
    </div>
  )
}

export default FileUploader
