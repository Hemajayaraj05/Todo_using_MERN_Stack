import React from "react";
import { useState } from "react";
import {Toaster,Intent} from "@blueprintjs/core"
const AppToaster=Toaster.create({position:"top"})
export default function Todo(){
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [error,setError]=useState("");
    const [todos,setTodos]=useState([]);
    const apiURL="http://localhost:3000";
   
     const handleSubmit=()=>{
      setError("");
      if(title.trim()!==' ' && description.trim()!=='')
      {
         fetch(apiURL+"/todos",{
          method:"POST",
          headers:{
            "Content-type":'application/json'
          },
          body:JSON.stringify({title,description})
         }).then((res)=>{
          if(res.ok)
          {
            setTodos([...todos,{title,description}])
            AppToaster.show({
              message:"Item Created SuccessFully",
              intent:Intent.SUCCESS,
            })
            
          }else{
            setError("Unable to create a Todo Item");
           
          }

         }).catch(()=>{
          setError("Unable to create a Todo Item");
         })
         
      }
        
     }





    return <>
      <div className="row p-3 bg-success text-light">
        <h1>ToDo Project Using Mern-Stack</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
       
            <div className="form-group d-flex gap-2">
                <input placeholder="Title" value={title} className="form-control " onChange={(e)=>setTitle(e.target.value)} type="text" />
                <input placeholder="Description" value={description} className="form-control " onChange={(e)=>setDescription(e.target.value)} type="text" />
                <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
            {error && <p className="text-danger">{error}</p>}
        </div>

    </>
}