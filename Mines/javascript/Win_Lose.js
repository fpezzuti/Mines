
function close_popUp(){

	var popUp = document.getElementById('pop_up');
	if (popUp === null)
		return;
	
	document.body.removeChild(popUp);
}

function create_popUp(type){ //1 win, 0 gameover

	for(var i=0; i<gioco.numCells; i++){
		document.getElementById('cell'+i).removeAttribute("onmousedown");
	}

	var text = (type==1) ? "Hai vinto, complimenti!" : "Hai perso, riprova";

	var popUp = document.createElement('div');
	popUp.setAttribute('id', 'pop_up');


	var close_button = document.createElement('div');
	close_button.setAttribute('class', 'close_button');
	close_button.setAttribute('onClick', "close_popUp()");
	popUp.appendChild(close_button);

	var content = document.createTextNode(text);
	popUp.appendChild(content);

	document.body.appendChild(popUp);

}

function gameOver(){

	for(var i=0; i<gioco.numCells; i++){
		if(gioco.cells[i].mina !== true)
			document.getElementById('cell'+i).setAttribute('class','type'+gioco.cells[i].neighbors(i));
		else
			document.getElementById('cell'+i).setAttribute('class', 'mina');
	}

	create_popUp(0);
	clearInterval(gioco.time);
}

function win(){

	create_popUp(1);
	clearInterval(gioco.time);



}