const generateRamdonString = function(length){
    let ramdonString = '';
    const possibleChars = "ABCDEFGHIJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuvwxyz0123456789"; 

    for(let i = 0; i < length; i++){
        ramdonString += possibleChars.charAt(
            Math.floor(Math.random()*possibleChars.length)
        );
    }

    return ramdonString; 
}

module.exports = generateRamdonString; 