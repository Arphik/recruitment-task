
export function connectToOrigin(url){
    try{
        return fetch(url);
    }catch(error){
        console.log("There was a connection error: ", error);
    }
}