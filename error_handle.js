const errhandle= (status,message)=>{
    
    const err = new Error()
    err.status = status;
    err.msg= message;
    return err
}

module.exports = errhandle