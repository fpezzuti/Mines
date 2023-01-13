function getRandomIntInclusive(min, max) { //funzione di utilità
 	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso 
}


game.prototype.timer = function(){

	if(this.secondi===60){
		if(this.minuti===60){
			this.ore+=1;
			this.minuti=0;
		}
		else{
			this.minuti+=1;
			this.secondi=0;
		}
	}
	else 
		this.secondi+=1;

	document.getElementById("Info_Tempo").innerHTML=this.ore+":"+this.minuti+":"+this.secondi;

}