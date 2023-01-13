
var gioco; //inizializzata nella begin(). conterrà l'oggetto game


function game(){ //oggetto game
	this.numCells = 9*9; //totale celle
	this.numMines = 10; //totale mine
	this.cells = new Array(); //array di cell
	this.playground = document.getElementById('Playground');
	this.ore = 0;
	this.minuti = 0;
	this.secondi = Number(0);
	this.flags = 0; //numero di bandierine posizionate
	this.numShown = 0;
	this.time = setInterval("gioco.timer()", 1000);
}



function cell(){ //oggetto cell
	this.shown = false; //inizialmente una cella non viene mostrata
	this.mina = false; //true mina, false cella
	this.flag = false; //true quando l'utente posiziona la bandierina
}


cell.prototype.neighbors = function(id){ //funzione che conta il numero di mine vicine
	var howManyMines = 0;
	for(var i=0; i<gioco.numCells; i++){
		var lato = id%9;
		if(gioco.cells[i].mina===true && lato!=0 && lato!=8 && (id%9-i%9)<=1 && (id%9-i%9)>=-1 && i<=id+10 && i>=id-10)
			howManyMines++;
		 if(gioco.cells[i].mina===true && lato==0 && (id%9-i%9)<=0 && (id%9-i%9)>=-1 && i<=id+10 && i>=id-10)
			howManyMines++;
		if(gioco.cells[i].mina===true && lato==8 && (id%9-i%9)<=1 && (id%9-i%9)>=0 && i<=id+10 && i>=id-10)
			howManyMines++;
	}
	return howManyMines;
}


cell.prototype.show_cell = function(id){ //funzione che mostra la tipologia della cella
	
	if(gioco.cells[id].shown===true) //cella già scoperta, termina
			return;

	var vicini = gioco.cells[id].neighbors(id); //scopre la cella
	document.getElementById('cell'+id).setAttribute('class','type'+vicini); 
	gioco.cells[id].shown = true;
	gioco.numShown++;
	
	if(vicini!=0) //scopre la cella e termina
		return;

	if(id%9!=8 && id+1<81 && gioco.cells[id+1].shown===false && gioco.cells[id+1].mina===false){
		if(gioco.cells[id+1].neighbors(id+1)==0)
			gioco.cells[id+1].show_cell(id+1);
		else{
			document.getElementById('cell'+(id+1)).setAttribute('class','type'+gioco.cells[id+1].neighbors(id+1));
			gioco.cells[id+1].shown = true;
			gioco.numShown++;
		}
	}

	if(id%9!=0 && id-1>=0 && gioco.cells[id-1].shown===false && gioco.cells[id-1].mina===false){
		if(gioco.cells[id-1].neighbors(id-1)==0)
			gioco.cells[id-1].show_cell(id-1);
		else{
			document.getElementById('cell'+(id-1)).setAttribute('class','type'+gioco.cells[id-1].neighbors(id-1));
			gioco.cells[id-1].shown = true;
			gioco.numShown++;
		}
	}

	for(var i=id-10; i<id-7; i++){
		if(i>=0 && (id%9-i%9)<=1 && (id%9-i%9)>=-1 && gioco.cells[i].shown===false){
			if(gioco.cells[i].neighbors(i)==0)
				gioco.cells[i].show_cell(i);
			else{
				document.getElementById('cell'+(i)).setAttribute('class','type'+gioco.cells[i].neighbors(i));
				gioco.cells[i].shown = true;
				gioco.numShown++;
			}
		}
		if(i+18<81 && (id%9-(i+18)%9)<=1 && (id%9-(i+18)%9)>=-1 && gioco.cells[i+18].shown===false){
			if(gioco.cells[i+18].neighbors(i+18)==0)
				gioco.cells[i+18].show_cell(i+18);
			else{
				document.getElementById('cell'+(i+18)).setAttribute('class','type'+gioco.cells[i+18].neighbors(i+18));
				gioco.cells[i+18].shown = true;
				gioco.numShown++;
			}

		}
	}
}

function new_flag(cell_num){ //funzione per posizionare o eliminare la bandierina
	if(gioco.cells[cell_num].shown===false){
		var cella = document.getElementById('cell'+cell_num);
		if(gioco.cells[cell_num].flag === false && gioco.flags<gioco.numMines){
			cella.setAttribute('class','flag');
			gioco.cells[cell_num].flag = true;
			gioco.flags++;
		}
		else if(gioco.cells[cell_num].flag === true){
			cella.setAttribute('class','cella');
			gioco.cells[cell_num].flag = false;
			gioco.flags--;
		}
		document.getElementById("Info_Bandiere").innerHTML=gioco.flags;
		document.getElementById("Info_Mine").innerHTML=gioco.numMines-gioco.flags;
	}
}



function cellClick(event,i){

	//alert("ciao "+i); test event onmousedown

	if(event.button===0)//tasto sinistro
	{
		if(gioco.cells[i].flag===true)
			return;
		if(gioco.cells[i].mina===true)
			gameOver();
		else gioco.cells[i].show_cell(i);


		if(gioco.numShown==(gioco.numCells-gioco.numMines))
			win();

	}
	else if(event.button===2){
		new_flag(i);
	}
	else{}
		

}

function handler(event){ //disabilita il menu' a tendina che di default si apre con il click destro del mouse
	event.preventDefault();
}


function begin(){ //funzione di inizializzazione del campo di gioco e delle mine

	gioco = new game();

	document.getElementById("Playground").setAttribute('oncontextmenu', "handler(event)");

	document.getElementById("Info_Bandiere").innerHTML=0;
	document.getElementById("Info_Mine").innerHTML=gioco.numMines;

	for(var i = 0; i<gioco.numCells; i++){

		var new_cell = new cell();

		gioco.cells.push(new_cell);

		var cellNode = document.createElement('div');
		cellNode.setAttribute('id','cell'+i);
		cellNode.setAttribute('class','cella');
		cellNode.setAttribute('onmousedown', "cellClick(event,"+i+")");
		gioco.playground.appendChild(cellNode);

	}

	for(var i=0; i<gioco.numMines; i++){

		var index = getRandomIntInclusive(0,80);

		if(gioco.cells[index].mina===false){
			gioco.cells[index].mina=true;
			var cella = document.getElementById('cell'+index);
			//cella.setAttribute('class','mina'); //test, mostra la mina
		}
		else {i--}
	}

// test per mostrare la quantità di mine vicine e la loro posizione
/* 

	for(var i=0; i<gioco.numCells; i++){
		if(gioco.cells[i].mina !== true)
			document.getElementById('cell'+i).setAttribute('class','type'+gioco.cells[i].neighbors(i));
	}

*/
}

function play(){ //gestione del bottone play


	for(var i=gioco.numCells-1;i>=0; i--)
		document.getElementById('cell'+i).remove();
	clearInterval(gioco.time);

	close_popUp();
	
	begin();
}